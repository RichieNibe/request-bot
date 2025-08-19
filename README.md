# Popmart Bot CLI

A CLI tool to automate Popmart product actions and send confirmation emails.

## How to Run

### Option 1: Run with Node.js and Command Line Flags (Recommended)

1. **Install Dependencies**
   ```sh
   npm install
   ```

2. **Run the Script with Command Line Flags**
   ```sh
   node popmart.js --username "your@email.com" --password "yourpassword" --email "recipient@email.com" --link "https://www.popmart.com/us/product/123" --quantity 5
   ```

   **Available Flags:**
   - `-u, --username`: Your Popmart email
   - `-p, --password`: Your Popmart password  
   - `-e, --email`: Recipient email for confirmation
   - `-l, --link`: Popmart product link
   - `-q, --quantity`: Number of items to add to cart (default: 1)
   - `-h, --help`: Show help message

   **Short Form Example:**
   ```sh
   node popmart.js -u "your@email.com" -p "yourpassword" -e "recipient@email.com" -l "https://www.popmart.com/us/product/123" -q 5
   ```

3. **Alternative: Run with Prompts** (Legacy)
   ```sh
   node popmart.js
   ```
   - Enter your Popmart email and password.
   - Enter the recipient email for the confirmation.
   - Enter the Popmart product link you want to purchase.

---

### Option 2: Run as a Windows Executable (`.exe`)

1. **Build the Executable** (if not already built)
   ```sh
   pkg popmart.js --targets node18-win-x64 --output popmart-bot.exe
   ```

2. **Run the Executable**
   - **With Command Line Flags (Recommended):**
     ```sh
     popmart-bot.exe --username "your@email.com" --password "yourpassword" --email "recipient@email.com" --link "https://www.popmart.com/us/product/123" --quantity 5
     ```
   - **With Prompts (Legacy):** Double-click `popmart-bot.exe` in Windows Explorer
   - **OR** open a command prompt in the folder and run:
     ```sh
     popmart-bot.exe
     ```

3. **Command Line Flags Available:**
   - `-u, --username`: Your Popmart email
   - `-p, --password`: Your Popmart password  
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

**That’s it! Your bot will run, perform the actions, and send a confirmation email to the address you provide.**