# PowerShell скрипт для автоматической настройки Supabase Storage
# Этот скрипт настраивает Storage bucket через Supabase REST API

param(
    [string]$SupabaseUrl = "",
    [string]$ServiceRoleKey = ""
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 НАСТРОЙКА SUPABASE STORAGE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка переменных окружения
if (-not $SupabaseUrl) {
    $SupabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
}

if (-not $ServiceRoleKey) {
    $ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY
}

if (-not $SupabaseUrl -or -not $ServiceRoleKey) {
    Write-Host "❌ Ошибка: Не найдены переменные окружения!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Установите переменные:" -ForegroundColor Yellow
    Write-Host "  `$env:NEXT_PUBLIC_SUPABASE_URL = 'https://your-project.supabase.co'" -ForegroundColor White
    Write-Host "  `$env:SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key'" -ForegroundColor White
    Write-Host ""
    Write-Host "Или передайте параметры:" -ForegroundColor Yellow
    Write-Host "  .\setup-storage.ps1 -SupabaseUrl 'https://...' -ServiceRoleKey '...'" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Supabase URL: $SupabaseUrl" -ForegroundColor Green
Write-Host "✅ Service Role Key: $($ServiceRoleKey.Substring(0, 20))..." -ForegroundColor Green
Write-Host ""

# Функция для создания bucket
function Create-StorageBucket {
    param(
        [string]$Url,
        [string]$Key
    )
    
    $bucketData = @{
        id = "dream-images"
        name = "dream-images"
        public = $true
        file_size_limit = 52428800  # 50MB
        allowed_mime_types = @("image/png", "image/jpeg", "image/jpg", "image/webp")
    } | ConvertTo-Json
    
    $headers = @{
        "apikey" = $Key
        "Authorization" = "Bearer $Key"
        "Content-Type" = "application/json"
    }
    
    try {
        Write-Host "📦 Создание Storage bucket 'dream-images'..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$Url/rest/v1/storage/buckets" -Method POST -Headers $headers -Body $bucketData
        
        Write-Host "✅ Bucket создан успешно!" -ForegroundColor Green
        return $true
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 409) {
            Write-Host "⚠️  Bucket уже существует, пропускаем..." -ForegroundColor Yellow
            return $true
        }
        else {
            Write-Host "❌ Ошибка создания bucket: $_" -ForegroundColor Red
            Write-Host "   Попробуйте создать bucket вручную через SQL Editor" -ForegroundColor Yellow
            return $false
        }
    }
}

# Функция для проверки bucket
function Test-StorageBucket {
    param(
        [string]$Url,
        [string]$Key
    )
    
    $headers = @{
        "apikey" = $Key
        "Authorization" = "Bearer $Key"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$Url/rest/v1/storage/buckets/dream-images" -Method GET -Headers $headers
        Write-Host "✅ Bucket 'dream-images' найден!" -ForegroundColor Green
        Write-Host "   Public: $($response.public)" -ForegroundColor White
        return $true
    }
    catch {
        Write-Host "❌ Bucket не найден" -ForegroundColor Red
        return $false
    }
}

# Основной процесс
Write-Host "🔍 Проверка существующего bucket..." -ForegroundColor Cyan
$bucketExists = Test-StorageBucket -Url $SupabaseUrl -Key $ServiceRoleKey

if (-not $bucketExists) {
    $created = Create-StorageBucket -Url $SupabaseUrl -Key $ServiceRoleKey
    if (-not $created) {
        Write-Host ""
        Write-Host "⚠️  Автоматическое создание не удалось." -ForegroundColor Yellow
        Write-Host "   Выполните SQL скрипт вручную:" -ForegroundColor Yellow
        Write-Host "   1. Откройте SQL Editor в Supabase Dashboard" -ForegroundColor White
        Write-Host "   2. Скопируйте содержимое файла setup-storage.sql" -ForegroundColor White
        Write-Host "   3. Выполните скрипт" -ForegroundColor White
        Write-Host ""
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ STORAGE НАСТРОЕН!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Следующие шаги:" -ForegroundColor Cyan
Write-Host "  1. Убедитесь, что политики доступа настроены" -ForegroundColor White
Write-Host "     (выполните setup-storage.sql в SQL Editor)" -ForegroundColor Gray
Write-Host "  2. Добавьте SUPABASE_SERVICE_ROLE_KEY в секреты Edge Functions" -ForegroundColor White
Write-Host "  3. Перезапустите Edge Function 'generate-dream-image'" -ForegroundColor White
Write-Host ""
Write-Host "SQL скрипт: setup-storage.sql" -ForegroundColor Yellow
Write-Host ""

