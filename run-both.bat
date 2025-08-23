@echo off
echo Popmart Bot - Two-Step Process
echo =============================
echo.
echo Step 1: Login (keep browser open)
echo --------------------------------
echo 1. Run: node login.js -u "your@email.com" -p "yourpassword"
echo 2. Wait for login to complete
echo 3. Keep the browser open (don't close it!)
echo.
echo Step 2: Add to Cart (in new terminal)
echo ------------------------------------
echo 1. Open a new terminal/command prompt
echo 2. Run: node popmart.js -e "recipient@email.com" -l "product-link" -q 1
echo.
echo Alternative: Use the provided scripts
echo - Double-click run-login.bat for login
echo - Then run popmart.js in a new terminal
echo.
pause
