const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Popmart Bot executable...');

// Create dist directory
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Build executables for multiple platforms
console.log('📦 Creating executables...');
execSync('npx pkg popmart.js --config pkg.config.json --targets node18-win-x64 --output dist/popmart-bot.exe', { stdio: 'inherit' });
execSync('npx pkg popmart.js --config pkg.config.json --targets node18-macos-x64 --output dist/popmart-bot-mac', { stdio: 'inherit' });

// Install Chromium if not already installed
console.log('🌐 Installing Chromium...');
execSync('npx puppeteer browsers install chrome', { stdio: 'inherit' });

// Create distribution folder
const distFolder = 'dist/popmart-bot';
if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder, { recursive: true });
}

// Copy executables
console.log('📋 Copying files...');
execSync(`cp dist/popmart-bot.exe ${distFolder}/`);

// Create Mac distribution
const macDistFolder = 'dist/popmart-bot-mac-dist';
if (!fs.existsSync(macDistFolder)) {
    fs.mkdirSync(macDistFolder, { recursive: true });
}

execSync(`cp dist/popmart-bot-mac ${macDistFolder}/popmart-bot`);
execSync(`chmod +x ${macDistFolder}/popmart-bot`);

// Copy Chromium
const chromiumSource = '/Users/Richie/.cache/puppeteer/chrome/mac_arm-138.0.7204.157/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const chromiumDest = `${distFolder}/chromium/chrome`;

if (!fs.existsSync(`${distFolder}/chromium`)) {
    fs.mkdirSync(`${distFolder}/chromium`, { recursive: true });
}

try {
    execSync(`cp "${chromiumSource}" "${chromiumDest}"`);
    console.log('✅ Chromium bundled successfully for Windows');
} catch (error) {
    console.log('⚠️  Chromium copy failed for Windows, will need to be installed separately');
}

// Copy Chromium for Mac
try {
    execSync(`cp "${chromiumSource}" "${macDistFolder}/chromium/chrome"`);
    console.log('✅ Chromium bundled successfully for Mac');
} catch (error) {
    console.log('⚠️  Chromium copy failed for Mac, will need to be installed separately');
}

console.log('🎉 Build complete!');
console.log(`📁 Windows distribution ready in: ${distFolder}`);
console.log(`📁 Mac distribution ready in: ${macDistFolder}`);
console.log('💡 Run the executable from the respective dist folder'); 