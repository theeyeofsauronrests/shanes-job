export const DISCIPLINES = ['Product', 'Design', 'Engineering'] as const;

export type Discipline = (typeof DISCIPLINES)[number];

export type Job = {
  id: string;
  title: string;
  location: string;
  company: string;
  discipline?: Discipline;
  department?: string;
  applyUrl: string;
  sourceUrl: string;
  sourceSystem: string;
  lastSeenAt: string;
};

export type JobsData = {
  generatedAt: string;
  sourceNotes?: string[];
  jobs: Job[];
};
