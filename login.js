#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
require('dotenv').config();
const puppeteer = require("puppeteer-extra");

const { execSync } = require("child_process");

// Load stealth plugin safely after path is ready
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

try {
  puppeteer.use(StealthPlugin());
  console.log('✅ Stealth plugin loaded successfully');
} catch (error) {
  console.log('⚠️ Stealth plugin failed to load, using manual stealth configurations');
}

function findChrome() {
  const platform = process.platform;
  let chromePaths = [];

  // Check if running as executable (bundled)
  const isExecutable = process.pkg !== undefined;

  if (isExecutable) {
    // When running as executable, use bundled chromium
    const bundledChromePath = path.join(process.execPath, '../chromium/chrome');
    if (fs.existsSync(bundledChromePath)) {
      return bundledChromePath;
    }
  }

  if (platform === "win32") {
    chromePaths = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      path.join(
        process.env.LOCALAPPDATA,
        "Google\\Chrome\\Application\\chrome.exe"
      ),
      path.join(
        process.env.PROGRAMFILES,
        "Google\\Chrome\\Application\\chrome.exe"
      ),
      path.join(
        process.env["PROGRAMFILES(X86)"],
        "Google\\Chrome\\Application\\chrome.exe"
      ),
    ];
  } else if (platform === "darwin") {
    chromePaths = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ];
  } else {
    // Linux
    chromePaths = [
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ];
  }

  for (const chromePath of chromePaths) {
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  }

  // Try using 'which' or 'where' command
  try {
    const command =
      platform === "win32" ? "where chrome" : "which google-chrome";
    const result = execSync(command, { encoding: "utf8" }).trim();
    if (result) return result.split("\n")[0];
  } catch (error) {
    console.log(
      "Could not find Chrome automatically. Please install Google Chrome."
    );
  }

  return null;
}

// Parse command line arguments
const args = process.argv.slice(2);
let username, password;

// Simple command line argument parsing
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--username':
    case '-u':
      username = args[i + 1];
      i++;
      break;
    case '--password':
    case '-p':
      password = args[i + 1];
      i++;
      break;
    case '--help':
    case '-h':
      console.log(`
Usage: node login.js [options]

Options:
  -u, --username <email>    Your Popmart email
  -p, --password <password> Your Popmart password
  -h, --help                Show this help message

Example:
  node login.js -u "your@email.com" -p "yourpassword"
      `);
      process.exit(0);
      break;
  }
}

// Validate required arguments
if (!username || !password) {
  console.error('Error: Missing required arguments');
  console.log('Use --help for usage information');
  process.exit(1);
}

console.log("=== Popmart Login Bot ===");
console.log(`Username: ${username}`);
console.log("Starting login process...\n");

async function loadPage() {
  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error(
      "Chrome not found. Please install Google Chrome and try again."
    );
  }

  console.log("Launching browser with remote debugging enabled...");
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: chromePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-blink-features=AutomationControlled',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-images',
      '--disable-javascript',
      '--remote-debugging-port=9222',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
  });

  const page = await browser.newPage();

  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Remove webdriver property
  await page.evaluateOnNewDocument(() => {
    delete navigator.__proto__.webdriver;
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
  });

  return { browser, page };
}

async function signIn(page, email, password) {
  console.log("Signing in...");
  try {
    await page.waitForSelector(".index_ipInConutry__BoVSZ");
    await page.click(".index_ipInConutry__BoVSZ");
  } catch (error) {
    console.log("Country selection button not found");
  }

  try {
    await page.waitForSelector(".policy_acceptBtn__ZNU71");
    await page.click(".policy_acceptBtn__ZNU71");
  } catch (error) {
    console.log("Policy button not found or already accepted");
  }
  
  // Click the checkbox first
  try {
    await page.waitForSelector(".ant-checkbox-input", { timeout: 5000 });
    await page.click(".ant-checkbox-input");
    console.log("Checkbox clicked");
  } catch (error) {
    console.log("Checkbox not found or already checked");
  }

  await page.waitForSelector("#email");
  await page.type("#email", email);

  await page.waitForSelector("button[type='button']");
  await page.click("button[type='button']");

  await page.waitForSelector("#password");
  await page.type("#password", password);
  await page.waitForSelector("button[type='submit']", { timeout: 1000 });
  await page.click("button[type='submit']");

  console.log("Login attempted");
}

async function run() {
  let browser;
  try {
    console.log("Starting Popmart login bot...");
    const { browser: br, page } = await loadPage();
    browser = br;

    console.log("Navigating to login page...");
    await page.goto("https://www.popmart.com/us/user/login", {
      waitUntil: 'networkidle2'
    });

    await signIn(page, username, password);

    console.log("Login process completed!");
    console.log("Browser will remain open. Keep it open to maintain your login session.");
    console.log("When you're ready to add items to cart, run the popmart.js script in a new terminal.");
    console.log("Close this browser manually when you're done.");

    // Keep browser open indefinitely - user must close it manually
    // This maintains the login session for the popmart script
    await new Promise(() => {}); // This promise never resolves
    
    console.log("Login bot completed successfully!");
  } catch (error) {
    console.error("Login bot failed:", error.message);
    if (browser) await browser.close();

    // Keep console open to show error
    console.log("Press any key to exit...");
    process.stdin.read();
  }
}

// Add error handling for unhandled rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  console.log("Press any key to exit...");
  process.stdin.read();
  process.exit(1);
});

run();
