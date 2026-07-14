# Pomomodoro

A simple Pomodoro timer built with Next.js 16 and React 19.

Live at [https://pomomodoro.vpardos.dev](https://pomomodoro.vpardos.dev)

![Pomodoro Timer](https://img.shields.io/badge/Next.js-16.2.10-black?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=flat-square&logo=tailwind-css)

![Screenshot](./screenshots/Screenshot-2.png)

## Features

- **Pomodoro Timer** — Work/short break/long break phases
- **Customizable Durations** — Configure work, short break, long break durations and long break interval
- **Circular Progress Display** — Visual timer with phase-specific accent colors
- **Sound Notifications** — Sound on phase transitions
- **Browser Notifications** — Notifications on phase changes
- **Alarm System** — Schedule alarms for specific times with sound/notification alerts
- **Task System** — Track up to 5 tasks with check-to-complete
- **Theme System** — Light/dark/OLED modes
- **Settings Persistence** — All settings saved to localStorage
- **Dynamic Page Title** — Shows remaining time and current phase in browser tab

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/vpardoss/Pomomodoro.git
cd Pomomodoro

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Lint

```bash
# Run ESLint
npm run lint
```

## Tech Stack

- **Framework**: Next.js 16.2.10 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui v4 with @base-ui/react
- **Icons**: lucide-react
- **Language**: TypeScript


## License

MIT


## Acknowledgments

- [Catppuccin](https://catppuccin.com/) — Themes
- [Dracula](https://draculatheme.com/) — Themes
- [Nord](https://www.nordtheme.com/) — Themes
- [shadcn/ui](https://ui.shadcn.com/) — Components
- [Next.js](https://nextjs.org/) — The React framework
- [Tailwind CSS](https://tailwindcss.com/) — CSS framework
