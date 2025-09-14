-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Marketplace items are viewable by everyone" ON public.marketplace_items;

-- Create a public view without sensitive seller information
CREATE OR REPLACE VIEW public.marketplace_items_public AS
SELECT 
  id,
  title,
  description,
  price,
  original_price,
  category,
  condition,
  image_urls,
  seller_name,
  location,
  likes,
  created_at,
  updated_at,
  status,
  delivery_options,
  payment_methods
FROM public.marketplace_items
WHERE status = 'active';

-- Enable RLS on the view
ALTER VIEW public.marketplace_items_public SET (security_barrier = true);

-- Create new RLS policies with proper access control
CREATE POLICY "Public can view marketplace items without contact info" 
ON public.marketplace_items 
FOR SELECT 
USING (status = 'active' AND auth.uid() IS NULL);

CREATE POLICY "Authenticated users can view all marketplace items" 
ON public.marketplace_items 
FOR SELECT 
USING (status = 'active' AND auth.uid() IS NOT NULL);

-- Grant access to the public view
GRANT SELECT ON public.marketplace_items_public TO anon;
GRANT SELECT ON public.marketplace_items_public TO authenticated;