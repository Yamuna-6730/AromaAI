from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# ---------------------------
# SAFE GENERATION WRAPPER
# ---------------------------
def generate_text(prompt: str):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print("LLM ERROR:", e)
        return ""


# ---------------------------
# EXTRACT USER DATA
# ---------------------------
def extract_user_data(message: str, current_state: dict):

    prompt = f"""
Extract fragrance info from user input.

User input:
"{message}"

Understand natural language:
- "rose vibe" → floral + rose
- "fresh like rain" → fresh
- "headache from perfumes" → symptom + low intensity

Return ONLY JSON:

{{
  "symptoms": [],
  "preferences": [],
  "notes": [],
  "intensity_preference": "low | medium | high",
  "usage": []
}}
"""

    text = generate_text(prompt)

    try:
        if "```" in text:
            text = text.split("```")[1].replace("json", "").strip()

        return json.loads(text)

    except:
        return {
            "symptoms": [],
            "preferences": [],
            "notes": [],
            "intensity_preference": "",
            "usage": []
        }


# ---------------------------
# FINAL PERFUME RESPONSE
# ---------------------------
def generate_explanation(profile, compounds, rag_context):
    prompt = f"""
You are AromaAI, a friendly fragrance expert.

User profile:
Symptoms: {profile.get('symptoms')}
Preferences: {profile.get('preferences')}
Notes: {profile.get('notes')}
Usage: {profile.get('usage')}
Intensity: {profile.get('intensity_preference', 'medium')}

Here are similar real cases:
{json.dumps(rag_context, indent=2)}

Use this data to make better recommendations.
Do NOT hallucinate.

Composition:
{json.dumps(compounds)}

Rules:
- Keep under 140 words
- Conversational + simple
- Include percentages clearly
- Explain WHY it suits them
- Mention their notes/preferences
- Do NOT ask any follow-up questions
- Do NOT ask for user details like name, email, or phone

Tone: friendly, slightly premium, not robotic
"""


    return generate_text(prompt)



# ---------------------------
# MAIN AGENT RESPONSE
# ---------------------------
def generate_agent_response(state, last_message):
    history = state.get("history", [])
    profile = state.get("profile", {})
    rag_context = state.get("rag_context", [])
    stage = state.get("stage", "collecting")

    # Format history for prompt
    history_text = "\n".join([f"{m['role'].capitalize()}: {m['content']}" for m in history[-6:]])

    prompt = f"""
You are AromaAI, a professional fragrance consultant.

Conversation History:
{history_text}

3. Generate composition ONLY when needed
4. NEVER repeat generation unnecessarily

----------------------------------
🧩 STATES (CRITICAL LOGIC)
----------------------------------

The system has states:

- collecting → gathering preferences
- ready → enough info to generate
- generated → composition already created
- finalized → saved to profile

----------------------------------
🚫 IMPORTANT RULE
----------------------------------

If composition is already generated:

DO NOT generate again.

Instead respond like:

"Glad you liked it 😊  
Would you like to tweak it or finalize it?"

----------------------------------
📊 WHEN TO GENERATE COMPOSITION
----------------------------------

ONLY generate if:

- user has given:
  → at least one preference OR note
  AND
  → symptoms OR usage

----------------------------------
📊 GENERATION RULES
----------------------------------

When generating:

1. Use RAG context strictly
2. Avoid hallucination
3. Keep realistic compound values

Structure:

- short intro
- composition with %
- simple explanation
- end with:

"How does this feel? Want to tweak it or finalize?"

----------------------------------
🛍️ AFTER GENERATION
----------------------------------

DO NOT ask:
- name
- email
- phone

UI will handle it.

----------------------------------
✏️ EDITING MODE
----------------------------------

If user asks for changes:

Respond conversationally and adjust:

Examples:
- lighter → reduce strong compounds
- stronger → increase projection
- citrus → shift notes

----------------------------------
👥 MULTI-USER MODE
----------------------------------

If user says:
"for my friend"

Then:

Start fresh profile:
"Got it — let’s design one for them. What kind of scent do they like?"

----------------------------------
📊 RAG USAGE
----------------------------------

You will receive similar cases.

Use them to:
- justify choices
- avoid unrealistic compositions

----------------------------------
💬 STYLE
----------------------------------

- conversational
- friendly
- slightly premium
- NOT robotic
- NOT long paragraphs

----------------------------------
FINAL RULE:
Think before responding.
Do not blindly generate.
----------------------------------
"""

    return generate_text(prompt)