-- Fix the security definer view issue by recreating without security_barrier
DROP VIEW IF EXISTS public.marketplace_items_public;

-- Create a regular view without security definer
CREATE VIEW public.marketplace_items_public AS
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

-- Grant proper access to the view
GRANT SELECT ON public.marketplace_items_public TO anon;
GRANT SELECT ON public.marketplace_items_public TO authenticated;