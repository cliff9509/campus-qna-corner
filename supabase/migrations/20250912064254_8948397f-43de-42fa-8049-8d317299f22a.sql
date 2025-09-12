-- Create storage bucket for marketplace item images
INSERT INTO storage.buckets (id, name, public) VALUES ('marketplace-images', 'marketplace-images', true);

-- Create RLS policies for marketplace images storage
CREATE POLICY "Anyone can view marketplace images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'marketplace-images');

CREATE POLICY "Authenticated users can upload marketplace images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'marketplace-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own marketplace images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'marketplace-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own marketplace images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'marketplace-images' AND auth.uid()::text = (storage.foldername(name))[1]);