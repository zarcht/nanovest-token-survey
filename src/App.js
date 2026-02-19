import Head from "next/head";
import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  Calculator,
  TrendingUp,
  Rocket,
  Info,
  User,
  Mail,
  CheckCircle,
  Lock,
  Cpu,
  AlertCircle,
  FileText,
  BarChart3,
  X,
  ArrowRight,
  Zap,
} from "lucide-react";

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

/* ── Constants ── */
const MIN_INVESTMENT = 5000;
const IPO_MULTIPLIER = 1.5; // $1T → $1.5T = 1.5×
const CURRENCY = "USD";

const fmt = (v) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(v);

/* ── Success Modal ── */
function SuccessModal({ name, amount, onClose }) {
  const ipoValue = amount * IPO_MULTIPLIER;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-700/60 rounded-3xl shadow-2xl overflow-hidden">

        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="relative p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-3 uppercase tracking-widest">
              Interest Registered
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Welcome aboard, {name.split(" ")[0]}.
            </h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Your allocation interest has been logged. Our team will reach out with priority onboarding details.
            </p>
          </div>

          {/* Indicative Summary */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 mb-5 space-y-3">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">
              Your Indicative Summary
            </p>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Nominal Investment</span>
              <span className="text-sm font-black text-white">{fmt(amount)}</span>
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
              <span className="text-xl font-black text-emerald-400">{fmt(ipoValue)}</span>
            </div>
          </div>

          {/* Next Steps */}
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
                  <ArrowRight size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a
              href="/research"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest text-center transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={13} /> Read the Research Report
            </a>
            <button
              onClick={onClose}
              className="w-full py-3 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Close
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-600 mt-4 leading-relaxed">
            * Estimated IPO value is indicative only, based on the $1.5T target announced by public media sources. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function Home() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Form state
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success modal state — stores submitted data so modal can display it
  const [successData, setSuccessData] = useState(null); // null = hidden

  const [leads, setLeads] = useState([]);

  /* Auth */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth).catch(console.error);
    });
    return () => unsub();
  }, []);

  /* Admin snapshot */
  useEffect(() => {
    if (!user || !isAdmin) return;
    const q = query(collection(db, "spacex_leads"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setLeads(data);
    });
    return () => unsub();
  }, [user, isAdmin]);

  const numericAmount = parseFloat(amount) || 0;
  const projectedValue = numericAmount * IPO_MULTIPLIER;
  const amountValid = numericAmount >= MIN_INVESTMENT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!amountValid) {
      alert(`Minimum investment is ${fmt(MIN_INVESTMENT)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "spacex_leads"), {
        productName: "SpaceX + xAI Frontier Token",
        userName: name,
        email: email,
        amount: numericAmount,
        timestamp: serverTimestamp(),
        userId: user.uid,
      });
      // Show success modal with submitted values
      setSuccessData({ name, amount: numericAmount });
      // Reset form
      setAmount("");
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Firestore error:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userView = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in duration-700">
      {/* Left column */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
            <Rocket size={240} />
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-4 uppercase tracking-widest">
            Priority Series I
          </span>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            SpaceX + xAI Frontier Token
          </h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Gain exclusive equity exposure to the SpaceX-xAI ecosystem. This tokenization series
            provides a direct stake in the world's dominant orbital infrastructure and frontier
            artificial intelligence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900 rounded-2xl text-white">
              <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest mb-1">Valuation</p>
              <p className="text-2xl font-bold">$1 Trillion</p>
            </div>
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-[10px] font-bold uppercase text-indigo-600 tracking-widest mb-1">Status</p>
              <p className="text-2xl font-bold text-indigo-700">Pre-IPO Series</p>
            </div>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest mb-1">Backlog</p>
              <p className="text-2xl font-bold text-emerald-700">$22 Billion+</p>
            </div>
          </div>
        </div>

        {/* Research Report Banner */}
        <a
          href="/research"
          className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl px-8 py-5 border border-indigo-800/50 hover:border-indigo-500 transition-all group shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600/30 p-3 rounded-xl">
              <FileText size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest mb-0.5">Analyst Research</p>
              <p className="font-black text-white text-lg tracking-tight">SpaceX Pre-IPO Investment Brief</p>
              <p className="text-slate-400 text-xs mt-0.5">Financials · Valuation · Bull &amp; Bear · IPO Timeline</p>
            </div>
          </div>
          <div className="text-indigo-400 group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </div>
        </a>

        {/* Investment Thesis */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Info size={24} className="text-indigo-400" /> Investment Thesis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase text-xs tracking-widest">
                <Cpu size={18} /> Vertical AI Synergy
              </div>
              <p className="text-sm text-indigo-100/70 leading-relaxed">
                Exposure to the xAI/SpaceX merger. Own a stake in the infrastructure powering the
                next generation of orbital data intelligence.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase text-xs tracking-widest">
                <TrendingUp size={18} /> Starship Dominance
              </div>
              <p className="text-sm text-indigo-100/70 leading-relaxed">
                SpaceX commands over 85% of global launch mass. With Starship fully operational,
                the company has effectively commoditized access to space.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column — IPO Simulator form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden sticky top-6">
          <div className="bg-slate-900 p-6 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calculator size={20} className="text-indigo-400" /> IPO Simulator
            </h3>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">
              Indicative 2026 Listing Value
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Amount input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Indicative Nominal (USD)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  required
                  min={MIN_INVESTMENT}
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 w-full rounded-2xl border-slate-100 border-2 p-4 text-2xl font-black focus:border-indigo-500 outline-none transition-all"
                  placeholder="5000"
                />
              </div>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <AlertCircle size={10} /> Minimum Allocation: {fmt(MIN_INVESTMENT)}
              </p>
            </div>

            {/* Estimated IPO value */}
            <div className="bg-indigo-50/50 rounded-2xl p-5 border-2 border-dashed border-indigo-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">
                  Estimated IPO Value
                </span>
                <span className={`text-2xl font-black ${amountValid ? "text-indigo-700" : "text-slate-300"}`}>
                  {fmt(projectedValue)}
                </span>
              </div>
              <div className="h-px bg-indigo-100" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Your Nominal</span>
                <span className="text-sm font-bold text-slate-500">{amountValid ? fmt(numericAmount) : "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Target Multiple</span>
                <span className="text-sm font-bold text-slate-500">{IPO_MULTIPLIER}× ($1T → $1.5T)</span>
              </div>
              <p className="text-[10px] text-slate-400 italic pt-1">
                * Disclaimer: $1.5T target is announced by public media sources. Indicative only.
              </p>
            </div>

            {/* Name */}
            <div className="space-y-4">
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  placeholder="Full Name"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  placeholder="Email Address"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !user}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Interest"}
            </button>

            <p className="text-center text-[10px] text-slate-400 leading-relaxed">
              By submitting you agree this is an indication of interest only and does not constitute a binding commitment.
            </p>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>NanoFrontier · SpaceX + xAI Frontier Token</title>
        <meta name="description" content="Register your interest in the SpaceX + xAI Frontier Token. Pre-IPO Series." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
        {/* Nav */}
        <nav className="bg-white border-b sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <TrendingUp size={20} />
            </div>
            <span className="font-black text-xl uppercase tracking-tighter">
              Nano<span className="text-indigo-600">Frontier</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/research"
              className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
            >
              <BarChart3 size={12} /> Research Report
            </a>
            <span className={`text-[10px] font-bold ${user ? "text-emerald-500" : "text-orange-400"}`}>
              ● {user ? "CONNECTED" : "CONNECTING"}
            </span>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              <Lock size={12} className="inline mr-1" />
              {isAdmin ? "Dashboard" : "Admin"}
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12">
          {isAdmin ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-black uppercase tracking-tight">Demand Tracker</h2>
                <button
                  onClick={() => setIsAdmin(false)}
                  className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase"
                >
                  Exit Admin
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border-2 border-slate-100">
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Volume</p>
                  <h3 className="text-4xl font-black text-indigo-600 mt-2">
                    {fmt(leads.reduce((acc, l) => acc + (Number(l.amount) || 0), 0))}
                  </h3>
                </div>
                <div className="bg-white p-8 rounded-3xl border-2 border-slate-100">
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Interested Parties</p>
                  <h3 className="text-4xl font-black text-slate-900 mt-2">{leads.length}</h3>
                </div>
              </div>
              <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="p-6">Investor</th>
                      <th className="p-6">Email</th>
                      <th className="p-6 text-right">Commitment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="p-6 font-bold">{l.userName}</td>
                        <td className="p-6 text-slate-500">{l.email}</td>
                        <td className="p-6 text-right font-black text-indigo-600">{fmt(l.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            userView
          )}
        </main>

        {/* Admin Password Modal */}
        {showPasswordModal && !isAdmin && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
              <h3 className="font-black text-xl mb-2">Access Portal</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Authentication required for demand analytics.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (passwordInput === "spacex2026") {
                    setIsAdmin(true);
                    setShowPasswordModal(false);
                    setPasswordInput("");
                    setPasswordError(false);
                  } else {
                    setPasswordError(true);
                  }
                }}
                className="space-y-4"
              >
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  className="w-full border-2 rounded-xl p-4 outline-none font-mono"
                  placeholder="••••••••"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">
                    Invalid Key
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowPasswordModal(false); setPasswordInput(""); setPasswordError(false); }}
                    className="flex-1 py-3 font-bold text-slate-400 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm"
                  >
                    Verify
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {successData && (
          <SuccessModal
            name={successData.name}
            amount={successData.amount}
            onClose={() => setSuccessData(null)}
          />
        )}
      </div>
    </>
  );
}
