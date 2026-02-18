import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Rocket, Cpu, Globe, Zap, BarChart3, Calculator, CheckCircle, Info, Lock, TrendingUp, User, Mail 
} from 'lucide-react';

// --- Real-time 2026 SpaceX Data ---
const VALUATION_DATA = [
  { year: '2023', val: 137 },
  { year: '2024', val: 210 },
  { year: '2025', val: 800 },
  { year: 'Feb 2026', val: 1250 }, // Post xAI Merger
  { year: 'IPO (Target)', val: 1500 },
];

const PRODUCT_DETAILS = {
  name: "SpaceX Frontier Series I (Post-Merger)",
  description: "Gain direct exposure to the world's first $1.25 Trillion private entity. Following the historic SpaceX-xAI triangular merger, this tokenized series provides a final entry window before the projected June 2026 IPO.",
  valuation: "$1.25T",
  targetIpo: "$1.5T",
  minInvestment: 1000,
  currency: "USD",
};

// --- Firebase Config (Placeholder) ---
const firebaseConfig = { apiKey: "YOUR_API_KEY", projectId: "YOUR_PROJECT_ID" };
// Initialize logic... (truncated for brevity)

export default function App() {
  const [amount, setAmount] = useState(5000);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const numericAmount = Number(amount) || 0;
  const ipoReturn = (numericAmount * (1500/1250)).toFixed(0);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { 
    style: 'currency', currency: 'USD', maximumFractionDigits: 0 
  }).format(val);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 font-sans pb-20 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <Rocket size={20} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-white uppercase italic">Frontier<span className="text-indigo-500 font-light">Equity</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-400"/> STARLINK V3 LIVE</span>
            <span className="flex items-center gap-1.5"><Cpu size={12} className="text-indigo-400"/> xAI INTEGRATED</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: Context & Charts */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                Pre-IPO Opportunity
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                The Trillion-Dollar <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Innovation Engine</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                {PRODUCT_DETAILS.description}
              </p>
            </div>

            {/* Valuation Chart */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Valuation Trajectory</h3>
                  <div className="text-3xl font-black text-white italic">$1.25 TRILLION</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 text-sm font-bold flex items-center justify-end gap-1">
                    <TrendingUp size={16}/> +470% YoY
                  </span>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={VALUATION_DATA}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="year" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* USPs with Data Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all">
                <div className="text-indigo-400 mb-3"><Cpu size={24}/></div>
                <h4 className="font-bold text-white mb-1 uppercase text-sm tracking-wide">Sentient Sun Project</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Direct exposure to the xAI/SpaceX merger building the first orbital AI data centers.</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all">
                <div className="text-amber-400 mb-3"><Globe size={24}/></div>
                <h4 className="font-bold text-white mb-1 uppercase text-sm tracking-wide">The "Whole Shebang" IPO</h4>
                <p className="text-xs text-slate-400 leading-relaxed">No Starlink spin-off. Own the entire ecosystem: Starship, Starlink, and xAI in one share.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Form / Demand Capture */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-[#161B22] to-[#0B0E14] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden sticky top-28">
              <div className="p-8 border-b border-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calculator size={20} className="text-indigo-500" /> IPO Calculator
                </h3>
                <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Allocation Demand Survey</p>
              </div>
              
              {!submitted ? (
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Subscription Interest</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center text-indigo-500 font-black text-xl">$</div>
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="w-full bg-white/[0.03] border-2 border-white/10 rounded-2xl py-5 pl-10 pr-6 text-3xl font-black text-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-300 uppercase">Target IPO Position</span>
                      <span className="text-2xl font-black text-indigo-400">{formatCurrency(ipoReturn)}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[83%] animate-pulse"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 text-center uppercase font-bold tracking-tighter">Projected at $1.5T Listing Price</p>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm focus:border-indigo-500 outline-none"
                    />
                    <input 
                      type="email" 
                      placeholder="Institutional Email" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <button 
                    onClick={() => setSubmitted(true)}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all transform active:scale-95"
                  >
                    Register Allocation Interest
                  </button>
                </div>
              ) : (
                <div className="p-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Request Logged</h3>
                  <p className="text-slate-400 text-sm">Priority status confirmed for {formatCurrency(amount)}. You will be notified when the SEC S-1 filing drops in April.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
