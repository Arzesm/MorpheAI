-- SQL скрипт для настройки Supabase Storage для изображений снов
-- Выполните этот скрипт в SQL Editor на supabase.com

-- Создание Storage bucket для изображений снов
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dream-images',
  'dream-images',
  true, -- Публичный bucket
  52428800, -- 50MB лимит на файл
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Политика для публичного чтения изображений
CREATE POLICY IF NOT EXISTS "Public Access for dream-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'dream-images');

-- Политика для записи изображений (только для service role)
CREATE POLICY IF NOT EXISTS "Service role can upload dream-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'dream-images' AND
  (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);

-- Политика для обновления изображений
CREATE POLICY IF NOT EXISTS "Service role can update dream-images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'dream-images' AND
  (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);

-- Политика для удаления изображений
CREATE POLICY IF NOT EXISTS "Service role can delete dream-images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'dream-images' AND
  (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);

-- Проверка создания bucket
SELECT 
  id, 
  name, 
  public, 
  created_at 
FROM storage.buckets 
WHERE id = 'dream-images';


