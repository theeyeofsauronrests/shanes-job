import { z } from 'zod';
import { DISCIPLINES, INDUSTRIES } from '../src/types/jobs';

export const JobSchema = z.object({
  id: z.string().min(1, 'Job ID is required'),
  title: z.string().min(1, 'Job title is required'),
  location: z.string().min(1, 'Job location is required'),
  company: z.string().min(1, 'Company is required'),
  discipline: z.enum(DISCIPLINES).optional(),
  department: z.string().min(1, 'Department cannot be empty').optional(),
  industry: z.enum(INDUSTRIES).optional(),
  applyUrl: z
    .string()
    .url('Apply URL must be a valid HTTPS URL')
    .startsWith('https://', 'Apply URL must use HTTPS'),
  sourceUrl: z.string().url('Source URL must be a valid URL'),
  sourceSystem: z.string().min(1, 'Source system is required'),
  lastSeenAt: z.string().datetime('lastSeenAt must be a valid ISO 8601 datetime'),
});

export const JobsFileSchema = z.object({
  generatedAt: z.string().datetime('generatedAt must be a valid ISO 8601 datetime'),
  sourceNotes: z.array(z.string()).optional(),
  jobs: z.array(JobSchema),
});
