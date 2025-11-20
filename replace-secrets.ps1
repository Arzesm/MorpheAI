# PowerShell script to replace secrets in git history
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

git filter-branch -f --tree-filter '
powershell -Command "
Get-ChildItem -Recurse -File -Filter \"*.md\" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace \"sk-proj-[^\s`\"]+\", \"your-openai-api-key-here\"
    $content = $content -replace \"sk-proj-[^`\"]+\", \"your-openai-api-key-here\"
    Set-Content -Path $_.FullName -Value $content -NoNewline
}
"
' --prune-empty -- --all

