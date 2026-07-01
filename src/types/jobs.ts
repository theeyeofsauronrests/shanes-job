export const DISCIPLINES = ['Product', 'Design', 'Engineering'] as const;

export type Discipline = (typeof DISCIPLINES)[number];

export const INDUSTRIES = [
  'Space & Satellites',
  'Robotics & Autonomy',
  'Defense Software',
  'Cybersecurity',
  'AI & Analytics',
  'Advanced Manufacturing',
  'Other',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export type Job = {
  id: string;
  title: string;
  location: string;
  company: string;
  discipline?: Discipline;
  department?: string;
  industry?: Industry;
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
