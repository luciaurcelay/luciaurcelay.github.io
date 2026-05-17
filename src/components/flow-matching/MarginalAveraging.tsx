import { useMemo, useRef, useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { seedRng, gaussian2D } from './shared/random'
import { FAINT } from './shared/colors'
import TimeSlider from './shared/TimeSlider'
import Frame from './shared/Frame'

const W = 640
const H = 380
const PAD = 24
const X_DOMAIN: [number, number] = [-3, 3]
const Y_DOMAIN: [number, number] = [-1.9, 1.9]

const TARGET_A: [number, number] = [-1.7, 0.5]
const TARGET_B: [number, number] = [1.7, 0.5]
const COLOR_A = '#7c79f4'
const COLOR_B = '#e08158'
const COLOR_MARG = '#1a1a1a'

const N_PER = 14
const SOURCE_SIGMA = 0.8

function vel(p: [number, number], target: [number, number], t: number): [number, number] {
  const oneMinusT = Math.max(1 - t, 1e-3)
  return [(target[0] - p[0]) / oneMinusT, (target[1] - p[1]) / oneMinusT]
}

function logResp(p: [number, number], target: [number, number], t: number): number {
  const oneMinusT = Math.max(1 - t, 1e-3)
  const var_xt = oneMinusT * oneMinusT + 0.04
  const dx = p[0] - t * target[0]
  const dy = p[1] - t * target[1]
  return -(dx * dx + dy * dy) / (2 * var_xt)
}

export default function MarginalAveraging() {
  const [t, setT] = useState(0.45)
  const [playing, setPlaying] = useState(false)
  const [probe, setProbe] = useState<[number, number]>([0, 0])
  const svgRef = useRef<SVGSVGElement | null>(null)
  const draggingRef = useRef(false)

  const xScale = scaleLinear().domain(X_DOMAIN).range([PAD, W - PAD])
  const yScale = scaleLinear().domain(Y_DOMAIN).range([H - PAD, PAD])

  const linesA = useMemo(() => {
    const rng = seedRng(31)
    return Array.from({ length: N_PER }, () => gaussian2D(rng, SOURCE_SIGMA))
  }, [])
  const linesB = useMemo(() => {
    const rng = seedRng(53)
    return Array.from({ length: N_PER }, () => gaussian2D(rng, SOURCE_SIGMA))
  }, [])

  const vA = vel(probe, TARGET_A, t)
  const vB = vel(probe, TARGET_B, t)
  const lA = logResp(probe, TARGET_A, t)
  const lB = logResp(probe, TARGET_B, t)
  const m = Math.max(lA, lB)
  const eA = Math.exp(lA - m)
  const eB = Math.exp(lB - m)
  const Z = eA + eB
  const wA = eA / Z
  const wB = eB / Z
  const vMarg: [number, number] = [wA * vA[0] + wB * vB[0], wA * vA[1] + wB * vB[1]]

  const onPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current || !svgRef.current) return
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const local = pt.matrixTransform(ctm.inverse())
    const x = xScale.invert(local.x)
    const y = yScale.invert(local.y)
    const cx = Math.max(X_DOMAIN[0] + 0.2, Math.min(X_DOMAIN[1] - 0.2, x))
    const cy = Math.max(Y_DOMAIN[0] + 0.2, Math.min(Y_DOMAIN[1] - 0.2, y))
    setProbe([cx, cy])
  }

  const arrow = (
    x0: number,
    y0: number,
    vx: number,
    vy: number,
    color: string,
    width = 1.6,
    scale = 0.18,
    opacity = 1,
  ) => {
    const px = xScale(x0)
    const py = yScale(y0)
    const ex = xScale(x0 + vx * scale)
    const ey = yScale(y0 + vy * scale)
    return (
      <line
        x1={px}
        y1={py}
        x2={ex}
        y2={ey}
        stroke={color}
        strokeWidth={width}
        markerEnd="url(#arrowhead-marginal)"
        opacity={opacity}
      />
    )
  }

  return (
    <Frame
      caption="Two intersecting conditional flows. At any probe xₜ in the overlap, the conditional velocity labels disagree — they point at different targets. The black arrow is the marginal field vₜ(xₜ) = E[(x₁ − xₜ)/(1−t) | xₜ], with weights given by the posterior p(x₁ | xₜ) under the OT-Gaussian path. Drag the probe to see the average tilt toward whichever target is more likely to have produced this xₜ. Shown with two targets for clarity; the same averaging extends to any number of components."
      controls={
        <>
          <TimeSlider t={t} setT={setT} playing={playing} setPlaying={setPlaying} />
          <div className="mt-2 text-xs text-primary/55 tabular-nums">
            xₜ = ({probe[0].toFixed(2)}, {probe[1].toFixed(2)}) · weights{' '}
            <span style={{ color: COLOR_A }}>{wA.toFixed(2)}</span> toward x₁ ·{' '}
            <span style={{ color: COLOR_B }}>{wB.toFixed(2)}</span> toward x₁′
          </div>
        </>
      }
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Marginal averaging"
        onPointerDown={(e) => {
          draggingRef.current = true
          onPointer(e)
        }}
        onPointerMove={onPointer}
        onPointerUp={() => (draggingRef.current = false)}
        onPointerLeave={() => (draggingRef.current = false)}
        style={{ touchAction: 'none', cursor: 'crosshair' }}
      >
        <defs>
          <marker
            id="arrowhead-marginal"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="context-stroke" />
          </marker>
        </defs>

        <rect x={0} y={0} width={W} height={H} fill="white" rx={2} />

        {/* axes */}
        <line x1={xScale(0)} x2={xScale(0)} y1={PAD} y2={H - PAD} stroke={FAINT} strokeWidth={0.5} />
        <line x1={PAD} x2={W - PAD} y1={yScale(0)} y2={yScale(0)} stroke={FAINT} strokeWidth={0.5} />

        {/* cone A: lines from source samples to target A */}
        {linesA.map((x0, i) => (
          <line
            key={`a-${i}`}
            x1={xScale(x0[0])}
            y1={yScale(x0[1])}
            x2={xScale(TARGET_A[0])}
            y2={yScale(TARGET_A[1])}
            stroke={COLOR_A}
            strokeWidth={0.55}
            opacity={0.22}
          />
        ))}
        {/* cone B */}
        {linesB.map((x0, i) => (
          <line
            key={`b-${i}`}
            x1={xScale(x0[0])}
            y1={yScale(x0[1])}
            x2={xScale(TARGET_B[0])}
            y2={yScale(TARGET_B[1])}
            stroke={COLOR_B}
            strokeWidth={0.55}
            opacity={0.22}
          />
        ))}

        {/* targets */}
        <circle cx={xScale(TARGET_A[0])} cy={yScale(TARGET_A[1])} r={6} fill="white" stroke={COLOR_A} strokeWidth={1.5} />
        <text x={xScale(TARGET_A[0]) - 14} y={yScale(TARGET_A[1]) - 8} fontFamily="ui-sans-serif" fontSize="11" fill={COLOR_A}>
          x₁
        </text>
        <circle cx={xScale(TARGET_B[0])} cy={yScale(TARGET_B[1])} r={6} fill="white" stroke={COLOR_B} strokeWidth={1.5} />
        <text x={xScale(TARGET_B[0]) + 9} y={yScale(TARGET_B[1]) - 8} fontFamily="ui-sans-serif" fontSize="11" fill={COLOR_B}>
          x₁′
        </text>

        {/* arrows at probe */}
        {arrow(probe[0], probe[1], vA[0], vA[1], COLOR_A, 1.4, 0.18, 0.55)}
        {arrow(probe[0], probe[1], vB[0], vB[1], COLOR_B, 1.4, 0.18, 0.55)}
        {arrow(probe[0], probe[1], vMarg[0], vMarg[1], COLOR_MARG, 2.2, 0.18, 1)}

        {/* probe */}
        <circle cx={xScale(probe[0])} cy={yScale(probe[1])} r={5.5} fill="white" stroke={COLOR_MARG} strokeWidth={1.5} />
        <text x={xScale(probe[0]) + 9} y={yScale(probe[1]) + 4} fontFamily="ui-sans-serif" fontSize="11" fill={COLOR_MARG}>
          xₜ
        </text>
      </svg>
    </Frame>
  )
}
