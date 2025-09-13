-- Add payment and delivery information fields to marketplace_items table
ALTER TABLE public.marketplace_items 
ADD COLUMN payment_methods TEXT[] DEFAULT ARRAY['Cash', 'Bank Transfer'],
ADD COLUMN delivery_options TEXT[] DEFAULT ARRAY['Campus Pickup', 'Meet in Person'],
ADD COLUMN delivery_notes TEXT;