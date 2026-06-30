interface NowPlayingCardProps {
  game: { name: string; exe: string }
}

export default function NowPlayingCard({ game }: NowPlayingCardProps) {
  return (
    <div className="col-span-2 bg-gray-900 border border-green-900 rounded-xl px-4 py-3 flex items-center justify-between">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">
          Now Playing
        </span>
        <span className="text-white font-semibold text-sm truncate" title={game.name}>
          {game.name}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-3">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-400 text-xs">Active</span>
      </div>
    </div>
  )
}
