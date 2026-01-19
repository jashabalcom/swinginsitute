-- Create drills table (predefined drills for each phase/week)
CREATE TABLE public.drills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase TEXT NOT NULL,
  week INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 15,
  is_priority BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drill completions table (tracks user progress)
CREATE TABLE public.drill_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  drill_id UUID NOT NULL REFERENCES public.drills(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, drill_id)
);

-- Create video submissions table
CREATE TABLE public.video_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'needs_work')),
  coach_feedback TEXT,
  phase TEXT NOT NULL,
  week INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create phase progress table (tracks overall phase completion)
CREATE TABLE public.phase_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phase TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, phase)
);

-- Enable RLS on all tables
ALTER TABLE public.drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drill_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase_progress ENABLE ROW LEVEL SECURITY;

-- Drills are viewable by all authenticated users
CREATE POLICY "Authenticated users can view drills"
ON public.drills
FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage drills
CREATE POLICY "Admins can manage drills"
ON public.drills
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Drill completions policies
CREATE POLICY "Users can view their own completions"
ON public.drill_completions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions"
ON public.drill_completions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own completions"
ON public.drill_completions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Video submissions policies
CREATE POLICY "Users can view their own submissions"
ON public.video_submissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions"
ON public.video_submissions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
ON public.video_submissions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions"
ON public.video_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all submissions"
ON public.video_submissions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Phase progress policies
CREATE POLICY "Users can view their own progress"
ON public.phase_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress"
ON public.phase_progress
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Insert default drills for Phase 1
INSERT INTO public.drills (phase, week, title, description, is_priority, sort_order) VALUES
-- Phase 1, Week 1
('Phase 1: Foundation', 1, 'Load Sequence Drill', 'Focus on proper weight transfer during the load phase', true, 1),
('Phase 1: Foundation', 1, 'Hip Rotation Basics', 'Introduction to hip rotation mechanics', false, 2),
('Phase 1: Foundation', 1, 'Bat Path Awareness', 'Understanding the optimal bat path', false, 3),
('Phase 1: Foundation', 1, 'Tee Work: Center', 'Basic tee work focusing on center contact', false, 4),
-- Phase 1, Week 2
('Phase 1: Foundation', 2, 'Advanced Load Sequence', 'Building on week 1 load mechanics', true, 1),
('Phase 1: Foundation', 2, 'Hip Hinge Drill', 'Developing proper hip hinge for power', false, 2),
('Phase 1: Foundation', 2, 'Connection Drill', 'Maintaining bat-body connection', false, 3),
('Phase 1: Foundation', 2, 'Tee Work: Inside Pitch', 'Adjusting mechanics for inside pitches', false, 4),
-- Phase 1, Week 3
('Phase 1: Foundation', 3, 'Load to Launch Integration', 'Combining load with explosive launch', true, 1),
('Phase 1: Foundation', 3, 'Rotational Power Drill', 'Developing rotational power from ground up', false, 2),
('Phase 1: Foundation', 3, 'Exit Velocity Focus', 'Maximizing exit velocity with proper mechanics', false, 3),
('Phase 1: Foundation', 3, 'Live Tee Assessment', 'Full assessment of Phase 1 progress', false, 4),
-- Phase 2, Week 1
('Phase 2: Power Development', 1, 'Separation Drill', 'Creating proper hip-shoulder separation', true, 1),
('Phase 2: Power Development', 1, 'Barrel Whip', 'Developing bat speed through proper sequencing', false, 2),
('Phase 2: Power Development', 1, 'Medicine Ball Rotations', 'Building core rotational strength', false, 3),
-- Phase 2, Week 2
('Phase 2: Power Development', 2, 'Launch Angle Adjustment', 'Optimizing launch angle for power', true, 1),
('Phase 2: Power Development', 2, 'Overload/Underload Training', 'Bat speed development with varied weights', false, 2),
('Phase 2: Power Development', 2, 'Front Toss Power Reps', 'Applying power mechanics to live pitches', false, 3),
-- Phase 2, Week 3
('Phase 2: Power Development', 3, 'Game Speed Swings', 'Full speed swings with all mechanics', true, 1),
('Phase 2: Power Development', 3, 'Phase 2 Assessment', 'Complete assessment before advancing', false, 2),
-- Phase 3, Week 1
('Phase 3: Timing & Pitch Recognition', 1, 'Early Timing Drill', 'Getting the front foot down early', true, 1),
('Phase 3: Timing & Pitch Recognition', 1, 'Pitch Recognition Basics', 'Reading spin and location out of hand', false, 2),
('Phase 3: Timing & Pitch Recognition', 1, 'Tempo Training', 'Developing consistent swing tempo', false, 3),
-- Phase 3, Week 2
('Phase 3: Timing & Pitch Recognition', 2, 'Velocity Adjustment', 'Adjusting timing for different speeds', true, 1),
('Phase 3: Timing & Pitch Recognition', 2, 'Breaking Ball Recognition', 'Identifying off-speed early', false, 2),
-- Phase 3, Week 3
('Phase 3: Timing & Pitch Recognition', 3, 'Live At-Bat Simulation', 'Full at-bat scenarios with all pitches', true, 1),
('Phase 3: Timing & Pitch Recognition', 3, 'Phase 3 Assessment', 'Final assessment of complete swing system', false, 2);