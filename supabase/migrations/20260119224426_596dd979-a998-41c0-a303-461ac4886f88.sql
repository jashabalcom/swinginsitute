-- Add 'parent' value to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'parent';

-- Create curriculum_levels table (the 4 main levels)
CREATE TABLE public.curriculum_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'book',
  is_locked BOOLEAN DEFAULT false,
  required_tiers TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create curriculum_modules table (modules within each level)
CREATE TABLE public.curriculum_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID REFERENCES public.curriculum_levels(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(level_id, slug)
);

-- Create lessons table (individual lessons with video content)
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.curriculum_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_duration_seconds INTEGER,
  worksheet_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create lesson_completions table (track user progress)
CREATE TABLE public.lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  watch_progress_percent INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- Create events table (live events calendar)
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'skills',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  zoom_link TEXT,
  replay_url TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT true,
  required_tiers TEXT[] DEFAULT '{}',
  max_attendees INTEGER,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create event_registrations table (track RSVPs)
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  reminder_sent BOOLEAN DEFAULT false,
  UNIQUE(event_id, user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.curriculum_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for curriculum_levels
CREATE POLICY "Anyone can view curriculum levels"
ON public.curriculum_levels FOR SELECT
USING (true);

CREATE POLICY "Admins can manage curriculum levels"
ON public.curriculum_levels FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for curriculum_modules
CREATE POLICY "Anyone can view curriculum modules"
ON public.curriculum_modules FOR SELECT
USING (true);

CREATE POLICY "Admins can manage curriculum modules"
ON public.curriculum_modules FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for lessons
CREATE POLICY "Anyone can view lessons"
ON public.lessons FOR SELECT
USING (true);

CREATE POLICY "Admins can manage lessons"
ON public.lessons FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for lesson_completions
CREATE POLICY "Users can view their own completions"
ON public.lesson_completions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions"
ON public.lesson_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own completions"
ON public.lesson_completions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all completions"
ON public.lesson_completions FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for events
CREATE POLICY "Anyone can view public events"
ON public.events FOR SELECT
USING (is_public = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage events"
ON public.events FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations"
ON public.event_registrations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
ON public.event_registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations"
ON public.event_registrations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations"
ON public.event_registrations FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all registrations"
ON public.event_registrations FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Enable realtime for events
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_registrations;

-- Seed initial curriculum levels
INSERT INTO public.curriculum_levels (level_number, title, slug, description, icon, is_locked, required_tiers, sort_order) VALUES
(1, 'Inner Diamond', 'inner-diamond', 'Build elite mindset, emotional control, confidence, identity, and parent alignment before mechanics.', 'diamond', false, '{}', 1),
(2, 'Swing Mechanics Mastery', 'swing-mechanics', 'Learn a repeatable, professional-level swing from the ground up.', 'target', false, '{}', 2),
(3, 'Drill Library & Training', 'drill-library', 'Turn mechanics into habits through structured reps and progressions.', 'dumbbell', false, '{}', 3),
(4, 'Baseball IQ & Pro Track', 'pro-track', 'Develop thinking hitters who understand the game at a pro level.', 'brain', true, ARRAY['pro', 'elite'], 4);

-- Seed modules for Level 1: Inner Diamond
INSERT INTO public.curriculum_modules (level_id, title, slug, description, sort_order)
SELECT id, 'Identity & Confidence', 'identity-confidence', 'Build your identity as an elite ballplayer', 1 FROM public.curriculum_levels WHERE level_number = 1
UNION ALL
SELECT id, 'Self-Belief & Visualization', 'self-belief', 'Master visualization techniques used by pros', 2 FROM public.curriculum_levels WHERE level_number = 1
UNION ALL
SELECT id, 'Handling Failure & Pressure', 'failure-pressure', 'Turn setbacks into stepping stones', 3 FROM public.curriculum_levels WHERE level_number = 1
UNION ALL
SELECT id, 'Emotional Control', 'emotional-control', 'Stay composed under pressure', 4 FROM public.curriculum_levels WHERE level_number = 1
UNION ALL
SELECT id, 'Focus & Consistency', 'focus-consistency', 'Build unshakeable focus', 5 FROM public.curriculum_levels WHERE level_number = 1
UNION ALL
SELECT id, 'Parent Partnership', 'parent-partnership', 'Parents as performance partners', 6 FROM public.curriculum_levels WHERE level_number = 1;

-- Seed modules for Level 2: Swing Mechanics
INSERT INTO public.curriculum_modules (level_id, title, slug, description, sort_order)
SELECT id, 'Foundation of a Pro Swing', 'pro-swing-foundation', 'Understanding the mechanics that matter', 1 FROM public.curriculum_levels WHERE level_number = 2
UNION ALL
SELECT id, 'Stance & Balance', 'stance-balance', 'Build a solid foundation', 2 FROM public.curriculum_levels WHERE level_number = 2
UNION ALL
SELECT id, 'Load & Separation', 'load-separation', 'Create power through proper loading', 3 FROM public.curriculum_levels WHERE level_number = 2
UNION ALL
SELECT id, 'Rotation & Power', 'rotation-power', 'Generate explosive rotational force', 4 FROM public.curriculum_levels WHERE level_number = 2
UNION ALL
SELECT id, 'Extension & Finish', 'extension-finish', 'Complete the swing with authority', 5 FROM public.curriculum_levels WHERE level_number = 2
UNION ALL
SELECT id, 'Common Swing Flaws', 'swing-flaws', 'Quick fixes for common issues', 6 FROM public.curriculum_levels WHERE level_number = 2;

-- Seed modules for Level 4: Pro Track
INSERT INTO public.curriculum_modules (level_id, title, slug, description, sort_order)
SELECT id, 'Reading Pitchers', 'reading-pitchers', 'Anticipate what''s coming', 1 FROM public.curriculum_levels WHERE level_number = 4
UNION ALL
SELECT id, 'Plate Approach by Count', 'plate-approach', 'Strategic hitting by situation', 2 FROM public.curriculum_levels WHERE level_number = 4
UNION ALL
SELECT id, 'Situational Hitting', 'situational-hitting', 'Execute in clutch moments', 3 FROM public.curriculum_levels WHERE level_number = 4
UNION ALL
SELECT id, 'Game Preparation', 'game-prep', 'Pre-game routines that work', 4 FROM public.curriculum_levels WHERE level_number = 4
UNION ALL
SELECT id, 'Advanced At-Bat Strategy', 'atbat-strategy', 'Think like a pro at the plate', 5 FROM public.curriculum_levels WHERE level_number = 4
UNION ALL
SELECT id, 'Pro Track Game Plan', 'pro-game-plan', 'Your roadmap to the next level', 6 FROM public.curriculum_levels WHERE level_number = 4;