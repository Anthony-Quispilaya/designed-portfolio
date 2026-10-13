import { describe, expect, it } from "vitest";

import { locomotionClips, locomotionWeights } from "@/lib/game/locomotion";

describe("locomotion weights (avatar.gd _locomotion_pose)", () => {
  it("is all run when moving straight at the aim", () => {
    expect(locomotionWeights(0)).toMatchObject({
      forward: 1,
      diagonal: 0,
      lateral: 0,
      back: 0,
    });
  });
  it("is all shuffle sideways and all backpedal backwards", () => {
    expect(locomotionWeights(90).lateral).toBe(1);
    expect(locomotionWeights(-180).back).toBe(1);
  });
  it("blends neighbours between directions", () => {
    const w = locomotionWeights(22.5);
    expect(w.forward).toBeCloseTo(0.5);
    expect(w.diagonal).toBeCloseTo(0.5);
  });
  it("uses the right-hand clips for positive angles", () => {
    const clips = locomotionClips(locomotionWeights(90)).map((c) => c.clip);
    expect(clips).toContain("Lateral_Shuffle_Right");
  });
});
