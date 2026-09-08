export interface UserData {
  id: string;
  name: string;
  className: string;
  absentNumber: string;
  date: string;
  diagnostic: Record<number, string>;
  quizScore: number;
  projectStatus: boolean;
  reflection: string;
  points: number;
  badges: string[];
  progress: number;
  completedSteps: number[];
  photo?: string;
}

export type AppMode = 'student' | 'teacher';
