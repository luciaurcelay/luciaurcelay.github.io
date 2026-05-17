import { useMemo, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { seedRng, gaussian2D, mixture2D } from './shared/random'
import { SOURCE_COLOR, TARGET_COLOR, FAINT } from './shared/colors'
import TimeSlider from './shared/TimeSlider'
import Frame from './shared/Frame'

const W = 640
const H = 380
const PAD = 24

const X_DOMAIN: [number, number] = [-3.2, 3.2]
const Y_DOMAIN: [number, number] = [-2.4, 2.4]

const MODES: ReadonlyArray<readonly [number, number]> = [
  [-1.7, 0.5],
  [1.5, 1.4],
  [0.6, -1.6],
]
const TARGET_SIGMA = 0.32
const SOURCE_SIGMA = 0.78
const N_POINTS = 260

type Pair = { x0: [number, number]; x1: [number, number] }

function easeT(t: number): number {
  return t
}

export default function DistributionMorph() {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)

  const pairs = useMemo<Pair[]>(() => {
    const rng = seedRng(7)
    const out: Pair[] = []
    for (let i = 0; i < N_POINTS; i++) {
      out.push({
        x0: gaussian2D(rng, SOURCE_SIGMA),
        x1: mixture2D(rng, MODES, TARGET_SIGMA),
      })
    }
    return out
  }, [])

  const xScale = scaleLinear().domain(X_DOMAIN).range([PAD, W - PAD])
  const yScale = scaleLinear().domain(Y_DOMAIN).range([H - PAD, PAD])

  const u = easeT(t)

  // Color interpolation per particle from source to target color.
  const blend = (a: string, b: string, f: number) => {
    const pa = parseRgb(a)
    const pb = parseRgb(b)
    const r = Math.round(pa[0] + (pb[0] - pa[0]) * f)
    const g = Math.round(pa[1] + (pb[1] - pa[1]) * f)
    const bl = Math.round(pa[2] + (pb[2] - pa[2]) * f)
    return `rgb(${r},${g},${bl})`
  }

  const particleColor = blend(SOURCE_COLOR, TARGET_COLOR, u)

  return (
    <Frame
      caption="Each particle is one realization of the OT-style interpolation xₜ = (1−t)·x₀ + t·x₁, with (x₀, x₁) independently sampled from a standard Gaussian source and a 3-mode target mixture. Aggregated, the cloud at time t samples the marginal pₜ — the density of all particles in flight."
      controls={
        <TimeSlider t={t} setT={setT} playing={playing} setPlaying={setPlaying} />
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Distribution morph animation"
      >
        <rect x={0} y={0} width={W} height={H} fill="white" rx={2} />

        {/* axes (very subtle) */}
        <line
          x1={xScale(0)}
          x2={xScale(0)}
          y1={PAD}
          y2={H - PAD}
          stroke={FAINT}
          strokeWidth={0.5}
        />
        <line
          x1={PAD}
          x2={W - PAD}
          y1={yScale(0)}
          y2={yScale(0)}
          stroke={FAINT}
          strokeWidth={0.5}
        />

        {/* ghost markers for source and target positions */}
        {pairs.map((p, i) => (
          <circle
            key={`g0-${i}`}
            cx={xScale(p.x0[0])}
            cy={yScale(p.x0[1])}
            r={1.3}
            fill={SOURCE_COLOR}
            opacity={0.08}
          />
        ))}
        {pairs.map((p, i) => (
          <circle
            key={`g1-${i}`}
            cx={xScale(p.x1[0])}
            cy={yScale(p.x1[1])}
            r={1.3}
            fill={TARGET_COLOR}
            opacity={0.08}
          />
        ))}

        {/* live particles */}
        {pairs.map((p, i) => {
          const x = (1 - u) * p.x0[0] + u * p.x1[0]
          const y = (1 - u) * p.x0[1] + u * p.x1[1]
          return (
            <circle
              key={i}
              cx={xScale(x)}
              cy={yScale(y)}
              r={2.4}
              fill={particleColor}
              opacity={0.85}
            />
          )
        })}

        {/* labels */}
        <g fontFamily="ui-sans-serif, system-ui" fontSize="11" fill="#666">
          <text x={PAD + 4} y={PAD + 12} opacity={1 - Math.min(1, u * 1.3)}>
            p₀ = N(0, I)
          </text>
          <text x={W - PAD - 4} y={PAD + 12} textAnchor="end" opacity={Math.max(0, u * 1.3 - 0.3)}>
            p₁ (target)
          </text>
        </g>
      </svg>
    </Frame>
  )
}

function parseRgb(c: string): [number, number, number] {
  if (c.startsWith('#')) {
    const h = c.slice(1)
    const v = parseInt(h, 16)
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
  }
  const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])]
  return [0, 0, 0]
}
