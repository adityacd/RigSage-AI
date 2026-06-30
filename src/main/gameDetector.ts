import { exec } from 'child_process'
import { promisify } from 'util'
import { GAME_DB } from './gameDb'

const execAsync = promisify(exec)

export interface DetectedGame {
  name: string  // Display name, e.g. "Counter-Strike 2"
  exe: string   // Process name as reported by tasklist, e.g. "cs2.exe"
}

/**
 * Full process scan — checks every running process against GAME_DB.
 *
 * Uses Windows' built-in `tasklist` command instead of si.processes().
 * tasklist calls native Win32 APIs (EnumProcesses) directly, whereas
 * si.processes() goes through WMI/COM which has much heavier overhead
 * and was causing noticeable frame drops during gameplay.
 *
 * Still takes ~50–150 ms, so only call this when no game is detected.
 * Once a game is found, switch to isGameStillRunning() instead.
 */
export async function scanForGame(): Promise<DetectedGame | null> {
  try {
    const { stdout } = await execAsync('tasklist /FO CSV /NH', { timeout: 4000 })

    for (const line of stdout.split('\n')) {
      // tasklist CSV format: "chrome.exe","1234","Console","1","50,732 K"
      const exeName = line.split(',')[0]?.replace(/"/g, '').toLowerCase().trim()
      if (!exeName) continue

      const gameName = GAME_DB[exeName]
      if (gameName) return { name: gameName, exe: exeName }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Targeted single-process check — verifies only whether a known game
 * is still running. Uses a filtered tasklist query which is near-instant
 * (< 10 ms) and safe to call every few seconds during active gameplay.
 *
 * This replaces the expensive full scan once a game has been identified.
 */
export async function isGameStillRunning(exe: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync(
      `tasklist /FI "IMAGENAME eq ${exe}" /FO CSV /NH`,
      { timeout: 2000 }
    )
    // tasklist returns "INFO: No tasks..." when nothing matches
    return stdout.toLowerCase().includes(exe.toLowerCase())
  } catch {
    return false
  }
}
