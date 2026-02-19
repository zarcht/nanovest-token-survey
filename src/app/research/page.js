"use client";

import { useState } from "react";
import {
  TrendingUp, Rocket, Globe, Cpu, Zap, BarChart3,
  DollarSign, Satellite, ArrowRight, ExternalLink,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Star,
} from "lucide-react";

function Section({ title, icon: Icon, color = "indigo", children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const styles = {
    indigo: { border: "border-indigo-800", bg: "bg-indigo-900/30", text: "text-indigo-400" },
    emerald: { border: "border-emerald-800", bg: "bg-emerald-900/30", text: "text-emerald-400" },
    amber:   { border: "border-amber-800",  bg: "bg-amber-900/30",  text: "text-amber-400"  },
    sky:     { border: "border-sky-800",    bg: "bg-sky-900/30",    text: "text-sky-400"    },
  };
  const s = styles[color] ?? styles.indigo;
  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} overflow-hidden mb-6`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left">
        <div className="flex items-center gap-3">
          <Icon size={20} className={s.text} />
          <span className="font-black text-white uppercase tracking-widest text-sm">{title}</span>
        </div>
        {open
          ? <ChevronUp size={16} className="text-slate-500" />
          : <ChevronDown size={16} className="text-slate-500" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

function Stat({ label, value, sub, accent = "indigo" }) {
  const accents = {
    indigo: "text-indigo-400", emerald: "text-emerald-400",
    amber: "text-amber-400",   sky: "text-sky-400",
  };
  return (
    <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700">
      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${accents[accent] ?? accents.indigo}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function Bull({ children }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-300 mb-2">
      <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
      {children}
    </li>
  );
}

function Bear({ children }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-300 mb-2">
      <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
      {children}
    </li>
  );
}

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-24">
      {/* Nav */}
      <nav className="border-b border-slate-800 sticky top-0 z-50 bg-slate-950/95 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><TrendingUp size={20} /></div>
          <span className="font-black text-xl uppercase tracking-tighter">
            Nano<span className="text-indigo-400">Frontier</span>
          </span>
        </div>
        <a
          href="/"
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-700 px-4 py-2 rounded-full"
        >
          <Rocket size={12} /> Register Interest
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-5 uppercase tracking-widest">
            Analyst Research Report · Feb 2026
          </span>
          <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
            SpaceX Pre-IPO<br />
            <span className="text-indigo-400">Investment Brief</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A comprehensive analysis of SpaceX&apos;s financial trajectory, IPO timeline, and the
            investment thesis for the world&apos;s most valuable private company.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a
              href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-full transition-colors"
            >
              <ExternalLink size={12} /> Full Financials on Fintool
            </a>
            <a
              href="/"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-white px-5 py-3 rounded-full transition-colors"
            >
              Register Interest <ArrowRight size={12} />
            </a>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat label="IPO Target Valuation" value="$1.5T"  sub="Mid-2026 target"       accent="indigo" />
          <Stat label="Private Valuation"    value="$800B"  sub="Dec 2025 tender offer" accent="sky"    />
          <Stat label="2025E Revenue"        value="$15.5B" sub="~63% YoY growth"       accent="emerald"/>
          <Stat label="Starlink Subscribers" value="10M+"   sub="As of Feb 2026"        accent="amber"  />
        </div>

        {/* IPO Overview */}
        <Section title="IPO Overview & Timeline" icon={Rocket} color="indigo">
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            <span className="text-white font-bold">SpaceX confirmed plans for a 2026 IPO</span> in an
            internal memo from CFO Bret Johnsen, framing the listing as a vehicle to fund an &quot;insane
            flight rate&quot; for Starship, AI data centers in space, and a base on the Moon. The offering
            would target a raise of{" "}
            <span className="text-indigo-400 font-bold">$30–50 billion</span> — the largest IPO in
            history, surpassing Saudi Aramco&apos;s 2019 record.
          </p>
          <Row label="Target IPO Date"           value="Mid-2026 (est. June 2026)" />
          <Row label="Target Raise"              value="$30B–$50B+"               />
          <Row label="Current Private Valuation" value="~$800B (Dec 2025 tender)" />
          <Row label="IPO Target Valuation"      value="$1.5 Trillion"            />
          <Row label="Listing Venue (expected)"  value="NYSE or Nasdaq (TBD)"     />
          <Row label="Implied Price / Revenue"   value="60–68× 2026E sales"       />
          <p className="text-xs text-slate-500 italic mt-4">
            Source: Bloomberg, Financial Times, Fortune — Dec 2025 / Jan 2026. Indicative only.
          </p>
        </Section>

        {/* Revenue */}
        <Section title="Revenue & Financial Performance" icon={DollarSign} color="emerald">
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            SpaceX has evolved from a capital-intensive launch provider into a{" "}
            <span className="text-white font-bold">diversified operator with scalable recurring revenue</span>.
            Starlink now accounts for the majority of revenue and is the primary earnings driver heading into the IPO.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-3">Revenue Progression</p>
              <Row label="2023 Total Revenue"  value="$8.7B"       />
              <Row label="2024 Total Revenue"  value="$13.1–14.2B" />
              <Row label="2025E Total Revenue" value="$15.5B+"     />
              <Row label="2026E Total Revenue" value="$22–24B"     />
            </div>
            <div>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-3">Starlink Segment</p>
              <Row label="2023 Starlink Revenue"  value="$4.2B"            />
              <Row label="2024 Starlink Revenue"  value="$8.2B (+95% YoY)" />
              <Row label="2025E Starlink Revenue" value="~$10B"            />
              <Row label="Starlink Subscribers"   value="10M+ (Feb 2026)"  />
            </div>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-xl p-4 mb-4">
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <Star size={10} /> Profitability Milestone
            </p>
            <p className="text-sm text-slate-300">
              SpaceX has been{" "}
              <span className="text-white font-bold">cash-flow positive for multiple years</span>,
              conducting semi-annual share buybacks for employees — a key prerequisite Musk cited
              before pursuing a public listing.
            </p>
          </div>
          <a
            href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest border border-indigo-800 px-4 py-2 rounded-full transition-colors"
          >
            <ExternalLink size={11} /> Deep-Dive: $8B Profit Analysis on Fintool
          </a>
        </Section>

        {/* Segments */}
        <Section title="Business Segments" icon={Satellite} color="sky">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} className="text-sky-400" />
                <span className="text-xs font-black uppercase tracking-widest text-sky-400">Starlink</span>
              </div>
              <p className="text-xl font-black text-white mb-1">$8.2B+</p>
              <p className="text-xs text-slate-400 mb-3">2024 Revenue · 58% of Total</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Over 9,422 active LEO satellites. 10M+ subscribers in 150+ countries. Expanding into
                aviation ($300K ARPU), maritime, government (Starshield), and direct-to-cell.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Rocket size={16} className="text-indigo-400" />
                <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Launch Services</span>
              </div>
              <p className="text-xl font-black text-white mb-1">$4.2B+</p>
              <p className="text-xs text-slate-400 mb-3">2024 Revenue · 42% of Total</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Falcon 9 commands 85%+ of global orbital launch mass. 160+ launches in 2025.
                Single boosters reused up to 32×. Starship in active development.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Cpu size={16} className="text-violet-400" />
                <span className="text-xs font-black uppercase tracking-widest text-violet-400">AI & Space Compute</span>
              </div>
              <p className="text-xl font-black text-white mb-1">Nascent</p>
              <p className="text-xs text-slate-400 mb-3">Est. $40–100B+ by 2026 (bull case)</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solar-powered orbital AI data centers using radiative cooling. D2C satellite phones.
                xAI integration. $100–200B revenue upside by 2027 in bull scenarios.
              </p>
            </div>
          </div>
        </Section>

        {/* Valuation */}
        <Section title="Valuation History" icon={BarChart3} color="amber">
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            SpaceX&apos;s valuation has grown ~6× in under three years. Investors are pricing SpaceX
            not as a traditional aerospace company but as a{" "}
            <span className="text-white font-bold">
              vertically integrated platform owning the &quot;physical internet&quot; of space
            </span>.
          </p>
          <Row label="Jan 2023 — Primary round" value="$137B"  />
          <Row label="Jun 2024 — Secondary"     value="$210B"  />
          <Row label="Dec 2024 — Secondary"     value="$350B"  />
          <Row label="Jul 2025 — Tender offer"  value="$400B"  />
          <Row label="Dec 2025 — Tender offer"  value="~$800B" />
          <Row label="2026 IPO Target"          value="$1.5T"  />
          <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4 mt-5">
            <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-2">Valuation Context</p>
            <p className="text-sm text-slate-300">
              At $800B, SpaceX trades at ~33× estimated 2026 revenue. At $1.5T, that rises to 60–68×.
              Legacy aerospace peers trade at 1.5–3× revenue. The premium reflects Starlink&apos;s
              recurring subscription model and launch monopoly economics.
            </p>
          </div>
        </Section>

        {/* Bull & Bear */}
        <Section title="Bull & Bear Case" icon={TrendingUp} color="indigo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                <CheckCircle2 size={12} /> Bull Case
              </p>
              <ul>
                <Bull>Starlink&apos;s 10M+ subscribers with high retention de-risks the core business</Bull>
                <Bull>85%+ global launch share — effectively a monopoly on orbital access</Bull>
                <Bull>Starship dramatically lowers marginal costs, enabling constellation scaling</Bull>
                <Bull>Space-based AI compute is a genuine multi-trillion-dollar optionality play</Bull>
                <Bull>Direct-to-cell could unlock $40–100B+ annual revenue by 2026–2027</Bull>
                <Bull>Starshield, NASA, DoD contracts provide a durable government revenue floor</Bull>
              </ul>
            </div>
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-1">
                <AlertTriangle size={12} /> Bear Case
              </p>
              <ul>
                <Bear>60–68× revenue multiples are extreme for a capital-intensive hardware business</Bear>
                <Bear>IPO could be delayed or shelved — Musk has repeatedly deferred public listings</Bear>
                <Bear>Subscriber growth plateau could trigger a sharp repricing of Starlink</Bear>
                <Bear>Single-key-person risk: Musk holds ~42% equity and 79% voting control</Bear>
                <Bear>Pre-IPO token exposure carries limited liquidity and pricing opacity</Bear>
                <Bear>Geopolitical risks could disrupt global Starlink rollout</Bear>
              </ul>
            </div>
          </div>
        </Section>

        {/* Moat */}
        <Section title="Competitive Moat" icon={Zap} color="sky">
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            SpaceX&apos;s dominance is self-reinforcing. By controlling its own launch vehicle, it
            deploys Starlink satellites at a fraction of competitor costs. No rival has replicated
            this at scale.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["85%+",  "Global orbital launch share"],
              ["500+",  "Successful booster landings"],
              ["32×",   "Max reuses of single Falcon 9"],
              ["9,422", "Active Starlink satellites (Jan 2026)"],
              ["150+",  "Countries with Starlink access"],
              ["$125M", "Falcon Heavy vs rivals at $300M+"],
            ].map(([v, l]) => (
              <div key={l} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
                <p className="text-xl font-black text-sky-400">{v}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">{l}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-indigo-900/60 to-slate-900 rounded-3xl border border-indigo-700/50 p-10 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-4 uppercase tracking-widest">
            Priority Series I
          </span>
          <h2 className="text-3xl font-black tracking-tight mb-3">Ready to Register Your Interest?</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Join the NanoFrontier demand survey for the SpaceX + xAI Frontier Token.
            Minimum allocation $5,000 USD.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-colors shadow-lg"
            >
              <Rocket size={14} /> Go to Investment Survey <ArrowRight size={14} />
            </a>
            <a
              href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-colors"
            >
              <ExternalLink size={14} /> Read Full Financials on Fintool
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-8 leading-relaxed max-w-2xl mx-auto">
          This report is for informational purposes only and does not constitute investment advice.
          All projections are based on publicly available analyst estimates and media reports.
          Investments in pre-IPO instruments carry significant risk, including total loss of capital.
        </p>
      </main>
    </div>
  );
}
