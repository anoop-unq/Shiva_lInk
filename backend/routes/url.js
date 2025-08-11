const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url');
const { validateUrl } = require('../utils/validators');

// Shorten URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  if (!validateUrl(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.json(url);
    }

    const shortCode = shortid.generate();
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

    url = new Url({
      originalUrl,
      shortCode,
    });

    await url.save();
    res.json({ originalUrl, shortUrl, shortCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect to original URL
router.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOneAndUpdate(
      { shortCode: req.params.shortCode },
      { 
        $inc: { clicks: 1 },
        $push: { 
          analytics: {
            referrer: req.headers.referer,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
          }
        }
      },
      { new: true }
    );

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: 'URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get URL analytics
router.get('/:shortCode/stats', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      clicks: url.clicks,
      createdAt: url.createdAt,
      analytics: url.analytics,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// Admin routes (add authentication middleware in production)
router.get('/admin/urls', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/admin/urls/:id', async (req, res) => {
  try {
    await Url.findByIdAndDelete(req.params.id);
    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/admin/urls/:id', async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!validateUrl(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const updatedUrl = await Url.findByIdAndUpdate(
      req.params.id,
      { originalUrl },
      { new: true }
    );
    res.json(updatedUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add this route (make sure to add authentication middleware in production)
router.get('/admin/urls', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;