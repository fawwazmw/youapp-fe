export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  access_token: string;
  message?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
  username?: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password?: string;
}
