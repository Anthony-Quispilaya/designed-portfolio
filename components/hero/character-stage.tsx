"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ActionName } from "@/components/three/character";
import type { HeroSceneHandle } from "@/components/three/hero-scene";
import { withBase } from "@/lib/base-path";
import { cx } from "@/components/ui/primitives";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
});

const ACTIONS: {
  id: Exclude<ActionName, "cheer">;
  label: string;
  clips: string[];
}[] = [
  { id: "bump", label: "Bump", clips: ["Pose_Receive_Platform"] },
  { id: "set", label: "Set", clips: ["SettingPose"] },
  {
    id: "spike",
    label: "Spike",
    clips: ["LoadingJumpPose", "SpikeLoad", "SpikeFinish"],
  },
  {
    id: "block",
    label: "Block",
    clips: ["LoadingJumpPose", "Pose_Block_MidAir"],
  },
];

type Status = "waiting" | "loading" | "ready" | "fallback" | "saver";

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function CharacterStage() {
  const [status, setStatus] = useState<Status>("waiting");
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState<ActionName | null>(null);
  const [toast, setToast] = useState("");
  const wrap = useRef<HTMLDivElement>(null);
  const handle = useRef<HeroSceneHandle | null>(null);
  const visible = useRef(true);
  const scroll = useRef(0);
  const cycle = useRef(0);
  const taps = useRef<number[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Start loading only once the stage is on screen and the main thread is idle.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      if (!webglAvailable()) return setStatus("fallback");
      if (conn?.saveData) return setStatus("saver");
      const go = () => setStatus((s) => (s === "waiting" ? "loading" : s));
      const ric = (
        window as Window & {
          requestIdleCallback?: (
            cb: () => void,
            o?: { timeout: number },
          ) => number;
        }
      ).requestIdleCallback;
      if (ric) ric(go, { timeout: 1500 });
      else window.setTimeout(go, 400);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) start();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // How far the hero has scrolled away: the player glances down toward the work.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        scroll.current = Math.min(
          1,
          window.scrollY / Math.max(1, window.innerHeight * 0.8),
        );
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const play = useCallback(
    (a: ActionName) => handle.current?.play(a) ?? false,
    [],
  );

  const onBallClick = useCallback(() => {
    const a = ACTIONS[cycle.current % ACTIONS.length].id;
    if (play(a)) cycle.current++;
  }, [play]);

  // Easter egg: tap the player three times quickly.
  const onHeadClick = useCallback(() => {
    const now = performance.now();
    taps.current = [...taps.current.filter((t) => now - t < 1200), now];
    if (taps.current.length >= 3 && play("cheer")) {
      taps.current = [];
      setToast("Point, Ansoniq. 1–0");
      window.setTimeout(() => setToast(""), 2200);
    }
  }, [play]);

  const current = ACTIONS.find((a) => a.id === playing);
  const live = status === "ready";

  return (
    <figure className="relative m-0">
      <div
        ref={wrap}
        className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/6] lg:aspect-[4/5]"
      >
        {/* court-line frame */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full text-ink/15"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <line
            x1="0"
            y1="86"
            x2="100"
            y2="86"
            stroke="currentColor"
            strokeWidth="0.25"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="86"
            stroke="currentColor"
            strokeWidth="0.25"
            strokeDasharray="1 2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <Image
          src={withBase("/work/volley/ansoniq-poster.webp")}
          alt="Ansoniq, Anthony's Backyard Volley player: a stylized character with a white headband, red number 10 jersey, black shorts, knee pads and arm sleeves."
          fill
          priority
          sizes="(min-width: 1024px) 38vw, 90vw"
          className={cx(
            "object-contain object-bottom transition-opacity duration-700",
            live ? "opacity-0" : "opacity-100",
          )}
        />

        {(status === "loading" || status === "ready") && (
          <div
            className={cx(
              "absolute inset-0 transition-opacity duration-700",
              live ? "opacity-100" : "opacity-0",
            )}
          >
            <HeroScene
              handle={handle}
              visible={visible}
              scroll={scroll}
              reducedMotion={reduced}
              onReady={() => setStatus("ready")}
              onError={() => setStatus("fallback")}
              onBallClick={onBallClick}
              onHeadClick={onHeadClick}
              onAction={setPlaying}
            />
          </div>
        )}

        {status === "loading" && (
          <p className="label absolute top-3 left-3 text-stone" role="status">
            Loading the rig…
          </p>
        )}
        {status === "saver" && (
          <button
            type="button"
            onClick={() => setStatus("loading")}
            className="label absolute top-3 left-3 rounded-sm border border-ink/30 bg-ivory px-3 py-2 hover:border-ink"
          >
            Load the 3D player (~1.2 MB)
          </button>
        )}
        {toast && (
          <p
            className="label absolute top-3 right-3 rounded-sm bg-ink px-3 py-2 text-ivory"
            role="status"
          >
            {toast}
          </p>
        )}
      </div>

      <div
        className="mt-4 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Make the player hit the ball"
      >
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            disabled={!live}
            onClick={() => play(a.id)}
            aria-pressed={playing === a.id}
            className={cx(
              "min-h-10 rounded-sm border px-3.5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97]",
              "disabled:cursor-not-allowed disabled:opacity-40",
              playing === a.id
                ? "border-brand bg-brand text-ink"
                : "border-ink/20 bg-paper hover:border-brand-deep hover:text-brand-deep",
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      <figcaption className="mt-4 grid gap-1 text-sm text-stone">
        <span className="label text-ink">
          Fig. 01 · Ansoniq, my in-game player
        </span>
        <span>
          {status === "fallback"
            ? "A still of my Backyard Volley player. (Your browser can’t show the live 3D version.)"
            : "The game’s own Blender rig, pose clips, and face textures, running live. Click the ball or use the buttons."}
        </span>
        <span
          className="label min-h-[1.4em] text-brand-deep"
          aria-live="polite"
        >
          {current ? `Blender clips → ${current.clips.join(" → ")}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}
