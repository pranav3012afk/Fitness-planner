import { GoogleGenAI, Type } from "@google/genai";
import { UserData, FitnessPlan } from '../types';

const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mealSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the meal." },
    description: { type: Type.STRING, description: "A brief description of the meal and its ingredients." },
    calories: { type: Type.NUMBER, description: "Estimated calories for the meal." }
  },
  required: ['name', 'description', 'calories']
};

const dailyDietSchema = {
  type: Type.OBJECT,
  properties: {
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    snacks: mealSchema,
    totalCalories: { type: Type.NUMBER, description: "Total estimated calories for the day." }
  },
  required: ['breakfast', 'lunch', 'dinner', 'snacks', 'totalCalories']
};


const responseSchema: any = {
  type: Type.OBJECT,
  properties: {
    planScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 representing the quality, balance, and suitability of the generated plan for the user's goals."
    },
    motivationalMessage: {
      type: Type.STRING,
      description: "A short, encouraging, and motivational message for the user based on their new plan."
    },
    dietPlan: {
      type: Type.OBJECT,
      description: 'A 7-day diet plan.',
      properties: {
        monday: dailyDietSchema,
        tuesday: dailyDietSchema,
        wednesday: dailyDietSchema,
        thursday: dailyDietSchema,
        friday: dailyDietSchema,
        saturday: dailyDietSchema,
        sunday: dailyDietSchema,
      },
      required: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    exercisePlan: {
      type: Type.ARRAY,
      description: 'A weekly exercise plan with daily workouts.',
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Day of the week for the workout (e.g., 'Monday')." },
          focus: { type: Type.STRING, description: "The main focus of the workout (e.g., 'Full Body Strength', 'Cardio & Core')." },
          exercises: {
            type: Type.ARRAY,
            description: "A list of exercises for the workout day.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the exercise." },
                sets: { type: Type.STRING, description: "Number of sets (e.g., '3-4')." },
                reps: { type: Type.STRING, description: "Number of repetitions or duration (e.g., '30 seconds')." },
                description: { type: Type.STRING, description: "Brief description of how to perform the exercise with proper form." }
              },
              required: ['name', 'sets', 'reps', 'description']
            }
          }
        },
        required: ['day', 'focus', 'exercises']
      }
    },
    supplementSuggestions: {
      type: Type.ARRAY,
      description: "A list of 2-3 recommended dietary supplements based on the user's goals and plan.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the supplement (e.g., 'Whey Protein', 'Creatine Monohydrate')." },
          dosage: { type: Type.STRING, description: "Recommended daily dosage (e.g., '25g post-workout', '5g daily')." },
          reason: { type: Type.STRING, description: "A brief, clear reason why this supplement is recommended for the user." }
        },
        required: ['name', 'dosage', 'reason']
      }
    }
  },
  required: ['planScore', 'motivationalMessage', 'dietPlan', 'exercisePlan', 'supplementSuggestions']
};

const generatePrompt = (userData: UserData): string => {
  return `
    You are an expert fitness and nutrition coach.
    Based on the following user data, generate a detailed and personalized 7-day diet and exercise plan.
    User Data:
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - Weight: ${userData.weight} kg
    - Height: ${userData.height} cm
    - Primary Goal: ${userData.goal}
    - Dietary Restrictions: ${userData.dietaryRestrictions || 'None'}

    Instructions:
    1.  **Plan Score & Motivation:** First, create a 'planScore' between 0-100 that reflects how effective and balanced this plan will be for the user. Also, provide a short, encouraging 'motivationalMessage' to inspire the user.
    2.  **Diet Plan:** Create a balanced diet for 7 days (Monday to Sunday). For each day, provide meals for breakfast, lunch, dinner, and snacks. For each meal, include a name, a brief description, and an estimated calorie count. Calculate the total daily calories.
    3.  **Exercise Plan:** Create a structured workout plan for the week. Include at least 3-5 workout days. For each workout day, specify the day of the week, the main focus (e.g., 'Full Body', 'Upper Body Strength', 'Cardio & Core'), and a list of exercises. For each exercise, provide the name, sets, reps (or duration for cardio), and a brief description of the proper form.
    4.  **Supplement Suggestions:** Based on the user's goal (e.g., 'Gain Muscle', 'Lose Weight'), recommend 2-3 appropriate dietary supplements. For each, provide its name, a suggested dosage, and a clear, concise reason for the recommendation.
    5.  **Format:** The entire response must be a single, valid JSON object that strictly adheres to the provided schema. Do not include any text, markdown, or explanations outside of the JSON object.
  `;
};

export const generateFitnessPlan = async (userData: UserData): Promise<FitnessPlan> => {
  const cacheKey = `fitnessPlan_${JSON.stringify(userData)}`;
  
  try {
    const cachedItem = localStorage.getItem(cacheKey);
    if (cachedItem) {
      const { data, timestamp } = JSON.parse(cachedItem);
      if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
        console.log("Returning cached data");
        return data as FitnessPlan;
      }
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  const prompt = generatePrompt(userData);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const plan: FitnessPlan = JSON.parse(jsonText);
    
    try {
      const cacheData = { data: plan, timestamp: Date.now() };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Cache write error:", error);
    }
    
    return plan;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate fitness plan. The AI model may be overloaded. Please try again later.");
  }
};