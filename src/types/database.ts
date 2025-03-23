export interface TutorProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  bio: string;
  subjects: string[];
  hourly_rate: number;
  availability: {
    total_hours: number;
    schedule: {
      [day: string]: { start: string; end: string; }[];
    };
  };
  rating: number;
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
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
  student_profiles?: StudentProfile;
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
