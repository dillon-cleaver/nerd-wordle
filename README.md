# NerdWord 🤓

A Wordle-style word guessing game focused on nerdy topics including movies, science, video games, anime, literature, and more! Built with React Native and Expo.

[![Web App](https://img.shields.io/badge/Play%20Online-nerd--wordle.expo.app-blue)](https://nerd-wordle.expo.app)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)](https://firebase.google.com/)
[![Expo](https://img.shields.io/badge/Built%20with-Expo-000020.svg?style=flat&logo=expo)](https://expo.dev/)

## 🎮 What is NerdWord?

NerdWord puts a geeky twist on the classic word-guessing game. Instead of just common words, you'll be guessing terms from:

- 🎬 Movies & TV
- 🧪 Science
- 🎮 Video Games
- 📚 Literature
- 🦸 Superheroes
- 🎲 Board Games
- 🎌 Anime & Manga
- 🔮 Fantasy & Sci-Fi
- 💻 Tech & Internet Culture

Each puzzle includes hints and Wikipedia links to help you learn more about the topics!

## 🚀 Quick Start

### Play Online

Visit [nerd-wordle.expo.app](https://nerd-wordle.expo.app) to play in your browser!

### Mobile Development

```bash
# Clone and install
git clone https://github.com/dillon-cleaver/nerd-wordle.git
cd nerd-wordle
pnpm install

# Start development server
pnpm start

# Run on device
# - Scan QR code with Expo Go app
# - Or press 'i' for iOS, 'a' for Android
```

### Full Development Setup

For backend development and testing:

```bash
# Install dependencies
pnpm install
cd functions && pnpm install && cd ..

# Start Firebase emulators + Expo
pnpm run dev:full
```

**📖 For detailed setup instructions, see [docs/development-guide.md](docs/development-guide.md)**

### Quick Commands

| Command                   | Description                     |
| ------------------------- | ------------------------------- |
| `pnpm start`              | Start Expo dev server           |
| `pnpm run dev`            | Start Expo + Firebase emulators |
| `pnpm run dev:full`       | Start Expo + emulators + seed data |
| `pnpm run deploy:web`     | Deploy web app                  |
| `pnpm run deploy:backend` | Deploy backend functions        |
| `pnpm run deploy:all`     | Deploy everything               |

## 🎯 Features

- **Daily Puzzles** 📅 - New themed word puzzles each day
- **Multiple Categories** 🎲 - Diverse nerdy topics
- **Hint System** 💡 - Progressive hints when you're stuck
- **Cross-Platform** 📱 - iOS, Android, and web
- **3,800+ Words** 📚 - Curated nerdy vocabulary
- **User Progress** 📊 - Track stats and puzzle history
- **Offline Support** ⚡ - Play without internet

## 🏗️ Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Firebase (Functions, Firestore, Auth)
- **Deployment**: EAS Build/Update, Firebase Hosting
- **Development**: Expo Router, React Context, Jest

## � Project Structure

```
nerd-wordle/
├── app/                    # Expo Router pages
├── components/             # Reusable UI components
├── functions/              # Firebase Cloud Functions
├── constants/              # Game data and styling
├── utils/                  # Helper functions
├── docs/                   # Documentation
└── package.json            # Dependencies & scripts
```

## 🚀 Deployment

The app is deployed to multiple platforms:

- **Web**: [nerd-wordle.expo.app](https://nerd-wordle.expo.app) (EAS Hosting)
- **Mobile**: EAS Update for over-the-air updates
- **Backend**: Firebase Functions on Google Cloud

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test with `pnpm run dev:full`
5. Submit a pull request

See [docs/development-guide.md](docs/development-guide.md) for detailed development instructions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the original Wordle by Josh Wardle
- Built with the amazing Expo and React Native ecosystem
- Word data curated for maximum nerdiness! 🤓
