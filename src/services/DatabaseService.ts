import { createClient } from '@supabase/supabase-js';
import { TutorProfile, StudentProfile, Session, Review, Earning } from '../types/database';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

class DatabaseService {
  // Tutor Profile Methods
  static async getTutorProfile(userId: string): Promise<TutorProfile | null> {
    try {
      const { data, error } = await supabase
        .from('tutor_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tutor profile:', error);
      return null;
    }
  }

  static async updateTutorProfile(userId: string, updatedProfile: Partial<TutorProfile>): Promise<void> {
    try {
      console.log('Updating tutor profile for user:', userId, 'with data:', updatedProfile);
      
      // Filter out fields that don't exist in the database schema
      // Only include fields that we know exist in the database
      const safeProfile: Record<string, any> = {};
      const allowedFields = [
        'name', 'email', 'bio', 'subjects', 'hourly_rate', 
        'availability', 'rating', 'image_url', 'video_url',
        'qualifications', 'full_name', 'total_sessions'
      ];
      
      // Only include fields that are allowed
      for (const field of allowedFields) {
        if (field in updatedProfile) {
          safeProfile[field] = updatedProfile[field as keyof Partial<TutorProfile>];
        }
      }
      
      console.log('Filtered profile data for update:', safeProfile);
      
      const { error } = await supabase
        .from('tutor_profiles')
        .update(safeProfile)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating tutor profile:', error);
      throw error;
    }
  }

  static async createTutorProfile(profile: Partial<TutorProfile>): Promise<TutorProfile> {
    try {
      const { data, error } = await supabase
        .from('tutor_profiles')
        .insert(profile)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating tutor profile:', error);
      throw error;
    }
  }

  // Student Profile Methods
  static async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      return null;
    }
  }

  static async updateStudentProfile(userId: string, updatedProfile: Partial<StudentProfile>): Promise<void> {
    try {
      const { error } = await supabase
        .from('student_profiles')
        .update(updatedProfile)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  }

  static async createStudentProfile(profile: Partial<StudentProfile>): Promise<StudentProfile> {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .insert(profile)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating student profile:', error);
      throw error;
    }
  }

  // Session Methods
  static async getSessions(userId: string, role: 'tutor' | 'student'): Promise<Session[]> {
    try {
      const field = role === 'tutor' ? 'tutor_id' : 'student_id';
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*, student_profiles(*)')
        .eq(field, userId)
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  static async createSession(session: Partial<Session>): Promise<Session> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert(session)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  static async updateSession(sessionId: string, updates: Partial<Session>): Promise<void> {
    try {
      const { error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', sessionId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  // Earnings Methods
  static async getEarnings(tutorId: string): Promise<Earning[]> {
    try {
      const { data, error } = await supabase
        .from('earnings')
        .select('*')
        .eq('tutor_id', tutorId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching earnings:', error);
      return [];
    }
  }

  // Tutor Listing Methods
  static async getAllTutors(): Promise<TutorProfile[]> {
    try {
      const { data, error } = await supabase
        .from('tutor_profiles')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tutors:', error);
      return [];
    }
  }

  // File Storage Methods
  static async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: true,
          cacheControl: '3600'
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}

export default DatabaseService;
