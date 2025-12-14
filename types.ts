export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum Goal {
  LOSE_WEIGHT = 'Lose Weight',
  GAIN_MUSCLE = 'Gain Muscle',
  MAINTAIN_WEIGHT = 'Maintain Weight',
}

export interface UserData {
  age: string;
  gender: Gender;
  weight: string;
  height: string;
  goal: Goal;
  dietaryRestrictions: string;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
}

export interface DailyDiet {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal;
  totalCalories: number;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  description: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface SupplementSuggestion {
  name: string;
  dosage: string;
  reason: string;
}

export interface FitnessPlan {
  planScore: number;
  motivationalMessage: string;
  dietPlan: {
    monday: DailyDiet;
    tuesday: DailyDiet;
    wednesday: DailyDiet;
    thursday: DailyDiet;
    friday: DailyDiet;
    saturday: DailyDiet;
    sunday: DailyDiet;
  };
  exercisePlan: DailyWorkout[];
  supplementSuggestions: SupplementSuggestion[];
}