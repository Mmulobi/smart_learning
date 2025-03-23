export interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string;
  total_sessions: number;
  total_hours: number;
  learning_style: string;
  subjects: string[];
  streak_days: number;
  last_active: string;
}

export interface TutorProfile {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  subjects: string[];
  qualifications: string[];
  hourly_rate: number;
  total_sessions: number;
  total_hours: number;
  rating: number;
  availability: {
    [key: string]: { // day of week (0-6)
      start: string; // HH:mm format
      end: string;
    }[];
  };
  video_url?: string;
}

export interface Session {
  id: string;
  student_id: string;
  tutor_id: string;
  subject: string;
  status: string;
  start_time: string;
  duration: number;
  notes: string;
  prep_notes?: string;
  materials?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface Review {
  id: string;
  session_id: string;
  student_id: string;
  tutor_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  subject: string;
}

export interface Earning {
  id: string;
  tutor_id: string;
  session_id: string;
  amount: number;
  status: 'pending' | 'paid';
  created_at: string;
  paid_at?: string;
}
