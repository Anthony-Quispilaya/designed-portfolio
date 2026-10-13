"use client";

import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import {
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  Vector2,
  Vector3,
  type Object3D,
} from "three";

import { Character, type ActionName } from "./character";
import { outlineViewport } from "./toon";

export type HeroSceneHandle = {
  play: (a: ActionName) => boolean;
  busy: () => boolean;
};

type Props = {
  handle: MutableRefObject<HeroSceneHandle | null>;
  visible: MutableRefObject<boolean>;
  scroll: MutableRefObject<number>;
  reducedMotion: boolean;
  onReady: () => void;
  onError: (e: unknown) => void;
  onBallClick: () => void;
  onHeadClick: () => void;
  onAction?: (a: ActionName | null) => void;
};

export default function HeroScene(props: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ fov: 26, near: 0.1, far: 30, position: [0, 1.04, 4.75] }}
      onCreated={({ camera }) => camera.lookAt(0, 0.9, 0)}
      style={{ touchAction: "pan-y" }}
      aria-hidden="true"
    >
      <Rig {...props} />
    </Canvas>
  );
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, "rgba(23,25,30,0.32)");
  grad.addColorStop(0.55, "rgba(23,25,30,0.12)");
  grad.addColorStop(1, "rgba(23,25,30,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

type Burst = { mesh: Mesh; t: number };

function Rig({
  handle,
  visible,
  scroll,
  reducedMotion,
  onReady,
  onError,
  onBallClick,
  onHeadClick,
  onAction,
}: Props) {
  const { invalidate, gl, size, camera, scene } = useThree();
  const [character, setCharacter] = useState<Character | null>(null);
  const aim = useRef(new Vector2());
  const lastInput = useRef(performance.now());
  const bursts = useRef<Burst[]>([]);
  const shadow = useRef<Mesh>(null);
  const shadowTex = useMemo(() => shadowTexture(), []);

  // load once
  useEffect(() => {
    let alive = true;
    let made: Character | null = null;
    Character.load()
      .then((c) => {
        if (!alive) return c.dispose();
        made = c;
        // Skinned raycasts are expensive; only the head kit and ball are clickable.
        c.root.traverse((o) => {
          if ((o as Mesh).isMesh && !c.pickables.includes(o))
            o.raycast = () => {};
        });
        setCharacter(c);
        handle.current = {
          play: (a) => {
            const ok = c.play(a);
            if (ok) {
              lastInput.current = performance.now();
              onAction?.(a);
            }
            return ok;
          },
          busy: () => c.isBusy,
        };
        requestAnimationFrame(() => onReady());
      })
      .catch((e) => alive && onError(e));
    return () => {
      alive = false;
      handle.current = null;
      made?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // impact bursts
  useEffect(() => {
    if (!character) return;
    character.onImpact = (kind, at) => {
      const mat = new MeshBasicMaterial({
        color: new Color("#ff4242"),
        transparent: true,
        side: DoubleSide,
        depthWrite: false,
      });
      const mesh = new Mesh(new RingGeometry(0.1, 0.16, 32), mat);
      mesh.position.copy(at);
      mesh.lookAt(camera.position);
      scene.add(mesh);
      bursts.current.push({ mesh, t: 0 });
    };
  }, [character, camera, scene]);

  // pointer anywhere on the page steers the gaze
  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const hx = r.left + r.width * 0.5;
      const hy = r.top + r.height * 0.3;
      aim.current.set(
        Math.max(
          -1,
          Math.min(1, (e.clientX - hx) / Math.max(320, r.width * 1.1)),
        ),
        Math.max(
          -1,
          Math.min(1, -(e.clientY - hy) / Math.max(320, r.height * 0.9)),
        ),
      );
      lastInput.current = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  // outlines are sized in pixels of the drawing buffer
  useEffect(() => {
    const v = new Vector2();
    gl.getDrawingBufferSize(v);
    outlineViewport.value.copy(v);
    invalidate();
  }, [gl, size, invalidate]);

  // frame pacing: full rate while something moves, ~24fps idle, nothing offscreen
  useEffect(() => {
    let raf = 0;
    let last = 0;
    let lastBusy = character?.isBusy ?? false;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible.current || document.hidden || !character) return;
      const busy = character.animating || bursts.current.length > 0;
      if (lastBusy && !character.isBusy) onAction?.(null);
      lastBusy = character.isBusy;
      const recent = now - lastInput.current < 2500;
      const interval =
        busy || recent ? 0 : reducedMotion ? Infinity : 1000 / 24;
      if (now - last >= interval) {
        last = now;
        invalidate();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [character, visible, reducedMotion, invalidate, onAction]);

  useFrame((_, dt) => {
    if (!character) return;
    // the outline uniform is shared with other canvases: re-assert this one's size
    gl.getDrawingBufferSize(outlineViewport.value);
    character.update(dt, {
      aim: aim.current,
      scroll: scroll.current,
      reducedMotion,
    });
    if (shadow.current) {
      const lift = Math.max(0, character.body.position.y);
      const s = 1 - Math.min(0.45, lift * 0.9);
      shadow.current.scale.set(0.95 * s, 0.42 * s, 1);
      shadow.current.position.x = character.body.position.x * 0.8;
    }
    bursts.current = bursts.current.filter((b) => {
      b.t += dt;
      const u = b.t / 0.35;
      b.mesh.scale.setScalar(1 + u * 3.2);
      (b.mesh.material as MeshBasicMaterial).opacity = Math.max(0, 1 - u);
      if (u >= 1) {
        scene.remove(b.mesh);
        b.mesh.geometry.dispose();
        (b.mesh.material as MeshBasicMaterial).dispose();
        return false;
      }
      return true;
    });
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!character) return;
    e.stopPropagation();
    let o: Object3D | null = e.object;
    while (o && o !== character.ball && o !== character.root) o = o.parent;
    if (o === character.ball) onBallClick();
    else onHeadClick();
  };

  return (
    <>
      <mesh
        ref={shadow}
        rotation-x={-Math.PI / 2}
        position={[0, 0.002, 0]}
        raycast={() => {}}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      {character && (
        <primitive
          object={character.root}
          onClick={onClick}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            gl.domElement.style.cursor = "pointer";
          }}
          onPointerOut={() => (gl.domElement.style.cursor = "")}
        />
      )}
      <CameraFrame />
    </>
  );
}

/** Keep the player framed on narrow (mobile) canvases. */
function CameraFrame() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const dist = aspect < 0.75 ? 5.3 : 4.75;
    camera.position.set(0, 1.04, dist);
    camera.lookAt(new Vector3(0, 0.92, 0));
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}
