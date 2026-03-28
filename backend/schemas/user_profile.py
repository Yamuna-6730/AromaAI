from pydantic import BaseModel
from typing import List, Dict, Optional


class UserProfile(BaseModel):
    symptoms: List[str] = []
    notes: List[str] = []
    preferences: List[str] = []
    intensity_preference: str = "medium"
    usage_context: Optional[str] = None
    allergies: List[str] = []
    intensity: str = "medium"
    usage: List[str] = []


class CompoundProfile(BaseModel):
    ethanol: float
    iso_e_super: float
    hedione: float
    galaxolide: float
    ambroxan: float
    linalool: float
    limonene: float
    geraniol: float
    vanillin: float


class ChatRequest(BaseModel):
    message: str
    session_id: str


class ChatResponse(BaseModel):
    message: str
    stage: str
    actions: List[str]
    composition: Optional[CompoundProfile] = None
    profile_summary: Optional[UserProfile] = None
    confidence_score: float = 0.0
    rag_matches: List[Dict] = []


class SaveProfileRequest(BaseModel):
    session_id: str
    title: str = "My Fragrance"


class SaveProfileResponse(BaseModel):
    success: bool
    composition_id: Optional[str] = None


class CreateOrderRequest(BaseModel):
    user_id: str
    composition_id: str


class CreateOrderResponse(BaseModel):
    success: bool
    order_id: Optional[str] = None