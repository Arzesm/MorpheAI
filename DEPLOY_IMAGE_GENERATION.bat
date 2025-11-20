@echo off
echo ========================================
echo    Развертывание генерации изображений
echo ========================================
echo.

echo 1. Развертывание Edge Function...
supabase functions deploy generate-dream-image

echo.
echo 2. Проверка секретов...
supabase secrets list

echo.
echo ========================================
echo    Готово!
echo ========================================
echo.
echo Теперь откройте любой сон и нажмите
echo "Сгенерировать" в секции "Визуализация сна"
echo.
pause

