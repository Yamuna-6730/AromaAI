from fastapi import APIRouter, HTTPException
from schemas.user_profile import ChatRequest, ChatResponse, SaveProfileRequest, SaveProfileResponse, UserProfile, CompoundProfile, CreateOrderRequest, CreateOrderResponse
from services.agent import run_agent, user_states
from services.supabase_client import supabase
import uuid
import math
import numpy as np

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    # 1. Ensure user exists in the public schema
    if supabase:
        try:
            supabase.table("users").upsert({"id": request.session_id}).execute()
            
            # 2. Get or Create a session for this user
            # We use the session_id from the frontend as a user_id
            # For simplicity, we create one default active session per user for now
            res = supabase.table("chat_sessions").select("id").eq("user_id", request.session_id).order("created_at", desc=True).limit(1).execute()
            
            if not res.data:
                res = supabase.table("chat_sessions").insert({"user_id": request.session_id, "title": "Fragrance Consultation"}).execute()
            
            db_session_id = res.data[0]["id"]
            
            # 3. Store the user's message
            supabase.table("chat_messages").insert({
                "session_id": db_session_id,
                "role": "user",
                "content": request.message
            }).execute()
        except Exception as e:
            print(f"History logging failed (pre-chat): {e}")

    # run_agent now returns the mandatory structured dict
    response_data = run_agent(request.message, request.session_id)
    
    # 4. Store the assistant's response
    if supabase:
        try:
            # Re-fetch the session id if it failed before
            res = supabase.table("chat_sessions").select("id").eq("user_id", request.session_id).order("created_at", desc=True).limit(1).execute()
            if res.data:
                db_session_id = res.data[0]["id"]
                
                # Sanitize response_data for JSONB storage
                meta = sanitize_data(response_data.copy())
                
                supabase.table("chat_messages").insert({
                    "session_id": db_session_id,
                    "role": "assistant",
                    "content": response_data.get("message", ""),
                    "metadata": meta
                }).execute()
        except Exception as e:
            print(f"History logging failed (post-chat): {e}")

    return ChatResponse(**response_data)


def sanitize_data(data):
    """
    Recursively replaces NaN/Inf values with 0.0 to ensure JSON compliance.
    """
    if isinstance(data, dict):
        return {k: sanitize_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_data(v) for v in data]
    elif isinstance(data, float):
        if math.isnan(data) or math.isinf(data):
            return 0.0
        return data
    elif isinstance(data, (np.float32, np.float64)):
        if np.isnan(data) or np.isinf(data):
            return 0.0
        return float(data)
    return data


@router.post("/save-profile", response_model=SaveProfileResponse)
def save_profile(request: SaveProfileRequest):
    # 1. Fetch state
    state = user_states.get(request.session_id)
    if not state or not isinstance(state, dict):
        raise HTTPException(status_code=400, detail="Session state not found")

    compounds = state.get("compounds")
    profile = state.get("profile")
    rag_context = state.get("rag_context", [])

    if not compounds or not profile:
        raise HTTPException(status_code=400, detail="No composition found to save for this session.")

    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized. Check your environment variables.")

    comp_id = None
    
    try:
        # 1. Upsert simple object to users with session_id
        supabase.table("users").upsert({"id": request.session_id}).execute()

        # 2. Insert or update profiles table
        # We use a custom title if provided
        profile_data = {
            "user_id": request.session_id,
            "title": request.title,
            "symptoms": profile.get("symptoms", []),
            "preferences": profile.get("preferences", []),
            "notes": profile.get("notes", []),
            "allergies": profile.get("allergies", []),
            "intensity_preference": profile.get("intensity_preference", "medium"),
            "rag_context": rag_context
        }
        
        # 3. Insert composition into compositions table
        # We also store the profile data within the composition for history
        comp_data = compounds.copy()
        comp_data["user_id"] = request.session_id
        comp_data["title"] = request.title
        comp_data["profile_snapshot"] = profile_data
        
        # Sanitize data before sending to Supabase to avoid NaN JSON error
        comp_data = sanitize_data(comp_data)
        
        res = supabase.table("compositions").insert(comp_data).execute()
        
        if res.data and len(res.data) > 0 and "id" in res.data[0]:
            comp_id = res.data[0]["id"]
            state["stage"] = "saved" # Successfully saved
        else:
            comp_id = f"mock-{uuid.uuid4().hex[:8]}"

    except Exception as e:
        print(f"Error saving to Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    return SaveProfileResponse(success=True, composition_id=comp_id)


@router.post("/create-order", response_model=CreateOrderResponse)
def create_order(request: CreateOrderRequest):
    if not supabase:
        print(f"Mock created order for user: {request.user_id}")
        return CreateOrderResponse(success=True, order_id=f"ord-{uuid.uuid4().hex[:8]}")
    
    try:
        order_data = {"user_id": request.user_id, "composition_id": request.composition_id}
        res = supabase.table("orders").insert(order_data).execute()
        order_id = res.data[0]["id"] if (res.data and len(res.data) > 0 and "id" in res.data[0]) else f"ord-{uuid.uuid4().hex[:8]}"
        return CreateOrderResponse(success=True, order_id=order_id)
    except Exception as e:
        print(f"Failed to create order: {e}")
        return CreateOrderResponse(success=False)


@router.get("/get-profiles", response_model=list[ChatResponse])
def get_profiles(session_id: str):
    if not supabase:
        # Mock data for demonstration if DB is not wired
        return [
            ChatResponse(
                message="Your custom blend for focus",
                stage="saved",
                actions=["buy", "modify"],
                composition=CompoundProfile(
                    iso_e_super=40,
                    hedione=30,
                    galaxolide=20,
                    ambroxan=10,
                    vanillin=0,
                    ethanol=0,
                    linalool=0,
                    limonene=0,
                    geraniol=0
                ),
                profile_summary={
                    "symptoms": ["stress", "fatigue"],
                    "preferences": ["citrus", "woody"],
                    "notes": ["oceanic"],
                    "allergies": [],
                    "intensity": "high",
                    "usage": ["work"]
                },
                confidence_score=0.98,
                rag_matches=[]
            )
        ]

    try:
        # Fetch from compositions table linked to user_id (session_id)
        res = supabase.table("compositions").select("*").eq("user_id", session_id).order("created_at", desc=True).execute()
        
        profiles = []
        for row in res.data:
            # Map DB row back to ChatResponse format
            comp_data = {k: v for k, v in row.items() if k in ["iso_e_super", "hedione", "galaxolide", "ambroxan", "vanillin", "ethanol", "linalool", "limonene", "geraniol"]}
            
            profiles.append(ChatResponse(
                message=f"Saved fragrance: {row.get('title', 'Unnamed')}",
                stage="saved",
                actions=["buy", "modify"],
                composition=CompoundProfile(**comp_data),
                profile_summary=row.get("profile_snapshot", {}),
                confidence_score=0.95,
                rag_matches=[]
            ))
        return profiles
    except Exception as e:
        print(f"Error fetching profiles: {e}")
        return []

@router.get("/get-sessions", response_model=list[dict])
def get_sessions(user_id: str):
    if not supabase:
        return []
    try:
        res = supabase.table("chat_sessions").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        print(f"Error fetching sessions: {e}")
        return []


@router.get("/get-messages", response_model=list[dict])
def get_messages(session_id: str):
    if not supabase:
        return []
    try:
        res = supabase.table("chat_messages").select("*").eq("session_id", session_id).order("created_at", asc=True).execute()
        return res.data
    except Exception as e:
        print(f"Error fetching messages: {e}")
        return []
