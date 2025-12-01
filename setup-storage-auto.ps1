# Automatic Supabase Storage Setup
# This script opens SQL Editor and copies the SQL script to clipboard

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  STORAGE AUTO SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Read SQL script
$sqlScript = Get-Content "setup-storage.sql" -Raw -ErrorAction SilentlyContinue

if (-not $sqlScript) {
    Write-Host "Error: setup-storage.sql not found!" -ForegroundColor Red
    exit 1
}

# Copy to clipboard
$sqlScript | Set-Clipboard
Write-Host "SQL script copied to clipboard!" -ForegroundColor Green
Write-Host ""

# Open SQL Editor
$sqlUrl = "https://supabase.com/dashboard/project/uhmedcjhbgqewmaaxgan/sql/new"
Start-Process $sqlUrl

Write-Host "SQL Editor opened in browser" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Paste SQL script in SQL Editor (Ctrl+V)" -ForegroundColor White
Write-Host "2. Press Run (F5)" -ForegroundColor White
Write-Host "3. Add SUPABASE_SERVICE_ROLE_KEY to Edge Functions secrets" -ForegroundColor White
Write-Host "4. Redeploy generate-dream-image function" -ForegroundColor White
Write-Host ""


