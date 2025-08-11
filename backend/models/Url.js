const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  analytics: [{
    timestamp: { type: Date, default: Date.now },
    referrer: String,
    userAgent: String,
    ipAddress: String,
  }],
});

// Add index for faster querying
urlSchema.index({ shortCode: 1 });

module.exports = mongoose.model('Url', urlSchema);