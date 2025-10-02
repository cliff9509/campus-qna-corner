-- Fix security definer warnings by explicitly making views SECURITY INVOKER
-- Views should use the permissions of the calling user, not the creator

-- Recreate marketplace items public view as SECURITY INVOKER
CREATE OR REPLACE VIEW public.marketplace_items_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  title,
  price,
  likes,
  original_price,
  category,
  condition,
  description,
  image_urls,
  location,
  status,
  payment_methods,
  delivery_options,
  delivery_notes,
  created_at,
  updated_at
FROM public.marketplace_items
WHERE status = 'active';

-- Recreate accommodations public view as SECURITY INVOKER
CREATE OR REPLACE VIEW public.accommodations_public
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  location,
  room_type,
  price,
  capacity,
  rating,
  available,
  amenities,
  description,
  image_urls,
  created_at,
  updated_at
FROM public.accommodations
WHERE available = true;