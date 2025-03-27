import { supabase } from '../lib/supabase';
import { Session, Resource } from '../types/database';

export class RealtimeService {
  static subscribeToSessions(
    userId: string, 
    role: 'student' | 'tutor',
    onUpdate: (session: Session) => void
  ) {
    const channel = supabase
      .channel('session-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: role === 'tutor' 
            ? `tutor_id=eq.${userId}` 
            : `student_id=eq.${userId}`
        },
        (payload) => {
          // Handle the real-time update
          const session = payload.new as Session;
          onUpdate(session);
        }
      )
      .subscribe();
      
    return channel;
  }
  
  static unsubscribeFromChannel(channelName: string) {
    try {
      const channels = supabase.getChannels();
      const channel = channels.find(
        (channel) => channel.topic === `realtime:${channelName}`
      );
      
      if (channel) {
        supabase.removeChannel(channel);
      }
    } catch (error) {
      console.error('Error unsubscribing from channel:', error);
    }
  }

  static subscribeToResources(
    userId: string,
    role: 'student' | 'tutor',
    onUpdate: (resource: Resource) => void
  ) {
    const channel = supabase
      .channel('resource-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resources',
          filter: role === 'tutor' 
            ? `tutor_id=eq.${userId}` 
            : `is_public.eq.true,student_ids.cs.{${userId}}`
        },
        (payload) => {
          const resource = payload.new as Resource;
          onUpdate(resource);
        }
      )
      .subscribe();
      
    return channel;
  }
}
