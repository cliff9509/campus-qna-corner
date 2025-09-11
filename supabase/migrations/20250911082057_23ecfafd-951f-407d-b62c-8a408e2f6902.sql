-- Create marketplace_items table
CREATE TABLE public.marketplace_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  category TEXT NOT NULL,
  condition TEXT NOT NULL,
  description TEXT NOT NULL,
  image_urls TEXT[],
  seller_name TEXT NOT NULL,
  seller_contact TEXT NOT NULL,
  location TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

-- Create policies for marketplace items
CREATE POLICY "Marketplace items are viewable by everyone" 
ON public.marketplace_items 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can create their own marketplace items" 
ON public.marketplace_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketplace items" 
ON public.marketplace_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own marketplace items" 
ON public.marketplace_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_marketplace_items_updated_at
BEFORE UPDATE ON public.marketplace_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on queries
CREATE INDEX idx_marketplace_items_created_at ON public.marketplace_items(created_at DESC);
CREATE INDEX idx_marketplace_items_user_id ON public.marketplace_items(user_id);
CREATE INDEX idx_marketplace_items_category ON public.marketplace_items(category);