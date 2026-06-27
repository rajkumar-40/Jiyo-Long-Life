export interface HealthFile {
  name: string;
  mimeType: string;
  base64: string; // Base64 encoding of the file
  size?: number; // Optional size in bytes
}

export interface HealthInput {
  name: string;
  age: string;
  gender: string;
  symptoms: string;
  pastIllnesses: string;
  language: string;
  files?: HealthFile[];
}

export interface HealthGuidance {
  patientName: string;
  bodySituationAndSymptoms: string;
  recommendedTests: string;
  allopathicSupport: string;
  rootCause: string;
  vitaminBase: string;
  painkillerBase: string;
  ayurvedicBase: string;
  brandedMedicines: string;
  optionalTreatments: string;
  dailyTimetable: string;
  homeopathicBase: string;
  lifestyleAdvice: string;
  exerciseAndTherapyGuidance: string;
  dosageAndOverUnderConsumptionDetails: string;
  medicineVerificationSafetyCheck: string;
  reconstructionPlan: string;
  healingTimeline: string;
  effectsAndSideEffects: string;
  impactAndRecoveryDuration: string;
  reassuranceMessage: string;
  surgicalAndAdvancedTherapy: string;
  demographicAdaptation: string;
  bodyPurificationSpecialists: string;
  immediateTreatmentStart: string;
  whatNotToDo: string;
  disclaimer: string;
}
