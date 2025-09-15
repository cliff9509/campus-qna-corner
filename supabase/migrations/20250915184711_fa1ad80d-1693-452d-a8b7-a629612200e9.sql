-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.validate_marketplace_item()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;