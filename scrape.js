const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Utility function to wait for a specified time
const waitForTimeout = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

app.get('/api/scrape', async (req, res) => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('Navigating to the login page...');
    await page.goto('https://classroom.btu.edu.ge/ge/student/me/schedule', { waitUntil: 'networkidle2' });

    console.log('Please log in to the classroom. Waiting for login...');
    await page.waitForFunction(
      'window.location.href.includes("classroom.btu.edu.ge/ge/student/me")',
      { timeout: 0 }
    );

    console.log('Navigating to the schedule page...');
    await page.goto('https://classroom.btu.edu.ge/ge/student/me/schedule', { waitUntil: 'networkidle2' });

    await waitForTimeout(3000);
    await page.waitForSelector('table#groups');

    console.log('Scraping table data...');
    const tableData = await page.evaluate(() => {
      const data = [];
      const rows = document.querySelectorAll('table#groups tr');
      let currentDay = '';

      rows.forEach(row => {
        if (row.querySelector('h4')) {
          currentDay = row.querySelector('h4').innerText.trim();
        } else {
          const cells = row.querySelectorAll('td');
          const rowData = Array.from(cells).map(cell => cell.innerText.trim());
          if (rowData.length > 0) {
            data.push([currentDay, ...rowData]);
          }
        }
      });

      return data;
    });

    console.log('Navigating to the personal resume page...');
    await page.goto('https://classroom.btu.edu.ge/ge/student/resume/personal', { waitUntil: 'networkidle2' });

    await waitForTimeout(3000);

    console.log('Scraping personal information...');
    const personalInfo = await page.evaluate(() => {
      const info = {};
      const rows = document.querySelectorAll('div.row.form-group');

      rows.forEach(row => {
        const label = row.querySelector('label');
        const value = row.querySelector('div');

        if (label && value) {
          const labelText = label.innerText.trim();
          const valueText = value.innerText.trim();

          if (labelText.includes('სქესი:')) {
            info.gender = valueText;
          }

          if (labelText.includes('დაბ. თარიღი:')) {
            info.birthDate = valueText;
          }
        }
      });

      return info;
    });

    console.log('Closing the browser...');
    await browser.close();

    res.json({ schedule: tableData, personalInfo: personalInfo });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error scraping data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
