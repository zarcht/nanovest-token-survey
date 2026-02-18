import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { Rocket, CheckCircle, Calculator, User, Mail, AlertCircle } from 'lucide-react';

// --- YOUR VERIFIED CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyBYbnjtOoQZp43z_aiKnVMAKtOcUw9EXxU",
  authDomain: "nano-token-survey.firebaseapp.com",
  projectId: "nano-token-survey",
  storageBucket: "nano-token-survey.firebasestorage.app",
  messagingSenderId: "294925629622",
  appId: "1:294925629622:web:42448455940d855c194e17"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export default function App() {
  const [userId, setUserId] = useState(null);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 1. Force Anonymous Login on Mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in as:", user.uid);
        setUserId(user.uid);
      } else {
        signInAnonymously(auth).catch(err => console.error("Auth Failed:", err));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety Check: If DB or Auth isn't ready
    if (!db || !userId) {
      alert("System not ready. Please wait 2 seconds for connection.");
      return;
    }

    if (Number(amount) < 5000) {
      alert("Minimum investment is $5,000");
      return;
    }

    setIsSubmitting(true);
    try {
      // Direct path to avoid complex nesting errors
      await addDoc(collection(db, "spacex_leads"), {
        name,
        email,
        amount: Number(amount),
        timestamp: serverTimestamp(),
        userId: userId
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission Error Details:", error);
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm">
          <CheckCircle size={60} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black">Interest Recorded</h2>
          <p className="text-slate-500 mt-2">Our team will be in touch shortly.</p>
          <button onClick={() => setSubmitted(false)} className="mt-6 text-indigo-600 font-bold">New Entry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden mt-10">
        <div className="bg-slate-900 p-8 text-white">
          <Rocket className="text-indigo-400 mb-2" />
          <h1 className="text-2xl font-black">SpaceX + xAI Survey</h1>
          <p className="text-slate-400 text-sm">Join the $1 Trillion Frontier</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Investment Amount (USD)</label>
            <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border-2 border-slate-100 p-4 rounded-xl text-xl font-black outline-none focus:border-indigo-500" placeholder="5000" />
            <p className="text-[10px] text-indigo-600 font-bold mt-2 uppercase">Min. Allocation: $5,000</p>
          </div>

          <div className="space-y-4">
            <input type="text" required placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-3 rounded-lg outline-none" />
            <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded-lg outline-none" />
          </div>

          <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-indigo-700 disabled:opacity-50">
            {isSubmitting ? 'Transmitting...' : 'Submit Interest'}
          </button>
          
          <p className="text-[10px] text-center text-slate-400 italic">
            Connection Status: {userId ? '✅ Ready' : '⏳ Connecting...'}
          </p>
        </form>
      </div>
    </div>
  );
}
