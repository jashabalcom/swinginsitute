-- Create channels table
CREATE TABLE public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'message-square',
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Channels are viewable by all authenticated users
CREATE POLICY "Authenticated users can view channels"
ON public.channels
FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage channels
CREATE POLICY "Admins can manage channels"
ON public.channels
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Messages policies
CREATE POLICY "Authenticated users can view messages"
ON public.messages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
ON public.messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create trigger for message timestamps
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Insert default channels
INSERT INTO public.channels (name, slug, description, icon) VALUES
  ('Announcements', 'announcements', 'Important updates from Coach Jasha', 'megaphone'),
  ('Weekly Focus', 'weekly-focus', 'This week''s training priorities and drills', 'target'),
  ('Player Wins', 'player-wins', 'Celebrate your progress and achievements', 'trophy'),
  ('Q&A with Coach', 'qa-coach', 'Ask Coach Jasha your training questions', 'help-circle'),
  ('Parents Room', 'parents-room', 'Discussion space for parents and guardians', 'users');