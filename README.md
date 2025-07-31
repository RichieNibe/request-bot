# Popmart Bot CLI

A CLI tool to automate Popmart product actions and send confirmation emails.

## How to Run

### Option 1: Run with Node.js

1. **Install Dependencies**
   ```sh
   npm install
   ```

2. **Run the Script**
   ```sh
   node popmart-bot.js
   ```
   or, if you made it executable:
   ```sh
   ./popmart-bot.js
   ```

3. **Follow the Prompts**
   - Enter your Popmart email and password.
   - Enter the recipient email for the confirmation.
   - Enter the Popmart product link you want to purchase.

---

### Option 2: Run as a Windows Executable (`.exe`)

1. **Build the Executable** (if not already built)
   ```sh
   pkg popmart-bot.js --targets node18-win-x64 --output popmart-bot.exe
   ```

2. **Run the Executable**
   - Double-click `popmart-bot.exe` in Windows Explorer
   - **OR** open a command prompt in the folder and run:
     ```sh
     popmart-bot.exe
     ```

3. **Follow the Prompts**
   - Enter your Popmart email and password.
   - Enter the recipient email for the confirmation.
   - Enter the Popmart product link you want to purchase.

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