import create from 'zustand';
import { requests } from '../api';
import { Request, RequestFilters, PaginatedResponse } from '../types';

interface RequestState {
  requests: Request[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  filters: RequestFilters;
  
  setFilters: (filters: Partial<RequestFilters>) => void;
  fetchRequests: (page?: number) => Promise<void>;
  addRequest: (request: Omit<Request, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<Request>) => Promise<void>;
  clearError: () => void;
}

export const useRequestStore = create<RequestState>((set, get) => ({
  requests: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  },
  filters: {
    status: 'all',
    type: undefined,
    search: ''
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().fetchRequests(1); // Reset to first page with new filters
  },

  fetchRequests: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const response = await requests.getStudentRequests({
        page,
        ...filters
      });
      const { requests: data, pagination } = response.data as PaginatedResponse<Request>;
      
      set({
        requests: data,
        pagination,
        loading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch requests',
        loading: false
      });
    }
  },

  addRequest: async (request) => {
    set({ loading: true, error: null });
    try {
      const response = await requests.create(request);
      set((state) => ({
        requests: [response.data, ...state.requests],
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create request',
        loading: false
      });
      throw error; // Re-throw for component handling
    }
  },

  updateRequest: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await requests.update(id, updates);
      set((state) => ({
        requests: state.requests.map((req) =>
          req.id === id ? { ...req, ...response.data } : req
        ),
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update request',
        loading: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));