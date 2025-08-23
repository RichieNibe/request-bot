#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
require('dotenv').config();
const puppeteer = require("puppeteer-extra");
const nodemailer = require("nodemailer");

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
let recipient, productLink, quantity = 1;

// Simple command line argument parsing
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--email':
    case '-e':
      recipient = args[i + 1];
      i++;
      break;
    case '--link':
    case '-l':
      productLink = args[i + 1];
      i++;
      break;
    case '--quantity':
    case '-q':
      quantity = parseInt(args[i + 1]);
      if (isNaN(quantity) || quantity < 1) {
        console.error('Error: Quantity must be a positive number');
        process.exit(1);
      }
      i++;
      break;
    case '--help':
    case '-h':
      console.log(`
Usage: node popmart.js [options]

Options:
  -e, --email <email>       Recipient email for confirmation
  -l, --link <url>          Popmart product link
  -q, --quantity <number>   Number of items to add to cart (default: 1)
  -h, --help                Show this help message

Example:
  node popmart.js -e "recipient@email.com" -l "https://www.popmart.com/us/product/123" -q 5
      `);
      process.exit(0);
      break;
  }
}

// Validate required arguments
if (!recipient || !productLink) {
  console.error('Error: Missing required arguments');
  console.log('Use --help for usage information');
  process.exit(1);
}

console.log("=== Popmart Bot Setup ===");
console.log(`Recipient: ${recipient}`);
console.log(`Product Link: ${productLink}`);
console.log(`Quantity: ${quantity}`);
console.log("Starting bot...\n");

// Configure your transporter (example uses Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(subject, text) {
  try {
    await transporter.sendMail({
      from: '"Popmart Bot"',
      to: recipient,
      subject,
      text,
    });
    console.log("Email sent:", text);
  } catch (error) {
    console.log("Email failed:", error.message);
    console.log(text);
  }
}

async function connectToExistingBrowser() {
  console.log("Attempting to connect to existing Chrome instance...");
  
  try {
    // Try to connect to an existing Chrome instance
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null
    });
    
    console.log("✅ Connected to existing Chrome instance");
    return browser;
  } catch (error) {
    console.log("⚠️ Could not connect to existing Chrome instance");
    console.log("Make sure you have Chrome running with remote debugging enabled");
    console.log("Or run the login script first to launch Chrome");
    throw new Error("No existing Chrome instance found. Please run the login script first.");
  }
}

async function launchNewBrowser() {
  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error(
      "Chrome not found. Please install Google Chrome and try again."
    );
  }

  console.log("Launching new browser...");
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
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
  });

  return browser;
}

async function loadPage() {
  let browser;
  
  try {
    // First try to connect to existing browser
    browser = await connectToExistingBrowser();
  } catch (error) {
    // If that fails, launch a new browser
    browser = await launchNewBrowser();
  }

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

async function addToCart(page, quantity) {
  console.log(`Adding ${quantity} items to cart...`);

  await page.waitForSelector(
    ".index_usBtn__2KlEx.index_red__kx6Ql.index_btnFull__F7k90"
  );

  // Click the add to cart button the specified number of times
  for (let i = 0; i < quantity; i++) {
    await page.click(
      ".index_usBtn__2KlEx.index_red__kx6Ql.index_btnFull__F7k90"
    );
    console.log(`Added item ${i + 1} to cart`);
    
    // Small delay between clicks to avoid overwhelming the page
    if (i < quantity - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`Successfully added ${quantity} items to cart`);
}



async function run() {
  let browser;
  try {
    console.log("Starting Popmart bot...");
    const { browser: br, page } = await loadPage();
    browser = br;

    console.log("Navigating to product page...");
    await page.goto(productLink);


    await addToCart(page, quantity);

    await sendEmail(
      "Popmart Bot Success",
      `The bot completed successfully! ${quantity} items have been added to your cart.`
    );
    console.log("Bot completed successfully!");

    // Keep browser open for 5 seconds so user can see results
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    // Only close the tab, not the entire browser
    console.log("Closing product tab...");
    await page.close();
    
    // If we launched a new browser (not connected to existing), close it
    if (!browser._connection) {
      console.log("Closing browser...");
      await browser.close();
    } else {
      console.log("Keeping browser open - your login session is preserved");
    }
  } catch (error) {
    console.error("Bot failed:", error.message);
    if (browser) {
      // Only close the tab if it exists, not the entire browser
      if (page && !page.isClosed()) {
        console.log("Closing product tab due to error...");
        await page.close();
      }
      
      // If we launched a new browser (not connected to existing), close it
      if (!browser._connection) {
        await browser.close();
      } else {
        console.log("Keeping browser open - your login session is preserved");
      }
    }
    await sendEmail(
      "Popmart Bot Failed",
      `The bot failed with error: ${error.message}`
    );

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
