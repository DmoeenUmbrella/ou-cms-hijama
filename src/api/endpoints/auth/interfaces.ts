import type { UserProfile } from "@/stores/useAuthStore";

// 1. The raw shape of the User object from backend
export interface BackendUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  phoneNumber: string;
  isActive: boolean;
}

// 2. The raw shape of the 'data' property in the response
export interface BackendLoginData {
  accessToken: string;
  keycloakTokens: any;
  user: BackendUser;
  isAdmin: boolean;
}

// 3. The full API Envelope
export interface BackendAuthResponse {
  isSuccess: boolean;
  data: BackendLoginData;
  message: string;
}

// 4. The clean response we return to our app
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
}
