const { execSync } = require('child_process');

try {
  console.log('Installing Puppeteer browsers...');
  execSync('npx puppeteer install', { stdio: 'inherit' });
} catch (error) {
  console.error('Error installing Puppeteer browsers:', error);
  process.exit(1);
}
