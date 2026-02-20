"use client";

import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  TrendingUp, Rocket, BarChart3, DollarSign, ExternalLink,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2,
  Star, X, User, Mail, AlertCircle, CheckCircle,
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
const fmt = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

/* ── Helpers ── */
function Section({ title, icon: Icon, color = "indigo", children }) {
  const [open, setOpen] = useState(false);
  const s = {
    indigo: { border: "border-indigo-800", bg: "bg-indigo-900/30", text: "text-indigo-400" },
    emerald: { border: "border-emerald-800", bg: "bg-emerald-900/30", text: "text-emerald-400" },
    amber: { border: "border-amber-800", bg: "bg-amber-900/30", text: "text-amber-400" },
  }[color] || { border: "border-indigo-800", bg: "bg-indigo-900/30", text: "text-indigo-400" };
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
  const c = { indigo: "text-indigo-400", emerald: "text-emerald-400", amber: "text-amber-400", sky: "text-sky-400" }[accent] || "text-indigo-400";
  return (
    <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700">
      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${c}`}>{value}</p>
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

/* ── Revenue Chart (no .map with index) ── */
function RevenueChart() {
  const W = 260; const H = 200;
  const pL = 10; const pR = 10; const pT = 44; const pB = 24;
  const cW = W - pL - pR; const cH = H - pT - pB;
  const MAX = 20;

  const xA = pL;            const yA = pT + cH - (8.7  / MAX) * cH;
  const xB = pL + cW / 2;  const yB = pT + cH - (13.7 / MAX) * cH;
  const xC = pL + cW;      const yC = pT + cH - (15.5 / MAX) * cH;

  const line   = `${xA},${yA} ${xB},${yB} ${xC},${yC}`;
  const area   = `M${xA},${pT + cH} L${xA},${yA} L${xB},${yB} L${xC},${yC} L${xC},${pT + cH} Z`;
  const g1y = pT + cH - 0.33 * cH;
  const g2y = pT + cH - 0.66 * cH;
  const g3y = pT + cH - 1.00 * cH;

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-3">Total Revenue</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
          <filter id="rGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <line x1={pL} y1={g1y} x2={W - pR} y2={g1y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={pL} y1={g2y} x2={W - pR} y2={g2y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={pL} y1={g3y} x2={W - pR} y2={g3y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <path d={area} fill="url(#rGrad)" />
        <polyline points={line} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#rGlow)" />
        {/* Point A */}
        <circle cx={xA} cy={yA} r="5" fill="#10b981" fillOpacity="0.2" />
        <circle cx={xA} cy={yA} r="3" fill="#10b981" />
        <text x={xA} y={yA - 10} textAnchor="start" fontSize="9" fontWeight="800" fill="#34d399">$8.7B</text>
        <text x={xA} y={H - 5} textAnchor="start" fontSize="8" fill="#64748b">2023</text>
        {/* Point B */}
        <circle cx={xB} cy={yB} r="5" fill="#10b981" fillOpacity="0.2" />
        <circle cx={xB} cy={yB} r="3" fill="#10b981" />
        <text x={xB} y={yB - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#34d399">$13.7B</text>
        <text x={xB} y={H - 5} textAnchor="middle" fontSize="8" fill="#64748b">2024</text>
        {/* Point C — rightmost, anchor end to prevent clipping */}
        <circle cx={xC} cy={yC} r="5" fill="#10b981" fillOpacity="0.2" />
        <circle cx={xC} cy={yC} r="3" fill="#10b981" />
        <text x={xC} y={yC - 10} textAnchor="end" fontSize="9" fontWeight="800" fill="#34d399">$15.5B</text>
        <text x={xC} y={H - 5} textAnchor="end" fontSize="8" fill="#64748b">2025E</text>
      </svg>
    </div>
  );
}

/* ── Starlink Chart (no .map with index) ── */
function StarlinkChart() {
  const W = 260; const H = 200;
  const pL = 10; const pR = 10; const pT = 44; const pB = 24;
  const cW = W - pL - pR; const cH = H - pT - pB;
  const MAX = 14;

  const xA = pL;            const yA = pT + cH - (4.2  / MAX) * cH;
  const xB = pL + cW / 2;  const yB = pT + cH - (8.2  / MAX) * cH;
  const xC = pL + cW;      const yC = pT + cH - (10   / MAX) * cH;

  const line = `${xA},${yA} ${xB},${yB} ${xC},${yC}`;
  const area = `M${xA},${pT + cH} L${xA},${yA} L${xB},${yB} L${xC},${yC} L${xC},${pT + cH} Z`;
  const g1y = pT + cH - 0.33 * cH;
  const g2y = pT + cH - 0.66 * cH;
  const g3y = pT + cH - 1.00 * cH;

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <p className="text-xs text-sky-400 font-bold uppercase tracking-widest mb-3">Starlink Revenue</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
          </linearGradient>
          <filter id="sGlow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <line x1={pL} y1={g1y} x2={W - pR} y2={g1y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={pL} y1={g2y} x2={W - pR} y2={g2y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={pL} y1={g3y} x2={W - pR} y2={g3y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
        <path d={area} fill="url(#sGrad)" />
        <polyline points={line} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#sGlow)" />
        {/* Point A */}
        <circle cx={xA} cy={yA} r="5" fill="#38bdf8" fillOpacity="0.2" />
        <circle cx={xA} cy={yA} r="3" fill="#38bdf8" />
        <text x={xA} y={yA - 10} textAnchor="start" fontSize="9" fontWeight="800" fill="#7dd3fc">$4.2B</text>
        <text x={xA} y={H - 5} textAnchor="start" fontSize="8" fill="#64748b">2023</text>
        {/* Point B */}
        <circle cx={xB} cy={yB} r="5" fill="#38bdf8" fillOpacity="0.2" />
        <circle cx={xB} cy={yB} r="3" fill="#38bdf8" />
        <text x={xB} y={yB - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#7dd3fc">$8.2B</text>
        <text x={xB} y={H - 5} textAnchor="middle" fontSize="8" fill="#64748b">2024</text>
        {/* Point C — rightmost, anchor end to prevent clipping */}
        <circle cx={xC} cy={yC} r="5" fill="#38bdf8" fillOpacity="0.2" />
        <circle cx={xC} cy={yC} r="3" fill="#38bdf8" />
        <text x={xC} y={yC - 10} textAnchor="end" fontSize="9" fontWeight="800" fill="#7dd3fc">$10B</text>
        <text x={xC} y={H - 5} textAnchor="end" fontSize="8" fill="#64748b">2025E</text>
      </svg>
    </div>
  );
}

/* ── Valuation Chart (no .map with index) ── */
function ValuationChart() {
  const W = 560; const H = 220;
  const pL = 10; const pR = 10; const pT = 36; const pB = 28;
  const cW = W - pL - pR; const cH = H - pT - pB;
  const MAX = 1500;
  const step = cW / 5;

  const pts = [
    { label: "Jan '23", value: 137,  display: "$137B" },
    { label: "Jun '24", value: 210,  display: "$210B" },
    { label: "Dec '24", value: 350,  display: "$350B" },
    { label: "Jul '25", value: 400,  display: "$400B" },
    { label: "Dec '25", value: 800,  display: "$800B" },
    { label: "IPO '26", value: 1500, display: "$1.5T"  },
  ].map((d, idx) => ({
    ...d,
    x: pL + idx * step,
    y: pT + cH - (d.value / MAX) * cH,
    last: idx === 5,
  }));

  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `M${pts[0].x},${pT + cH} ${pts.map(p => `L${p.x},${p.y}`).join(" ")} L${pts[5].x},${pT + cH} Z`;
  const barW = step * 0.35;

  return (
    <div className="w-full overflow-x-auto mb-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }}>
        <defs>
          <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="vLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <filter id="vGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <line x1={pL} y1={pT + cH - 0.25 * cH} x2={W - pR} y2={pT + cH - 0.25 * cH} stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1={pL} y1={pT + cH - 0.50 * cH} x2={W - pR} y2={pT + cH - 0.50 * cH} stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1={pL} y1={pT + cH - 0.75 * cH} x2={W - pR} y2={pT + cH - 0.75 * cH} stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1={pL} y1={pT + cH - 1.00 * cH} x2={W - pR} y2={pT + cH - 1.00 * cH} stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
        <path d={area} fill="url(#vGrad)" />
        <polyline points={polyline} fill="none" stroke="url(#vLine)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#vGlow)" />
        {/* Bars */}
        <rect x={pts[0].x - barW/2} y={pT + cH - (pts[0].value/MAX)*cH} width={barW} height={(pts[0].value/MAX)*cH} rx="3" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="1" />
        <rect x={pts[1].x - barW/2} y={pT + cH - (pts[1].value/MAX)*cH} width={barW} height={(pts[1].value/MAX)*cH} rx="3" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="1" />
        <rect x={pts[2].x - barW/2} y={pT + cH - (pts[2].value/MAX)*cH} width={barW} height={(pts[2].value/MAX)*cH} rx="3" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="1" />
        <rect x={pts[3].x - barW/2} y={pT + cH - (pts[3].value/MAX)*cH} width={barW} height={(pts[3].value/MAX)*cH} rx="3" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="1" />
        <rect x={pts[4].x - barW/2} y={pT + cH - (pts[4].value/MAX)*cH} width={barW} height={(pts[4].value/MAX)*cH} rx="3" fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="1" />
        <rect x={pts[5].x - barW/2} y={pT + cH - (pts[5].value/MAX)*cH} width={barW} height={(pts[5].value/MAX)*cH} rx="3" fill="rgba(52,211,153,0.25)" stroke="#34d399" strokeWidth="1" />
        {/* Points */}
        <circle cx={pts[0].x} cy={pts[0].y} r="6" fill="rgba(99,102,241,0.2)" /><circle cx={pts[0].x} cy={pts[0].y} r="3.5" fill="#818cf8" />
        <text x={pts[0].x} y={pts[0].y - 10} textAnchor="start" fontSize="9" fontWeight="800" fill="#a5b4fc">{pts[0].display}</text>
        <text x={pts[0].x} y={H - 6} textAnchor="start" fontSize="8" fill="#64748b">{pts[0].label}</text>

        <circle cx={pts[1].x} cy={pts[1].y} r="6" fill="rgba(99,102,241,0.2)" /><circle cx={pts[1].x} cy={pts[1].y} r="3.5" fill="#818cf8" />
        <text x={pts[1].x} y={pts[1].y - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#a5b4fc">{pts[1].display}</text>
        <text x={pts[1].x} y={H - 6} textAnchor="middle" fontSize="8" fill="#64748b">{pts[1].label}</text>

        <circle cx={pts[2].x} cy={pts[2].y} r="6" fill="rgba(99,102,241,0.2)" /><circle cx={pts[2].x} cy={pts[2].y} r="3.5" fill="#818cf8" />
        <text x={pts[2].x} y={pts[2].y - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#a5b4fc">{pts[2].display}</text>
        <text x={pts[2].x} y={H - 6} textAnchor="middle" fontSize="8" fill="#64748b">{pts[2].label}</text>

        <circle cx={pts[3].x} cy={pts[3].y} r="6" fill="rgba(99,102,241,0.2)" /><circle cx={pts[3].x} cy={pts[3].y} r="3.5" fill="#818cf8" />
        <text x={pts[3].x} y={pts[3].y - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#a5b4fc">{pts[3].display}</text>
        <text x={pts[3].x} y={H - 6} textAnchor="middle" fontSize="8" fill="#64748b">{pts[3].label}</text>

        <circle cx={pts[4].x} cy={pts[4].y} r="6" fill="rgba(99,102,241,0.2)" /><circle cx={pts[4].x} cy={pts[4].y} r="3.5" fill="#818cf8" />
        <text x={pts[4].x} y={pts[4].y - 10} textAnchor="middle" fontSize="9" fontWeight="800" fill="#a5b4fc">{pts[4].display}</text>
        <text x={pts[4].x} y={H - 6} textAnchor="middle" fontSize="8" fill="#64748b">{pts[4].label}</text>

        <circle cx={pts[5].x} cy={pts[5].y} r="6" fill="rgba(52,211,153,0.2)" /><circle cx={pts[5].x} cy={pts[5].y} r="3.5" fill="#34d399" />
        <text x={pts[5].x} y={pts[5].y - 10} textAnchor="end" fontSize="9" fontWeight="800" fill="#34d399">{pts[5].display}</text>
        <text x={pts[5].x} y={H - 6} textAnchor="end" fontSize="8" fill="#64748b">{pts[5].label}</text>
      </svg>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-indigo-500/40 border border-indigo-500" />
          <span className="text-[10px] text-slate-400">Historical Rounds</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-400" />
          <span className="text-[10px] text-slate-400">IPO Target</span>
        </div>
      </div>
    </div>
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
        userName: name, email, amount: numericAmount,
        timestamp: serverTimestamp(), userId: user.uid,
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
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-3 uppercase tracking-widest">Priority Series I</span>
                <h2 className="text-2xl font-black text-white tracking-tight">Register Your Interest</h2>
                <p className="text-slate-400 text-sm mt-1">SpaceX + xAI Frontier Token — Indicative 2026 Listing</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Indicative Nominal (USD)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold pointer-events-none">$</span>
                    <input type="number" required min={MIN_INVESTMENT} step="1" value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 w-full rounded-2xl bg-slate-800/80 border border-slate-600 text-white p-4 text-2xl font-black focus:border-indigo-500 outline-none transition-all placeholder-slate-600"
                      placeholder="5000" />
                  </div>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle size={10} /> Minimum Allocation: {fmt(MIN_INVESTMENT)}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Estimated IPO Value</span>
                    <span className={`text-xl font-black ${amountValid ? "text-emerald-400" : "text-slate-600"}`}>{fmt(projectedValue)}</span>
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
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="pl-12 w-full rounded-xl bg-slate-800/80 border border-slate-600 text-white p-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                    placeholder="Full Name" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 w-full rounded-xl bg-slate-800/80 border border-slate-600 text-white p-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                    placeholder="Email Address" />
                </div>
                <button type="submit" disabled={isSubmitting || !user}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-60 disabled:cursor-not-allowed">
                  {isSubmitting ? "Submitting..." : "Submit Interest"}
                </button>
                <p className="text-center text-[10px] text-slate-600 leading-relaxed">
                  By submitting you agree this is an indication of interest only and does not constitute a binding commitment.
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle size={40} className="text-emerald-400" />
                </div>
              </div>
              <div className="text-center mb-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-3 uppercase tracking-widest">Interest Registered</span>
                <h2 className="text-2xl font-black text-white tracking-tight">Welcome aboard, {successData.name.split(" ")[0]}.</h2>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Thank you for sharing your interest. Our team has recorded this and will share additional information on further developments.
                </p>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 mb-5 space-y-3">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Projected Return</p>
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
                  <span className="text-sm font-bold text-white">Estimated Value Post IPO</span>
                  <span className="text-xl font-black text-emerald-400">{fmt(successData.amount * IPO_MULTIPLIER)}</span>
                </div>
              </div>
              <button onClick={onClose} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors">Close</button>
              <p className="text-center text-[10px] text-slate-600 mt-4">* Estimated IPO value is indicative only. Not financial advice.</p>
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
      <nav className="border-b border-slate-800 sticky top-0 z-40 bg-slate-950/95 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="Nanovest" className="h-8 w-auto" />
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white transition-colors px-4 py-2 rounded-full">
          <Rocket size={12} /> Pre-Register
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-5 uppercase tracking-widest">Nanovest Tokenization</span>
          <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
            SpaceX Pre-IPO<br /><span className="text-indigo-400">Investment Opportunity</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A comprehensive analysis of SpaceX&apos;s financial trajectory, IPO timeline, and the investment thesis for the world&apos;s most valuable private company.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full transition-colors shadow-lg">
              <Rocket size={12} /> Pre-Register
            </button>
            <a href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full transition-colors shadow-lg">
              <ExternalLink size={12} /> See Full Research Report
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat label="IPO Target Valuation" value="$1.5T"  sub="Mid-2026 target" accent="indigo" />
          <Stat label="Private Valuation"    value="$1T"    sub="Current offer"   accent="sky"    />
          <Stat label="2025E Revenue"        value="$15.5B" sub="~63% YoY growth" accent="emerald" />
          <Stat label="Starlink Subscribers" value="10M+"   sub="As of Feb 2026"  accent="amber"  />
        </div>

        <Section title="IPO Overview & Timeline" icon={Rocket} color="indigo">
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            <span className="text-white font-bold">SpaceX confirmed plans for a 2026 IPO</span> in an internal memo from CFO Bret Johnsen, framing the listing as a vehicle to fund an &quot;insane flight rate&quot; for Starship, AI data centers in space, and a base on the Moon. The offering would target a raise of <span className="text-indigo-400 font-bold">$30–50 billion</span> — the largest IPO in history, surpassing Saudi Aramco&apos;s 2019 record.
          </p>
          <Row label="Target IPO Date"      value="Mid-2026 (est. June 2026)" />
          <Row label="IPO Target Valuation" value="$1.5 Trillion" />
          <Row label="Target Raise"         value="$30B–$50B+" />
          <p className="text-xs text-slate-500 italic mt-4">Source: Bloomberg, Financial Times, Fortune — Dec 2025 / Jan 2026. Indicative only.</p>
        </Section>

        <Section title="Revenue & Financial Performance" icon={DollarSign} color="emerald">
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            SpaceX has evolved from a capital-intensive launch provider into a <span className="text-white font-bold">diversified operator with scalable recurring revenue</span>. Starlink now accounts for the majority of revenue and is the primary earnings driver heading into the IPO.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <RevenueChart />
            <StarlinkChart />
          </div>
          <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-xl p-4 mb-4">
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <Star size={10} /> Profitability Milestone
            </p>
            <p className="text-sm text-slate-300">
              SpaceX has been <span className="text-white font-bold">cash-flow positive for multiple years</span>, conducting semi-annual share buybacks — a key prerequisite Musk cited before pursuing a public listing.
            </p>
          </div>
          <a href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest border border-indigo-800 px-4 py-2 rounded-full transition-colors">
            <ExternalLink size={11} /> Deep-Dive: $8B Profit Analysis on Fintool
          </a>
        </Section>

        <Section title="Valuation History" icon={BarChart3} color="amber">
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            SpaceX&apos;s valuation has grown ~6× in under three years, priced as a <span className="text-white font-bold">vertically integrated platform owning the &quot;physical internet&quot; of space</span>.
          </p>
          <ValuationChart />
          <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4">
            <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-2">Valuation Context</p>
            <p className="text-sm text-slate-300">
              At $1.5T that&apos;s 60–68× 2026E revenue vs. 1.5–3× for legacy aerospace peers. The premium reflects Starlink&apos;s recurring subscription model and launch monopoly economics.
            </p>
          </div>
        </Section>

        <Section title="Bull & Bear Case" icon={TrendingUp} color="indigo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-1"><CheckCircle2 size={12} /> Bull Case</p>
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
              <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-1"><AlertTriangle size={12} /> Bear Case</p>
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

        <div className="bg-gradient-to-br from-indigo-900/60 to-slate-900 rounded-3xl border border-indigo-700/50 p-10 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-4 uppercase tracking-widest">Priority Series I</span>
          <h2 className="text-3xl font-black tracking-tight mb-3">Ready to Register Your Interest?</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Join the NanoFrontier demand survey for the SpaceX + xAI Frontier Token. Minimum allocation $5,000 USD.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-colors shadow-lg">
              <Rocket size={14} /> Register Interest Now
            </button>
            <a href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-colors">
              <ExternalLink size={14} /> Read Full Financials on Fintool
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-8 leading-relaxed max-w-2xl mx-auto">
          This report is for informational purposes only and does not constitute investment advice. All projections are based on publicly available analyst estimates and media reports. Investments in pre-IPO instruments carry significant risk, including total loss of capital.
        </p>
      </main>

      {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
