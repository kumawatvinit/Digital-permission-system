import { create } from 'zustand';
import { Request } from '../types';

interface RequestState {
  requests: Request[];
  addRequest: (request: Request) => void;
  updateRequest: (id: string, updates: Partial<Request>) => void;
}

export const useRequestStore = create<RequestState>((set) => ({
  requests: [],
  addRequest: (request) =>
    set((state) => ({ requests: [request, ...state.requests] })),
  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id ? { ...request, ...updates } : request
      ),
    })),
}));