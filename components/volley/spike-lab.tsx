"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { cx } from "@/components/ui/primitives";
import {
  chargeFor,
  handLocal,
  resolveSwing,
  SPIKE,
  swingAngle,
  timingFor,
  alignmentFor,
  type ContactResult,
} from "@/lib/game/spike-model";

// Side view in metres. x: forward of the shoulder plane, y: height above the feet.
const VB = { x: -1.05, y: -0.15, w: 2.6, h: 2.2 };
const sx = (x: number) => x;
const sy = (y: number) => VB.y + VB.h - (y - VB.y) - 0.15; // flip y (svg grows down)
const SLOWMO = 4; // the real swing is 0.26 s; shown 4× slower

function arcPath(from: number, to: number, steps = 60) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const a = from + ((to - from) * i) / steps;
    const p = handLocal(a);
    d += `${i ? "L" : "M"}${sx(p.x).toFixed(4)} ${sy(p.y).toFixed(4)}`;
  }
  return d;
}

const pct = (v: number) => `${Math.round(v * 100)}%`;

export function SpikeLab() {
  const [ball, setBall] = useState({ x: 0.24, y: 1.27 });
  const [charge, setCharge] = useState(0);
  const [holding, setHolding] = useState(false);
  const [swingT, setSwingT] = useState<number | null>(null);
  const [result, setResult] = useState<ContactResult | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const holdStart = useRef(0);
  const raf = useRef(0);
  const dragging = useRef(false);

  const preview = useMemo(() => resolveSwing(ball, 1), [ball]);

  // charging while held
  useEffect(() => {
    if (!holding) return;
    const tick = () => {
      setCharge(chargeFor((performance.now() - holdStart.current) / 1000));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [holding]);

  const release = useCallback(() => {
    if (!holding) return;
    setHolding(false);
    const c = chargeFor((performance.now() - holdStart.current) / 1000);
    setCharge(c);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const res = resolveSwing(ball, c);
    if (reduce) {
      setSwingT(null);
      setResult(res);
      return;
    }
    const start = performance.now();
    setResult(null);
    const step = () => {
      const t = (performance.now() - start) / 1000 / SLOWMO;
      if (t >= SPIKE.swingTime) {
        setSwingT(null);
        setResult(res);
        return;
      }
      setSwingT(t);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [holding, ball]);

  const press = () => {
    if (holding || swingT !== null) return;
    holdStart.current = performance.now();
    setCharge(0);
    setResult(null);
    setHolding(true);
  };

  const toLocal = (e: PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    const x = VB.x + ((e.clientX - r.left) / r.width) * VB.w;
    const yy = VB.y + ((e.clientY - r.top) / r.height) * VB.h;
    return {
      x: Math.max(-0.8, Math.min(1.35, x)),
      y: Math.max(0.3, Math.min(1.9, sy(yy))),
    };
  };
  const onBallKey = (e: KeyboardEvent) => {
    const d = e.shiftKey ? 0.1 : 0.03;
    const m: Record<string, [number, number]> = {
      ArrowLeft: [-d, 0],
      ArrowRight: [d, 0],
      ArrowUp: [0, d],
      ArrowDown: [0, -d],
    };
    if (!m[e.key]) return;
    e.preventDefault();
    setResult(null);
    setBall((b) => ({
      x: Math.max(-0.8, Math.min(1.35, b.x + m[e.key][0])),
      y: Math.max(0.3, Math.min(1.9, b.y + m[e.key][1])),
    }));
  };

  const hand = handLocal(
    swingT !== null ? swingAngle(swingT) : SPIKE.swingStartAngle,
  );
  const ideal = handLocal(SPIKE.idealAngle);
  const hit = result?.hit ? handLocal(result.angle) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="relative rounded-sm border border-sand-2 bg-paper">
        <svg
          ref={svg}
          viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
          className="block h-auto w-full touch-none select-none"
          role="img"
          aria-label="Side view of the hitting arm's swing arc and the ball"
          onPointerMove={(e) => {
            if (dragging.current) setBall(toLocal(e));
          }}
          onPointerUp={() => (dragging.current = false)}
          onPointerLeave={() => (dragging.current = false)}
        >
          <defs>
            <pattern
              id="grid10"
              width="0.1"
              height="0.1"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0.1 0H0V0.1"
                fill="none"
                stroke="var(--color-sand)"
                strokeWidth="0.004"
              />
            </pattern>
          </defs>
          <rect
            x={VB.x}
            y={VB.y}
            width={VB.w}
            height={VB.h}
            fill="url(#grid10)"
          />
          {/* floor */}
          <line
            x1={VB.x}
            x2={VB.x + VB.w}
            y1={sy(0)}
            y2={sy(0)}
            stroke="var(--color-ink)"
            strokeWidth="0.008"
          />
          {/* contact zones around the ball */}
          <circle
            cx={ball.x}
            cy={sy(ball.y)}
            r={SPIKE.contactRange}
            fill="var(--color-brand)"
            fillOpacity="0.08"
            stroke="var(--color-brand-deep)"
            strokeWidth="0.006"
            strokeDasharray="0.03 0.03"
          />
          <circle
            cx={ball.x}
            cy={sy(ball.y)}
            r={SPIKE.fullAlignRadius}
            fill="var(--color-brand)"
            fillOpacity="0.16"
            stroke="var(--color-brand-deep)"
            strokeWidth="0.006"
          />
          {/* simplified player silhouette (the swing passes beside the head in 3D) */}
          <g
            fill="var(--color-sand-2)"
            stroke="var(--color-stone)"
            strokeWidth="0.008"
            opacity="0.7"
          >
            <path
              d={`M-0.06 ${sy(0.04)} L-0.03 ${sy(0.5)} L0.03 ${sy(0.5)} L0.06 ${sy(0.04)} Z`}
            />
            <rect x="-0.12" y={sy(0.88)} width="0.24" height="0.4" rx="0.06" />
            <circle cx="0.02" cy={sy(1.1)} r="0.19" />
          </g>
          {/* swing arc + timing window */}
          <path
            d={arcPath(SPIKE.swingStartAngle, SPIKE.swingEndAngle)}
            fill="none"
            stroke="var(--color-stone)"
            strokeWidth="0.01"
            strokeDasharray="0.02 0.02"
          />
          <path
            d={arcPath(
              SPIKE.idealAngle - SPIKE.timingFullTolerance,
              SPIKE.idealAngle + SPIKE.timingFullTolerance,
            )}
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="0.03"
            strokeLinecap="round"
          />
          <circle
            cx={ideal.x}
            cy={sy(ideal.y)}
            r="0.018"
            fill="var(--color-brand-deep)"
          />
          {/* ball */}
          <g
            tabIndex={0}
            role="button"
            aria-label={`Ball, ${Math.round(ball.x * 100)} centimetres forward and ${Math.round(ball.y * 100)} up. Drag, or use the arrow keys to move it.`}
            onKeyDown={onBallKey}
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as Element).setPointerCapture?.(e.pointerId);
              setResult(null);
            }}
            className="cursor-grab outline-none focus-visible:[&_.ball-outline]:stroke-brand-deep"
          >
            <VolleyballGlyph cx={ball.x} cy={sy(ball.y)} r={0.2} />
          </g>
          {/* arm + hand, drawn over the ball so contact is visible */}
          <line
            x1="0"
            y1={sy(SPIKE.shoulderHeight)}
            x2={hand.x}
            y2={sy(hand.y)}
            stroke="var(--color-ink)"
            strokeWidth="0.04"
            strokeLinecap="round"
            pointerEvents="none"
          />
          <circle
            cx={hand.x}
            cy={sy(hand.y)}
            r="0.065"
            fill="var(--color-brand)"
            stroke="var(--color-ink)"
            strokeWidth="0.018"
            pointerEvents="none"
          />
          {hit && (
            <circle
              cx={hit.x}
              cy={sy(hit.y)}
              r="0.13"
              fill="none"
              stroke="var(--color-brand-deep)"
              strokeWidth="0.022"
              pointerEvents="none"
            />
          )}
          {/* labels */}
          <text
            x={VB.x + 0.05}
            y={VB.y + 0.12}
            className="fill-stone"
            fontSize="0.065"
          >
            side view · 1 square = 10 cm
          </text>
        </svg>
        <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-sand-2 px-4 py-3 text-xs text-stone">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1 w-4 rounded bg-brand" /> 100%
            timing window
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-full border border-brand-deep bg-brand/30" />{" "}
            full power ≤ 35 cm
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-full border border-dashed border-brand-deep" />{" "}
            still connects ≤ 85 cm
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-[0.9375rem] text-stone">
          Drag the ball (or focus it and use arrow keys). Then{" "}
          <strong className="text-ink">hold</strong> the button to charge and{" "}
          <strong className="text-ink">release</strong> to swing, using the same
          rules as the game.
        </p>
        <button
          type="button"
          onPointerDown={press}
          onPointerUp={release}
          onPointerLeave={release}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !e.repeat) {
              e.preventDefault();
              press();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") release();
          }}
          className={cx(
            "relative mt-5 min-h-14 overflow-hidden rounded-sm border-2 border-ink text-[0.9375rem] font-semibold transition-colors select-none",
            holding ? "bg-ink text-ivory" : "bg-ivory hover:bg-paper",
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 bg-brand/70"
            style={{
              width: `${charge * 100}%`,
              transition: holding ? "none" : "width 300ms",
            }}
          />
          <span className="relative">
            {holding
              ? `Charging… ${pct(charge)}`
              : swingT !== null
                ? "Swinging (4× slow-mo)"
                : "Hold to charge · release to swing"}
          </span>
        </button>

        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-sand-2 bg-sand-2 text-sm">
          <Readout
            label="Alignment"
            value={pct(
              result?.hit
                ? result.alignment
                : preview.hit
                  ? alignmentFor(preview.closest)
                  : 0,
            )}
            note={`hand passes ${Math.round((result?.closest ?? preview.closest) * 100)} cm from centre`}
          />
          <Readout
            label="Timing"
            value={pct(
              result?.hit
                ? result.timing
                : preview.hit
                  ? timingFor(preview.angle)
                  : 0,
            )}
            note={`arm angle ${(result?.angle ?? preview.angle).toFixed(2)} rad (ideal ${SPIKE.idealAngle})`}
          />
          <Readout
            label="Charge"
            value={pct(charge)}
            note="hold 0.55 s for 100%"
          />
          <Readout
            label="Contact"
            value={result?.hit ? pct(result.score) : "—"}
            note="alignment × timing"
          />
        </div>

        <div
          className="mt-5 min-h-[7.5rem] rounded-sm border border-ink p-4"
          aria-live="polite"
        >
          {result ? (
            result.hit ? (
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="label text-stone">Grade</p>
                  <p
                    className={cx(
                      "text-[2.5rem] leading-none font-semibold tracking-tight",
                      result.grade === "SOLID"
                        ? "text-good-deep"
                        : result.grade === "OK"
                          ? "text-ink"
                          : "text-brand-deep",
                    )}
                  >
                    {result.grade}
                  </p>
                  <p className="mt-2 text-sm text-stone">
                    power {result.power.toFixed(2)} = charge{" "}
                    {result.score && (result.power / result.score).toFixed(2)} ×
                    contact {result.score.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="label text-stone">Target speed</p>
                  <p className="text-2xl">{result.speed.toFixed(1)} m/s</p>
                  <p className="text-xs text-stone">before the aim solver</p>
                </div>
              </div>
            ) : (
              <p className="text-[0.9375rem]">
                <strong>Miss.</strong> The hand never came within{" "}
                {SPIKE.contactRange * 100} cm of the ball (closest:{" "}
                {Math.round(result.closest * 100)} cm). In the game, the arm
                would have whiffed.
              </p>
            )
          ) : (
            <p className="text-sm text-stone">
              Grades: <strong className="text-ink">SOLID</strong> ≥ 0.85
              contact, <strong className="text-ink">OK</strong> ≥ 0.65,
              otherwise <strong className="text-ink">WEAK</strong>. There’s no
              “perfect” tier: a good swing is a good spike.
            </p>
          )}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-stone">
          Ported from <code className="font-mono">spike_tuning.gd</code> with
          the shipped values from{" "}
          <code className="font-mono">data/spike.tres</code>. In the game the
          ball is moving and you choose when to release; here it holds still so
          you can see how position along the arc becomes timing.
        </p>
      </div>
    </div>
  );
}

function Readout({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="bg-paper p-3">
      <p className="label text-stone">{label}</p>
      <p className="mt-1 text-xl text-ink tabular-nums">{value}</p>
      <p className="mt-0.5 text-[0.72rem] text-stone">{note}</p>
    </div>
  );
}

// ------------------------------------------------------------------ ball
// The classic volleyball line drawing. Three main seams meet a little up and
// left of centre (to the upper-left rim, the right rim, and the bottom). Each
// of the three regions between them carries two more seams, parallel to one of
// its edges and running out to the rim. Coordinates are a unit circle, measured
// from the standard volleyball icon.
type Pt = [number, number];

const BALL_FILL = "#fafaf7";
const BALL_LINE = "#1c1c22";
const LINE_W = 0.075;

const J: Pt = [-0.08, -0.1]; // where the three main seams meet

/** Main seams as quadratic curves from J: control point and rim end. */
const SEAMS: { c: Pt; end: Pt; angle: number }[] = [
  { c: [-0.4, -0.59], end: [-0.77, -0.52], angle: -145.6 }, // upper left
  { c: [0.4, -0.02], end: [0.8, -0.49], angle: -31.5 }, //    right
  { c: [-0.445, 0.475], end: [-0.15, 0.99], angle: 98.8 }, // bottom
];

/** Region i lies between seam i and seam i+1; its inner seams copy seam i. */
const REGIONS = [
  { mid: -88.5, offsets: [0.3, 0.6] }, //  top
  { mid: 33.6, offsets: [0.33, 0.66] }, // right
  { mid: 156.6, offsets: [0.27, 0.54] }, // left
];

const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (deg: number, d: number): Pt => [
  Math.cos(rad(deg)) * d,
  Math.sin(rad(deg)) * d,
];
const fmt = (p: Pt) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`;

/** Points along a seam's parabola, extended past both ends so clipping trims it. */
function seamPath(
  s: (typeof SEAMS)[number],
  shift: Pt = [0, 0],
  from = 0,
  to = 1,
) {
  const pts: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = from + ((to - from) * i) / 48;
    const u = 1 - t;
    const x = u * u * J[0] + 2 * u * t * s.c[0] + t * t * s.end[0] + shift[0];
    const y = u * u * J[1] + 2 * u * t * s.c[1] + t * t * s.end[1] + shift[1];
    pts.push(fmt([x, y]));
  }
  return `M${pts.join(" L")}`;
}

/** Unit vector perpendicular to a seam's chord, pointing into its region. */
function into(s: (typeof SEAMS)[number]): Pt {
  const dx = s.end[0] - J[0];
  const dy = s.end[1] - J[1];
  const len = Math.hypot(dx, dy);
  return [-dy / len, dx / len];
}

function VolleyballGlyph({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <g transform={`translate(${cx} ${cy}) scale(${r})`}>
      <defs>
        <clipPath id={`${uid}-ball`}>
          <circle r="1" />
        </clipPath>
        {REGIONS.map((reg, i) => {
          const a = SEAMS[i];
          const b = SEAMS[(i + 1) % 3];
          const d =
            `M${fmt(J)} Q${fmt(a.c)} ${fmt(a.end)} L${fmt(polar(a.angle, 3))} L${fmt(polar(reg.mid, 3))} ` +
            `L${fmt(polar(b.angle, 3))} L${fmt(b.end)} Q${fmt(b.c)} ${fmt(J)} Z`;
          return (
            <clipPath key={i} id={`${uid}-r${i}`}>
              <path d={d} />
            </clipPath>
          );
        })}
      </defs>
      <circle r="1" fill={BALL_FILL} />
      <g
        clipPath={`url(#${uid}-ball)`}
        fill="none"
        stroke={BALL_LINE}
        strokeWidth={LINE_W}
        strokeLinecap="round"
      >
        {SEAMS.map((s, i) => (
          <path key={i} d={seamPath(s, [0, 0], 0, 1.6)} />
        ))}
        {REGIONS.map((reg, i) => {
          const n = into(SEAMS[i]);
          return (
            <g key={i} clipPath={`url(#${uid}-r${i})`}>
              {reg.offsets.map((o) => (
                <path
                  key={o}
                  d={seamPath(SEAMS[i], [n[0] * o, n[1] * o], -1.5, 1.8)}
                />
              ))}
            </g>
          );
        })}
      </g>
      <circle
        className="ball-outline"
        r="1"
        fill="none"
        stroke={BALL_LINE}
        strokeWidth={LINE_W * 1.25}
      />
    </g>
  );
}
