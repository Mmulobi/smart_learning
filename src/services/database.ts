import { supabase } from '../lib/supabase';
import type { TutorProfile, StudentProfile, Session, Message, Review, Earning, Resource } from '../types/database';

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
    try {
      // First, check if the session exists
      const { data: existingSession, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        throw fetchError;
      }
      
      if (!existingSession) {
        throw new Error(`Session with ID ${sessionId} not found`);
      }
      
      // Then update the session - only update status and updated_at, not is_active
      const { data, error } = await supabase
        .from('sessions')
        .update({ 
          updated_at: new Date().toISOString(),
          status: isActive ? 'in-progress' : 'scheduled'
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating session:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in setSessionActive:', error);
      throw error;
    }
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

  static async createResource(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource> {
    const { data, error } = await supabase
      .from('resources')
      .insert([resource])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTutorResources(tutorId: string): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getStudentResources(studentId: string): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .or(`is_public.eq.true,student_ids.cs.{${studentId}}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateResource(resourceId: string, updates: Partial<Resource>): Promise<Resource> {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', resourceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteResource(resourceId: string): Promise<void> {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', resourceId);

    if (error) throw error;
  }

  static async shareResourceWithStudents(resourceId: string, studentIds: string[]): Promise<Resource> {
    const { data, error } = await supabase
      .from('resources')
      .update({ student_ids: studentIds })
      .eq('id', resourceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTutorEarnings(tutorId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          duration,
          tutor_profiles (
            hourly_rate
          )
        `)
        .eq('tutor_id', tutorId)
        .eq('status', 'completed');

      if (error) throw error;
      if (!data) return 0;

      return data.reduce((total, session) => {
        const hourlyRate = session.tutor_profiles?.[0]?.hourly_rate || 0;
        const durationInHours = session.duration / 60; // Convert minutes to hours
        return total + (hourlyRate * durationInHours);
      }, 0);
    } catch (error) {
      console.error('Error getting tutor earnings:', error);
      throw error;
    }
  }

  static async getTutorEarningsHistory(tutorId: string, timeRange: string): Promise<any[]> {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(now.getDate() - 30);
          break;
        case 'quarter':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          duration,
          created_at,
          subject,
          tutor_profiles (
            hourly_rate
          ),
          student_profiles (
            name
          )
        `)
        .eq('tutor_id', tutorId)
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map(session => {
        const hourlyRate = session.tutor_profiles?.[0]?.hourly_rate || 0;
        const durationInHours = session.duration / 60; // Convert minutes to hours
        const amount = hourlyRate * durationInHours;

        return {
          id: session.id,
          date: session.created_at,
          amount: amount,
          duration: session.duration,
          session_title: `${session.subject} Session`,
          student_name: session.student_profiles?.[0]?.name || 'Unknown Student'
        };
      });
    } catch (error) {
      console.error('Error getting tutor earnings history:', error);
      throw error;
    }
  }

  static async exportEarningsToCSV(tutorId: string): Promise<string> {
    try {
      const earnings = await this.getTutorEarningsHistory(tutorId, 'year');
      
      // Create CSV header
      let csv = 'Date,Session,Student,Duration,Amount\n';
      
      // Add data rows
      earnings.forEach(earning => {
        csv += `${new Date(earning.date).toLocaleDateString()},${earning.session_title},${earning.student_name},${earning.duration} min,$${earning.amount.toFixed(2)}\n`;
      });
      
      return csv;
    } catch (error) {
      console.error('Error exporting earnings to CSV:', error);
      throw error;
    }
  }

  static async getTutorStudents(tutorId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          student_id,
          student_profiles (
            id,
            name,
            email,
            subjects
          )
        `)
        .eq('tutor_id', tutorId)
        .eq('status', 'completed');

      if (error) throw error;
      if (!data) return [];

      // Get unique students and count their sessions
      const uniqueStudents = new Map();
      data.forEach(session => {
        const student = session.student_profiles?.[0];
        if (student && !uniqueStudents.has(student.id)) {
          uniqueStudents.set(student.id, {
            ...student,
            session_count: 1
          });
        } else if (student) {
          uniqueStudents.get(student.id).session_count++;
        }
      });

      return Array.from(uniqueStudents.values());
    } catch (error) {
      console.error('Error getting tutor students:', error);
      throw error;
    }
  }

  static async getAllStudents(): Promise<StudentProfile[]> {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all students:', error);
      throw error;
    }
  }
}
