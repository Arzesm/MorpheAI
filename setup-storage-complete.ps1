# Полная автоматическая настройка Supabase Storage
# Этот скрипт настраивает Storage через SQL Editor API

param(
    [string]$SupabaseUrl = "",
    [string]$ServiceRoleKey = ""
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 ПОЛНАЯ НАСТРОЙКА STORAGE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Получаем переменные окружения
if (-not $SupabaseUrl) {
    $SupabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
}

if (-not $ServiceRoleKey) {
    $ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY
}

# Если переменные не установлены, пытаемся прочитать из .env.local
if (-not $SupabaseUrl -or -not $ServiceRoleKey) {
    if (Test-Path ".env.local") {
        Write-Host "📖 Чтение переменных из .env.local..." -ForegroundColor Yellow
        $envContent = Get-Content ".env.local" -Raw
        
        if ($envContent -match 'NEXT_PUBLIC_SUPABASE_URL=(.+)') {
            $SupabaseUrl = $matches[1].Trim()
        }
        
        if ($envContent -match 'SUPABASE_SERVICE_ROLE_KEY=(.+)') {
            $ServiceRoleKey = $matches[1].Trim()
        }
    }
}

if (-not $SupabaseUrl) {
    Write-Host "❌ Ошибка: NEXT_PUBLIC_SUPABASE_URL не найден!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Установите переменную:" -ForegroundColor Yellow
    Write-Host "  `$env:NEXT_PUBLIC_SUPABASE_URL = 'https://uhmedcjhbgqewmaaxgan.supabase.co'" -ForegroundColor White
    Write-Host ""
    exit 1
}

if (-not $ServiceRoleKey) {
    Write-Host "⚠️  ВНИМАНИЕ: SUPABASE_SERVICE_ROLE_KEY не найден!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Для полной автоматической настройки нужен Service Role Key." -ForegroundColor White
    Write-Host ""
    Write-Host "Получите его здесь:" -ForegroundColor Cyan
    Write-Host "  https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/settings/api" -ForegroundColor White
    Write-Host ""
    Write-Host "Затем установите:" -ForegroundColor Yellow
    Write-Host "  `$env:SUPABASE_SERVICE_ROLE_KEY = 'ваш-service-role-key'" -ForegroundColor White
    Write-Host ""
    Write-Host "Или выполните SQL скрипт вручную:" -ForegroundColor Yellow
    Write-Host "  1. Откройте: https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/sql/new" -ForegroundColor White
    Write-Host "  2. Скопируйте содержимое setup-storage.sql" -ForegroundColor White
    Write-Host "  3. Вставьте и нажмите Run (F5)" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Supabase URL: $SupabaseUrl" -ForegroundColor Green
Write-Host "✅ Service Role Key: $($ServiceRoleKey.Substring(0, [Math]::Min(20, $ServiceRoleKey.Length)))..." -ForegroundColor Green
Write-Host ""

# Читаем SQL скрипт
$sqlScript = Get-Content "setup-storage.sql" -Raw -ErrorAction SilentlyContinue

if (-not $sqlScript) {
    Write-Host "❌ Файл setup-storage.sql не найден!" -ForegroundColor Red
    Write-Host "   Убедитесь, что файл находится в текущей директории" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 SQL скрипт загружен" -ForegroundColor Green
Write-Host ""

# Открываем SQL Editor в браузере
Write-Host "🌐 Открываю SQL Editor в браузере..." -ForegroundColor Cyan
$sqlEditorUrl = "$SupabaseUrl".Replace(".supabase.co", "").Replace("https://", "https://supabase.com/dashboard/project/") + "/sql/new"
Start-Process $sqlEditorUrl

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  📝 ИНСТРУКЦИЯ" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. В открывшемся SQL Editor:" -ForegroundColor White
Write-Host "   - Скопируйте содержимое файла setup-storage.sql" -ForegroundColor Gray
Write-Host "   - Вставьте в редактор" -ForegroundColor Gray
Write-Host "   - Нажмите Run (F5)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Добавьте секрет в Edge Functions:" -ForegroundColor White
Write-Host "   - Откройте: https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/functions" -ForegroundColor Gray
Write-Host "   - Settings → Secrets → Add new secret" -ForegroundColor Gray
Write-Host "   - Name: SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Gray
Write-Host "   - Value: ваш-service-role-key" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Перезапустите Edge Function:" -ForegroundColor White
Write-Host "   - Откройте функцию generate-dream-image" -ForegroundColor Gray
Write-Host "   - Нажмите Redeploy" -ForegroundColor Gray
Write-Host ""

# Копируем SQL скрипт в буфер обмена (если возможно)
try {
    $sqlScript | Set-Clipboard
    Write-Host "✅ SQL скрипт скопирован в буфер обмена!" -ForegroundColor Green
    Write-Host "   Просто вставьте его в SQL Editor (Ctrl+V)" -ForegroundColor Yellow
    Write-Host ""
} catch {
    Write-Host "⚠️  Не удалось скопировать в буфер обмена" -ForegroundColor Yellow
    Write-Host "   Скопируйте содержимое setup-storage.sql вручную" -ForegroundColor Yellow
    Write-Host ""
}

# Открываем файл setup-storage.sql
Write-Host "📄 Открываю файл setup-storage.sql..." -ForegroundColor Cyan
Start-Process notepad "setup-storage.sql"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ ГОТОВО!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Следующие шаги:" -ForegroundColor Cyan
Write-Host "  1. Выполните SQL скрипт в SQL Editor (уже открыт)" -ForegroundColor White
Write-Host "  2. Добавьте SUPABASE_SERVICE_ROLE_KEY в секреты Edge Functions" -ForegroundColor White
Write-Host "  3. Перезапустите Edge Function generate-dream-image" -ForegroundColor White
Write-Host ""
Write-Host "Подробная инструкция: AUTO_SETUP_STORAGE.md" -ForegroundColor Yellow
Write-Host ""

