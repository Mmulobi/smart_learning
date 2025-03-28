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
  session_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  student_id: string;
  tutor_id: string;
  subject: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'in-progress';
  notes: string;
  rating?: number;
  feedback?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  student_profiles?: StudentProfile;
  tutor_profiles?: TutorProfile;
  room_id?: string;
  tutor_token?: string;
  student_token?: string;
  webrtc_offer?: string;
  webrtc_answer?: string;
  webrtc_candidates?: string[];
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

export interface Resource {
  id: string;
  tutor_id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  subject: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  student_ids?: string[]; // Optional array of student IDs who have access
}
