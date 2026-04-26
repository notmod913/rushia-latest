const mongoose = require('mongoose');

const dropsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  drop_count: { type: Number, default: 0 },
  droppedAt: { type: Date, default: Date.now }
}, { timestamps: false });

// Compound unique index: one document per user per server
dropsSchema.index({ userId: 1, guildId: 1 }, { unique: true });

// Leaderboard query optimization
dropsSchema.index({ guildId: 1, drop_count: -1 });

module.exports = mongoose.model('Drops', dropsSchema, 'drops');
