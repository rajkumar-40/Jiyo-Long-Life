import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  MousePointerClick, 
  Eye, 
  Award, 
  Heart, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  Clock,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdCampaign {
  id: string;
  partner: string;
  product: string;
  description: string;
  descriptionMR: string;
  cpcRate: number; // in USD
  logo: string;
  ctaText: string;
}

const SPONSORS: AdCampaign[] = [
  {
    id: "sp-1",
    partner: "Himalaya Herbal Organics",
    product: "Pure Ashwagandha Extract",
    description: "Support immunity, boost energy levels, and enhance mental focus.",
    descriptionMR: "रोगप्रतिकारक शक्ती, ऊर्जा आणि मानसिक लक्ष वाढवा.",
    cpcRate: 0.85,
    logo: "🌿",
    ctaText: "Explore Organic Herbs"
  },
  {
    id: "sp-2",
    partner: "Patanyali Divine Pharmacy",
    product: "Amla Juice & Triphala Pack",
    description: "Rejuvenate digestions and optimize colon health at the cellular level.",
    descriptionMR: "पचनक्रिया पुनरुज्जीवित करा आणि पचन संस्था निरोगी ठेवा.",
    cpcRate: 0.65,
    logo: "🔋",
    ctaText: "Shop Detox Superfoods"
  },
  {
    id: "sp-3",
    partner: "Jiyo Wellness Labs",
    product: "Advanced Multivitamin Formula",
    description: "Premium cellular defense mechanism packed with vital trace minerals.",
    descriptionMR: "महत्वाच्या खनिजांनी समृद्ध प्रगत पेशी संरक्षण फॉर्म्युला.",
    cpcRate: 1.10,
    logo: "🛡️",
    ctaText: "Activate Cells Now"
  },
  {
    id: "sp-4",
    partner: "Narayana Ayurvedic Oils",
    product: "Siddha Pain Relief Oil",
    description: "Instant relief from joint and muscle fatigue using 100% warm extracts.",
    descriptionMR: "सांधेदुखी आणि स्नायूंच्या थकव्यापासून त्वरित आराम मिळवा.",
    cpcRate: 0.75,
    logo: "💧",
    ctaText: "Get Joint Relief"
  }
];

export default function RevenueDashboard() {
  // Read existing counters from localStorage or initialize
  const [clicks, setClicks] = useState(() => {
    const saved = localStorage.getItem('jiyo_revenue_clicks');
    return saved ? parseInt(saved, 10) : 48;
  });
  const [impressions, setImpressions] = useState(() => {
    const saved = localStorage.getItem('jiyo_revenue_impressions');
    return saved ? parseInt(saved, 10) : 1240;
  });
  const [earnings, setEarnings] = useState(() => {
    const saved = localStorage.getItem('jiyo_revenue_earnings');
    return saved ? parseFloat(saved) : 41.25;
  });

  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracker' | 'ledger' | 'guide'>('tracker');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('jiyo_revenue_clicks', clicks.toString());
    localStorage.setItem('jiyo_revenue_impressions', impressions.toString());
    localStorage.setItem('jiyo_revenue_earnings', earnings.toFixed(2));
  }, [clicks, impressions, earnings]);

  // Simulate passive organic traffic impressions
  useEffect(() => {
    const interval = setInterval(() => {
      setImpressions(prev => prev + 1);
      // Minimal passive earning increment (e.g. $0.01 per impression)
      setEarnings(prev => prev + 0.01);
    }, 15000); // every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSponsorClick = (campaign: AdCampaign) => {
    setClicks(prev => prev + 1);
    setEarnings(prev => prev + campaign.cpcRate);
    setLastAction(`+$${campaign.cpcRate.toFixed(2)} added from ${campaign.partner} Click!`);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 800);

    // Open target dummy link securely
    const searchQuery = `https://www.google.com/search?q=${encodeURIComponent(campaign.partner + " " + campaign.product)}`;
    window.open(searchQuery, '_blank', 'noopener,noreferrer');
  };

  const handleManualAdClickSimulation = () => {
    const rate = 0.50;
    setClicks(prev => prev + 1);
    setEarnings(prev => prev + rate);
    setLastAction(`+$${rate.toFixed(2)} generated via organic platform interaction!`);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 800);
  };

  const resetStats = () => {
    if (confirm("Are you sure you want to restart your simulated monetization counter?")) {
      setClicks(0);
      setImpressions(100);
      setEarnings(0.00);
      setLastAction("Monetization counter reset.");
    }
  };

  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  const avgCpc = clicks > 0 ? (earnings / clicks).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Monetization Header */}
      <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 rounded-full text-xs font-bold text-amber-300">
            <TrendingUp className="w-3.5 h-3.5" /> Ad Network & Revenue Model
          </div>
          <h3 className="text-xl font-serif font-bold tracking-tight">
            Integrated Platform Monetization System
          </h3>
          <p className="text-xs text-amber-100/80 leading-relaxed max-w-2xl">
            This module models the revenue flow generated when users visit "Jiyo Long Life", view details, or interact with diagnostic remedies. Below is your active real-time ledger demonstrating the payout structure for ad clicks, partner sponsorships, and donations.
          </p>
        </div>
      </div>

      {/* Local Tab Navigation for Revenue Dashboard */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'tracker' 
              ? 'border-amber-600 text-amber-900' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Live Earnings Tracker
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'ledger' 
              ? 'border-amber-600 text-amber-900' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Payment Statements
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'guide' 
              ? 'border-amber-600 text-amber-900' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Ad Setup Guide
        </button>
      </div>

      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Revenue Matrix Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-b from-amber-50/50 to-amber-50/10 p-4 rounded-2xl border border-amber-100/80 relative">
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg inline-block mb-2">
                <DollarSign className="w-4 h-4" />
              </span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estimated Revenue</p>
              <h4 className="text-xl font-mono font-black text-amber-950 mt-1 flex items-center gap-1">
                ${earnings.toFixed(2)}
                {showAnimation && (
                  <span className="text-xs text-emerald-600 animate-bounce font-bold">+$</span>
                )}
              </h4>
              <p className="text-[9px] text-amber-700/80 font-bold mt-1">₹{(earnings * 83).toFixed(0)} INR Equivalent</p>
            </div>

            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg inline-block mb-2">
                <MousePointerClick className="w-4 h-4" />
              </span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Ad Clicks</p>
              <h4 className="text-xl font-mono font-black text-slate-800 mt-1">{clicks}</h4>
              <p className="text-[9px] text-slate-500 font-bold mt-1">From all visitor interactions</p>
            </div>

            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg inline-block mb-2">
                <Eye className="w-4 h-4" />
              </span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Impressions</p>
              <h4 className="text-xl font-mono font-black text-slate-800 mt-1">{impressions}</h4>
              <p className="text-[9px] text-slate-500 font-bold mt-1">Increments organically</p>
            </div>

            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <span className="p-1.5 bg-slate-100 text-slate-700 rounded-lg inline-block mb-2">
                <Award className="w-4 h-4" />
              </span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average CPC / CTR</p>
              <h4 className="text-sm font-mono font-black text-slate-800 mt-1">
                ${avgCpc} / {ctr}%
              </h4>
              <p className="text-[9px] text-slate-500 font-bold mt-1">Cost Per Click ratio</p>
            </div>
          </div>

          {/* Toast action update */}
          {lastAction && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center justify-between font-bold animate-fade-in">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" /> {lastAction}
              </span>
              <button 
                onClick={() => setLastAction(null)} 
                className="text-[10px] uppercase text-amber-700 hover:text-amber-950 font-black"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Interactive Sponsors section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md shadow-slate-100/40 space-y-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800 mb-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" /> Live CPC Sponsor Partner Links
              </h4>
              <p className="text-[11px] text-gray-500 font-medium">
                Clicking on these health sponsors simulates dynamic ad revenue generation on the platform. Try clicking to watch your balance climb!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SPONSORS.map((sp) => (
                <div 
                  key={sp.id} 
                  className="p-4 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/60 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{sp.logo}</span>
                      <span className="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                        CPC: +${sp.cpcRate.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{sp.partner}</h5>
                      <p className="text-[10px] text-emerald-800 font-bold font-mono">{sp.product}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {sp.description}
                    </p>
                    <p className="text-[10px] text-gray-400 italic font-medium">
                      {sp.descriptionMR}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSponsorClick(sp)}
                    className="mt-4 w-full py-2 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-[10px] font-black uppercase tracking-wider text-amber-950 transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    {sp.ctaText} <ArrowUpRight className="w-3 h-3 text-amber-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Global Platform Click Simulator */}
          <div className="bg-slate-50 border border-slate-150 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <MousePointerClick className="w-4 h-4 text-amber-600" /> Simulate Platform Interaction Click
              </h5>
              <p className="text-[11px] text-gray-500 font-medium max-w-md">
                Every generic button click, report export, or audio diagnosis generates premium impressions which can be monetized with a $0.50 CPM/CPC rate.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleManualAdClickSimulation}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Simulate Click
              </button>
              <button
                onClick={resetStats}
                className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition-all"
                title="Reset Simulation Counter"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md shadow-slate-100/40 space-y-6">
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Platform Payout Ledger & Invoice Statement
            </h4>
            <p className="text-[11px] text-gray-500 font-medium">
              Monthly consolidated summary sheet formatted for payouts to your configured UPI ID.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Configured Payout Method
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <span className="text-xs text-slate-700 font-semibold">
                UPI Direct Transfer (Unified Payments Interface)
              </span>
              <span className="text-xs font-mono font-black text-emerald-950 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">
                +91 77 57 017 131
              </span>
            </div>
          </div>

          {/* Statement Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[9px] font-black border-b border-slate-100">
                <tr>
                  <th className="p-3">Payout Period</th>
                  <th className="p-3">Ad Network Method</th>
                  <th className="p-3">Impressions</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Estd. Earnings</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr>
                  <td className="p-3 font-semibold">Current (Simulated)</td>
                  <td className="p-3 font-mono">Media.net CPC</td>
                  <td className="p-3 font-mono">{impressions}</td>
                  <td className="p-3 font-mono">{clicks}</td>
                  <td className="p-3 font-mono text-amber-700 font-bold">${earnings.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100">
                      Accruing
                    </span>
                  </td>
                </tr>
                <tr className="bg-slate-50/30">
                  <td className="p-3">May 1 - May 31, 2026</td>
                  <td className="p-3 font-mono">Google AdSense CPC</td>
                  <td className="p-3 font-mono">18,450</td>
                  <td className="p-3 font-mono">495</td>
                  <td className="p-3 font-mono text-emerald-700 font-bold">$382.40</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled (UPI)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Apr 1 - Apr 30, 2026</td>
                  <td className="p-3 font-mono">Unity Mediation SDK</td>
                  <td className="p-3 font-mono">12,110</td>
                  <td className="p-3 font-mono">280</td>
                  <td className="p-3 font-mono text-emerald-700 font-bold">$196.50</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled (UPI)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => alert("Statement compiled successfully. It is ready for your account records!")}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export Payout PDF
            </button>
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md shadow-slate-100/40 space-y-4">
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Code Implementation: How to Collect Real Revenue
            </h4>
            <p className="text-[11px] text-gray-500 font-medium">
              Step-by-step instructions for adding real monetization networks like Google AdSense to your live HTML files.
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-100">
              <p className="text-emerald-700 font-bold mb-2">// Step 1: Place your Google AdSense tag inside /index.html &lt;head&gt;</p>
              <code>{`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX" crossorigin="anonymous"></script>`}</code>
              
              <p className="text-emerald-700 font-bold mt-4 mb-2">// Step 2: Render Ad slots dynamically in your component markup</p>
              <code>{`<ins className="adsbygoogle"
     style={{ display: "block" }}
     data-ad-client="ca-pub-XXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`}</code>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-2">
              <h5 className="font-bold text-amber-950">💡 Maximum Payout Optimization:</h5>
              <ul className="list-disc pl-4 space-y-1.5 text-amber-900 leading-relaxed font-semibold">
                <li>Configure programmatic ad mediation (like Google AdMob or Unity Mediation) to match highest CPC offers.</li>
                <li>Ensure maximum traffic using our integrated SEO Index Keywords inside the "Remedies & SEO" directory!</li>
                <li>Keep content updated frequently with our AI-driven diagnostic report decoders.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
