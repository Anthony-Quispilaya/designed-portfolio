// MatchPoint case study. The redesign and feature work comes from Anthony
// (see REVIEW.md). The engineering details were checked against the
// matchpointapp repository (git history, migrations, and source).
// The repository is private company code, so nothing here quotes source
// beyond function / table names, and no screenshots are reproduced.

export const matchpoint = {
  id: "matchpoint",
  number: "01",
  name: "MatchPoint",
  role: "Software Engineer",
  dates: "May 2026 – Present",
  team: "Small product team · shared repo · PR-based workflow",
  stack: ["React Native", "Expo", "JavaScript / TypeScript", "Supabase (Postgres, RLS, Realtime, Edge Functions)", "Stripe", "NativeWind"],
  oneLiner:
    "A volleyball platform where players find open gyms, tournaments, and clinics, sign up with friends, and pay with a card or MatchPoint credits.",
  questionNote:
    "Players told us the original app showed too much at once. Before redesigning anything, I asked real users what they actually needed.",
  context: [
    {
      label: "The problem",
      text: "Main screens tried to show every detail at once, and the app was missing the social features players expected: no way to find friends, message them, or sign up for an event as a group.",
    },
    {
      label: "How I approached it",
      text: "I had friends and volleyball players test the original app, collected their feedback, and picked what mattered most for functionality and user satisfaction before writing any code.",
    },
    {
      label: "My responsibility",
      text: "I refactored and redesigned the app, built the friends and chat features, the participation waiver, the new payment portal, event-setup forms, and live event cards, plus the purchase-history receipts behind them.",
    },
  ],
} as const;

// ---------------------------------------------------------------- redesign
// Anthony's product work at MatchPoint (per Anthony — see REVIEW.md).
export const redesign = {
  research:
    "Before changing anything, I had friends and volleyball players test the original app and collected their feedback. With that data in hand, I picked what mattered most for functionality and for user satisfaction.",
  design:
    "I refactored the app and redesigned its interface around the patterns people already know from well-established products and current 2026 mobile design, using Mobbin and Dribbble for reference. Secondary details moved into page tabs, so main screens stay clean instead of crowded.",
  social:
    "Players can explore other users, view their profiles, add them as friends, and message them. Group chats keep a lasting conversation between several people; team group chats are temporary and tied to an event, so people who sign up together get to play together.",
  events:
    "A required participation waiver before anyone uses the app, a new payment portal with a clearer breakdown, reusable React Native form components that make creating a MatchPoint event faster, and live event cards for events like tournaments.",
  features: [
    "Research-driven redesign of the whole app, informed by user testing",
    "Friends: explore users, view profiles, add friends, and message",
    "Group chats, plus temporary team group chats for signing up to events together",
    "Required participation waiver before using the app",
    "New payment portal screen with more detailed information",
    "Tabbed pages that keep main screens clean",
    "Reusable form components for faster event setup",
    "Live event cards for events like tournaments",
  ],
} as const;

// ---------------------------------------------------------- payments story
// Verified in the repository: authored by Anthony.
export const paymentsStory = {
  title: "Every payment tells the truth later.",
  body: "The new payment portal is only as good as the data behind it. I made sure what a player sees about a payment stays accurate across every event type and every time they leave and rejoin.",
  points: [
    {
      k: "One receipt history",
      v: "A user_receipts SQL view unifies the payment tables of every event type, so purchase history is one feature instead of one screen per event.",
    },
    {
      k: "History survives rejoining",
      v: "Payments are one row per player and event, so rejoining used to erase the earlier attempt. The old row is now folded into metadata.priorAttempts first.",
    },
    {
      k: "The real payment method",
      v: "get-payment-method-type, an Edge Function that asks Stripe which method was actually used instead of guessing from the device platform.",
    },
    {
      k: "No hidden steps",
      v: "Missing timestamps render as “Date not recorded” instead of hiding a step that happened.",
    },
  ],
} as const;

// ------------------------------------------------------------ caching story
export const cachingStory = {
  title: "Stop asking the database the same question twice.",
  body: "Screens refetch on focus, so every tab switch re-ran the same queries, and the redesign added more tabs. A teammate had built the primitives: an in-memory cache with stale-while-revalidate and in-flight de-duplication. I extended them across tournaments, organizations, teams, player flags, and Elo, and wrote the rule the team now follows.",
  rules: [
    { k: "Every read is cached", v: "Exported model reads wrap a private fetch…Uncached() in getStaleWhileRevalidate." },
    { k: "Every write invalidates", v: "One prefix per entity (<entity>:<id>:*) so a single call clears detail and sub-resources." },
    { k: "Keys include the user", v: "Per-user reads are keyed by user id so nobody sees another user’s cached view." },
    { k: "Live data is exempt", v: "Message threads and other live state stay real-time by design." },
  ],
  ttl: [
    { name: "SHORT", value: "30s", use: "games, schedules, standings" },
    { name: "LIST", value: "90s", use: "home games list" },
    { name: "MEDIUM", value: "2m", use: "profiles, credits, rosters" },
    { name: "LONG", value: "5m", use: "near-static config" },
  ],
  caveat:
    "I don’t have production metrics for this change, so I won’t quote one. The mechanism: repeated navigation inside the fresh window is served from memory instead of the network.",
} as const;

export const outcome = {
  delivered: [
    "A redesigned app built from user feedback, with cleaner main screens and details moved into tabs.",
    "A social layer: user discovery, profiles, friends, messaging, group chats, and team group chats for events.",
    "A required participation waiver and a more detailed payment portal.",
    "Faster event creation with reusable form components, and live event cards.",
    "Unified purchase-history receipts across every event type, with full leave/rejoin history.",
  ],
  alsoShipped: [
    "Live tournament experience: realtime schedule, match status + timers, check-in window",
    "Check-in / check-out correctness for open gym rosters and team assignment",
    "Configurable team sizes and roster-lock days for games and tournaments",
    "Gender-restricted divisions enforced at registration",
    "Onboarding, Profile, and Settings rebuilt on the shared UI kit; remaining modals moved to one BottomSheet system",
    "Embedded maps, full-screen galleries, rotating Supabase-backed banners",
  ],
  learned: [
    "Ask before you build. Testing the original app with real players told me what to cut, not just what to add.",
    "Clean beats complete. Moving secondary details into tabs made the main screens easier to use without losing anything.",
    "History is data. If a row can be overwritten, decide up front what the user will need to see later.",
  ],
} as const;
