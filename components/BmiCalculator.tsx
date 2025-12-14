import React, { useMemo } from 'react';

interface BmiCalculatorProps {
  weight: string;
  height: string;
}

export const BmiCalculator: React.FC<BmiCalculatorProps> = ({ weight, height }) => {
  const bmiResult = useMemo(() => {
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);

    if (isNaN(weightKg) || isNaN(heightCm) || weightKg <= 0 || heightCm <= 0) {
      return null;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    
    let category = '';
    let colorClass = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      colorClass = 'text-blue-400';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Healthy Weight';
      colorClass = 'text-green-400';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      colorClass = 'text-yellow-400';
    } else {
      category = 'Obese';
      colorClass = 'text-red-400';
    }
    
    return {
      value: bmi.toFixed(1),
      category,
      colorClass,
    };
  }, [weight, height]);

  if (!bmiResult) {
    return (
      <div className="bg-gray-900/50 border border-dashed border-gray-700 p-3 rounded-lg text-center">
        <p className="text-sm text-gray-400">Enter your weight and height to calculate your BMI.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">Your BMI (Body Mass Index)</span>
        <div className="flex items-baseline">
            <span className="text-2xl font-bold text-white">{bmiResult.value}</span>
            <span className={`ml-2 text-sm font-semibold px-2 py-0.5 rounded-full ${bmiResult.colorClass.replace('text-', 'bg-').replace('400', '500/20')}`}>
                 {bmiResult.category}
            </span>
        </div>
      </div>
    </div>
  );
};