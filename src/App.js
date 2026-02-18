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
  Briefcase,
  Lock
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
    if (isAdmin) {
      setIsAdmin(false);
    } else {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          Dashboard
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-sm font-medium">Total Demand</div>
          <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalVolume)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="text-slate-500 text-sm font-medium">Interests</div>
          <div className="text-3xl font-bold text-indigo-600">{leads.length}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3">Investor</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4">{lead.userName}</td>
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{PRODUCT_DETAILS.name}</h1>
          <p className="text-slate-600 text-lg mb-8">{PRODUCT_DETAILS.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Est. Return</span>
              <div className="text-2xl font-bold text-emerald-600">{PRODUCT_DETAILS.estimatedReturn}% p.a.</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-500">Tenor</span>
              <div className="text-2xl font-bold text-slate-800">{PRODUCT_DETAILS.tenor}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-6 text-white flex items-center gap-2">
            <Calculator size={20} /> <span>Demand Simulator</span>
            <p className="text-slate-300 text-sm mt-1">Estimate your returns and book your slot.</p>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="Investment Amount" />
              <div className="p-4 bg-emerald-50 rounded-lg flex justify-between">
                <span className="text-emerald-800">Annual Return:</span>
                <span className="font-bold text-emerald-700">{formatCurrency(annualReturnVal)}</span>
              </div>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="Full Name" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded-lg" placeholder="Email Address" />
              <button type="submit" disabled={isSubmitting || numericAmount < PRODUCT_DETAILS.minInvestment} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium">
                {isSubmitting ? 'Submitting...' : 'Submit Interest'}
              </button>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4">
              <CheckCircle size={48} className="mx-auto text-emerald-500" />
              <h3 className="text-xl font-bold">Interest Registered!</h3>
              <button onClick={() => setSubmitted(false)} className="text-indigo-600">Submit another</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl"><TrendingUp className="text-indigo-600"/> Nanovest</div>
        <button onClick={handleAdminClick} className="text-xs text-slate-400 flex items-center gap-1">
          <Lock size={12} /> {isAdmin ? 'Exit Admin' : 'Admin'}
        </button>
      </nav>
      <main className="max-w-7xl mx-auto p-10">
        {isAdmin ? adminDashboard : userView}
      </main>
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-bold mb-4">Admin Access</h3>
            <form onSubmit={verifyPassword} className="space-y-4">
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full border p-2 rounded" placeholder="Password" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 bg-slate-100 p-2 rounded">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white p-2 rounded">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
