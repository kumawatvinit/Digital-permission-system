import create from 'zustand';
import { attendance } from '../api';
import { Attendance } from '../types';

interface AttendanceState {
  attendanceRecords: Attendance[];
  loading: boolean;
  error: string | null;
  fetchProfessorAttendanceRecords: () => Promise<void>;
  fetchStudentAttendanceRecords: (batch: string) => Promise<void>;
  addAttendance: (attendance: Omit<Attendance, '_id'>) => Promise<void>;
  submitAttendance: (id: string, data: { status: 'present' | 'late' }) => Promise<void>;
  clearError: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  attendanceRecords: [],
  loading: false,
  error: null,

  fetchProfessorAttendanceRecords: async () => {
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

  fetchStudentAttendanceRecords: async (batch) => {
    set({ loading: true, error: null });
    try {
      const response = await attendance.getStudentRecords(batch);
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
        attendanceRecords: [...state.attendanceRecords, response.data],
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

  submitAttendance: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await attendance.submit(id, data);
      set((state) => ({
        attendanceRecords: state.attendanceRecords.map((record) =>
          record._id === id ? { ...record, students: [...record.students, { studentId: data.studentId, status: data.status, submittedAt: new Date() }] } : record
        ),
        loading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to submit attendance',
        loading: false
      });
      throw error; // Re-throw for component handling
    }
  },

  clearError: () => set({ error: null })
}));