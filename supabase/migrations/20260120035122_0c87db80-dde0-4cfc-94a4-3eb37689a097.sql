-- Create academy-videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('academy-videos', 'academy-videos', true);

-- RLS policy: Admins can upload academy videos
CREATE POLICY "Admins can upload academy videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'academy-videos' 
  AND public.has_role(auth.uid(), 'admin')
);

-- RLS policy: Admins can update academy videos
CREATE POLICY "Admins can update academy videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'academy-videos' 
  AND public.has_role(auth.uid(), 'admin')
);

-- RLS policy: Admins can delete academy videos
CREATE POLICY "Admins can delete academy videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'academy-videos' 
  AND public.has_role(auth.uid(), 'admin')
);

-- RLS policy: Anyone can view academy videos (for streaming)
CREATE POLICY "Anyone can view academy videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'academy-videos');

-- Add thumbnail column to lessons table
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;