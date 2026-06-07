import { api } from "./axios";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  UpdateProfilePayload,
  User,
} from "@/types/auth";

type ApiAuthResponse = AuthResponse | {
  data?: {
    token?: string;
    user?: AuthResponse["user"];
  };
};

function normalizeAuthResponse(response: ApiAuthResponse): AuthResponse {
  if ("token" in response && response.token) {
    return response;
  }

  if ("data" in response && response.data?.token && response.data.user) {
    return {
      token: response.data.token,
      user: response.data.user,
    };
  }

  throw new Error("Invalid auth response");
}

/**
 * Login user
 */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/login", payload);

  return normalizeAuthResponse(data);
};

/**
 * Register user
 */
export const register = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const { data } = await api.post("/auth/register", payload);

  return normalizeAuthResponse(data);
};

/**
 * Get profile user
 */
export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");

  return data.data as User;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);

  const { data } = await api.put("/auth/profile", formData);

  return data.data as User;
};
