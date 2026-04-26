const mongoose = require('mongoose');

const rarityDropSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  legendary_count: { type: Number, default: 0 },
  exotic_count: { type: Number, default: 0 },
  droppedAt: { type: Date, default: Date.now }
}, { timestamps: false });

// Compound unique index: one document per user per server
rarityDropSchema.index({ userId: 1, guildId: 1 }, { unique: true });

// Rarity leaderboard query optimization
rarityDropSchema.index({ guildId: 1, legendary_count: -1, exotic_count: -1 });

module.exports = mongoose.model('RarityDrop', rarityDropSchema, 'rarity');
