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

const PRODUCT_DETAILS = {
  name: "SpaceX + xAI Frontier Token",
  description: "Exclusive equity exposure to the SpaceX-xAI ecosystem. This tokenization series provides a direct stake in orbital launch dominance and frontier artificial intelligence.",
  currentValuation: "$1 Trillion",
  revenueBacklog: "$22 Billion+",
  tenor: "Pre-IPO Series",
  minInvestment: 5000,
  currency: "USD"
};

// --- Firebase Setup ---
import { initializeApp, getApps } from 'firebase/app'; // Add getApps to imports

let db, auth;

const firebaseConfig = {
  apiKey: "AIzaSyBYbnjtOoQZp43z_aiKnVMAKtOcUw9EXxU",
  authDomain: "nano-token-survey.firebaseapp.com",
  projectId: "nano-token-survey",
  storageBucket: "nano-token-survey.firebasestorage.app",
  messagingSenderId: "294925629622",
  appId: "1:294925629622:web:42448455940d855c194e17"
};

try {
  // Check if an app is already initialized to avoid "Duplicate App" errors
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully with Project: nano-token-survey");
} catch (e) {
  console.error("Firebase initialization error:", e);
}

const appId = 'spacex-token-survey-2026';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    if (!auth) return;
    onAuthStateChanged(auth, setUser);
    signInAnonymously(auth).catch((err) => console.error("Auth Error:", err));
  }, []);

  useEffect(() => {
    if (!user || !db || !isAdmin) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'spacex_demand_leads'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadsData);
    });
    return () => unsubscribe();
  }, [user, isAdmin]);

  const numericAmount = Number(amount) || 0;
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: PRODUCT_DETAILS.currency, maximumFractionDigits: 0 }).format(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit triggered with:", { name, email, amount });

    // 1. Manual Validation Check
    if (numericAmount < PRODUCT_DETAILS.minInvestment) {
      alert(`Minimum investment is ${formatCurrency(PRODUCT_DETAILS.minInvestment)}. Please adjust your amount.`);
      return;
    }

    if (!db) {
      alert("Database connection not established. Check your Firebase Config.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 2. Attempt Database Write
      const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'spacex_demand_leads'), {
        productName: PRODUCT_DETAILS.name,
        userName: name,
        email: email,
        subscriptionAmount: numericAmount,
        createdAt: serverTimestamp()
      });
      
      console.log("Document written with ID: ", docRef.id);
      setSubmitted(true);
    } catch (error) {
      console.error("Database Write Error:", error);
      alert("Submission failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const userView = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Product Details Section */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white mb-4 uppercase tracking-widest">
            Series I Priority Access
          </span>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{PRODUCT_DETAILS.name}</h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">{PRODUCT_DETAILS.description}</p>
          
          <div className="grid grid-cols-3 gap-4">
             <div className="p-4 bg-slate-900 rounded-xl text-white">
                <p className="text-[10px] uppercase opacity-50 font-bold">Valuation</p>
                <p className="text-xl font-bold">{PRODUCT_DETAILS.currentValuation}</p>
             </div>
             <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[10px] uppercase text-indigo-600 font-bold">Backlog</p>
                <p className="text-xl font-bold text-indigo-700">{PRODUCT_DETAILS.revenueBacklog}</p>
             </div>
             <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-[10px] uppercase text-emerald-600 font-bold">Minimum</p>
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(PRODUCT_DETAILS.minInvestment)}</p>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">
           <h3 className="font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-indigo-400">The Frontier Advantage</h3>
           <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                 <p className="font-bold text-white flex items-center gap-2"><Cpu size={14}/> xAI + SpaceX</p>
                 <p className="text-slate-400">Exposure to the combined growth of orbital launch and AGl.</p>
              </div>
              <div className="space-y-1">
                 <p className="font-bold text-white flex items-center gap-2"><TrendingUp size={14}/> IPO Ready</p>
                 <p className="text-slate-400">Positioned for the expected 2026 public listing.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="bg-slate-900 p-6 text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <Rocket size={18} className="text-indigo-400" /> Expression of Interest
          </div>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase">Intended Investment ({PRODUCT_DETAILS.currency})</label>
                <input 
                  type="number" 
                  required 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="w-full rounded-xl border-2 border-slate-100 p-4 text-2xl font-black focus:border-indigo-500 outline-none transition-all" 
                  placeholder="5000" 
                />
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest px-1">
                  Min. Allocation: {formatCurrency(PRODUCT_DETAILS.minInvestment)}
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="pl-12 w-full rounded-lg border border-slate-200 p-3.5 text-sm outline-none focus:border-indigo-500" placeholder="Full Name" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-4 text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 w-full rounded-lg border border-slate-200 p-3.5 text-sm outline-none focus:border-indigo-500" placeholder="Email Address" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-[10px] text-slate-500 italic">
                * By submitting, you acknowledge that the $1.5T IPO valuation target is an indicative projection based on market data.
              </div>
              
              <button 
                type="submit" 
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
              >
                {isSubmitting ? 'Transmitting...' : 'Submit Interest'}
              </button>
            </form>
          ) : (
            <div className="p-10 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Success</h3>
              <p className="text-slate-500 text-sm">Your interest has been logged. Our team will be in touch with Series I details.</p>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 text-xs font-bold uppercase hover:underline">New Entry</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="font-black text-xl uppercase tracking-tighter">Nano<span className="text-indigo-600">Frontier</span></div>
        <button onClick={() => setShowPasswordModal(true)} className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
          <Lock size={10}/> Admin
        </button>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-12">
        {isAdmin ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-black">Responses ({leads.length})</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400">
                    <tr><th className="p-4">Name</th><th className="p-4">Amount</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {leads.map(l => (
                      <tr key={l.id}><td className="p-4 font-bold">{l.userName}</td><td className="p-4 text-indigo-600 font-black">{formatCurrency(l.subscriptionAmount)}</td></tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        ) : userView}
      </main>

      {/* Admin Login Modal */}
      {showPasswordModal && !isAdmin && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
             <h3 className="font-bold mb-4">Admin Access</h3>
             <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border p-3 rounded-lg mb-4 outline-none focus:border-indigo-600" placeholder="Password" />
             <div className="flex gap-2">
                <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-2 text-slate-400 font-bold">Cancel</button>
                <button onClick={() => { if(passwordInput === 'spacex2026') setIsAdmin(true); setShowPasswordModal(false); }} className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-bold">Verify</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

