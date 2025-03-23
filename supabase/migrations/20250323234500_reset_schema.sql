-- Drop existing tables if they exist
DROP TABLE IF EXISTS earnings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS tutor_profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create student profiles table
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create tutor profiles table
CREATE TABLE tutor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  availability JSONB NOT NULL DEFAULT '{"total_hours": 0, "schedule": {}}',
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add RLS policies for student profiles
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own student profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile"
  ON student_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own student profile"
  ON student_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for tutor profiles
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tutor profiles"
  ON tutor_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own tutor profile"
  ON tutor_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tutor profile"
  ON tutor_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tutor_profiles_updated_at
  BEFORE UPDATE ON tutor_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies for sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can view their own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM tutor_profiles WHERE id = tutor_id
  ));

CREATE POLICY "Students can view their own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM student_profiles WHERE id = student_id
  ));

CREATE POLICY "Tutors can update their own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM tutor_profiles WHERE id = tutor_id
  ));

-- Create trigger for sessions updated_at
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes
CREATE INDEX student_profiles_user_id_idx ON student_profiles(user_id);
CREATE INDEX tutor_profiles_user_id_idx ON tutor_profiles(user_id);
CREATE INDEX tutor_profiles_subjects_idx ON tutor_profiles USING GIN (subjects);
CREATE INDEX tutor_profiles_hourly_rate_idx ON tutor_profiles(hourly_rate);
CREATE INDEX tutor_profiles_rating_idx ON tutor_profiles(rating);
CREATE INDEX sessions_tutor_id_idx ON sessions(tutor_id);
CREATE INDEX sessions_student_id_idx ON sessions(student_id);
CREATE INDEX sessions_start_time_idx ON sessions(start_time);
CREATE INDEX sessions_status_idx ON sessions(status);
