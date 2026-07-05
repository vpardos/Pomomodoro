<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (runs TypeScript check)
- `npm run lint` — ESLint (strict React hooks rules)

## Toolchain quirks

- **Next.js 16.2.10** with App Router, React 19, TypeScript
- **shadcn/ui v4** uses `@base-ui/react` (not Radix). Components in `src/components/ui/`
- **Tailwind CSS v4** — syntax differs from v3. Config in `src/app/globals.css`, not `tailwind.config.js`
- Path alias: `@/*` → `./src/*`

## Strict lint rules (will fail build)

- Cannot call `setState` synchronously inside `useEffect` body
- Cannot update refs during render — use `useEffect` to sync ref values
- Cannot call impure functions (`Date.now()`, `Math.random()`) during render
- Use refs pattern for interval callbacks that need current state

## File structure

- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — React components (feature components)
- `src/components/ui/` — shadcn/ui primitives (auto-generated, don't edit)
- `src/hooks/` — custom React hooks
- `src/lib/` — utilities (`utils.ts` has `cn()` helper)

## Project status

### Implemented features

- **Pomodoro timer** — work/short break/long break phases with automatic transitions
- **Customizable durations** — configurable work, short break, long break durations and long break interval
- **Circular progress display** — visual timer with phase-specific accent colors
- **Sound notifications** — Web Audio API chime on phase transitions
- **Browser notifications** — native notifications on phase changes (with permission handling)
- **Alarm system** — schedule alarms for specific times with sound/notification alerts
- **Theme system** — light/dark/OLED modes with smooth transitions
- **Catppuccin palettes** — latte, frappe, macchiato, mocha flavor support
- **Settings persistence** — all settings saved to localStorage
- **Dynamic page title** — shows remaining time and current phase in browser tab
- **Responsive layout** — mobile-first design with grid adjustments

### Architecture

- `usePomodoro` — core timer logic with phase management and cycle tracking
- `useNotifications` — browser notifications, sound toggle, and alarm management
- `useTheme` — light/dark/OLED mode switching
- `usePalette` — Catppuccin flavor application with theme-aware defaults
- `ThemeProvider` — context provider combining theme and palette systems
- `playAlarm` — Web Audio API synthesizer for notification sounds

### UI components

- `TimerDisplay` — circular progress with time and phase display
- `SettingsDialog` — duration configuration modal
- `ScheduleCard` — sound/notification toggles and schedule info
- `AlarmsCard` — alarm management interface
- `PaletteSelector` — Catppuccin flavor picker
- `ThemeToggle` — theme mode switcher
- `TaskPlaceholder` — placeholder for future task management feature
