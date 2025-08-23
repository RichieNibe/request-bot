@echo off
echo Popmart Login Bot
echo =================
echo.
set /p username="Enter your Popmart email: "
set /p password="Enter your Popmart password: "
echo.
echo Starting login process...
node login.js -u "%username%" -p "%password%"
pause
