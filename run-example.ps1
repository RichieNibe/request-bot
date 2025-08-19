# PowerShell script to run Popmart Bot with command line flags
Write-Host "Running Popmart Bot with command line flags..." -ForegroundColor Green
Write-Host ""

# Example command - replace with your actual credentials
node popmart.js --username "your@email.com" --password "yourpassword" --email "recipient@email.com" --link "https://www.popmart.com/us/product/123" --quantity 5

Write-Host ""
Write-Host "Bot execution completed." -ForegroundColor Green
Read-Host "Press Enter to continue"
