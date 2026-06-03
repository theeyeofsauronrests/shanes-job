import type { Discipline } from '../types/jobs';

export type RoleClassificationInput = {
  title: string;
  department?: string;
};

const PRODUCT_PHRASES = [
  'product manager',
  'product director',
  'product lead',
  'product owner',
  'technical product manager',
  'technical program manager',
  'mission manager',
  'mission lead',
  'mission systems',
  'solutions architect',
  'solution architect',
];

const DESIGN_PHRASES = [
  'product designer',
  'product desinger',
  'brand designer',
  'design engineer',
  'user experience',
  'ux designer',
  'ui designer',
  'visual designer',
];

const ENGINEERING_PHRASES = [
  'engineer',
  'engineering manager',
  'developer',
  'software',
  'platform',
  'devops',
  'frontend',
  'front end',
  'backend',
  'back end',
  'fullstack',
  'full stack',
  'machine learning',
  'data engineer',
  'cybersecurity',
  'infosec',
  'security engineer',
  'systems engineer',
  'system engineer',
  'architect administrator',
];

const BACK_OFFICE_TITLE_PHRASES = [
  'account executive',
  'autocad drafter',
  'business development',
  'business operations',
  'capture manager',
  'contracts manager',
  'controller',
  'demand generation',
  'finance',
  'growth lead',
  'growth manager',
  'it engineer',
  'marketing',
  'physical therapist',
  'proposal manager',
  'quality control inspector',
  'recruiter',
  'sales enablement',
  'sales engineer',
  'sales manager',
  'technical recruiter',
];

const BACK_OFFICE_DEPARTMENT_PHRASES = [
  'business development',
  'commercial sales',
  'federal sales',
  'finance',
  'growth',
  'it and facility',
  'marketing',
  'operations',
  'people',
];

const EXCEPTION_PHRASES = [
  'mission manager',
  'mission lead',
  'product manager',
  'product designer',
  'product desinger',
  'solutions architect',
  'solution architect',
  'technical product manager',
  'technical program manager',
];

function normalizeText(value: string | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9+#/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAnyPhrase(value: string, phrases: readonly string[]): boolean {
  return phrases.some((phrase) => value.includes(phrase));
}

function hasBackOfficeSignal(title: string, department: string): boolean {
  return (
    includesAnyPhrase(title, BACK_OFFICE_TITLE_PHRASES) ||
    includesAnyPhrase(department, BACK_OFFICE_DEPARTMENT_PHRASES)
  );
}

export function inferDiscipline(input: RoleClassificationInput): Discipline | undefined {
  const title = normalizeText(input.title);
  const department = normalizeText(input.department);
  const combinedText = `${title} ${department}`.trim();

  if (combinedText.length === 0) {
    return undefined;
  }

  const hasException = includesAnyPhrase(title, EXCEPTION_PHRASES);
  if (hasBackOfficeSignal(title, department) && !hasException) {
    return undefined;
  }

  if (includesAnyPhrase(title, DESIGN_PHRASES)) {
    return 'Design';
  }

  if (includesAnyPhrase(title, PRODUCT_PHRASES)) {
    return 'Product';
  }

  if (includesAnyPhrase(title, ENGINEERING_PHRASES)) {
    return 'Engineering';
  }

  return undefined;
}

export function isProductTrioRole(input: RoleClassificationInput): boolean {
  return inferDiscipline(input) !== undefined;
}
