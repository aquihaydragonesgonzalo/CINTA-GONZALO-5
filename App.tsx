
import React, { useState } from 'react';
import { Session, AppState } from './types.ts';
import { DEFAULT_SESSIONS } from './constants.ts';
import WorkoutSetup from './components/WorkoutSetup.tsx';
import WorkoutActive from './components/WorkoutActive.tsx';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [currentSession, setCurrentSession] = useState<Session>(() => {
    return JSON.parse(JSON.stringify(DEFAULT_SESSIONS[0]));
  });

  const handleStartWorkout = () => {
    if (currentSession.segments.length < 5) {
      alert("La sesión debe tener al menos 5 tramos.");
      return;
    }
    setAppState(AppState.ACTIVE);
  };

  const handleFinishWorkout = () => {
    setAppState(AppState.SUMMARY);
  };

  const handleReturnToSetup = () => {
    setAppState(AppState.SETUP);
  };

  return (
    <div className="min-h-screen">
      {appState === AppState.SETUP && (
        <WorkoutSetup 
          session={currentSession} 
          setSession={setCurrentSession} 
          onStart={handleStartWorkout}
        />
      )}

      {appState === AppState.ACTIVE && (
        <WorkoutActive 
          session={currentSession} 
          onFinish={handleFinishWorkout}
          onCancel={handleReturnToSetup}
        />
      )}

      {appState === AppState.SUMMARY && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 bg-slate-950">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight uppercase">¡Sesión Finalizada!</h1>
          <p className="text-xl text-slate-400 mb-8 max-w-md">Buen trabajo con <span className="text-cyan-400 font-bold">{currentSession.name}</span>. Tu cuerpo te lo agradecerá.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
             <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Tramos</span>
                <span className="text-2xl font-black text-white">{currentSession.segments.length}</span>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Tiempo</span>
                <span className="text-2xl font-black text-white">
                  {Math.floor(currentSession.segments.reduce((acc, s) => acc + s.durationInSeconds, 0) / 60)}m
                </span>
             </div>
          </div>

          <button 
            onClick={handleReturnToSetup}
            className="mt-12 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl transition-all uppercase tracking-widest shadow-lg shadow-cyan-500/20"
          >
            Volver al Inicio
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
