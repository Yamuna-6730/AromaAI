from .model import predict_compounds
from .rules import apply_rules
from .rag import retrieve_similar
from .llm import extract_user_data, generate_agent_response, generate_explanation

user_states = {}


def run_agent(message: str, session_id: str):
    # ---------------------------
    # INIT USER STATE
    # ---------------------------
    if session_id not in user_states:
        user_states[session_id] = {
            "stage": "collecting",
            "profile": {
                "symptoms": [],
                "preferences": [],
                "notes": [],
                "usage": [],
                "allergies": [],
                "intensity_preference": "medium",
            },
            "compounds": None,
            "rag_context": [],
            "confidence_score": 0.0,
            "history": []
        }

    # Ensure state is a dict and has expected keys
    state = user_states[session_id]
    if not isinstance(state, dict):
        return {"message": "State error", "stage": "error", "actions": []}

    # ---------------------------
    # DYNAMIC UNDERSTANDING
    # ---------------------------
    profile_data = state.get("profile")
    history = state.get("history")
    
    if not isinstance(profile_data, dict) or not isinstance(history, list):
        return {"message": "Profile error", "stage": "error", "actions": []}
    
    history.append({"role": "user", "content": message})

    # AI logic handles extraction into any user detail (allergies, symptoms, etc.)
    extracted = extract_user_data(message, profile_data)
    
    # Merge extracted data
    for key in ["symptoms", "preferences", "notes", "usage", "allergies"]:
        current_list = profile_data.get(key)
        if isinstance(current_list, list):
            profile_data[key] = list(set(current_list + extracted.get(key, [])))
    
    if extracted.get("intensity_preference"):
        profile_data["intensity_preference"] = extracted["intensity_preference"]

    # ---------------------------
    # STATE MACHINE LOGIC
    # ---------------------------
    actions = []
    stage = str(state.get("stage", "collecting"))
    
    # 1. Determine Stage Transitions
    if stage == "collecting":
        has_prefs = bool(profile_data.get("preferences") or profile_data.get("notes"))
        has_needs = bool(profile_data.get("symptoms") or profile_data.get("usage"))
        if has_prefs and has_needs:
            stage = "ready"
            state["stage"] = "ready"
    
    # New: Finalization transition
    if stage == "generated":
        finalize_keywords = ["finalize", "finalise", "approve", "good", "perfect", "save this"]
        if any(keyword in message.lower() for keyword in finalize_keywords):
            stage = "finalized"
            state["stage"] = "finalized"
    
    # 2. RAG GROUNDING
    rag_matches, confidence = retrieve_similar(profile_data)
    state["rag_context"] = rag_matches
    state["confidence_score"] = confidence

    # 3. GENERATION CONTROL
    needs_calc = False
    if stage == "ready":
        needs_calc = True
    elif stage == "editing":
        needs_calc = True

    if needs_calc:
        compounds = predict_compounds(profile_data)
        safe_compounds = apply_rules(profile_data, compounds)
        state["compounds"] = safe_compounds
        stage = "generated"
        state["stage"] = "generated"

    # ---------------------------
    # AI REASONING & OUTPUT
    # ---------------------------
    ai_message = generate_agent_response(state, message)
    
    # ---------------------------
    # FINAL ACTIONS MAPPING
    # ---------------------------
    if stage == "collecting":
        actions = []
    elif stage == "ready":
        actions = ["generate"]
    elif stage == "generated":
        actions = ["finalize", "modify"]
        if "GENERATE_COMPOSITION" in ai_message or needs_calc:
            ai_message = generate_explanation(profile_data, state.get("compounds"), state.get("rag_context"))
    elif stage == "finalized":
        actions = ["save", "modify"]
    elif stage == "saved":
        actions = ["buy"]

    history.append({"role": "assistant", "content": ai_message})

    return {
        "message": ai_message,
        "stage": stage,
        "actions": actions,
        "composition": state.get("compounds"),
        "profile_summary": profile_data,
        "confidence_score": state.get("confidence_score", 0.0),
        "rag_matches": state.get("rag_context", [])
    }