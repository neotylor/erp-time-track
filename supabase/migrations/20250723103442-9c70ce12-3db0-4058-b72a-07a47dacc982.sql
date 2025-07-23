
-- Add target_minutes column to time_tracking_sessions table
ALTER TABLE public.time_tracking_sessions 
ADD COLUMN target_minutes INTEGER NOT NULL DEFAULT 480;

-- Update the index to include target_minutes for better performance
CREATE INDEX idx_time_tracking_sessions_user_date_target 
  ON public.time_tracking_sessions (user_id, date, target_minutes);
