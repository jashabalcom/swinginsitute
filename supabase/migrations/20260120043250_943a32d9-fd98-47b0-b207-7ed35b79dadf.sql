-- Add hybrid credits columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS hybrid_credits_remaining integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hybrid_credits_reset_date timestamp with time zone;

-- Add comment explaining the columns
COMMENT ON COLUMN public.profiles.hybrid_credits_remaining IS 'Number of in-person lesson credits remaining for hybrid members';
COMMENT ON COLUMN public.profiles.hybrid_credits_reset_date IS 'Date when hybrid credits were last reset (monthly)';