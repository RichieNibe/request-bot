Write-Host "Popmart Login Bot" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green
Write-Host ""

$username = Read-Host "Enter your Popmart email"
$password = Read-Host "Enter your Popmart password" -AsSecureString

# Convert secure string to plain text for command line
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Starting login process..." -ForegroundColor Yellow

node login.js -u "$username" -p "$plainPassword"

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
