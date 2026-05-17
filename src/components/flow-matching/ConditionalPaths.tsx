import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { seedRng, gaussian2D } from './shared/random'
import { FAINT } from './shared/colors'
import TimeSlider from './shared/TimeSlider'
import Frame from './shared/Frame'

const W = 640
const H = 380
const PAD = 24
const X_DOMAIN: [number, number] = [-3.2, 3.2]
const Y_DOMAIN: [number, number] = [-2, 2]

const TARGETS: Array<{ pos: [number, number]; color: string; label: string }> = [
  { pos: [-1.7, 1.0], color: '#7c79f4', label: 'x₁' },
  { pos: [1.7, 0.4], color: '#e08158', label: "x₁′" },
  { pos: [0.2, -1.4], color: '#4aa37a', label: "x₁″" },
]

const N_PER_TARGET = 18
const SOURCE_SIGMA = 0.85

type Trajectory = { x0: [number, number]; x1: [number, number]; color: string }

export default function ConditionalPaths() {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [showAll, setShowAll] = useState(true)
  const [active, setActive] = useState(0)

  const trajectories = useMemo<Trajectory[]>(() => {
    const rng = seedRng(11)
    const out: Trajectory[] = []
    for (const tg of TARGETS) {
      for (let i = 0; i < N_PER_TARGET; i++) {
        out.push({
          x0: gaussian2D(rng, SOURCE_SIGMA),
          x1: [tg.pos[0], tg.pos[1]],
          color: tg.color,
        })
      }
    }
    return out
  }, [])

  const xScale = scaleLinear().domain(X_DOMAIN).range([PAD, W - PAD])
  const yScale = scaleLinear().domain(Y_DOMAIN).range([H - PAD, PAD])

  return (
    <Frame
      caption="Many straight-line conditional paths xₜ = (1−t)·x₀ + t·x₁, grouped by destination. Each colored bundle is a sample of trajectories from one conditional path; the underlying density pₜ(·|x₁) is a 2D Gaussian whose mean slides toward x₁ and whose variance shrinks to zero. Flow matching trains a single velocity field to fit all of these at once."
      controls={
        <>
          <TimeSlider t={t} setT={setT} playing={playing} setPlaying={setPlaying} />
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-primary/70">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={`px-2 py-0.5 rounded-sm border ${
                showAll ? 'border-primary/60' : 'border-primary/15 hover:border-primary/40'
              }`}
            >
              all targets
            </button>
            {TARGETS.map((tg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setShowAll(false)
                  setActive(i)
                }}
                className={`px-2 py-0.5 rounded-sm border ${
                  !showAll && active === i
                    ? 'border-primary/60'
                    : 'border-primary/15 hover:border-primary/40'
                }`}
                style={{ color: tg.color }}
              >
                {tg.label}
              </button>
            ))}
          </div>
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Conditional paths">
        <rect x={0} y={0} width={W} height={H} fill="white" rx={2} />

        {/* axes */}
        <line x1={xScale(0)} x2={xScale(0)} y1={PAD} y2={H - PAD} stroke={FAINT} strokeWidth={0.5} />
        <line x1={PAD} x2={W - PAD} y1={yScale(0)} y2={yScale(0)} stroke={FAINT} strokeWidth={0.5} />

        {/* trajectory lines */}
        {trajectories.map((tr, i) => {
          const targetIdx = Math.floor(i / N_PER_TARGET)
          const visible = showAll || targetIdx === active
          if (!visible) return null
          return (
            <line
              key={`l-${i}`}
              x1={xScale(tr.x0[0])}
              y1={yScale(tr.x0[1])}
              x2={xScale(tr.x1[0])}
              y2={yScale(tr.x1[1])}
              stroke={tr.color}
              strokeWidth={0.6}
              opacity={0.22}
            />
          )
        })}

        {/* live particles */}
        {trajectories.map((tr, i) => {
          const targetIdx = Math.floor(i / N_PER_TARGET)
          const visible = showAll || targetIdx === active
          if (!visible) return null
          const x = (1 - t) * tr.x0[0] + t * tr.x1[0]
          const y = (1 - t) * tr.x0[1] + t * tr.x1[1]
          return (
            <circle
              key={`p-${i}`}
              cx={xScale(x)}
              cy={yScale(y)}
              r={2.3}
              fill={tr.color}
              opacity={0.88}
            />
          )
        })}

        {/* target markers */}
        {TARGETS.map((tg, i) => (
          <g key={i}>
            <circle cx={xScale(tg.pos[0])} cy={yScale(tg.pos[1])} r={6} fill="white" stroke={tg.color} strokeWidth={1.5} />
            <text
              x={xScale(tg.pos[0]) + 9}
              y={yScale(tg.pos[1]) + 4}
              fontFamily="ui-sans-serif, system-ui"
              fontSize="11"
              fill={tg.color}
              fontWeight={500}
            >
              {tg.label}
            </text>
          </g>
        ))}
      </svg>
    </Frame>
  )
}
