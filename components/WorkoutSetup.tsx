
import React from 'react';
import { Session, Segment } from '../types';
import { DEFAULT_SESSIONS, MAX_SPEED, MAX_INCLINE } from '../constants';
import NumberInput from './NumberInput';

interface WorkoutSetupProps {
  session: Session;
  setSession: (s: Session) => void;
  onStart: () => void;
}

const WorkoutSetup: React.FC<WorkoutSetupProps> = ({ session, setSession, onStart }) => {
  const addSegment = () => {
    const newSegment: Segment = {
      id: Math.random().toString(36).substr(2, 9),
      durationInSeconds: 60,
      speed: 3,
      incline: 0
    };
    setSession({
      ...session,
      segments: [...session.segments, newSegment]
    });
  };

  const removeSegment = (id: string) => {
    if (session.segments.length <= 5) return;
    setSession({
      ...session,
      segments: session.segments.filter(s => s.id !== id)
    });
  };

  const updateSegment = (id: string, updates: Partial<Segment>) => {
    setSession({
      ...session,
      segments: session.segments.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const loadPreset = (presetId: string) => {
    const preset = DEFAULT_SESSIONS.find(p => p.id === presetId);
    if (preset) {
      setSession(JSON.parse(JSON.stringify(preset)));
    }
  };

  const getTotalTime = () => {
    const totalSecs = session.segments.reduce((acc, s) => acc + s.durationInSeconds, 0);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in duration-500 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Treadmill Master Pro
          </h1>
          <p className="text-slate-400">Personaliza tu sesión de entrenamiento</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onChange={(e) => loadPreset(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Cargar Sesión...</option>
            {DEFAULT_SESSIONS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Nombre Sesión</span>
            <input 
              type="text" 
              value={session.name}
              onChange={(e) => setSession({...session, name: e.target.value})}
              className="bg-transparent text-xl font-bold focus:outline-none text-cyan-400 border-b border-transparent focus:border-cyan-400"
            />
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Tiempo Total</span>
            <div className="text-xl font-mono font-bold text-white">{getTotalTime()}</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-200">Tramos de Actividad</h3>
          {session.segments.map((segment, index) => {
            const mins = Math.floor(segment.durationInSeconds / 60);
            const secs = segment.durationInSeconds % 60;

            return (
              <div key={segment.id} className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-slate-800 p-4 rounded-xl border border-slate-700 items-center transition-all hover:border-slate-600">
                <div className="sm:col-span-1">
                  <span className="text-cyan-500 font-bold block mb-1">#{index + 1}</span>
                  <div className="flex gap-1">
                    <NumberInput 
                      value={mins} 
                      onChange={(v) => updateSegment(segment.id, { durationInSeconds: v * 60 + secs })}
                      max={99}
                      label="Min"
                      className="w-16"
                    />
                    <NumberInput 
                      value={secs} 
                      onChange={(v) => updateSegment(segment.id, { durationInSeconds: mins * 60 + v })}
                      max={59}
                      label="Seg"
                      className="w-16"
                    />
                  </div>
                </div>
                
                <NumberInput 
                  value={segment.speed} 
                  onChange={(v) => updateSegment(segment.id, { speed: v })}
                  min={0}
                  max={MAX_SPEED}
                  step={0.1}
                  label="Velocidad (km/h)"
                />

                <NumberInput 
                  value={segment.incline} 
                  onChange={(v) => updateSegment(segment.id, { incline: v })}
                  min={0}
                  max={MAX_INCLINE}
                  step={1}
                  label="Inclinación (%)"
                />

                <div className="flex justify-center sm:justify-end">
                  <button 
                    onClick={() => removeSegment(segment.id)}
                    disabled={session.segments.length <= 5}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors disabled:opacity-30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={addSegment}
          className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:border-cyan-500 hover:text-cyan-500 transition-all font-semibold flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir Tramo
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex justify-center z-50">
        <button 
          onClick={onStart}
          className="w-full max-w-md py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-extrabold text-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
        >
          ¡Iniciar Entrenamiento!
        </button>
      </div>
    </div>
  );
};

export default WorkoutSetup;
