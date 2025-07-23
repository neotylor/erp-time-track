
-- Add target_minutes column to time_tracking_sessions table
ALTER TABLE public.time_tracking_sessions 
ADD COLUMN target_minutes INTEGER NOT NULL DEFAULT 480;
