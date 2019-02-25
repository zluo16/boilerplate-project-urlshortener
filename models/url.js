const mongoose = require('mongoose');
const dns = require('dns');

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, unique: true, required: true }
});

urlSchema.statics.checkAndCreateNewShorturl = function(original_url, res) {
  this.findOne()
  .sort('-short_url')
  .exec((err, url) => {
    if (err) res.json(err);
    let short_url = url.short_url + 1;
    let originalNoProtocol = original_url.split('//')[1];
    dns.lookup(originalNoProtocol, (err) => {
      if (err) res.json({ error: 'invalid URL' });
      let newUrl = new this({ original_url, short_url });
      newUrl.save((err, url) => {
        if (err) res.json(err);
        let short_url = url.short_url;
        res.redirect(`/api/shorturl/get/${short_url}`);
      });
    });
  });
};

module.exports = mongoose.model('Url', urlSchema);
