import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Import the schemas from validate-jobs.ts
const JobSchema = z.object({
  id: z.string().min(1, 'Job ID is required'),
  title: z.string().min(1, 'Job title is required'),
  location: z.string().min(1, 'Job location is required'),
  legacyCompany: z.enum(['Accelint', 'Vitesse'], {
    errorMap: () => ({ message: 'legacyCompany must be either "Accelint" or "Vitesse"' }),
  }),
  applyUrl: z.string().url('Apply URL must be a valid HTTPS URL').startsWith('https://', 'Apply URL must use HTTPS'),
  sourceUrl: z.string().url('Source URL must be a valid URL'),
  sourceSystem: z.string().min(1, 'Source system is required'),
  lastSeenAt: z.string().datetime('lastSeenAt must be a valid ISO 8601 datetime'),
});

const JobsFileSchema = z.object({
  generatedAt: z.string().datetime('generatedAt must be a valid ISO 8601 datetime'),
  sourceNotes: z.array(z.string()).optional(),
  jobs: z.array(JobSchema),
});

describe('Job validation', () => {
  it('validates a correct job record', () => {
    const validJob = {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: 'San Diego, CA',
      legacyCompany: 'Accelint',
      applyUrl: 'https://example.com/apply',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Rippling',
      lastSeenAt: '2026-05-15T12:00:00Z',
    };

    const result = JobSchema.safeParse(validJob);
    expect(result.success).toBe(true);
  });

  it('fails validation for missing title', () => {
    const invalidJob = {
      id: 'test-job-1',
      title: '',
      location: 'San Diego, CA',
      legacyCompany: 'Accelint',
      applyUrl: 'https://example.com/apply',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Rippling',
      lastSeenAt: '2026-05-15T12:00:00Z',
    };

    const result = JobSchema.safeParse(invalidJob);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title');
    }
  });

  it('fails validation for missing location', () => {
    const invalidJob = {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: '',
      legacyCompany: 'Accelint',
      applyUrl: 'https://example.com/apply',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Rippling',
      lastSeenAt: '2026-05-15T12:00:00Z',
    };

    const result = JobSchema.safeParse(invalidJob);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('location');
    }
  });

  it('fails validation for bad legacy company', () => {
    const invalidJob = {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: 'San Diego, CA',
      legacyCompany: 'InvalidCompany',
      applyUrl: 'https://example.com/apply',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Rippling',
      lastSeenAt: '2026-05-15T12:00:00Z',
    };

    const result = JobSchema.safeParse(invalidJob);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('legacyCompany');
    }
  });

  it('fails validation for non-HTTPS apply URL', () => {
    const invalidJob = {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: 'San Diego, CA',
      legacyCompany: 'Accelint',
      applyUrl: 'http://example.com/apply',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Rippling',
      lastSeenAt: '2026-05-15T12:00:00Z',
    };

    const result = JobSchema.safeParse(invalidJob);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('applyUrl');
    }
  });

  it('fails validation for invalid apply URL', () => {
    const invalidJob = {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: 'San Diego, CA',
      legacyCompany: 'Accelint',
      applyUrl: 'not-a-url',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Rippling',
      lastSeenAt: '2026-05-15T12:00:00Z',
    };

    const result = JobSchema.safeParse(invalidJob);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('applyUrl');
    }
  });
});

describe('JobsFile validation', () => {
  it('validates a correct jobs file', () => {
    const validJobsFile = {
      generatedAt: '2026-05-15T12:00:00Z',
      sourceNotes: ['Note 1', 'Note 2'],
      jobs: [
        {
          id: 'test-job-1',
          title: 'Software Engineer',
          location: 'San Diego, CA',
          legacyCompany: 'Accelint',
          applyUrl: 'https://example.com/apply',
          sourceUrl: 'https://example.com/jobs',
          sourceSystem: 'Rippling',
          lastSeenAt: '2026-05-15T12:00:00Z',
        },
      ],
    };

    const result = JobsFileSchema.safeParse(validJobsFile);
    expect(result.success).toBe(true);
  });

  it('validates jobs file without sourceNotes', () => {
    const validJobsFile = {
      generatedAt: '2026-05-15T12:00:00Z',
      jobs: [
        {
          id: 'test-job-1',
          title: 'Software Engineer',
          location: 'San Diego, CA',
          legacyCompany: 'Accelint',
          applyUrl: 'https://example.com/apply',
          sourceUrl: 'https://example.com/jobs',
          sourceSystem: 'Rippling',
          lastSeenAt: '2026-05-15T12:00:00Z',
        },
      ],
    };

    const result = JobsFileSchema.safeParse(validJobsFile);
    expect(result.success).toBe(true);
  });

  it('fails validation for invalid generatedAt', () => {
    const invalidJobsFile = {
      generatedAt: 'not-a-date',
      jobs: [],
    };

    const result = JobsFileSchema.safeParse(invalidJobsFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('generatedAt');
    }
  });
});
