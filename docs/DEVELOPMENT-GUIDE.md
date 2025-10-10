# NerdWord Development Guide

Get backend and frontend running quickly.

## 🚀 Quick Start

```bash
# 1. Install dependencies (takes ~90 seconds)
pnpm install
cd functions && pnpm install && cd ..

# 2. Start backend (Terminal 1)
cd functions
pnpm dev:emulator

# 3. Start frontend (Terminal 2)
pnpm dev:web
```

Open the URL shown in Terminal 2 (usually http://localhost:8081).

## 📋 Common Commands

### Development

```bash
# Web development
pnpm dev:web

# Testing mode (bypass daily limit)
pnpm dev:web:bypass

# Clear cache
pnpm clean
```

### Code Quality

```bash
# Run before committing
pnpm lint && pnpm typecheck
```

## 🛠️ Development Modes

| Mode     | Daily Limit | Use Case               |
| -------- | ----------- | ---------------------- |
| Standard | Enforced    | Normal development     |
| Bypass   | Disabled    | Testing multiple games |

Dev badge appears in header during development.

## 🗄️ Word Management

### Adding Words

```bash
# Interactive addition
pnpm words:add

# Deploy to CDN and Firestore
pnpm words:deploy:all

# Or deploy separately
pnpm words:deploy:cdn        # CDN only
pnpm words:deploy:firestore  # Firestore only
```

### Validation

```bash
pnpm words:validate      # Check for errors
pnpm words:verify WORD   # Verify deployment
pnpm words:status        # Show status
```

## 🏗️ Deployment

```bash
# Deploy everything
pnpm deploy:all

# Deploy separately
pnpm deploy:app       # Frontend
pnpm deploy:backend   # Backend

# Deploy words only (no app rebuild)
pnpm words:deploy:all
```

## 🔧 Backend Development

### Emulator Commands

```bash
cd functions

# Persistent data (recommended)
pnpm dev:emulator

# Fresh start
pnpm dev:clean

# Import production data
pnpm dev:prod-data

# Reset all data
pnpm dev:reset
```

### Backend Tools

```bash
cd functions

# Build TypeScript
pnpm build

# Continuous compilation
pnpm dev

# Interactive shell
pnpm shell

# Production logs
pnpm logs
```

## 📁 Project Structure

```
nerd-wordle/
├── app/              # Expo Router pages
├── components/       # React components
├── data/            # words.json (source of truth)
├── functions/       # Firebase backend
│   ├── src/        # TypeScript source
│   └── lib/        # Compiled JavaScript
├── public/dict/    # CDN dictionaries
├── scripts/        # Build scripts
└── utils/          # Utilities
```

## 🚨 Troubleshooting

### Backend Issues

```bash
cd functions
pnpm dev:reset
firebase emulators:list
```

### Frontend Issues

```bash
pnpm clean

# Nuclear option
rm -rf .expo node_modules
pnpm install
```

### General

```bash
pnpm lint && pnpm typecheck
cd functions && pnpm build
```

## 🎯 First Time Setup

```bash
# Install tools
npm install -g pnpm firebase-tools

# Login
firebase login
```

**Required:** Node.js 20+

---

**More details:** See other docs in `/docs/` or `.github/copilot-instructions.md`
