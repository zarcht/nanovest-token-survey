"use client";

import { useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, collection, addDoc, serverTimestamp,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import {
  TrendingUp, Rocket, Globe, Cpu, Zap, BarChart3,
  DollarSign, Satellite, ArrowRight, ExternalLink,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2,
  Star, X, User, Mail, AlertCircle, Calculator,
  CheckCircle, FileText,
} from "@/app/icons";

/* ── Firebase ── */
const firebaseConfig = {
  apiKey: "AIzaSyBYbnjtOoQZp43z_aiKnVMAKtOcUw9EXxU",
  authDomain: "nano-token-survey.firebaseapp.com",
  projectId: "nano-token-survey",
  storageBucket: "nano-token-survey.firebasestorage.app",
  messagingSenderId: "294925629622",
  appId: "1:294925629622:web:42448455940d855c194e17",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

const MIN_INVESTMENT = 5000;
const IPO_MULTIPLIER = 1.5;

const fmt = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(v);

/* ── Section Component ── */
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
        {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

function Stat({ label, value, sub, accent = "indigo" }) {
  const accents = { indigo: "text-indigo-400", emerald: "text-emerald-400", amber: "text-amber-400", sky: "text-sky-400" };
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
      <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />{children}
    </li>
  );
}

function Bear({ children }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-300 mb-2">
      <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />{children}
    </li>
  );
}

/* ── Register Interest Modal ── */
function RegisterModal({ onClose }) {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth).catch(console.error);
    });
    return () => unsub();
  }, []);

  const numericAmount = parseFloat(amount) || 0;
  const projectedValue = numericAmount * IPO_MULTIPLIER;
  const amountValid = numericAmount >= MIN_INVESTMENT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!amountValid) { alert(`Minimum investment is ${fmt(MIN_INVESTMENT)}`); return; }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "spacex_leads"), {
        productName: "SpaceX + xAI Frontier Token",
        userName: name,
        email,
        amount: numericAmount,
        timestamp: serverTimestamp(),
        userId: user.uid,
      });
      setSuccessData({ name, amount: numericAmount });
      setAmount(""); setName(""); setEmail("");
    } catch (err) {
      console.error("Firestore error:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-700/60 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
          <X size={20} />
        </button>

        <div className="relative p-8">
          {!successData ? (
            <>
              {/* Form Header */}
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-3 uppercase tracking-widest">
                  Priority Series I
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">Register Your Interest</h2>
                <p className="text-slate-400 text-sm mt-1">SpaceX + xAI Frontier Token — Indicative 2026 Listing</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Amount */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Indicative Nominal (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold pointer-events-none">$</span>
                    <input
                      type="number"
                      required
                      min={MIN_INVESTMENT}
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 w-full rounded-2xl bg-slate-800/80 border border-slate-600 text-white p-4 text-2xl font-black focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
                      placeholder="5000"
                    />
                  </div>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle size={10} /> Minimum Allocation: {fmt(MIN_INVESTMENT)}
                  </p>
                </div>

                {/* IPO Value preview */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Estimated IPO Value</span>
                    <span className={`text-xl font-black ${amountValid ? "text-emerald-400" : "text-slate-600"}`}>
                      {fmt(projectedValue)}
                    </span>
                  </div>
                  <div className="h-px bg-slate-700" />
                  <div className="flex justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Your Nominal</span>
                    <span className="text-xs font-bold text-slate-400">{amountValid ? fmt(numericAmount) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Target Multiple</span>
                    <span className="text-xs font-bold text-slate-400">{IPO_MULTIPLIER}× ($1T → $1.5T)</span>
                  </div>
                  <p className="text-[10px] text-slate-600 italic">* Indicative only. Not financial advice.</p>
                </div>

                {/* Name */}
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 w-full rounded-xl bg-slate-800/80 border border-slate-600 text-white p-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                    placeholder="Full Name"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 w-full rounded-xl bg-slate-800/80 border border-slate-600 text-white p-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                    placeholder="Email Address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !user}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Interest"}
                </button>

                <p className="text-center text-[10px] text-slate-600 leading-relaxed">
                  By submitting you agree this is an indication of interest only and does not constitute a binding commitment.
                </p>
              </form>
            </>
          ) : (
            /* Success State */
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle size={40} className="text-emerald-400" />
                </div>
              </div>
              <div className="text-center mb-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-3 uppercase tracking-widest">
                  Interest Registered
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Welcome aboard, {successData.name.split(" ")[0]}.
                </h2>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Your allocation interest has been logged. Our team will reach out with priority onboarding details.
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 mb-5 space-y-3">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Your Indicative Summary</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Nominal Investment</span>
                  <span className="text-sm font-black text-white">{fmt(successData.amount)}</span>
                </div>
                <div className="h-px bg-slate-700" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">IPO Target Valuation</span>
                  <span className="text-sm font-bold text-indigo-400">$1.5 Trillion</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Indicative Multiplier</span>
                  <span className="text-sm font-bold text-indigo-400">{IPO_MULTIPLIER}×</span>
                </div>
                <div className="h-px bg-slate-700" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Estimated IPO Value</span>
                  <span className="text-xl font-black text-emerald-400">{fmt(successData.amount * IPO_MULTIPLIER)}</span>
                </div>
              </div>

              <div className="bg-indigo-900/30 border border-indigo-800/50 rounded-2xl p-5 mb-6">
                <p className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest mb-3 flex items-center gap-1.5">
                  <Zap size={10} /> Next Steps
                </p>
                <ul className="space-y-2">
                  {[
                    "Our team will contact you within 24–48 hours",
                    "Review the research report for full due diligence",
                    "Priority allocation confirmed upon onboarding",
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs text-slate-300">
                      <ArrowRight size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors"
              >
                Close
              </button>
              <p className="text-center text-[10px] text-slate-600 mt-4">
                * Estimated IPO value is indicative only. Not financial advice.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ResearchPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-24">
      {/* Nav */}
      <nav className="border-b border-slate-800 sticky top-0 z-40 bg-slate-950/95 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><TrendingUp size={20} /></div>
          <span className="font-black text-xl uppercase tracking-tighter">
            Nano<span className="text-indigo-400">Frontier</span>
          </span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white transition-colors px-4 py-2 rounded-full"
        >
          <Rocket size={12} /> Register Interest
        </button>
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
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full transition-colors shadow-lg"
            >
              <Rocket size={12} /> Register Interest
            </button>
            <a
              href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-white px-6 py-3 rounded-full transition-colors"
            >
              <ExternalLink size={12} /> Full Financials on Fintool
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
            would target a raise of <span className="text-indigo-400 font-bold">$30–50 billion</span> —
            the largest IPO in history, surpassing Saudi Aramco&apos;s 2019 record.
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
              SpaceX has been <span className="text-white font-bold">cash-flow positive for multiple years</span>,
              conducting semi-annual share buybacks — a key prerequisite Musk cited before pursuing a public listing.
            </p>
          </div>
          <a
            href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest border border-indigo-800 px-4 py-2 rounded-full transition-colors"
          >
            <ExternalLink size={11} /> Deep-Dive: $8B Profit Analysis on Fintool
          </a>
        </Section>

        {/* Segments */}
        <Section title="Business Segments" icon={Satellite} color="sky">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Globe, color: "text-sky-400", title: "Starlink", value: "$8.2B+", sub: "2024 Revenue · 58% of Total", desc: "Over 9,422 active LEO satellites. 10M+ subscribers in 150+ countries. Expanding into aviation, maritime, government, and direct-to-cell." },
              { icon: Rocket, color: "text-indigo-400", title: "Launch Services", value: "$4.2B+", sub: "2024 Revenue · 42% of Total", desc: "Falcon 9 commands 85%+ of global orbital launch mass. 160+ launches in 2025. Single boosters reused up to 32×." },
              { icon: Cpu, color: "text-violet-400", title: "AI & Space Compute", value: "Nascent", sub: "Est. $40–100B+ by 2026 (bull)", desc: "Solar-powered orbital AI data centers. D2C satellite phones. xAI integration. $100–200B upside by 2027 in bull scenarios." },
            ].map(({ icon: Icon, color, title, value, sub, desc }) => (
              <div key={title} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} className={color} />
                  <span className={`text-xs font-black uppercase tracking-widest ${color}`}>{title}</span>
                </div>
                <p className="text-xl font-black text-white mb-1">{value}</p>
                <p className="text-xs text-slate-400 mb-3">{sub}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Valuation */}
        <Section title="Valuation History" icon={BarChart3} color="amber">
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            SpaceX&apos;s valuation has grown ~6× in under three years, priced as a{" "}
            <span className="text-white font-bold">vertically integrated platform owning the &quot;physical internet&quot; of space</span>.
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
              At $1.5T that&apos;s 60–68× 2026E revenue vs. 1.5–3× for legacy aerospace peers.
              The premium reflects Starlink&apos;s recurring subscription model and launch monopoly economics.
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
            SpaceX&apos;s dominance is self-reinforcing. No rival has replicated its vertical integration at scale.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["85%+", "Global orbital launch share"],
              ["500+", "Successful booster landings"],
              ["32×",  "Max reuses of single Falcon 9"],
              ["9,422","Active Starlink satellites (Jan 2026)"],
              ["150+", "Countries with Starlink access"],
              ["$125M","Falcon Heavy vs rivals at $300M+"],
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
            Join the NanoFrontier demand survey for the SpaceX + xAI Frontier Token. Minimum allocation $5,000 USD.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-colors shadow-lg"
            >
              <Rocket size={14} /> Register Interest Now
            </button>
            <a
              href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials"
              target="_blank" rel="noopener noreferrer"
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

      {/* Register Interest Modal */}
      {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
