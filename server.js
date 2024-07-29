const express = require('express');
const path = require('path');
const cors = require('cors');
const scrapeData = require('./api/scrape'); // Ensure the correct path to scrape.js
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/scrape', async (req, res) => {
  try {
    const data = await scrapeData();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error scraping data');
  }
});

// Catch-all route to serve the index.html file for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
