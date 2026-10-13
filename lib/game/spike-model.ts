// Port of Backyard Volley's spike contact model (scripts/spike_tuning.gd) with
// the shipped tuning values from data/spike.tres. Units: metres, seconds,
// radians. The arm angle sweeps from cocked-behind-the-head (3.8) over the
// top to a follow-through in front (0.5).
//
//   contact score = ALIGNMENT × TIMING     (both have floors — forgiving)
//   spike power   = charge × contact score

export const SPIKE = {
  minSpikeSpeed: 12.0,
  maxSpikeSpeed: 22.5,
  chargeDuration: 0.55,
  swingTime: 0.26,
  swingStartAngle: 3.8,
  swingEndAngle: 0.5,
  shoulderHeight: 0.885,
  armLengthDown: 0.36,
  armLengthUp: 0.385,
  fullAlignRadius: 0.35,
  contactRange: 0.85,
  alignFloor: 0.7,
  idealAngle: 2.75,
  timingFullTolerance: 0.7,
  timingEdge: 1.8,
  timingFloor: 0.75,
  solidScore: 0.85,
  okScore: 0.65,
} as const;

export type Grade = "SOLID" | "OK" | "WEAK";

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Godot's smoothstep(from, to, x). */
export function smoothstep(from: number, to: number, x: number) {
  const t = clamp((x - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
}

/** data/spike.tres uses a linear charge curve (0,0)→(1,1). */
export function chargeFor(holdSeconds: number) {
  return clamp(holdSeconds / SPIKE.chargeDuration, 0, 1);
}

/** Arm angle t seconds after releasing the swing (smooth whip through). */
export function swingAngle(t: number) {
  const k = clamp(t / SPIKE.swingTime, 0, 1);
  return lerp(SPIKE.swingStartAngle, SPIKE.swingEndAngle, k * k * (3 - 2 * k));
}

/**
 * Hitting hand in a side view of the player's own frame:
 * x = metres in front of the shoulder plane, y = metres above the feet.
 */
export function handLocal(angle: number) {
  const raise = smoothstep(1.5, 2.9, clamp(angle, 0, 3.6));
  const length = lerp(SPIKE.armLengthDown, SPIKE.armLengthUp, raise);
  return {
    x: length * Math.sin(angle),
    y: SPIKE.shoulderHeight - length * Math.cos(angle),
  };
}

export function alignmentFor(dist: number) {
  if (dist > SPIKE.contactRange) return 0;
  return lerp(1, SPIKE.alignFloor, smoothstep(SPIKE.fullAlignRadius, SPIKE.contactRange, dist));
}

export function timingFor(angle: number) {
  return lerp(
    1,
    SPIKE.timingFloor,
    smoothstep(SPIKE.timingFullTolerance, SPIKE.timingEdge, Math.abs(angle - SPIKE.idealAngle)),
  );
}

export function gradeFor(score: number): Grade {
  if (score >= SPIKE.solidScore) return "SOLID";
  if (score >= SPIKE.okScore) return "OK";
  return "WEAK";
}

export function speedFor(power: number) {
  return lerp(SPIKE.minSpikeSpeed, SPIKE.maxSpikeSpeed, clamp(power, 0, 1));
}

export type ContactResult =
  | { hit: false; closest: number; angle: number }
  | {
      hit: true;
      closest: number;
      angle: number;
      alignment: number;
      timing: number;
      score: number;
      grade: Grade;
      power: number;
      speed: number;
    };

/**
 * Sweep the swing and find where the hand passes closest to a ball held
 * still at (bx, by). In the game the ball moves and you choose when to
 * release; holding it still makes the angle → timing relationship visible.
 */
export function resolveSwing(ball: { x: number; y: number }, charge: number, steps = 240): ContactResult {
  let best = Infinity;
  let bestAngle: number = SPIKE.swingStartAngle;
  for (let i = 0; i <= steps; i++) {
    const a = swingAngle((i / steps) * SPIKE.swingTime);
    const h = handLocal(a);
    const d = Math.hypot(h.x - ball.x, h.y - ball.y);
    if (d < best) {
      best = d;
      bestAngle = a;
    }
  }
  if (best > SPIKE.contactRange) return { hit: false, closest: best, angle: bestAngle };
  const alignment = alignmentFor(best);
  const timing = timingFor(bestAngle);
  const score = alignment * timing;
  const power = clamp(charge, 0, 1) * clamp(score, 0, 1);
  return {
    hit: true,
    closest: best,
    angle: bestAngle,
    alignment,
    timing,
    score,
    grade: gradeFor(score),
    power,
    speed: speedFor(power),
  };
}
