
import { Session, Segment } from './types.ts';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const DEFAULT_SESSIONS: Session[] = [
  {
    id: 'hiit-gonzalo',
    name: 'HIIT GONZALO',
    segments: [
      { id: generateId(), durationInSeconds: 5 * 60, speed: 3.5, incline: 5 },
      { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 8 },
      { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 11 },
      { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 9 },
      { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 12 },
      { id: generateId(), durationInSeconds: 1 * 60, speed: 4.5, incline: 13 },
      { id: generateId(), durationInSeconds: 1 * 60, speed: 4.5, incline: 14 },
      { id: generateId(), durationInSeconds: 1 * 60, speed: 4.5, incline: 15 },
      // Tramos 9 al 17 (30s cada uno, Velocidad 4, Inclinación bajando de 14 a 6)
      ...Array.from({ length: 9 }, (_, i) => ({
        id: generateId(),
        durationInSeconds: 30,
        speed: 4,
        incline: 14 - i
      })),
      { id: generateId(), durationInSeconds: 30, speed: 3.5, incline: 5 },
      { id: generateId(), durationInSeconds: 30, speed: 3.5, incline: 4 },
      { id: generateId(), durationInSeconds: 30, speed: 3, incline: 3 },
      { id: generateId(), durationInSeconds: 1 * 60, speed: 2, incline: 2 },
    ]
  },
  {
    id: 'basic-warmup',
    name: 'Calentamiento Básico',
    segments: [
      { id: generateId(), durationInSeconds: 2 * 60, speed: 3, incline: 0 },
      { id: generateId(), durationInSeconds: 2 * 60, speed: 4, incline: 2 },
      { id: generateId(), durationInSeconds: 2 * 60, speed: 5, incline: 4 },
      { id: generateId(), durationInSeconds: 2 * 60, speed: 6, incline: 2 },
      { id: generateId(), durationInSeconds: 2 * 60, speed: 3, incline: 0 },
    ]
  }
];

export const MAX_SPEED = 15;
export const MAX_INCLINE = 15;
