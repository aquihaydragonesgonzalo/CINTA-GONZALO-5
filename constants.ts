
import { Session, Segment } from './types.ts';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const DEFAULT_SESSIONS: Session[] = [
  {
    id: 'hiit-gonzalo',
    name: 'HIIT GONZALO',
    segments: [
      { id: generateId(), durationInSeconds: 5 * 60, speed: 3.5, incline: 5 },  // Tramo 1
      { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 8 },  // Tramo 2
      { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 11 }, // Tramo 3
      { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 9 },  // Tramo 4
      { id: generateId(), durationInSeconds: 6 * 60, speed: 4.5, incline: 12 }, // Tramo 5
      { id: generateId(), durationInSeconds: 1 * 60, speed: 4.5, incline: 13 }, // Tramo 6
      { id: generateId(), durationInSeconds: 1 * 60, speed: 4.5, incline: 14 }, // Tramo 7
      { id: generateId(), durationInSeconds: 1 * 60, speed: 4.5, incline: 15 }, // Tramo 8
      // Tramos 9 al 17: 30 segundos cada uno, Velocidad 4, Inclinación bajando de 14 a 6
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
    ]
  },
  {
    id: 'basic-walk',
    name: 'Caminata Ligera',
    segments: [
      { id: generateId(), durationInSeconds: 3 * 60, speed: 3.5, incline: 1 },
      { id: generateId(), durationInSeconds: 3 * 60, speed: 4.0, incline: 2 },
      { id: generateId(), durationInSeconds: 3 * 60, speed: 4.5, incline: 3 },
      { id: generateId(), durationInSeconds: 3 * 60, speed: 4.0, incline: 2 },
      { id: generateId(), durationInSeconds: 3 * 60, speed: 3.5, incline: 1 },
    ]
  }
];

export const MAX_SPEED = 15;
export const MAX_INCLINE = 15;
