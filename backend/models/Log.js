const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  message: { type: String, required: true },
  stack: String,
  method: String,
  url: String,
  statusCode: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  ip: String
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);