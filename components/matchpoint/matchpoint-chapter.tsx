import { BehindTheBuild } from "@/components/case-study/behind-the-build";
import { Container, Label, reveal, Ruler } from "@/components/ui/primitives";
import {
  cachingStory,
  matchpoint,
  outcome,
  paymentsStory,
  redesign,
} from "@/content/matchpoint";

export function MatchPointChapter() {
  const mp = matchpoint;
  return (
    <section
      id="matchpoint"
      aria-labelledby="matchpoint-title"
      data-nav-theme="dark"
      className="on-dark relative bg-ink pt-20 pb-24 text-chalk lg:pt-28 lg:pb-32"
    >
      <Container>
        <Ruler className="text-chalk" />

        {/* Opener */}
        <header className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex items-baseline gap-4" {...reveal()}>
              <span className="text-sm text-brand">{mp.number}</span>
              <Label className="text-mist">
                Featured project · Production mobile app
              </Label>
            </div>
            <h2
              id="matchpoint-title"
              className="mt-5 text-chapter font-semibold"
              {...reveal(80, "mask")}
            >
              {mp.name}
            </h2>
            <p
              className="prose-measure mt-6 text-lede text-chalk/80"
              {...reveal(160)}
            >
              {mp.oneLiner}
            </p>
          </div>
          <dl
            className="grid grid-cols-2 content-end gap-x-6 gap-y-5 border-t border-ink-3 pt-5 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
            {...reveal(200)}
          >
            {[
              ["Role", mp.role],
              ["When", mp.dates],
              ["Team", mp.team],
            ].map(([k, v]) => (
              <div key={k} className={k === "Team" ? "col-span-2" : ""}>
                <dt className="label text-mist">{k}</dt>
                <dd className="mt-1 text-[0.9375rem]">{v}</dd>
              </div>
            ))}
            <div className="col-span-2">
              <dt className="label text-mist">Stack</dt>
              <dd className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.78rem] text-chalk/85">
                {mp.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </dd>
            </div>
          </dl>
        </header>

        {/* The question */}
        <div className="mt-20 grid gap-8 lg:mt-28 lg:grid-cols-12">
          <p className="label text-brand lg:col-span-2 lg:pt-3" {...reveal()}>
            The question
          </p>
          <div className="lg:col-span-10">
            <h3
              className="text-headline font-medium text-balance lg:text-[clamp(2rem,3.6vw,3.4rem)]"
              {...reveal(60)}
            >
              What do players actually need from the app,{" "}
              <span className="text-brand">and what can we take away?</span>
            </h3>
            <p
              className="prose-measure mt-6 text-lede text-chalk/75"
              {...reveal(140)}
            >
              {mp.questionNote}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-ink-3 bg-ink-3 md:grid-cols-3">
          {mp.context.map((c, i) => (
            <div
              key={c.label}
              className="bg-ink p-6 lg:p-7"
              {...reveal(i * 90)}
            >
              <Label className="text-mist">{c.label}</Label>
              <p className="mt-3 text-[0.9875rem] leading-relaxed text-chalk/85">
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* Behind the build */}
        <div className="mt-20 lg:mt-24">
          <BehindTheBuild
            id="MatchPoint"
            initial="product"
            tone="dark"
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
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Label className="text-brand">Redesign</Label>
        <h3 className="mt-3 text-headline font-medium">
          Tested with players first, then rebuilt.
        </h3>
        <div className="mt-6 space-y-4 text-[1rem] leading-relaxed text-chalk/80">
          <p>{redesign.research}</p>
          <p>{redesign.design}</p>
        </div>
        <dl className="mt-8 grid gap-4 border-t border-ink-3 pt-6 text-sm">
          {[
            ["Who it’s for", "Players, team captains, and event hosts"],
            [
              "My surface area",
              "App-wide redesign, friends & chats, waiver, payments & receipts, event setup, live events",
            ],
            ["Platform", "iOS and Android from one Expo codebase"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4">
              <dt className="label pt-0.5 text-mist">{k}</dt>
              <dd className="text-chalk/85">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="grid content-start gap-6 lg:col-span-7">
        <div className="grid gap-px overflow-hidden rounded-sm border border-ink-3 bg-ink-3 sm:grid-cols-2">
          {[
            ["Friends & chats", redesign.social],
            ["Events & payments", redesign.events],
          ].map(([k, v]) => (
            <div key={k} className="bg-ink p-5">
              <p className="font-medium text-chalk">{k}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-mist">{v}</p>
            </div>
          ))}
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {redesign.features.map((f) => (
            <li
              key={f}
              className="grid grid-cols-[0.75rem_1fr] gap-2 text-sm leading-relaxed text-chalk/85"
            >
              <span aria-hidden="true" className="mt-2 h-px w-2 bg-brand" />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <p className="label text-mist/70 lg:col-span-12">
        Real app screenshots: pending (see the review list).
      </p>
    </div>
  );
}

function EngineeringPanel() {
  return (
    <div className="space-y-24">
      <section
        aria-labelledby="mp-payments"
        className="grid gap-10 lg:grid-cols-12"
      >
        <div className="lg:col-span-4">
          <Label className="text-brand">Payments & receipts</Label>
          <h3 id="mp-payments" className="mt-3 text-headline font-medium">
            {paymentsStory.title}
          </h3>
          <p className="mt-4 text-chalk/75">{paymentsStory.body}</p>
        </div>
        <dl className="grid gap-px self-start overflow-hidden rounded-sm border border-ink-3 bg-ink-3 sm:grid-cols-2 lg:col-span-8">
          {paymentsStory.points.map((r) => (
            <div key={r.k} className="bg-ink p-5">
              <dt className="font-medium text-chalk">{r.k}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-mist">
                {r.v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="mp-cache"
        className="grid gap-10 lg:grid-cols-12"
      >
        <div className="lg:col-span-4">
          <Label className="text-brand">Performance</Label>
          <h3 id="mp-cache" className="mt-3 text-headline font-medium">
            {cachingStory.title}
          </h3>
          <p className="mt-4 text-chalk/75">{cachingStory.body}</p>
        </div>
        <div className="grid gap-6 lg:col-span-8">
          <dl className="grid gap-px overflow-hidden rounded-sm border border-ink-3 bg-ink-3 sm:grid-cols-2">
            {cachingStory.rules.map((r) => (
              <div key={r.k} className="bg-ink p-5">
                <dt className="font-medium text-chalk">{r.k}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-mist">
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>
          <div
            className="flex flex-wrap items-end gap-3"
            aria-label="Cache freshness windows"
          >
            {cachingStory.ttl.map((t, i) => (
              <div key={t.name} className="min-w-[7.5rem] flex-1">
                <div className="flex items-end gap-2">
                  <span
                    aria-hidden="true"
                    className="block w-full rounded-t-[2px] bg-brand/80"
                    style={{ height: `${[18, 30, 44, 70][i]}px` }}
                  />
                </div>
                <p className="mt-2 text-sm text-chalk">
                  {t.name} <span className="text-mist">· {t.value}</span>
                </p>
                <p className="text-xs text-mist">{t.use}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-mist">{cachingStory.caveat}</p>
        </div>
      </section>
    </div>
  );
}

function OutcomePanel() {
  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Label className="text-brand">Delivered</Label>
        <ol className="mt-6 grid gap-5">
          {outcome.delivered.map((d, i) => (
            <li
              key={d}
              className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-ink-3 pt-5"
            >
              <span className="text-sm text-mist">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[1.0625rem] leading-relaxed">{d}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-mist">
          No usage or revenue numbers here on purpose: I don’t have figures I
          can verify and share. What’s listed is shipped and in the repository.
        </p>
      </div>
      <div className="space-y-12 lg:col-span-5">
        <div>
          <Label className="text-brand">What I learned</Label>
          <ul className="mt-6 grid gap-5">
            {outcome.learned.map((l) => (
              <li
                key={l}
                className="text-[1.1875rem] leading-snug font-medium text-chalk/90"
              >
                {l}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Label className="text-mist">Also shipped</Label>
          <ul className="mt-4 grid gap-2">
            {outcome.alsoShipped.map((s) => (
              <li
                key={s}
                className="grid grid-cols-[0.75rem_1fr] gap-2 text-sm leading-relaxed text-mist"
              >
                <span aria-hidden="true" className="mt-2 h-px w-2 bg-mist" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
