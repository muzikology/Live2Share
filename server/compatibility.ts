import { type User } from "@shared/schema";

interface CompatibilityFactors {
  lifestyle: number;      // 25%
  cleanliness: number;    // 20%
  hobbies: number;        // 15%
  studyField: number;     // 10%
  preferences: number;    // 15%
  schedule: number;       // 10%
  budget: number;         // 5%
}

/**
 * Calculate compatibility score between two users
 * Returns a score from 0-100
 */
export function calculateCompatibility(user1: User, user2: User): number {
  const factors: CompatibilityFactors = {
    lifestyle: calculateLifestyleMatch(user1, user2),
    cleanliness: calculateCleanlinessMatch(user1, user2),
    hobbies: calculateHobbiesMatch(user1, user2),
    studyField: calculateStudyFieldMatch(user1, user2),
    preferences: calculatePreferencesMatch(user1, user2),
    schedule: calculateScheduleMatch(user1, user2),
    budget: calculateBudgetMatch(user1, user2),
  };

  // Weighted average
  const score = 
    factors.lifestyle * 0.25 +
    factors.cleanliness * 0.20 +
    factors.hobbies * 0.15 +
    factors.studyField * 0.10 +
    factors.preferences * 0.15 +
    factors.schedule * 0.10 +
    factors.budget * 0.05;

  return Math.round(score);
}

function calculateLifestyleMatch(user1: User, user2: User): number {
  if (!user1.lifestyle || !user2.lifestyle) return 50;
  
  const lifestyle1 = user1.lifestyle;
  const lifestyle2 = user2.lifestyle;
  
  // Count matching lifestyle traits
  const matches = lifestyle1.filter(trait => lifestyle2.includes(trait)).length;
  const total = Math.max(lifestyle1.length, lifestyle2.length);
  
  if (total === 0) return 50;
  
  return (matches / total) * 100;
}

function calculateCleanlinessMatch(user1: User, user2: User): number {
  const level1 = user1.cleanlinessLevel || 5;
  const level2 = user2.cleanlinessLevel || 5;
  
  // Maximum difference is 9 (1 vs 10)
  const difference = Math.abs(level1 - level2);
  
  // Convert to 0-100 scale (lower difference = higher score)
  return Math.max(0, 100 - (difference * 11));
}

function calculateHobbiesMatch(user1: User, user2: User): number {
  if (!user1.hobbies || !user2.hobbies) return 50;
  
  const hobbies1 = user1.hobbies;
  const hobbies2 = user2.hobbies;
  
  const matches = hobbies1.filter(hobby => hobbies2.includes(hobby)).length;
  const total = Math.max(hobbies1.length, hobbies2.length);
  
  if (total === 0) return 50;
  
  return (matches / total) * 100;
}

function calculateStudyFieldMatch(user1: User, user2: User): number {
  if (!user1.studyField || !user2.studyField) return 50;
  
  // Exact match
  if (user1.studyField === user2.studyField) return 100;
  
  // Related fields (you could expand this with a mapping)
  const relatedFields: Record<string, string[]> = {
    "Computer Science": ["Information Technology", "Software Engineering", "Data Science"],
    "Medicine": ["Nursing", "Pharmacy", "Dentistry"],
    "Engineering": ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering"],
    "Business": ["Economics", "Accounting", "Marketing"],
  };
  
  for (const [field, related] of Object.entries(relatedFields)) {
    if ((user1.studyField === field && related.includes(user2.studyField)) ||
        (user2.studyField === field && related.includes(user1.studyField))) {
      return 70;
    }
  }
  
  return 30; // Different fields
}

function calculatePreferencesMatch(user1: User, user2: User): number {
  if (!user1.preferences || !user2.preferences) return 50;
  
  const prefs1 = user1.preferences;
  const prefs2 = user2.preferences;
  
  // Check for conflicting preferences
  const conflicts = [
    prefs1.includes("smoker") && prefs2.includes("non_smoking"),
    prefs2.includes("smoker") && prefs1.includes("non_smoking"),
    prefs1.includes("pets") && prefs2.includes("no_pets"),
    prefs2.includes("pets") && prefs1.includes("no_pets"),
  ];
  
  if (conflicts.some(c => c)) return 0; // Major conflict
  
  // Count matching preferences
  const matches = prefs1.filter(pref => prefs2.includes(pref)).length;
  const total = Math.max(prefs1.length, prefs2.length);
  
  if (total === 0) return 50;
  
  return (matches / total) * 100;
}

function calculateScheduleMatch(user1: User, user2: User): number {
  if (!user1.sleepSchedule || !user2.sleepSchedule) return 50;
  
  const schedule1 = user1.sleepSchedule.toLowerCase();
  const schedule2 = user2.sleepSchedule.toLowerCase();
  
  if (schedule1 === schedule2) return 100;
  
  // Early bird vs night owl is a mismatch
  if ((schedule1.includes("early") && schedule2.includes("night")) ||
      (schedule1.includes("night") && schedule2.includes("early"))) {
    return 20;
  }
  
  return 60; // Moderate compatibility
}

function calculateBudgetMatch(user1: User, user2: User): number {
  // This would need budget information from user preferences
  // For now, return neutral score
  // In production, you'd compare monthly rent preferences
  return 50;
}

/**
 * Get detailed compatibility breakdown
 */
export function getCompatibilityBreakdown(user1: User, user2: User): {
  score: number;
  factors: CompatibilityFactors;
} {
  const factors: CompatibilityFactors = {
    lifestyle: calculateLifestyleMatch(user1, user2),
    cleanliness: calculateCleanlinessMatch(user1, user2),
    hobbies: calculateHobbiesMatch(user1, user2),
    studyField: calculateStudyFieldMatch(user1, user2),
    preferences: calculatePreferencesMatch(user1, user2),
    schedule: calculateScheduleMatch(user1, user2),
    budget: calculateBudgetMatch(user1, user2),
  };

  const score = 
    factors.lifestyle * 0.25 +
    factors.cleanliness * 0.20 +
    factors.hobbies * 0.15 +
    factors.studyField * 0.10 +
    factors.preferences * 0.15 +
    factors.schedule * 0.10 +
    factors.budget * 0.05;

  return {
    score: Math.round(score),
    factors,
  };
}
