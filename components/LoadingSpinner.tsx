import React, { useState, useEffect } from 'react';

const messages = [
  "Crafting your personalized diet...",
  "Designing your workout routine...",
  "Consulting with our AI nutritionists...",
  "Building the perfect exercise schedule...",
  "Just a few more moments...",
  "Your awesome plan is almost ready!",
];

const LoadingDots = () => (
    <div className="flex space-x-2 justify-center items-center">
        <span className="sr-only">Loading...</span>
        <div className="h-4 w-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-4 w-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-4 w-4 bg-cyan-400 rounded-full animate-bounce"></div>
    </div>
)


export const LoadingSpinner: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl mt-8 w-full max-w-2xl mx-auto">
            <LoadingDots />
            <h2 className="text-2xl font-bold text-white mt-6">Generating Your Plan</h2>
            <p className="text-gray-300 mt-2 h-6 transition-opacity duration-500">
                {messages[messageIndex]}
            </p>
        </div>
    );
};