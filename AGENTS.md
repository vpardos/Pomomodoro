<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (includes TypeScript check)
- `npm run lint` — ESLint
- No test framework configured

## Toolchain quirks

- **Next.js 16.2.10** with App Router, React 19, TypeScript
- **shadcn/ui v4** uses `@base-ui/react` (not Radix). Style: `base-nova`. Components in `src/components/ui/`
- **Tailwind CSS v4** — config in `src/app/globals.css`, not `tailwind.config.js`
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
- `src/lib/` — utilities (`utils.ts` has `cn()` helper, `alarm.ts` has audio)

## Code organization notes

- `ScheduleCard` is exported from `alarm-card.tsx`, not a separate file
- Theme system: `useTheme` (mode) + `usePalette` (Catppuccin flavor) + `ThemeProvider` (context)
- Timer state: `usePomodoro` (core logic) + `useNotifications` (alerts/alarms)
