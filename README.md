# NerdWord 🤓

A Wordle-style word guessing game focused on nerdy topics including movies, science, video games, anime, literature, and more! Built with React Native and Expo.

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

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- pnpm (recommended) or npm
- Expo CLI (`npm install -g @expo/cli`)
- For development: Expo Go app on your mobile device

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dillon-cleaver/nerd-wordle.git
   cd nerd-wordle
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm start
   # or
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `i` for iOS simulator, `a` for Android emulator

### Available Scripts

- `pnpm start` - Start the Expo development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS device/simulator
- `pnpm web` - Run in web browser
- `pnpm test` - Run tests with Jest
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm build` - Build for production

## 🔧 Development Setup

### Firebase Functions (Optional)

The app includes Firebase Functions for puzzle history and user data. To run the backend locally:

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Start Firebase emulators**

   ```bash
   cd functions
   pnpm install
   pnpm serve
   ```

   This starts the Functions and Firestore emulators at `http://127.0.0.1:5001`

3. **Configure emulator connection**
   - The app automatically detects when running against local emulators
   - Production builds connect to deployed Firebase services

### Project Structure

```
├── app/                    # Expo Router pages
├── components/            # Reusable UI components
├── constants/             # Game data and styling constants
├── context/              # React Context providers
├── firebase/             # Firebase configuration
├── functions/            # Firebase Cloud Functions
├── hooks/                # Custom React hooks
├── storage/              # Local storage utilities
├── types/                # TypeScript type definitions
└── utils/                # Helper functions and game logic
```

## 🎯 Features

- **Daily Puzzles**: New themed word puzzles each day
- **Multiple Categories**: Diverse nerdy topics to challenge different interests
- **Hint System**: Progressive hints to help when you're stuck
- **User Authentication**: Sign in with Google to save progress
- **Puzzle History**: Track your wins, attempts, and statistics
- **Word Collection**: Collect and learn about words you've solved
- **Cross-Platform**: Works on iOS, Android, and web
- **Offline Support**: Play even without internet connection

## 🛠 Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Firebase (Auth, Firestore, Functions), Express.js
- **Styling**: React Native StyleSheet
- **Navigation**: Expo Router with Drawer navigation
- **State Management**: React Context
- **Testing**: Jest
- **Linting**: ESLint with Expo config

## 📱 Deployment

### Building for Production

```bash
# For web
pnpm build

# For mobile (requires EAS Build)
npx eas build --platform all
```

### Firebase Deployment

```bash
# Deploy functions
cd functions
pnpm deploy

# Deploy hosting (if configured)
firebase deploy --only hosting
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the original Wordle by Josh Wardle
- Built with the amazing Expo and React Native ecosystem
- Word data and categories curated for maximum nerdiness!
