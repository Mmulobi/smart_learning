import { supabase } from '../lib/supabase';

interface StudentProfile {
  id: string;
  name: string;
}

export interface StudentInsight {
  id: string;
  tutor_id: string;
  student_id: string;
  strengths: string[];
  weaknesses: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  student_profiles?: StudentProfile;
}

export class InsightsService {
  static async getStudentInsights(tutorId: string): Promise<StudentInsight[]> {
    const { data, error } = await supabase
      .from('student_insights')
      .select(`
        *,
        student_profiles (
          id,
          name
        )
      `)
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student insights:', error);
      throw error;
    }

    return data || [];
  }

  static async createStudentInsight(
    tutorId: string,
    studentId: string,
    strengths: string[],
    weaknesses: string[],
    notes?: string
  ): Promise<StudentInsight> {
    const { data, error } = await supabase
      .from('student_insights')
      .insert([
        {
          tutor_id: tutorId,
          student_id: studentId,
          strengths,
          weaknesses,
          notes
        }
      ])
      .select(`
        *,
        student_profiles (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('Error creating student insight:', error);
      throw error;
    }

    return data;
  }

  static async updateStudentInsight(
    insightId: string,
    strengths: string[],
    weaknesses: string[],
    notes?: string
  ): Promise<StudentInsight> {
    const { data, error } = await supabase
      .from('student_insights')
      .update({
        strengths,
        weaknesses,
        notes
      })
      .eq('id', insightId)
      .select(`
        *,
        student_profiles (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('Error updating student insight:', error);
      throw error;
    }

    return data;
  }

  static async deleteStudentInsight(insightId: string): Promise<void> {
    const { error } = await supabase
      .from('student_insights')
      .delete()
      .eq('id', insightId);

    if (error) {
      console.error('Error deleting student insight:', error);
      throw error;
    }
  }

  static async getStudentInsight(tutorId: string, studentId: string): Promise<StudentInsight | null> {
    const { data, error } = await supabase
      .from('student_insights')
      .select(`
        *,
        student_profiles (
          id,
          name
        )
      `)
      .eq('tutor_id', tutorId)
      .eq('student_id', studentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No matching record found
      }
      console.error('Error fetching student insight:', error);
      throw error;
    }

    return data;
  }
} 