export interface TutorProfile {
  id: string;
  user_id: string;
  name: string;
  full_name?: string; // For compatibility with existing code
  email: string;
  bio: string;
  subjects: string[];
  qualifications?: string[];
  hourly_rate: number;
  availability: {
    total_hours: number;
    schedule: {
      [day: string]: { start: string; end: string; }[];
    };
  };
  rating: number;
  total_sessions?: number;
  image_url?: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  grade_level: string;
  subjects: string[];
  bio?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  tutor_id: string;
  student_id: string;
  subject: string;
  start_time: string;
  end_time: string;
  duration?: number; // Duration in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'in-progress';
  notes: string;
  rating?: number;
  feedback?: string;
  is_active?: boolean; // Indicates if a session is currently active
  created_at: string;
  updated_at: string;
  student_profiles?: StudentProfile;
  tutor_profiles?: TutorProfile;
}

export interface Review {
  id: string;
  tutor_id: string;
  student_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  student_profiles?: StudentProfile;
}

export interface Earning {
  id: string;
  tutor_id: string;
  session_id: string;
  amount: number;
  status: 'pending' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
