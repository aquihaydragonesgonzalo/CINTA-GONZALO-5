
export interface Segment {
  id: string;
  durationInSeconds: number;
  speed: number;
  incline: number;
}

export interface Session {
  id: string;
  name: string;
  segments: Segment[];
}

export enum AppState {
  SETUP = 'SETUP',
  ACTIVE = 'ACTIVE',
  SUMMARY = 'SUMMARY'
}
