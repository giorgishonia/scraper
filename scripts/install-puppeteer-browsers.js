const puppeteer = require('puppeteer');

async function installBrowsers() {
  try {
    console.log('Installing Puppeteer browsers...');
    await puppeteer.install(); // This method should install the required browsers
    console.log('Listing installed browsers...');
    const { executablePath } = await puppeteer.launch();
    console.log(`Puppeteer executable path: ${executablePath()}`);
  } catch (error) {
    console.error('Error installing Puppeteer browsers:', error);
    process.exit(1);
  }
}

installBrowsers();
