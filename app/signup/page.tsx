"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, Lock, User, TrendingUp } from "lucide-react";
import Link from "next/link";

const PERSONAS = [
  { id: "investor", label: "Mutual Fund Investor", desc: "Stocks, SIPs, ETFs" },
  { id: "founder", label: "Startup Founder", desc: "Funding, competition, growth" },
  { id: "student", label: "Business Student", desc: "Explainers, fundamentals" },
  { id: "analyst", label: "Market Analyst", desc: "Earnings, technicals, data" },
];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"account" | "persona">("account");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persona, setPersona] = useState("investor");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleAccountStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setStep("persona");
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, persona },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-14">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm">
          <div className="text-5xl mb-6">📬</div>
          <h2 className="font-display text-2xl font-bold text-pearl mb-3">Check your email</h2>
          <p className="text-pearl/50 text-sm leading-relaxed">
            We sent a confirmation link to <span className="text-gold">{email}</span>.
            Click it to activate your account, then come back to log in.
          </p>
          <Link href="/login" className="mt-6 inline-block text-gold text-sm hover:underline">
            Back to login →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-14">
      <div className="absolute inset-0 bg-gradient-radial from-jade/5 via-transparent to-transparent" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={22} className="text-ink-950" />
          </div>
          <h1 className="font-display text-2xl font-bold text-pearl">
            {step === "account" ? "Create account" : "Pick your persona"}
          </h1>
          <p className="text-pearl/40 text-sm mt-1">
            {step === "account" ? "Free forever — no credit card" : "We'll personalize your news feed"}
          </p>
        </div>

        {step === "account" && (
          <>
            <button onClick={handleGoogle} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 glass py-3 rounded-xl text-pearl/80 hover:text-pearl transition-all mb-4 text-sm font-medium">
              {googleLoading ? <Loader2 size={16} className="animate-spin" /> : (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Sign up with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-pearl/30 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleAccountStep} className="space-y-3">
              {error && <div className="glass bg-scarlet/10 border border-scarlet/20 rounded-xl px-4 py-3 text-scarlet text-sm">{error}</div>}
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pearl/30" />
                <input type="text" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} required
                  className="w-full glass rounded-xl pl-9 pr-4 py-3 text-sm text-pearl/80 placeholder-pearl/30 focus:outline-none focus:ring-1 focus:ring-gold/40" />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pearl/30" />
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full glass rounded-xl pl-9 pr-4 py-3 text-sm text-pearl/80 placeholder-pearl/30 focus:outline-none focus:ring-1 focus:ring-gold/40" />
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-pearl/30" />
                <input type="password" placeholder="Password (6+ characters)" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full glass rounded-xl pl-9 pr-4 py-3 text-sm text-pearl/80 placeholder-pearl/30 focus:outline-none focus:ring-1 focus:ring-gold/40" />
              </div>
              <button type="submit" className="w-full bg-gold text-ink-950 py-3 rounded-xl font-semibold text-sm hover:bg-gold-light transition-colors">
                Continue →
              </button>
            </form>
          </>
        )}

        {step === "persona" && (
          <div className="space-y-3">
            {PERSONAS.map(({ id, label, desc }) => (
              <button key={id} onClick={() => setPersona(id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  persona === id ? "border-gold/40 bg-gold/5" : "glass border-transparent"
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-pearl/90 text-sm font-medium">{label}</div>
                    <div className="text-pearl/40 text-xs mt-0.5">{desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    persona === id ? "border-gold bg-gold" : "border-pearl/20"
                  }`}>
                    {persona === id && <div className="w-1.5 h-1.5 rounded-full bg-ink-950" />}
                  </div>
                </div>
              </button>
            ))}
            {error && <div className="glass bg-scarlet/10 border border-scarlet/20 rounded-xl px-4 py-3 text-scarlet text-sm">{error}</div>}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep("account")} className="flex-1 glass py-3 rounded-xl text-pearl/50 text-sm">
                ← Back
              </button>
              <button onClick={handleSignup} disabled={loading}
                className="flex-1 bg-gold text-ink-950 py-3 rounded-xl font-semibold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                Create Account
              </button>
            </div>
          </div>
        )}

        {step === "account" && (
          <p className="text-center text-pearl/40 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:underline">Sign in</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
