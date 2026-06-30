import { app, BrowserWindow, Tray, Menu, nativeImage, screen } from 'electron'
import { join } from 'path'
import {
  currentLoad,
  cpuTemperature,
  mem,
  graphics,
  cpuCurrentSpeed
} from 'systeminformation'
import { scanForGame, isGameStillRunning, type DetectedGame } from './gameDetector'

// Module-level refs — must stay alive or the GC will destroy the tray icon
let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null

// Cached game detection result — updated every 5 s on its own interval
// so it doesn't block the 2-second hardware poll
let currentGame: DetectedGame | null = null

// ---------------------------------------------------------------------------
// Window
// ---------------------------------------------------------------------------

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 380,
    height: 520,
    show: false,       // Hidden on launch — tray click reveals it
    frame: false,      // Frameless so it looks like a native popup widget
    resizable: false,
    skipTaskbar: true, // Tray-only app: no entry in the Windows taskbar
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,  // Renderer cannot access Node APIs directly
      nodeIntegration: false,  // Enforces the contextIsolation security boundary
      sandbox: false           // Preload needs Node access to call ipcRenderer
    }
  })

  // Development: load from the Vite dev server (hot-reload)
  // Production:  load the built static file
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Intercept the close button and hide to tray instead of quitting
  win.on('close', (e) => {
    e.preventDefault()
    win.hide()
  })

  // Auto-hide when the user clicks outside the popup
  win.on('blur', () => {
    // Keep the window open while DevTools are docked to it during development
    if (!win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  })

  return win
}

// ---------------------------------------------------------------------------
// Tray
// ---------------------------------------------------------------------------

/**
 * Positions the dashboard window at the bottom-right corner of the primary
 * display's *work area* (the area not covered by the Windows taskbar).
 */
function positionNearTray(win: BrowserWindow): void {
  const { x, y, width, height } = screen.getPrimaryDisplay().workArea
  const { width: winW, height: winH } = win.getBounds()
  win.setPosition(
    x + width - winW - 12,  // 12 px gap from the right edge
    y + height - winH - 12  // 12 px gap from the bottom edge
  )
}

function showWindow(win: BrowserWindow): void {
  positionNearTray(win)
  win.show()
  win.focus()
}

function createTray(win: BrowserWindow): void {
  // Load the icon from resources/; gracefully fall back to an empty icon so
  // the app still runs even if the file is missing.
  const iconPath = join(app.getAppPath(), 'resources', 'icon.png')
  let icon = nativeImage.createFromPath(iconPath)
  if (icon.isEmpty()) {
    icon = nativeImage.createEmpty()
    console.warn('[tray] Icon not found at:', iconPath)
  }

  tray = new Tray(icon)
  tray.setToolTip('RigSage — Hardware Monitor')

  // Right-click context menu
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Dashboard', click: () => showWindow(win) },
    { type: 'separator' },
    { label: 'Quit RigSage', click: () => app.exit(0) }
  ])
  tray.setContextMenu(contextMenu)

  // Left-click toggles the dashboard
  tray.on('click', () => {
    win.isVisible() ? win.hide() : showWindow(win)
  })
}

// ---------------------------------------------------------------------------
// Hardware metrics
// ---------------------------------------------------------------------------

export interface HardwareMetrics {
  cpu: {
    usage: number      // 0–100 %
    speed: number      // GHz (average across all cores)
    temp: number | null  // °C — null when no sensor is available
  }
  ram: {
    used: number   // GB
    total: number  // GB
  }
  // null when no GPU is detected
  gpu: { name: string; load: number | null } | null
  // null when no recognised game process is running
  game: { name: string; exe: string } | null
}

/**
 * Fetches all hardware metrics in parallel.
 * systeminformation queries are async OS calls; parallelising them keeps
 * the 2-second polling interval tight.
 */
async function collectMetrics(): Promise<HardwareMetrics> {
  const [load, temp, memory, gpu, speed] = await Promise.all([
    currentLoad(),
    cpuTemperature(),
    mem(),
    graphics(),
    cpuCurrentSpeed()
  ])

  const controller = gpu.controllers[0]

  return {
    cpu: {
      usage: Math.round(load.currentLoad),
      speed: Number(speed.avg.toFixed(2)),
      // cpuTemperature().main is null on most systems without a compatible sensor
      temp: temp.main ?? null
    },
    ram: {
      // mem() returns bytes; divide twice by 1024^3 to get GB
      used: Number((memory.active / 1_073_741_824).toFixed(2)),
      total: Number((memory.total / 1_073_741_824).toFixed(1))
    },
    gpu: controller
      ? {
          name: controller.model,
          // utilizationGpu is undefined on some drivers; coerce to null
          load: controller.utilizationGpu ?? null
        }
      : null,
    game: currentGame
  }
}

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------

app.whenReady().then(() => {
  mainWindow = createWindow()
  createTray(mainWindow)

  // Push a fresh metrics snapshot to the renderer every 2 seconds
  const poll = setInterval(async () => {
    if (!mainWindow || mainWindow.isDestroyed()) return
    try {
      const metrics = await collectMetrics()
      mainWindow.webContents.send('metrics-update', metrics)
    } catch (err) {
      // Don't crash the app on a single failed read (e.g. WMI hiccup)
      console.error('[metrics]', err)
    }
  }, 2000)

  // Two-mode game detection — avoids expensive process scans during gameplay:
  //
  //  No game detected → full scan every 10 s (tasklist, ~50–150 ms)
  //  Game detected    → targeted check every 5 s (filtered tasklist, < 10 ms)
  //
  // The interval fires every 5 s. The full scan only runs on every other
  // tick (via the toggle flag) so it effectively runs every 10 s.
  let runFullScan = true

  const gamePoll = setInterval(async () => {
    try {
      if (currentGame) {
        // Cheap path: just confirm the known process is still alive
        const alive = await isGameStillRunning(currentGame.exe)
        if (!alive) {
          currentGame = null
          runFullScan = true  // reset so next tick does a full scan immediately
        }
      } else if (runFullScan) {
        // Expensive path: scan all processes — throttled to every 10 s
        currentGame = await scanForGame()
        runFullScan = false
      } else {
        runFullScan = true  // allow full scan on the next tick
      }
    } catch {
      // Game detection is non-critical — never let it crash the app
    }
  }, 5000)

  app.once('before-quit', () => {
    clearInterval(poll)
    clearInterval(gamePoll)
  })
})

// Tray apps must keep running even when the dashboard window is closed/hidden
app.on('window-all-closed', () => {
  // Intentionally empty — the tray keeps the process alive
})
