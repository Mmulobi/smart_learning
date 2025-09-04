import React, { useEffect, useRef, useState } from 'react';
import { WebRTCService } from '../../services/webrtc';
import { getSupabaseClient } from '../../lib/supabase';
import { Session } from '../../types/database';

interface VideoRoomProps {
  session: Session;
  onLeave: () => void;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({ session, onLeave }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  // Connection state can be derived from streams; avoid unused state
  const [error, setError] = useState<string | null>(null);
  const webrtcService = useRef(WebRTCService.getInstance());

  useEffect(() => {
    const initializeCall = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        const isTutor = user.id === session.tutor_id;
        const svc = webrtcService.current;
        await svc.initializeCall(session.id, isTutor);

        const localStream = await svc.getLocalStream();
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        svc.onRemoteStream((stream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to video call');
      }
    };

    initializeCall();

    return () => {
      const svc = webrtcService.current;
      svc.cleanup();
    };
  }, [session.id, session.tutor_id]);

  const handleLeave = async () => {
    try {
      const svc = webrtcService.current;
      await svc.cleanup();
      onLeave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave the call');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleLeave}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Leave Call
        </button>
      </div>
    </div>
  );
}; 