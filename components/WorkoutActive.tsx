
import React, { useState, useEffect, useRef } from 'react';
import { Session } from '../types';

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
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isAlarming ? 'bg-red-950/40' : 'bg-slate-950'}`}>
      <div className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
        {/* Total Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h2 className="text-slate-400 text-sm uppercase font-bold tracking-tighter">Sesión Actual</h2>
              <h1 className="text-2xl font-bold text-white">{session.name}</h1>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-sm uppercase font-bold">Tiempo Total</span>
              <div className="text-4xl font-mono font-black text-cyan-400">{formatTime(totalTimeRemaining)}</div>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-1000" 
              style={{ width: `${(1 - (totalTimeRemaining / session.segments.reduce((acc, s) => acc + s.durationInSeconds, 0))) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Segment Card */}
        <div className={`flex-1 flex flex-col justify-center items-center text-center p-8 rounded-3xl border-4 transition-all duration-300 ${isAlarming ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-pulse' : 'border-slate-800 shadow-2xl shadow-cyan-950/20 bg-slate-900/50'}`}>
          <div className="mb-4">
            <span className="inline-block px-4 py-1 bg-cyan-500/20 text-cyan-400 rounded-full font-bold uppercase tracking-widest text-sm mb-2">
              Tramo {currentSegmentIndex + 1} de {session.segments.length}
            </span>
          </div>

          <div className="text-[8rem] sm:text-[12rem] font-black font-mono leading-none tracking-tighter mb-4 flex items-center justify-center tabular-nums">
             {formatTime(segmentTimeRemaining)}
          </div>

          <div className="grid grid-cols-2 gap-12 w-full max-w-lg mt-8">
            <div className="flex flex-col items-center">
              <span className="text-slate-400 uppercase font-bold text-sm mb-2">Velocidad</span>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-white">{currentSegment.speed}</span>
                <span className="text-slate-500 font-bold">km/h</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-400 uppercase font-bold text-sm mb-2">Inclinación</span>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-white">{currentSegment.incline}</span>
                <span className="text-slate-500 font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next up preview */}
        {nextSegment && (
          <div className="mt-8 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase block">Próximo Tramo</span>
              <span className="text-slate-300 font-semibold">Velocidad {nextSegment.speed} km/h • Inclinación {nextSegment.incline}%</span>
            </div>
            <div className="text-slate-400 font-mono">
              {formatTime(nextSegment.durationInSeconds)}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-12 flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all uppercase tracking-wider"
          >
            Detener
          </button>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex-[2] py-5 font-black text-2xl rounded-2xl transition-all uppercase tracking-widest ${isPaused ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white text-slate-950 shadow-lg shadow-white/10'}`}
          >
            {isPaused ? 'Continuar' : 'Pausa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutActive;
