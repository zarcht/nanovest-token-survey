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
  Loader2
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

// --- Firebase Initialization Logic ---
// We use a try-catch block here because if the Vercel environment variable 
// is not set yet, the app would normally crash. This keeps it stable.
let db, auth;
try {
  const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase configuration is missing or invalid.");
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
  
  // AI/Data State
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [leads, setLeads] = useState([]);

  // Auth Initialization
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, setUser);
    signInAnonymously(auth).catch(console.error);
    return () => unsubscribe();
  }, []);

  // Fetch Leads (Admin Only)
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
        createdAt: serverTimestamp(),
        submitterId: user.uid
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600" />
            <span className="font-bold text-xl">Nanovest - Token Survey</span>
          </div>
          <button onClick={handleAdminClick} className="text-xs text-slate-400 flex items-center gap-1">
            <Lock size={12} /> {isAdmin ? 'Exit Admin' : 'Admin'}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {!isAdmin ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h1 className="text-3xl font-bold mb-4">{PRODUCT_DETAILS.name}</h1>
                <p className="text-slate-600 text-lg mb-8">{PRODUCT_DETAILS.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm text-slate-500">Est. Return</span>
                    <div className="text-2xl font-bold text-emerald-600">{PRODUCT_DETAILS.estimatedReturn}% p.a.</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm text-slate-500">Tenor</span>
                    <div className="text-2xl font-bold">{PRODUCT_DETAILS.tenor}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-slate-900 p-6 text-white">
                  <h3 className="flex items-center gap-2"><Calculator size={20} /> Demand Simulator</h3>
                </div>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input 
                      type="number" 
                      placeholder="Amount (USD)" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                    />
                    <button 
                      type="submit" 
                      disabled={isSubmitting || numericAmount < PRODUCT_DETAILS.minInvestment}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Interest'}
                    </button>
                  </form>
                ) : (
                  <div className="p-8 text-center space-y-4">
                    <CheckCircle size={48} className="mx-auto text-emerald-500" />
                    <h3 className="text-xl font-bold">Interest Registered!</h3>
                    <button onClick={() => setSubmitted(false)} className="text-indigo-600 text-sm">Submit another</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200">
             <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b">
                   <th className="py-2">Investor</th>
                   <th className="py-2">Amount</th>
                   <th className="py-2">Contact</th>
                 </tr>
               </thead>
               <tbody>
                 {leads.map(lead => (
                   <tr key={lead.id} className="border-b">
                     <td className="py-4">{lead.userName}</td>
                     <td className="py-4 font-bold text-emerald-600">{formatCurrency(lead.subscriptionAmount)}</td>
                     <td className="py-4 text-slate-500">{lead.email}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Admin Access</h3>
            <form onSubmit={verifyPassword}>
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Password"
              />
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
