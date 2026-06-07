// Response user dari API
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
}

// Request login
export interface LoginPayload {
  email: string;
  password: string;
}

// Request register
export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// Response login/register
export interface AuthResponse {
  token: string;
  user: User;
}
