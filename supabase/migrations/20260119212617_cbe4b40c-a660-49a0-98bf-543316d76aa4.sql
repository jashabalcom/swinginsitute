-- Create mentions table to track mentions in messages
CREATE TABLE public.mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  mentioned_user_id UUID NOT NULL,
  mentioner_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'mention',
  title TEXT NOT NULL,
  content TEXT,
  link TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Mentions policies
CREATE POLICY "Users can view mentions"
ON public.mentions FOR SELECT
USING (true);

CREATE POLICY "Users can create mentions in their messages"
ON public.mentions FOR INSERT
WITH CHECK (auth.uid() = mentioner_user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;