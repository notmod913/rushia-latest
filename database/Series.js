const mongoose = require('mongoose');

// Use the same POG connection from PogGuild
const PogGuild = require('./PogGuild');
const pogConnection = PogGuild.db;

const seriesSchema = new mongoose.Schema({
  hearts: { type: String, required: true },
  series: { type: String, required: true }
}, { 
  collection: 'series',
  strict: false  // Allow other fields that might exist
});

// Create indexes separately to avoid duplicates
seriesSchema.index({ series: 1 });

module.exports = pogConnection.model('Series', seriesSchema);
