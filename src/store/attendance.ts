import create from 'zustand';
import { attendance } from '../api';
import { Attendance } from '../types';

interface AttendanceState {
  attendanceRecords: Attendance[];
  loading: boolean;
  error: string | null;
  fetchAttendance: () => Promise<void>;
  addAttendance: (attendance: Omit<Attendance, 'id'>) => Promise<void>;
  updateAttendance: (id: string, updates: Partial<Attendance>) => Promise<void>;
  clearError: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  attendanceRecords: [],
  loading: false,
  error: null,

  fetchAttendance: async () => {
    set({ loading: true, error: null });
    try {
      const response = await attendance.getProfessorRecords();
      set({ attendanceRecords: response.data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch attendance records',
        loading: false
      });
    }
  },

  addAttendance: async (attendanceData) => {
    set({ loading: true, error: null });
    try {
      const response = await attendance.create(attendanceData);
      set((state) => ({
        attendanceRecords: [response.data, ...state.attendanceRecords],
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create attendance record',
        loading: false
      });
      throw error; // Re-throw for component handling
    }
  },

  updateAttendance: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await attendance.update(id, updates);
      set((state) => ({
        attendanceRecords: state.attendanceRecords.map((record) =>
          record.id === id ? { ...record, ...response.data } : record
        ),
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update attendance record',
        loading: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));