-- Create student_insights table
CREATE TABLE IF NOT EXISTS public.student_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tutor_id UUID NOT NULL REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(tutor_id, student_id)
);

-- Add RLS policies
ALTER TABLE public.student_insights ENABLE ROW LEVEL SECURITY;

-- Policy for tutors to view their own student insights
CREATE POLICY "Tutors can view their own student insights"
    ON public.student_insights
    FOR SELECT
    TO authenticated
    USING (
        tutor_id IN (
            SELECT id FROM public.tutor_profiles
            WHERE user_id = auth.uid()
        )
    );

-- Policy for tutors to insert their own student insights
CREATE POLICY "Tutors can insert their own student insights"
    ON public.student_insights
    FOR INSERT
    TO authenticated
    WITH CHECK (
        tutor_id IN (
            SELECT id FROM public.tutor_profiles
            WHERE user_id = auth.uid()
        )
    );

-- Policy for tutors to update their own student insights
CREATE POLICY "Tutors can update their own student insights"
    ON public.student_insights
    FOR UPDATE
    TO authenticated
    USING (
        tutor_id IN (
            SELECT id FROM public.tutor_profiles
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        tutor_id IN (
            SELECT id FROM public.tutor_profiles
            WHERE user_id = auth.uid()
        )
    );

-- Policy for tutors to delete their own student insights
CREATE POLICY "Tutors can delete their own student insights"
    ON public.student_insights
    FOR DELETE
    TO authenticated
    USING (
        tutor_id IN (
            SELECT id FROM public.tutor_profiles
            WHERE user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.student_insights
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add indexes for better query performance
CREATE INDEX idx_student_insights_tutor_id ON public.student_insights(tutor_id);
CREATE INDEX idx_student_insights_student_id ON public.student_insights(student_id);
CREATE INDEX idx_student_insights_created_at ON public.student_insights(created_at); 