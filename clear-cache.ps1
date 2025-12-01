# Скрипт для очистки кэша браузера и Service Worker
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CLEAR CACHE INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To fix old version issue:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open browser DevTools (F12)" -ForegroundColor White
Write-Host "2. Go to Application tab" -ForegroundColor White
Write-Host "3. Click 'Service Workers' in left sidebar" -ForegroundColor White
Write-Host "4. Click 'Unregister' for all service workers" -ForegroundColor White
Write-Host "5. Click 'Storage' in left sidebar" -ForegroundColor White
Write-Host "6. Click 'Clear site data' button" -ForegroundColor White
Write-Host "7. Close DevTools" -ForegroundColor White
Write-Host "8. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)" -ForegroundColor White
Write-Host ""
Write-Host "Or use browser settings:" -ForegroundColor Yellow
Write-Host "  Chrome: Settings → Privacy → Clear browsing data" -ForegroundColor Gray
Write-Host "  Edge: Settings → Privacy → Clear browsing data" -ForegroundColor Gray
Write-Host ""
Write-Host "After clearing cache, restart dev server:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""

