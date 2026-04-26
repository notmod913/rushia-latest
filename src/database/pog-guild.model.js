const mongoose = require('mongoose');
const { sendLog, sendError } = require('../utils/logger');

// Create separate connection for POG features
const pogConnection = mongoose.createConnection(process.env.POG_MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});

pogConnection.on('connected', () => {
  sendLog('✅ POG MongoDB connected');
});

pogConnection.on('error', (err) => {
  sendError('❌ POG MongoDB connection error:', err);
});

// Use existing 'servers' collection structure from old pog-bot
const pogGuildSchema = new mongoose.Schema({
  guild_id: { type: String, required: true, unique: true },
  targetChannelId: { type: String, default: null }
}, { 
  collection: 'servers',
  strict: false  // Allow other fields that might exist
});

// No need for additional index - unique: true already creates an index

module.exports = pogConnection.model('PogGuild', pogGuildSchema);
