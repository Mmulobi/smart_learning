import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ZoomService } from '../../services/zoom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

export const ZoomCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Zoom authorization failed: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing required parameters');
        }

        // Exchange code for access token
        const tokenData = await ZoomService.handleCallback(code, state);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        // Update tutor profile with Zoom access token
        const { error: updateError } = await supabase
          .from('tutor_profiles')
          .update({
            zoom_access_token: tokenData.access_token,
            zoom_refresh_token: tokenData.refresh_token,
            zoom_token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        toast.success('Zoom integration successful!');
        navigate('/dashboard/tutor');
      } catch (error) {
        console.error('Error handling Zoom callback:', error);
        toast.error('Failed to integrate Zoom. Please try again.');
        navigate('/dashboard/tutor');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Connecting to Zoom...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete the integration.
        </p>
      </div>
    </div>
  );
}; 