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
  Zap
} from 'lucide-react';

// --- Configuration & Product Details ---
const PRODUCT_DETAILS = {
  name: "SpaceX + xAI Frontier Fund",
  description: "Exclusive exposure to the newly merged SpaceX-xAI entity. This offering tokenizes equity in the world's largest private innovation engine, combining dominant orbital launch infrastructure with frontier artificial intelligence.",
  valuation: "$1.25 Trillion",
  revenueBacklog: "$22 Billion+",
  tenor: "Pre-IPO Series",
  historicalCAGR: 470, // Exceptional growth due to 2025-2026 valuation jump
  minInvestment: 1000,
  currency: "USD"
};

// --- Firebase Setup (Same as previous) ---
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

const appId = 'spacex-token-survey';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, setUser);
    signInAnonymously(auth).catch(() => {});
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'product_demand_leads'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      leadsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setLeads(leadsData);
    });
    return () => unsubscribe();
  }, [user]);

  const numericAmount = Number(amount) || 0;
  // Equity Simulator: Showing 2026 IPO Target Value ($1.5T Target / $1.25T Current = 20% Upside)
  const projectedIpoValue = numericAmount * 1.20;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: PRODUCT_DETAILS.currency,
    maximumFractionDigits: 0 
  }).format(val);

  const handleAdminClick = () => {
    if (isAdmin) setIsAdmin(false);
    else setShowPasswordModal(true);
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
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'product_demand_leads'), {
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
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Rocket size={120} />
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 mb-3 uppercase tracking-wider">
            Historic Merger Access
          </span>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{PRODUCT_DETAILS.name}</h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">{PRODUCT_DETAILS.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 rounded-xl text-white">
              <div className="flex items-center gap-2 opacity-70 mb-1">
                <BarChart3 size={16} /> <span className="text-xs font-semibold uppercase">Valuation</span>
              </div>
              <div className="text-xl font-bold">{PRODUCT_DETAILS.valuation}</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Zap size={16} /> <span className="text-xs font-semibold uppercase">1-Yr Growth</span>
              </div>
              <div className="text-xl font-bold text-indigo-700">+{PRODUCT_DETAILS.historicalCAGR}%</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Globe size={16} /> <span className="text-xs font-semibold uppercase">Contracts</span>
              </div>
              <div className="text-xl font-bold text-emerald-700">{PRODUCT_DETAILS.revenueBacklog}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Info size={24} className="text-indigo-400" /> Strategic USPs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <Cpu size={18} /> xAI Integration
              </div>
              <p className="text-sm text-indigo-100/80">Direct exposure to the xAI/SpaceX merger. Gain stake in orbital AI data centers and Grok-integrated Starlink V3.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <Rocket size={18} /> IPO Fast-Track
              </div>
              <p className="text-sm text-indigo-100/80">Locked entry at the $1.25T valuation before the targeted mid-2026 IPO at $1.5T+.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden sticky top-6">
          <div className="bg-slate-900 p-6 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calculator size={20} className="text-indigo-400" /> IPO Target Simulator
            </h3>
            <p className="text-slate-400 text-sm mt-1">Estimate your position value for the 2026 IPO.</p>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Investment Interest (Min. {formatCurrency(PRODUCT_DETAILS.minInvestment)})</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold">$</span>
                  <input type="number" required min={PRODUCT_DETAILS.minInvestment} value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-8 w-full rounded-xl border-slate-200 border-2 p-4 text-2xl font-black focus:border-indigo-500 focus:ring-0 transition-all" placeholder="5000" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border-2 border-dashed border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Est. IPO Value</span>
                  <span className="text-2xl font-black text-indigo-600">{formatCurrency(projectedIpoValue)}</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-2">Based on $1.5T IPO Target Price</div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="pl-12 w-full rounded-lg border border-slate-200 p-3.5 text-sm focus:border-indigo-500 outline-none" placeholder="Full Name" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 w-full rounded-lg border border-slate-200 p-3.5 text-sm focus:border-indigo-500 outline-none" placeholder="Work Email Address" />
                </div>
              </div>
              
              <button type="submit" disabled={isSubmitting || numericAmount < PRODUCT_DETAILS.minInvestment} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 uppercase tracking-widest text-sm">
                {isSubmitting ? 'Processing...' : 'Secure Early Access'}
              </button>
            </form>
          ) : (
            <div className="p-10 text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Priority Reserved</h3>
                <p className="text-slate-500 mt-2">We've logged your {formatCurrency(numericAmount)} allocation request. Our desk will contact you shortly.</p>
              </div>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 text-sm font-bold hover:underline">Register another entity</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 selection:bg-indigo-100">
      <nav className="bg-white border-b sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg text-white shadow-lg"><TrendingUp size={24} /></div>
            <span className="font-black text-2xl tracking-tighter uppercase">Frontier Series <span className="text-indigo-600">I</span></span>
          </div>
          <button onClick={handleAdminClick} className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
            <Lock size={12} /> {isAdmin ? 'DASHBOARD' : 'INTERNAL USE'}
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-12">
        {isAdmin ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900">Demand Dashboard</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Committed</p>
                <h3 className="text-4xl font-black text-indigo-600 mt-2">{formatCurrency(totalVolume)}</h3>
              </div>
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Entities</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">{leads.length}</h3>
              </div>
            </div>
            {/* Table UI... (similar to previous) */}
          </div>
        ) : userView}
      </main>
      
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-200">
            <h3 className="font-black text-xl mb-2">Internal Access</h3>
            <form onSubmit={verifyPassword} className="space-y-4">
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border-2 rounded-xl p-4 focus:border-indigo-500 outline-none font-mono" placeholder="••••••••" autoFocus />
              {passwordError && <p className="text-red-500 text-xs font-bold">Access Denied</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 font-bold text-slate-400">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
