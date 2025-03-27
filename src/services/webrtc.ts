import { supabase } from '../lib/supabase';

export class WebRTCService {
  private static instance: WebRTCService;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStreamCallback: ((stream: MediaStream) => void) | null = null;

  private constructor() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });

    this.peerConnection.ontrack = (event) => {
      if (this.remoteStreamCallback) {
        this.remoteStreamCallback(event.streams[0]);
      }
    };
  }

  public static getInstance(): WebRTCService {
    if (!WebRTCService.instance) {
      WebRTCService.instance = new WebRTCService();
    }
    return WebRTCService.instance;
  }

  public async initializeCall(sessionId: string, isTutor: boolean): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection) {
          this.peerConnection.addTrack(track, this.localStream!);
        }
      });

      if (isTutor) {
        const offer = await this.peerConnection!.createOffer();
        await this.peerConnection!.setLocalDescription(offer);

        const { error } = await supabase
          .from('sessions')
          .update({ webrtc_offer: JSON.stringify(offer) })
          .eq('id', sessionId);

        if (error) throw error;
      } else {
        const { data: session } = await supabase
          .from('sessions')
          .select('webrtc_offer')
          .eq('id', sessionId)
          .single();

        if (!session?.webrtc_offer) throw new Error('No offer found');

        await this.peerConnection!.setRemoteDescription(
          new RTCSessionDescription(JSON.parse(session.webrtc_offer))
        );

        const answer = await this.peerConnection!.createAnswer();
        await this.peerConnection!.setLocalDescription(answer);

        const { error } = await supabase
          .from('sessions')
          .update({ webrtc_answer: JSON.stringify(answer) })
          .eq('id', sessionId);

        if (error) throw error;
      }

      this.peerConnection!.onicecandidate = async (event) => {
        if (event.candidate) {
          const { data: session } = await supabase
            .from('sessions')
            .select('webrtc_candidates')
            .eq('id', sessionId)
            .single();

          const candidates = session?.webrtc_candidates || [];
          candidates.push(JSON.stringify(event.candidate));

          const { error } = await supabase
            .from('sessions')
            .update({ webrtc_candidates: candidates })
            .eq('id', sessionId);

          if (error) console.error('Error saving ICE candidate:', error);
        }
      };
    } catch (error) {
      console.error('Error initializing call:', error);
      throw error;
    }
  }

  public async getLocalStream(): Promise<MediaStream> {
    if (!this.localStream) {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
    }
    return this.localStream;
  }

  public onRemoteStream(callback: (stream: MediaStream) => void): void {
    this.remoteStreamCallback = callback;
  }

  public async cleanup(): Promise<void> {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStreamCallback = null;
  }
} 