interface GameSelectorCardProps {
  game: { name: string; exe: string } | null
}

export default function GameSelectorCard({ game }: GameSelectorCardProps) {
  return (
    <div
      className="flex items-center gap-[14px] rounded-[10px] border"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', padding: '1.1rem 1.25rem' }}
    >
      <div
        className="w-[52px] h-[52px] rounded-lg flex items-center justify-center text-2xl shrink-0"
        style={{ background: 'linear-gradient(135deg, #4c1d95, #5b21b6)' }}
      >
        {game ? '🗡️' : '🎮'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-[3px]" style={{ color: 'var(--text-dim)' }}>
          {game ? 'Currently analysing' : 'No game detected'}
        </div>
        <div className="text-[15px] font-semibold">
          {game ? game.name : 'Launch a game to get recommendations'}
          {game && (
            <span className="text-xs font-normal ml-2" style={{ color: 'var(--text-dim)' }}>
              target 60 fps
            </span>
          )}
        </div>
      </div>

      <button
        className="flex items-center gap-[6px] text-[12px] font-medium rounded-md px-[14px] py-2 border"
        style={{ color: 'var(--text-dim)', borderColor: 'var(--border-strong)', background: 'transparent' }}
      >
        ↻ Rescan
      </button>
    </div>
  )
}
