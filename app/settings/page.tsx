"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Settings, Loader2, Check, User, TrendingUp, Briefcase, GraduationCap, BarChart2 } from "lucide-react";

const PERSONAS = [
  { id: "investor", label: "Mutual Fund Investor", icon: TrendingUp,    color: "#E8B84B" },
  { id: "founder",  label: "Startup Founder",      icon: Briefcase,     color: "#00C896" },
  { id: "student",  label: "Business Student",      icon: GraduationCap, color: "#3B82F6" },
  { id: "analyst",  label: "Market Analyst",        icon: BarChart2,     color: "#E83B3B" },
];

const ALL_INTERESTS = [
  "Markets", "Economy", "Startups", "Policy", "Global", "Tech",
  "Banking", "Real Estate", "Commodities", "Crypto", "IPO", "Budget",
];

export default function SettingsPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [persona, setPersona] = useState("investor");
  const [interests, setInterests] = useState<string[]>(["Markets", "Economy"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      if (data.profile) {
        setFullName(data.profile.full_name ?? "");
        setPersona(data.profile.persona ?? "investor");
        setInterests(data.profile.interests ?? ["Markets", "Economy"]);
      }
      setLoading(false);
    });
  }, []);

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const save = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, persona, interests }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center">
        <Loader2 size={24} className="text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Settings size={16} className="text-pearl/40" />
            <span className="text-pearl/40 text-xs uppercase tracking-widest">Settings</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-pearl">Your Profile</h1>
          <p className="text-pearl/40 text-sm mt-1">Customize how ET Newsroom personalizes content for you.</p>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-pearl/60 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={12} /> Profile Info
            </h2>
            <div>
              <label className="text-pearl/40 text-xs mb-2 block">Display Name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-pearl/80 placeholder-pearl/20 focus:outline-none focus:ring-1 focus:ring-gold/40"
                placeholder="Your name" />
            </div>
          </div>

          {/* Persona */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-pearl/60 text-xs uppercase tracking-widest mb-4">Your Persona</h2>
            <div className="grid grid-cols-2 gap-3">
              {PERSONAS.map(({ id, label, icon: Icon, color }) => (
                <button key={id} onClick={() => setPersona(id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    persona === id ? "text-pearl" : "glass border-transparent text-pearl/50 hover:text-pearl/80"
                  }`}
                  style={persona === id ? { borderColor: color, background: `${color}10` } : {}}>
                  <Icon size={16} style={{ color }} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-pearl/60 text-xs uppercase tracking-widest mb-4">
              News Interests <span className="text-pearl/20 normal-case ml-1">({interests.length} selected)</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map(interest => {
                const active = interests.includes(interest);
                return (
                  <button key={interest} onClick={() => toggleInterest(interest)}
                    className={`pill transition-all ${
                      active ? "bg-gold/20 text-gold border border-gold/30" : "glass text-pearl/40 hover:text-pearl/70"
                    }`}>
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save */}
          <motion.button onClick={save} disabled={saving || saved}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-gold text-ink-950 py-3 rounded-xl font-semibold hover:bg-gold-light transition-colors disabled:opacity-60">
            {saved  ? <><Check size={16} /> Saved!</> :
             saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> :
             "Save Changes"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
