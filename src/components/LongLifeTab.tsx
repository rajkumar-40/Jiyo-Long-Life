import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Droplet, 
  Moon, 
  Dumbbell, 
  Sparkles, 
  CheckSquare, 
  Heart, 
  Send,
  User,
  Bot,
  MessageSquare,
  HelpCircle,
  Loader2,
  RefreshCw,
  Leaf
} from 'lucide-react';
import { getLongevityChatResponse, ChatMessage } from '../services/geminiService';
import VoiceInputButton from './VoiceInputButton';

interface LongLifeTabProps {
  ageStr: string;
  gender: string;
  language: string;
}

export default function LongLifeTab({ ageStr, gender, language }: LongLifeTabProps) {
  // Parse age string to find a number
  const parsedAge = parseInt(ageStr.replace(/\D/g, '')) || 30; // default to 30 if not provided

  // Define dynamic content based on age and gender
  const getLongevityPlan = (age: number, gen: string) => {
    let stageEn = "Youthful Vitality & Performance (Pitta Era)";
    let stageMr = "तरुण वय आणि ऊर्जा (पित्त काळ)";
    let ageRange = "17 - 40 Years";
    let bioTypeEn = "Focus on balancing Pitta, building functional muscle, and mental resilience.";
    let bioTypeMr = "पित्त संतुलित करणे, स्नायू बळकट करणे आणि मानसिक आरोग्य राखण्यावर भर द्या.";

    if (age <= 16) {
      stageEn = "Childhood Growth & Nourishment (Kapha Era)";
      stageMr = "बालपण आणि पोषण काळ (कफ काळ)";
      ageRange = "0 - 16 Years";
      bioTypeEn = "Focus on balancing Kapha, wholesome nutrition for structural growth, and deep immunity.";
      bioTypeMr = "कफ संतुलित करणे, हाडांच्या व स्नायूंच्या वाढीसाठी सकस आहार आणि उत्तम रोगप्रतिकारशक्ती मिळवणे.";
    } else if (age >= 41 && age <= 60) {
      stageEn = "Prudent Preservation & Stamina (Pitta-Vata Era)";
      stageMr = "प्रौढ वय, संवर्धन आणि ताकद (पित्त-वात काळ)";
      ageRange = "41 - 60 Years";
      bioTypeEn = "Focus on preserving muscle mass, joint elasticity, cardiovascular stamina, and metabolic Agni.";
      bioTypeMr = "स्नायूंचे नुकसान टाळणे, सांध्यांची लवचिकता, हृदयाचे आरोग्य आणि चयापचय (अग्नी) क्रिया सुरळीत ठेवणे.";
    } else if (age > 60) {
      stageEn = "Graceful Longevity & Rejuvenation (Vata Era)";
      stageMr = "वृद्धत्व आणि कायाकल्प काळ (वात काळ)";
      ageRange = "60+ Years";
      bioTypeEn = "Focus on calming Vata, preserving bone density, gentle mobility, cognitive vigor, and ojas (vital energy).";
      bioTypeMr = "वात शांत करणे, हाडांची झीज रोषने, हलकी हालचाल, तीक्ष्ण स्मरणशक्ती आणि शरीरातील ओज वाढवणे.";
    }

    let genderEn = "General wellness and endocrine balance.";
    let genderMr = "सर्वसाधारण आरोग्य आणि संप्रेरक संतुलन.";
    if (gen === 'Male') {
      genderEn = "Emphasis on testosterone maintenance, cardiac strength, prostate health, and skeletal power.";
      genderMr = "टेस्टोस्टेरॉन संप्रेरक पातळी राखणे, हृदयाची ताकद, प्रोस्टेट ग्रंथींचे आरोग्य आणि हाडांच्या बळकटतेवर भर.";
    } else if (gen === 'Female') {
      genderEn = "Emphasis on bone mineral density, iron reserves, hormonal rhythm optimization, and pelvic health.";
      genderMr = "हाडांची घनता (कॅल्शियम), लोह पातळी, मासिक पाळी/संप्रेरक चक्र आणि ओटीपोटाच्या स्नायूंचे आरोग्य.";
    }

    let waterLiters = 3.0;
    let sleepHours = "7.5 - 8.5 Hours";
    let activeMinutes = 45;
    let mainExerciseEn = "Surya Namaskar & Medium-intensity Resistance Training";
    let mainExerciseMr = "सूर्यनमस्कार आणि मध्यम-तीव्रतेचे व्यायाम (Resistance Training)";
    let dinacharyaEn = "Abhyanga (Warm sesame oil self-massage) and Nasya (Nasal drops)";
    let dinacharyaMr = "अभ्यंग (कोमट तिळाच्या तेलाने मसाज) आणि नस्य (नाकात औषधी थेंब घालणे)";
    let superfoodsEn = "Amla, soaked Almonds, Ashwagandha, and Cow's Ghee";
    let superfoodsMr = "आवळा, भिजवलेले बदाम, अश्वगंधा आणि साजूक तूप";

    if (age <= 16) {
      waterLiters = 2.0;
      sleepHours = "9 - 10 Hours (Essential for HGH)";
      activeMinutes = 60;
      mainExerciseEn = "Outdoor active play, gymnastics, swimming, and basic Yoga postures";
      mainExerciseMr = "मैदानी खेळ, पोहणे, योगासने (ताडासन, भुजंगासन)";
      dinacharyaEn = "Padabhyanga (Foot massage) & daily herbal ubtan bath";
      dinacharyaMr = "पादाभ्यंग (पायांना तेल मालिश) आणि सुवासिक उटणे स्नान";
      superfoodsEn = "Chyawanprash, fresh Milk, Dates, and Brahmi";
      superfoodsMr = "च्यवनप्राश, ताजे दूध, खजूर आणि ब्राह्मी घृत";
    } else if (age >= 41 && age <= 60) {
      waterLiters = gen === 'Male' ? 3.2 : 2.7;
      sleepHours = "7 - 8 Hours";
      activeMinutes = 40;
      mainExerciseEn = "Brisk walking, joint-mobility warmups, and core Pilates or Yoga (Triyak-Tadasana)";
      mainExerciseMr = "जलद चालणे, सांध्यांची हालचाल आणि कोर योग (त्रियक-ताडासन, वीरभद्रासन)";
      dinacharyaEn = "Kaval (Oil pulling with sesame oil) and evening meditation";
      dinacharyaMr = "कवल (तिळाच्या तेलाने तेल चूळ भरणे - Oil Pulling) आणि ध्यान साधना";
      superfoodsEn = "Triphala before bed, Shatavari, Turmeric milk, and Flaxseeds";
      superfoodsMr = "झोपण्यापूर्वी त्रिफळा चूर्ण, शतावरी, हळदीचे दूध आणि अळशीच्या बिया";
    } else if (age > 60) {
      waterLiters = 2.2;
      sleepHours = "7 - 7.5 Hours (Deep rest prioritized)";
      activeMinutes = 30;
      mainExerciseEn = "Gentle walking, joint rotation (Sukshma Vyayama), and Pranayama (Anulom Vilom)";
      mainExerciseMr = "सावकाश चालणे, सूक्ष्म व्यायाम (सांध्यांची हालचाल) आणि प्राणायाम (अनुलोम विलोम)";
      dinacharyaEn = "Warm water intake upon waking & Abhyanga self-oil application on head & feet";
      dinacharyaMr = "सकाळी उठल्यावर गरम पाणी पिणे, डोक्याला आणि पायाला कोमट तेल लावणे";
      superfoodsEn = "Garlic infusion, cooked warm soups, Guggulu, and Tulsi tea";
      superfoodsMr = "लसूण कल्प, मऊ शिजवलेले गरम सूप, गुग्गुळ आणि तुळशीचा चहा";
    }

    return {
      stageEn, stageMr,
      ageRange,
      bioTypeEn, bioTypeMr,
      genderEn, genderMr,
      waterLiters,
      sleepHours,
      activeMinutes,
      mainExerciseEn, mainExerciseMr,
      dinacharyaEn, dinacharyaMr,
      superfoodsEn, superfoodsMr
    };
  };

  const plan = getLongevityPlan(parsedAge, gender);

  // Daily interactive tracker state
  const [checklist, setChecklist] = useState([
    { id: 1, textEn: "Drank warm water in the morning", textMr: "सकाळी उठल्यावर कोमट पाणी प्यायलो", checked: false },
    { id: 2, textEn: "Completed dynamic/gentle physical activity", textMr: "आजचा शिफारस केलेला व्यायाम पूर्ण केला", checked: false },
    { id: 3, textEn: "5-10 minutes of deep pranayama breathing", textMr: "५ ते १० मिनिटे खोल श्वासोच्छ्वास/प्राणायाम केला", checked: false },
    { id: 4, textEn: "Ate warm, fresh home-cooked meals (Mitahara)", textMr: "ताजे, सकस आणि घरगुती अन्न घेतले (मिताहार)", checked: false },
    { id: 5, textEn: "Took recommended superfoods / herbal infusion", textMr: "शिफारस केलेले आवळा, तूप किंवा औषधी चहा घेतला", checked: false },
    { id: 6, textEn: "Avoided screen for 45 minutes before sleep", textMr: "झोपण्यापूर्वी ४५ मिनिटे मोबाईल/टीव्ही टाळला", checked: false }
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const checkedCount = checklist.filter(c => c.checked).length;
  const progressPercent = Math.round((checkedCount / checklist.length) * 100);

  // AI Longevity Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `प्रणाम! मी **दीर्घायुष्य एआय ऋषी** आहे. 🙏✨\n\nतुमचे वय **${parsedAge}** वर्षे असून तुम्ही **${gender === 'Male' ? 'पुरुष' : 'महिला'}** आहात. तुमच्या शरीराची ताकद वाढवण्यासाठी, निरोगी जीवन जगण्यासाठी किंवा निरोगी सवयींबद्दल तुम्हाला काहीही विचारायचे असल्यास खालील इनपुट बॉक्समध्ये विचारा. मी तुमच्या प्रश्नाचे अचूक उत्तर तुमच्याच भाषेत देईन!`
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || userInput;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setUserInput('');
    setIsLoading(true);

    try {
      const response = await getLongevityChatResponse(
        textToSend,
        parsedAge,
        gender,
        messages.slice(-6) // Send last few messages for context
      );
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "क्षमस्व, एआय ऋषींशी संपर्क साधण्यात अडचण येत आहे. कृपया थोड्या वेळाने प्रयत्न करा. (Sorry, there was an issue reaching the AI Rishi. Please try again.)" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    { textEn: "How to increase body strength?", textMr: "माझ्या शरीराची ताकद कशी वाढवू?" },
    { textEn: "What to eat to stay young?", textMr: "तरुण राहण्यासाठी काय खावे?" },
    { textEn: "Suggest some deep sleep habits", textMr: "शांत झोप येण्यासाठी काय उपाय आहेत?" },
    { textEn: "How to balance my body Doshas?", textMr: "वात, पित्त, कफ संतुलित करण्याचे उपाय?" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Badge */}
      <div className="p-5 bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-2xl border border-[#a5d6a7] flex items-start gap-4">
        <div className="w-12 h-12 bg-[#2e7d32] rounded-full flex items-center justify-center text-white font-serif font-black shadow-md shrink-0">
          ॐ
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg text-[#1b5e20] leading-snug flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#2e7d32] animate-bounce" />
            Jiyo Long Life Program (दीर्घायुष्य जीवनक्रम)
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Dynamic Ayurvedic & modern daily requirements and AI Rishi guidance.
          </p>
          <div className="flex flex-wrap gap-2 mt-2.5">
            <span className="px-2.5 py-1 bg-white text-[#2e7d32] font-mono text-[10px] font-bold uppercase rounded-md border border-[#c8e6c9]">
              Age: {parsedAge} Yrs ({plan.ageRange})
            </span>
            <span className="px-2.5 py-1 bg-white text-[#ef6c00] font-mono text-[10px] font-bold uppercase rounded-md border border-amber-200">
              Gender: {gender}
            </span>
          </div>
        </div>
      </div>

      {/* Centerpiece: Jiyo AI Longevity Rishi Chat */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#2e7d32] to-[#1b5e20] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#2e7d32]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm leading-none">Jiyo AI Rishi (दीर्घायुष्य एआय ऋषी)</h4>
              <span className="text-[10px] text-emerald-100 font-medium">Ancient Longevity Wisdom • 24/7 Active</span>
            </div>
          </div>
          <button 
            onClick={() => setMessages([
              {
                role: 'model',
                text: `प्रणाम! मी **दीर्घायुष्य एआय ऋषी** आहे. 🙏✨\n\nतुमचे वय **${parsedAge}** वर्षे असून तुम्ही **${gender === 'Male' ? 'पुरुष' : 'महिला'}** आहात. तुमच्या शरीराची ताकद वाढवण्यासाठी, निरोगी जीवन जगण्यासाठी किंवा निरोगी सवयींबद्दल तुम्हाला काहीही विचारायचे असल्यास खालील इनपुट बॉक्समध्ये विचारा. मी तुमच्या प्रश्नाचे अचूक उत्तर तुमच्याच भाषेत देईन!`
              }
            ])}
            className="p-1.5 hover:bg-emerald-800 rounded-lg text-emerald-100 hover:text-white transition-all"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History */}
        <div className="p-4 h-[350px] overflow-y-auto bg-[#f9fbf9] space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-[#ef6c00] text-white' : 'bg-[#e8f5e9] text-[#2e7d32]'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#ef6c00] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-emerald-50 rounded-tl-none'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  ) : (
                    <div className="markdown-body space-y-2">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-center"
            >
              <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-[#2e7d32] animate-spin" />
              </div>
              <div className="bg-emerald-50 text-[#1b5e20] text-[11px] font-bold py-2 px-3.5 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>AI Rishi is contemplating your body's life energy (ऋषी चिंतन करत आहेत...)</span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Suggesions Pill Container */}
        <div className="px-4 py-2 bg-white border-t border-gray-50 flex flex-wrap gap-1.5">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(undefined, q.textMr)}
              className="px-2.5 py-1 bg-[#f1f8e9] hover:bg-[#dcedc8] text-[#33691e] hover:text-[#1b5e20] text-[10px] font-semibold rounded-full border border-[#dcedc8] transition-all duration-200"
            >
              {q.textMr}
            </button>
          ))}
        </div>

        {/* Chat Input form */}
        <div className="p-3 bg-white border-t border-emerald-50 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-gray-500 font-medium">Use voice to chat:</span>
            <VoiceInputButton 
              language={language} 
              onTranscript={(text) => setUserInput(prev => prev ? prev + " " + text : text)}
            />
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isLoading}
              placeholder="जीवनशैली किंवा शरीराबद्दल विचारा... (e.g. शरीराची ताकद कशी वाढवू?)"
              className="flex-1 px-4 py-2.5 bg-[#f5f7f8] focus:bg-white border-none focus:ring-2 focus:ring-[#2e7d32] rounded-xl text-xs font-semibold placeholder:text-gray-400 transition-all"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isLoading}
              className="p-2.5 bg-[#2e7d32] hover:bg-[#1b5e20] disabled:bg-gray-100 text-white disabled:text-gray-400 rounded-xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Dynamic Biological Profile & Quick Requirements for Reference */}
      <div className="pt-2">
        <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#546e7a] mb-3">
          Daily Longevity Targets (दैनिक आरोग्य उद्दिष्टे)
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {/* Water card */}
          <div className="p-3 bg-[#e0f7fa] rounded-2xl border border-[#b2ebf2] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wide text-cyan-800">Hydration</span>
              <Droplet className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <div className="mt-2">
              <span className="text-base font-black text-cyan-900 block font-mono">{plan.waterLiters} Liters</span>
              <span className="text-[9px] text-cyan-700 font-medium">कोमट पाणी</span>
            </div>
          </div>

          {/* Sleep card */}
          <div className="p-3 bg-[#f3e5f5] rounded-2xl border border-[#e1bee7] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wide text-purple-800">Sleep</span>
              <Moon className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="mt-2">
              <span className="text-xs font-black text-purple-900 block font-mono leading-tight">{plan.sleepHours}</span>
              <span className="text-[9px] text-purple-700 font-medium">ओजस संवर्धन</span>
            </div>
          </div>

          {/* Exercise Card */}
          <div className="p-3 bg-[#fff3e0] rounded-2xl border border-[#ffe0b2] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wide text-amber-800">Exercise</span>
              <Dumbbell className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="mt-2">
              <span className="text-base font-black text-amber-900 block font-mono">{plan.activeMinutes} Mins</span>
              <span className="text-[9px] text-amber-700 font-medium">प्राणायाम</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holistic Longevity Instructions */}
      <div className="space-y-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="border-l-4 border-[#2e7d32] pl-3">
          <span className="text-[10px] font-black uppercase text-[#90a4ae] block">Dynamic Physical Activity Guideline (व्यायाम मार्गदर्शन)</span>
          <p className="text-xs text-gray-800 font-bold mt-0.5">{plan.mainExerciseEn}</p>
          <p className="text-xs text-[#2e7d32] font-semibold mt-0.5">मराठी: {plan.mainExerciseMr}</p>
        </div>

        <div className="border-l-4 border-amber-500 pl-3">
          <span className="text-[10px] font-black uppercase text-[#90a4ae] block">Ayurvedic Daily Routine (दिनचर्या कृती)</span>
          <p className="text-xs text-gray-800 font-bold mt-0.5">{plan.dinacharyaEn}</p>
          <p className="text-xs text-amber-800 font-semibold mt-0.5">मराठी: {plan.dinacharyaMr}</p>
        </div>

        <div className="border-l-4 border-rose-500 pl-3">
          <span className="text-[10px] font-black uppercase text-[#90a4ae] block">Recommended Herbs & Superfoods (औषधी आणि रस रसायने)</span>
          <p className="text-xs text-gray-800 font-bold mt-0.5">{plan.superfoodsEn}</p>
          <p className="text-xs text-rose-800 font-semibold mt-0.5">मराठी: {plan.superfoodsMr}</p>
        </div>
      </div>

      {/* Interactive Longevity Tracker Checklist */}
      <div className="p-5 bg-gradient-to-br from-amber-50/60 to-orange-50/50 rounded-2xl border border-amber-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-serif font-bold text-amber-950 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              Daily Longevity Tracker (आजचा दीर्घायुष्य दिनक्रम)
            </h4>
            <p className="text-[10px] text-amber-900/70 font-medium">
              Check off your Ayurvedic longevity habits as you complete them.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-amber-900 font-mono">{progressPercent}%</span>
            <span className="text-[9px] text-amber-700 block font-bold">Completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-[#2e7d32] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleCheck(item.id)}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                item.checked 
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-sm' 
                  : 'bg-white border-amber-100 hover:border-amber-200 text-gray-700'
              }`}
            >
              <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 transition-all ${
                item.checked 
                  ? 'bg-[#2e7d32] border-[#2e7d32] text-white' 
                  : 'border-amber-300 bg-white'
              }`}>
                {item.checked && (
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                  </svg>
                )}
              </div>
              <div className="text-[11px] leading-relaxed">
                <p className="font-bold">{item.textEn}</p>
                <p className={`${item.checked ? 'text-emerald-800' : 'text-gray-500'} font-semibold text-[10px] mt-0.5`}>
                  {item.textMr}
                </p>
              </div>
            </button>
          ))}
        </div>

        {progressPercent === 100 && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Splendid! You have fully satisfied your Daily Longevity Habits today! (आयुष्यमान भव!)</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
