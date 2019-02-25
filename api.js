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
  let short_url = Url.findLastAvailableNumber();
  dns.lookup(original_url, function(err) {
    if (err) res.json({ error: 'invalid URL' });
  });
  let url = new Url({ original_url, short_url });
  url.save(function(err, url) {
    let original_url = url.original_url;
    let short_url = url.short_url;
    if (err) res.json(err);
    res.json({ original_url, short_url });
  });
});

// Get url data
router.get("/shorturl/:id", function(req, res) {
  Url.findById(req.params.id, function(err, url) {
    if (err) res.json(err);
    let original_url = url.original_url;
    let short_url = url.short_url;
    res.json({ original_url, short_url });
  });
});

// Redirect to shortcut url
router.get("/shorturl/:short_url", function(req, res) {
  let short_url = req.params.short_url;
  Url.findOne({ short_url }, function(err, url) {
    if (err) res.json(err)
    console.log(url);
    res.json(url);
    // res.writeHead(301, { Location: url.original_url });
  });
});

module.exports = router;
