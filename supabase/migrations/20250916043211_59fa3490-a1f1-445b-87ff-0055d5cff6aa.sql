-- Create accommodations table
CREATE TABLE public.accommodations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price > 0),
  room_type TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  amenities TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  description TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  payment_details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create accommodation chats table
CREATE TABLE public.accommodation_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  accommodation_id UUID NOT NULL REFERENCES public.accommodations(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(accommodation_id, tenant_id, landlord_id)
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.accommodation_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add role field to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student' CHECK (role IN ('student', 'landlord', 'admin'));

-- Enable RLS on new tables
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accommodations
CREATE POLICY "Anyone can view available accommodations" 
ON public.accommodations 
FOR SELECT 
USING (true);

CREATE POLICY "Landlords can insert their own accommodations" 
ON public.accommodations 
FOR INSERT 
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update their own accommodations" 
ON public.accommodations 
FOR UPDATE 
USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their own accommodations" 
ON public.accommodations 
FOR DELETE 
USING (auth.uid() = landlord_id);

-- RLS Policies for accommodation chats
CREATE POLICY "Users can view chats they are part of" 
ON public.accommodation_chats 
FOR SELECT 
USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

CREATE POLICY "Tenants can create chats" 
ON public.accommodation_chats 
FOR INSERT 
WITH CHECK (auth.uid() = tenant_id);

-- RLS Policies for chat messages
CREATE POLICY "Users can view messages in their chats" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.accommodation_chats 
    WHERE id = chat_messages.chat_id 
    AND (tenant_id = auth.uid() OR landlord_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their chats" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.accommodation_chats 
    WHERE id = chat_messages.chat_id 
    AND (tenant_id = auth.uid() OR landlord_id = auth.uid())
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_accommodations_updated_at
  BEFORE UPDATE ON public.accommodations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accommodation_chats_updated_at
  BEFORE UPDATE ON public.accommodation_chats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();