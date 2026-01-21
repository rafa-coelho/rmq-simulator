<p align="center">
  <img src="https://raw.githubusercontent.com/rafa-coelho/rmq-simulator/main/public/og-image.png" alt="RabbitMQ Simulator" width="600">
</p>

<h1 align="center">RabbitMQ Simulator</h1>

<p align="center">
  <strong>An interactive visual simulator for learning RabbitMQ concepts</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <a href="./LEIAME.md">🇧🇷 Leia em Português</a>
</p>

---

## About

RabbitMQ Simulator is a free, open-source educational tool that helps developers understand message queuing concepts through an interactive visual interface. Build message flows by dragging and dropping components, connect them with bindings, and watch messages flow through the system in real-time.

Whether you're new to message brokers or want to prototype a RabbitMQ architecture, this simulator provides a hands-on learning experience without the need to set up a real RabbitMQ server.

## Features

### Interactive Canvas
- **Drag & Drop Interface**: Create producers, exchanges, queues, and consumers with intuitive drag-and-drop controls
- **Visual Connections**: Draw bindings between components with routing keys and patterns
- **Real-time Animation**: Watch messages flow through your architecture with smooth animations
- **Pan & Zoom**: Navigate large architectures with mouse/trackpad controls

### Complete RabbitMQ Simulation
- **All Exchange Types**: Direct, Fanout, Topic, and Headers exchanges with accurate routing behavior
- **Message Properties**: Configure routing keys, headers, persistence, and TTL
- **Consumer Settings**: Adjust prefetch count and acknowledgment modes
- **Queue Features**: Durable queues, auto-delete, and message counters

### Learning Resources
- **Comprehensive Documentation**: In-depth guides covering all RabbitMQ concepts
- **Built-in Examples**: Pre-configured scenarios demonstrating common patterns:
  - Simple Queue
  - Work Queues (competing consumers)
  - Publish/Subscribe (fanout)
  - Routing (direct exchange)
  - Topics (pattern matching)
- **Glossary**: Quick reference for messaging terminology

### Multi-language Support
- English
- Português (Brazilian Portuguese)
- Español (Spanish)

### Developer Experience
- **Keyboard Shortcuts**: Speed up your workflow with hotkeys
- **Export/Import**: Save and share your diagrams as JSON
- **Responsive Design**: Works on desktop browsers (mobile shows documentation)
- **Dark Theme**: Easy on the eyes for extended learning sessions

## Demo

**Live Demo**: [https://rmq.racoelho.com.br](https://rmq.racoelho.com.br)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rafa-coelho/rmq-simulator.git
cd rmq-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) with TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

```
src/
├── components/
│   ├── canvas/          # Canvas and node rendering
│   ├── content/         # Learning section content
│   ├── nodes/           # Producer, Exchange, Queue, Consumer components
│   ├── panels/          # Toolbar, Properties, Message panels
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization files
│   └── locales/         # Translation JSON files (en, pt, es)
├── pages/               # Route pages
├── services/            # Analytics and utilities
├── store/               # Zustand state management
└── types/               # TypeScript type definitions
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `P` | Add Producer |
| `E` | Add Exchange |
| `Q` | Add Queue |
| `C` | Add Consumer |
| `Delete` / `Backspace` | Delete selected |
| `Ctrl/Cmd + D` | Duplicate selected |
| `Ctrl/Cmd + A` | Select all |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Escape` | Clear selection |
| `Scroll` | Zoom in/out |
| `Middle Mouse` | Pan canvas |

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features when applicable
- Update documentation as needed

### Translation Contributions

Want to add a new language?

1. Copy `src/i18n/locales/en.json` to a new file (e.g., `fr.json`)
2. Translate all strings
3. Add the language to the selector in `src/components/ui/Header.tsx`
4. Submit a PR!

## Roadmap

- [ ] Dead Letter Exchange (DLX) visualization
- [ ] Message TTL simulation
- [ ] Cluster visualization
- [ ] More exchange type examples
- [ ] Shareable diagram URLs
- [ ] Offline PWA support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

<p align="center">
  <strong>Rafael Coelho</strong>
</p>

<p align="center">
  <a href="https://github.com/rafa-coelho">GitHub</a> •
  <a href="https://racoelho.com.br">Website</a> •
  <a href="https://linkedin.com/in/rafa-coelho">LinkedIn</a>
</p>

## Acknowledgments

- The [RabbitMQ](https://www.rabbitmq.com/) team for their excellent documentation
- The open-source community for the amazing tools that made this project possible

---

<p align="center">
  Made with ❤️ by <a href="https://racoelho.com.br">Rafael Coelho</a>
</p>

<p align="center">
  <a href="https://github.com/rafa-coelho/rmq-simulator/stargazers">⭐ Star this repo if you find it useful!</a>
</p>
