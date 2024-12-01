import { create } from 'zustand';
import { Attendance } from '../types';

interface AttendanceState {
  attendanceRecords: Attendance[];
  addAttendance: (attendance: Attendance) => void;
  updateAttendance: (id: string, updates: Partial<Attendance>) => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  attendanceRecords: [],
  addAttendance: (attendance) =>
    set((state) => ({
      attendanceRecords: [attendance, ...state.attendanceRecords],
    })),
  updateAttendance: (id, updates) =>
    set((state) => ({
      attendanceRecords: state.attendanceRecords.map((record) =>
        record.id === id ? { ...record, ...updates } : record
      ),
    })),
}));