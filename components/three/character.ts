// The Backyard Volley player, rebuilt for the web from the game's own assets.
//
// Assembly mirrors scripts/avatar.gd:
//   - body_rig.glb: skinned body + uniform on a 19-bone rig, 20 pose clips
//   - head / ears / hair are rigid kit meshes riding on the Head bone, placed
//     at RIG_HEAD_CENTER with RIG_HEAD_SCALE, rotated to face the body's front
//   - the face is drawn by a shader from decal textures
//   - appearance = the saved "Ansoniq" profile from the game's profile.cfg
//
// Animation mirrors the game's approach: poses are one-frame Blender clips,
// blended per bone with slerp and eased toward their target every frame.
import {
  AnimationClip,
  Bone,
  BufferGeometry,
  CanvasTexture,
  Group,
  LinearInterpolant,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  Quaternion,
  QuaternionKeyframeTrack,
  QuaternionLinearInterpolant,
  ShaderMaterial,
  SkinnedMesh,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  Vector2,
  Vector3,
  type Texture,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

import { beachBallMaterial } from "./ball";
import { FACE_FILES, faceMaterial, outlineMaterial, prepareFaceTexture, toonMaterial, type FaceTextures } from "./toon";
import { withBase } from "@/lib/base-path";

// ---------------------------------------------------------------- appearance
// From profile.cfg → avatar.gd palettes (skin 4, hair_color 6, shirt 4, …).
const LOOK = {
  skin: "#c68d60",
  hair: "#161616",
  brow: "#0f0f0f", // hair colour darkened 30 %
  eye: "#141010",
  jersey: "#e2412f",
  jerseyTrim: "#f4f4f6",
  shorts: "#1c1c22",
  shortsTrim: "#f4f4f6",
  kneePad: "#18181e",
  sleeve: "#1c1c22",
  sock: "#f4f4f6",
  shoe: "#1c1c22",
  sole: "#121216",
  headband: "#f4f4f4",
};
const OL = 3.9; // outline px at 1080p
const RIG_HEAD_CENTER = 1.17;
const RIG_HEAD_SCALE = 0.62;
const TALL_HEAD = new Vector3(0.94, 1.07, 0.97);

export const POSES = [
  "ReceivingStance",
  "Lateral_ReadyStance",
  "LoadingJumpPose",
  "SpikeLoad",
  "SpikeFinish",
  "SettingPose",
  "Pose_Receive_Platform",
  "Pose_Block_MidAir",
] as const;

export type ActionName = "bump" | "set" | "spike" | "block" | "cheer";

/** Seconds into each action when the ball is touched. */
const CONTACT: Record<ActionName, number> = { spike: 0.74, set: 0.5, bump: 0.55, block: 0.62, cheer: Infinity };

type Pose = { rot: Map<Bone, Quaternion>; pos: Map<Bone, Vector3> };

const sanitize = (n: string) => n.replace(/[\[\]\.:\/]/g, "");
const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => t * t * (3 - 2 * t);

export type CharacterInput = {
  /** pointer relative to the character, roughly -1..1 each axis (x right, y up) */
  aim: Vector2;
  /** 0..1 how far the hero has scrolled out of view */
  scroll: number;
  reducedMotion: boolean;
};

export class Character {
  readonly root = new Group();
  readonly body = new Group();
  readonly ball = new Group();
  private bones = new Map<string, Bone>();
  private rest = new Map<Bone, Quaternion>();
  private restPos = new Map<Bone, Vector3>();
  private poses = new Map<string, Pose>();
  private loops = new Map<string, AnimationClip>();
  private current = new Map<Bone, Quaternion>();
  private currentPos = new Map<Bone, Vector3>();
  private face!: ShaderMaterial;
  private headMeshes: Object3D[] = [];
  private materials: Material[] = [];
  private geometries: BufferGeometry[] = [];
  private textures: Texture[] = [];

  // state
  private t = 0;
  private action: { name: ActionName; t: number } | null = null;
  private yaw = 0;
  private pitch = 0;
  private blinkT = 2.5;
  private blinkPhase = -1;
  private ballHome = new Vector3(0.5, 0.92, 0.32);
  private ballVel = new Vector3();
  private ballSpin = new Vector3(0.6, 1.4, 0);
  private ballReturnT = -1;
  onImpact?: (kind: ActionName, at: Vector3) => void;

  static async load(base = withBase("/models")): Promise<Character> {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const texLoader = new TextureLoader();
    const [gltf, faceTex] = await Promise.all([
      loader.loadAsync(`${base}/ansoniq.glb`),
      Promise.all(
        Object.entries(FACE_FILES).map(async ([k, file]) => [k, prepareFaceTexture(await texLoader.loadAsync(`${base}/face/${file}.png`))] as const),
      ).then((entries) => Object.fromEntries(entries) as FaceTextures),
    ]);
    const c = new Character();
    c.build(gltf.scene, gltf.animations, faceTex);
    c.buildBall();
    return c;
  }

  // ------------------------------------------------------------- assembly
  private track<T extends Material | BufferGeometry | Texture>(x: T): T {
    if ((x as Material).isMaterial) this.materials.push(x as Material);
    else if ((x as BufferGeometry).isBufferGeometry) this.geometries.push(x as BufferGeometry);
    else this.textures.push(x as Texture);
    return x;
  }

  private build(scene: Group, clips: AnimationClip[], faceTex: FaceTextures) {
    Object.values(faceTex).forEach((t) => this.track(t));
    this.root.add(this.body);
    this.body.add(scene);
    scene.updateMatrixWorld(true);

    scene.traverse((o) => {
      if ((o as Bone).isBone) {
        const b = o as Bone;
        this.bones.set(b.name, b);
        this.rest.set(b, b.quaternion.clone());
        this.restPos.set(b, b.position.clone());
        this.current.set(b, b.quaternion.clone());
        this.currentPos.set(b, b.position.clone());
      }
    });

    // --- skinned body + uniform
    const paint: Record<string, string[]> = {
      Arm: [LOOK.skin],
      Jersey: [LOOK.jersey, LOOK.jerseyTrim],
      apparel: [LOOK.shorts, LOOK.shortsTrim],
      KneePad: [LOOK.kneePad],
      Sleeve: [LOOK.sleeve],
      Sock: [LOOK.sock],
      Shoe: [LOOK.shoe, LOOK.sole],
    };
    const skinned: SkinnedMesh[] = [];
    scene.traverse((o) => {
      if ((o as SkinnedMesh).isSkinnedMesh) skinned.push(o as SkinnedMesh);
    });
    // Multi-primitive meshes arrive as a Group (named after the node) holding one
    // SkinnedMesh per primitive, in primitive order: [main fabric, trim / sole].
    const KINDS = ["Body", "Arm", "Jersey", "apparel", "KneePad", "Sleeve", "Sock", "Shoe"];
    for (const mesh of skinned) {
      const parent = mesh.parent!;
      const multi = parent.type === "Group" && parent.name !== "BodyRig";
      const name = multi ? parent.name : mesh.name;
      const kind = KINDS.find((k) => name.startsWith(k)) ?? "Body";
      const slot = multi ? parent.children.filter((c) => (c as SkinnedMesh).isSkinnedMesh && c.userData.outline !== true).indexOf(mesh) : 0;
      mesh.frustumCulled = false;
      let mat: ShaderMaterial;
      let outline: ShaderMaterial;
      if (kind === "Body") {
        // skin with the outfit-covered regions discarded (classic jersey covers all three)
        mat = toonMaterial(LOOK.skin, { hide: [1, 1, 1], vertexColors: true });
        outline = outlineMaterial(OL, { hide: [1, 1, 1], vertexColors: true });
      } else {
        const colors = paint[kind] ?? [LOOK.skin];
        mat = toonMaterial(colors[Math.min(slot, colors.length - 1)]);
        outline = outlineMaterial(OL, { depthPush: kind === "Arm" ? 0 : 0.02 });
      }
      mesh.material = this.track(mat);
      this.track(outline);
      const shell = new SkinnedMesh(mesh.geometry, outline);
      shell.bind(mesh.skeleton, mesh.bindMatrix);
      shell.frustumCulled = false;
      shell.userData.outline = true;
      mesh.parent!.add(shell);
      this.geometries.push(mesh.geometry);
    }

    // --- head kit on the Head bone (avatar.gd _setup_body_rig)
    const parts = scene.getObjectByName("HeadParts");
    const headBone = this.bones.get("Head")!;
    const head = new Group();
    head.name = "HeadAssembly";
    head.position.set(0, RIG_HEAD_CENTER, 0);
    head.rotation.y = Math.PI; // kit faces -Z (Godot forward); body faces +Z
    head.scale.copy(TALL_HEAD).multiplyScalar(RIG_HEAD_SCALE);
    // The web build quantizes vertices and stores the dequantization in each
    // node's transform, so the node matrix is part of the mesh's true shape.
    // GLTFLoader de-duplicates names ("Head" is also a bone → "Head_1").
    const piece = (n: string) => {
      const s = sanitize(n);
      return parts?.children.find((o) => o.name === s || o.name.startsWith(`${s}_`)) as Mesh | undefined;
    };

    this.face = this.track(faceMaterial(faceTex, { skin: LOOK.skin, brow: LOOK.brow, eye: LOOK.eye }));
    const addRigid = (src: Mesh | undefined, g: BufferGeometry | undefined, mat: Material, px: number, at?: Vector3, scale?: Vector3) => {
      if (!g) return;
      const place = new Matrix4().compose(at ?? new Vector3(), new Quaternion(), scale ?? new Vector3(1, 1, 1));
      if (src) place.multiply(src.matrix);
      const m = new Mesh(g, mat);
      const o = new Mesh(g, this.track(outlineMaterial(px)));
      for (const x of [m, o]) {
        x.matrixAutoUpdate = false;
        x.matrix.copy(place);
        head.add(x);
      }
      this.headMeshes.push(m);
    };
    const headSrc = piece("Head");
    const earSrc = piece("Ear");
    const hairSrc = piece("Hair.M3");
    if (headSrc) {
      // the face is drawn by direction from the head centre: undo the quantization offset
      (this.face.uniforms.posOffset.value as Vector3).copy(headSrc.position).divide(headSrc.scale);
    }
    addRigid(headSrc, headSrc?.geometry, this.face, 4.0);
    const skinMat = this.track(toonMaterial(LOOK.skin));
    for (const sx of [-1, 1]) addRigid(earSrc, earSrc?.geometry, skinMat, OL, new Vector3(sx * 0.41, -0.03, 0.02), new Vector3(1.3, 1, 1));
    addRigid(hairSrc, hairSrc?.geometry, this.track(toonMaterial(LOOK.hair)), OL);
    // headwear 3 = headband: TorusMesh(inner 0.36, outer 0.43) at y 0.16, scale y 1.3
    const band = this.track(new TorusGeometry(0.395, 0.035, 12, 48));
    band.rotateX(Math.PI / 2);
    addRigid(undefined, band, this.track(toonMaterial(LOOK.headband)), OL, new Vector3(0, 0.16, 0), new Vector3(1, 1.3, 1));
    parts?.removeFromParent();
    scene.add(head);
    scene.updateMatrixWorld(true);
    headBone.attach(head);

    this.addNumber(scene);

    // --- poses: one-frame clips sampled once; loops kept for timed sampling
    for (const clip of clips) {
      const pose: Pose = { rot: new Map(), pos: new Map() };
      for (const tr of clip.tracks) {
        const dot = tr.name.lastIndexOf(".");
        const bone = this.bones.get(tr.name.slice(0, dot));
        if (!bone) continue;
        const prop = tr.name.slice(dot + 1);
        if (prop === "quaternion") pose.rot.set(bone, new Quaternion().fromArray(tr.values, 0));
        else if (prop === "position") pose.pos.set(bone, new Vector3().fromArray(tr.values, 0));
      }
      this.poses.set(clip.name, pose);
      if (clip.duration > 0.1) this.loops.set(clip.name, clip);
    }
  }

  /** Jersey number on the Chest bone, front and back (avatar.gd Label3D). */
  private addNumber(scene: Group) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 192;
    const g = canvas.getContext("2d")!;
    g.font = "900 150px 'Arial Black', Impact, Arial, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.lineJoin = "round";
    g.lineWidth = 18;
    g.strokeStyle = "#7c2116";
    g.strokeText("10", 128, 100);
    g.fillStyle = "#ffffff";
    g.fillText("10", 128, 100);
    const tex = this.track(new CanvasTexture(canvas));
    tex.colorSpace = "srgb";
    const mat = this.track(new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }));
    const geo = this.track(new PlaneGeometry(0.19, 0.143));
    const chest = this.bones.get("Chest")!;
    for (const side of [1, -1]) {
      const plate = new Mesh(geo, mat);
      plate.position.set(0, 0.745, side * 0.116);
      if (side < 0) plate.rotation.y = Math.PI;
      scene.add(plate);
      scene.updateMatrixWorld(true);
      chest.attach(plate);
    }
  }

  private buildBall() {
    // A classic beach ball, drawn by a shader — flat like the game draws balls, with the ink outline.
    const g = this.track(new SphereGeometry(0.17, 48, 32));
    const ball = new Mesh(g, this.track(beachBallMaterial()));
    const outline = new Mesh(g, this.track(outlineMaterial(OL)));
    this.ball.add(ball, outline);
    this.ball.position.copy(this.ballHome);
    this.root.add(this.ball);
    this.headMeshes.push(ball);
  }

  /** Meshes the pointer can hit: [head, ear…, hair, band, ball]. */
  get pickables() {
    return this.headMeshes;
  }
  get isBusy() {
    return this.action !== null;
  }

  // ------------------------------------------------------------- posing
  private poseOf(name: string, u = 0): Pose | undefined {
    const loop = this.loops.get(name);
    if (!loop) return this.poses.get(name);
    const pose: Pose = { rot: new Map(), pos: new Map() };
    const t = (((u % 1) + 1) % 1) * loop.duration;
    for (const tr of loop.tracks) {
      const dot = tr.name.lastIndexOf(".");
      const bone = this.bones.get(tr.name.slice(0, dot));
      if (!bone) continue;
      const size = tr.getValueSize();
      const v = (tr instanceof QuaternionKeyframeTrack
        ? new QuaternionLinearInterpolant(tr.times, tr.values, size, new Float32Array(size))
        : new LinearInterpolant(tr.times, tr.values, size, new Float32Array(size))
      ).evaluate(t);
      const prop = tr.name.slice(dot + 1);
      if (prop === "quaternion") pose.rot.set(bone, new Quaternion().fromArray(v).normalize());
      else if (prop === "position") pose.pos.set(bone, new Vector3().fromArray(v));
    }
    return pose;
  }

  /** Weighted blend, same incremental slerp as avatar.gd _blend_poses. */
  blend(parts: [string, number, number?][]) {
    const rot = new Map<Bone, Quaternion>();
    const pos = new Map<Bone, Vector3>();
    let acc = 0;
    for (const [name, w, u] of parts) {
      const pose = this.poseOf(name, u ?? 0);
      if (!pose || w <= 0) continue;
      const k = w / (acc + w);
      pose.rot.forEach((q, b) => {
        const cur = rot.get(b);
        rot.set(b, cur ? cur.slerp(q, k) : q.clone());
      });
      pose.pos.forEach((p, b) => {
        const cur = pos.get(b);
        pos.set(b, cur ? cur.lerp(p, k) : p.clone());
      });
      acc += w;
    }
    return { rot, pos };
  }

  /** Ease the live skeleton toward a target pose (game: SMOOTH_RATE). */
  private drive(target: { rot: Map<Bone, Quaternion>; pos: Map<Bone, Vector3> }, dt: number, rate: number) {
    const k = damp(rate, dt);
    this.current.forEach((q, b) => {
      q.slerp(target.rot.get(b) ?? this.rest.get(b)!, k);
      b.quaternion.copy(q);
    });
    this.currentPos.forEach((p, b) => {
      p.lerp(target.pos.get(b) ?? this.restPos.get(b)!, k);
      b.position.copy(p);
    });
  }

  /** Jump straight to a target pose (pose lab, reduced motion). */
  snap(target: { rot: Map<Bone, Quaternion>; pos: Map<Bone, Vector3> }) {
    this.drive(target, 1, 1e6);
  }

  private rotateWorld(bone: Bone | undefined, axis: Vector3, angle: number) {
    if (!bone || !bone.parent || angle === 0) return;
    bone.parent.updateWorldMatrix(true, false);
    const pq = bone.parent.getWorldQuaternion(new Quaternion());
    const d = new Quaternion().setFromAxisAngle(axis, angle);
    const x = pq.clone().invert().multiply(d).multiply(pq);
    bone.quaternion.premultiply(x);
    bone.updateMatrixWorld(true);
  }

  // ------------------------------------------------------------- actions
  play(name: ActionName) {
    if (this.action) return false;
    this.action = { name, t: 0 };
    this.ballReturnT = -1;
    return true;
  }

  private hand(side: "L" | "R") {
    const fore = this.bones.get(`Forearm${side}`)!;
    fore.updateWorldMatrix(true, false);
    return this.root.worldToLocal(fore.localToWorld(new Vector3(0, 0.19, 0)));
  }

  /** The hitting hand is whichever one the pose raises highest. */
  private highHand() {
    const l = this.hand("L");
    const r = this.hand("R");
    return l.y > r.y ? l : r;
  }

  /** Per-action choreography → target pose, root offset, face, ball. */
  private choreograph(dt: number) {
    const a = this.action!;
    a.t += dt;
    const t = a.t;
    let parts: [string, number, number?][] = [["ReceivingStance", 1]];
    let rootY = 0;
    let mouth = 0;
    let expr = 0;
    let rate = 16;
    let done = false;
    const ball = this.ball.position;

    const jump = (start: number, dur: number, h: number) =>
      t > start && t < start + dur ? Math.sin(((t - start) / dur) * Math.PI) * h : 0;

    switch (a.name) {
      case "spike": {
        const contact = CONTACT.spike;
        if (t < 0.32) {
          parts = [["LoadingJumpPose", 1]];
          expr = 1;
        } else if (t < 0.69) {
          parts = [["SpikeLoad", 1]];
          mouth = 1;
          rate = 22;
        } else if (t < 1.25) {
          parts = [["SpikeFinish", 1]];
          mouth = 1;
          rate = 30;
        } else if (t < 1.45) parts = [["LoadingJumpPose", 0.7], ["ReceivingStance", 0.3]];
        rootY = jump(0.32, 0.95, 0.38);
        if (t < contact) {
          // toss: rise from home, fall into the hitting hand at contact
          const u = clamp(t / contact, 0, 1);
          const hit = this.highHand().add(new Vector3(0, 0.1, 0.12));
          const apex = new Vector3((this.ballHome.x + hit.x) / 2, hit.y + 0.9, 0.62);
          ball.copy(this.ballHome).multiplyScalar((1 - u) * (1 - u)).addScaledVector(apex, 2 * u * (1 - u)).addScaledVector(hit, u * u);
        } else if (t - dt < contact) {
          this.ballVel.set(1.7, -3.4, 5.6);
          this.onImpact?.("spike", ball.clone());
        }
        done = t > 1.7;
        break;
      }
      case "set": {
        const contact = CONTACT.set;
        parts = t < 0.95 ? [["SettingPose", 1]] : [["ReceivingStance", 1]];
        mouth = t < 0.95 ? 4 : 0;
        rootY = jump(0.42, 0.42, 0.08);
        if (t < contact) {
          const u = ease(clamp(t / contact, 0, 1));
          const above = this.hand("L").add(this.hand("R")).multiplyScalar(0.5).add(new Vector3(0, 0.16, 0.05));
          ball.lerpVectors(this.ballHome, above, u);
        } else if (t - dt < contact) {
          this.ballVel.set(-1.1, 5.4, 0.2);
          this.onImpact?.("set", ball.clone());
        }
        done = t > 1.45;
        break;
      }
      case "bump": {
        const contact = CONTACT.bump;
        parts = t < 1.1 ? [["Pose_Receive_Platform", 1]] : [["ReceivingStance", 1]];
        expr = t < 1.1 ? 1 : 0;
        rootY = -Math.sin(clamp(t / 1.1, 0, 1) * Math.PI) * 0.03;
        if (t < contact) {
          const u = clamp(t / contact, 0, 1);
          const plat = this.hand("L").add(this.hand("R")).multiplyScalar(0.5).add(new Vector3(0, 0.08, 0.04));
          const up = new Vector3(plat.x + 0.25, plat.y + 0.85, plat.z + 0.75);
          ball.copy(this.ballHome).multiplyScalar((1 - u) * (1 - u)).addScaledVector(up, 2 * u * (1 - u)).addScaledVector(plat, u * u);
        } else if (t - dt < contact) {
          this.ballVel.set(-0.2, 4.6, 0.4);
          this.onImpact?.("bump", ball.clone());
        }
        done = t > 1.5;
        break;
      }
      case "block": {
        const contact = CONTACT.block;
        if (t < 0.28) {
          parts = [["LoadingJumpPose", 1]];
          expr = 1;
        } else if (t < 1.15) {
          parts = [["Pose_Block_MidAir", 1]];
          mouth = 2;
          rate = 20;
        } else if (t < 1.35) parts = [["LoadingJumpPose", 0.6], ["ReceivingStance", 0.4]];
        rootY = jump(0.28, 0.9, 0.34);
        const wall = this.hand("L").add(this.hand("R")).multiplyScalar(0.5).add(new Vector3(0, 0.05, 0.22));
        if (t < contact) {
          const u = clamp(t / contact, 0, 1);
          const from = new Vector3(wall.x + 0.6, wall.y + 0.5, 2.4);
          ball.lerpVectors(from, wall, u * u);
        } else if (t - dt < contact) {
          this.ballVel.set(0.4, -2.6, 3.8);
          this.onImpact?.("block", ball.clone());
        }
        done = t > 1.6;
        break;
      }
      case "cheer": {
        parts = t < 1.0 ? [["Pose_Block_MidAir", 1]] : [["ReceivingStance", 1]];
        expr = 2;
        rootY = jump(0.05, 0.5, 0.22) + jump(0.55, 0.45, 0.16);
        done = t > 1.4;
        break;
      }
    }

    // ball after contact: ballistic, then glide home once it's gone
    if (t > CONTACT[a.name]) {
      this.ballVel.y -= 9.8 * dt;
      ball.addScaledVector(this.ballVel, dt);
    }

    this.body.position.set(0, rootY, 0);
    this.face.uniforms.actionMouth.value = mouth;
    this.face.uniforms.expr.value = expr;
    if (done) {
      this.action = null;
      this.ballReturnT = 0;
      this.face.uniforms.actionMouth.value = 0;
      this.face.uniforms.expr.value = 0;
    }
    return { target: this.blend(parts), rate };
  }

  // ------------------------------------------------------------- frame
  /**
   * External pose driver (pose lab): returns blend parts for the current time.
   * While set, idle behaviour and the ball are suspended.
   */
  poseSource: ((t: number) => [string, number, number?][]) | null = null;
  poseRate = 10;

  update(dt: number, input: CharacterInput) {
    dt = Math.min(dt, 1 / 10);
    this.t += dt;
    let target;
    let rate = 9;
    this.ball.visible = !this.poseSource;
    if (this.poseSource) {
      target = this.blend(this.poseSource(this.t));
      rate = this.poseRate;
      this.body.position.lerp(new Vector3(), damp(10, dt));
    } else if (this.action) {
      const c = this.choreograph(dt);
      target = c.target;
      rate = c.rate;
    } else {
      // idle: the receiving stance, eased halfway to the ready stance, breathing
      const sway = input.reducedMotion ? 0 : Math.sin(this.t * 1.6) * 0.5 + 0.5;
      target = this.blend([
        ["ReceivingStance", 1],
        ["Lateral_ReadyStance", 0.35 + sway * 0.15],
      ]);
      this.body.position.lerp(new Vector3(0, input.reducedMotion ? 0 : Math.sin(this.t * 1.6) * 0.006, 0), damp(8, dt));
      this.body.rotation.z *= 1 - damp(8, dt);
      this.idleBall(dt, input.reducedMotion);
    }
    this.drive(target, dt, rate);

    // head & chest follow the pointer (layered on top, like _twist_targets)
    const lookDown = input.scroll * 0.25;
    const wantYaw = clamp(input.aim.x, -1, 1) * 0.62;
    const wantPitch = clamp(-input.aim.y, -1, 1) * 0.32 + lookDown;
    this.yaw += (wantYaw - this.yaw) * damp(6, dt);
    this.pitch += (wantPitch - this.pitch) * damp(6, dt);
    const busy = this.action && this.action.name !== "cheer" ? 0.35 : 1;
    const up = new Vector3(0, 1, 0);
    const right = new Vector3(1, 0, 0);
    this.body.updateMatrixWorld(true);
    this.rotateWorld(this.bones.get("Chest"), up, this.yaw * 0.22 * busy);
    this.rotateWorld(this.bones.get("Neck"), up, this.yaw * 0.33 * busy);
    this.rotateWorld(this.bones.get("Neck"), right, this.pitch * 0.4 * busy);
    this.rotateWorld(this.bones.get("Head"), up, this.yaw * 0.45 * busy);
    this.rotateWorld(this.bones.get("Head"), right, this.pitch * 0.6 * busy);
    const bodyYaw = this.action ? 0 : this.yaw * 0.12;
    this.body.rotation.y += (bodyYaw - this.body.rotation.y) * damp(this.action ? 14 : 4, dt);

    // eyes (face-space look) and blinking (avatar.gd _update_face)
    const look = this.face.uniforms.look.value as Vector2;
    look.set(-clamp(input.aim.x, -1, 1) * 0.05, clamp(input.aim.y, -1, 1) * 0.035);
    if (!input.reducedMotion) {
      this.blinkT -= dt;
      if (this.blinkT <= 0) {
        this.blinkPhase = 0;
        this.blinkT = 2 + Math.random() * 3;
      }
    }
    let blink = 0;
    if (this.blinkPhase >= 0) {
      this.blinkPhase += dt / 0.14;
      blink = Math.sin(clamp(this.blinkPhase, 0, 1) * Math.PI);
      if (this.blinkPhase >= 1) this.blinkPhase = -1;
    }
    this.face.uniforms.blink.value = blink;

    // ball spin
    this.ball.rotation.x += this.ballSpin.x * dt * (this.action ? 6 : 1);
    this.ball.rotation.y += this.ballSpin.y * dt * (this.action ? 6 : 1);
  }

  private idleBall(dt: number, reduced: boolean) {
    const p = this.ball.position;
    if (this.ballReturnT >= 0) {
      // drop back in from above, landing softly at home
      this.ballReturnT += dt;
      const u = clamp(this.ballReturnT / 0.7, 0, 1);
      const from = new Vector3(this.ballHome.x, 2.6, this.ballHome.z);
      p.lerpVectors(from, this.ballHome, 1 - Math.pow(1 - u, 3));
      if (u >= 1) this.ballReturnT = -1;
      return;
    }
    const bob = reduced ? 0 : Math.sin(this.t * 2.1) * 0.025;
    p.lerp(new Vector3(this.ballHome.x, this.ballHome.y + bob, this.ballHome.z), damp(10, dt));
  }

  /** Is anything moving that needs a fresh frame? */
  get animating() {
    return this.action !== null || this.ballReturnT >= 0 || this.blinkPhase >= 0;
  }

  /** Expression for one-off reactions (easter egg). */
  express(expr: 0 | 1 | 2) {
    this.face.uniforms.expr.value = expr;
  }

  boneNames() {
    return [...this.bones.keys()];
  }

  dispose() {
    this.materials.forEach((m) => m.dispose());
    this.geometries.forEach((g) => g.dispose());
    this.textures.forEach((t) => t.dispose());
  }
}
