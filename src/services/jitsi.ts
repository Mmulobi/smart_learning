import { supabase } from '../lib/supabase';

interface RoomData {
  room_id: string;
}

interface RoomResponse {
  data: RoomData | null;
  error: Error | null;
}

export class JitsiService {
  private static readonly JITSI_DOMAIN = import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si';

  static async createRoom(sessionId: string): Promise<RoomResponse> {
    try {
      // Generate a unique room ID
      const roomId = `session-${sessionId}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // First, get the current session to ensure it exists
      const { data: session, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (fetchError) {
        throw new Error('Failed to fetch session');
      }

      if (!session) {
        throw new Error('Session not found');
      }

      // Update the session with the room details
      const { error: updateError } = await supabase
        .from('sessions')
        .update({
          room_id: roomId,
          status: 'in-progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw new Error('Failed to update session with room details');
      }

      const result: RoomData = {
        room_id: roomId
      };

      return { data: result, error: null };
    } catch (error) {
      console.error('Error creating room:', error);
      return { data: null, error: error as Error };
    }
  }

  static getRoomUrl(roomId: string): string {
    return `https://${this.JITSI_DOMAIN}/${roomId}`;
  }
} 