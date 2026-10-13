"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState, type MutableRefObject } from "react";
import { CanvasTexture, Vector2, type Mesh } from "three";

import { Character } from "./character";
import { outlineViewport } from "./toon";

export type PoseParts = [string, number, number?][];

type Props = {
  source: MutableRefObject<(t: number) => PoseParts>;
  active: boolean;
  onReady: () => void;
  onError: () => void;
};

export default function PoseLabScene({
  source,
  active,
  onReady,
  onError,
}: Props) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ fov: 24, near: 0.1, far: 30, position: [1.6, 1.15, 4.4] }}
      onCreated={({ camera }) => camera.lookAt(0, 0.82, 0)}
      aria-hidden="true"
    >
      <Lab source={source} onReady={onReady} onError={onError} />
    </Canvas>
  );
}

function floorTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 2, 64, 64, 64);
  grad.addColorStop(0, "rgba(23,25,30,0.28)");
  grad.addColorStop(1, "rgba(23,25,30,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

function Lab({ source, onReady, onError }: Omit<Props, "active">) {
  const { gl, size } = useThree();
  const [character, setCharacter] = useState<Character | null>(null);
  const tex = useMemo(() => floorTexture(), []);

  useEffect(() => {
    let alive = true;
    let made: Character | null = null;
    Character.load()
      .then((c) => {
        if (!alive) return c.dispose();
        made = c;
        c.poseSource = (t) => source.current(t);
        c.poseRate = 14;
        c.root.rotation.y = -0.38;
        c.root.traverse((o) => {
          if ((o as Mesh).isMesh) o.raycast = () => {};
        });
        setCharacter(c);
        onReady();
      })
      .catch(() => alive && onError());
    return () => {
      alive = false;
      made?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const v = new Vector2();
    gl.getDrawingBufferSize(v);
    outlineViewport.value.copy(v);
  }, [gl, size]);

  const still = useMemo(() => new Vector2(), []);
  useFrame((_, dt) => {
    if (!character) return;
    // shared outline uniform: re-assert this canvas's size each frame
    gl.getDrawingBufferSize(outlineViewport.value);
    character.update(dt, { aim: still, scroll: 0, reducedMotion: false });
  });

  return (
    <>
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0.002, 0]}
        scale={[1.2, 0.8, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} />
      </mesh>
      {character && <primitive object={character.root} />}
    </>
  );
}
