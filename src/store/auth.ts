import create from 'zustand';
import { auth } from '../api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  
  login: async (email: string, password: string) => {
    try {
      const response = await auth.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token });
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await auth.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  updateUser: async (user) => {
    try {
      const response = await auth.update(user);
      set({ user: response.data });
    } catch (error) {
      throw error;
    }
  },
}));