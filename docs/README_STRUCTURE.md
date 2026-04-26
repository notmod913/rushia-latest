# Rushia Bot - Professional Structure

## 📁 Project Structure

```
rushia-bugs/
├── src/                      # Source code (production)
│   ├── commands/            # Slash commands
│   ├── events/              # Discord event handlers
│   ├── systems/             # Feature systems
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   ├── database/            # Database models
│   ├── tasks/               # Scheduled tasks
│   └── optimization/        # Performance optimization
├── data/                    # Static data files (production)
│   └── cards.json          # Card database
├── docs/                    # Documentation (production)
│   ├── .env.usage          # Environment variables guide
│   └── DISCORD_COMMANDS.txt # Command reference
├── dev/                     # Development files (gitignored)
│   ├── scripts/            # Deployment and utility scripts
│   ├── tests/              # Test scripts
│   └── testing/            # Testing resources
├── .env                     # Environment variables
├── .env.example            # Environment template
├── index.js                # Bot entry point
├── package.json            # Dependencies
└── README.md               # This file
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Deploy commands:**
   ```bash
   npm run deploy
   ```

4. **Start the bot:**
   ```bash
   npm start
   ```

## 📜 Available Scripts

- `npm start` - Start the bot
- `npm run dev` - Start with nodemon (auto-restart)
- `npm run deploy` - Deploy slash commands
- `npm run refresh` - Refresh existing commands
- `npm run sync` - Sync commands (add new, remove deleted)
- `npm run invite` - Generate bot invite link
- `npm run inspect` - Inspect Discord messages

## 🏗️ Architecture

### Source Code (`src/`)

- **commands/** - Discord slash commands with execute functions
- **events/** - Event handlers (messageCreate, interactionCreate, etc.)
- **systems/** - Feature implementations (POG, Series, Reminders, etc.)
- **utils/** - Reusable utility functions and helpers
- **config/** - Configuration constants and builder fields
- **database/** - Mongoose models and database connection
- **tasks/** - Scheduled tasks (cache refresh, reminders)
- **optimization/** - Performance utilities (caching, rate limiting)

### Development (`dev/`)

- **scripts/** - Deployment and utility scripts (gitignored)
- **tests/** - Test scripts and utilities (gitignored)
- **testing/** - Testing resources and data (gitignored)

### Data (`data/`)

- **cards.json** - Static card database for search system

### Documentation (`docs/`)

- **.env.usage** - Environment variable documentation
- **DISCORD_COMMANDS.txt** - Copyable command reference

## 🔧 Key Features

- **Boss Notifications** - Auto-detects boss spawns with tier support
- **POG Alerts** - High-value drop detection (SOFI bot)
- **Series System** - Heart value tracking (SOFI bot)
- **Smart Reminders** - Stamina, expedition, raid reminders
- **Card Search** - 1000+ card database with fuzzy matching
- **Wishlist System** - Track wanted cards
- **Inventory Helper** - Interactive inventory management
- **Leaderboard** - Drop statistics tracking

## 🤖 Bot Integration

- **SOFI Bot** (853629533855809596) - POG and Series systems
- **LUVI Bot** (1269481871021047891) - All other game systems

## 📊 Database Structure

- **Main DB** - Bot settings, reminders, notifications
- **Logs DB** - System logs and errors
- **POG DB** - POG guilds and series data
- **Wishlist DB** - User wishlists

## 🔐 Environment Variables

See `docs/.env.usage` for detailed environment variable documentation.

## 📝 License

MIT License - See LICENSE file for details
