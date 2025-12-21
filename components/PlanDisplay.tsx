import React, { useState, useRef, forwardRef, ForwardRefRenderFunction, useLayoutEffect } from 'react';
import { FitnessPlan, DailyDiet, DailyWorkout, Meal, Exercise } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { PlanScoreCard } from './PlanScoreCard';
import { SupplementSuggestions } from './SupplementSuggestions';
import { jsPDF } from 'jspdf';


const MealIcon: React.FC<{ title: string }> = ({ title }) => {
    const iconClass = "w-6 h-6 text-indigo-300";
    switch (title.toLowerCase()) {
        case 'breakfast':
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l-6-2m6 2l-3 9M12 7l3 9" /></svg>;
        case 'lunch':
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
        case 'dinner':
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
        case 'snacks':
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12.572l-7.5 7.428-7.5-7.428m0 0a4.5 4.5 0 117.5 4.428 4.5 4.5 0 117.5-4.428z" /></svg>;
        default: return null;
    }
}

const WorkoutIcon: React.FC<{ focus: string }> = ({ focus }) => {
    const iconClass = "w-8 h-8 text-indigo-300";
    const lowerFocus = focus.toLowerCase();
    if (lowerFocus.includes('strength')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    }
    if (lowerFocus.includes('cardio')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>;
}

const MealCard: React.FC<{ title: string; meal: Meal }> = ({ title, meal }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex-1 min-w-[200px] transition-transform duration-300 hover:scale-[1.02]">
        <div className="flex items-center gap-3 mb-2">
            <MealIcon title={title} />
            <h4 className="font-semibold text-indigo-300 capitalize">{title}</h4>
        </div>
        <p className="font-bold text-white truncate">{meal.name}</p>
        <p className="text-sm text-gray-400 mt-1 h-10 overflow-hidden">{meal.description}</p>
        <p className="text-sm font-semibold text-amber-400 mt-2">{meal.calories} kcal</p>
    </div>
);

const DailyDietCard: React.FC<{ day: string; data: DailyDiet }> = ({ day, data }) => (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
            <h3 className="text-xl font-bold capitalize text-white">{day}</h3>
            <span className="text-lg font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full">{data.totalCalories} kcal</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MealCard title="Breakfast" meal={data.breakfast} />
            <MealCard title="Lunch" meal={data.lunch} />
            <MealCard title="Dinner" meal={data.dinner} />
            <MealCard title="Snacks" meal={data.snacks} />
        </div>
    </div>
);

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => (
    <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:scale-[1.02]">
        <h4 className="font-semibold text-white">{exercise.name}</h4>
        <div className="flex space-x-4 text-cyan-400 mt-1 text-sm font-medium">
            <span>Sets: {exercise.sets}</span>
            <span>Reps: {exercise.reps}</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">{exercise.description}</p>
    </div>
);

const DailyWorkoutCard: React.FC<{ workout: DailyWorkout }> = ({ workout }) => (
     <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex items-center gap-4 mb-4 pb-3 border-b border-gray-700">
            <WorkoutIcon focus={workout.focus} />
            <div>
                <h3 className="text-xl font-bold capitalize text-white">{workout.day}</h3>
                <p className="text-indigo-300 font-medium">{workout.focus}</p>
            </div>
        </div>
        <div className="space-y-4">
            {workout.exercises.map((ex, index) => (
                <ExerciseCard key={index} exercise={ex} />
            ))}
        </div>
    </div>
);

const PrintablePlan: ForwardRefRenderFunction<HTMLDivElement, { plan: FitnessPlan }> = ({ plan }, ref) => {
    const dietDays = Object.keys(plan.dietPlan);
    return (
        <div ref={ref} className="bg-gray-900 p-8 text-gray-100" style={{ width: '1000px' }}>
            <div className="text-center mb-8 border-b-2 border-gray-700 pb-4">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">AI Fitness Plan</h1>
                <p className="mt-2 text-lg text-gray-400">Your personalized diet and exercise schedule.</p>
            </div>

            <section>
                 <SupplementSuggestions suggestions={plan.supplementSuggestions} />
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-4 mt-8 border-b-2 border-indigo-500 pb-2 text-indigo-300">Diet Plan</h2>
                <div className="space-y-6">
                    {dietDays.map(day => (
                        <DailyDietCard key={`print-${day}`} day={day} data={plan.dietPlan[day as keyof typeof plan.dietPlan]} />
                    ))}
                </div>
            </section>
            
            <section>
                <h2 className="text-3xl font-bold mb-4 mt-12 border-b-2 border-cyan-500 pb-2 text-cyan-300">Exercise Plan</h2>
                <div className="space-y-6">
                    {plan.exercisePlan.map((workout, index) => (
                       <DailyWorkoutCard key={`print-${index}`} workout={workout} />
                    ))}
                </div>
            </section>
        </div>
    );
};
const PrintablePlanWithRef = forwardRef(PrintablePlan);


export const PlanDisplay: React.FC<{ plan: FitnessPlan; isAuthenticated: boolean; onAuthRequest: () => void; }> = ({ plan, isAuthenticated, onAuthRequest }) => {
    const [activeTab, setActiveTab] = useState<'diet' | 'exercise'>('diet');
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const printableRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const dietTabRef = useRef<HTMLButtonElement>(null);
    const exerciseTabRef = useRef<HTMLButtonElement>(null);
    
    useLayoutEffect(() => {
        if (activeTab === 'diet' && dietTabRef.current) {
            const { offsetLeft, clientWidth } = dietTabRef.current;
            setIndicatorStyle({ left: offsetLeft, width: clientWidth });
        } else if (activeTab === 'exercise' && exerciseTabRef.current) {
            const { offsetLeft, clientWidth } = exerciseTabRef.current;
            setIndicatorStyle({ left: offsetLeft, width: clientWidth });
        }
    }, [activeTab]);


    const dietDays = Object.keys(plan.dietPlan);

    const handleExportPdf = async () => {
        if (!printableRef.current) return;
        setIsExporting(true);

        try {
            // dynamic import to avoid "html2canvas is not a function" caused by differing module shapes
            const html2canvasModule = await import('html2canvas');
            const html2canvas = (html2canvasModule && (html2canvasModule.default ?? html2canvasModule)) as any;

            const canvas = await html2canvas(printableRef.current, {
                scale: 2,
                backgroundColor: '#111827',
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / pdfWidth;
            const imgHeight = canvasHeight / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = -heightLeft;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            pdf.save('AI-Fitness-Plan.pdf');
        } catch (error) {
            console.error("Error exporting to PDF:", error);
            // In a real app, you might want to show an error message to the user
        } finally {
            setIsExporting(false);
        }
    };


    return (
        <>
            <div className="absolute -left-[9999px] top-auto -z-10">
                <PrintablePlanWithRef ref={printableRef} plan={plan} />
            </div>
            <div className="w-full max-w-7xl mx-auto mt-8">
                <div className="animate-fade-in">
                    <PlanScoreCard score={plan.planScore} message={plan.motivationalMessage} />
                </div>
                 <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <SupplementSuggestions suggestions={plan.supplementSuggestions} />
                </div>

                <div className="bg-gray-900/30 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-700 mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700 mb-6 pb-4 gap-4">
                        <div className="relative">
                             <nav className="flex space-x-2 sm:space-x-4" aria-label="Tabs">
                                <button
                                    ref={dietTabRef}
                                    onClick={() => setActiveTab('diet')}
                                    className={`relative z-10 whitespace-nowrap py-3 px-4 rounded-lg font-medium text-base sm:text-lg transition-colors duration-300 ${
                                        activeTab === 'diet' ? 'text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Diet Plan
                                </button>
                                <button
                                    ref={exerciseTabRef}
                                    onClick={() => setActiveTab('exercise')}
                                    className={`relative z-10 whitespace-nowrap py-3 px-4 rounded-lg font-medium text-base sm:text-lg transition-colors duration-300 ${
                                        activeTab === 'exercise' ? 'text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Exercise Plan
                                </button>
                            </nav>
                             <div
                                className="absolute bg-indigo-600 h-full top-0 rounded-lg transition-all duration-300 ease-in-out"
                                style={indicatorStyle}
                            />
                        </div>
                        {isAuthenticated ? (
                            <button
                                onClick={handleExportPdf}
                                disabled={isExporting}
                                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                            >
                                {isExporting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Exporting...
                                </>
                                ) : (
                                <>
                                    <DownloadIcon className="w-5 h-5" />
                                    Download PDF
                                </>
                                )}
                            </button>
                        ) : (
                             <button
                                onClick={onAuthRequest}
                                className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 w-full sm:w-auto"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                Login to Download
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {activeTab === 'diet' && (
                            <div className="space-y-6">
                                {dietDays.map((day, index) => (
                                    <div 
                                        key={day} 
                                        className="animate-fade-in" 
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <DailyDietCard day={day} data={plan.dietPlan[day as keyof typeof plan.dietPlan]} />
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'exercise' && (
                            <div className="space-y-6">
                                {plan.exercisePlan.map((workout, index) => (
                                    <div 
                                        key={index} 
                                        className="animate-fade-in" 
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <DailyWorkoutCard workout={workout} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};