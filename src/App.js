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
  AlertCircle,
  ExternalLink,
  FileText,
  PieChart,
  ArrowUpRight
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

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

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
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth).catch(console.error);
    });
    return () => unsubscribe();
  }, []);

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
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userView = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in duration-700">
      <div className="lg:col-span-3 space-y-6">
        {/* Main Hero Card */}
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

        {/* --- OPTIMIZED FINANCIAL INTELLIGENCE SECTION --- */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-wide">
              <BarChart3 size={20} className="text-indigo-600" /> Financial Intelligence
            </h3>
            <a 
              href="https://fintool.com/news/spacex-8-billion-profit-ipo-financials" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full"
            >
              2026 Report <ExternalLink size={12} />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* 2025 Financial Summary Table */}
             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4 text-slate-500">
                    <PieChart size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">2025 Performance</span>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                        <span className="text-xs font-medium text-slate-600">Total Revenue</span>
                        <span className="text-base font-black text-slate-900">$15.5B</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                        <span className="text-xs font-medium text-slate-600">EBITDA Profit</span>
                        <span className="text-base font-black text-emerald-600">$8.0B</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                        <span className="text-xs font-medium text-slate-600">Starlink Users</span>
                        <span className="text-base font-black text-indigo-600">9M+</span>
                    </div>
                </div>
             </div>

             {/* Valuation Growth Chart */}
             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <TrendingUp size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Valuation History (USD)</span>
                </div>
                
                {/* Fixed height container for chart */}
                <div className="flex-1 flex items-end justify-between gap-2 h-32 pt-4 relative">
                    {/* Background Grid Line */}
                    <div className="absolute bottom-0 w-full h-[1px] bg-slate-200"></div>

                    {/* Bar 1: 2023 ($137B / 1500 * 100 = ~9%) */}
                    <div className="flex flex-col items-center gap-1 w-full group relative z-10">
                        <div className="w-full bg-slate-300 rounded-t-sm hover:bg-slate-400 transition-colors" style={{ height: '9%' }}></div>
                        <span className="text-[9px] font-bold text-slate-500">2023</span>
                    </div>
                    
                    {/* Bar 2: 2024 ($350B / 1500 * 100 = ~23%) */}
                    <div className="flex flex-col items-center gap-1 w-full group relative z-10">
                        <div className="w-full bg-slate-300 rounded-t-sm hover:bg-slate-400 transition-colors" style={{ height: '23%' }}></div>
                        <span className="text-[9px] font-bold text-slate-500">2024</span>
                    </div>
                    
                    {/* Bar 3: 2025 ($800B / 1500 * 100 = ~53%) */}
                    <div className="flex flex-col items-center gap-1 w-full group relative z-10">
                        <span className="text-[9px] font-bold text-slate-900 absolute -top-5 opacity-0 group-hover:opacity-100 transition-opacity">$800B</span>
                        <div className="w-full bg-slate-800 rounded-t-sm hover:bg-slate-700 transition-colors" style={{ height: '53%' }}></div>
                        <span className="text-[9px] font-bold text-slate-900">2025</span>
                    </div>
                    
                    {/* Bar 4: IPO ($1.5T = 100%) */}
                    <div className="flex flex-col items-center gap-1 w-full group relative z-10">
                         <span className="text-[9px] font-bold text-indigo-600 absolute -top-5">$1.5T</span>
                        <div className="w-full bg-indigo-600 rounded-t-sm relative overflow-hidden" style={{ height: '100%' }}>
                             <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                        <span className="text-[9px] font-bold text-indigo-700">IPO '26</span>
                    </div>
                </div>
             </div>
          </div>
        </div>
        {/* --- END FINANCIAL SECTION --- */}

        {/* Thesis Section */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-wide">
            <ArrowUpRight size={24} className="text-indigo-400" /> Investment Thesis
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
                <TrendingUp size={18} /> Starship Dominance
              </div>
              <p className="text-sm text-indigo-100/70 leading-relaxed">SpaceX now commands over 85% of global launch mass. With Starship V3 fully operational, the company has effectively commoditized access to space.</p>
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

              <div className="space-y-
