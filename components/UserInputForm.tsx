import React, { useState, useEffect } from 'react';
import { UserData, Gender, Goal } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { BmiCalculator } from './BmiCalculator';

interface UserInputFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const InputField: React.FC<{ label: string; id: keyof UserData; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder: string; icon: React.ReactNode; error?: string | null }> = ({ label, id, value, onChange, type = 'text', placeholder, icon, error }) => (
  <div className="relative">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none top-8">
      {icon}
    </div>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg p-3 pl-10 focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-cyan-500 focus:border-cyan-500'} transition-all duration-300`}
      required
      min={type === 'number' ? 1 : undefined}
    />
    {error && <p className="text-red-400 text-xs mt-1 absolute">{error}</p>}
  </div>
);

const SelectField: React.FC<{ label: string; id: keyof UserData; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; }> = ({ label, id, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
      required
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

export const UserInputForm: React.FC<UserInputFormProps> = ({ userData, setUserData, onSubmit, isLoading }) => {
  const [ageError, setAgeError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const age = parseInt(userData.age, 10);
    if (userData.age && (age < 18 || age > 80)) {
        setAgeError("Please enter an age between 18 and 80.");
    } else {
        setAgeError(null);
    }
  }, [userData.age]);

  return (
    <form onSubmit={onSubmit} className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 w-full max-w-2xl mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-center text-white">Your Personal Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Age" id="age" value={userData.age} onChange={handleChange} type="number" placeholder="e.g., 25" error={ageError} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>} />
        <SelectField label="Gender" id="gender" value={userData.gender} onChange={handleChange} options={Object.values(Gender)} />
        <InputField label="Weight (kg)" id="weight" value={userData.weight} onChange={handleChange} type="number" placeholder="e.g., 70" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a1 1 0 000 2c5.185 0 9.449 3.545 9.95 8.25a1 1 0 101.999-.25C16.364 6.716 11.18 3 5 3z" /><path d="M5 5a1 1 0 00-1 1v1h14V6a1 1 0 00-1-1H5z" /><path d="M4 9a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" /><path d="M3 13a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>} />
        <InputField label="Height (cm)" id="height" value={userData.height} onChange={handleChange} type="number" placeholder="e.g., 175" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}/>
      </div>
       <BmiCalculator weight={userData.weight} height={userData.height} />
      <div>
        <SelectField label="Health Goal" id="goal" value={userData.goal} onChange={handleChange} options={Object.values(Goal)} />
      </div>
       <div>
        <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-300 mb-2">
          Dietary Restrictions (optional)
        </label>
        <textarea
          id="dietaryRestrictions"
          name="dietaryRestrictions"
          value={userData.dietaryRestrictions}
          onChange={handleChange}
          rows={2}
          placeholder="e.g., Vegetarian, Gluten-Free, Nut Allergy"
          className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !!ageError}
        className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-indigo-600/20"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Your Plan...
          </>
        ) : (
          <>
            <SparklesIcon className="mr-2 h-5 w-5" />
            Generate My Plan
          </>
        )}
      </button>
    </form>
  );
};