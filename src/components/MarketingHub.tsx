import React, { useState } from 'react';
import { 
  Search, 
  Share2, 
  Twitter, 
  Facebook, 
  MessageSquare, 
  Linkedin, 
  Globe, 
  Copy, 
  Check, 
  Sparkles, 
  TrendingUp, 
  ExternalLink, 
  Heart, 
  Eye, 
  Megaphone,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface MedicineRemedy {
  name: string;
  category: string;
  indicatesFor: string;
  marathiName: string;
  cellularAction: string;
  seoKeywords: string[];
}

// Database of classic medicines & remedies to search from
const MEDICINES_DATABASE: MedicineRemedy[] = [
  {
    name: "Sudarshan Vati / Sudarshan Tablet",
    category: "Herbal Formulation (Antipyretic & Immunity Booster)",
    indicatesFor: "All types of fevers, viral infections, fatigue, micro-level biological toxicity.",
    marathiName: "सुदर्शन वटी / गोळी",
    cellularAction: "Purifies blood plasma, balances Pitta dosha, and activates white blood cell (WBC) immune defense systems.",
    seoKeywords: ["sudarshan vati online", "buy sudarshan tablet", "ayurvedic fever medicine", "jiyo long life sudarshan"]
  },
  {
    name: "Ashwagandha (Withania somnifera)",
    category: "Adaptogen & Cellular Rejuvenator",
    indicatesFor: "Chronic fatigue, high cortisol, stress, nervous system weaknesses, muscle wasting.",
    marathiName: "अश्वगंधा",
    cellularAction: "Reduces cellular inflammation, stabilizes stress hormones (cortisol), and enhances mitochondrial energy (ATP) production.",
    seoKeywords: ["buy organic ashwagandha", "best energy adaptogen", "nervous system rejuvinator", "jiyo long life ashwagandha"]
  },
  {
    name: "Triphala Powder / Tablet",
    category: "Colon Cleanser & Digestive Regulator",
    indicatesFor: "Constipation, bowel toxicity, sluggish liver, vision weakness.",
    marathiName: "त्रिफळा चूर्ण / गोळी",
    cellularAction: "Nourishes the digestive epithelial cells, stimulates colon peristalsis, and flushes out macro-level body waste.",
    seoKeywords: ["triphala benefits online", "ayurvedic colon cleanse", "best triphala tablets", "jiyo long life triphala"]
  },
  {
    name: "Chandraprabha Vati",
    category: "Urinary System & Vigor Enhancer",
    indicatesFor: "Urinary tract infections (UTIs), kidney weaknesses, lower back ache, physical weakness.",
    marathiName: "चंद्रप्रभा वटी",
    cellularAction: "Regulates renal cell hydration, filters cellular wastes efficiently, and maintains metabolic balances.",
    seoKeywords: ["chandraprabha vati purchase", "kidney strength ayurvedic", "uti herbal remedy", "jiyo long life chandraprabha"]
  },
  {
    name: "Tulsi (Holy Basil) Extract",
    category: "Respiratory & Cellular Protective",
    indicatesFor: "Cough, cold, asthma, cellular oxidative stress, environmental pollution toxicity.",
    marathiName: "तुळस अर्क / कॅप्सूल",
    cellularAction: "Strong anti-oxidant that neutralizes free radicals in pulmonary tissues and strengthens cellular cell walls.",
    seoKeywords: ["buy organic tulsi drops", "respiratory immunity booster", "tulsi liquid extract", "jiyo long life tulsi"]
  },
  {
    name: "Guduchi (Giloy / Tinospora cordifolia)",
    category: "Ultimate Immunomodulator (Amrita)",
    indicatesFor: "Chronic immune deficiencies, liver toxicity, blood impurities, viral resistance.",
    marathiName: "गुळवेल / गिलोय",
    cellularAction: "Increases phagocytic activity of macrophages, regenerates liver cells, and boosts overall longevity of blood cells.",
    seoKeywords: ["buy giloy tablets online", "guduchi liver support", "natural immunity enhancer", "jiyo long life giloy"]
  },
  {
    name: "Shatavari (Asparagus racemosus)",
    category: "Hormonal Balancer & Vitalizer",
    indicatesFor: "Hormonal imbalances, reproductive system weakness, tissue dehydration, breast milk enhancement.",
    marathiName: "शतावरी कल्प / टॅब्लेट",
    cellularAction: "Replenishes fluids at the cellular level, nourishes estrogen/progesterone balance, and promotes tissue hydration.",
    seoKeywords: ["shatavari buy online", "hormonal balance for women", "ayurvedic tissue rejuvenator", "jiyo long life shatavari"]
  },
  {
    name: "Arogyavardhini Vati",
    category: "Liver & Metabolic Regulator",
    indicatesFor: "Fatty liver, skin diseases, eczema, sluggish metabolism, blood cholesterol.",
    marathiName: "आरोग्यवर्धिनी वटी",
    cellularAction: "Promotes bile secretion, boosts cellular lipid metabolism, and helps clear deep-seated dermal toxins.",
    seoKeywords: ["arogyavardhini vati online", "fatty liver ayurvedic tablets", "sluggish metabolism cure", "jiyo long life arogyavardhini"]
  }
];

export default function MarketingHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<MedicineRemedy | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [customMedQuery, setCustomMedQuery] = useState('');

  // Search filter
  const filteredMeds = MEDICINES_DATABASE.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    med.marathiName.includes(searchQuery) ||
    med.indicatesFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getPlatformURL = () => {
    return window.location.href;
  };

  const getShareMessage = (medName?: string) => {
    const nameStr = medName ? `for ${medName}` : "for all disease remedies & body reconstruction";
    return `🧘 Jiyo Long Life - The Ultimate Divine AI Health Reconstruction Platform! Find 100% safe, expert allopathic + ancient remedies ${nameStr}. Totally organic, zero side-effects. Explore here: ${getPlatformURL()} #JiyoLongLife #AyurvedaAI #HealthReconstruction`;
  };

  const handleWebSearch = (term: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(term + " Jiyo Long Life platform")}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate dynamic JSON-LD structured schema for search engines
  const generateSchemaJSON = (med: MedicineRemedy) => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": `Jiyo Long Life - ${med.name} Remedy & Cellular Guide`,
      "description": `Divine AI health guide and treatments using ${med.name} (${med.marathiName}) for ${med.indicatesFor}. Zero side-effect recovery.`,
      "url": getPlatformURL(),
      "medicalAudience": "Patients",
      "aspect": ["Prognosis", "Treatment", "SelfCare"],
      "about": {
        "@type": "MedicalCondition",
        "name": med.indicatesFor,
        "possibleTreatment": {
          "@type": "MedicalTherapy",
          "name": med.name,
          "description": med.cellularAction
        }
      }
    };
    return JSON.stringify(schema, null, 2);
  };

  return (
    <div className="space-y-8">
      {/* Introduction Header */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 rounded-full text-xs font-bold text-emerald-300">
            <Megaphone className="w-3.5 h-3.5" /> Viral Self-Marketing & SEO Hub
          </div>
          <h3 className="text-xl font-serif font-bold tracking-tight">
            Elevate "Jiyo Long Life" Across Social Media & Search Engines
          </h3>
          <p className="text-xs text-emerald-100/80 leading-relaxed max-w-2xl">
            Our platform utilizes advanced semantic indexers and organic social sharing. By looking up remedies or tablets below, you can generate ready-to-use search engine schemas (JSON-LD) and direct sharing cards. When searched on Google, Bing, or Social Media, our platform shines!
          </p>
        </div>
      </div>

      {/* Interactive Medicine & Tablet Directory Search */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-100/50 space-y-6">
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800 mb-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" /> Search Medicines, Tablets & Health Weaknesses
          </h4>
          <p className="text-[11px] text-gray-500 font-medium">
            Find details on any formulation and see how search engines like Google register this platform's solutions.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Type tablet/medicine name (e.g. Sudarshan Vati, Triphala, Ashwagandha, Immunity)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800"
          />
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Database Matches ({filteredMeds.length})
            </p>
            {filteredMeds.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                <ShieldAlert className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-600">Medicine not found in local index</p>
                <p className="text-[10px] text-slate-400 mt-1">But you can still search the internet or enter custom medicine names below!</p>
              </div>
            ) : (
              filteredMeds.map((med) => (
                <button
                  key={med.name}
                  onClick={() => setSelectedMed(med)}
                  className={`w-full text-left p-3 rounded-2xl transition-all border ${
                    selectedMed?.name === med.name
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-sm shadow-emerald-50'
                      : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{med.name}</h5>
                      <p className="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">{med.marathiName}</p>
                    </div>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                      {med.category.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-medium">{med.indicatesFor}</p>
                </button>
              ))
            )}
          </div>

          {/* Details & SEO / Social Optimization Panel */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-150 flex flex-col justify-between min-h-[300px]">
            {selectedMed ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                      {selectedMed.category}
                    </span>
                    <button 
                      onClick={() => handleWebSearch(selectedMed.name)}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-all"
                      title="See Google Search visibility"
                    >
                      <Globe className="w-3.5 h-3.5" /> Web Search <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-2 font-serif">{selectedMed.name}</h4>
                  <p className="text-xs text-slate-600 font-bold font-mono text-emerald-800 mt-0.5">{selectedMed.marathiName}</p>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-100 text-[11px] text-slate-700">
                    <strong className="text-slate-900 block mb-0.5">Indications:</strong>
                    {selectedMed.indicatesFor}
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-100 text-[11px] text-slate-700">
                    <strong className="text-slate-900 block mb-0.5">Cellular/Micro-Level Action:</strong>
                    {selectedMed.cellularAction}
                  </div>
                </div>

                {/* Target SEO Keywords */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Google SEO Indexing Keywords
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedMed.seoKeywords.map((kw) => (
                      <span 
                        key={kw} 
                        onClick={() => handleWebSearch(kw)}
                        className="text-[9px] bg-slate-200/60 hover:bg-slate-200 text-slate-700 font-mono font-medium px-2 py-0.5 rounded-lg cursor-pointer transition-all flex items-center gap-0.5"
                      >
                        {kw} <Search className="w-2.5 h-2.5 text-slate-400" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                <h5 className="text-xs font-bold text-slate-700">Select a Formulation</h5>
                <p className="text-[10px] text-slate-400 max-w-xs">
                  Choose a medicine from the left list to generate SEO Meta schemas, search engine result page listings, and viral social media shares.
                </p>
              </div>
            )}

            {selectedMed && (
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(generateSchemaJSON(selectedMed), 'schema')}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-[10px] font-bold text-slate-700 transition-all"
                >
                  {copiedText === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Google Schema Markup
                </button>
                <button
                  onClick={() => handleCopy(getShareMessage(selectedMed.name), 'share_sms')}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-[10px] font-bold text-white transition-all shadow-sm shadow-emerald-100"
                >
                  {copiedText === 'share_sms' ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  Copy Viral Social Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Engine & Internet Listing Optimizer Simulation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-100/50 space-y-6">
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800 mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-600" /> Google Search Engine (SEO) Visibility Simulator
          </h4>
          <p className="text-[11px] text-gray-500 font-medium">
            See how the platform registers in worldwide search indexes when crawling for medical tablets or diseases.
          </p>
        </div>

        {/* Simulated Google Listing Card */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 font-sans">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold">Simulated Google Rank #1</span>
            <span>https://jiyolonglife.platform/medicines/{selectedMed ? selectedMed.name.toLowerCase().replace(/\s+/g, '-') : 'all-disease-remedies'}</span>
          </div>
          <div className="space-y-1">
            <h5 className="text-[#1a0dab] hover:underline text-sm font-semibold cursor-pointer leading-tight">
              {selectedMed ? `${selectedMed.name} (${selectedMed.marathiName}) Remedy | Cellular Health Plan` : 'Jiyo Long Life - 100% Ayurvedic Medicine & Allopathic Technology Platform'}
            </h5>
            <p className="text-xs text-[#4d5156] leading-relaxed">
              {selectedMed 
                ? `Explore detailed allopathic & herbal remedies for ${selectedMed.indicatesFor}. Completely heal weak body systems at micro & macro levels within days. Zero side-effects.`
                : 'Instantly consult names of all diseases and remedies. Driven by thousands of years of ancient wisdom and advanced modern diagnostic algorithms. Fully heal every cell.'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-[#202124] pt-1">
            <span className="flex items-center gap-1 font-semibold"><Check className="w-3 h-3 text-emerald-600" /> Mobile Index Friendly</span>
            <span className="font-semibold text-emerald-800"><Sparkles className="w-3 h-3 text-amber-500 inline-block mr-0.5" /> High Rank Score</span>
          </div>
        </div>

        {/* Custom Search Term Submission for Self-Marketing */}
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
          <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-700 animate-bounce" /> Add custom medicine or disease term to index:
          </h5>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Paracetamol, Diabetes cure, Joint Pain tablets..."
              value={customMedQuery}
              onChange={(e) => setCustomMedQuery(e.target.value)}
              className="flex-1 bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 text-slate-800"
            />
            <button
              onClick={() => {
                if (customMedQuery) {
                  handleWebSearch(customMedQuery);
                  setCustomMedQuery('');
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Simulate & Verify Search
            </button>
          </div>
        </div>
      </div>

      {/* Social Media Optimization (SMO) Sharing Center */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-100/50 space-y-6">
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800 mb-1 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-purple-600 animate-pulse" /> Viral Social Media Post Optimizer
          </h4>
          <p className="text-[11px] text-gray-500 font-medium">
            Launch instant sharing to all prominent social networks so the platform spreads viral backlinks.
          </p>
        </div>

        {/* Share buttons group */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => {
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareMessage(selectedMed?.name))}`;
              window.open(url, '_blank');
            }}
            className="flex items-center justify-center gap-2 p-3 bg-[#1da1f2]/10 hover:bg-[#1da1f2]/20 border border-[#1da1f2]/20 rounded-2xl text-[#1da1f2] transition-all text-xs font-bold"
          >
            <Twitter className="w-4 h-4 fill-[#1da1f2]" /> Post on X / Twitter
          </button>

          <button
            onClick={() => {
              const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getPlatformURL())}`;
              window.open(url, '_blank');
            }}
            className="flex items-center justify-center gap-2 p-3 bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border border-[#1877f2]/20 rounded-2xl text-[#1877f2] transition-all text-xs font-bold"
          >
            <Facebook className="w-4 h-4 fill-[#1877f2]" /> Share on Facebook
          </button>

          <button
            onClick={() => {
              const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(getShareMessage(selectedMed?.name))}`;
              window.open(url, '_blank');
            }}
            className="flex items-center justify-center gap-2 p-3 bg-[#25d366]/10 hover:bg-[#25d366]/20 border border-[#25d366]/20 rounded-2xl text-[#25d366] transition-all text-xs font-bold"
          >
            <MessageSquare className="w-4 h-4 fill-[#25d366]" /> Send on WhatsApp
          </button>

          <button
            onClick={() => {
              const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getPlatformURL())}`;
              window.open(url, '_blank');
            }}
            className="flex items-center justify-center gap-2 p-3 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/20 rounded-2xl text-[#0077b5] transition-all text-xs font-bold"
          >
            <Linkedin className="w-4 h-4 fill-[#0077b5]" /> Share on LinkedIn
          </button>
        </div>

        {/* Live Social Post Preview Block */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            Simulated Social Feed Card Preview
          </p>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm max-w-md mx-auto">
            <div className="bg-slate-900 aspect-video flex flex-col items-center justify-center p-6 text-center text-white relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-900 opacity-90"></div>
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-200">
                  <Heart className="w-3 h-3 fill-emerald-300" /> Jiyo Long Life Platform
                </div>
                <h4 className="text-xs font-serif font-black tracking-tight leading-tight">
                  {selectedMed ? `Consult Ayurvedic ${selectedMed.name} Remedies Online` : 'Divine AI Body Reconstruction Platform'}
                </h4>
                <p className="text-[9px] text-slate-200 font-medium">
                  Micro & Macro cellular rejuvenation for complete health.
                </p>
              </div>
            </div>
            <div className="p-3 bg-white space-y-1">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">jiyolonglife.platform</span>
              <h5 className="text-[11px] font-bold text-slate-800 leading-tight">
                {selectedMed ? `${selectedMed.name} Remedies - Complete Cellular Treatment & Longevity Guidance` : 'Names of all Diseases & Divine Ayurvedic/Allopathic Remedies'}
              </h5>
              <p className="text-[10px] text-gray-500 line-clamp-1">
                Explore the thousands of years of experiential remedies trusted globally for zero-side-effect health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
