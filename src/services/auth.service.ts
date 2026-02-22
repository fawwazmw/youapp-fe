import api from './api';
import { LoginDto, RegisterDto, AuthResponse } from '../types/auth.types';

export const AuthService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    return api.post('/login', data);
  },
  
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    return api.post('/register', data);
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
};
