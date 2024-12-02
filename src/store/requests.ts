import create from 'zustand';
import { requests } from '../api';
import { Request } from '../types';

interface RequestState {
  requests: Request[];
  fetchStudentRequests: () => Promise<void>;
  fetchProfessorRequests: () => Promise<void>;
  addRequest: (request: Omit<Request, '_id'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<Request>) => Promise<void>;
}

export const useRequestStore = create<RequestState>((set) => ({
  requests: [],
  
  fetchStudentRequests: async () => {
    try {
      const response = await requests.getStudentRequests();
      set({ requests: response.data.requests });
    } catch (error) {
      console.error('Failed to fetch student requests', error);
    }
  },

  fetchProfessorRequests: async () => {
    try {
      const response = await requests.getProfessorRequests();
      set({ requests: response.data.requests });
    } catch (error) {
      console.error('Failed to fetch professor requests', error);
    }
  },

  addRequest: async (request) => {
    try {
      const response = await requests.create(request);
      set((state) => ({ requests: [...state.requests, response.data] }));
    } catch (error) {
      console.error('Failed to add request', error);
    }
  },

  updateRequest: async (id, updates) => {
    try {
      const response = await requests.update(id, updates);
      set((state) => ({
        requests: state.requests.map((request) =>
          request._id === id ? { ...request, ...response.data } : request
        ),
      }));
    } catch (error) {
      console.error('Failed to update request', error);
    }
  },
}));