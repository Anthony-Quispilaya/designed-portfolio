"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";

import type { PoseParts } from "@/components/three/pose-lab-scene";
import { cx } from "@/components/ui/primitives";
import { poseLibrary } from "@/content/backyard-volley";
import { withBase } from "@/lib/base-path";
import { locomotionClips, locomotionWeights } from "@/lib/game/locomotion";

const PoseLabScene = dynamic(
  () => import("@/components/three/pose-lab-scene"),
  { ssr: false },
);

type Mode = "blend" | "move";

export function PoseLab() {
  const [mode, setMode] = useState<Mode>("blend");
  const [a, setA] = useState<string>("LoadingJumpPose");
  const [b, setB] = useState<string>("SpikeLoad");
  const [t, setT] = useState(0.5);
  const [angle, setAngle] = useState(0);
  const [load, setLoad] = useState<"idle" | "loading" | "ready" | "failed">(
    "idle",
  );
  const [onScreen, setOnScreen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const dial = useRef<SVGSVGElement>(null);
  const source = useRef<(time: number) => PoseParts>(() => [
    ["ReceivingStance", 1],
  ]);
  const ids = { a: useId(), b: useId(), t: useId() };

  // Keep the scene's pose source in sync with the controls.
  useEffect(() => {
    if (mode === "blend") {
      source.current = () => [
        [a, 1 - t],
        [b, t],
      ];
    } else {
      const w = locomotionWeights(angle);
      const clips = locomotionClips(w);
      source.current = (time) => {
        const u = time * 1.35;
        return clips.length
          ? clips.map(
              (c) =>
                [c.clip, c.weight, c.doubleTime ? u * 2 : u] as [
                  string,
                  number,
                  number,
                ],
            )
          : [["Lateral_ReadyStance", 1]];
      };
    }
  }, [mode, a, b, t, angle]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setOnScreen(e.isIntersecting);
        if (e.isIntersecting) setLoad((s) => (s === "idle" ? "loading" : s));
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animateBlend = () => {
    const start = performance.now();
    const step = () => {
      const u = Math.min(1, (performance.now() - start) / 700);
      setT(u);
      if (u < 1) requestAnimationFrame(step);
    };
    setT(0);
    requestAnimationFrame(step);
  };

  const onDial = (e: PointerEvent) => {
    if (e.buttons !== 1 && e.type !== "pointerdown") return;
    const r = dial.current!.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    // up = forward (0°), right = +90
    setAngle(Math.round((Math.atan2(dx, -dy) * 180) / Math.PI));
  };

  const w = locomotionWeights(angle);
  const rad = (angle * Math.PI) / 180;
  const label = (clip: string) =>
    poseLibrary.find((p) => p.clip === clip)?.label ?? clip;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div
        ref={wrap}
        className="relative aspect-[5/6] overflow-hidden rounded-sm border border-sand-2 bg-paper"
      >
        {load !== "failed" && load !== "idle" && (
          <div
            className={cx(
              "absolute inset-0 transition-opacity duration-500",
              load === "ready" ? "opacity-100" : "opacity-0",
            )}
          >
            <PoseLabScene
              source={source}
              active={onScreen && load === "ready"}
              onReady={() => setLoad("ready")}
              onError={() => setLoad("failed")}
            />
          </div>
        )}
        {load !== "ready" && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-stone">
            {load === "failed"
              ? "3D preview unavailable. The in-game captures below show the same poses."
              : "Loading the rig…"}
          </div>
        )}
        <p className="label absolute top-3 left-3 text-stone">
          Fig. 02 · live pose blend
        </p>
        <p className="label absolute right-3 bottom-3 text-stone">
          19 bones · 20 clips
        </p>
      </div>

      <div>
        <div
          role="tablist"
          aria-label="Pose lab mode"
          className="inline-grid grid-cols-2 rounded-sm border border-sand-2 bg-paper p-1"
        >
          {(
            [
              ["blend", "Blend two poses"],
              ["move", "Locomotion"],
            ] as const
          ).map(([m, l]) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              type="button"
              onClick={() => setMode(m)}
              className={cx(
                "min-h-10 rounded-[2px] px-4 text-sm transition-colors",
                mode === m ? "bg-ink text-ivory" : "text-stone hover:text-ink",
              )}
            >
              {l}
            </button>
          ))}
        </div>

        {mode === "blend" ? (
          <div className="mt-6 grid gap-5">
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  [ids.a, "Pose A", a, setA],
                  [ids.b, "Pose B", b, setB],
                ] as const
              ).map(([id, l, v, set]) => (
                <div key={id}>
                  <label htmlFor={id} className="label text-stone">
                    {l}
                  </label>
                  <select
                    id={id}
                    value={v}
                    onChange={(e) => set(e.target.value)}
                    className="mt-1.5 min-h-11 w-full rounded-sm border border-sand-2 bg-paper px-3 text-sm focus:border-ink"
                  >
                    {poseLibrary.map((p) => (
                      <option key={p.clip} value={p.clip}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor={ids.t} className="label text-stone">
                  Blend
                </label>
                <span className="text-sm tabular-nums">
                  {Math.round((1 - t) * 100)}% {label(a)} ·{" "}
                  {Math.round(t * 100)}% {label(b)}
                </span>
              </div>
              <input
                id={ids.t}
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={t}
                onChange={(e) => setT(Number(e.target.value))}
                className="range text-ink"
                style={{ ["--thumb" as string]: "var(--color-brand)" }}
              />
            </div>
            <button
              type="button"
              onClick={animateBlend}
              className="min-h-11 w-fit rounded-sm border border-ink px-4 text-sm font-medium hover:bg-ink hover:text-ivory"
            >
              Play A → B
            </button>
            <p className="text-sm leading-relaxed text-stone">
              Each bone’s rotation is slerped between the two clips, the same
              incremental blend the game uses in{" "}
              <code className="font-mono">_blend_poses()</code>. In play, the
              target pose is then eased toward every frame so changes never
              snap.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-[11rem_1fr] sm:items-center">
            <svg
              ref={dial}
              viewBox="-1.2 -1.2 2.4 2.4"
              className="w-44 touch-none select-none"
              role="slider"
              tabIndex={0}
              aria-label="Direction of travel relative to where the player aims"
              aria-valuemin={-180}
              aria-valuemax={180}
              aria-valuenow={angle}
              aria-valuetext={`${angle} degrees`}
              onPointerDown={(e) => {
                (e.target as Element).setPointerCapture?.(e.pointerId);
                onDial(e);
              }}
              onPointerMove={onDial}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp")
                  setAngle((v) => (v >= 180 ? -165 : v + 15));
                else if (e.key === "ArrowLeft" || e.key === "ArrowDown")
                  setAngle((v) => (v <= -180 ? 165 : v - 15));
                else return;
                e.preventDefault();
              }}
            >
              <circle
                r="1"
                fill="var(--color-paper)"
                stroke="var(--color-sand-2)"
                strokeWidth="0.02"
              />
              {[0, 45, 90, 135, 180, -135, -90, -45].map((d) => (
                <line
                  key={d}
                  x1={Math.sin((d * Math.PI) / 180) * 0.86}
                  y1={-Math.cos((d * Math.PI) / 180) * 0.86}
                  x2={Math.sin((d * Math.PI) / 180)}
                  y2={-Math.cos((d * Math.PI) / 180)}
                  stroke="var(--color-stone)"
                  strokeWidth="0.02"
                />
              ))}
              <text
                y="-0.62"
                textAnchor="middle"
                fontSize="0.15"
                className="fill-stone"
              >
                aim
              </text>
              <line
                x1="0"
                y1="0"
                x2={Math.sin(rad) * 0.8}
                y2={-Math.cos(rad) * 0.8}
                stroke="var(--color-brand-deep)"
                strokeWidth="0.06"
                strokeLinecap="round"
              />
              <circle
                cx={Math.sin(rad) * 0.8}
                cy={-Math.cos(rad) * 0.8}
                r="0.13"
                fill="var(--color-brand)"
                stroke="var(--color-ink)"
                strokeWidth="0.03"
                className="cursor-grab"
              />
              <circle r="0.06" fill="var(--color-ink)" />
            </svg>
            <div>
              <p className="text-sm">
                travel {angle > 0 ? "+" : ""}
                {angle}° from aim
              </p>
              <dl className="mt-3 grid gap-2">
                {(
                  [
                    ["Run", w.forward],
                    ["Diagonal run", w.diagonal],
                    ["Side shuffle", w.lateral],
                    ["Backpedal", w.back],
                  ] as const
                ).map(([n, v]) => (
                  <div
                    key={n}
                    className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-sm"
                  >
                    <dt className="text-stone">{n}</dt>
                    <dd
                      className="h-2 overflow-hidden rounded-full bg-sand"
                      aria-hidden="true"
                    >
                      <span
                        className="block h-full rounded-full bg-brand transition-[width] duration-150"
                        style={{ width: `${v * 100}%` }}
                      />
                    </dd>
                    <dd className="text-right tabular-nums">
                      {Math.round(v * 100)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-stone">
                Drag the dial (or use arrow keys). The weights come from the
                game’s <code className="font-mono">_locomotion_pose()</code>;
                neighbouring directions blend. Backwards is its own Blender
                clip, never the run reversed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const STRIP = [
  ["stance", "Ready"],
  ["jump-load", "Jump load"],
  ["spike", "Spike"],
  ["set", "Set"],
  ["bump", "Platform"],
  ["side-dive", "Side dive"],
] as const;

/** The same poses, captured from the running game. */
export function PoseStrip() {
  return (
    <figure className="m-0">
      <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-6 sm:px-0">
        {STRIP.map(([file, name]) => (
          <li key={file} className="w-[38%] shrink-0 snap-start sm:w-auto">
            <div className="overflow-hidden rounded-sm border border-sand-2 bg-[#bfe3a8]">
              <Image
                src={withBase(`/work/volley/pose-${file}.webp`)}
                alt={`In-game capture: ${name} pose`}
                width={300}
                height={420}
                sizes="(min-width: 640px) 16vw, 38vw"
                className="h-auto w-full"
              />
            </div>
            <p className="label mt-2 text-stone">{name}</p>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-sm text-stone">
        In-game captures from the menu’s pose preview (Godot Movie Maker mode).
      </figcaption>
    </figure>
  );
}
