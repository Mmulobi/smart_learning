-- Add 100ms-related fields to sessions table
ALTER TABLE sessions
ADD COLUMN room_id TEXT,
ADD COLUMN tutor_token TEXT,
ADD COLUMN student_token TEXT;

-- Add indexes for better query performance
CREATE INDEX idx_sessions_room_id ON sessions(room_id);
CREATE INDEX idx_sessions_status ON sessions(status); 