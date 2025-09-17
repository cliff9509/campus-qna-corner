-- Update accommodations table to support multiple images
ALTER TABLE public.accommodations 
DROP COLUMN IF EXISTS image_url;

ALTER TABLE public.accommodations 
ADD COLUMN image_urls text[] DEFAULT '{}';

-- Update storage policies for accommodation images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('accommodation-images', 'accommodation-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for accommodation image uploads
CREATE POLICY "Users can view accommodation images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'accommodation-images');

CREATE POLICY "Authenticated users can upload accommodation images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'accommodation-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own accommodation images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'accommodation-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own accommodation images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'accommodation-images' AND auth.uid() IS NOT NULL);