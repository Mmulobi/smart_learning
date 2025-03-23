import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DatabaseService } from '../services/database';
import type { Message } from '../types/database';

export function useMessages(senderId: string, receiverId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await DatabaseService.getMessages(senderId, receiverId);
        setMessages(messages);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${senderId},receiver_id=eq.${receiverId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new as Message]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [senderId, receiverId]);

  const sendMessage = async (content: string) => {
    try {
      await DatabaseService.createMessage({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      });
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}
