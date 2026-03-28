export interface UserProfile {
  symptoms: string[];
  notes: string[];
  preferences: string[];
  allergies: string[];
  intensity: string;
  usage: string[];
}

export interface CompoundProfile {
  ethanol: number;
  iso_e_super: number;
  hedione: number;
  galaxolide: number;
  ambroxan: number;
  linalool: number;
  limonene: number;
  geraniol: number;
  vanillin: number;
}

export interface ChatRequest {
  message: string;
  session_id: string;
}

export interface ChatResponse {
  message: string;
  stage: string;
  actions: string[];
  composition?: CompoundProfile;
  profile_summary?: UserProfile;
  confidence_score: number;
  rag_matches: any[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function sendChatMessage(message: string, sessionId: string): Promise<ChatResponse> {
  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, session_id: sessionId }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }

    const data: ChatResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to send message to backend:', error);
    throw error;
  }
}

export async function saveProfileAPI(sessionId: string, title: string = "My Fragrance"): Promise<{ success: boolean, compositionId?: string }> {
  try {
    const res = await fetch(`${API_URL}/save-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId, title }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }

    const data = await res.json();
    return { success: data.success, compositionId: data.composition_id };
  } catch (error) {
    console.error('Failed to save profile:', error);
    throw error;
  }
}

export async function createOrderAPI(userId: string, compositionId: string): Promise<{ success: boolean, orderId?: string }> {
  try {
    const res = await fetch(`${API_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, composition_id: compositionId }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }

    const data = await res.json();
    return { success: data.success, orderId: data.order_id };
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
}

export async function getProfilesAPI(sessionId: string): Promise<ChatResponse[]> {
  try {
    const res = await fetch(`${API_URL}/get-profiles?session_id=${sessionId}`);

    if (!res.ok) {
        // Return empty instead of crashing if possible
        return [];
    }

    const data: ChatResponse[] = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    return [];
  }
}
export async function getSessionsAPI(userId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/get-sessions?user_id=${userId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return [];
  }
}

export async function getMessagesAPI(sessionId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/get-messages?session_id=${sessionId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}
