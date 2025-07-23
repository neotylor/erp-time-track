
-- Create a table for time tracking sessions
CREATE TABLE public.time_tracking_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  laps JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_minutes INTEGER NOT NULL DEFAULT 0,
  break_count INTEGER NOT NULL DEFAULT 0,
  break_duration_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.time_tracking_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for time tracking sessions
CREATE POLICY "Users can view their own time tracking sessions" 
  ON public.time_tracking_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own time tracking sessions" 
  ON public.time_tracking_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time tracking sessions" 
  ON public.time_tracking_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time tracking sessions" 
  ON public.time_tracking_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX idx_time_tracking_sessions_user_date 
  ON public.time_tracking_sessions (user_id, date);
