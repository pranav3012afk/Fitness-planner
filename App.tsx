import React, { useState } from 'react';
import { UserInputForm } from './components/UserInputForm';
import { PlanDisplay } from './components/PlanDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { UserData, FitnessPlan, Gender, Goal } from './types';
import { generateFitnessPlan } from './services/geminiService';
import { Auth } from './components/Auth';
import { LogoutIcon } from './components/icons/LogoutIcon';

type User = {
    name: string;
    email: string;
}

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    age: '',
    gender: Gender.MALE,
    weight: '',
    height: '',
    goal: Goal.LOSE_WEIGHT,
    dietaryRestrictions: '',
  });
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'auth' | 'app'>('auth');


  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    resetForm();
    setView('auth');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const generatedPlan = await generateFitnessPlan(userData);
      setPlan(generatedPlan);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setPlan(null);
    setError(null);
    setUserData({
        age: '',
        gender: Gender.MALE,
        weight: '',
        height: '',
        goal: Goal.LOSE_WEIGHT,
        dietaryRestrictions: '',
    });
  }

  const renderContent = () => {
    if (view === 'auth' && !isAuthenticated) {
        return (
            <div className="animate-fade-in">
                <p className="mt-4 mb-8 text-lg text-gray-400 max-w-2xl mx-auto text-center">
                    Please sign up or log in to generate your personalized plan and unlock all features.
                </p>
                <Auth onLogin={handleLogin} />
            </div>
        )
    }

    return (
        <>
            {!plan && !isLoading && (
                <div className="animate-fade-in">
                    <UserInputForm
                    userData={userData}
                    setUserData={setUserData}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    />
                </div>
            )}

            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            
            {plan && (
                <div className="flex flex-col items-center animate-fade-in">
                <PlanDisplay 
                    plan={plan} 
                    isAuthenticated={isAuthenticated} 
                    onAuthRequest={() => setView('auth')}
                />
                <button
                    onClick={resetForm}
                    className="mt-8 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 shadow-lg"
                >
                    Create a New Plan
                </button>
                </div>
            )}
        </>
    );
  }

  return (
    <div className="min-h-screen main-bg bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="relative z-10 container mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-4 border-b border-gray-800">
          <div className="flex items-center justify-center gap-4">
            <SparklesIcon className="w-10 h-10 text-cyan-400"/>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
              AI Fitness Planner
            </h1>
          </div>
          {isAuthenticated && user && (
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <span className="text-gray-300">Welcome, <span className="font-bold text-white">{user.name}</span>!</span>
                 <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                    title="Logout"
                >
                    <LogoutIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
          )}
        </header>

        <main>
          {renderContent()}
        </main>
        
        <footer className="text-center mt-16 text-gray-500 text-sm">
            <p>Powered by Google Gemini. Plans are AI-generated and should be reviewed by a professional.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;