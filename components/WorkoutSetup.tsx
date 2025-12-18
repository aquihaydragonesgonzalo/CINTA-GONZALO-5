
import React from 'react';
import { Session, Segment } from '../types.ts';
import { DEFAULT_SESSIONS, MAX_SPEED, MAX_INCLINE } from '../constants.ts';
import NumberInput from './NumberInput.tsx';

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
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in duration-500 pb-28">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter uppercase">
            Treadmill Master Pro
          </h1>
          <p className="text-slate-400 font-medium">Configuración de Actividad</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-slate-800 text-white px-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            onChange={(e) => loadPreset(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Elegir Sesión...</option>
            {DEFAULT_SESSIONS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Nombre</span>
            <input 
              type="text" 
              value={session.name}
              onChange={(e) => setSession({...session, name: e.target.value})}
              className="bg-transparent text-xl font-black focus:outline-none text-cyan-400 border-b-2 border-transparent focus:border-cyan-400/30 transition-all"
            />
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Tiempo Total</span>
            <div className="text-2xl font-mono font-black text-white">{getTotalTime()}</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-200 pl-1">Tramos ({session.segments.length})</h3>
          {session.segments.map((segment, index) => {
            const mins = Math.floor(segment.durationInSeconds / 60);
            const secs = segment.durationInSeconds % 60;

            return (
              <div key={segment.id} className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 items-end transition-all hover:bg-slate-800 group">
                <div className="col-span-1">
                  <span className="text-cyan-500 font-black block mb-2 text-sm uppercase">Tramo {index + 1}</span>
                  <div className="flex gap-2">
                    <NumberInput 
                      value={mins} 
                      onChange={(v) => updateSegment(segment.id, { durationInSeconds: v * 60 + secs })}
                      max={99}
                      label="Mins"
                      className="w-full"
                    />
                    <NumberInput 
                      value={secs} 
                      onChange={(v) => updateSegment(segment.id, { durationInSeconds: mins * 60 + v })}
                      max={59}
                      label="Segs"
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="col-span-1">
                  <NumberInput 
                    value={segment.speed} 
                    onChange={(v) => updateSegment(segment.id, { speed: v })}
                    min={0}
                    max={MAX_SPEED}
                    step={0.1}
                    label="Vel (km/h)"
                  />
                </div>

                <div className="col-span-1">
                  <NumberInput 
                    value={segment.incline} 
                    onChange={(v) => updateSegment(segment.id, { incline: v })}
                    min={0}
                    max={MAX_INCLINE}
                    step={1}
                    label="Incl (%)"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1 flex justify-end">
                  <button 
                    onClick={() => removeSegment(segment.id)}
                    disabled={session.segments.length <= 5}
                    className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all disabled:opacity-0"
                    title="Eliminar tramo"
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
          className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 hover:border-cyan-500 hover:text-cyan-500 transition-all font-bold flex items-center justify-center gap-2 bg-slate-800/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          Añadir Tramo Adicional
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-center z-50">
        <button 
          onClick={onStart}
          className="w-full max-w-lg py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-black text-2xl shadow-2xl shadow-cyan-500/30 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-tighter"
        >
          Iniciar Actividad
        </button>
      </div>
    </div>
  );
};

export default WorkoutSetup;
