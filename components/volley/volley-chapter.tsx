import Image from "next/image";

import { BehindTheBuild } from "@/components/case-study/behind-the-build";
import { Container, Label, reveal } from "@/components/ui/primitives";
import { AnnotatedShot } from "@/components/volley/annotated-shot";
import { PoseLab, PoseStrip } from "@/components/volley/pose-lab";
import { SpikeLab } from "@/components/volley/spike-lab";
import { withBase } from "@/lib/base-path";
import {
  stages,
  systems,
  volley,
  volleyOutcome,
} from "@/content/backyard-volley";

const IMG = withBase("/work/volley");
const shot = (name: string) => ({
  src: `${IMG}/${name}-1280.webp`,
  small: `${IMG}/${name}-640.webp`,
});

export function VolleyChapter() {
  return (
    <section
      id="backyard-volley"
      aria-labelledby="volley-title"
      data-nav-theme="light"
      className="relative overflow-hidden bg-ivory pt-20 pb-24 lg:pt-28 lg:pb-32"
    >
      {/* court lines: the chapter's own motif */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] w-full text-sand-2"
        preserveAspectRatio="none"
        viewBox="0 0 100 60"
      >
        <path
          d="M-5 58 L40 8 L140 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.15"
          vectorEffect="non-scaling-stroke"
          opacity="0.6"
        />
        <path
          d="M-5 70 L52 18 L140 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.15"
          vectorEffect="non-scaling-stroke"
          opacity="0.35"
        />
      </svg>

      <Container className="relative">
        <header className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex items-baseline gap-4" {...reveal()}>
              <span className="text-sm text-brand-deep">{volley.number}</span>
              <Label className="text-stone">
                Featured project · My own game
              </Label>
            </div>
            <h2 id="volley-title" className="mt-5 text-chapter font-semibold">
              <span className="sr-only">{volley.name}: </span>
              {volley.headline.map((l, i) => (
                <span
                  key={l}
                  className="block"
                  {...reveal(60 + i * 80, "mask")}
                >
                  {i === 2 ? (
                    <>
                      <span className="text-brand-deep">volleyball</span> game.
                    </>
                  ) : (
                    l
                  )}
                </span>
              ))}
            </h2>
            <p
              className="prose-measure mt-7 text-lede text-ink/80"
              {...reveal(220)}
            >
              <strong className="font-semibold text-ink">{volley.name}.</strong>{" "}
              {volley.intro}
            </p>
          </div>
          <dl
            className="grid grid-cols-2 content-end gap-x-6 gap-y-5 border-t border-sand-2 pt-5 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
            {...reveal(260)}
          >
            <div className="col-span-2">
              <dt className="label text-stone">Role</dt>
              <dd className="mt-1">{volley.role}</dd>
            </div>
            <div>
              <dt className="label text-stone">When</dt>
              <dd className="mt-1">{volley.dates}</dd>
            </div>
            <div>
              <dt className="label text-stone">Platform</dt>
              <dd className="mt-1">Windows build</dd>
            </div>
            <div className="col-span-2">
              <dt className="label text-stone">Stack</dt>
              <dd className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.78rem]">
                {volley.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </dd>
            </div>
          </dl>
        </header>

        <div className="mt-14" {...reveal(0, "mask")}>
          <AnnotatedShot
            src={shot("spike-solid").src}
            srcSmall={shot("spike-solid").small}
            width={1280}
            height={720}
            alt="Backyard Volley gameplay in the park court: a CPU player spikes over the net with a burst at the contact point while Anthony's player (dark hair, red jersey) waits on the cyan ring."
            caption="A real frame from the game, captured with Godot’s Movie Maker mode. Tap the numbers."
            hotspots={[
              {
                x: 30,
                y: 55,
                title: "Contact readout",
                body: "Training mode prints every hit’s charge, timing, alignment, and contact score, the same model you can try in the Spike Lab below.",
              },
              {
                x: 73,
                y: 20,
                title: "SOLID burst",
                body: "A warm comic burst marks a solid spike right where the hand met the ball. Blocks get cool blues; weak hits only spark.",
              },
              {
                x: 54,
                y: 29,
                title: "Ball trail",
                body: "The trail encodes the last touch: hits are a thick streak in the hitter’s team colour, sets a gold ribbon, passes blue bubbles, blocks a red zig-zag.",
              },
              {
                x: 50,
                y: 49,
                title: "Crosshair",
                body: "Your character always faces the cursor. Moving and facing are separate, so you can shuffle sideways while aiming.",
              },
              {
                x: 35,
                y: 50,
                title: "Landing marker",
                body: "Shows where the ball will land; its outer ring shrinks as the ball comes down, which is how you time your jump.",
              },
              {
                x: 48,
                y: 74,
                title: "You (cyan ring)",
                body: "My player, with a CPU teammate. Bots fill every empty spot, from 1v1 to 6v6.",
              },
            ]}
          />
        </div>

        <div className="mt-20 lg:mt-24">
          <BehindTheBuild
            id="Backyard Volley"
            tone="light"
            barClassName="bg-ivory/85"
            panels={{
              product: <ProductPanel />,
              engineering: <EngineeringPanel />,
              outcome: <OutcomePanel />,
            }}
          />
        </div>
      </Container>
    </section>
  );
}

function ProductPanel() {
  const gallery = [
    {
      name: "replay-park",
      alt: "Instant replay: a broadcast camera follows a spiked ball with a blue streak across the park court.",
      note: "Instant replay after every point",
    },
    {
      name: "arena-replay",
      alt: "A 6v6 match in the arena with a red hit streak crossing the net.",
      note: "6v6 in the arena",
    },
    {
      name: "beach-net",
      alt: "Beach court replay of a spike at the net with a contact burst.",
      note: "Beach court",
    },
    {
      name: "training-spike",
      alt: "Training ground: a spiking drill on the beach with a landing target and a message explaining a missed rep.",
      note: "Training ground drills explain every rep",
    },
    {
      name: "customize",
      alt: "Main menu with Anthony's customized player Ansoniq and the customization panel.",
      note: "Customization menu",
    },
    {
      name: "scoreboard",
      alt: "Split blue and red scoreboard showing 1 to 0.",
      note: "TV-style scoreboard between points",
    },
  ];
  return (
    <div className="grid gap-12">
      <div className="grid gap-8 lg:grid-cols-12">
        <h3 className="text-headline font-medium lg:col-span-5">
          Arcade volleyball you play with your hands, not a menu.
        </h3>
        <div className="grid gap-4 text-[1rem] leading-relaxed text-ink/80 lg:col-span-7">
          <p>
            You move with the keyboard and aim everything with the mouse. Hold
            space to load a jump, hold click to charge a spike, and release with
            your hand on the ball. Set, bump, dive, block, and serve are all
            physical; nothing connects automatically.
          </p>
          <p>
            Play with bots on three courts from 1v1 to 6v6, run drills in a
            training ground with 11 tutorial lessons, customize your player, or
            host friends online.
          </p>
        </div>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((g, i) => (
          <li
            key={g.name}
            className={
              i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
            }
          >
            <figure className="m-0">
              <div className="overflow-hidden rounded-sm border border-ink/80">
                <Image
                  src={`${IMG}/${g.name}-${i === 0 ? 1280 : 640}.webp`}
                  alt={g.alt}
                  width={i === 0 ? 1280 : 640}
                  height={i === 0 ? 720 : 360}
                  sizes={
                    i === 0
                      ? "(min-width: 1024px) 66vw, 100vw"
                      : "(min-width: 1024px) 33vw, 50vw"
                  }
                  className="h-auto w-full transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
              <figcaption className="label mt-2 text-stone">
                {g.note}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StageHeader({
  n,
  title,
  lede,
}: {
  n: string;
  title: string;
  lede: string;
}) {
  return (
    <div className="grid gap-4 border-t-2 border-ink pt-5 lg:grid-cols-12">
      <p className="label text-brand-deep lg:col-span-2">{n}</p>
      <div className="lg:col-span-10">
        <h3 className="text-headline font-medium">
          {title}. <span className="font-normal text-stone">{lede}</span>
        </h3>
      </div>
    </div>
  );
}

function EngineeringPanel() {
  const [model, animate, play] = stages;
  return (
    <div className="grid gap-24">
      {/* Stage 1 */}
      <section aria-label={model.title}>
        <StageHeader n={model.number} title={model.title} lede={model.lede} />
        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="grid gap-4 text-ink/80 lg:col-span-5">
            {model.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <dl className="mt-2 grid gap-2 border-t border-sand-2 pt-4 text-sm">
              {model.specs.map((s) => (
                <div key={s.k} className="grid grid-cols-[7rem_1fr] gap-3">
                  <dt className="label pt-0.5 text-stone">{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid gap-4 lg:col-span-7">
            <figure className="m-0">
              <div className="overflow-hidden rounded-sm border border-ink/80">
                <Image
                  src={`${IMG}/rig-view-1280.webp`}
                  alt="Debug rig view in the game's menu: the skeleton's labelled bones drawn over the player."
                  width={1280}
                  height={720}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="label mt-2 text-stone">
                The rig view (R in the menu): the 19-bone skeleton the Blender
                poses drive
              </figcaption>
            </figure>
            <figure className="m-0">
              <ul className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {Array.from({ length: 8 }, (_, i) => (
                  <li
                    key={i}
                    className="overflow-hidden rounded-sm border border-sand-2"
                  >
                    <Image
                      src={`${IMG}/hair-${i + 1}.webp`}
                      alt={`Hairstyle option ${i + 1}`}
                      width={240}
                      height={240}
                      sizes="12vw"
                      className="h-auto w-full"
                    />
                  </li>
                ))}
              </ul>
              <figcaption className="label mt-2 text-stone">
                8 of the 16 Blender-built hairstyles, on the same head and face
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Stage 2 */}
      <section aria-label={animate.title}>
        <StageHeader
          n={animate.number}
          title={animate.title}
          lede={animate.lede}
        />
        <div className="mt-8 grid gap-4 text-ink/80 lg:grid-cols-3 lg:gap-8">
          {animate.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-10">
          <PoseLab />
        </div>
        <div className="mt-12">
          <PoseStrip />
        </div>
      </section>

      {/* Stage 3 */}
      <section aria-label={play.title}>
        <StageHeader n={play.number} title={play.title} lede={play.lede} />
        <div className="mt-8 grid gap-4 text-ink/80 lg:grid-cols-3 lg:gap-8">
          {play.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="mt-14">
          <Label className="text-brand-deep">Demo · Spike contact lab</Label>
          <div className="mt-5">
            <SpikeLab />
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label className="text-brand-deep">Under the hood</Label>
            <ul className="mt-5 grid">
              {systems.map((s) => (
                <li key={s.id} className="border-t border-sand-2 py-4">
                  <h4 className="font-semibold">{s.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-stone">
                    {s.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <figure className="m-0 lg:col-span-7 lg:pt-10">
            <div className="overflow-hidden rounded-sm border border-ink/80">
              <Image
                src={`${IMG}/clean-block-debug-1280.webp`}
                alt="Debug view on the beach: overlay text with hand-to-ball distance, arm angle, timing, contact, and block hitbox data, and a CLEAN BLOCK callout."
                width={1280}
                height={720}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-2 text-sm text-stone">
              The F3 debug view during a match: live hand-to-ball distance, arm
              angle, contact grade, and the block-volume result: the
              instrumentation I tuned the game with.
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}

function OutcomePanel() {
  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Label className="text-brand-deep">Delivered</Label>
        <ol className="mt-6 grid gap-5">
          {volleyOutcome.delivered.map((d, i) => (
            <li
              key={d}
              className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-sand-2 pt-5"
            >
              <span className="text-sm text-stone">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[1.0625rem] leading-relaxed">{d}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-stone">{volleyOutcome.review}</p>
      </div>
      <div className="lg:col-span-5">
        <Label className="text-brand-deep">What I learned</Label>
        <ul className="mt-6 grid gap-6">
          {volleyOutcome.learned.map((l) => (
            <li key={l} className="text-[1.1875rem] leading-snug font-medium">
              {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
