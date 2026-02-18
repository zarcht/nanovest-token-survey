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
  description: "Exclusive equity exposure to the SpaceX-xAI ecosystem. This tokenization series provides a direct stake in orbital launch dominance and frontier artificial intelligence.",
  currentValuation: "$1 Trillion",
  revenueBacklog: "$22 Billion+",
  tenor: "Pre-IPO Series",
  minInvestment: 5000, // Updated to 5k
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
  console.warn("Firebase config error: Check environment variables.", e);
}

const appId = 'spacex-token-survey-2026';

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
    signInAnonymously(auth).catch((err) => console.error("Auth Error:", err));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db || !isAdmin) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'spacex_demand_leads'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      leadsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
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
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'spacex_demand_leads'), {
        productName: PRODUCT_DETAILS.name,
        userName: name,
        email: email,
        subscriptionAmount: numericAmount,
        status: 'pending_review',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setAmount('');
      setName('');
      setEmail('');
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) setIsAdmin(false);
    else setShowPasswordModal(true);
  };

  const userView = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Product Content */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
            <Rocket size={240} />
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-4 uppercase tracking-widest">
            Series I Priority Access
          </span>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{PRODUCT_DETAILS.name}</h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">{PRODUCT_DETAILS.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900 rounded-xl text-white">
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

        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Info size={24} className="text-indigo-400" /> Strategic Thesis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase text-xs tracking-widest">
                <Cpu size={18} /> xAI/SpaceX Synergy
              </div>
              <p className="text-sm text-indigo-100/70 leading-relaxed">Exposure to the xAI/SpaceX conglomerate. Stake in the infrastructure powering Grok-Starlink intelligence.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase text-xs tracking-widest">
                <TrendingUp size={18} /> IPO Trajectory
              </div>
              <p className="text-sm text-indigo-100/70 leading-relaxed">Anticipated mid-2026 public listing at a projected $1.5T valuation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator & Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden sticky top-6">
          <div className="bg-slate-900 p-6 text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calculator size={20} className="text-indigo-400" /> IPO Simulator
            </h3>
            <p className="text-slate-400 text-xs mt-1 uppercase font-semibold tracking-wider">Projected Listing Value</p>
          </div>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-tight">Intended Investment ({PRODUCT_DETAILS.currency})</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold">$</span>
                  <input type="number" required min={PRODUCT_DETAILS.minInvestment} value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-8 w-full rounded-xl border-slate-200 border-2 p-4 text-2xl font-black focus:border-indigo-500 outline-none" placeholder="5000" />
                </div>
                {/* Placement update: Minimum allocation notice below input */}
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1">
                  <AlertCircle size={10} className="text-indigo-600" /> 
                  Minimum Allocation: {formatCurrency(PRODUCT_DETAILS.minInvestment)}
                </p>
              </div>

              <div className="bg-indigo-50/50 rounded-xl p-5 border-2 border-dashed border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-indigo-600 font-bold uppercase tracking-widest">Target Value</span>
                  <span className="text-2xl font-black text-indigo-700">{formatCurrency(projectedIpoValue)}</span>
                </div>
                <div className="mt-3 opacity-70">
                  <p className="text-[10px] text-slate-500 leading-tight italic">
                    * Disclaimer: $1.5 Trillion is an indicative news-driven target and not a fixed valuation.
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
            </form>
          ) : (
            <div className="p-10 text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Interest Recorded</h3>
                <p className="text-slate-500 mt-2 text-sm">Your data has been successfully transmitted to the Frontier desk.</p>
              </div>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 text-xs font-bold uppercase tracking-widest hover:underline">
                Submit another response
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg"><TrendingUp size={24} /></div>
            <span className="font-black text-2xl tracking-tighter uppercase tracking-wide">Nano<span className="text-indigo-600">Frontier</span></span>
          </div>
          <button onClick={handleAdminClick} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 uppercase tracking-widest">
            <Lock size={12} /> {isAdmin ? 'Exit' : 'Admin'}
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-12">
        {isAdmin ? (
          /* Dashboard Code Remains the Same... */
          <div className="space-y-6">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Interest Tracker</h2>
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 font-black">
                  <div className="text-slate-400 text-[10px] uppercase">Total Commitments</div>
                  <div className="text-4xl text-indigo-600">{formatCurrency(leads.reduce((acc, curr) => acc + (Number(curr.subscriptionAmount) || 0), 0))}</div>
                </div>
                <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 font-black">
                  <div className="text-slate-400 text-[10px] uppercase">Entries</div>
                  <div className="text-4xl text-slate-900">{leads.length}</div>
                </div>
             </div>
             <div className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Investor</th>
                    <th className="px-6 py-4">Contact</th>
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
            <h3 className="font-black text-xl mb-4 tracking-tight">Internal Access</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === 'spacex2026') { setIsAdmin(true); setShowPasswordModal(false); }
              else setPasswordError(true);
            }} className="space-y-4">
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border-2 rounded-xl p-4 outline-none font-mono" placeholder="••••••••" autoFocus />
              {passwordError && <p className="text-red-500 text-[10px] font-black uppercase text-center">Invalid Access Key</p>}
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
