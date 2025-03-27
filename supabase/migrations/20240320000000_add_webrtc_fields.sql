-- Add WebRTC-related fields to sessions table
ALTER TABLE sessions
ADD COLUMN webrtc_offer TEXT,
ADD COLUMN webrtc_answer TEXT,
ADD COLUMN webrtc_candidates TEXT[] DEFAULT '{}';

-- Add indexes for better query performance
CREATE INDEX idx_sessions_status ON sessions(status); 