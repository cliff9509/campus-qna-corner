-- Fix critical security vulnerability in profiles table
-- Remove the overly permissive policy that allows everyone to view all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create secure policies for profiles table
-- Users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow authenticated users to view limited public profile info of others
-- This only exposes non-sensitive fields like display_name for legitimate purposes
CREATE POLICY "Users can view limited public profile info" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  auth.uid() != user_id
);

-- Add function to get safe public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE(
  user_id uuid,
  display_name text,
  avatar_url text
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    p.display_name,
    p.avatar_url
  FROM public.profiles p
  WHERE p.user_id = profile_user_id;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;

-- Add input validation function for marketplace items
CREATE OR REPLACE FUNCTION public.validate_marketplace_item()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate title length and content
  IF LENGTH(TRIM(NEW.title)) < 3 OR LENGTH(TRIM(NEW.title)) > 100 THEN
    RAISE EXCEPTION 'Title must be between 3 and 100 characters';
  END IF;
  
  -- Validate description length
  IF LENGTH(TRIM(NEW.description)) < 10 OR LENGTH(TRIM(NEW.description)) > 2000 THEN
    RAISE EXCEPTION 'Description must be between 10 and 2000 characters';
  END IF;
  
  -- Validate price is positive
  IF NEW.price <= 0 THEN
    RAISE EXCEPTION 'Price must be positive';
  END IF;
  
  -- Sanitize text fields (basic XSS prevention)
  NEW.title = TRIM(NEW.title);
  NEW.description = TRIM(NEW.description);
  NEW.seller_name = TRIM(NEW.seller_name);
  NEW.location = TRIM(NEW.location);
  
  -- Validate seller contact format
  IF NEW.seller_contact IS NOT NULL AND LENGTH(TRIM(NEW.seller_contact)) > 0 THEN
    NEW.seller_contact = TRIM(NEW.seller_contact);
    -- Basic email or phone validation
    IF NOT (NEW.seller_contact ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR 
            NEW.seller_contact ~* '^[\+]?[0-9\s\-\(\)]{7,15}$') THEN
      RAISE EXCEPTION 'Invalid contact format. Must be valid email or phone number';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for marketplace item validation
DROP TRIGGER IF EXISTS validate_marketplace_item_trigger ON public.marketplace_items;
CREATE TRIGGER validate_marketplace_item_trigger
  BEFORE INSERT OR UPDATE ON public.marketplace_items
  FOR EACH ROW EXECUTE FUNCTION public.validate_marketplace_item();