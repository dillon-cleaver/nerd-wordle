# NerdWord 🤓

A cross-platform word-guessing game featuring 3,800+ words from nerdy topics (movies, science, anime, literature, and more). Built with React Native, Expo, and Firebase.

[![Play Online](https://img.shields.io/badge/Play%20Online-nerd--word.expo.app-blue)](https://nerd-word.expo.app)
[![Status](https://img.shields.io/badge/Status-Alpha%20Testing-yellow)](https://nerd-word.expo.app)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)](https://firebase.google.com/)
[![Expo](https://img.shields.io/badge/Built%20with-Expo-000020.svg?style=flat&logo=expo)](https://expo.dev/)

## ✨ Key Features

- **Daily Themed Puzzles** - New word from 9+ nerdy categories each day
- **CDN-First Architecture** - Instant word updates without app redeployment (243KB bundle reduction)
- **Educational Integration** - Wikipedia links and hints for learning
- **Cross-Platform** - iOS, Android, and web from single codebase
- **User Progress Tracking** - Firebase-backed puzzle history and statistics
- **Offline Support** - Play without internet connection

## 🏗️ Tech Stack

- **Frontend**: React Native, Expo (Router, Updates), TypeScript
- **Backend**: Firebase (Functions, Firestore, Auth, Hosting)
- **State Management**: React Context API
- **Performance**: CDN-first loading, browser caching, bundle optimization
- **Testing**: Jest, Firebase Emulators

## 🚀 Quick Start

**🌐 Try the alpha web version at [nerd-word.expo.app](https://nerd-word.expo.app)**  
_(Currently in alpha testing • iOS and Android native apps coming soon)_

```bash
# Clone and install dependencies
git clone https://github.com/dillon-cleaver/nerd-wordle.git
cd nerd-wordle
pnpm install
cd functions && pnpm install && cd ..

# Start Firebase emulators (for backend development)
cd functions && pnpm run dev:emulator

# In a separate terminal, start Expo dev server
pnpm run dev
```

**📖 See [docs/DEVELOPMENT-GUIDE.md](docs/DEVELOPMENT-GUIDE.md) for complete setup instructions**

## 📊 Performance Highlights

- **Bundle Size**: 2.69MB (optimized from 3.2MB)
- **Word Dictionary**: 243KB externalized to CDN
- **Cache Strategy**: Browser HTTP cache with URL-based versioning
- **localStorage**: 99.96% reduction (metadata only)

See [docs/CDN-OPTIMIZATION.md](docs/CDN-OPTIMIZATION.md) for architecture details.

## 📁 Project Structure

```
nerd-wordle/
├── app/                    # Expo Router pages
├── components/             # Reusable UI components
├── functions/              # Firebase Cloud Functions (Express API)
├── context/                # React Context providers (state management)
├── data/                   # Source data (words.json - single source of truth)
├── public/dict/            # CDN word dictionary (auto-versioned)
├── scripts/                # Build and word management automation
├── docs/                   # Comprehensive documentation
└── storage/                # CDN-first loading logic
```

## 🔗 Documentation

- **[Development Guide](docs/DEVELOPMENT-GUIDE.md)** - Complete setup and workflow
- **[Word Management](docs/WORD-MANAGEMENT-GUIDE.md)** - Adding and deploying words
- **[CDN Optimization](docs/CDN-OPTIMIZATION.md)** - Architecture and performance
- **[Deployment Pipeline](docs/DEPLOYMENT-PIPELINE.md)** - CI/CD and releases
- **[API Testing](docs/API-TESTING-GUIDE.md)** - Backend testing with emulators

## 🚀 Deployment

**Live App**: [nerd-word.expo.app](https://nerd-word.expo.app)

```bash
# Deploy everything
pnpm run deploy:all

# Deploy individually
pnpm run deploy:app      # Web app to EAS Hosting
pnpm run deploy:backend  # Functions to Firebase
```

See [docs/DEPLOYMENT-PIPELINE.md](docs/DEPLOYMENT-PIPELINE.md) for details.

## 💡 Notable Implementation Details

- **Auto-Versioning System**: CDN word updates with URL-based cache busting
- **Dual Data Systems**: CDN for client loading, Firestore for server operations
- **Letter Tracking Analytics**: Detailed game statistics stored in Firestore
- **Environment-Aware Builds**: Development, testing, and production modes
- **Firebase Emulators**: Complete local development environment

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Expo and Firebase** | [Play Now](https://nerd-word.expo.app) 🎮
