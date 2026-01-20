-- Create phase_academy_links table to map phases to curriculum levels
CREATE TABLE public.phase_academy_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase TEXT NOT NULL,
  level_id UUID REFERENCES public.curriculum_levels(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.curriculum_modules(id) ON DELETE CASCADE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(phase, level_id, module_id)
);

-- Enable RLS
ALTER TABLE public.phase_academy_links ENABLE ROW LEVEL SECURITY;

-- Everyone can read phase-academy links
CREATE POLICY "Phase academy links are readable by all authenticated users"
ON public.phase_academy_links
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Only admins can manage links
CREATE POLICY "Only admins can manage phase academy links"
ON public.phase_academy_links
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert the phase-to-academy mappings based on your curriculum
INSERT INTO public.phase_academy_links (phase, level_id, description, sort_order)
SELECT 
  'Phase 1: Foundation',
  id,
  'Mental mastery and stance fundamentals',
  1
FROM public.curriculum_levels WHERE slug = 'inner-diamond'
ON CONFLICT DO NOTHING;

INSERT INTO public.phase_academy_links (phase, level_id, description, sort_order)
SELECT 
  'Phase 1: Foundation',
  id,
  'Core swing mechanics - stance and load',
  2
FROM public.curriculum_levels WHERE slug = 'swing-mechanics-mastery'
ON CONFLICT DO NOTHING;

INSERT INTO public.phase_academy_links (phase, level_id, description, sort_order)
SELECT 
  'Phase 2: Power Development',
  id,
  'Rotation and power mechanics',
  1
FROM public.curriculum_levels WHERE slug = 'swing-mechanics-mastery'
ON CONFLICT DO NOTHING;

INSERT INTO public.phase_academy_links (phase, level_id, description, sort_order)
SELECT 
  'Phase 3: Timing & Recognition',
  id,
  'Pitch tracking and timing',
  1
FROM public.curriculum_levels WHERE slug = 'drill-library'
ON CONFLICT DO NOTHING;

INSERT INTO public.phase_academy_links (phase, level_id, description, sort_order)
SELECT 
  'Phase 4: Contact & Adjustment',
  id,
  'Barrel control drills',
  1
FROM public.curriculum_levels WHERE slug = 'drill-library'
ON CONFLICT DO NOTHING;

INSERT INTO public.phase_academy_links (phase, level_id, description, sort_order)
SELECT 
  'Phase 5: Game Integration',
  id,
  'Strategy and competition',
  1
FROM public.curriculum_levels WHERE slug = 'pro-track'
ON CONFLICT DO NOTHING;

-- Add phase_transition_approved field to track coach approval for phase changes
ALTER TABLE public.video_submissions 
ADD COLUMN IF NOT EXISTS is_phase_transition BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_for_advancement BOOLEAN DEFAULT false;