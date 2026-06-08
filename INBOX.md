# INBOX

New tasks and information from external sources appear here.
Clawd will process the "Current Queue" sequentially.

---
## 🚀 HIGH LEVEL GOALS
These are large projects. Clawd will break these down into small tasks.
- [ ] **Google Ultra AI Server**: Create a Discord bot to share AI subscription access.
- [ ] **Vila Adora Breakfast App**: Finalize backend and menu logic.
- [ ] **Polymarket Bot**: Optimize trade execution speed.
- [ ] **YouTube Engine**: Automate the export-to-upload pipeline.
- [ ] **Personal Brand**: Complete the 'Projects' section with descriptions.
- [ ] **Fuel App**: Implement the Apple Health data fetcher.

## 📝 CURRENT QUEUE
Small, actionable steps go here. Ralph triggers Clawd for each one.

### 📸 Google Photos Backup
- [in_progress] **Throttled Backup to Viper SSD** - Resumed sync with `--bwlimit 2M` to prevent load spikes. Monitoring `rclone_backup.log`.

### 🌌 Google Ultra AI Server - Core Implementation
- [x] **Create .env from .env.example** - Set up basic credentials (DISCORD_TOKEN, CLIENT_ID)
- [x] **Implement Persistent Usage Tracking** - Created `usage_data.json` and `blacklist.json` with persistence logic
- [x] **Add Admin Commands** - Implemented `!blacklist`, `!whitelist`, and `!reset-usage`
- [x] **Refine AI Prompt Wrapper** - Added system instructions and safety guidelines
- [x] **Implement !reset-usage** - Admin command to clear user quotas
- [x] **Add Model Parameter Control** - Support `!model-params temperature 0.7`
- [x] **Image Generation Support** - Integrated Gemini Pro Vision for analysis and `!imagine` for generation.
- [ ] **Unit Tests for RequestQueue** - Create `tests/queue.test.js` and verify concurrency logic
- [ ] **Discord Command Registration Script** - Move from message-based to Slash Commands (v14 standard)
- [ ] **Error Handling Upgrade** - Detailed logging for rate limits and content filtering blocks

### 🍳 Vila Adora Breakfast App - Backend Hardening
- [x] **Implement Guest Validation** - Created `guestService.js` and integrated with `App.tsx` and `GuestDetails.jsx`
- [x] **Menu Availability Logic** - Added logic to `MenuItem.jsx` to hide items when `stock < 1`
- [ ] **Order Confirmation Emails** - Scaffold email templates for order receipts
- [ ] **Database Migration** - Prepare schema for moving from JSON to SQLite/PostgreSQL

### 🤖 Polymarket Bot - Performance & Speed
- [x] **Latency Monitoring** - Added timing logs to `executeTrade` and `scanMarkets`
- [x] **Axios Optimization** - Configured `axiosInstance` with `keepAlive` and `maxSockets`
- [x] **Strategy Profiling** - (Handled via logs and dashboard)
- [x] **Circuit Breaker** - Implemented automatic pause after 3 consecutive failures

### 🎥 YouTube Engine - Automation Pipeline
- [x] **Directory Watcher** - Created `scripts/watcher.py` to detect new files in `READY_FOR_REVIEW/`
- [x] **Metadata Generator** - Created `scripts/metadata_generator.py` to extract title/tags
- [ ] **YouTube API Scaffolding** - Set up OAuth2 flow for video uploads

### 🧹 Nightly Maintenance & Continuity
- [x] **Log Rotation** - Checked size (23K), rotation not needed (< 10MB)
- [x] **Disk Space Check** - Verified Viper SSD health and remaining space (490GB)
- [x] **Memory Sync** - Updated `MEMORY.md` with a summary of the 8-hour progress
- [x] **Daily Report Generation** - Created `reports/2026-01-26.md` summarizing accomplishments
- [x] **Bootstrap Cleanup** - Checked for `BOOTSTRAP.md` files; none needed deletion

### Other Tasks
  - [x] **Ralph version tracking** - Add version info to Ralph and implement version check command


- [ ] **Design Discord server logo** - Generate or source a logo for the server
- [ ] **Implement audio message processing** - Add Discord voice message transcription capability  
- [x] **Multi-user access system** - Designed restricted access model (see MULTI_USER_ACCESS_DESIGN.md)
- [x] **Model switching interface** - Enable model selection from Discord chat (Added !model command)
- [x] **Dashboard** - Created and accessible via serve_dashboard.py
- [x] **Task queue visibility** - Visible via INBOX.md and dashboard

## ✅ COMPLETED
- [x] Initial Ralph-Clawd integration setup.
- [x] Initial system check: Verified all project paths are accessible.
- [x] Fix ConfirmationModal field name bug (guestName vs primaryGuestName) in Vila Adora Breakfast App.
- [x] Fix item name display issue in confirmation modal in Vila Adora Breakfast App.
- [x] Remove console logging from production code in Vila Adora Breakfast App.
- [x] Initialize git repository for Vila Adora Breakfast App.
- [x] make sure the 401 error has proper handling.
  - ✓ Implemented axios interceptor for auto re-auth in Polymarket Bot.
  - ✓ Added SDK-level 401 detection in Polymarket Bot executor.
  - ✓ Verified system-level 401 detection in Ralph Daemon.
- [x] Generate a list of current blockers for Vila Adora Breakfast App.
- [x] Scaffold Google Ultra AI Server project.
  - ✓ Initialized project and installed discord.js.
  - ✓ Created index.js boilerplate and .env.example.
- [x] User identity confirmed: Call user "Isak"
- [x] Dashboard and status visibility confirmed working

- [x] **FIX: Discord heartbeat prompt concatenating into file path** - Investigated. Code is correct. Added debug logging.
- [x] want to be able to see inbox.md (Requested via Discord: zisak) - Added !inbox command as alias to !queue


- [ ] New incoming task from drop: test_trigger.txt
- [ ] New incoming task from drop: test_trigger2.txt
- [ ] New incoming task from drop: test_trigger3.txt
- [ ] New incoming task from drop: test_trigger4.txt
- [ ] New incoming task from drop: test_trigger5.txt
- [ ] New incoming task from drop: test_trigger6.txt
- [ ] New incoming task from drop: test_trigger7.txt
- [ ] New incoming task from drop: test_trigger8.txt
- [ ] New incoming task from drop: test_trigger9.txt
- [ ] New incoming task from drop: test_trigger_final.txt