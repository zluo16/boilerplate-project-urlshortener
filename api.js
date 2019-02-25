const express = require('express');
const router = express.Router();
const Url = require('./models/url');
const dns = require('dns');

// your first API endpoint... 
router.get("/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Post url
router.post("/shorturl/new/", function(req, res) {
  let original_url = req.body.url;
  Url.findOne()
    .sort('-short_url')
    .exec(function(err, url) {
    if (err) res.json(err);
    let short_url = url.short_url + 1;
    let originalNoProtocol = original_url.split('//')[1];
    dns.lookup(originalNoProtocol, function(err) {
      if (err) res.json({ error: 'invalid URL' });
      let newUrl = new Url({ original_url, short_url });
      newUrl.save(function(err, url) {
        if (err) res.json(err);
        let short_url = url.short_url;
        res.redirect(`/api/shorturl/get/${short_url}`);
      });
    });
  });
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
