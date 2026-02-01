export type ExerciseType = 'warmup' | 'strength' | 'cardio' | 'cooldown';

export interface Exercise {
  id: string;
  name: string;
  sets?: string;
  reps?: string;
  instruction?: string;
  formCue?: string;
  precaution?: string;
  type: ExerciseType;
  duration?: string; // For cardio/plank
}

export interface WorkoutRoutine {
  id: 'A' | 'B';
  name: string;
  exercises: Exercise[];
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface PhotoEntry {
  id: string;
  date: string;
  dataUrl: string; // Base64 image string
  note?: string;
}

export type Mood = 'amazing' | 'good' | 'okay' | 'hard' | 'pain';

export interface MoodEntry {
  date: string;
  mood: Mood;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  routineId: 'A' | 'B' | 'Rest';
  completedExerciseIds: string[];
  waterIntakeMl: number;
  restDayActivity?: boolean; // For tracking light walks on rest days
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (state: AppState) => boolean;
}

export type RoutineType = 'A' | 'B' | 'Rest';

export interface WeeklySchedule {
  [key: number]: RoutineType; // 0 (Sun) to 6 (Sat)
}

export interface NotificationState {
  enabled: boolean;
  morningSentDate: string;   // YYYY-MM-DD
  afternoonSentDate: string; // YYYY-MM-DD
  eveningSentDate: string;   // YYYY-MM-DD
}

export interface StoreItem {
  id: string;
  name: string;
  type: 'food' | 'hat' | 'glasses' | 'neck' | 'toy';
  cost: number;
  icon: string;
  description: string;
}

export interface AppState {
  weightHistory: WeightEntry[];
  photoJournal: PhotoEntry[];
  moodHistory: MoodEntry[];
  currentRoutine: RoutineType; // Derived from schedule usually
  schedule: WeeklySchedule;
  notifications: NotificationState;
  progress: DailyProgress;
  height?: number; // Height in cm
  userName?: string;
  userPhoto?: string; // Base64 data url
  
  // Gamification
  wallet: number;        // Golden Bones
  inventory: string[];   // Owned Item IDs
  equippedItems: string[]; // Currently worn Item IDs
}