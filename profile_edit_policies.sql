-- Enable RLS on profile tables if not already enabled
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on the tutor_profiles table to avoid conflicts
DROP POLICY IF EXISTS "Allow tutors to view all tutor profiles" ON tutor_profiles;
DROP POLICY IF EXISTS "Allow tutors to update their own profile" ON tutor_profiles;
DROP POLICY IF EXISTS "Allow students to view tutor profiles" ON tutor_profiles;

-- Create policies for tutor_profiles table
-- Allow tutors to view all tutor profiles (for discovery)
CREATE POLICY "Allow tutors to view all tutor profiles"
ON tutor_profiles
FOR SELECT
TO authenticated
USING (true);

-- Allow tutors to update only their own profile
CREATE POLICY "Allow tutors to update their own profile"
ON tutor_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Drop any existing policies on the student_profiles table to avoid conflicts
DROP POLICY IF EXISTS "Allow students to view all student profiles" ON student_profiles;
DROP POLICY IF EXISTS "Allow students to update their own profile" ON student_profiles;
DROP POLICY IF EXISTS "Allow tutors to view student profiles" ON student_profiles;

-- Create policies for student_profiles table
-- Allow students to view all student profiles (for community features)
CREATE POLICY "Allow students to view all student profiles"
ON student_profiles
FOR SELECT
TO authenticated
USING (true);

-- Allow students to update only their own profile
CREATE POLICY "Allow students to update their own profile"
ON student_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Allow tutors to view student profiles (for teaching purposes)
CREATE POLICY "Allow tutors to view student profiles"
ON student_profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM tutor_profiles
  )
);

-- Create policies to allow users to create their own profiles
-- Allow users to create their own tutor profile
CREATE POLICY "Allow users to create their own tutor profile"
ON tutor_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to create their own student profile
CREATE POLICY "Allow users to create their own student profile"
ON student_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policies to allow users to delete their own profiles if needed
-- Allow tutors to delete their own profile
CREATE POLICY "Allow tutors to delete their own profile"
ON tutor_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow students to delete their own profile
CREATE POLICY "Allow students to delete their own profile"
ON student_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Ensure triggers are set up for these tables
DROP TRIGGER IF EXISTS tutor_profiles_update_timestamp ON tutor_profiles;
CREATE TRIGGER tutor_profiles_update_timestamp
BEFORE UPDATE ON tutor_profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS student_profiles_update_timestamp ON student_profiles;
CREATE TRIGGER student_profiles_update_timestamp
BEFORE UPDATE ON student_profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
