-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    hourly_rate DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(tutor_id, date, time)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_tutor_date ON public.bookings(tutor_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings(student_id);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tutors can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = tutor_id);

CREATE POLICY "Students can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Tutors can update their bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = tutor_id);

CREATE POLICY "Students can update their bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = student_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 