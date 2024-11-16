const mongoose = require('mongoose');
const { connectDBWallet } = require('../config/db');

const EmbeddedSchema = new mongoose.Schema({
  wallet: {
    type: String
  },
  email: {
    type: String
  },
  auth_share: {
    type: String,
  },
  recovery_share: {
    type: String,
  },
  recovery_auth_type: {
    type: String,
    default: 'none'
  },
  device_share_version: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = connectDBWallet.model('embedded', EmbeddedSchema);
