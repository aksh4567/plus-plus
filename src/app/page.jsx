import Link from "next/link";

const heroHighlights = [
  "Curated interview paths",
  "Real-time code execution",
  "AI-assisted hints",
  "Live submission verdicts",
];

const featureCards = [
  {
    title: "Adaptive challenges",
    body: "Level up with problem sets that adjust to your growth—easy ramps, sharp peaks, and thoughtful reviews.",
  },
  {
    title: "Studio-grade workspace",
    body: "A focused editor, crisp themes, test runner, and console fused together so you stay in flow.",
  },
  {
    title: "Signal over noise",
    body: "Visualize success rates, time-to-accept, and streaks with clean, glanceable metrics.",
  },
];

const statBadges = [
  { label: "Problems", value: "+100" },
  { label: "Weekly upvotes", value: "+8.4k" },
  { label: "Avg. review time", value: "23s" },
];

export default function Home() {
  return (
    <div className="home-landing relative min-h-screen overflow-hidden bg-linear-to-br from-amber-200 via-fuchsia-200 to-purple-200 text-slate-900">
      {/* Ambient shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-linear-to-br from-amber-400 via-amber-500/70 to-fuchsia-500 blur-3xl opacity-60" />
        <div className="absolute right-0 top-12 h-96 w-96 rounded-full bg-linear-to-br from-fuchsia-400 via-purple-500 to-purple-700 blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-linear-to-br from-amber-300 via-fuchsia-300 to-purple-400 blur-3xl opacity-60" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 pb-20 pt-28">
        {/* Hero */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm font-semibold backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Interview labs that feel like play
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight text-slate-900 drop-shadow-sm sm:text-5xl">
                Build interview muscle with vibrant, focused practice.
              </h1>
              <p className="max-w-xl text-lg text-slate-800/80">
                Code++ is a dsa playground crafted for deep focus and fast
                iteration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/problems">
                <button className="group relative overflow-hidden rounded-full px-7 py-3 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-transform duration-200 hover:-translate-y-0.5">
                  <span className="absolute inset-0 bg-linear-to-r from-amber-500 via-fuchsia-500 to-purple-600" />
                  <span className="relative">Start solving</span>
                </button>
              </Link>
              <Link href="/admin">
                <button className="rounded-full border border-slate-900/10 bg-white/60 px-6 py-3 text-base font-semibold text-slate-900 shadow-sm backdrop-blur transition-colors duration-200 hover:border-amber-400 hover:text-amber-700">
                  Explore dashboard
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-800/80">
              {heroHighlights.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 font-medium backdrop-blur"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-linear-to-br from-amber-500 via-fuchsia-500 to-purple-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Glass code card */}
          <div className="relative">
            <div className="absolute inset-0 -skew-y-2 rounded-3xl bg-linear-to-br from-amber-300/70 via-fuchsia-300/50 to-purple-400/70 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-800/70">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Live
                playground
              </div>
              <div className="mb-4 flex items-center gap-2 text-xs text-slate-700">
                <span className="flex h-2 w-14 rounded-full bg-linear-to-r from-amber-500 via-fuchsia-500 to-purple-600" />
                Monaco editor
              </div>
              <div className="rounded-2xl border border-white/60 bg-slate-900/90 p-4 text-left font-mono text-sm leading-relaxed text-slate-100 shadow-inner">
                <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-amber-200/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{" "}
                  JavaScript
                </div>
                <p>// Daily Warmup</p>
                <p className="text-amber-200">function</p>
                <p>
                  twoSum<span className="text-amber-200">(</span>nums, target
                  <span className="text-amber-200">)</span>{" "}
                  <span className="text-amber-200">{"{"}</span>
                </p>
                <p className="pl-4">
                  const seen = <span className="text-fuchsia-300">new</span>{" "}
                  Map();
                </p>
                <p className="pl-4">
                  for <span className="text-fuchsia-300">(</span>let i = 0; i
                  &lt; nums.length; i++
                  <span className="text-fuchsia-300">)</span>{" "}
                  <span className="text-amber-200">{"{"}</span>
                </p>
                <p className="pl-6">const need = target - nums[i];</p>
                <p className="pl-6">
                  if <span className="text-fuchsia-300">(</span>seen.has(need)
                  <span className="text-fuchsia-300">)</span>{" "}
                  <span className="text-amber-200">return</span>{" "}
                  [seen.get(need), i];
                </p>
                <p className="pl-6">seen.set(nums[i], i);</p>
                <p className="pl-4">{"}"}</p>
                <p className="pl-4">
                  <span className="text-amber-200">return</span> [];
                </p>
                <p className="text-amber-200">{"}"}</p>
                <div className="mt-5 flex items-center gap-3 text-xs text-slate-300/80">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{" "}
                    Tests passing
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />{" "}
                    Complexity preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-1"
            >
              <div
                className="absolute inset-0 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-80"
                style={{
                  background:
                    "radial-gradient(circle at 20% 20%, rgba(251,191,36,0.35), transparent 35%), radial-gradient(circle at 80% 30%, rgba(217,70,239,0.35), transparent 35%), radial-gradient(circle at 60% 80%, rgba(147,51,234,0.35), transparent 35%)",
                }}
              />
              <div className="relative space-y-3">
                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-400 via-fuchsia-500 to-purple-600 text-center text-lg font-bold text-white shadow-md shadow-fuchsia-400/30" />
                <h3 className="text-lg font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-800/80">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics & CTA */}
        <div className="grid items-center gap-8 rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">
              See progress light up in real time.
            </h2>
            <p className="max-w-2xl text-base text-slate-800/80">
              Track acceptance streaks, leaderboard climbs, and daily focus
              minutes. Every submission updates your trajectory, so you know
              exactly where to push next.
            </p>
            <div className="flex flex-wrap gap-3">
              {statBadges.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/70 bg-linear-to-br from-amber-100 via-fuchsia-100 to-purple-100 px-4 py-3 text-left shadow-sm"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-700/80">
                    {stat.label}
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-slate-900/90 p-6 shadow-2xl">
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(251,191,36,0.12), transparent 35%), radial-gradient(circle at 80% 20%, rgba(217,70,239,0.14), transparent 35%), radial-gradient(circle at 50% 80%, rgba(147,51,234,0.18), transparent 40%)",
              }}
            />
            <div className="relative space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
                Rapid feedback loop
              </div>
              <p className="text-lg font-semibold text-white">
                Launch code, capture verdicts, visualize runtime and memory—all
                in one fluid loop.
              </p>
              <div className="grid gap-3 text-sm text-slate-200">
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span>Runtime snapshot</span>
                  <span className="rounded-full bg-linear-to-r from-amber-500 to-fuchsia-500 px-3 py-1 text-xs font-semibold text-slate-900 shadow">
                    132 ms
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span>Memory footprint</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-100">
                    4.8 MB
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <span>Test coverage</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-fuchsia-100">
                    14/14
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
