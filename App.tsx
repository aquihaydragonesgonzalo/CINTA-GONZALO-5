
import React, { useState, useEffect, useRef } from 'react';
import { Session, Segment, AppState } from './types.ts';
import { DEFAULT_SESSIONS, MAX_SPEED, MAX_INCLINE } from './constants.ts';
import NumberInput from './components/NumberInput.tsx';

// --- VISTA: CONFIGURACIÓN ---
const WorkoutSetup: React.FC<{ 
  session: Session, 
  setSession: (s: Session) => void, 
  onStart: () => void 
}> = ({ session, setSession, onStart }) => {
  
  const addSegment = () => {
    const newSegment: Segment = {
      id: Math.random().toString(36).substr(2, 9),
      durationInSeconds: 60,
      speed: 3.5,
      incline: 0
    };
    setSession({ ...session, segments: [...session.segments, newSegment] });
  };

  const updateSegment = (id: string, updates: Partial<Segment>) => {
    setSession({
      ...session,
      segments: session.segments.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const removeSegment = (id: string) => {
    if (session.segments.length <= 5) return;
    setSession({ ...session, segments: session.segments.filter(s => s.id !== id) });
  };

  const getTotalTimeStr = () => {
    const total = session.segments.reduce((acc, s) => acc + s.durationInSeconds, 0);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-32 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-cyan-500 tracking-tighter uppercase italic">Treadmill Master</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Panel de Control de Actividad</p>
        </div>
        <select 
          className="bg-slate-800 text-white px-5 py-3 rounded-2xl border border-slate-700 font-bold outline-none focus:ring-2 focus:ring-cyan-500"
          onChange={(e) => {
            const preset = DEFAULT_SESSIONS.find(p => p.id === e.target.value);
            if (preset) setSession(JSON.parse(JSON.stringify(preset)));
          }}
          defaultValue=""
        >
          <option value="" disabled>Seleccionar Sesión Predeterminada...</option>
          {DEFAULT_SESSIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </header>

      <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Nombre de la Actividad</label>
          <input 
            className="bg-transparent text-2xl font-black text-white focus:outline-none border-b-2 border-slate-700 focus:border-cyan-500 transition-all pb-1"
            value={session.name}
            onChange={(e) => setSession({...session, name: e.target.value})}
          />
        </div>
        <div className="text-center md:text-right">
          <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1 block">Duración Total Estimada</label>
          <span className="text-3xl font-mono font-black text-cyan-400">{getTotalTimeStr()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-black text-slate-300 px-1 uppercase tracking-tight">Tramos ({session.segments.length})</h2>
        <div className="grid grid-cols-1 gap-3">
          {session.segments.map((s, idx) => (
            <div key={s.id} className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 grid grid-cols-2 md:grid-cols-5 gap-6 items-end group transition-all hover:bg-slate-800">
              <div className="col-span-1">
                <span className="text-cyan-500 font-black text-[10px] block mb-2 uppercase">Tramo {idx + 1}</span>
                <div className="flex gap-2">
                  <NumberInput 
                    label="Mins" 
                    value={Math.floor(s.durationInSeconds / 60)} 
                    onChange={(v) => updateSegment(s.id, { durationInSeconds: v * 60 + (s.durationInSeconds % 60) })} 
                    max={99}
                  />
                  <NumberInput 
                    label="Segs" 
                    value={s.durationInSeconds % 60} 
                    onChange={(v) => updateSegment(s.id, { durationInSeconds: Math.floor(s.durationInSeconds / 60) * 60 + v })} 
                    max={59}
                  />
                </div>
              </div>
              <NumberInput label="Velocidad" value={s.speed} onChange={(v) => updateSegment(s.id, { speed: v })} step={0.1} max={MAX_SPEED} />
              <NumberInput label="Incl (%)" value={s.incline} onChange={(v) => updateSegment(s.id, { incline: v })} max={MAX_INCLINE} />
              <div className="flex justify-end col-span-2 md:col-span-1">
                <button 
                  onClick={() => removeSegment(s.id)} 
                  disabled={session.segments.length <= 5}
                  className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all disabled:opacity-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={addSegment} className="w-full py-5 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 hover:text-cyan-500 hover:border-cyan-500 font-black uppercase transition-all bg-slate-800/10">
        + Añadir Tramo de Actividad
      </button>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex justify-center z-50">
        <button onClick={onStart} className="w-full max-w-lg py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl text-white font-black text-2xl uppercase tracking-tighter shadow-2xl shadow-cyan-950 transition-all active:scale-95">
          Iniciar Actividad
        </button>
      </div>
    </div>
  );
};

// --- VISTA: EN CURSO ---
const WorkoutActive: React.FC<{ 
  session: Session, 
  onFinish: () => void, 
  onCancel: () => void 
}> = ({ session, onFinish, onCancel }) => {
  const [idx, setIdx] = useState(0);
  const [segRem, setSegRem] = useState(session.segments[0].durationInSeconds);
  const [totalRem, setTotalRem] = useState(session.segments.reduce((a, b) => a + b.durationInSeconds, 0));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let timer: number;
    if (!paused && segRem > 0) {
      timer = window.setInterval(() => {
        setSegRem(s => s - 1);
        setTotalRem(t => t - 1);
      }, 1000);
    } else if (segRem === 0) {
      if (idx < session.segments.length - 1) {
        const nxt = idx + 1;
        setIdx(nxt);
        setSegRem(session.segments[nxt].durationInSeconds);
      } else {
        onFinish();
      }
    }
    return () => clearInterval(timer);
  }, [paused, segRem, idx, session, onFinish]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const isAlarm = segRem <= 5 && segRem > 0;
  const curr = session.segments[idx];
  const next = session.segments[idx + 1];

  return (
    <div className={`min-h-screen flex flex-col p-6 transition-colors duration-500 ${isAlarm ? 'bg-red-950/80' : 'bg-slate-950'}`}>
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col gap-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">Actividad en curso</span>
            <h2 className="text-2xl font-black text-white italic">{session.name}</h2>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest block mb-1">Fin Actividad</p>
            <p className="text-4xl font-mono font-black text-cyan-400 tabular-nums">{fmt(totalRem)}</p>
          </div>
        </div>

        <div className={`flex-1 flex flex-col justify-center items-center rounded-[4rem] border-4 p-8 transition-all relative overflow-hidden ${isAlarm ? 'border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.2)] animate-pulse bg-red-900/10' : 'border-slate-800 bg-slate-900/20'}`}>
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <span className="bg-cyan-500/10 text-cyan-500 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest">
              Tramo {idx + 1} de {session.segments.length}
            </span>
          </div>

          <div className="text-[12rem] md:text-[16rem] font-mono font-black leading-none tabular-nums text-white drop-shadow-2xl">
            {fmt(segRem)}
          </div>

          <div className="grid grid-cols-2 gap-12 mt-12 w-full max-w-3xl">
            <div className="text-center p-8 rounded-[3rem] bg-slate-950/50 border border-slate-800/50">
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4">Velocidad</p>
              <div className="flex items-baseline justify-center gap-2">
                <p className="text-7xl sm:text-8xl font-black text-white">{curr.speed}</p>
                <span className="text-xl text-slate-600 font-bold">km/h</span>
              </div>
            </div>
            <div className="text-center p-8 rounded-[3rem] bg-slate-950/50 border border-slate-800/50">
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4">Inclinación</p>
              <div className="flex items-baseline justify-center gap-2">
                <p className="text-7xl sm:text-8xl font-black text-white">{curr.incline}</p>
                <span className="text-xl text-slate-600 font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {next && (
             <div className="flex-1 bg-slate-900/60 p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div>
                   <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Siguiente Tramo</p>
                   <p className="text-slate-300 font-bold text-lg">Vel: {next.speed} / Inc: {next.incline}%</p>
                </div>
                <div className="bg-slate-950 px-4 py-2 rounded-xl text-slate-400 font-mono font-bold">
                   {fmt(next.durationInSeconds)}
                </div>
             </div>
          )}
          <div className="flex gap-4 flex-[1.5]">
            <button onClick={onCancel} className="flex-1 py-6 bg-slate-900 text-slate-500 hover:text-red-400 font-black rounded-3xl uppercase tracking-widest transition-all">Detener</button>
            <button onClick={() => setPaused(!paused)} className={`flex-[2] py-6 rounded-3xl font-black text-2xl uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${paused ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-white text-slate-950 shadow-white/10'}`}>
              {paused ? 'Reanudar' : 'Pausa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP ---
const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [session, setSession] = useState<Session>(() => JSON.parse(JSON.stringify(DEFAULT_SESSIONS[0])));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {state === AppState.SETUP && <WorkoutSetup session={session} setSession={setSession} onStart={() => setState(AppState.ACTIVE)} />}
      {state === AppState.ACTIVE && <WorkoutActive session={session} onFinish={() => setState(AppState.SUMMARY)} onCancel={() => setState(AppState.SETUP)} />}
      {state === AppState.SUMMARY && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-950 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase italic">¡Objetivo Cumplido!</h1>
          <p className="text-xl text-slate-400 mb-12 max-w-md">Has finalizado la sesión <span className="text-cyan-400 font-bold">"{session.name}"</span> de forma excelente.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
             <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <span className="text-slate-600 text-xs font-black uppercase block mb-1">Tramos</span>
                <span className="text-3xl font-mono font-black">{session.segments.length}</span>
             </div>
             <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <span className="text-slate-600 text-xs font-black uppercase block mb-1">Tiempo</span>
                <span className="text-3xl font-mono font-black">{Math.floor(session.segments.reduce((a,b)=>a+b.durationInSeconds,0)/60)}m</span>
             </div>
          </div>

          <button onClick={() => setState(AppState.SETUP)} className="px-16 py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-black uppercase tracking-widest text-lg transition-all shadow-xl shadow-cyan-900/20 active:scale-95">
            Nueva Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
