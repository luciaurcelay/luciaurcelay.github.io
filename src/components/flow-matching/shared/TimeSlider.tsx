import { useEffect, useRef } from 'react'

type Props = {
  t: number
  setT: (t: number) => void
  playing: boolean
  setPlaying: (p: boolean) => void
  loopSeconds?: number
  label?: string
}

export default function TimeSlider({
  t,
  setT,
  playing,
  setPlaying,
  loopSeconds = 4,
  label = 't',
}: Props) {
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number>(0)
  const tRef = useRef<number>(t)

  useEffect(() => {
    tRef.current = t
  }, [t])

  useEffect(() => {
    if (!playing) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return
    }
    lastRef.current = performance.now()
    const step = (now: number) => {
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now
      let next = tRef.current + dt / loopSeconds
      if (next >= 1) {
        next = next - 1
      }
      tRef.current = next
      setT(next)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, loopSeconds, setT])

  return (
    <div className="flex items-center gap-3 mt-3 text-xs text-primary/70">
      <button
        type="button"
        onClick={() => setPlaying(!playing)}
        aria-label={playing ? 'Pause' : 'Play'}
        className="w-7 h-7 inline-flex items-center justify-center rounded-full border border-primary/20 hover:border-primary/50 transition-colors"
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
            <rect x="1.5" y="1" width="2.5" height="8" />
            <rect x="6" y="1" width="2.5" height="8" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
            <path d="M1.5 1 L9 5 L1.5 9 Z" />
          </svg>
        )}
      </button>
      <span className="font-mono w-8 select-none">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={t}
        onChange={(e) => {
          setPlaying(false)
          setT(parseFloat(e.target.value))
        }}
        className="flex-1 accent-primary"
      />
      <span className="font-mono tabular-nums w-10 text-right select-none">
        {t.toFixed(2)}
      </span>
    </div>
  )
}
