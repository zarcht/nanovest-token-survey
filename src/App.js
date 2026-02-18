import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  Calculator, 
  TrendingUp, 
  Rocket, 
  Info, 
  User, 
  Mail, 
  CheckCircle, 
  BarChart3, 
  Globe,
  Lock,
  Cpu,
  Zap,
  AlertCircle
} from 'lucide-react';

// --- Configuration ---
const PRODUCT_DETAILS = {
  name: "SpaceX + xAI Frontier Token",
  description: "Gain exclusive equity exposure to the SpaceX-xAI ecosystem. This tokenization series provides a direct stake in the world's dominant orbital infrastructure and frontier artificial intelligence.",
  currentValuation: "$1 Trillion",
  revenueBacklog: "$22 Billion+",
  tenor: "Pre-IPO Series",
  minInvestment: 5000,
  currency: "USD"
};

const firebaseConfig = {
  apiKey: "AIzaSyBYbnjtOoQZp43z_aiKnVMAKtOcUw9EXxU",
  authDomain: "nano-token-survey.firebaseapp.com",
  projectId: "nano-token-survey",
  storageBucket: "nano-token-survey.firebasestorage.app",
  messagingSenderId: "294925629622",
  appId: "1:294925629622:web:42448455940d855c194e17"
};

// Initialize
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Form State
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leads, setLeads] = useState([]);

  // Auth Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });
    return () => unsubscribe();
  }, []);

  // Admin Data Sync
  useEffect(() => {
    if (!user || !db || !isAdmin) return;
    const q = query(collection(db, "spacex_leads"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      leadsData.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setLeads(leadsData);
    });
    return () => unsubscribe();
  }, [user, isAdmin]);

  const numericAmount = Number(amount) || 0;
  const projectedIpoValue = numericAmount * 1.50;
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: PRODUCT_DETAILS.currency,
    maximumFractionDigits: 0 
  }).format(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !db) return;
    if (numericAmount < PRODUCT_DETAILS.minInvestment) {
      alert(`Min investment is ${formatCurrency(PRODUCT_DETAILS.minInvestment)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "spacex_leads"), {
        productName: PRODUCT_DETAILS.name,
        userName: name,
        email: email,
        amount: numericAmount,
        timestamp: serverTimestamp(),
        userId: user.uid
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Submission failed. Check Firestore Rules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userView = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in duration-700">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
            <Rocket size={240} />
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-4 uppercase tracking-widest">
            Priority Series I
          </span>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{PRODUCT_DETAILS.name}</h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">{PRODUCT_DETAILS.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900 rounded-2xl text-white">
              <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest mb-1">Valuation</p>
              <p className="text-2xl font-bold">{PRODUCT_DETAILS.currentValuation}</p>
            </div>
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-[10px] font-bold uppercase text-indigo-600 tracking-widest mb-1">Status</p>
              <p className="text-2xl font-bold text-indigo-700">{PRODUCT_DETAILS.tenor}</p>
            </div>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest mb-1">Backlog</p>
              <p className="text-2xl font-bold text-emerald-700">{PRODUCT_DETAILS.revenueBacklog}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-indigo-400">
            <Info size={20} /> Investment Thesis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-indigo-300 font-bold uppercase text-xs tracking-tighter">
                <Cpu size={16} /> xAI/SpaceX Synergy
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">Direct exposure to the merger of orbital infrastructure and frontier AGI. Powering the Grok-Starlink intelligence mesh.</p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-indigo-300 font-bold uppercase text-xs tracking-tighter">
                <TrendingUp size={16} /> Secondary Liquidity
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">Tokenized equity structure aims to provide secondary market windows ahead of the projected mid-2026 IPO.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden sticky top-6">
          <div className="bg-slate-900 p-6 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calculator size={20} className="text-indigo-400" /> IPO Simulator
            </h3>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">Indicative 2026 Listing Value</p>
          </div>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Intended Investment ({PRODUCT_DETAILS.currency})</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold">$</span>
                  <input type="number" required min={PRODUCT_DETAILS.minInvestment} value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-8 w-full rounded-2xl border-slate-100 border-2 p-4 text-2xl font-black focus:border-indigo-500 outline-none transition-all" placeholder="5000" />
                </div>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1">
                  <AlertCircle size={10} /> Minimum Allocation: {formatCurrency(PRODUCT_DETAILS.minInvestment)}
                </p>
              </div>

              <div className="bg-indigo-50/50 rounded-2xl p-5 border-2 border-dashed border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Target Value</span>
                  <span className="text-2xl font-black text-indigo-700">{formatCurrency(projectedIpoValue)}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 italic">* Disclaimer: $1.5T target is an indicative projection based on market data.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="pl-12 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 outline-none" placeholder="Full Name" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-indigo-500 outline-none" placeholder="Email Address" />
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs">
                {isSubmitting ? 'Transmitting...' : 'Submit Interest'}
              </button>
            </form>
          ) : (
            <div className="p-10 text-center space-y-6 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Success</h3>
              <p className="text-slate-500 text-sm">Your interest has been logged. Our team will contact you with priority details.</p>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 text-xs font-bold uppercase tracking-widest hover:underline">New Entry</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><TrendingUp size={20}/></div>
           <span className="font-black text-xl uppercase tracking-tighter">Nano<span className="text-indigo-600">Frontier</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-[10px] font-bold ${user ? 'text-emerald-500' : 'text-orange-400'}`}>
            ● {user ? 'CONNECTED' : 'CONNECTING'}
          </span>
          <button onClick={() => setShowPasswordModal(true)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
            <Lock size={12} className="inline mr-1" /> {isAdmin ? 'Dashboard' : 'Admin'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {isAdmin ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
               <h2 className="text-3xl font-black uppercase tracking-tight">Demand Tracker</h2>
               <button onClick={() => setIsAdmin(false)} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase">Exit Admin</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border-2 border-slate-100">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Volume</p>
                <h3 className="text-4xl font-black text-indigo-600 mt-2">{formatCurrency(leads.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0))}</h3>
              </div>
              <div className="bg-white p-8 rounded-3xl border-2 border-slate-100">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Interested Parties</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">{leads.length}</h3>
              </div>
            </div>
            <div className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                  <tr><th className="p-6">Investor</th><th className="p-6 text-right">Commitment</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50"><td className="p-6 font-bold">{l.userName}</td><td className="p-6 text-right font-black text-indigo-600">{formatCurrency(l.amount)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : userView}
      </main>

      {showPasswordModal && !isAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h3 className="font-black text-xl mb-2">Access Portal</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Authentication required for demand analytics.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === 'spacex2026') { setIsAdmin(true); setShowPasswordModal(false); }
              else setPasswordError(true);
            }} className="space-y-4">
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border-2 rounded-xl p-4 outline-none font-mono" placeholder="••••••••" autoFocus />
              {passwordError && <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">Invalid Key</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 font-bold text-slate-400 text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">Verify</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
