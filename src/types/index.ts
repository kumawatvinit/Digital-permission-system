export type BatchType = 'TYECO' | 'TYCSO' | 'TYMEO' | 'TYEEO' | 'SYECO' | 'SYCSO' | 'SYMEO' | 'SYEEO' | 'FYECO' | 'FYCSO' | 'FYMEO' | 'FYEEO';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'hod';
}

export interface Student extends User {
  role: 'student';
  batch: BatchType;
}

export interface Professor extends User {
  role: 'professor';
  batches: BatchType[];
}

export interface Request {
  _id: string;
  title: string;
  content: string;
  studentId: string;
  professorId: string;
  status: 'pending' | 'approved' | 'rejected' | 'forwarded';
  type: 'leave' | 'deadline-extension' | 'special' | 'custom';
  createdAt: Date;
  remarks?: string;
  professorApproval?: {
    status: 'approved' | 'rejected';
    remarks?: string;
    date: Date;
  };
  hodApproval?: {
    status: 'approved' | 'rejected';
    remarks?: string;
    date: Date;
  };
}

export interface Attendance {
  _id: string;
  batch: BatchType;
  course: string;
  professorId: string;
  date: Date;
  expiresAt: Date;
  status: 'active' | 'late' | 'closed';
  students: {
    studentId: string;
    status: 'present' | 'late' | 'absent';
    submittedAt?: Date;
  }[];
}

export interface Meeting {
  _id: string;
  title: string;
  batches: BatchType[];
  professorId: string;
  date: Date;
  time: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface RequestFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected' | 'forwarded';
  type?: 'leave' | 'deadline-extension' | 'special' | 'custom';
  search?: string;
}

export interface APIError {
  error: string;
  message?: string;
  details?: string[];
}