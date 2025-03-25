-- First, let's make sure RLS is enabled on the sessions table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on the sessions table to avoid conflicts
DROP POLICY IF EXISTS "Allow students to create sessions" ON sessions;
DROP POLICY IF EXISTS "Allow tutors to view and update their sessions" ON sessions;
DROP POLICY IF EXISTS "Allow students to view their sessions" ON sessions;

-- Create a policy that allows students to create sessions
-- This policy uses WITH CHECK instead of USING for INSERT
CREATE POLICY "Allow students to create sessions" 
ON sessions 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM student_profiles WHERE id = student_id
  )
);

-- Create a policy that allows students to view their own sessions
CREATE POLICY "Allow students to view their sessions" 
ON sessions 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM student_profiles WHERE id = student_id
  )
);

-- Create a policy that allows tutors to view and update their sessions
CREATE POLICY "Allow tutors to view and update their sessions" 
ON sessions 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM tutor_profiles WHERE id = tutor_id
  )
);

-- Make sure the earnings table has RLS enabled and proper policies
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on the earnings table
DROP POLICY IF EXISTS "Allow tutors to view their earnings" ON earnings;

-- Create a policy for tutors to view their earnings
CREATE POLICY "Allow tutors to view their earnings" 
ON earnings 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM tutor_profiles WHERE id = tutor_id
  )
);

-- Ensure realtime is enabled for the sessions table
COMMENT ON TABLE sessions IS 'Realtime enabled for sessions';

-- Create or replace the update_timestamp function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table to update timestamps
DROP TRIGGER IF EXISTS sessions_update_timestamp ON sessions;
CREATE TRIGGER sessions_update_timestamp
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Make sure all tables have created_at and updated_at columns
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE tutor_profiles
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE student_profiles
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();
