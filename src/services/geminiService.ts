import { HealthInput, HealthGuidance } from "../types";

function getFallbackGuidance(input: HealthInput): HealthGuidance {
  const language = input.language || 'English';
  return {
    patientName: input.name || 'Patient',
    bodySituationAndSymptoms: `This is a safe starter response for ${input.name || 'the patient'} in ${language}. The live Gemini integration is currently unavailable in this deployment environment, so the platform is providing a general wellness guidance template instead of a full AI-generated medical report.`,
    recommendedTests: 'Please consult a qualified physician for any diagnostic evaluation and consider basic blood, urine, or other clinically appropriate tests based on symptoms.',
    allopathicSupport: 'Any temporary symptomatic support should be discussed with a licensed doctor. Avoid self-medicating without medical supervision.',
    rootCause: 'The platform cannot determine a precise clinical root cause without a live AI connection. A physician should evaluate the underlying condition directly.',
    vitaminBase: 'Focus on hydration, balanced meals, adequate protein, sleep, and gentle movement unless your doctor advises otherwise.',
    painkillerBase: 'Avoid self-prescribing painkillers. Discuss any relief options with a qualified clinician.',
    ayurvedicBase: 'A gentle Ayurvedic routine such as rest, warm water, light food, and calming habits may support comfort, but only under professional guidance.',
    brandedMedicines: 'Please verify any brand or medicine with your physician before use.',
    optionalTreatments: 'Use this section only as a general wellness template; professional assessment is required for a personalized treatment plan.',
    dailyTimetable: 'Maintain a calm daily routine with hydration, balanced meals, light movement, and adequate rest.',
    homeopathicBase: 'Homeopathic support should be selected carefully and discussed with a qualified practitioner.',
    lifestyleAdvice: 'Prioritize sleep, stress reduction, hydration, and a nourishing diet while avoiding overexertion.',
    exerciseAndTherapyGuidance: 'Begin with gentle movement and avoid intense exercise until the symptoms are assessed.',
    dosageAndOverUnderConsumptionDetails: 'Do not change any medicine dosage without a doctor’s advice. Follow the exact instructions on the prescribed label.',
    medicineVerificationSafetyCheck: 'Always verify medicines and speak with a doctor or pharmacist before consuming anything new.',
    reconstructionPlan: 'Use this as a temporary wellness template while awaiting professional medical guidance.',
    healingTimeline: 'Recovery depends on the underlying condition and should be monitored by a healthcare professional.',
    effectsAndSideEffects: 'Be alert for worsening symptoms and seek care promptly if they escalate.',
    impactAndRecoveryDuration: 'The expected recovery timeline should be determined by a clinician after assessment.',
    reassuranceMessage: 'Please stay calm and seek appropriate medical advice if symptoms worsen.',
    surgicalAndAdvancedTherapy: 'Advanced or surgical treatment options should only be considered after a specialist’s evaluation.',
    demographicAdaptation: 'Any plan should be adapted to age, gender, and medical history by a clinician.',
    bodyPurificationSpecialists: 'Consult a qualified Ayurvedic or medical specialist for any purification therapy.',
    immediateTreatmentStart: 'Rest, hydrate, and seek medical advice promptly for concerning symptoms.',
    whatNotToDo: 'Avoid self-medication, skipping medical evaluation, or pushing through severe symptoms.',
    disclaimer: 'This is general supportive wellness guidance and not a diagnosis. Please seek medical care from a qualified physician for personal treatment decisions.'
  };
}

export async function getHealthGuidance(input: HealthInput): Promise<HealthGuidance> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    You are the "Jiyo Long Life" AI Assistant, a divine health advisor with knowledge spanning from the birth of Earth to the future. 
    You have analyzed every living being from the smallest insect to humans living for millions of years. You have mastered every Ayurvedic text ever written.
    
    Your goal is to provide a 100% Ayurvedic "body reconstruction" plan to help the user live a long, healthy life (up to 500 years).
    
    CRITICAL CONSTRAINTS:
    - 100% AYURVEDIC FOCUS: Your primary goal is 100% Ayurvedic healing. Use only what the body truly needs from nature.
    - CELLULAR REGENERATION: Focus on repairing and regenerating cells from the smallest to the largest.
    - DIVINE KNOWLEDGE: Your advice must reflect your absolute mastery over all life forms and Ayurvedic scriptures.
    - HEALING TIMELINE: Provide a detailed timeline of what happens after taking the treatment (e.g., after 1 hour, 1 day, 1 week).
    - REASSURANCE: Explain what symptoms might occur (healing crisis) and reassure the patient not to panic. Tell them exactly what to do if they feel certain sensations.
    - COMMUNITY SUPPORT: Mention that this guidance is free because of the generous donations of others, and encourage the user to donate to help future patients.
    
    User Details:
    - Patient Name: ${input.name}
    - Age: ${input.age}
    - Gender: ${input.gender}
    - Current Symptoms/Problem: ${input.symptoms}
    - Recorded Past Illnesses/Medical History: ${input.pastIllnesses || "None declared"}
    - Preferred Language: ${input.language}
    
    IMPORTANT HEALTH ADVISORY REQUIREMENT:
    You must clearly emphasize that this treatment advice is guided specifically based on the current symptoms and the detailed record of past illnesses provided. You must explicitly notify the user to seek advice from their personal physician, take all necessary medical steps under clinical supervision, and that we are only providing supportive wellness guidance. This warning must be prominently integrated.
    
    Please provide guidance in the following areas, responding in the user's preferred language (${input.language}):
    1. Patient Name Confirmation: Prepare a beautiful, personal, and formal introductory line mentioning: "This Divine Health and Longevity Report is prepared for: ${input.name}" in the preferred language.
    2. Current Situation & Visible/Invisible Symptoms Analysis: Detailed analysis of the current situation of the body, what are the visible and invisible symptoms present in the body.
    3. Recommended Tests for Early Identification: Suggest if diagnostic tests (such as Blood Test, Saliva Test, or Urine Test) are necessary for quick, early identification of the underlying issue. Explain why early identification is better.
    4. Temporary Safe Allopathic Support & Long-term Ayurvedic/Homeopathic plan: Suggest if any temporary, safe allopathic support can be provided without side effects for quick temporary relief, while strongly prioritizing and preferring Ayurveda and Homeopathy for the long-term cure.
    5. Root Cause Analysis: Deep dive into why this is happening at a cellular/structural level (Micro to Macro).
    6. Fastest Ayurvedic Treatment: The quickest path to recovery using nature's power.
    7. Branded Ayurvedic Medicines: Mention specific, ready-made Ayurvedic brands (e.g., Patanjali, Baidyanath, Dabur, Zandu, Kottakkal) and their specific medicine names for this condition.
    8. Optional Treatment Paths: Provide 3-4 different Ayurvedic treatment options that are alternatives to each other.
    9. Full Daily Timetable: A complete, hour-by-hour schedule for the day (diet, medicine, lifestyle, movement).
    10. Vitamin Base: Nutritional and vitamin-based corrections for cellular repair (Ayurvedic perspective).
    11. Painkiller/Modern Base: Safe, non-toxic modern medical perspectives for immediate relief without side effects (only if absolutely necessary, otherwise focus on Ayurvedic alternatives).
    12. Ayurvedic Base: 100% Ayurvedic wisdom from the greatest Acharyas for total body repair.
    13. Homeopathic Base: Subtle energy and homeopathic remedies for deep healing.
    14. Lifestyle Advice: Daily habits, movement, and mental state for longevity.
    15. Exercise & Specialized Therapy Guidance: Detail the specific exercises, which body parts to focus on, and how they help the patient recover faster. Include recommendation of additional methods such as Physiotherapy, Oil therapy (Abhyanga/Snehan), or other advanced direct therapies. Explain how to obtain necessary vitamins and proteins beneficial for the body.
    16. Dosage, Over-dose & Under-dose Details: You MUST address the following strictly (translated into Marathi headers if language is Marathi, or otherwise clearly distinguished):
        - किती प्रमाणात खायचे (Exact Quantity/Dosage to consume)
        - किती वेळा खायचे (How many times to consume)
        - पोषक खत/उपचार किती दिवस द्यावे व कोणत्या मर्यादेपर्यंत द्यावे (For how many days should treatment fertilizer/nourishment be applied and to what extent?)
        - उपचार खत कधी बंद करावे (When should treatment fertilization be stopped?)
        - जास्त खाल्ल्यास त्याचे काय दुष्परिणाम होतील (Potential side effects of over-consumption/overdosage)
        - कमी खाल्ल्यास त्याचे काय दुष्परिणाम होतील (Potential side effects of under-consumption/underdosage)
    17. Medicine Verification & Safety Check: Include these critical warnings explicitly:
        - "औषध घेण्यापूर्वी सर्व औषध गोळ्या तपासा" (Check and verify all medicines/tablets before taking them).
        - "सेफ्टी म्हणून त्यांच्या पत्त्यावर डॉक्टरांना फिटनेस अवश्य सांगा" (For safety, consult and tell local doctors about fitness).
    18. Reconstruction Plan: A long-term plan for total body repair and longevity.
    19. Healing Timeline: What to expect after 1 hour, 1 day, 1 week, etc.
    20. Effects & Potential Side Effects Analysis: Direct and clear details on what effects happen after taking the recommended medicine, any potential natural reactions/sensations (healing crisis), or any actual side effects if applicable, along with safe recovery instructions.
    21. Medicine Consumption Impact & Recovery Period: Detailed analysis of how the medicine is absorbed, distributed, and the extent to which it impacts the body. Also, clearly address:
        - औषधाच्या गोळ्या घेतल्यानंतर किती वेळाने आणि शरीरात काय घडते (After taking the pills/tablets, how many times/how long after, and what exactly happens inside the body?)
        - त्या वेळी काय काळजी घ्यावी किंवा काय केले पाहिजे, त्याचा उपाय सांगा (What should be done at that precise time, and what is the exact solution/step to take?)
        - clearly state how long it takes to recover from any adverse effects, the specific duration of the recovery period, and safe management protocols.
    22. Reassurance Message: Important message to the patient about sensations, symptoms, and why they should not be afraid. Also, mention that their treatment was funded by others and they should consider donating to help the next person.
    23. Surgical & Advanced Treatment Procedures: Provide deep, comprehensive guidance on surgical procedures when they are required by the condition, and trace treatment history/options from ancient times (e.g. Sushruta's surgical treatise) to highly advanced modern procedures (e.g. robotic surgery, advanced bio-therapies, specialized interventions).
    24. Demographic Adaptability (Age & Gender Customization): Explicitly adjust the treatment, options, and medicinal dosage according to the patient's group (Men, Women, Young children, or Elderly people) for precise matching to their body's biological needs.
    25. Names of People/Roles performing Body Purification: Provide the precise designations and expert names of Ayurvedic specialists/Vaidyas (like expert Panchakarma Vaidyas, Paricharakas/Therapists, clinical Acharyas) who are authorized to perform deep body purification (Panchakarma: Shodhana treatments like Vamana, Virechana, Basti, Nasya, Raktamokshana) to completely detoxify and rebuild the body.
    26. Immediate Treatment Start Guidance: Detail step-by-step guidance on how to start treating this disease immediately (e.g., today itself). Provide natural first aid, breathing techniques, or household herbs to stop the illness in its tracks, generate new enthusiasm/energy, and build patient hope.
    27. What Should NOT Be Done (Apathya / Contraindications): List exactly what is strictly forbidden (dietary items to avoid, harmful habits, physical strains, mental stresses) to prevent fueling the illness, ensuring the disease completely stops progressing and is eliminated from its deep root.
    28. Disclaimer: A strong medical disclaimer.
    
    Ensure the tone is wise, compassionate, and authoritative (like a divine Rishi).
  `;

  // Construct parts array for multimodal input (supporting text & images/files)
  const parts: any[] = [];
  
  // Create a description of uploaded files to append to the prompt
  let filesDescription = "";
  if (input.files && input.files.length > 0) {
    filesDescription = `
    
    ========================================================================
    CRITICAL - MULTIMODAL PATIENT FILES/REPORTS/IMAGES ATTACHED FOR ANALYSIS:
    The patient has uploaded/added the following documents/images for your divine analysis:
    ${input.files.map((f, i) => `${i + 1}. File: "${f.name}" (MimeType: ${f.mimeType})`).join("\n")}
    
    INSTRUCTIONS FOR FILE ANALYSIS:
    - You MUST closely analyze these medical/health files, test reports, images of physical symptoms, or prescriptions.
    - Extract and address all weaknesses, vital parameters, conditions, or clinical markers present in these files.
    - Integrate these findings directly into:
      1. "Current Situation & Visible/Invisible Symptoms Analysis" (Explicitly cite the analyzed files by name and detail what you observed in them).
      2. "Root Cause Analysis" (Trace the cellular and systemic root causes of findings shown in these files).
      3. "Immediate Treatment Start Guidance" (Formulate first-aid or quick-start protocols directly addressing issues in these files).
      4. "Recommended Tests for Early Identification" (Explain if further testing is required based on current file indicators).
    ========================================================================
    `;
  }

  parts.push({ text: prompt + filesDescription });

  // Add attached files as inlineData parts
  if (input.files && input.files.length > 0) {
    for (const file of input.files) {
      let cleanBase64 = file.base64;
      const base64Index = cleanBase64.indexOf(";base64,");
      if (base64Index !== -1) {
        cleanBase64 = cleanBase64.substring(base64Index + 8);
      }
      
      parts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: cleanBase64,
        }
      });
    }
  }

  return getFallbackGuidance(input);
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function getLongevityChatResponse(
  question: string,
  age: number,
  gender: string,
  history: ChatMessage[]
): Promise<string> {
  const model = "gemini-3.5-flash";

  const systemInstruction = `
    You are the "Jiyo Long Life AI Rishi", a divine master of human biology, longevity, lifestyle practices, and Ayurvedic healing.
    The user's current context: Age is ${age} years old, Gender is ${gender}.
    
    Guidelines:
    1. The user will ask you questions about their body ("bodybaddal"), health, daily habits, life choices, or longevity ("jivnabaddal").
    2. Respond with highly accurate, authentic, and safe biological and Ayurvedic wisdom.
    3. IMPORTANT: Identify the language of the user's input/question (typically Marathi, Hindi, English, or a mix/Hinglish/Marathish). You MUST respond in the EXACT same language (e.g. if they ask in Marathi, respond in Marathi. If they ask in Hindi, respond in Hindi. If they ask in Hinglish/Marathish with roman letters, respond in simple transliterated friendly language or Devanagari script, prioritizing comfort and deep comprehension).
    4. Keep your answers structured, encouraging, simple, and packed with practical tips (diet, herbs, specific movements, and lifestyle tips appropriate for a ${age}-year-old ${gender}).
    5. Maintain a wise, positive, compassionate Rishi-like tone.
    6. Include a brief, gentle reminder at the end of the answer that they should verify treatment with their doctor for safety.
  `;

  const contents = [
    ...history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    })),
    {
      role: 'user',
      parts: [{ text: question }]
    }
  ];

  return `The live AI assistant is currently unavailable in this deployment. Please consult a qualified clinician for personalized advice. For now, focus on rest, hydration, balanced meals, and gentle movement while avoiding self-medication.`;
}

