$filePath = "app/marketplace/page.tsx"
$content = Get-Content $filePath -Raw

# Simple string replacement
$oldText = '{CheckIcon && <CheckIcon size={18} style={{ color: ' + "'" + '#10b981' + "'" + ', flexShrink: 0, marginTop: ' + "'" + '2px' + "'" + ' }} />}'
$newText = '<span style={{ color: ' + "'" + '#10b981' + "'" + ', fontSize: ' + "'" + '1.25rem' + "'" + ', flexShrink: 0 }}>✓</span>'

$content = $content -replace [regex]::Escape($oldText), $newText

Set-Content -Path $filePath -Value $content
Write-Host "Replacements completed"
