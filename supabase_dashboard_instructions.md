# Updating Your Supabase Database Schema

Follow these steps to add the missing columns to your database tables using the Supabase dashboard:

## 1. Log in to Supabase Dashboard

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Log in with your credentials
3. Select your project

## 2. Open SQL Editor

1. In the left sidebar, click on "SQL Editor"
2. Click "New Query" to create a new SQL query

## 3. Execute the Following SQL

Copy and paste this SQL into the editor and click "Run":

```sql
-- Add missing columns to tutor_profiles table
ALTER TABLE tutor_profiles 
ADD COLUMN IF NOT EXISTS qualifications text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS total_sessions integer DEFAULT 0;

-- Update sessions table to include additional fields
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS duration integer,
ADD COLUMN IF NOT EXISTS rating decimal(3,2),
ADD COLUMN IF NOT EXISTS feedback text;

-- Create earnings table if it doesn't exist
CREATE TABLE IF NOT EXISTS earnings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id uuid REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

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
```

## 4. Fix Row-Level Security (RLS) Policies

The error "new row violates row-level security policy for table sessions" occurs because your database has RLS enabled, but the policies aren't properly configured to allow session creation.

### First, enable RLS on all tables if not already enabled:

1. In the left sidebar, click on "Authentication" then "Policies"
2. For each table (`sessions`, `tutor_profiles`, `student_profiles`, `earnings`), make sure RLS is enabled
3. If not enabled, click the toggle to enable it

### Then, create the following policies for the sessions table:

1. In the left sidebar, click on "Authentication" then "Policies"
2. Find the "sessions" table in the list
3. **Delete any existing policies** that might be conflicting
4. Click "New Policy"
5. Create a policy for inserting new sessions:

   - Policy name: `Allow students to create sessions`
   - Policy definition: Select "Create custom policy"
   - Using expression: 
     ```sql
     auth.uid() IN (
       SELECT user_id FROM student_profiles WHERE id = student_id
     )
     ```
   - Target roles: Leave blank (applies to all authenticated users)
   - Check only the "INSERT" operation
   - Click "Save Policy"

6. Create a policy for tutors to view and update sessions:

   - Policy name: `Allow tutors to view and update their sessions`
   - Policy definition: Select "Create custom policy"
   - Using expression: 
     ```sql
     auth.uid() IN (
       SELECT user_id FROM tutor_profiles WHERE id = tutor_id
     )
     ```
   - Target roles: Leave blank (applies to all authenticated users)
   - Check the "SELECT" and "UPDATE" operations
   - Click "Save Policy"

7. Create a policy for students to view their sessions:

   - Policy name: `Allow students to view their sessions`
   - Policy definition: Select "Create custom policy"
   - Using expression: 
     ```sql
     auth.uid() IN (
       SELECT user_id FROM student_profiles WHERE id = student_id
     )
     ```
   - Target roles: Leave blank (applies to all authenticated users)
   - Check the "SELECT" operation
   - Click "Save Policy"

### Create policies for the earnings table:

1. Click "New Policy" for the earnings table
2. Create a policy for tutors to view their earnings:

   - Policy name: `Allow tutors to view their earnings`
   - Policy definition: Select "Create custom policy"
   - Using expression: 
     ```sql
     auth.uid() IN (
       SELECT user_id FROM tutor_profiles WHERE id = tutor_id
     )
     ```
   - Target roles: Leave blank (applies to all authenticated users)
   - Check the "SELECT" operation
   - Click "Save Policy"

## 5. Enable Realtime for Tables

To ensure realtime updates work properly:

1. In the left sidebar, click on "Database" then "Replication"
2. Find the "Realtime" section
3. Make sure the following tables have realtime enabled:
   - `sessions`
   - `tutor_profiles`
   - `student_profiles`
   - `earnings`
4. If not enabled, select the tables and click "Enable realtime"
5. Click "Save" to apply the changes

## 6. Create Database Triggers for Realtime Updates

To ensure timestamps are updated correctly:

1. In the SQL Editor, run the following SQL:

```sql
-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
DROP TRIGGER IF EXISTS sessions_update_timestamp ON sessions;
CREATE TRIGGER sessions_update_timestamp
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

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

DROP TRIGGER IF EXISTS earnings_update_timestamp ON earnings;
CREATE TRIGGER earnings_update_timestamp
BEFORE UPDATE ON earnings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

## 7. Verify the Changes

1. In the left sidebar, click on "Table Editor"
2. Check each table to confirm the new columns are added
3. Check that the `earnings` table has been created
4. Verify that RLS policies are properly set up by going to "Authentication" > "Policies"

## 8. Test the Application

After making these changes, test your application to ensure:

1. Students can successfully schedule sessions
2. Tutors can view and update their sessions
3. Realtime updates work correctly when sessions are created or updated

If you encounter any issues, check the browser console for errors and verify that the RLS policies are correctly configured.

## 9. Creating a New Supabase Project (If Needed)

If you need to create a new Supabase project from scratch:

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Click "New Project"
3. Enter a name for your project
4. Create a secure database password (save this somewhere safe)
5. Choose a region close to your users
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)
8. Once created, go to "Project Settings" > "API" to get your API keys
9. Update your application's environment variables with the new API keys
10. Run the SQL from Step 3 to create all necessary tables and columns
11. Set up RLS policies as described in Step 4
12. Enable Realtime as described in Step 5
13. Create triggers as described in Step 6

Remember to update your application's environment variables (.env or .env.local file) with the new Supabase URL and anon key.
