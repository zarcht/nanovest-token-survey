import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
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
  Users,
  Briefcase,
  Lock,
  Sparkles,
  MessageSquare,
  Copy,
  Loader2,
  X
} from 'lucide-react';

// --- Configuration & Product Details ---
const PRODUCT_DETAILS = {
  name: "Green Energy Infrastructure Bond Series A",
  description: "A secure fixed-income instrument financing renewable solar energy projects in Southeast Asia. This senior secured bond offers stable semi-annual coupon payments and capital protection structure.",
  tenor: "3 Years",
  estimatedReturn: 8.5, // Percentage
  minInvestment: 5000,
  currency: "USD"
};

// --- Gemini API Setup ---
const apiKey = ""; // Automatically injected at runtime

const callGemini = async (prompt: string): Promise<string> => {
  const delays = [1000, 2000, 4000, 8000, 16000];
  let attempt = 0;

  while (attempt <= 5) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
      if (attempt === 5) {
        console.error("Gemini API failed after retries:", error);
        return "I apologize, but I couldn't generate the analysis at this moment. Please try again later.";
      }
      await new Promise(r => setTimeout(r, delays[attempt]));
      attempt++;
    }
  }
  return "Error connecting to AI service.";
};

// --- Firebase Setup ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Main Component ---
function BookBuildingTool() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for Admin View
  
  // Admin Login State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Form State
  const [amount, setAmount] = useState<number | string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // AI State - User Side
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI State - Admin Side
  const [emailDrafts, setEmailDrafts] = useState<Record<string, string>>({});
  const [generatingEmailId, setGeneratingEmailId] = useState<string | null>(null);

  // Data State
  const [leads, setLeads] = useState<any[]>([]);

  // Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Fetch Leads
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'artifacts', appId, 'public', 'data', 'product_demand_leads')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Client-side sort by timestamp descending
      leadsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setLeads(leadsData);
    }, (error) => {
      console.error("Error fetching leads:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Calculations
  const numericAmount = Number(amount) || 0;
  const annualReturnVal = numericAmount * (PRODUCT_DETAILS.estimatedReturn / 100);
  const totalReturnVal = annualReturnVal * parseInt(PRODUCT_DETAILS.tenor); 
  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: PRODUCT_DETAILS.currency });

  const formatCurrency = (val: number) => currencyFormatter.format(val);

  // --- Handlers ---

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowPasswordModal(true);
      setPasswordInput('');
      setPasswordError(false);
    }
  };

  const verifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'nano2021') {
      setIsAdmin(true);
      setShowPasswordModal(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'product_demand_leads'), {
        productName: PRODUCT_DETAILS.name,
        userName: name,
        email: email,
        phone: phone,
        subscriptionAmount: numericAmount,
        estimatedReturn: PRODUCT_DETAILS.estimatedReturn,
        createdAt: serverTimestamp(),
        submitterId: user.uid
      });
      setSubmitted(true);
      setAiAnalysis(''); // Reset analysis on submit
    } catch (error) {
      console.error("Error submitting interest:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setAmount('');
    setName('');
    setEmail('');
    setPhone('');
    setAiAnalysis('');
  };

  // AI Feature: User Investment Analysis
  const handleGenerateAnalysis = async () => {
    if (numericAmount < PRODUCT_DETAILS.minInvestment) return;
    setIsAnalyzing(true);
    
    const prompt = `
      Act as a helpful financial analyst assistant. 
      The user is interested in the "${PRODUCT_DETAILS.name}".
      Product Description: ${PRODUCT_DETAILS.description}
      Tenor: ${PRODUCT_DETAILS.tenor}
      Return: ${PRODUCT_DETAILS.estimatedReturn}% p.a.
      
      The user is considering investing ${formatCurrency(numericAmount)}.
      
      Please provide a concise, encouraging, yet professional 3-sentence "Investment Thesis" for this specific amount. 
      Highlight the projected total return value (${formatCurrency(totalReturnVal)} over the full tenor) and the environmental impact mentioned in the description.
      Do not give financial advice, but describe the mechanics and benefits.
    `;

    const result = await callGemini(prompt);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  // AI Feature: Admin Email Draft
  const handleGenerateEmail = async (lead: any) => {
    setGeneratingEmailId(lead.id);
    
    const prompt = `
      Act as an investor relations manager for the "${PRODUCT_DETAILS.name}".
      Write a short, professional, and warm follow-up email to a potential investor named ${lead.userName}.
      
      Context:
      - They have expressed interest in investing ${formatCurrency(lead.subscriptionAmount)}.
      - The product offers ${PRODUCT_DETAILS.estimatedReturn}% p.a. return.
      - Thank them for their interest and suggest setting up a call to finalize the allocation.
      
      Output only the body of the email. Keep it under 100 words.
    `;

    const result = await callGemini(prompt);
    setEmailDrafts(prev => ({ ...prev, [lead.id]: result }));
    setGeneratingEmailId(null);
  };

  const copyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  // --- Render Contents (Defined as variables to prevent focus loss issues) ---

  const totalVolume = leads.reduce((acc, curr) => acc + (Number(curr.subscriptionAmount) || 0), 0);
    
  const adminDashboard = (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Book Building Dashboard
          </h2>
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Internal Use Only
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1">Total Demand Value</div>
            <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalVolume)}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1">Total Interested Users</div>
            <div className="text-3xl font-bold text-indigo-600">{leads.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1">Avg. Ticket Size</div>
            <div className="text-3xl font-bold text-slate-700">
              {leads.length ? formatCurrency(totalVolume / leads.length) : '$0.00'}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-700">Recent Indications of Interest</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Investor Name</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3 text-right">Committed Amount</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 align-top">{lead.userName}</td>
                      <td className="px-6 py-4 text-slate-600 align-top">
                        <div className="flex items-center gap-1"><Mail size={12}/> {lead.email}</div>
                        {lead.phone && <div className="flex items-center gap-1 mt-1 text-xs text-slate-400"><Briefcase size={12}/> {lead.phone}</div>}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-700 align-top">
                        {formatCurrency(lead.subscriptionAmount)}
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        <button 
                          onClick={() => handleGenerateEmail(lead)}
                          disabled={generatingEmailId === lead.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          {generatingEmailId === lead.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          Draft Email
                        </button>
                      </td>
                    </tr>
                    {/* Generated Email Expansion */}
                    {emailDrafts[lead.id] && (
                      <tr className="bg-indigo-50/30">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="bg-white rounded-lg border border-indigo-100 p-4 shadow-sm relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles size={10} /> AI Suggested Draft
                              </span>
                              <button 
                                onClick={() => copyToClipboard(emailDrafts[lead.id])}
                                className="text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Copy to clipboard"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                            <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                              {emailDrafts[lead.id]}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      No submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

  const userView = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left Column: Product Info */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
                New Offering
              </span>
              <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2">
                {PRODUCT_DETAILS.name}
              </h1>
            </div>
            <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <TrendingUp size={24} />
            </div>
          </div>
          
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {PRODUCT_DETAILS.description}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <BarChart3 size={18} />
                <span className="text-sm font-medium">Est. Annual Return</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{PRODUCT_DETAILS.estimatedReturn}% p.a.</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Clock size={18} />
                <span className="text-sm font-medium">Tenor</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{PRODUCT_DETAILS.tenor}</div>
            </div>
          </div>
        </div>

        {/* Benefits / Info */}
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

      {/* Right Column: Calculator & Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl sticky top-6 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calculator size={20} /> Demand Simulator
            </h3>
            <p className="text-slate-300 text-sm mt-1">Estimate your returns and book your slot.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Calculator Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  How much would you like to subscribe?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min={PRODUCT_DETAILS.minInvestment}
                    step="1000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7 block w-full rounded-lg border-slate-300 bg-slate-50 border p-3 text-lg font-semibold text-slate-900 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter amount (e.g. 10000)"
                  />
                </div>
                {numericAmount > 0 && numericAmount < PRODUCT_DETAILS.minInvestment && (
                  <p className="text-xs text-amber-600">Minimum investment is {formatCurrency(PRODUCT_DETAILS.minInvestment)}</p>
                )}
              </div>

              {/* Dynamic Results */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 transition-all duration-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-emerald-800 font-medium">Est. Annual Return</span>
                  <span className="text-lg font-bold text-emerald-700">{formatCurrency(annualReturnVal)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-emerald-600/80 mb-3">
                  <span>Rate: {PRODUCT_DETAILS.estimatedReturn}%</span>
                  <span>Based on input amount</span>
                </div>

                {/* AI Analysis Button for User */}
                {numericAmount >= PRODUCT_DETAILS.minInvestment && (
                  <div className="pt-3 border-t border-emerald-100">
                     <button
                      type="button"
                      onClick={handleGenerateAnalysis}
                      disabled={isAnalyzing}
                      className="w-full text-xs flex items-center justify-center gap-2 bg-white/60 hover:bg-white text-emerald-700 py-2 px-3 rounded-lg border border-emerald-200 shadow-sm transition-all"
                    >
                      {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-indigo-500" />}
                      {isAnalyzing ? 'Analyzing investment...' : 'Generate Investment Thesis'}
                    </button>
                    {aiAnalysis && (
                      <div className="mt-3 text-xs text-slate-600 bg-white/80 p-3 rounded-lg border border-emerald-100 animate-fade-in">
                        <p className="leading-relaxed">{aiAnalysis}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 my-4"></div>

              {/* Contact Fields */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Your Details</h4>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 block w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 block w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <DollarSign size={16} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 block w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Phone (Optional)"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || numericAmount < PRODUCT_DETAILS.minInvestment}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Interest'}
              </button>
              <p className="text-xs text-center text-slate-400">
                Non-binding indication of interest.
              </p>
            </form>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Interest Registered!</h3>
                <p className="text-slate-600 mt-2 text-sm">
                  Thank you, {name}. We have recorded your interest in subscribing <strong>{formatCurrency(numericAmount)}</strong>.
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Submit another response
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <TrendingUp size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">Nanovest - Token Survey</span>
            </div>
            <div className="flex items-center">
               <button 
                onClick={handleAdminClick}
                className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${isAdmin ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Lock size={12} />
                {isAdmin ? 'Exit Admin' : 'Admin'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Admin Access</h3>
                    <p className="text-slate-500 text-sm mb-4">Please enter the security password to access the dashboard.</p>
                    <form onSubmit={verifyPassword} className="space-y-4">
                        <div>
                            <input 
                                type="password" 
                                autoFocus
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Enter password"
                            />
                            {passwordError && <p className="text-red-500 text-xs mt-1">Incorrect password</p>}
                        </div>
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isAdmin ? adminDashboard : userView}
      </main>
    </div>
  );
}

