import create from 'zustand';
import { auth } from '../api';
import { User, Student, Professor } from '../types'; // Adjust the import path as necessary

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  let user: User | null = null;

  if (token) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  }

  return {
    user,
    token,
    login: async (email, password) => {
      const response = await auth.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token });
    },
    register: async (userData) => {
      const response = await auth.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    },
    updateUser: async (user) => {
      const response = await auth.update(user);
      localStorage.setItem('user', JSON.stringify(response.data));
      set({ user: response.data });
    },
  };
});