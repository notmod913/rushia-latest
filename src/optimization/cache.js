const userSettingsCache = new Map();
const guildSettingsCache = new Map();
const MAX_CACHE_SIZE = 1000; // Prevent unlimited growth

class CacheManager {
  // User Settings
  static setUserSettings(userId, data) {
    if (userSettingsCache.size >= MAX_CACHE_SIZE) {
      const firstKey = userSettingsCache.keys().next().value;
      userSettingsCache.delete(firstKey);
    }
    userSettingsCache.set(userId, data);
  }

  static getUserSettings(userId) {
    return userSettingsCache.get(userId);
  }

  static deleteUserSettings(userId) {
    return userSettingsCache.delete(userId);
  }

  static clearAllUserSettings() {
    const count = userSettingsCache.size;
    userSettingsCache.clear();
    return count;
  }

  // Guild Settings
  static setGuildSettings(guildId, data) {
    if (guildSettingsCache.size >= MAX_CACHE_SIZE) {
      const firstKey = guildSettingsCache.keys().next().value;
      guildSettingsCache.delete(firstKey);
    }
    guildSettingsCache.set(guildId, data);
  }

  static getGuildSettings(guildId) {
    return guildSettingsCache.get(guildId);
  }

  static deleteGuildSettings(guildId) {
    return guildSettingsCache.delete(guildId);
  }

  static clearAllGuildSettings() {
    const count = guildSettingsCache.size;
    guildSettingsCache.clear();
    return count;
  }

  static clearAll() {
    userSettingsCache.clear();
    guildSettingsCache.clear();
  }

  static getStats() {
    return {
      users: userSettingsCache.size,
      guilds: guildSettingsCache.size,
      maxSize: MAX_CACHE_SIZE
    };
  }
}

module.exports = CacheManager;
