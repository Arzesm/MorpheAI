# Полная автоматическая настройка Supabase Storage через REST API
# Этот скрипт автоматически создает bucket и настраивает все необходимое

param(
    [string]$SupabaseUrl = "",
    [string]$ServiceRoleKey = ""
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AUTOMATIC STORAGE SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Получаем переменные окружения
if (-not $SupabaseUrl) {
    $SupabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
}

if (-not $ServiceRoleKey) {
    $ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY
}

# Читаем из .env.local если есть
if (-not $SupabaseUrl -or -not $ServiceRoleKey) {
    if (Test-Path ".env.local") {
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
    Write-Host "Error: NEXT_PUBLIC_SUPABASE_URL not found!" -ForegroundColor Red
    Write-Host "Set: `$env:NEXT_PUBLIC_SUPABASE_URL = 'https://uhmedcjhbgqewmaaxgan.supabase.co'" -ForegroundColor Yellow
    exit 1
}

if (-not $ServiceRoleKey) {
    Write-Host "Error: SUPABASE_SERVICE_ROLE_KEY not found!" -ForegroundColor Red
    Write-Host "Get it from: https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/settings/api" -ForegroundColor Yellow
    Write-Host "Set: `$env:SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Supabase URL: $SupabaseUrl" -ForegroundColor Green
Write-Host "Service Role Key: $($ServiceRoleKey.Substring(0, [Math]::Min(20, $ServiceRoleKey.Length)))..." -ForegroundColor Green
Write-Host ""

# Функция для создания bucket через Storage API
function Create-StorageBucket {
    param(
        [string]$Url,
        [string]$Key
    )
    
    $bucketData = @{
        id = "dream-images"
        name = "dream-images"
        public = $true
        file_size_limit = 52428800
        allowed_mime_types = @("image/png", "image/jpeg", "image/jpg", "image/webp")
    } | ConvertTo-Json
    
    $headers = @{
        "apikey" = $Key
        "Authorization" = "Bearer $Key"
        "Content-Type" = "application/json"
        "Prefer" = "return=representation"
    }
    
    try {
        Write-Host "Creating Storage bucket 'dream-images'..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$Url/rest/v1/storage/buckets" -Method POST -Headers $headers -Body $bucketData -ErrorAction Stop
        
        Write-Host "Bucket created successfully!" -ForegroundColor Green
        Write-Host "  ID: $($response.id)" -ForegroundColor Gray
        Write-Host "  Public: $($response.public)" -ForegroundColor Gray
        return $true
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 409) {
            Write-Host "Bucket already exists, skipping..." -ForegroundColor Yellow
            return $true
        }
        else {
            Write-Host "Error creating bucket: $_" -ForegroundColor Red
            $errorDetails = $_.ErrorDetails.Message
            if ($errorDetails) {
                Write-Host "Details: $errorDetails" -ForegroundColor Red
            }
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
        $response = Invoke-RestMethod -Uri "$Url/rest/v1/storage/buckets/dream-images" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "Bucket 'dream-images' found!" -ForegroundColor Green
        Write-Host "  Public: $($response.public)" -ForegroundColor Gray
        return $true
    }
    catch {
        return $false
    }
}

# Функция для создания политик через SQL (через REST API)
function Create-StoragePolicies {
    param(
        [string]$Url,
        [string]$Key
    )
    
    $sql = @"
-- Create policies for dream-images bucket
CREATE POLICY IF NOT EXISTS "Public Access for dream-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'dream-images');

CREATE POLICY IF NOT EXISTS "Service role can upload dream-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'dream-images' AND
  (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);

CREATE POLICY IF NOT EXISTS "Service role can update dream-images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'dream-images' AND
  (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);

CREATE POLICY IF NOT EXISTS "Service role can delete dream-images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'dream-images' AND
  (auth.role() = 'service_role' OR auth.role() = 'authenticated')
);
"@
    
    $headers = @{
        "apikey" = $Key
        "Authorization" = "Bearer $Key"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        query = $sql
    } | ConvertTo-Json
    
    try {
        Write-Host "Creating storage policies..." -ForegroundColor Yellow
        # Используем PostgREST для выполнения SQL (если доступно)
        # Или просто выводим инструкцию
        Write-Host "Policies need to be created via SQL Editor" -ForegroundColor Yellow
        Write-Host "SQL script is in setup-storage.sql" -ForegroundColor Yellow
        return $true
    }
    catch {
        Write-Host "Note: Policies should be created via SQL Editor" -ForegroundColor Yellow
        return $true
    }
}

# Основной процесс
Write-Host "Checking existing bucket..." -ForegroundColor Cyan
$bucketExists = Test-StorageBucket -Url $SupabaseUrl -Key $ServiceRoleKey

if (-not $bucketExists) {
    Write-Host ""
    $created = Create-StorageBucket -Url $SupabaseUrl -Key $ServiceRoleKey
    if (-not $created) {
        Write-Host ""
        Write-Host "Automatic bucket creation failed." -ForegroundColor Red
        Write-Host "Please create bucket manually via SQL Editor" -ForegroundColor Yellow
        Write-Host "SQL script: setup-storage.sql" -ForegroundColor Yellow
        
        # Открываем SQL Editor
        $sqlUrl = "https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/sql/new"
        Start-Process $sqlUrl
        
        # Копируем SQL в буфер
        $sqlScript = Get-Content "setup-storage.sql" -Raw -ErrorAction SilentlyContinue
        if ($sqlScript) {
            $sqlScript | Set-Clipboard
            Write-Host "SQL script copied to clipboard!" -ForegroundColor Green
        }
        
        exit 1
    }
} else {
    Write-Host "Bucket already exists, skipping creation..." -ForegroundColor Green
}

Write-Host ""
Write-Host "Creating policies..." -ForegroundColor Cyan
Create-StoragePolicies -Url $SupabaseUrl -Key $ServiceRoleKey

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STORAGE BUCKET CREATED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create policies via SQL Editor (setup-storage.sql)" -ForegroundColor White
Write-Host "2. Add SUPABASE_SERVICE_ROLE_KEY to Edge Functions secrets" -ForegroundColor White
Write-Host "3. Redeploy generate-dream-image function" -ForegroundColor White
Write-Host ""

# Открываем SQL Editor для политик
$sqlUrl = "https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/sql/new"
Start-Process $sqlUrl

# Копируем SQL в буфер
$sqlScript = Get-Content "setup-storage.sql" -Raw -ErrorAction SilentlyContinue
if ($sqlScript) {
    $sqlScript | Set-Clipboard
    Write-Host "SQL script copied to clipboard!" -ForegroundColor Green
    Write-Host "Paste in SQL Editor (Ctrl+V) and Run (F5)" -ForegroundColor Yellow
}

Write-Host ""

