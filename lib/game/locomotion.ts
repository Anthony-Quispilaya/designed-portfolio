// Port of _locomotion_pose() weights from Backyard Volley's scripts/avatar.gd.
// moveAngleDeg is the direction of travel relative to where the player aims:
//   0 = straight ahead, ±90 = sideways, ±180 = backwards (+ = to the right).

export type LocoWeights = {
  forward: number;
  diagonal: number;
  lateral: number;
  back: number;
  right: boolean;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function wrapDeg(a: number) {
  return ((((a + 180) % 360) + 360) % 360) - 180;
}

export function locomotionWeights(moveAngleDeg: number): LocoWeights {
  const a = wrapDeg(moveAngleDeg);
  const aa = Math.abs(a);
  const lateral = aa <= 90 ? clamp01(1 - Math.abs(aa - 90) / 45) : clamp01(1 - (aa - 90) / 45);
  const diagonal = clamp01(1 - Math.abs(aa - 45) / 45);
  const forward = clamp01(1 - aa / 45);
  const back = clamp01((aa - 90) / 45);
  return { forward, diagonal, lateral, back, right: a > 0 };
}

/** Which Blender clip each weight drives (same names as body_rig.glb). */
export function locomotionClips(w: LocoWeights) {
  return [
    { clip: "Pose_Run", weight: w.forward },
    { clip: "Backpedal", weight: w.back },
    {
      clip: w.right ? "DiagonalRun_FacingLeft_TravelForwardRight" : "DiagonalRun_FacingRight_TravelForwardLeft",
      weight: w.diagonal,
    },
    { clip: w.right ? "Lateral_Shuffle_Right" : "Lateral_Shuffle_Left", weight: w.lateral, doubleTime: true },
  ].filter((p) => p.weight > 0.01);
}
