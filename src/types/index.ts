export interface Student {
  id: string;
  name: string;
  grade: string;
  avatarUrl: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatarUrl: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  maxScore: number;
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  content: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: string;
  url: string;
  subject: string;
  recommendedFor: [number, number]; // score range
}

export interface PerformanceData {
  subject: string;
  averageScore: number;
  submissions: number;
}

export interface StudentProgress {
  month: string;
  score: number;
}

export type ToastType = 'success' | 'error' | 'info'; 