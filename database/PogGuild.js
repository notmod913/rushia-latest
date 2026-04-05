const mongoose = require('mongoose');

// Create separate connection for POG features
const pogConnection = mongoose.createConnection(process.env.POG_MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});

pogConnection.on('connected', () => {
  console.log('✅ POG MongoDB connected');
});

pogConnection.on('error', (err) => {
  console.error('❌ POG MongoDB connection error:', err);
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
