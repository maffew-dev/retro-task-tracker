# 💾 RetroVibe Tasks: 8-Bit Retro Kanban & Dashboard

A high-aesthetic, gamified task tracker web app designed for youth and young adults. It fuses 90s OS / Y2K arcade / Vaporwave nostalgia with modern productivity workflows.

---

## ⚡ Features

### 📋 Retro Kanban Board
- **Fluid Drag-and-Drop**: Drag task cards seamlessly between columns with procedural 8-bit sound effects.
- **Customizable Columns**: Create, rename, customize emoji & color, or delete columns.
- **Interactive Task Cards**:
  - Priority badges: `CHILL 🍃`, `MED ⚡`, `BOSS FIGHT 👾`
  - Retro sticker tags: `#BOSS FIGHT`, `#CREATIVE`, `#VIBING`, `#BUG`, `#SIDE QUEST`, `#STUDY`, `#DEADLINE`
  - Subtask checklist with real-time progress bar.
  - Due date countdown indicators (`DUE TODAY ⚡`, `OVERDUE! 💀`).
  - XP value indicator (`+120 XP`).
  - Quick `FINISH` button with celebratory confetti explosion & audio chime.
- **Search & Filters**: Instant search by title/lore, filter by sticker tag, or filter by priority.

### 📊 System Analytics Dashboard
- **Gamified Level & XP Progression**: Gain XP by completing quests and clocking focus sessions (Level 1 Novice -> Level 10 Task Wizard).
- **Streak Tracker**: Daily streak counter (`🔥 X Days`) with flame animations.
- **28-Day Activity Pixel Matrix**: GitHub-style retro arcade punch card heatmap showing daily productivity velocity.
- **Pipeline & Priority Gauges**: Segmented progress bar of all active quests and upcoming deadlines radar.
- **Today's Vibe Check-in**: Choose your vibe (`⚡ LOCKED IN`, `🍵 CHILL MODE`, `👾 CHAOS CRUNCH`, `🎨 CREATIVE FLOW`, `😴 LOW BATTERY`) with reactive pixel mascot emotes and daily fortunes.

### ⏳ Lo-Fi Focus Station (Pomodoro)
- Retro LCD digital clock display with 25m Focus, 5m Chill, and 15m Speedrun presets.
- Procedural digital beeps upon timer completion.
- Animated retro pixel mascot typing or chilling.
- Automatically records focus minutes and awards bonus XP.

### 🎨 4 Interchangeable Retro Aesthetics
1. **🌆 CYBERPUNK / VAPORWAVE**: Neon cyan and magenta glow, dark arcade grid.
2. **💾 WIN 98 OS**: Classic 3D beveled window frames, teal desktop wallpaper.
3. **🍵 LO-FI MATCHA**: Pastel sage and warm oat milk cream paper textures.
4. **🕹️ 8-BIT ARCADE**: High-contrast pop colors, GameBoy yellow, and arcade shadows.

### 🔊 Procedural 8-bit Audio & CRT Filter
- **Zero External Files**: Built entirely on the HTML5 Web Audio API using procedural oscillator waves (square/triangle wave ticks, sweeps, chimes, and fanfare).
- **Mute Toggle**: Quick audio switch in the top bar.
- **CRT Scanline Mode**: Authentic TV phosphor scanlines and vignette effect overlay.

### 💾 Floppy Disk Save & Cartridge Load
- LocalStorage state persistence.
- Export all quests, columns, and stats as a JSON file (`Save to Floppy Disk`).
- Import any JSON cartridge (`Load Cartridge`).
- Quick reset to factory demo data anytime.

---

## 🚀 Running the App

### Start Development Server
```bash
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
