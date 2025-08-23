# Popmart Bot CLI

A CLI tool to automate Popmart product actions and send confirmation emails. The bot is now split into two separate scripts:

1. **`login.js`** - Handles authentication to Popmart
2. **`popmart.js`** - Adds products to cart (requires you to be already logged in)

## How to Run

### Step 1: Login to Popmart

1. **Install Dependencies** (if not already done)
   ```sh
   npm install
   ```

2. **Run the Login Script**
   ```sh
   node login.js --username "your@email.com" --password "yourpassword"
   ```

   **Available Flags:**
   - `-u, --username`: Your Popmart email
   - `-p, --password`: Your Popmart password
   - `-h, --help`: Show help message

   **Short Form Example:**
   ```sh
   node login.js -u "your@email.com" -p "yourpassword"
   ```

   **Alternative: Use the provided scripts**
   - Windows: Double-click `run-login.bat` or run `run-login.ps1` in PowerShell
   - These scripts will prompt you for credentials interactively

### Step 2: Add Products to Cart

**Important:** You must be logged in to Popmart before running this script. The login script will open a browser - keep it open and logged in.

1. **Run the Product Bot Script**
   ```sh
   node popmart.js --email "recipient@email.com" --link "https://www.popmart.com/us/product/123" --quantity 5
   ```

   **Available Flags:**
   - `-e, --email`: Recipient email for confirmation
   - `-l, --link`: Popmart product link
   - `-q, --quantity`: Number of items to add to cart (default: 1)
   - `-h, --help`: Show help message

   **Short Form Example:**
   ```sh
   node popmart.js -e "recipient@email.com" -l "https://www.popmart.com/us/product/123" -q 5
   ```

---

### Option 2: Run as Windows Executables (`.exe`)

**Note:** You'll need to build separate executables for login and product functionality.

1. **Build the Executables** (if not already built)
   ```sh
   pkg login.js --targets node18-win-x64 --output popmart-login.exe
   pkg popmart.js --targets node18-win-x64 --output popmart-bot.exe
   ```

2. **Run the Login Executable**
   ```sh
   popmart-login.exe --username "your@email.com" --password "yourpassword"
   ```

3. **Run the Product Bot Executable** (after logging in)
   ```sh
   popmart-bot.exe --email "recipient@email.com" --link "https://www.popmart.com/us/product/123" --quantity 5
   ```

**Command Line Flags Available:**
- **Login Script:**
  - `-u, --username`: Your Popmart email
  - `-p, --password`: Your Popmart password
  - `-h, --help`: Show help message

- **Product Bot Script:**
  - `-e, --email`: Recipient email for confirmation
  - `-l, --link`: Popmart product link
  - `-q, --quantity`: Number of items to add to cart (default: 1)
  - `-h, --help`: Show help message

---

### Requirements

- For Node.js: Node.js v16+ installed
- For `.exe`: No Node.js required, but an internet connection is needed for Puppeteer and email sending

---

### Security Note

- Your email credentials are sensitive! Use an [App Password](https://support.google.com/accounts/answer/185833?hl=en) for Gmail, not your main password.
- Never share your credentials or executable with hardcoded secrets.

---

**That's it! Your bot will run, perform the actions, and send a confirmation email to the address you provide.**

---

## Workflow Summary

1. **First, run the login script** to authenticate with Popmart
   - This will open Chrome with remote debugging enabled
   - The browser will stay open until you manually close it
   - Keep this browser open to maintain your login session

2. **Then run the product bot script** in a new terminal to add items to your cart
   - The product bot will connect to your existing browser instance
   - It will open a new tab in the same browser
   - This ensures your login session is preserved

3. **The product bot will use your existing login session** to add items
   - No need to log in again
   - Your session remains active across both scripts

**Important Notes:**
- The login script keeps the browser open indefinitely - you must close it manually when done
- The product bot connects to the existing browser, so don't close the browser between runs
- If you close the browser, you'll need to run the login script again
- Both scripts can run simultaneously in different terminals