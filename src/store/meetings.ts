import create from 'zustand';
import api from '../api';
import { Meeting } from '../types';

interface MeetingState {
  meetings: Meeting[];
  fetchMeetings: () => Promise<void>;
  addMeeting: (meeting: Omit<Meeting, '_id'>) => Promise<void>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meetings: [],
  fetchMeetings: async () => {
    try {
      const response = await api.get('/meetings');
      set({ meetings: response.data });
    } catch (error) {
      console.error('Failed to fetch meetings', error);
    }
  },
  addMeeting: async (meeting) => {
    try {
      const response = await api.post('/meetings', meeting);
      set((state) => ({ meetings: [...state.meetings, response.data] }));
    } catch (error) {
      console.error('Failed to add meeting', error);
    }
  },
  updateMeeting: async (id, updates) => {
    try {
      const response = await api.put(`/meetings/${id}`, updates);
      set((state) => ({
        meetings: state.meetings.map((meeting) =>
          meeting._id === id ? response.data : meeting
        ),
      }));
    } catch (error) {
      console.error('Failed to update meeting', error);
    }
  },
  deleteMeeting: async (id) => {
    try {
      await api.delete(`/meetings/${id}`);
      set((state) => ({
        meetings: state.meetings.filter((meeting) => meeting._id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete meeting', error);
    }
  },
}));