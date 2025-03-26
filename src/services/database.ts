import { supabase } from '../lib/supabase';
import type { TutorProfile, StudentProfile, Session, Message, Review, Earning } from '../types/database';

export class DatabaseService {
  static async getTutorProfile(userId: string): Promise<TutorProfile | null> {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getAllTutors(): Promise<TutorProfile[]> {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .select('*')
      .order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createSession(session: Partial<Session>): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .insert([session])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createMessage(message: Partial<Message>): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        ...message,
        timestamp: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${senderId},sender_id.eq.${receiverId}`)
      .or(`receiver_id.eq.${senderId},receiver_id.eq.${receiverId}`)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async updateTutorProfile(userId: string, updates: Partial<TutorProfile>): Promise<TutorProfile> {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateStudentProfile(userId: string, updates: Partial<StudentProfile>): Promise<StudentProfile> {
    const { data, error } = await supabase
      .from('student_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTutorSessions(tutorId: string): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getStudentSessions(studentId: string): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getSessionsByTutor(tutorId: string): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        student_profiles (
          id,
          name,
          email
        )
      `)
      .eq('tutor_id', tutorId)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getReviewsByTutor(tutorId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        student_profiles (
          id,
          name
        )
      `)
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getEarningsByTutor(tutorId: string): Promise<Earning[]> {
    const { data, error } = await supabase
      .from('earnings')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateSession(session: Session): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .update(session)
      .eq('id', session.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createStudentProfile(profile: Omit<StudentProfile, 'id' | 'created_at' | 'updated_at'>): Promise<StudentProfile> {
    const { data, error } = await supabase
      .from('student_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createTutorProfile(profile: Omit<TutorProfile, 'id' | 'created_at' | 'updated_at'>): Promise<TutorProfile> {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // New methods for session management
  static async getSessionById(sessionId: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        student_profiles (
          id,
          name,
          email
        ),
        tutor_profiles (
          id,
          name,
          email
        )
      `)
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSessionStatus(sessionId: string, status: Session['status']): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  
  static async setSessionActive(sessionId: string, isActive: boolean): Promise<Session> {
    const { data, error } = await supabase
      .from('sessions')
      .update({ 
        is_active: isActive, 
        updated_at: new Date().toISOString(),
        status: isActive ? 'in-progress' : 'scheduled'
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUpcomingSessions(userId: string, role: 'student' | 'tutor'): Promise<Session[]> {
    const now = new Date().toISOString();
    const field = role === 'student' ? 'student_id' : 'tutor_id';
    
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        student_profiles (
          id,
          name,
          email
        ),
        tutor_profiles (
          id,
          name,
          email
        )
      `)
      .eq(field, userId)
      .gte('start_time', now)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getPastSessions(userId: string, role: 'student' | 'tutor'): Promise<Session[]> {
    const now = new Date().toISOString();
    const field = role === 'student' ? 'student_id' : 'tutor_id';
    
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        student_profiles (
          id,
          name,
          email
        ),
        tutor_profiles (
          id,
          name,
          email
        )
      `)
      .eq(field, userId)
      .lt('end_time', now)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
