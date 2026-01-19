-- Add is_free_tier column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_free_tier BOOLEAN DEFAULT false;

-- Insert Mindset Coaching service type
INSERT INTO public.service_types (name, description, duration_minutes, base_price, member_price, max_participants, is_active, service_type)
VALUES ('Mindset Coaching', '30-minute mental game session with Coach Jasha focusing on confidence, focus, and competitive mindset.', 30, 75, 75, 1, true, 'lesson')
ON CONFLICT DO NOTHING;