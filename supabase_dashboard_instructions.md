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

-- Create earnings table
CREATE TABLE IF NOT EXISTS earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid')) DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies for earnings table
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- Policy to allow tutors to view their own earnings
CREATE POLICY "Tutors can view their own earnings"
  ON earnings FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM tutor_profiles WHERE id = tutor_id
  ));

-- Policy to allow tutors to update their own earnings
CREATE POLICY "Tutors can update their own earnings"
  ON earnings FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM tutor_profiles WHERE id = tutor_id
  ));

-- Create trigger for earnings updated_at
CREATE TRIGGER update_earnings_updated_at
  BEFORE UPDATE ON earnings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Add indexes for earnings table
CREATE INDEX earnings_tutor_id_idx ON earnings(tutor_id);
CREATE INDEX earnings_status_idx ON earnings(status);
CREATE INDEX earnings_created_at_idx ON earnings(created_at);
```

## 4. Verify the Changes

1. In the left sidebar, click on "Table Editor"
2. Check the `tutor_profiles` table to confirm the new columns are added
3. Check that the `earnings` table has been created

## 5. Update the DatabaseService Allowed Fields

After updating the database schema, make sure to update the `allowedFields` array in your `DatabaseService.ts` file to include all the new fields:

```typescript
const allowedFields = [
  'name', 'email', 'bio', 'subjects', 'hourly_rate', 
  'availability', 'rating', 'image_url', 'video_url',
  'qualifications', 'full_name', 'total_sessions'
];
```

This will ensure that all fields can be properly updated in the database.
