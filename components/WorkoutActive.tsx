
import React, { useState, useEffect, useRef } from 'react';
import { Session } from '../types.ts';

interface WorkoutActiveProps {
  session: Session;
  onFinish: () => void;
  onCancel: () => void;
}

const WorkoutActive: React.FC<WorkoutActiveProps> = ({ session, onFinish, onCancel }) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [segmentTimeRemaining, setSegmentTimeRemaining] = useState(session.segments[0].durationInSeconds);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(
    session.segments.reduce((acc, s) => acc + s.durationInSeconds, 0)
  );
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPaused && segmentTimeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setSegmentTimeRemaining(prev => prev - 1);
        setTotalTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (segmentTimeRemaining === 0) {
      if (currentSegmentIndex < session.segments.length - 1) {
        const nextIndex = currentSegmentIndex + 1;
        setCurrentSegmentIndex(nextIndex);
        setSegmentTimeRemaining(session.segments[nextIndex].durationInSeconds);
      } else {
        onFinish();
      }
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isPaused, segmentTimeRemaining, currentSegmentIndex, session.segments, onFinish]);

  const currentSegment = session.segments[currentSegmentIndex];
  const nextSegment = session.segments[currentSegmentIndex + 1];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isAlarming = segmentTimeRemaining <= 5 && segmentTimeRemaining > 0;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isAlarming ? 'bg-red-950' : 'bg-slate-950'}`}>
      <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
        {/* Progreso General */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <div>
              <h2 className="text-slate-500 text-xs uppercase font-black tracking-widest mb-1">Sesión en Curso</h2>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">{session.name}</h1>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-xs uppercase font-black tracking-widest block mb-1">Tiempo Total Restante</span>
              <div className="text-4xl font-mono font-black text-cyan-400 tabular-nums">{formatTime(totalTimeRemaining)}</div>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 ease-linear" 
              style={{ width: `${(1 - (totalTimeRemaining / session.segments.reduce((acc, s) => acc + s.durationInSeconds, 0))) * 100}%` }}
            />
          </div>
        </div>

        {/* Tarjeta del Tramo Actual */}
        <div className={`flex-1 flex flex-col justify-center items-center text-center p-6 sm:p-12 rounded-[2.5rem] border-4 transition-all duration-500 relative overflow-hidden ${isAlarming ? 'border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.4)] bg-red-900/20 animate-pulse' : 'border-slate-800 shadow-2xl bg-slate-900/40'}`}>
          <div className="relative z-10 w-full">
            <div className="mb-2">
              <span className={`inline-block px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm transition-colors duration-500 ${isAlarming ? 'bg-red-500 text-white' : 'bg-cyan-500/10 text-cyan-400'}`}>
                Tramo {currentSegmentIndex + 1} de {session.segments.length}
              </span>
            </div>

            <div className={`text-[9rem] sm:text-[14rem] font-black font-mono leading-none tracking-tighter my-4 flex items-center justify-center tabular-nums transition-colors duration-500 ${isAlarming ? 'text-white' : 'text-slate-100'}`}>
               {formatTime(segmentTimeRemaining)}
            </div>

            <div className="grid grid-cols-2 gap-8 sm:gap-16 w-full max-w-2xl mx-auto mt-6">
              <div className="flex flex-col items-center p-6 rounded-3xl bg-slate-950/40 border border-slate-800/50">
                <span className="text-slate-500 uppercase font-black text-xs tracking-widest mb-3">Velocidad</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-8xl font-black text-white">{currentSegment.speed}</span>
                  <span className="text-slate-600 font-bold text-xl uppercase">km/h</span>
                </div>
              </div>
              <div className="flex flex-col items-center p-6 rounded-3xl bg-slate-950/40 border border-slate-800/50">
                <span className="text-slate-500 uppercase font-black text-xs tracking-widest mb-3">Inclinación</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-8xl font-black text-white">{currentSegment.incline}</span>
                  <span className="text-slate-600 font-bold text-xl uppercase">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vista Previa Próximo */}
        {nextSegment ? (
          <div className="mt-8 bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-black uppercase tracking-widest block">Siguiente Tramo</span>
                <span className="text-slate-200 font-bold text-lg">Vel: {nextSegment.speed} km/h • Incl: {nextSegment.incline}%</span>
              </div>
            </div>
            <div className="text-slate-400 font-mono text-xl font-bold bg-slate-950/50 px-4 py-2 rounded-xl">
              {formatTime(nextSegment.durationInSeconds)}
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-emerald-900/20 p-5 rounded-3xl border border-emerald-500/30 backdrop-blur-sm flex items-center justify-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
             <span className="text-emerald-400 font-black uppercase tracking-widest text-sm">Último tramo en curso</span>
          </div>
        )}

        {/* Controles Principales */}
        <div className="mt-10 flex gap-4 pb-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-6 bg-slate-900 hover:bg-red-900/20 hover:text-red-400 text-slate-400 font-black rounded-[2rem] transition-all uppercase tracking-widest border border-slate-800"
          >
            Finalizar
          </button>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex-[2] py-6 font-black text-2xl rounded-[2rem] transition-all uppercase tracking-widest shadow-2xl ${isPaused ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-white text-slate-950 shadow-white/10'}`}
          >
            {isPaused ? 'Reanudar' : 'Pausa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutActive;
