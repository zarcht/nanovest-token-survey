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
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { 
  Calculator, 
  TrendingUp, 
  Clock, 
  Info, 
  User, 
  Mail, 
  DollarSign, 
  CheckCircle, 
  BarChart3, 
  Briefcase,
  Lock,
  Sparkles,
  Copy,
  Loader2,
  X
} from 'lucide-react';

// --- Configuration & Product Details ---
const PRODUCT_DETAILS = {
  name: "Green Energy Infrastructure Bond Series A",
  description: "A secure fixed-income instrument financing renewable solar energy projects in Southeast Asia. This senior secured bond offers stable semi-annual coupon payments and capital protection structure.",
  tenor: "3 Years",
  estimatedReturn: 8.5,
  minInvestment: 5000,
  currency: "USD"
};

// --- Firebase Setup ---
// Safe initialization for Vercel
let db, auth;
try {
  // We use REACT_APP_ prefix for Vercel environment variables
  const configSource = process.env.REACT_APP_FIREBASE_CONFIG || "{}";
  const firebaseConfig = JSON.parse(configSource);
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase config not found. UI will render but database features will be disabled.");
}

const appId = 'default-app-id';

// We name the function "App" so index.js can find it easily
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
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // AI State
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emailDrafts, setEmailDrafts] = useState({});
  const [generatingEmailId, setGeneratingEmailId] = useState(null);
  const [leads, setLeads] = useState([]);

  [cite_start]// Auth Initialization [cite: 22]
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, setUser);
    signInAnonymously(auth).catch(() => {});
    return () => unsubscribe();
  }, []);

  [cite_start]// Fetch Leads [cite: 23, 24]
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
  const annualReturnVal = numericAmount * (PRODUCT_DETAILS.estimatedReturn / 100);
  const totalReturnVal = annualReturnVal * parseInt(PRODUCT_DETAILS.tenor); 
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: PRODUCT_DETAILS.currency }).format(val);

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
    [cite_start]if (passwordInput === 'nano2021') { [cite: 30]
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
      [cite_start]await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'product_demand_leads'), { [cite: 33]
        productName: PRODUCT_DETAILS.name,
        userName: name,
        email: email,
        phone: phone,
        subscriptionAmount: numericAmount,
        estimatedReturn: PRODUCT_DETAILS.estimatedReturn,
        createdAt: serverTimestamp(),
        submitterId: user.uid
      });
      [cite_start]setSubmitted(true); [cite: 34]
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // --- UI Components (Restored original styling) ---

  const adminDashboard = (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          [cite_start]Book Building Dashboard [cite: 51]
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Demand Value</div>
          <div className="text-3xl font-bold text-emerald-600">{formatCurrency(leads.reduce((acc, curr) => acc + (Number(curr.subscriptionAmount) || 0), 0))}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Interested Users</div>
          <div className="text-3xl font-bold text-indigo-600">{leads.length}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Investor Name</th>
              <th className="px-6 py-3 text-right">Committed Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/80">
                <td className="px-6 py-4 font-medium text-slate-800">{lead.userName}</td>
                <td className="px-6 py-4 text-right font-medium text-emerald-700">{formatCurrency(lead.subscriptionAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const userView = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          [cite_start]<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">New Offering [cite: 76]</span>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{PRODUCT_DETAILS.name}</h1>
          [cite_start]<p className="text-slate-600 text-lg mb-8">{PRODUCT_DETAILS.description} [cite: 77]</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-medium text-slate-500">Est. Annual Return</span>
              [cite_start]<div className="text-2xl font-bold text-emerald-600">{PRODUCT_DETAILS.estimatedReturn}% p.a. [cite: 79]</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-medium text-slate-500">Tenor</span>
              [cite_start]<div className="text-2xl font-bold text-slate-800">{PRODUCT_DETAILS.tenor} [cite: 80]</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Calculator size={20} /> Demand Simulator</h3>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">How much would you like to subscribe?</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">$</span>
                  <input type="number" min={PRODUCT_DETAILS.minInvestment} value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7 w-full rounded-lg border-slate-300 border p-3 text-lg font-semibold" placeholder="10000" />
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-emerald-800 font-medium">Est. Annual Return</span>
                  [cite_start]<span className="text-lg font-bold text-emerald-700">{formatCurrency(annualReturnVal)} [cite: 92]</span>
                </div>
              </div>
              <div className="space-y-4">
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" placeholder="Full Name" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" placeholder="Email Address" />
              </div>
              <button type="submit" disabled={isSubmitting || numericAmount < PRODUCT_DETAILS.minInvestment} className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit Interest'}
              </button>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4">
              <CheckCircle size={48} className="mx-auto text-emerald-500" />
              <h3 className="text-xl font-bold">Interest Registered!</h3>
              <p className="text-sm text-slate-600">Thank you, {name}. We have recorded your interest in <strong>{formatCurrency(numericAmount)}</strong>.</p>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 text-sm font-medium">Submit another response</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg"><TrendingUp size={20} className="text-white" /></div>
            <span className="font-bold text-xl text-slate-800">Nanovest - Token Survey</span>
          </div>
          <button onClick={handleAdminClick} className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${isAdmin ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-slate-600'}`}>
            <Lock size={12} /> {isAdmin ? 'Exit Admin' : 'Admin'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {isAdmin ? adminDashboard : userView}
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">Admin Access</h3>
            <form onSubmit={verifyPassword} className="space-y-4">
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Enter password" autoFocus />
              {passwordError && <p className="text-red-500 text-xs">Incorrect password</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-2 bg-slate-100 rounded-lg text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
