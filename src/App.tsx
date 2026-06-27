import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  User, 
  Activity, 
  Download, 
  ShieldCheck, 
  Leaf, 
  FlaskConical, 
  Stethoscope, 
  Sparkles,
  Loader2,
  AlertTriangle,
  ChevronRight,
  Globe,
  Clock,
  ShoppingBag,
  Layers,
  Dumbbell,
  Scale,
  Radio,
  Smartphone,
  CheckCircle,
  FileText,
  Megaphone,
  TrendingUp,
  X
} from 'lucide-react';
import Markdown from 'react-markdown';
import { getHealthGuidance } from './services/geminiService';
import { HealthInput, HealthGuidance } from './types';
import LongLifeTab from './components/LongLifeTab';
import VoiceInputButton from './components/VoiceInputButton';
import PatientReportUploader from './components/PatientReportUploader';
import MarketingHub from './components/MarketingHub';
import RevenueDashboard from './components/RevenueDashboard';

function formatMarkdownToHTML(md: string): string {
  if (!md) return '';
  let html = md;
  // HTML escapes
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // bold text (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // single asterisks for italics (*text* or _text_)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // bullet points (- item or * item)
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>');
  
  // wrap group of list items in <ul>
  html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');
  
  // convert remaining line breaks to paragraph blocks
  const paragraphs = html.split(/\n{2,}/);
  const formattedParagraphs = paragraphs.map(p => {
    p = p.trim();
    if (p.startsWith('<ul') || p.startsWith('<li') || p.startsWith('</li')) {
      return p;
    }
    if (p === '') return '';
    return `<p>${p.replace(/\n/g, '<br />')}</p>`;
  });
  
  return formattedParagraphs.join('\n');
}

function getDonationNote(lang: string) {
  const normalized = (lang || '').toLowerCase();
  if (normalized.includes('marathi') || normalized.includes('mr')) {
    return {
      title: "सहकार्य आणि देणगी सदिच्छा (Assistance & Donation Note)",
      message: "जर तुम्हाला इतरांकडून मिळालेले मार्गदर्शन किंवा सल्ला फायदेशीर ठरला असेल, तर कृपया खाली दिलेल्या UPI ID चा वापर करून या प्लॅटफॉर्मला देणगी (Donation) द्या. तुमची तब्येत सदैव निरोगी आणि उत्तम राहो हीच सदिच्छा!",
      label: "UPI देणगी क्रमांक (UPI Donation Number)",
      id: "+91 77 57 017 131"
    };
  } else if (normalized.includes('hindi') || normalized.includes('hi')) {
    return {
      title: "सहायता और दान संदेश (Assistance & Donation Note)",
      message: "यदि आपको दूसरों से प्राप्त मार्गदर्शन या सलाह मददगार लगी हो, तो कृपया दिए गए UPI ID का उपयोग करके इस प्लेटफॉर्म को दान करें। हम हृदय से कामना करते हैं कि आपका स्वास्थ्य भी सदैव उत्तम और निरोगी रहे।",
      label: "UPI दान नंबर (UPI Donation Number)",
      id: "+91 77 57 017 131"
    };
  } else {
    return {
      title: "Assistance & Donation Note",
      message: "If you have received guidance or advisory from others, and it has been helpful to you, then kindly donate to this platform using the provided UPI ID. Wish that your health also remains good.",
      label: "UPI Donation Number",
      id: "+91 77 57 017 131"
    };
  }
}

export default function App() {
  const [input, setInput] = useState<HealthInput>({
    name: '',
    age: '',
    gender: 'Male',
    symptoms: '',
    pastIllnesses: '',
    language: 'Marathi',
    files: []
  });
  const [customLanguage, setCustomLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthGuidance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [showTerms, setShowTerms] = useState(false);

  // Active tab state: 'guidance' or 'longevity' or 'marketing' or 'revenue'
  const [activeTab, setActiveTab] = useState<'guidance' | 'longevity' | 'marketing' | 'revenue'>('guidance');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.name || !input.age || !input.symptoms) {
      setError('Please fill in Name, Age, and Symptoms.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const languageToUse = input.language === 'Other' ? customLanguage : input.language;
      const guidance = await getHealthGuidance({
        ...input,
        language: languageToUse || 'English'
      });
      setResult(guidance);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching guidance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    
    setLoading(true);
    try {
      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then(m => m.default),
        import('jspdf')
      ]);

      const canvas = await html2canvas(resultRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`JiyoLongLife_Report_${input.age}_${input.gender}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadHTML = () => {
    if (!result) return;
    
    const note = getDonationNote(input.language);
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jiyo Long Life - Divine Health Guidance Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    
    :root {
      --primary: #1b5e20;
      --primary-light: #2e7d32;
      --accent: #ef6c00;
      --bg: #fdfcf8;
      --card-bg: #ffffff;
      --text: #2c3e50;
      --text-muted: #546e7a;
      --border: #f0f0f0;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 900px;
      margin: 40px auto;
      padding: 0 20px;
    }

    header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid var(--border);
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .brand-icon {
      width: 44px;
      height: 44px;
      background-color: var(--primary-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
    }

    .logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--primary);
      margin: 0;
    }

    .subtitle {
      font-size: 1rem;
      color: var(--text-muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-weight: 600;
      margin-top: 5px;
    }

    .patient-card {
      background: white;
      border-radius: 24px;
      padding: 24px;
      margin-bottom: 30px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .patient-info-item h4 {
      margin: 0 0 4px 0;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
    }

    .patient-info-item p {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text);
    }

    .section {
      background: white;
      border-radius: 24px;
      padding: 30px;
      margin-bottom: 30px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 24px rgba(0,0,0,0.02);
      transition: transform 0.2s ease;
    }

    .section:hover {
      transform: translateY(-2px);
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .text-orange { color: #e65100; border-bottom: 2px solid #ffe0b2; padding-bottom: 8px; width: 100%; }
    .text-blue { color: #01579b; border-bottom: 2px solid #b3e5fc; padding-bottom: 8px; width: 100%; }
    .text-rose { color: #c2185b; border-bottom: 2px solid #f8bbd0; padding-bottom: 8px; width: 100%; }
    .text-teal { color: #00695c; border-bottom: 2px solid #b2dfdb; padding-bottom: 8px; width: 100%; }
    .text-emerald { color: #2e7d32; border-bottom: 2px solid #c8e6c9; padding-bottom: 8px; width: 100%; }
    .text-red { color: #c62828; border-bottom: 2px solid #ffcdd2; padding-bottom: 8px; width: 100%; }
    .text-slate { color: #37474f; border-bottom: 2px solid #cfd8dc; padding-bottom: 8px; width: 100%; }

    .bg-amber-light { background-color: #fffde7; border: 1px solid #fff59d; }
    .bg-blue-light { background-color: #e1f5fe; border: 1px solid #b3e5fc; }
    .bg-rose-light { background-color: #fce4ec; border: 1px solid #f8bbd0; }
    .bg-teal-light { background-color: #e0f2f1; border: 1px solid #b2dfdb; }
    .bg-red-light { background-color: #ffebee; border: 1px solid #ffcdd2; }
    .bg-emerald-light { background-color: #e8f5e9; border: 1px solid #c8e6c9; }

    .section-content {
      font-size: 0.95rem;
      color: #37474f;
      line-height: 1.7;
    }

    .section-content p {
      margin-top: 0;
      margin-bottom: 12px;
    }

    .section-content ul, .section-content ol {
      margin-top: 0;
      margin-bottom: 16px;
      padding-left: 24px;
    }

    .section-content li {
      margin-bottom: 8px;
    }

    .timetable {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
    }

    .disclaimer {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: center;
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
      font-style: italic;
    }

    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    @media (max-width: 600px) {
      .container {
        margin: 20px auto;
      }
      .section {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="brand-icon">ॐ</div>
        <h1 class="logo-text">Jiyo Long Life</h1>
      </div>
      <div class="subtitle">Divine Reconstruction & Longevity Report</div>
    </header>

    <div class="patient-card">
      <div class="patient-info-item" style="grid-column: span 2; background-color: #f1f8e9; border-radius: 12px; padding: 12px; border: 1px solid #dcedc8;">
        <h4 style="color: #2e7d32; font-weight: 800;">Patient Name (रुग्णाचे नाव)</h4>
        <p style="color: #1b5e20; font-size: 1.3rem; font-family: 'Playfair Display', serif;">${result.patientName || input.name}</p>
      </div>
      <div class="patient-info-item">
        <h4>Age Group</h4>
        <p>${input.age}</p>
      </div>
      <div class="patient-info-item">
        <h4>Biological Gender</h4>
        <p>${input.gender}</p>
      </div>
      <div class="patient-info-item">
        <h4>Report Language</h4>
        <p>${input.language === 'Other' ? customLanguage : input.language}</p>
      </div>
      <div class="patient-info-item">
        <h4>Generated On</h4>
        <p>${new Date().toLocaleDateString()}</p>
      </div>
      <div class="patient-info-item" style="grid-column: span 2;">
        <h4>Recorded Past Illnesses & Medical History</h4>
        <p>${input.pastIllnesses || 'None declared'}</p>
      </div>
    </div>

    <div class="section bg-amber-light" style="border: 2px solid #ef6c00; background-color: #fffde7; margin-bottom: 30px;">
      <h2 class="section-title text-orange" style="color: #d84315;">Divine Health Advisory & Consultation Notice</h2>
      <div class="section-content" style="color: #5d4037; font-weight: 600;">
        <p><strong>Marathi:</strong> तुम्ही पुरवलेली लक्षणे आणि नोंदवलेल्या मागील आजारांच्या सविस्तर माहितीच्या आधारे आम्ही हे उपचार मार्गदर्शन करत आहोत. कृपया तुमच्या वैयक्तिक डॉक्टरांचा/वैद्यकीय तज्ज्ञांचा सल्ला नक्की घ्या, डॉक्टरांचे मत विचारात घ्या आणि आवश्यक ती पावले उचला. आम्ही तुमच्यासाठी केवळ सहाय्यक आरोग्य मार्गदर्शन प्रदान करत आहोत.</p>
        <p><strong>English:</strong> Based on the detailed symptoms and recorded past illnesses you have provided, we are guiding your treatment. Please seek immediate advice from your personal physician, take all necessary clinical/medical steps, and take the advice of doctors as well. We are only providing supportive educational guidance for you.</p>
      </div>
    </div>

    <div class="section bg-emerald-light" style="border: 2px solid #2e7d32; background-color: #e8f5e9;">
      <h2 class="section-title text-emerald" style="color: #1b5e20;">Immediate Treatment Start & Vigor Generation (त्वरित उपचार आणि उत्साहवर्धन)</h2>
      <div class="section-content" style="color: #1b5e20; font-weight: 600;">${formatMarkdownToHTML(result.immediateTreatmentStart)}</div>
    </div>

    <div class="section bg-red-light" style="border: 2px solid #c62828; background-color: #ffebee;">
      <h2 class="section-title text-red" style="color: #b71c1c;">Strictly What NOT To Do - Contraindications (अपथ्य - काय करू नये)</h2>
      <div class="section-content" style="color: #b71c1c; font-weight: 600;">${formatMarkdownToHTML(result.whatNotToDo)}</div>
    </div>

    <div class="section bg-teal-light" style="border: 1px solid #b2dfdb;">
      <h2 class="section-title text-teal">Body Purification Specialists & Panchakarma Acharyas (शरीर शुद्धी करणारे तज्ज्ञ आणि पंचकर्म)</h2>
      <div class="section-content">${formatMarkdownToHTML(result.bodyPurificationSpecialists)}</div>
    </div>

    <div class="section bg-amber-light">
      <h2 class="section-title text-orange">Symptom Analysis & Current Body Situation</h2>
      <div class="section-content">${formatMarkdownToHTML(result.bodySituationAndSymptoms)}</div>
    </div>

    <div class="section bg-blue-light">
      <h2 class="section-title text-blue">Recommended Diagnostic Tests (Blood, Saliva, Urine)</h2>
      <div class="section-content">${formatMarkdownToHTML(result.recommendedTests)}</div>
    </div>

    <div class="section bg-rose-light">
      <h2 class="section-title text-rose">Safe Temporary Support & Long-Term Cure Strategy</h2>
      <div class="section-content">${formatMarkdownToHTML(result.allopathicSupport)}</div>
    </div>

    <div class="section">
      <h2 class="section-title text-slate">Root Cause Analysis (Cellular to Macro Level)</h2>
      <div class="section-content">${formatMarkdownToHTML(result.rootCause)}</div>
    </div>

    <div class="section bg-emerald-light">
      <h2 class="section-title text-emerald">Fastest Ayurvedic Reconstruction Path</h2>
      <div class="section-content">${formatMarkdownToHTML(result.ayurvedicBase)}</div>
    </div>

    <div class="section">
      <h2 class="section-title text-emerald">Branded Ayurvedic Formulations & Ready-made Medicines</h2>
      <div class="section-content">${formatMarkdownToHTML(result.brandedMedicines)}</div>
    </div>

    <div class="section">
      <h2 class="section-title text-emerald">Optional Alternative Treatment Paths</h2>
      <div class="section-content">${formatMarkdownToHTML(result.optionalTreatments)}</div>
    </div>

    <div class="section bg-teal-light">
      <h2 class="section-title text-teal">Daily Longevity Timetable (Hour-by-Hour)</h2>
      <div class="section-content timetable">${formatMarkdownToHTML(result.dailyTimetable)}</div>
    </div>

    <div class="section bg-teal-light">
      <h2 class="section-title text-teal">Dosage, Quantity & Over/Under-Consumption Analysis</h2>
      <div class="section-content">${formatMarkdownToHTML(result.dosageAndOverUnderConsumptionDetails)}</div>
    </div>

    <div class="section bg-teal-light">
      <h2 class="section-title text-teal">Active Physical Therapy & Exercises (Therapies & Yoga)</h2>
      <div class="section-content">${formatMarkdownToHTML(result.exerciseAndTherapyGuidance)}</div>
    </div>

    <div class="section">
      <h2 class="section-title text-slate">Ancient to Modern Advanced Surgical & Treatment Procedures</h2>
      <div class="section-content">${formatMarkdownToHTML(result.surgicalAndAdvancedTherapy)}</div>
    </div>

    <div class="section">
      <h2 class="section-title text-slate">Demographic Adaptability (Tailored for Age & Gender Biological Profiles)</h2>
      <div class="section-content">${formatMarkdownToHTML(result.demographicAdaptation)}</div>
    </div>

    <div class="section">
      <h2 class="section-title text-slate">Vitamin & Nutrient Bases</h2>
      <div class="section-content">${formatMarkdownToHTML(result.vitaminBase)}</div>
    </div>

    <div class="section">
      <h2 class="section-title text-slate">Homeopathic Energy Remedies</h2>
      <div class="section-content">${formatMarkdownToHTML(result.homeopathicBase)}</div>
    </div>

    <div class="section bg-red-light">
      <h2 class="section-title text-red">Critical Medicine Verification & Local Doctor Safety Advisories</h2>
      <div class="section-content">${formatMarkdownToHTML(result.medicineVerificationSafetyCheck)}</div>
    </div>

    <div class="section bg-red-light">
      <h2 class="section-title text-red">Effects & Healing Sensations Analysis</h2>
      <div class="section-content">${formatMarkdownToHTML(result.effectsAndSideEffects)}</div>
    </div>

    <div class="section bg-red-light">
      <h2 class="section-title text-red">Medicine Impact & Detailed Recovery Timelines</h2>
      <div class="section-content">${formatMarkdownToHTML(result.impactAndRecoveryDuration)}</div>
    </div>

    <div class="section bg-blue-light" style="text-align: center; font-style: italic;">
      <h2 class="section-title text-blue" style="justify-content: center;">Divine Rishi Blessings & Reassurance</h2>
      <div class="section-content" style="font-size: 1.1rem; color: #01579b;">${formatMarkdownToHTML(result.reassuranceMessage)}</div>
    </div>

    <div class="section" style="border: 2px solid #fff176; background-color: #fffde7; margin-bottom: 30px; border-radius: 24px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.02);">
      <h2 class="section-title" style="color: #e65100; border-bottom: 2px solid #fff176; padding-bottom: 8px; font-size: 1.1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">❤️ ${note.title}</h2>
      <div class="section-content" style="color: #5d4037; font-weight: 600; font-size: 0.95rem; line-height: 1.7;">
        <p>${note.message}</p>
        <div style="background-color: rgba(255,255,255,0.7); padding: 12px; border-radius: 12px; border: 1px solid #fff59d; margin-top: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #795548;">${note.label}</span>
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 1rem; font-weight: 800; color: #5d4037; background-color: #ffe082; padding: 4px 10px; border-radius: 6px;">${note.id}</span>
        </div>
      </div>
    </div>

    <div class="disclaimer">
      ${result.disclaimer}
    </div>

    <div class="footer">
      <p>© 2026 Jiyo Long Life Platform • Generated with Divine Inspiration and Advanced Intelligence</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JiyoLongLife_Divine_Report_${input.age}_${input.gender}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-[#2c3e50] font-sans selection:bg-[#e8f5e9] selection:text-[#2e7d32]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e0e0e0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#2e7d32] rounded-full flex items-center justify-center shadow-lg shadow-green-200">
              <Heart className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-[#1b5e20]">
              Jiyo <span className="text-[#4caf50]">Long Life</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#546e7a]">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#2e7d32]" /> 100% Ayurvedic Healing</span>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-[#ef6c00]" /> Divine Rishi Wisdom</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className={(result || activeTab === 'marketing' || activeTab === 'revenue') ? "grid grid-cols-1 lg:grid-cols-12 gap-12" : "max-w-2xl mx-auto"}>
          
          {/* Input Section */}
          <div className={(result || activeTab === 'marketing' || activeTab === 'revenue') ? "lg:col-span-5" : "w-full"}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100 border border-[#f0f0f0]"
            >
              <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
                <Activity className="text-[#4caf50]" /> Health Dashboard
              </h2>
 
              {/* TAB SELECTORS */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#f5f7f8] rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('guidance')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'guidance'
                      ? 'bg-[#2e7d32] text-white shadow-md shadow-green-100'
                      : 'text-[#78909c] hover:text-[#2e7d32]'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" /> Guidance
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('longevity')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'longevity'
                      ? 'bg-[#2e7d32] text-white shadow-md shadow-green-100'
                      : 'text-[#78909c] hover:text-[#2e7d32]'
                  }`}
                >
                  <Leaf className="w-3.5 h-3.5 text-[#4caf50]" /> Long Life
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('marketing')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'marketing'
                      ? 'bg-[#2e7d32] text-white shadow-md shadow-green-100'
                      : 'text-[#78909c] hover:text-[#2e7d32]'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Remedies & SEO
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('revenue')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'revenue'
                      ? 'bg-amber-700 text-white shadow-md shadow-amber-100'
                      : 'text-[#78909c] hover:text-amber-700'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Revenue ($)
                </button>
              </div>

              {activeTab === 'guidance' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#90a4ae]">Patient Name / रुग्णाचे नाव</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#cfd8dc]" />
                      <input 
                        type="text" 
                        placeholder="e.g. Ramesh Patil"
                        className="w-full pl-10 pr-4 py-3 bg-[#f5f7f8] border-none rounded-xl focus:ring-2 focus:ring-[#4caf50] transition-all text-sm font-medium"
                        value={input.name}
                        onChange={(e) => setInput({...input, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#90a4ae]">Age</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#cfd8dc]" />
                        <input 
                          type="text" 
                          placeholder="e.g. 25 or 1 day"
                          className="w-full pl-10 pr-4 py-3 bg-[#f5f7f8] border-none rounded-xl focus:ring-2 focus:ring-[#4caf50] transition-all"
                          value={input.age}
                          onChange={(e) => setInput({...input, age: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#90a4ae]">Gender</label>
                      <select 
                        className="w-full px-4 py-3 bg-[#f5f7f8] border-none rounded-xl focus:ring-2 focus:ring-[#4caf50] transition-all appearance-none"
                        value={input.gender}
                        onChange={(e) => setInput({...input, gender: e.target.value})}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#90a4ae]">Preferred Output Language / भाषा</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#cfd8dc]" />
                      <select 
                        className="w-full pl-10 pr-4 py-3 bg-[#f5f7f8] border-none rounded-xl focus:ring-2 focus:ring-[#4caf50] transition-all appearance-none"
                        value={input.language}
                        onChange={(e) => setInput({...input, language: e.target.value})}
                      >
                        <option value="Marathi">Marathi (मराठी)</option>
                        <option value="Hindi">Hindi (हिन्दी)</option>
                        <option value="English">English</option>
                        <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                        <option value="Gujarati">Gujarati (ગુજરાती)</option>
                        <option value="Spanish">Spanish (Español)</option>
                        <option value="French">French (Français)</option>
                        <option value="German">German (Deutsch)</option>
                        <option value="Japanese">Japanese (日本語)</option>
                        <option value="Arabic">Arabic (العربية)</option>
                        <option value="Russian">Russian (Русский)</option>
                        <option value="Portuguese">Portuguese (Português)</option>
                        <option value="Chinese">Chinese (中文)</option>
                        <option value="Bengali">Bengali (বাংলা)</option>
                        <option value="Other">Other (Type below...)</option>
                      </select>
                    </div>
                    {input.language === 'Other' && (
                      <input
                        type="text"
                        placeholder="Type any language (e.g., Italian, Tamil, etc.)"
                        className="w-full mt-2 px-4 py-3 bg-[#f5f7f8] border-none rounded-xl focus:ring-2 focus:ring-[#4caf50] transition-all text-sm"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#90a4ae]">Symptoms & Details / लक्षणे आणि तपशील</label>
                      <VoiceInputButton 
                        language={input.language} 
                        onTranscript={(text) => setInput(prev => ({ ...prev, symptoms: prev.symptoms ? prev.symptoms + " " + text : text }))}
                      />
                    </div>
                    <textarea 
                      placeholder="Describe your symptoms, lifestyle, and concerns in detail..."
                      className="w-full px-4 py-3 bg-[#f5f7f8] border-none rounded-xl focus:ring-2 focus:ring-[#4caf50] transition-all min-h-[120px] resize-none"
                      value={input.symptoms}
                      onChange={(e) => setInput({...input, symptoms: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#90a4ae]">Past Illnesses & Medical History / मागील आजार आणि वैद्यकीय इतिहास</label>
                      <VoiceInputButton 
                        language={input.language} 
                        onTranscript={(text) => setInput(prev => ({ ...prev, pastIllnesses: prev.pastIllnesses ? prev.pastIllnesses + " " + text : text }))}
                      />
                    </div>
                    <textarea 
                      placeholder="Describe any past illnesses, chronic conditions, surgeries, or medical history..."
                      className="w-full px-4 py-3 bg-[#f5f7f8] border-none rounded-xl focus:ring-2 focus:ring-[#4caf50] transition-all min-h-[100px] resize-none"
                      value={input.pastIllnesses}
                      onChange={(e) => setInput({...input, pastIllnesses: e.target.value})}
                    />
                  </div>

                  {/* Multimodal File & Image Uploader */}
                  <PatientReportUploader 
                    files={input.files || []} 
                    onChange={(newFiles) => setInput(prev => ({ ...prev, files: newFiles }))} 
                    language={input.language}
                  />

                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Cellular Analysis in Progress...
                      </>
                    ) : (
                      <>
                        Get Expert Guidance
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-[#90a4ae]">
                    By clicking, you agree to our <button type="button" onClick={() => setShowTerms(true)} className="underline hover:text-[#2e7d32]">Terms & Conditions</button>
                  </p>
                </form>
              )}

              {activeTab === 'longevity' && (
                <LongLifeTab ageStr={input.age} gender={input.gender} language={input.language} />
              )}

              {activeTab === 'marketing' && (
                <div className="text-slate-600 space-y-4">
                  <p className="text-xs leading-relaxed font-semibold text-slate-500">
                    Explore our integrated Medicine & Remedies Directory search workspace on the right side of your dashboard tab! Share any remedy with patients or family across social channels to maximize visibility and establish safe organic SEO search results.
                  </p>
                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/60 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-900 leading-relaxed font-bold">
                      When users search for these remedies on Google, our high-index structured metadata will present this platform directly to help them heal.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'revenue' && (
                <div className="text-slate-600 space-y-4">
                  <p className="text-xs leading-relaxed font-semibold text-slate-500">
                    Welcome to the Jiyo Long Life monetization and support center! Here you can monitor accumulated earnings from active users, search result hits, and simulated ad clicks.
                  </p>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                    <Heart className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 fill-amber-500" />
                    <p className="text-[11px] text-amber-900 leading-relaxed font-bold">
                      Every single click and search on this platform supports medical accessibility and ensures we maintain complete, zero side-effect advice for humanity.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Donation Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-[#fff9c4] rounded-3xl p-6 border border-[#fff176] shadow-lg shadow-yellow-50"
            >
              <h3 className="text-lg font-serif font-bold text-[#f57f17] flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 fill-[#f57f17]" /> Support the Global Mission
              </h3>
              <p className="text-sm text-[#5d4037] leading-relaxed mb-4">
                This divine platform is built for the entire world. The guidance you receive today is made possible by the generous donations of others who came before you. 
              </p>
              <div className="bg-white/50 p-4 rounded-xl border border-[#fff176] mb-4">
                <p className="text-xs font-bold text-[#f57f17] uppercase tracking-wider mb-1">Donate via UPI</p>
                <p className="text-lg font-mono font-bold text-[#5d4037]">+91 77 57 017 131</p>
                <p className="text-[10px] text-[#8d6e63] mt-1 italic">Donate whatever your heart feels is right to keep this light burning for future generations.</p>
              </div>
              <p className="text-xs text-[#795548] font-medium">
                Help us help the next person. Your contribution ensures this platform never stops serving humanity.
              </p>
            </motion.div>

            {/* Info Cards */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 p-4 bg-[#e8f5e9]/50 rounded-2xl border border-[#c8e6c9]">
                <ShieldCheck className="text-[#2e7d32] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-[#1b5e20]">100% Ayurvedic Goal</h4>
                  <p className="text-xs text-[#546e7a]">Our mission is 100% Ayurvedic repair, using nature's purest elements for total body reconstruction.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[#e3f2fd]/50 rounded-2xl border border-[#bbdefb]">
                <Activity className="text-[#0277bd] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-[#01579b]">Cellular Regeneration</h4>
                  <p className="text-xs text-[#546e7a]">From the smallest insect to the longest-living human, we understand every cellular movement for perfect repair.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[#fff3e0]/50 rounded-2xl border border-[#ffe0b2]">
                <Sparkles className="text-[#ef6c00] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-[#e65100]">Divine Rishi Wisdom</h4>
                  <p className="text-xs text-[#546e7a]">Mastery over all Ayurvedic scriptures and the history of life on Earth.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {activeTab === 'marketing' ? (
                <motion.div
                  key="marketing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <MarketingHub />
                </motion.div>
              ) : activeTab === 'revenue' ? (
                <motion.div
                  key="revenue"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <RevenueDashboard />
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h3 className="text-2xl font-serif font-bold text-[#1b5e20]">Your Longevity Plan</h3>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={downloadPDF}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f5e9] text-xs font-bold text-[#2e7d32] rounded-xl hover:bg-[#c8e6c9] transition-all border border-[#c8e6c9]"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF Report
                      </button>
                      <button 
                        onClick={downloadHTML}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-xs font-bold text-blue-700 rounded-xl hover:bg-blue-100 transition-all border border-blue-200"
                      >
                        <Download className="w-3.5 h-3.5" /> HTML Report
                      </button>
                    </div>
                  </div>

                  {/* ADVISORY NOTIFICATION BANNER */}
                  <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-3xl shadow-md space-y-3">
                    <div className="flex items-center gap-3 text-[#d84315]">
                      <AlertTriangle className="w-6 h-6 shrink-0 animate-pulse text-[#d84315]" />
                      <h4 className="font-serif font-bold text-lg">
                        Divine Health Reconstruction Advisory (आरोग्य सल्ला व सूचना)
                      </h4>
                    </div>
                    <div className="text-sm leading-relaxed text-amber-950 space-y-2 font-medium">
                      <p>
                        <strong>Marathi:</strong> तुम्ही पुरवलेली लक्षणे आणि नोंदवलेल्या मागील आजारांच्या माहितीच्या आधारे आम्ही हे उपचार मार्गदर्शन करत आहोत. कृपया तुमच्या डॉक्टरांचा/वैद्यकीय तज्ज्ञांचा सल्ला घ्या, आवश्यक पावले उचला आणि डॉक्टरांचे मत विचारात घ्या. आम्ही तुमच्यासाठी केवळ मार्गदर्शन प्रदान करत आहोत.
                      </p>
                      <p>
                        <strong>English:</strong> Based on the symptoms and recorded past illnesses you have provided, we are guiding your treatment. Please seek advice from your personal physician, take all necessary clinical steps, and consult doctors. We are only providing supportive wellness guidance for you.
                      </p>
                    </div>
                  </div>

                  <div ref={resultRef} className="bg-white rounded-3xl p-8 shadow-xl border border-[#f0f0f0] space-y-8">
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800">
                          Prepared Exclusively For (रुग्णाचे नाव)
                        </span>
                        <h4 className="text-xl font-serif font-black text-emerald-950 mt-1">
                          {result.patientName || input.name}
                        </h4>
                      </div>
                      <div className="px-3 py-1.5 bg-white text-[#2e7d32] font-mono text-xs font-bold rounded-lg border border-emerald-100 shadow-sm">
                        ॐ Divine Health ID: {Math.floor(100000 + Math.random() * 900000)}
                      </div>
                    </div>

                    {/* Identifiable Analyzed Patient Reports & Symptom Images */}
                    {input.files && input.files.length > 0 && (
                      <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-slate-800">
                              Identifiable Analyzed Reports & Symptom Photos (विश्लेषण केलेले अहवाल आणि फोटो)
                            </h4>
                            <p className="text-[10px] text-gray-500 font-medium">
                              These patient documents were fully decoded and factored into this cellular reconstruction plan.
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {input.files.map((file, idx) => {
                            const isImg = file.mimeType.startsWith('image/');
                            return (
                              <div key={file.name + idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
                                  {isImg ? (
                                    <img src={file.base64} alt={file.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <FileText className="w-6 h-6 text-emerald-600" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                                    {file.name}
                                  </h5>
                                  <p className="text-[10px] font-bold text-emerald-700 uppercase mt-0.5 tracking-wider flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> Analyzed at Cell-Level
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    <section className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-300 shadow-md">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-900 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700 animate-pulse" /> Immediate Treatment Start & Vigor Generation (त्वरित रोगनिवारण आणि उत्साहवर्धन)
                      </h4>
                      <div className="prose prose-sm max-w-none text-emerald-950 leading-relaxed font-semibold">
                        <Markdown>{result.immediateTreatmentStart}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" /> Strictly What NOT To Do - Contraindications (अपथ्य - काय करू नये)
                      </h4>
                      <div className="prose prose-sm max-w-none text-red-950 leading-relaxed font-semibold">
                        <Markdown>{result.whatNotToDo}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-teal-50/70 rounded-2xl border border-teal-200">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-teal-800 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-teal-700" /> Body Purification Specialists & Panchakarma Acharyas (शरीर शुद्धी करणारे तज्ज्ञ आणि पंचकर्म)
                      </h4>
                      <div className="prose prose-sm max-w-none text-teal-950 leading-relaxed">
                        <Markdown>{result.bodyPurificationSpecialists}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-amber-50/70 rounded-2xl border border-amber-200">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-800 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-700" /> Current Body Situation & Symptom Analysis
                      </h4>
                      <div className="prose prose-sm max-w-none text-amber-950 leading-relaxed">
                        <Markdown>{result.bodySituationAndSymptoms}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-blue-50/70 rounded-2xl border border-blue-200">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-800 mb-3 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-blue-700" /> Recommended Lab Tests for Early Diagnosis (Blood/Urine/Saliva)
                      </h4>
                      <div className="prose prose-sm max-w-none text-blue-950 leading-relaxed">
                        <Markdown>{result.recommendedTests}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-rose-50/70 rounded-2xl border border-rose-200">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-800 mb-3 flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-rose-700" /> Safe Temporary Support vs Long-Term Cure Strategy
                      </h4>
                      <div className="prose prose-sm max-w-none text-rose-950 leading-relaxed">
                        <Markdown>{result.allopathicSupport}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-purple-50/70 rounded-2xl border border-purple-200">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-purple-800 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-700" /> Demographic Adaptability & Age/Gender Tailoring (वय आणि लिंगानुसार औषधोपचार बदल)
                      </h4>
                      <div className="prose prose-sm max-w-none text-purple-950 leading-relaxed">
                        <Markdown>{result.demographicAdaptation}</Markdown>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#90a4ae] mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Root Cause Analysis
                      </h4>
                      <div className="prose prose-sm max-w-none text-[#37474f] leading-relaxed">
                        <Markdown>{result.rootCause}</Markdown>
                      </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-[#f1f8e9] rounded-2xl border border-[#dcedc8]">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#33691e] mb-3 flex items-center gap-2">
                          <Leaf className="w-4 h-4" /> Ayurvedic Base
                        </h4>
                        <div className="text-sm text-[#33691e] leading-relaxed">
                          <Markdown>{result.ayurvedicBase}</Markdown>
                        </div>
                      </div>
                      <div className="p-6 bg-[#fff3e0] rounded-2xl border border-[#ffe0b2]">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#e65100] mb-3 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" /> Branded Ayurvedic Medicines
                        </h4>
                        <div className="text-sm text-[#e65100] leading-relaxed">
                          <Markdown>{result.brandedMedicines}</Markdown>
                        </div>
                      </div>
                      <div className="p-6 bg-[#f3e5f5] rounded-2xl border border-[#e1bee7]">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#7b1fa2] mb-3 flex items-center gap-2">
                          <Layers className="w-4 h-4" /> Optional Treatment Paths
                        </h4>
                        <div className="text-sm text-[#7b1fa2] leading-relaxed">
                          <Markdown>{result.optionalTreatments}</Markdown>
                        </div>
                      </div>
                      <div className="p-6 bg-[#e3f2fd] rounded-2xl border border-[#bbdefb]">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#01579b] mb-3 flex items-center gap-2">
                          <FlaskConical className="w-4 h-4" /> Homeopathic Base
                        </h4>
                        <div className="text-sm text-[#01579b] leading-relaxed">
                          <Markdown>{result.homeopathicBase}</Markdown>
                        </div>
                      </div>
                      <div className="p-6 bg-[#fffde7] rounded-2xl border border-[#fff9c4]">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#f57f17] mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Vitamin Base
                        </h4>
                        <div className="text-sm text-[#f57f17] leading-relaxed">
                          <Markdown>{result.vitaminBase}</Markdown>
                        </div>
                      </div>
                      <div className="p-6 bg-[#fce4ec] rounded-2xl border border-[#f8bbd0]">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#880e4f] mb-3 flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" /> Modern/Painkiller Base
                        </h4>
                        <div className="text-sm text-[#880e4f] leading-relaxed">
                          <Markdown>{result.painkillerBase}</Markdown>
                        </div>
                      </div>
                    </div>

                    <section className="p-6 bg-teal-50/70 rounded-2xl border border-teal-200">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-teal-800 mb-3 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-teal-700" /> Dosage, Quantity & Safety Protocol (मात्रा आणि सेवन नियम)
                      </h4>
                      <div className="text-sm text-teal-950 leading-relaxed">
                        <Markdown>{result.dosageAndOverUnderConsumptionDetails}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-[#e0f2f1] rounded-2xl border border-[#b2dfdb]">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#00695c] mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Full Daily Timetable
                      </h4>
                      <div className="text-sm text-[#00695c] leading-relaxed">
                        <Markdown>{result.dailyTimetable}</Markdown>
                      </div>
                    </section>

                    <section className="pt-6 border-t border-[#f0f0f0]">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#90a4ae] mb-3">Lifestyle & Habits</h4>
                      <div className="prose prose-sm max-w-none text-[#37474f] mb-6">
                        <Markdown>{result.lifestyleAdvice}</Markdown>
                      </div>
                      
                      <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-800 mb-3 flex items-center gap-2">
                          <Dumbbell className="w-4 h-4 text-emerald-700" /> Active Recovery: Exercise & Advanced Physical Therapy (व्यायाम आणि थेरपी)
                        </h4>
                        <div className="text-sm text-emerald-950 leading-relaxed">
                          <Markdown>{result.exerciseAndTherapyGuidance}</Markdown>
                        </div>
                      </div>
                    </section>

                    <section className="p-6 bg-slate-100 rounded-2xl border border-slate-300">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-700" /> Ancient to Modern Advanced Surgical & Treatment Procedures (शल्यक्रिया आणि प्रगत उपचार)
                      </h4>
                      <div className="prose prose-sm max-w-none text-slate-900 leading-relaxed">
                        <Markdown>{result.surgicalAndAdvancedTherapy}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-[#2e7d32] text-white rounded-2xl shadow-lg shadow-green-100">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-3">Total Body Reconstruction Plan</h4>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <Markdown>{result.reconstructionPlan}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-[#fff8e1] rounded-2xl border border-[#ffecb3]">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#f57f17] mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Healing Timeline: What to Expect
                      </h4>
                      <div className="text-sm text-[#5d4037] leading-relaxed">
                        <Markdown>{result.healingTimeline}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-[#fff5f5] rounded-2xl border border-[#ffcdd2]">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#c62828] mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#c62828]" /> Effects & Potential Side Effects Analysis
                      </h4>
                      <div className="text-sm text-[#c62828] leading-relaxed">
                        <Markdown>{result.effectsAndSideEffects}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-orange-800 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-700" /> Medicine Consumption Impact & Recovery Duration
                      </h4>
                      <div className="text-sm text-orange-950 leading-relaxed">
                        <Markdown>{result.impactAndRecoveryDuration}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-red-50 rounded-2xl border border-red-200">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" /> Critical Medicine Verification & Professional Safety Checks (सुरक्षा आणि डॉक्टरांचा सल्ला)
                      </h4>
                      <div className="text-sm text-red-950 leading-relaxed">
                        <Markdown>{result.medicineVerificationSafetyCheck}</Markdown>
                      </div>
                    </section>

                    <section className="p-6 bg-[#e1f5fe] rounded-2xl border border-[#b3e5fc]">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0277bd] mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Divine Reassurance
                      </h4>
                      <div className="text-sm text-[#01579b] font-medium italic leading-relaxed">
                        <Markdown>{result.reassuranceMessage}</Markdown>
                      </div>
                    </section>

                    {/* Localized Donation & Assistance Section */}
                    {(() => {
                      const note = getDonationNote(input.language);
                      return (
                        <section className="p-6 bg-[#fffde7] rounded-2xl border-2 border-[#fff176] shadow-sm space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#e65100] flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> {note.title}
                          </h4>
                          <p className="text-xs text-[#5d4037] leading-relaxed font-semibold">
                            {note.message}
                          </p>
                          <div className="bg-white/70 p-3 rounded-xl border border-[#fff59d] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                              {note.label}
                            </span>
                            <span className="text-sm font-mono font-black text-amber-950 bg-amber-100/50 px-2.5 py-1 rounded-lg border border-amber-200">
                              {note.id}
                            </span>
                          </div>
                        </section>
                      );
                    })()}

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 italic leading-tight">
                        {result.disclaimer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6"
                >
                  <div className="w-24 h-24 bg-[#f5f7f8] rounded-full flex items-center justify-center">
                    <Heart className="w-12 h-12 text-[#cfd8dc]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#546e7a]">Waiting for your details</h3>
                    <p className="text-[#90a4ae] max-w-xs mx-auto mt-2">
                      Fill in the dashboard to receive your personalized divine health guidance.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#e0e0e0] mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#1b5e20]">Jiyo Long Life</h2>
            <p className="text-sm text-[#546e7a] leading-relaxed">
              A divine platform dedicated to the reconstruction of the human body for a long, healthy, and disease-free life.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#90a4ae]">Security & Rights</h4>
            <p className="text-xs text-[#78909c] leading-relaxed">
              All rights reserved. This platform is protected by divine wisdom and advanced AI security. No unauthorized modifications are permitted.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#90a4ae]">Global Accessibility</h4>
            <p className="text-xs text-[#78909c] leading-relaxed">
              This platform is designed for all of humanity. It is optimized for global reach and high performance to ensure anyone, anywhere can access divine health guidance without interruption.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#f0f0f0] text-center">
          <p className="text-[10px] text-[#cfd8dc] uppercase tracking-widest">© 2026 Jiyo Long Life Platform • Created with Divine Inspiration</p>
        </div>
      </footer>
      {/* Terms Modal */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTerms(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold text-[#1b5e20]">Terms & Conditions</h3>
                <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-gray-600">
                  <Activity className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto prose prose-sm max-w-none text-[#546e7a]">
                <h4>1. Acceptance of Terms</h4>
                <p>By accessing the Jiyo Long Life Platform, you agree to be bound by these divine terms and conditions. This platform is designed for the global welfare of humanity.</p>
                
                <h4>2. Nature of Guidance</h4>
                <p>The guidance provided is based on 100% Ayurvedic principles, divine wisdom, and cellular analysis. While we strive for 100% safety and zero side effects, the platform possesses the divine capacity to guide recovery should any imbalance occur during the healing process.</p>
                
                <h4>3. User Responsibility</h4>
                <p>Users must provide accurate details (age, gender, symptoms) for precise analysis. The platform's effectiveness depends on the purity of intent and adherence to the prescribed lifestyle changes.</p>
                
                <h4>4. Global Mission & Support</h4>
                <p>This platform is a gift to the world. It is sustained by the community. Users are encouraged to support the mission via donations to ensure its continuity for future generations.</p>
                
                <h4>5. Intellectual Property</h4>
                <p>All rights, wisdom, and technical structures of this platform are reserved. Unauthorized modification or commercial exploitation is strictly prohibited.</p>
                
                <h4>6. Safety Guarantee</h4>
                <p>We guarantee a focus on 100% safe, non-toxic body reconstruction. In the rare event of a healing crisis, the platform will provide guidance for recovery and stabilization.</p>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setShowTerms(false)}
                  className="bg-[#2e7d32] text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-green-100"
                >
                  I Understand & Agree
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
