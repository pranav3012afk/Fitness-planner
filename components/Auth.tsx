import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';

type User = {
    name: string;
    email: string;
}

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLoginView && !name)) {
      setError('Please fill in all fields.');
      return;
    }
    // Simulate auth logic
    setError('');
    onLogin({ name: isLoginView ? 'Valued User' : name, email });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-700">
      <h2 className="text-3xl font-bold text-center text-white mb-2">{isLoginView ? 'Welcome Back!' : 'Create Account'}</h2>
      <p className="text-center text-gray-400 mb-6">{isLoginView ? 'Log in to continue your journey.' : 'Join us to get your personalized plan.'}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLoginView && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300" />
          </div>
        )}

        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
            </div>
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300" />
        </div>
        
        <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 pl-10 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300" />
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        
        <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          {isLoginView ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        {isLoginView ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-semibold text-cyan-400 hover:text-cyan-300 ml-2">
          {isLoginView ? 'Sign Up' : 'Log In'}
        </button>
      </p>
    </div>
  );
};