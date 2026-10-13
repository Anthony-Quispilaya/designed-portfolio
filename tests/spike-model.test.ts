import { describe, expect, it } from "vitest";

import { alignmentFor, chargeFor, gradeFor, handLocal, resolveSwing, SPIKE, speedFor, swingAngle, timingFor } from "@/lib/game/spike-model";

// Expected values follow scripts/spike_tuning.gd with data/spike.tres.
describe("spike contact model", () => {
  it("charges linearly to 100% over 0.55 s", () => {
    expect(chargeFor(0)).toBe(0);
    expect(chargeFor(0.275)).toBeCloseTo(0.5);
    expect(chargeFor(2)).toBe(1);
  });

  it("swings from cocked (3.8 rad) to follow-through (0.5 rad)", () => {
    expect(swingAngle(0)).toBeCloseTo(SPIKE.swingStartAngle);
    expect(swingAngle(SPIKE.swingTime)).toBeCloseTo(SPIKE.swingEndAngle);
  });

  it("puts the hand above and in front of the shoulder at the power zone", () => {
    const h = handLocal(SPIKE.idealAngle);
    expect(h.x).toBeGreaterThan(0);
    expect(h.y).toBeGreaterThan(SPIKE.shoulderHeight);
  });

  it("is forgiving: full alignment within 35 cm, floor at the 85 cm edge, nothing beyond", () => {
    expect(alignmentFor(0.2)).toBe(1);
    expect(alignmentFor(0.85)).toBeCloseTo(SPIKE.alignFloor);
    expect(alignmentFor(0.86)).toBe(0);
  });

  it("gives full timing near the ideal angle and the floor when very early or late", () => {
    expect(timingFor(SPIKE.idealAngle + 0.5)).toBe(1);
    expect(timingFor(SPIKE.idealAngle - 2)).toBeCloseTo(SPIKE.timingFloor);
  });

  it("grades by contact score with no perfect tier", () => {
    expect(gradeFor(0.9)).toBe("SOLID");
    expect(gradeFor(0.7)).toBe("OK");
    expect(gradeFor(0.5)).toBe("WEAK");
  });

  it("maps power to speed between 12 and 22.5 m/s", () => {
    expect(speedFor(0)).toBe(12);
    expect(speedFor(1)).toBe(22.5);
  });

  it("resolves a well-placed ball as SOLID and a far ball as a miss", () => {
    const ideal = handLocal(SPIKE.idealAngle);
    const hit = resolveSwing(ideal, 1);
    expect(hit.hit && hit.grade).toBe("SOLID");
    expect(resolveSwing({ x: 2, y: 2 }, 1).hit).toBe(false);
  });

  it("scales power by charge", () => {
    const ideal = handLocal(SPIKE.idealAngle);
    const half = resolveSwing(ideal, 0.5);
    expect(half.hit && half.power).toBeCloseTo(0.5, 2);
  });
});
