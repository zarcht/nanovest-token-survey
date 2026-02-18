import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
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

// --- Configuration & Product Details ---
const PRODUCT_DETAILS = {
  name: "SpaceX + xAI Frontier Token",
  description: "Direct equity exposure to the world's most valuable private innovation engine. This offering tokenizes shares in the unified SpaceX-xAI ecosystem, combining dominant orbital infrastructure with next-generation frontier artificial intelligence.",
  currentValuation: "$1 Trillion",
  revenueBacklog: "$22 Billion+",
  tenor: "Pre-IPO Series",
  minInvestment: 1000,
  currency: "USD"
};

// --- Firebase Setup ---
let db, auth;
const configSource = process.env.REACT_APP_FIREBASE_CONFIG || "{}";
try {
  const firebaseConfig = JSON.parse(configSource);
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.warn("Firebase config error:", e);
}

const appId = 'spacex-token-survey-2026';

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

  // Auth Initialization
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, setUser);
    signInAnonymously(auth).catch(() => {});
    return () => unsubscribe();
  }, []);

  // Fetch Leads
  useEffect(() => {
    if (!user || !db) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'spacex_demand_leads'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      leadsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setLeads(leadsData);
    });
    return () => unsubscribe();
  }, [user]);

  const numericAmount = Number(amount) || 0;
  // Simulator: Showing potential at a $1.5T indicative target (50% upside from current $1T)
  const projectedIpoValue = numericAmount * 1.50;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: PRODUCT_DETAILS.currency,
    maximumFractionDigits: 0 
  }).format(val);

  const handleAdminClick = () => {
    if (isAdmin) setIsAdmin(false);
    else {
      setShowPasswordModal(true);
      setPasswordInput('');
      setPasswordError(false);
    }
  };

  const verifyPassword = (e) => {
    e.preventDefault();
    if (passwordInput === 'spacex2026') {
      setIsAdmin(true);
      setShowPasswordModal(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !db) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'spacex_demand_leads'), {
        productName: PRODUCT_DETAILS.name,
        userName: name,
        email: email,
        subscriptionAmount: numericAmount,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVolume = leads.reduce((acc, curr) => acc + (Number(curr.subscriptionAmount) || 0), 0);

  const userView = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left Column: Product Info */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -top-6 -right-6 opacity-[0.03] rotate-12">
            <Rocket size={200} />
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white mb-4 uppercase tracking-tighter">
            Limited Series I Exposure
          </span>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{PRODUCT_DETAILS.name}</h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">{PRODUCT_DETAILS.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
              <div className="flex items-center gap-2 opacity-60 mb-1">
                <BarChart3 size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Valuation</span>
              </div>
              <div className="text-2xl font-bold">{PRODUCT_DETAILS.currentValuation}</div>
            </div>
            <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Zap size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Stage</span>
              </div>
              <div className="text-2xl font-bold text-indigo-700">{PRODUCT_DETAILS.tenor}</div>
            </div>
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Globe size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Backlog</span>
              </div>
              <div className="text-2xl font-bold text-emerald-700">{PRODUCT_DETAILS.revenueBacklog}</div>
            </div>
          </div>
        </div>

        {/* USP Section */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Info size={24} className="text-indigo-400" /> Investment Thesis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase text-xs tracking-widest">
                <Cpu size={18} /> Vertical AI Synergy
              </div>
              <p className="text-sm text-indigo-100/70 leading-relaxed">Exposure to the xAI/SpaceX merger. Own a stake in the infrastructure powering the next generation of orbital data intelligence.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase text-xs tracking-widest">
                <TrendingUp size={18} /> Secondary Liquidity
              </div>
              <p className="text-sm text-indigo-100/70 leading-relaxed">Our tokenized structure aims to provide secondary market liquidity before the projected mid-2026 public listing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Simulator & Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden sticky top-6">
          <div className="bg-slate-900 p-6 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calculator size={20} className="text-indigo-400" /> IPO Target Simulator
            </h3>
            <p className="text-slate-400 text-xs mt-1 uppercase font-semibold tracking-wider">Estimate 2026 Listing Value</p>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Intended Investment ({PRODUCT_DETAILS.currency})</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold">$</span>
                  <input type="number" required min={PRODUCT_DETAILS.minInvestment} value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-8 w-full rounded-xl border-slate-200 border-2 p-4 text-2xl font-black focus:border-indigo-500 focus:ring-0 transition-all outline-none" placeholder="5000" />
                </div>
              </div>

              <div className="bg-indigo-50/50 rounded-xl p-5 border-2 border-dashed border-indigo-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Est. IPO Value</span>
                  <span className="text-2xl font-black text-indigo-700">{formatCurrency(projectedIpoValue)}</span>
                </div>
                <div className="mt-3 flex gap-2 items-start opacity-70">
                  <AlertCircle size={12} className="shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    <strong>Disclaimer:</strong> The $1.5 Trillion target is indicative based on current market reports and analyst projections. This is not a fixed or guaranteed valuation.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="pl-12 w-full rounded-lg border border-slate-200 p-3.5 text-sm focus:border-indigo-500 outline-none" placeholder="Full Name" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 w-full rounded-lg border border-slate-200 p-3.5 text-sm focus:border-indigo-500 outline-none" placeholder="Email Address" />
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting || numericAmount < PRODUCT_DETAILS.minInvestment} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 uppercase tracking-widest text-sm">
                {isSubmitting ? 'Registering...' : 'Submit Interest'}
              </button>
              <p className="text-center text-[10px] text-slate-400 font-bold">MINIMUM ALLOCATION: {formatCurrency(PRODUCT_DETAILS.minInvestment)}</p>
            </form>
          ) : (
            <div className="p-10 text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Success</h3>
                <p className="text-slate-500 mt-2">Your expression of interest for {formatCurrency(numericAmount)} has been recorded.</p>
              </div>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 text-sm font-bold hover:underline">Submit another interest</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 selection:bg-indigo-100">
      <nav className="bg-white border-b sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg"><TrendingUp size={24} /></div>
            <span className="font-black text-2xl tracking-tighter uppercase">Nanovest <span className="text-indigo-600">Frontier</span></span>
          </div>
          <button onClick={handleAdminClick} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 uppercase tracking-widest">
            <Lock size={12} /> {isAdmin ? 'Exit Dashboard' : 'Admin Login'}
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-12">
        {isAdmin ? (
          <div className="space-y-6 animate-fade-in">
             <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900">Interest Tracker</h2>
              <div className="bg-white px-4 py-2 rounded-lg border font-bold text-sm text-slate-600">Admin Mode</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-100">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Total Demand Volume</p>
                <h3 className="text-4xl font-black text-indigo-600 mt-2">{formatCurrency(totalVolume)}</h3>
              </div>
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-100">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Unique Interest Forms</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">{leads.length}</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Investor</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-right">Commitment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{lead.userName}</td>
                      <td className="px-6 py-4 text-slate-500">{lead.email}</td>
                      <td className="px-6 py-4 text-right font-black text-indigo-600">{formatCurrency(lead.subscriptionAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : userView}
      </main>
      
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-200">
            <h3 className="font-black text-xl mb-2">Internal Access</h3>
            <p className="text-xs text-slate-500 mb-6">Enter credentials to view demand analytics.</p>
            <form onSubmit={verifyPassword} className="space-y-4">
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border-2 rounded-xl p-4 focus:border-indigo-500 outline-none font-mono" placeholder="••••••••" autoFocus />
              {passwordError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">Invalid Password</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 font-bold text-slate-400 text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
