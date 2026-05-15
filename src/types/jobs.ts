export type LegacyCompany = 'Accelint' | 'Vitesse';

export interface Job {
  id: string;
  title: string;
  location: string;
  legacyCompany: LegacyCompany;
  applyUrl: string;
  sourceUrl: string;
  sourceSystem: string;
  lastSeenAt: string;
}

export interface JobsData {
  generatedAt: string;
  sourceNotes?: string[];
  jobs: Job[];
}
