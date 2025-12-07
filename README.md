# 🐺 Next Wolvesville

A real-time multiplayer social deduction game inspired by Wolvesville, built with Next.js and Socket.IO. This is the **client-side** application.

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-green?style=flat-square&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 🎮 About The Game

Next Wolvesville is a modern web implementation of the classic Werewolves game. Players are assigned secret roles and must work together (or against each other) to achieve their team's victory conditions. The game features real-time communication, multiple roles with unique abilities, and an immersive day/night cycle.

> **Note:** This repository contains the **frontend/client-side** of the application. The backend server handles game logic, WebSocket connections, and player management.

### Key Features

- 🌐 **Real-time Multiplayer** - Powered by WebSockets for instant gameplay
- 🎭 **Multiple Roles** - Classic Werewolf, Seer, Doctor, Jailer, and more
- 💬 **In-game Chat** - General, Wolves, and Jail chat rooms
- 🤖 **AI Players** - CPU-controlled players to fill empty slots
- 🌍 **Internationalization** - English and French language support
- 🎨 **Custom Avatars** - Personalize your character with DiceBear avatars
- 🎵 **Audio Effects** - Immersive sound design with volume controls
- 📱 **Responsive Design** - Play on desktop, tablet, or mobile
- 🌓 **Day/Night Cycle** - Dynamic gameplay phases with voting and actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/DylanP97/next-wolvesville.git
cd next-wolvesville
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
# Create a .env file in the root directory
# Add your backend server URL
NEXT_PUBLIC_SERVER_URL=your_backend_server_url
```

4. **Important:** Make sure your backend server is running before starting the client

5. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

> **Important:** This is only the client application. You need to have the backend server running for the game to function properly. First-time server connection may take up to 50 seconds.

## 🎯 How to Play

### Game Modes

1. **Quick Game** - Solo play with random role assignment
2. **Create Room** - Set up a custom game with specific roles and player count
3. **Join Room** - Browse and join existing lobbies

### Game Phases

- **🌑 Commencement Night** - Players receive their roles
- **☀️ Daytime** - Players discuss and share information
- **✉️ Vote Time** - Village votes to eliminate a player
- **🌒 Nighttime** - Special roles perform their abilities
- **🌒 Night Results** - Night actions are revealed

### Roles

The game features various roles including:

- **🐺 Werewolves** - Eliminate villagers at night
- **👁️ Seer** - Discovers player identities
- **👩‍⚕️ Doctor/Witch** - Protects or heals players
- **👮‍♂️ Jailer** - Arrests and interrogates players
- **🔫 Gunner** - Can shoot during the day
- **🤡 Fool** - Wins if voted out by the village
- And many more...

## 🛠️ Built With

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **NextUI** - Beautiful React component library
- **Lucide React** - Icon library
- **React Lottie** - Animation library
- **React Confetti** - Celebration effects

### Backend & Real-time
- **Socket.IO Client** - Real-time bidirectional communication with the server
- **WebSocket** - Real-time connection to backend server

> **Backend Repository:** The server-side application is hosted separately and handles game logic, room management, and WebSocket connections.

### Internationalization
- **i18next** - Translation framework
- **react-i18next** - React bindings for i18next

### Avatar System
- **DiceBear** - Avatar generation library

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📁 Project Structure

```
next-wolvesville/
├── app/
│   ├── components/          # Reusable UI components
│   ├── connexion/          # Authentication pages
│   ├── create-room/        # Room creation flow
│   ├── game/               # Game interface and logic
│   ├── general-btns/       # Common button components
│   ├── homepage/           # Home page components
│   ├── join-room/          # Room joining interface
│   ├── lib/                # Utility functions
│   ├── profile/            # User profile pages
│   ├── providers/          # React context providers
│   ├── layout.js           # Root layout
│   ├── page.js             # Home page
│   └── globals.css         # Global styles
├── public/
│   ├── animations/         # Lottie animation files
│   ├── audio/              # Sound effects
│   ├── game/               # Game assets
│   └── locals.json         # Translation files
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Features in Detail

### Room Creation
- Customize game settings
- Select specific roles for the game
- Choose between real players and AI
- Set preferred roles for players

### Chat System
- **General Chat** - All players communicate
- **Wolves Chat** - Night discussion for werewolves
- **Jail Chat** - Private conversation between jailer and prisoner

### Avatar Customization
- Body, head, clothes, and accessories
- Multiple color options
- Facial features customization
- Persistent across sessions

### Internationalization
- Full English and French translations
- Automatic language detection
- Easy language switching
- Localized game messages and UI

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend server URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
# or your deployed backend URL
```

> **Note:** The client connects to a separate backend server via Socket.IO. Make sure the backend is accessible at the URL you configure.

### Socket.IO Configuration

This application uses Socket.IO Client to connect to the backend server. The connection is established automatically when the app loads, connecting to the server URL specified in your environment variables.

## 📝 Scripts

```bash
# Development
npm run dev        # Start development server

# Production
npm run build      # Build for production
npm run start      # Start production server

# Code Quality
npm run lint       # Run ESLint
```

## 🐛 Known Issues & Future Improvements

### Current Status (as of May 28, 2024)
- Some role actions need fixes
- Enhanced role selection for all players (currently only room creator)

### Planned Features
- Improved matchmaking system
- Additional game roles
- Enhanced AI player behavior
- Tournament mode
- Player statistics and rankings
- Spectator mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is a personal implementation inspired by the game Wolvesville. Please check [Wolvesville's official website](https://wolvesville.com/) for the original game.

## 👨‍💻 Author

**DylanP97**
- GitHub: [@DylanP97](https://github.com/DylanP97)
- Portfolio: [d97-portfolio.vercel.app](https://d97-portfolio.vercel.app)

## 🙏 Acknowledgments

- Inspired by [Wolvesville](https://wolvesville.com/)
- Thanks to all contributors and players
- Built with modern web technologies

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/DylanP97/next-wolvesville/issues) page
2. Create a new issue if your problem isn't already listed
3. For general questions, feel free to reach out

---

**Note:** For the best experience, play in full-screen mode! 🎮

Made with ❤️ by DylanP97
