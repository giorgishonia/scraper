const puppeteer = require('puppeteer-core');
const { execSync } = require('child_process');
const path = require('path');

const installChromium = () => {
  try {
    console.log('Installing Puppeteer browsers...');
    execSync('npx puppeteer-install', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error installing Puppeteer browsers:', error);
    process.exit(1);
  }
};

// Ensure Puppeteer dependencies are installed
installChromium();
