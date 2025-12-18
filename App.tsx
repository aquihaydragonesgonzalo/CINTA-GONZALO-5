
import React, { useState, useEffect, useRef } from 'react';

// --- TIPOS ---
interface Segment {
  id: string;
  durationInSeconds: number;
  speed: number;
  incline: number;
}

interface Session {
  id: string;
  name: string;
  segments: Segment[];
}

enum AppState {
  SETUP = 'SETUP',
  ACTIVE = 'ACTIVE',
  SUMMARY = 'SUMMARY'
}

// --- CONSTANTES ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const HIIT_GONZALO_SESSIONS: Segment[] = [
  { id: generateId(), durationInSeconds: 5 * 60, speed: 3.5, incline: 5 },  // 1
  { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 8 },  // 2
  { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 11 }, // 3
  { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 9 },  // 4
  { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 12 }, // 5
  { id: generateId(), durationInSeconds: 1 * 60, speed: 4.5, incline: 13 }, // 6
  { id: generateId(), durationInSeconds: 1 * 60, speed: 4.5, incline: 14 }, // 7
  { id: generateId(), durationInSeconds: 1 * 60, speed: 4.5, incline: 15 }, // 8
  // 30s c/u, Vel 4, Inc 14->6
  { id: generateId(), durationInSeconds: 30, speed: 4, incline: 14 }, // 9
  { id: generateId(), durationInSeconds: 30, speed: 4, incline: 13 }, // 10
  { id: generateId(), durationInSeconds: 30, speed: 4, incline: 12 }, // 11
  { id: generateId(), durationInSeconds: 30, speed: 4, incline: 11 }, // 12
  { id: generateId(), durationInSeconds: 30, speed: 4, incline: 10 }, // 13
  { id: generateId(), durationInSeconds: 30, speed: 4, incline: 9 },  // 14
  { id: generateId(), durationInSeconds: 30, speed: 4, incline: 8 },  // 15
  { id: generateId(), durationInSeconds: 30, speed: 4, incline: 7 },  // 16
  { id: generateId(), durationInSeconds: 30, speed: 4, incline: 6 },  // 17
  // Final
  { id: generateId(), durationInSeconds: 30, speed: 3.5, incline: 5 }, // 18
  { id: generateId(), durationInSeconds: 30, speed: 3.5, incline: 4 }, // 19
  { id: generateId(), durationInSeconds: 30, speed: 3, incline: 3 },   // 20
  { id: generateId(), durationInSeconds: 1 * 60, speed: 2, incline: 2 }, // 21
];

const DEFAULT_SESSIONS: Session[] = [
  { id: 'hiit-gonzalo', name: 'HIIT GONZALO', segments: HIIT_GONZALO_SESSIONS },
  { 
    id: 'calentamiento', 
    name: 'Calentamiento Pro', 
    segments: [
      { id: generateId(), durationInSeconds: 120, speed: 3, incline: 2 },
      { id: generateId(), durationInSeconds: 120, speed: 4, incline: 4 },
      { id: generateId(), durationInSeconds: 120, speed: 5, incline: 6 },
      { id: generateId(), durationInSeconds: 120, speed: 4, incline: 4 },
      { id: generateId(), durationInSeconds: 120, speed: 3, incline: 2 },
    ]
  }
];

// --- COMPONENTES INTERNOS ---

const NumberInput: React.FC<{
  value: number;
  onChange: (val: number) => void;
  max?: number;
  label?: string;
  step?: number;
}> = ({ value, onChange, max = 99, label, step = 1 }) => {
  const [tempValue, setTempValue] = useState<string>(value.toString());

  useEffect(() => {
    setTempValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTempValue(val);
    if (val === '') return;
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange(Math.min(num, max));
    }
  };

  const handleBlur = () => {
    if (tempValue === '' || isNaN(parseFloat(tempValue))) {
      setTempValue('0');
      onChange(0);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {label && <label className="text-[9px] text-slate-500 font-black uppercase mb-1">{label}</label>}
      <input 
        type="number"
        value={tempValue}
        onChange={handleChange}
        onBlur={handleBlur}
        step={step}
        className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-center font-mono font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
      />
    </div>
  );
};

// --- APP PRINCIPAL ---
const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [session, setSession] = useState<Session>(() => JSON.parse(JSON.stringify(DEFAULT_SESSIONS[0])));
  
  // Estados para Entrenamiento Activo
  const [currentIdx, setCurrentIdx] = useState(0);
  const [segRem, setSegRem] = useState(0);
  const [totalRem, setTotalRem] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const startWorkout = () => {
    if (session.segments.length < 5) {
      alert("La sesión debe tener al menos 5 tramos.");
      return;
    }
    setCurrentIdx(0);
    setSegRem(session.segments[0].durationInSeconds);
    setTotalRem(session.segments.reduce((a, b) => a + b.durationInSeconds, 0));
    setIsPaused(false);
    setState(AppState.ACTIVE);
  };

  // Timer Logic
  useEffect(() => {
    let timer: number;
    if (state === AppState.ACTIVE && !isPaused && segRem > 0) {
      timer = window.setInterval(() => {
        setSegRem(prev => prev - 1);
        setTotalRem(prev => prev - 1);
      }, 1000);
    } else if (state === AppState.ACTIVE && segRem === 0) {
      if (currentIdx < session.segments.length - 1) {
        const next = currentIdx + 1;
        setCurrentIdx(next);
        setSegRem(session.segments[next].durationInSeconds);
      } else {
        setState(AppState.SUMMARY);
      }
    }
    return () => clearInterval(timer);
  }, [state, isPaused, segRem, currentIdx, session]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const updateSegment = (id: string, updates: Partial<Segment>) => {
    setSession(prev => ({
      ...prev,
      segments: prev.segments.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const addSegment = () => {
    setSession(prev => ({
      ...prev,
      segments: [...prev.segments, { id: generateId(), durationInSeconds: 60, speed: 3.5, incline: 0 }]
    }));
  };

  const removeSegment = (id: string) => {
    if (session.segments.length <= 5) return;
    setSession(prev => ({
      ...prev,
      segments: prev.segments.filter(s => s.id !== id)
    }));
  };

  return (
    <div className="min-h-screen">
      {state === AppState.SETUP && (
        <div className="max-w-4xl mx-auto p-4 py-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-cyan-500 uppercase">Treadmill Pro</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Configuración de Sesión</p>
            </div>
            <select 
              className="bg-slate-800 text-white font-bold p-3 rounded-2xl border border-slate-700 outline-none"
              onChange={(e) => {
                const preset = DEFAULT_SESSIONS.find(s => s.id === e.target.value);
                if (preset) setSession(JSON.parse(JSON.stringify(preset)));
              }}
              defaultValue=""
            >
              <option value="" disabled>Seleccionar Sesión...</option>
              {DEFAULT_SESSIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-32">
             <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50 mb-4 flex justify-between items-center">
                <input 
                  className="bg-transparent text-2xl font-black text-white focus:outline-none border-b-2 border-slate-700 focus:border-cyan-500 pb-1 w-full mr-4"
                  value={session.name}
                  onChange={(e) => setSession({...session, name: e.target.value})}
                />
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-black text-slate-500 uppercase">Tiempo Total</p>
                  <p className="text-2xl font-mono font-black text-cyan-400">
                    {Math.floor(session.segments.reduce((a,b)=>a+b.durationInSeconds,0)/60)}m {session.segments.reduce((a,b)=>a+b.durationInSeconds,0)%60}s
                  </p>
                </div>
             </div>

            {session.segments.map((s, idx) => (
              <div key={s.id} className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 flex flex-col md:flex-row gap-4 items-end animate-in slide-in-from-right duration-300" style={{animationDelay: `${idx * 20}ms`}}>
                <div className="flex-none text-cyan-500 font-black text-xs uppercase w-20">Tramo {idx + 1}</div>
                <div className="flex-1 flex gap-2 w-full">
                  <NumberInput label="Mins" value={Math.floor(s.durationInSeconds / 60)} onChange={(v) => updateSegment(s.id, { durationInSeconds: v * 60 + (s.durationInSeconds % 60) })} max={99} />
                  <NumberInput label="Segs" value={s.durationInSeconds % 60} onChange={(v) => updateSegment(s.id, { durationInSeconds: Math.floor(s.durationInSeconds / 60) * 60 + v })} max={59} />
                </div>
                <NumberInput label="Velocidad" value={s.speed} onChange={(v) => updateSegment(s.id, { speed: v })} step={0.1} max={15} />
                <NumberInput label="Incl (%)" value={s.incline} onChange={(v) => updateSegment(s.id, { incline: v })} max={15} />
                <button 
                  onClick={() => removeSegment(s.id)}
                  disabled={session.segments.length <= 5}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-3 rounded-xl transition-all disabled:opacity-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
            
            <button onClick={addSegment} className="w-full py-6 border-2 border-dashed border-slate-700 rounded-3xl text-slate-500 hover:text-cyan-500 hover:border-cyan-500 font-black uppercase transition-all mt-4">
              + Añadir Tramo de Actividad
            </button>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex justify-center z-50">
            <button onClick={startWorkout} className="w-full max-w-lg py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-white font-black text-2xl uppercase tracking-tighter shadow-2xl transition-all active:scale-95">
              Iniciar Entrenamiento
            </button>
          </div>
        </div>
      )}

      {state === AppState.ACTIVE && (
        <div className={`min-h-screen flex flex-col p-6 transition-colors duration-500 ${segRem <= 5 && segRem > 0 ? 'bg-red-950' : 'bg-slate-950'}`}>
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
            <div className="flex justify-between items-end border-b border-slate-800 pb-6 mb-8">
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">En Curso</p>
                <h2 className="text-3xl font-black text-white italic">{session.name}</h2>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Total Restante</p>
                <p className="text-5xl font-mono font-black text-cyan-400 tabular-nums leading-none">{formatTime(totalRem)}</p>
              </div>
            </div>

            <div className={`flex-1 flex flex-col justify-center items-center rounded-[4rem] border-4 p-12 transition-all relative overflow-hidden ${segRem <= 5 && segRem > 0 ? 'border-white animate-pulse bg-red-900/20' : 'border-slate-800 bg-slate-900/20 shadow-inner'}`}>
              <div className="absolute top-10">
                <span className="bg-cyan-500 text-white px-8 py-2 rounded-full text-sm font-black uppercase tracking-[0.2em]">
                  Tramo {currentIdx + 1} de {session.segments.length}
                </span>
              </div>

              <div className={`text-[15rem] md:text-[20rem] font-mono font-black leading-none tabular-nums transition-colors duration-300 ${segRem <= 5 && segRem > 0 ? 'text-white' : 'text-slate-100'}`}>
                {formatTime(segRem)}
              </div>

              <div className="grid grid-cols-2 gap-12 mt-16 w-full max-w-4xl">
                <div className="text-center bg-slate-950/40 p-10 rounded-[3rem] border border-slate-800">
                  <p className="text-slate-500 text-sm font-black uppercase mb-4 tracking-widest">Velocidad</p>
                  <p className="text-8xl font-black text-white">{session.segments[currentIdx].speed}<span className="text-2xl text-slate-600 ml-2">km/h</span></p>
                </div>
                <div className="text-center bg-slate-950/40 p-10 rounded-[3rem] border border-slate-800">
                  <p className="text-slate-500 text-sm font-black uppercase mb-4 tracking-widest">Inclinación</p>
                  <p className="text-8xl font-black text-white">{session.segments[currentIdx].incline}<span className="text-2xl text-slate-600 ml-2">%</span></p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setState(AppState.SETUP)} className="flex-1 py-7 bg-slate-900 text-slate-500 hover:text-red-500 font-black rounded-3xl uppercase tracking-widest text-lg border border-slate-800 transition-all">Cancelar</button>
              <button onClick={() => setIsPaused(!isPaused)} className={`flex-[2] py-7 rounded-3xl font-black text-3xl uppercase tracking-[0.1em] shadow-2xl transition-all active:scale-95 ${isPaused ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900'}`}>
                {isPaused ? 'Reanudar' : 'Pausar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {state === AppState.SUMMARY && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-950">
          <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(16,185,129,0.3)]">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase italic italic">¡COMPLETADO!</h1>
          <p className="text-2xl text-slate-400 mb-12 font-medium">Buen trabajo en <span className="text-cyan-400 font-black">"{session.name}"</span>.</p>
          
          <div className="flex gap-8 mb-16">
            <div className="text-center">
              <p className="text-slate-600 text-xs font-black uppercase mb-2">Tramos</p>
              <p className="text-5xl font-mono font-black">{session.segments.length}</p>
            </div>
            <div className="w-px bg-slate-800" />
            <div className="text-center">
              <p className="text-slate-600 text-xs font-black uppercase mb-2">Tiempo</p>
              <p className="text-5xl font-mono font-black">{Math.floor(session.segments.reduce((a,b)=>a+b.durationInSeconds,0)/60)}m</p>
            </div>
          </div>

          <button onClick={() => setState(AppState.SETUP)} className="px-20 py-6 bg-cyan-600 hover:bg-cyan-500 rounded-3xl font-black uppercase tracking-widest text-xl transition-all shadow-xl active:scale-95">
            Volver al Inicio
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
