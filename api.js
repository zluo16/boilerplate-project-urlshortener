const express = require('express');
const router = express.Router();
const Url = require('./models/url');

// your first API endpoint... 
router.get("/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Post url
router.post("/shorturl/new/", function(req, res) {
  let original_url = req.body.url;
  Url.checkAndCreateNewShorturl(original_url, res);
});

// Redirect to shortcut url
router.get("/shorturl/:short_url", function(req, res) {
  let short_url = req.params.short_url;
  Url.findOne({ short_url }, function(err, url) {
    if (err) res.json(err);
    res.writeHead(301, { Location: url.original_url });
    res.end();
  });
});

// Get short url information
router.get("/shorturl/get/:short_url", function (req, res) {
  let short_url = parseInt(req.params.short_url);
  Url.findOne({ short_url }, function (err, url) {
    if (err) res.json(err);
    let original_url = url.original_url;
    let short_url = url.short_url;
    res.json({ original_url, short_url });
  });
});

module.exports = router;
