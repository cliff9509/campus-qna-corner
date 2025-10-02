-- ============================================
-- SECURITY FIX: Implement proper role-based access control
-- ============================================

-- 1. Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'landlord', 'student');

-- 2. Create user_roles table with proper constraints
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, created_by)
SELECT 
  user_id,
  CASE 
    WHEN role = 'admin' THEN 'admin'::public.app_role
    WHEN role = 'landlord' THEN 'landlord'::public.app_role
    WHEN role = 'moderator' THEN 'moderator'::public.app_role
    ELSE 'student'::public.app_role
  END,
  user_id
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 5. RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Remove role column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- ============================================
-- SECURITY FIX: Protect contact information exposure
-- ============================================

-- 7. Create public view for marketplace items (hides contact info)
CREATE OR REPLACE VIEW public.marketplace_items_public AS
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

-- Grant access to anon users
GRANT SELECT ON public.marketplace_items_public TO anon;
GRANT SELECT ON public.marketplace_items_public TO authenticated;

-- 8. Create public view for accommodations (hides contact info)
CREATE OR REPLACE VIEW public.accommodations_public AS
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

-- Grant access to anon users
GRANT SELECT ON public.accommodations_public TO anon;
GRANT SELECT ON public.accommodations_public TO authenticated;

-- 9. Function to get accommodation contact (authenticated users only)
CREATE OR REPLACE FUNCTION public.get_accommodation_contact(accommodation_id UUID)
RETURNS TABLE(contact_phone TEXT, contact_email TEXT, landlord_id UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT contact_phone, contact_email, landlord_id
  FROM public.accommodations
  WHERE id = accommodation_id
    AND auth.uid() IS NOT NULL;
$$;

-- 10. Function to get marketplace item contact (authenticated users only)
CREATE OR REPLACE FUNCTION public.get_marketplace_contact(item_id UUID)
RETURNS TABLE(seller_name TEXT, seller_contact TEXT, user_id UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT seller_name, seller_contact, user_id
  FROM public.marketplace_items
  WHERE id = item_id
    AND status = 'active'
    AND auth.uid() IS NOT NULL;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.has_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_accommodation_contact TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_marketplace_contact TO authenticated;