import { useEffect, useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Mic, MicOff, Camera, CameraOff, X } from 'lucide-react';

interface VideoCallProps {
  sessionId: string;
  roomName: string;
  displayName: string;
  onClose: () => void;
}

export function VideoCall({ sessionId, roomName, displayName, onClose }: VideoCallProps) {
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [api, setApi] = useState<any>(null);
  
  // Generate a unique room name if not provided
  const actualRoomName = roomName || `smart-learning-session-${sessionId}`;
  
  // Handle API events
  const handleApiReady = (apiObj: any) => {
    setApi(apiObj);
    
    // Add event listeners
    apiObj.addEventListener('audioMuteStatusChanged', (event: any) => {
      setAudioMuted(event.muted);
    });
    
    apiObj.addEventListener('videoMuteStatusChanged', (event: any) => {
      setVideoMuted(event.muted);
    });
  };
  
  // Handle audio toggle
  const toggleAudio = () => {
    if (api) {
      api.executeCommand('toggleAudio');
    }
  };
  
  // Handle video toggle
  const toggleVideo = () => {
    if (api) {
      api.executeCommand('toggleVideo');
    }
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, [api]);
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col z-50">
      <div className="flex items-center justify-between bg-gray-800 p-4">
        <h2 className="text-white font-medium">Smart Learning Classroom Session</h2>
        <button 
          onClick={onClose}
          className="text-white hover:bg-gray-700 p-2 rounded-full"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex-1 relative">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={actualRoomName}
          configOverwrite={{
            startWithAudioMuted: audioMuted,
            startWithVideoMuted: videoMuted,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
          }}
          interfaceConfigOverwrite={{
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
              'security'
            ],
          }}
          userInfo={{
            displayName: displayName,
            email: ''
          }}
          onApiReady={handleApiReady}
          getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; }}
        />
      </div>
      
      <div className="bg-gray-800 p-4 flex justify-center space-x-4">
        <button 
          onClick={toggleAudio}
          className={`p-3 rounded-full ${audioMuted ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          {audioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        
        <button 
          onClick={toggleVideo}
          className={`p-3 rounded-full ${videoMuted ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          {videoMuted ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
        </button>
        
        <button 
          onClick={onClose}
          className="p-3 rounded-full bg-red-600 text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
