const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, unique: true, required: true }
});

urlSchema.statics.findLastAvailableNumber = function() {
  if (this.count({}) > 0) {
    return this.sort('-short_url').limit(1) + 1;
  } else return 1;
};

module.exports = mongoose.model('Url', urlSchema);
