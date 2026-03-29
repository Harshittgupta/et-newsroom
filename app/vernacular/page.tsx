"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Loader2, ArrowRight, Volume2, Info } from "lucide-react";

const LANGUAGES = [
  { id: "hi", label: "हिंदी",   name: "Hindi",   region: "North India",          flag: "🇮🇳" },
  { id: "ta", label: "தமிழ்",  name: "Tamil",   region: "Tamil Nadu",           flag: "🌅" },
  { id: "te", label: "తెలుగు", name: "Telugu",  region: "Andhra / Telangana",   flag: "🌊" },
  { id: "bn", label: "বাংলা",  name: "Bengali", region: "West Bengal",          flag: "🌸" },
];

const SAMPLE_ARTICLE = "The Reserve Bank of India's Monetary Policy Committee held the repo rate at 6.5% on Wednesday, shifting its stance to 'neutral' — signaling that rate cuts could come as early as December 2024. Governor Shaktikanta Das said inflation is trending toward the 4% target, with food prices stabilizing after the kharif harvest.";

const MOCK_TRANSLATIONS: Record<string, { text: string; context: string; localExample: string }> = {
  hi: {
    text: "भारतीय रिज़र्व बैंक की मौद्रिक नीति समिति ने बुधवार को रेपो रेट को 6.5% पर स्थिर रखा। लेकिन असली खबर यह है — RBI ने अपना रुख 'तटस्थ' (Neutral) कर लिया है। इसका मतलब है कि दिसंबर 2024 या फरवरी 2025 में ब्याज दरें घट सकती हैं। गवर्नर शक्तिकांत दास ने कहा कि महंगाई 4% के लक्ष्य की ओर बढ़ रही है।",
    context: "भारत में आम आदमी के लिए इसका मतलब: अगर RBI ने ब्याज दरें घटाईं, तो होम लोन और कार लोन सस्ते हो सकते हैं। SIP निवेशकों के लिए भी यह अच्छी खबर है।",
    localExample: "अगर आप ₹50 लाख का होम लोन लेने की सोच रहे हैं, तो 25bps की कटौती से EMI लगभग ₹800–900 प्रति माह कम हो सकती है।"
  },
  ta: {
    text: "ரிசர்வ் வங்கியின் நாணய கொள்கை குழு ரெப்போ வட்டி விகிதத்தை 6.5% ஆக நிலையாக வைத்துள்ளது. முக்கிய செய்தி: RBI இப்போது 'நடுநிலை' நிலைப்பாட்டை எடுத்துள்ளது — டிசம்பர் 2024 அல்லது பிப்ரவரி 2025-ல் வட்டி குறையலாம். ஆளுநர் சக்திகாந்த தாஸ் கூறினார்: பணவீக்கம் 4% இலக்கை நோக்கி நகர்கிறது.",
    context: "தமிழ்நாடு சந்தையில் தாக்கம்: வட்டி குறைந்தால், வீட்டுக் கடன், வாகன கடன் மலிவாகும். சிறு தொழில்களுக்கு மலிவான கடன் கிடைக்கும்.",
    localExample: "₹40 லட்சம் வீட்டுக் கடன் வாங்கினால், 0.25% வட்டி குறைந்தால் மாத தவணை சுமார் ₹700 குறையும்."
  },
  te: {
    text: "రిజర్వ్ బ్యాంక్ మానిటరీ పాలసీ కమిటీ రెపో రేటును 6.5%గా అలాగే ఉంచింది. కానీ ముఖ్యమైన వార్త: RBI 'తటస్థ' వైఖరి అవలంబించింది — అంటే డిసెంబర్ 2024 లేదా ఫిబ్రవరి 2025లో వడ్డీ రేట్లు తగ్గవచ్చు. గవర్నర్ శక్తికాంత్ దాస్ ద్రవ్యోల్బణం 4% లక్ష్యానికి చేరుతోందని తెలిపారు.",
    context: "తెలంగాణ మరియు ఆంధ్రప్రదేశ్ రైతులకు ప్రభావం: వడ్డీ రేట్లు తగ్గితే వ్యవసాయ రుణాలు చౌకవుతాయి.",
    localExample: "₹30 లక్షల హోమ్ లోన్‌పై 0.25% తగ్గితే నెలవారీ EMI సుమారు ₹500–600 తక్కువ అవుతుంది."
  },
  bn: {
    text: "রিজার্ভ ব্যাংক অব ইন্ডিয়ার মুদ্রানীতি কমিটি রেপো রেট ৬.৫% এ অপরিবর্তিত রেখেছে। মূল খবর: RBI 'নিরপেক্ষ' অবস্থানে সরে এসেছে — মানে ডিসেম্বর ২০২৪ বা ফেব্রুয়ারি ২০২৫-এ সুদের হার কমতে পারে। গভর্নর শক্তিকান্ত দাস বললেন মূল্যস্ফীতি ৪% লক্ষ্যমাত্রার দিকে এগোচ্ছে।",
    context: "পশ্চিমবঙ্গের জন্য প্রভাব: সুদের হার কমলে গৃহঋণ ও ব্যবসায়িক ঋণ সস্তা হবে। ক্ষুদ্র ব্যবসায়ীরা উপকৃত হবেন।",
    localExample: "৩০ লাখ টাকার হোম লোনে ০.২৫% সুদ কমলে মাসিক EMI প্রায় ৫০০–৬০০ টাকা কমবে।"
  },
};

export default function VernacularPage() {
  const [lang, setLang] = useState("hi");
  const [article, setArticle] = useState(SAMPLE_ARTICLE);
  const [result, setResult] = useState<typeof MOCK_TRANSLATIONS["hi"] | null>(null);
  const [loading, setLoading] = useState(false);

  const translate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: article, targetLang: lang }),
      });
      const data = await res.json();
      setResult(data.result ?? MOCK_TRANSLATIONS[lang]);
    } catch {
      setResult(MOCK_TRANSLATIONS[lang]);
    }
    setLoading(false);
  };

  const currentLang = LANGUAGES.find(l => l.id === lang)!;

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Globe2 size={16} className="text-purple-400" />
            <span className="text-pearl/40 text-xs uppercase tracking-widest">Vernacular Engine</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-pearl">
            Business News in <span className="text-purple-400">Your Language</span>
          </h1>
          <p className="text-pearl/40 text-sm mt-1">Not literal translation — culturally intelligent adaptation with local context.</p>
        </div>

        {/* Language selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {LANGUAGES.map(({ id, label, name, region, flag }) => (
            <button key={id} onClick={() => setLang(id)}
              className={`text-left p-4 rounded-xl border transition-all ${lang === id ? "border-purple-400/40 bg-purple-400/5" : "glass border-transparent"}`}>
              <div className="text-2xl mb-2">{flag}</div>
              <div className={`text-lg font-bold mb-0.5 ${lang === id ? "text-purple-400" : "text-pearl/70"}`}>{label}</div>
              <div className="text-pearl/40 text-xs">{name} · {region}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <label className="text-pearl/40 text-xs uppercase tracking-widest block mb-3">English Article</label>
            <div className="glass rounded-xl overflow-hidden">
              <textarea value={article} onChange={e => setArticle(e.target.value)} rows={12}
                className="w-full bg-transparent p-5 text-pearl/70 text-sm leading-relaxed focus:outline-none resize-none"
                placeholder="Paste English business news here..." />
            </div>
            <button onClick={translate} disabled={loading || !article.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-400 transition-colors disabled:opacity-40">
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Adapting content...</>
                : <><Globe2 size={14} /> Translate to {currentLang.name} <ArrowRight size={12} /></>}
            </button>
          </div>

          {/* Output */}
          <div>
            <label className="text-pearl/40 text-xs uppercase tracking-widest block mb-3">
              {currentLang.label} · {currentLang.name} · {currentLang.region}
            </label>
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] gap-4">
                  <Globe2 size={32} className="text-purple-400 animate-pulse" />
                  <p className="text-pearl/40 text-sm">Culturally adapting content...</p>
                  <div className="flex gap-2 text-xs text-pearl/20">
                    <span>Translating</span><span>→</span><span>Localizing</span><span>→</span><span>Contextualizing</span>
                  </div>
                </motion.div>
              )}
              {!loading && !result && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center gap-3">
                  <Globe2 size={40} className="text-pearl/10" />
                  <p className="text-pearl/30 text-sm">Translation will appear here</p>
                  <p className="text-pearl/20 text-xs">Culturally adapted, not literally translated</p>
                </motion.div>
              )}
              {result && !loading && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="glass rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-purple-400 text-xs font-semibold uppercase tracking-wide">Translated Article</span>
                      <button className="text-pearl/30 hover:text-pearl/60 flex items-center gap-1 text-xs">
                        <Volume2 size={11} /> Listen
                      </button>
                    </div>
                    <p className="text-pearl/80 text-sm leading-loose">{result.text}</p>
                  </div>
                  <div className="glass rounded-xl p-4 border-l-2 border-purple-400/30">
                    <div className="flex items-start gap-2">
                      <Info size={13} className="text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-purple-400 text-xs font-semibold mb-1">Local Context</p>
                        <p className="text-pearl/60 text-sm leading-relaxed">{result.context}</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-gold rounded-xl p-4">
                    <p className="text-gold text-xs font-semibold mb-1">📊 Real Example for You</p>
                    <p className="text-pearl/70 text-sm leading-relaxed">{result.localExample}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
