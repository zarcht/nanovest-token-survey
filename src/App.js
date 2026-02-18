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
  Clock, 
  Info, 
  User, 
  Mail, 
  CheckCircle, 
  BarChart3, 
  Briefcase,
  Lock,
  DollarSign
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

const appId = 'default-app-id';

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
    if (passwordInput === 'nano2021') {
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
        phone: phone,
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

  const adminDashboard = (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          Dashboard
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium">Total Demand</div>
          <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalVolume)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium">Interests</div>
          <div className="text-3xl font-bold text-indigo-600">{leads.length}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3">Investor</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
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
      {/* Left Column */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
            New Offering
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{PRODUCT_DETAILS.name}</h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">{PRODUCT_DETAILS.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <BarChart3 size={18} /> <span className="text-sm font-medium">Est. Annual Return</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{PRODUCT_DETAILS.estimatedReturn}% p.a.</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Clock size={18} /> <span className="text-sm font-medium">Tenor</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{PRODUCT_DETAILS.tenor}</div>
            </div>
          </div>
        </div>

        {/* Restore USP Section */}
        <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info size={20} /> Why Subscribe Now?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle size={18} className="mt-1 text-indigo-300" />
              <span className="text-indigo-100">Priority allocation for early expressions of interest.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={18} className="mt-1 text-indigo-300" />
              <span className="text-indigo-100">Secure a high-yield position before public launch.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={18} className="mt-1 text-indigo-300" />
              <span className="text-indigo-100">Direct updates from the fund management team.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden sticky top-6">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calculator size={20} /> Demand Simulator
            </h3>
            <p className="text-slate-300 text-sm mt-1">Estimate your returns and book your slot.</p>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">How much would you like to subscribe?</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-medium">$</span>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7 w-full rounded-lg border-slate-300 border p-3 text-lg font-semibold focus:ring-indigo-500" placeholder="10000" />
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-emerald-800 font-medium">Est. Annual Return</span>
                  <span className="text-lg font-bold text-emerald-700">{formatCurrency(annualReturnVal)}</span>
                </div>
                <div className="text-xs text-emerald-600/80">Rate: {PRODUCT_DETAILS.estimatedReturn}% | Based on input</div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="pl-10 w-full rounded-lg border border-slate-300 p-2.5 text-sm" placeholder="Full Name" />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 w-full rounded-lg border border-slate-300 p-2.5 text-sm" placeholder="Email Address" />
                </div>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 w-full rounded-lg border border-slate-300 p-2.5 text-sm" placeholder="Phone (Optional)" />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting || numericAmount < PRODUCT_DETAILS.minInvestment} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit Interest'}
              </button>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Interest Registered!</h3>
              <p className="text-sm text-slate-600">Thank you, {name}. We have recorded your interest in <strong>{formatCurrency(numericAmount)}</strong>.</p>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 text-sm font-medium hover:underline">Submit another response</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b sticky top-0 z-10 px-4">
        <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg"><TrendingUp size={20} className="text-white" /></div>
            <span className="font-bold text-xl tracking-tight">Nanovest - Token Survey</span>
          </div>
          <button onClick={handleAdminClick} className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full ${isAdmin ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-slate-600'}`}>
            <Lock size={12} /> {isAdmin ? 'Exit Admin' : 'Admin'}
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-10">
        {isAdmin ? adminDashboard : userView}
      </main>
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-2">Admin Access</h3>
            <p className="text-slate-500 text-sm mb-4">Enter security password to access dashboard.</p>
            <form onSubmit={verifyPassword} className="space-y-4">
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500" placeholder="Password" autoFocus />
              {passwordError && <p className="text-red-500 text-xs">Incorrect password</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-2 bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
