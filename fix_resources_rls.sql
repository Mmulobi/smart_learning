-- Enable RLS on resources table
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on the resources table to avoid conflicts
DROP POLICY IF EXISTS "Allow tutors to manage their resources" ON resources;
DROP POLICY IF EXISTS "Allow students to view resources" ON resources;

-- Create policy that allows tutors to manage their own resources (create, read, update, delete)
CREATE POLICY "Allow tutors to manage their resources" 
ON resources 
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM tutor_profiles WHERE id = tutor_id
  )
);

-- Create policy that allows students to view resources that are either public
-- or specifically shared with them
CREATE POLICY "Allow students to view resources" 
ON resources 
FOR SELECT 
TO authenticated
USING (
  -- Resource is public
  is_public = true 
  OR 
  -- Resource is shared with the student
  auth.uid() IN (
    SELECT user_id FROM student_profiles WHERE id = ANY(student_ids)
  )
);

-- Make sure the resources table has the necessary columns
ALTER TABLE resources
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create trigger for resources to update timestamps
DROP TRIGGER IF EXISTS resources_update_timestamp ON resources;
CREATE TRIGGER resources_update_timestamp
BEFORE UPDATE ON resources
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create the resources table if it doesn't exist
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  student_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for resources table
CREATE INDEX IF NOT EXISTS resources_tutor_id_idx ON resources(tutor_id);
CREATE INDEX IF NOT EXISTS resources_subject_idx ON resources(subject);
CREATE INDEX IF NOT EXISTS resources_is_public_idx ON resources(is_public);
