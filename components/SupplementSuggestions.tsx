import React from 'react';
import { SupplementSuggestion } from '../types';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface SupplementSuggestionsProps {
    suggestions: SupplementSuggestion[];
}

export const SupplementSuggestions: React.FC<SupplementSuggestionsProps> = ({ suggestions }) => {
    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700 mt-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                <ShieldCheckIcon className="w-7 h-7 text-cyan-400" />
                Personalized Supplement Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestions.map((sup, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-cyan-300">{sup.name}</h4>
                        <p className="text-sm font-medium text-gray-300 mt-1">Dosage: {sup.dosage}</p>
                        <p className="text-sm text-gray-400 mt-2">{sup.reason}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};