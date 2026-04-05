# Database Files Explanation

## 📁 Database Structure Overview

The bot uses **4 separate MongoDB databases**:
1. **Main DB** (MONGODB_URI) - Core bot functionality
2. **Logs DB** (LOGS_URI) - Logging system
3. **POG DB** (POG_MONGODB_URI) - POG features & series
4. **Wishlist DB** (WISHLIST_URI) - User wishlists

---

## 📄 File-by-File Breakdown

### 1. **database.js** - Database Manager
**Purpose:** Central database connection and management system

**What it does:**
- Connects to main MongoDB database
- Creates indexes for all models
- Handles database cleanup (deletes old reminders)
- Provides database statistics
- Manages graceful shutdown

**Key Functions:**
- `connect()` - Establishes MongoDB connection with optimized settings
- `createIndexes()` - Creates indexes for all models (speeds up queries)
- `cleanup()` - Deletes reminders older than 7 days
- `getStats()` - Returns active reminders, guild count, user count
- `disconnect()` - Closes database connection

**Connection Settings:**
- Max pool size: 20 connections
- Min pool size: 5 connections
- Auto-retry on failure
- Optimized for read/write performance

---

### 2. **BotSettings.js** - Server Configuration
**Purpose:** Stores per-server bot settings

**Database:** Main DB
**Collection:** `guilds`

**What it stores:**
- `guildId` - Discord server ID (unique)
- `bossRoleId` - Role to ping for all bosses
- `cardRoleId` - Role to ping for card alerts
- `tier1RoleId` - Role for Tier 1 bosses
- `tier2RoleId` - Role for Tier 2 bosses
- `tier3RoleId` - Role for Tier 3 bosses
- `multiRoleEnabled` - Whether tier-specific roles are enabled
- `delays` - Role ping delay settings (Map)

**Used by:**
- `/set-boss-role` command
- `/multi-roles` command
- `/view-settings` command
- Boss detection system
- Tier ping system

**Example:**
```json
{
  "guildId": "123456789",
  "bossRoleId": "987654321",
  "multiRoleEnabled": true,
  "tier1RoleId": "111111111",
  "tier2RoleId": "222222222",
  "tier3RoleId": "333333333"
}
```

---

### 3. **UserNotificationSettings.js** - User Preferences
**Purpose:** Stores individual user notification preferences

**Database:** Main DB
**Collection:** `users`

**What it stores:**
- `userId` - Discord user ID (unique)
- `expedition` - Enable/disable expedition reminders (default: true)
- `stamina` - Enable/disable stamina reminders (default: true)
- `raid` - Enable/disable raid reminders (default: true)
- `raidSpawn` - Enable/disable raid spawn reminders (default: true)
- `drop` - Enable/disable drop reminders (default: true)
- `staminaDM` - Receive stamina reminders via DM (default: false)
- `expeditionDM` - Receive expedition reminders via DM (default: false)
- `raidSpawnDM` - Receive raid spawn reminders via DM (default: false)
- `dropDM` - Receive drop reminders via DM (default: false)
- `raidSpawnReminder` - Enable 30-min raid spawn reminder (default: true)

**Used by:**
- `/notifications` command
- `/dm` command
- All reminder systems
- User notification system

**Example:**
```json
{
  "userId": "123456789",
  "expedition": true,
  "stamina": true,
  "staminaDM": true,
  "expeditionDM": false
}
```

---

### 4. **Reminder.js** - Reminder System
**Purpose:** Stores all scheduled reminders

**Database:** Main DB
**Collection:** `reminders`

**What it stores:**
- `userId` - User to remind
- `guildId` - Server where reminder was created
- `channelId` - Channel to send reminder
- `remindAt` - When to send reminder (Date)
- `type` - Reminder type (expedition, stamina, raid, raidSpawn, drop)
- `reminderMessage` - Message to send
- `cardId` - Card ID (for expedition reminders)
- `sent` - Whether reminder was sent (default: false)
- `sentAt` - When reminder was sent
- `createdAt` - When reminder was created

**Indexes (Optimized for Performance):**
1. `remindAt + sent` - Fast lookup for due reminders
2. `userId + type + sent` - User's reminders by type
3. `type + remindAt + sent` - Type-specific queries
4. `sentAt` - TTL index (auto-deletes sent reminders after 1 minute)
5. `userId + cardId + type` - Prevents duplicate expedition reminders
6. `userId + type` - Prevents duplicate non-expedition reminders

**Special Methods:**
- `upsertReminder()` - Atomic upsert (prevents race conditions)
- `markAsSent()` - Bulk mark reminders as sent
- `getDueReminders()` - Get reminders due within time window

**Used by:**
- Stamina reminder system
- Expedition reminder system
- Raid reminder system
- Raid spawn reminder system
- Drop reminder system
- Reminder scheduler

**Example:**
```json
{
  "userId": "123456789",
  "guildId": "987654321",
  "channelId": "555555555",
  "remindAt": "2024-01-15T10:30:00Z",
  "type": "stamina",
  "reminderMessage": "@user Your stamina is full!",
  "sent": false
}
```

---

### 5. **Drops.js** - Drop Leaderboard
**Purpose:** Tracks total drop counts per user per server

**Database:** Main DB
**Collection:** `drops`

**What it stores:**
- `userId` - User who dropped
- `guildId` - Server where drop occurred
- `drop_count` - Total number of drops
- `droppedAt` - Last drop timestamp

**Indexes:**
1. `userId + guildId` - Unique per user per server
2. `guildId + drop_count` - Leaderboard sorting

**Used by:**
- Drop detection system
- Leaderboard system (`rlb` command)
- Drop tracking

**Example:**
```json
{
  "userId": "123456789",
  "guildId": "987654321",
  "drop_count": 150,
  "droppedAt": "2024-01-15T10:30:00Z"
}
```

---

### 6. **RarityDrop.js** - Rare Drop Leaderboard
**Purpose:** Tracks Exotic and Legendary drop counts per user per server

**Database:** Main DB
**Collection:** `rarity`

**What it stores:**
- `userId` - User who dropped
- `guildId` - Server where drop occurred
- `legendary_count` - Number of Legendary drops
- `exotic_count` - Number of Exotic drops
- `droppedAt` - Last rare drop timestamp

**Indexes:**
1. `userId + guildId` - Unique per user per server
2. `guildId + legendary_count + exotic_count` - Rarity leaderboard sorting

**Used by:**
- Rarity drop detection system
- Leaderboard "Rare Drops" button
- Exotic/Legendary tracking

**Example:**
```json
{
  "userId": "123456789",
  "guildId": "987654321",
  "legendary_count": 5,
  "exotic_count": 12,
  "droppedAt": "2024-01-15T10:30:00Z"
}
```

---

### 7. **Log.js** - Logging System
**Purpose:** Stores bot logs for debugging and monitoring

**Database:** Logs DB (separate database)
**Collection:** `logs`

**What it stores:**
- `level` - Log level (INFO, ERROR, WARN, DEBUG)
- `message` - Log message
- `timestamp` - When log was created
- `guildId` - Related server (optional)
- `userId` - Related user (optional)
- `channelId` - Related channel (optional)
- `metadata` - Additional data (Object)

**Indexes:**
1. `timestamp` - TTL index (auto-deletes logs older than 7 days)

**Used by:**
- Logger utility
- `/logs` command
- Error tracking
- System monitoring

**Example:**
```json
{
  "level": "ERROR",
  "message": "Failed to send reminder",
  "timestamp": "2024-01-15T10:30:00Z",
  "guildId": "987654321",
  "userId": "123456789",
  "metadata": { "error": "Channel not found" }
}
```

---

### 8. **PogGuild.js** - POG Channel Settings
**Purpose:** Stores POG alert channel configuration per server

**Database:** POG DB (separate database)
**Collection:** `servers`

**What it stores:**
- `guild_id` - Discord server ID (unique)
- `targetChannelId` - Channel to send POG alerts

**Connection:**
- Uses separate MongoDB connection (POG_MONGODB_URI)
- Shared with Series model

**Used by:**
- `/set-pog-channel` command
- POG detection system
- High-value drop forwarding

**Example:**
```json
{
  "guild_id": "123456789",
  "targetChannelId": "555555555"
}
```

---

### 9. **Series.js** - Series Heart Values
**Purpose:** Stores heart values for each series

**Database:** POG DB (same as PogGuild)
**Collection:** `series`

**What it stores:**
- `hearts` - Heart value (string, e.g. "1234")
- `series` - Series name (e.g. "Naruto")

**Indexes:**
1. `series` - Fast series lookup

**Connection:**
- Uses same POG connection as PogGuild
- Separate database from main bot

**Used by:**
- Series system
- Series heart value display
- POG detection

**Example:**
```json
{
  "hearts": "1234",
  "series": "Naruto"
}
```

---

### 10. **Wishlist.js** - User Wishlists
**Purpose:** Stores user wishlists (max 10 cards per user)

**Database:** Wishlist DB (separate database)
**Collection:** `wishlists`

**What it stores:**
- `_id` - User ID (used as document ID)
- `wl` - Array of wishlist items
  - `n` - Card name
  - `e` - Element (fire, water, ice, etc.)
- `cardCount` - Total cards in wishlist (denormalized)
- `updatedAt` - Last update timestamp

**Indexes:**
1. `_id` - Fast user lookup
2. `updatedAt` - Sorting by update time

**Pre-save Hook:**
- Auto-updates `cardCount` when `wl` is modified
- Auto-updates `updatedAt` timestamp

**Used by:**
- Wishlist system (`wa`, `wl`, `wr` commands)
- Raid wishlist notifications
- Wishlist cache system

**Example:**
```json
{
  "_id": "123456789",
  "wl": [
    { "n": "Naruto", "e": "fire" },
    { "n": "Sasuke", "e": "electric" }
  ],
  "cardCount": 2,
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## 🔗 Database Connections Summary

| Database | URI Variable | Models | Purpose |
|----------|-------------|--------|---------|
| **Main DB** | MONGODB_URI | BotSettings, UserNotificationSettings, Reminder, Drops, RarityDrop | Core bot functionality |
| **Logs DB** | LOGS_URI | Log | Logging and monitoring |
| **POG DB** | POG_MONGODB_URI | PogGuild, Series | POG features and series |
| **Wishlist DB** | WISHLIST_URI | Wishlist | User wishlists |

---

## 📊 Index Strategy

**Why indexes matter:**
- Speed up queries by 100-1000x
- Reduce database load
- Enable efficient sorting and filtering
- Prevent duplicate data

**Index types used:**
1. **Unique indexes** - Prevent duplicates (guildId, userId)
2. **Compound indexes** - Multi-field queries (userId + type)
3. **TTL indexes** - Auto-delete old data (logs, sent reminders)
4. **Partial indexes** - Index only specific documents (unsent reminders)

---

## 🧹 Cleanup & Maintenance

**Automatic cleanup:**
1. **Sent reminders** - Deleted after 1 minute (TTL index)
2. **Old logs** - Deleted after 7 days (TTL index)
3. **Old unsent reminders** - Deleted after 7 days (daily cleanup job)

**Manual cleanup:**
- Run `DatabaseManager.cleanup()` to clean old reminders
- Logs auto-delete via TTL index

---

## 🚀 Performance Optimizations

1. **Connection pooling** - 5-20 connections for parallel queries
2. **Lean queries** - Return plain objects (faster than Mongoose documents)
3. **Indexed queries** - All frequent queries use indexes
4. **Atomic operations** - Prevent race conditions (upsertReminder)
5. **Denormalization** - Store cardCount to avoid counting array
6. **Separate connections** - POG and Wishlist use separate databases

---

## 📝 Notes

- All timestamps use UTC
- All IDs are strings (Discord snowflakes)
- Indexes are created on bot startup
- TTL indexes run every 60 seconds (MongoDB default)
- Partial indexes save space by indexing only relevant documents
