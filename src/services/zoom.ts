import { getSupabaseClient } from '../lib/supabase';

// Update these with your actual Zoom Marketplace App credentials
const ZOOM_CLIENT_ID = 'rqEK9FnGRVmj1uwG2a9nlw';
const ZOOM_CLIENT_SECRET = 'CTpzLGnH1JDTpPvLjGPXMQPA0M6wFp4M';

// Use environment variable for redirect URI, fallback to window.location.origin
const ZOOM_REDIRECT_URI = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ZOOM_REDIRECT_URI) || (typeof window !== 'undefined' ? `${window.location.origin}/zoom/callback` : '');

export class ZoomService {
  static async createMeeting(sessionId: string, tutorId: string, studentId: string) {
    try {
      // Get tutor's Zoom access token
      const supabase = getSupabaseClient();
      const { data: tutorData, error: tutorError } = await supabase
        .from('tutor_profiles')
        .select('zoom_access_token')
        .eq('user_id', tutorId)
        .single();

      if (tutorError) throw tutorError;

      // Create Zoom meeting
      const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tutorData.zoom_access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: `Tutoring Session - ${sessionId}`,
          type: 1, // Instant meeting
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: true,
            meeting_authentication: true,
            auto_recording: 'cloud',
            alternative_hosts: '',
            meeting_invitees: [],
            use_pmi: false,
            approval_type: 1,
            registration_type: 1,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Zoom API Error:', errorData);
        throw new Error(`Failed to create Zoom meeting: ${errorData.message || 'Unknown error'}`);
      }

      const meetingData = await response.json();

      // Update session with Zoom meeting details
      const { error: updateError } = await supabase
        .from('sessions')
        .update({
          zoom_meeting_id: meetingData.id,
          zoom_join_url: meetingData.join_url,
          zoom_password: meetingData.password,
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      return meetingData;
    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
      throw error;
    }
  }

  static async getAuthUrl() {
    try {
      const state = Math.random().toString(36).substring(7);
      const scope = 'meeting:write user:read';
      
      // Store state in localStorage for verification
      localStorage.setItem('zoom_auth_state', state);
      
      const authUrl = new URL('https://zoom.us/oauth/authorize');
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', ZOOM_CLIENT_ID);
      authUrl.searchParams.append('redirect_uri', ZOOM_REDIRECT_URI);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('scope', scope);

      return authUrl.toString();
    } catch (error) {
      console.error('Error generating auth URL:', error);
      throw error;
    }
  }

  static async handleCallback(code: string, state: string) {
    try {
      // Verify state
      const savedState = localStorage.getItem('zoom_auth_state');
      if (state !== savedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://zoom.us/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: ZOOM_REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error('Zoom Token Error:', errorData);
        throw new Error(`Failed to get access token: ${errorData.message || 'Unknown error'}`);
      }

      const tokenData = await tokenResponse.json();
      
      // Clear state from localStorage
      localStorage.removeItem('zoom_auth_state');
      
      return tokenData;
    } catch (error) {
      console.error('Error handling Zoom callback:', error);
      throw error;
    }
  }
} 