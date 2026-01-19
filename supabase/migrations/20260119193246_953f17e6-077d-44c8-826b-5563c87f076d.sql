-- Create storage bucket for swing videos
INSERT INTO storage.buckets (id, name, public) VALUES ('swing-videos', 'swing-videos', true);

-- Storage policies for swing videos
CREATE POLICY "Users can upload their own videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'swing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'swing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'swing-videos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'swing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);