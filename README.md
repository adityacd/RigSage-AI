# RigSage

A Windows system-tray app that shows live PC hardware stats. Portfolio project — clean, interview-ready code.

## Stack

| Layer | Tech |
|---|---|
| Desktop shell | Electron |
| Build tooling | electron-vite + Vite |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS (dark theme) |
| Hardware data | systeminformation |

## Prerequisites

- Windows 10 or 11
- Node.js 18+ (tested on v24)

## Running in Dev Mode

```bash
npm install
npm run dev
```

The app starts **minimized to the system tray** (notification area, bottom-right of your taskbar).

- **Left-click** the tray icon → toggle dashboard open/closed
- **Right-click** the tray icon → context menu (Open Dashboard / Quit)

The dashboard auto-hides when you click away from it.

## Project Structure

```
src/
  main/         Electron main process — window, tray icon, hardware polling
  preload/      IPC bridge — exposes window.api to the renderer via contextBridge
  renderer/     React UI — dashboard cards, live metric display
resources/
  icon.png      System tray icon (32×32 PNG)
```

## Hardware Data Notes

Metrics are polled every 2 seconds via the `systeminformation` package.

| Metric | Windows Support | Notes |
|---|---|---|
| CPU Usage % | ✅ Always | Via Windows performance counters |
| CPU Clock (GHz) | ✅ Always | Average across all cores |
| CPU Temp (°C) | ⚠️ Hardware-dependent | Requires a compatible ACPI/WMI sensor. Shows **N/A** if unavailable. |
| RAM Used / Total | ✅ Always | |
| GPU Load % | ⚠️ Driver-dependent | Works with most NVIDIA cards. AMD/Intel varies by driver version. Shows **N/A** if the driver doesn't expose utilization. |

> **CPU Temperature:** Most desktop motherboards expose this without admin rights. Laptops are hit-or-miss. N/A is normal, not a bug.

> **GPU Load:** If you see N/A on a dedicated GPU, try updating your graphics driver.

## Security Model

- `contextIsolation: true` + `nodeIntegration: false` in the renderer
- All IPC goes through a typed `contextBridge` in `src/preload/index.ts`
- The renderer only sees `window.api.onMetricsUpdate` — nothing from Node or Electron leaks through
- Content Security Policy set in `index.html`

## Next Steps (planned)

- [ ] Sparkline charts for metric history
- [ ] AI-powered game settings recommendations
- [ ] Per-game profiles
