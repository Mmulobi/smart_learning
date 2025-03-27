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
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS image_url text;
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

### Create policies for the student_profiles table:

1. Find the "student_profiles" table in the list
2. **Delete any existing policies** that might be conflicting
3. Click "New Policy"
4. Create a policy for students to manage their own profiles:

   - Policy name: `Allow users to manage their own student profiles`
   - Policy definition: Select "Create custom policy"
   - Using expression: 
     ```sql
     auth.uid() = user_id
     ```
   - Target roles: Leave blank (applies to all authenticated users)
   - Check all operations: "SELECT", "INSERT", "UPDATE", and "DELETE"
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

## 5. Create Storage Bucket for Profile Images

The application needs a storage bucket to store profile images:

1. In the left sidebar, click on "Storage"
2. Click "Create bucket"
3. Enter the following details:
   - Name: `profiles` (this exact name is required)
   - Access: Choose "Public" to allow images to be publicly accessible
   - Enable RLS: Yes (to control access through policies)
4. Click "Create bucket"

### Set up Storage Bucket Policies

1. After creating the bucket, click on the "profiles" bucket
2. Go to the "Policies" tab
3. Click "Create policy"
4. Create a policy for users to manage their own profile images:
   - Policy name: `Allow users to manage their own profile images`
   - Policy definition: Select "Create custom policy"
   - Using expression: 
     ```sql
     (auth.uid() = (SELECT user_id FROM student_profiles WHERE id::text = (storage.foldername)[1])) OR
     (auth.uid() = (SELECT user_id FROM tutor_profiles WHERE id::text = (storage.foldername)[1]))
     ```
   - Target roles: Leave blank (applies to all authenticated users)
   - Check all operations: "SELECT", "INSERT", "UPDATE", and "DELETE"
   - Click "Save Policy"

## 6. Enable Realtime for Tables

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

## 7. Create Database Triggers for Realtime Updates

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

## 8. Verify the Changes

1. In the left sidebar, click on "Table Editor"
2. Check each table to confirm the new columns are added
3. Check that the `earnings` table has been created
4. Verify that RLS policies are properly set up by going to "Authentication" > "Policies"
5. Verify that the storage bucket "profiles" has been created and has the correct policies

## 9. Test the Application

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

# Supabase Dashboard Setup Instructions

## 1. React Router Warnings Resolution

### Warning 1: React Router Future Flag Warning (startTransition)
This warning indicates that React Router v7 will use `React.startTransition` for state updates. To resolve this:

1. Open your `vite.config.ts` file
2. Add the following configuration:
```typescript
export default defineConfig({
  // ... other config
  define: {
    'process.env.REACT_ROUTER_FUTURE_FLAGS': JSON.stringify({
      v7_startTransition: true
    })
  }
});
```

### Warning 2: Relative Route Resolution Warning
This warning is about changes in route resolution within Splat routes in v7. To resolve:

1. Open your `vite.config.ts` file
2. Add the following configuration:
```typescript
export default defineConfig({
  // ... other config
  define: {
    'process.env.REACT_ROUTER_FUTURE_FLAGS': JSON.stringify({
      v7_relativeSplatPath: true
    })
  }
});
```

## 2. Supabase Database Setup

### Error: "relation 'public.resources' does not exist"
This error occurs because the resources table hasn't been created in your Supabase database. Follow these steps to create it:

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create the resources table by running this SQL:

```sql
-- Create the resources table
CREATE TABLE public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    subject TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    student_ids UUID[] DEFAULT '{}'
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tutors can manage their own resources"
    ON public.resources
    FOR ALL
    USING (auth.uid() = tutor_id);

CREATE POLICY "Students can view public resources"
    ON public.resources
    FOR SELECT
    USING (is_public = true);

CREATE POLICY "Students can view shared resources"
    ON public.resources
    FOR SELECT
    USING (auth.uid() = ANY(student_ids));

-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tutor-resources', 'tutor-resources', true);

-- Set up storage policies
CREATE POLICY "Tutors can upload resources"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'tutor-resources' AND
        auth.uid() = (SELECT user_id FROM public.tutor_profiles WHERE id = (storage.foldername(name))[1]::uuid)
    );

CREATE POLICY "Anyone can view resources"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'tutor-resources');
```

4. After running the SQL, verify the table was created:
   - Go to Table Editor in Supabase
   - Check that the `resources` table exists
   - Verify the columns and policies are set up correctly

## 3. React DevTools Installation

To install React DevTools for better development experience:

1. For Chrome:
   - Visit [Chrome Web Store](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - Click "Add to Chrome"
   - Follow the installation prompts

2. For Firefox:
   - Visit [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/react-developer-tools/)
   - Click "Add to Firefox"
   - Follow the installation prompts

## 4. Verify Setup

After completing the above steps:

1. Restart your development server
2. Clear your browser cache
3. Check the browser console for any remaining errors
4. Test the resources functionality in both tutor and student dashboards

## 5. Troubleshooting

If you still encounter issues:

1. Check Supabase connection:
   - Verify your environment variables are set correctly
   - Ensure your Supabase project is active
   - Check if you have the correct permissions

2. Database issues:
   - Verify the table was created successfully
   - Check if the RLS policies are working
   - Ensure the storage bucket exists

3. React Router issues:
   - Clear your browser cache
   - Check if the future flags are properly set
   - Verify your React Router version is compatible

## 6. Update the storage bucket configuration
UPDATE storage.buckets
SET public = true,
    file_size_limit = 10485760, -- 10MB in bytes
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip'
    ]
WHERE id = 'tutor-resources';

## 7. Update the storage policy to be more permissive for file uploads
DROP POLICY IF EXISTS "Tutors can upload files" ON storage.objects;
CREATE POLICY "Tutors can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'tutor-resources' AND
    auth.uid() = (SELECT user_id FROM public.tutor_profiles WHERE id = (storage.foldername(name))[1]::uuid)
    AND
    (storage.foldername(name))[1]::uuid IN (
        SELECT id FROM public.tutor_profiles WHERE user_id = auth.uid()
    )
);

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Tutors can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view resources" ON storage.objects;
DROP POLICY IF EXISTS "Tutors can manage their own resources" ON public.resources;
DROP POLICY IF EXISTS "Students can view public resources" ON public.resources;
DROP POLICY IF EXISTS "Students can view shared resources" ON public.resources;

-- Enable RLS on the resources table
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create new policies for the resources table
CREATE POLICY "Enable insert for tutors"
ON public.resources
FOR INSERT
WITH CHECK (
    auth.uid() IN (
        SELECT user_id FROM public.tutor_profiles WHERE id = tutor_id
    )
);

CREATE POLICY "Enable select for tutors"
ON public.resources
FOR SELECT
USING (
    auth.uid() IN (
        SELECT user_id FROM public.tutor_profiles WHERE id = tutor_id
    )
);

CREATE POLICY "Enable delete for tutors"
ON public.resources
FOR DELETE
USING (
    auth.uid() IN (
        SELECT user_id FROM public.tutor_profiles WHERE id = tutor_id
    )
);

CREATE POLICY "Enable update for tutors"
ON public.resources
FOR UPDATE
USING (
    auth.uid() IN (
        SELECT user_id FROM public.tutor_profiles WHERE id = tutor_id
    )
);

-- Create policies for students to view resources
CREATE POLICY "Enable select for students"
ON public.resources
FOR SELECT
USING (
    is_public = true OR
    auth.uid() IN (
        SELECT user_id FROM public.student_profiles WHERE id = ANY(student_ids)
    )
);

-- Update storage bucket configuration
UPDATE storage.buckets
SET public = true,
    file_size_limit = 10485760, -- 10MB in bytes
    allowed_mime_types = ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip'
    ]
WHERE id = 'tutor-resources';

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create new storage policies
CREATE POLICY "Enable upload for tutors"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'tutor-resources' AND
    auth.uid() IN (
        SELECT user_id FROM public.tutor_profiles 
        WHERE id::text = (storage.foldername(name))[1]
    )
);

CREATE POLICY "Enable delete for tutors"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'tutor-resources' AND
    auth.uid() IN (
        SELECT user_id FROM public.tutor_profiles 
        WHERE id::text = (storage.foldername(name))[1]
    )
);

CREATE POLICY "Enable select for everyone"
ON storage.objects
FOR SELECT
USING (bucket_id = 'tutor-resources');
