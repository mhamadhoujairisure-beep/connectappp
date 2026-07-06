
-- Create product_images table for multiple images per product
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Public can view images of active products
CREATE POLICY "Public can view product images"
ON public.product_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchants m ON m.id = p.merchant_id
    WHERE p.id = product_images.product_id
      AND p.is_active = true
      AND m.is_approved = true
      AND m.subscription_active = true
  )
);

-- Merchants can manage images of own products
CREATE POLICY "Merchants manage own product images"
ON public.product_images FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.merchants m ON m.id = p.merchant_id
    WHERE p.id = product_images.product_id
      AND m.user_id = auth.uid()
  )
);

-- Admins manage all
CREATE POLICY "Admins manage product images"
ON public.product_images FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage policies
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete own product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
