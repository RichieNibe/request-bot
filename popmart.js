const puppeteer = require("puppeteer-core");
const nodemailer = require("nodemailer");
const prompt = require("prompt-sync")({ sigint: true });
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function findChrome() {
  const platform = process.platform;
  let chromePaths = [];

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

// Prompt for Popmart credentials, recipient email, and product link
console.log("=== Popmart Bot Setup ===");
const username = prompt("Enter your Popmart email: ");
const password = prompt("Enter your Popmart password: ", { echo: "*" });
const recipient = prompt("Enter the recipient email for confirmation: ");
const productLink = prompt("Enter the Popmart product link: ");

// Configure your transporter (example uses Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "confirmationbot4@gmail.com",
    pass: "vfdrjizyxbaupxen",
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

async function loadPage() {
  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error(
      "Chrome not found. Please install Google Chrome and try again."
    );
  }

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: chromePath,
  });
  const page = await browser.newPage();
  return { browser, page };
}

async function addToCart(page) {
  console.log("Adding items to cart...");

  await page.waitForSelector(
    "div.index_usBtn__2KlEx.index_red__kx6Ql.index_btnFull__F7k90"
  );

  // Click add to cart 6 times

  await page.click(
    "div.index_usBtn__2KlEx index_red__kx6Ql index_btnFull__F7k90"
  );

  console.log("Added 6 items to cart");
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
    console.log("Starting Popmart bot...");
    const { browser: br, page } = await loadPage();
    browser = br;

    console.log("Navigating to login page...");
    await page.goto("https://www.popmart.com/us/user/login");

    await signIn(page, username, password);

    console.log("Navigating to product page...");
    await page.goto(productLink);

    await addToCart(page);

    await sendEmail(
      "Popmart Bot Success",
      "The bot completed successfully! 6 items have been added to your cart."
    );
    console.log("Bot completed successfully!");

    // Keep browser open for 5 seconds so user can see results
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await browser.close();
  } catch (error) {
    console.error("Bot failed:", error.message);
    if (browser) await browser.close();
    await sendEmail(
      "Popmart Bot Failed",
      `The bot failed with error: ${error.message}`
    );

    // Keep console open to show error
    console.log("Press any key to exit...");
    prompt("");
  }
}

// Add error handling for unhandled rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  console.log("Press any key to exit...");
  prompt("");
  process.exit(1);
});

run();
