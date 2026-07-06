
ALTER TABLE public.products 
ADD COLUMN delivery_available boolean NOT NULL DEFAULT false,
ADD COLUMN delivery_price numeric DEFAULT null,
ADD COLUMN location text DEFAULT null;
