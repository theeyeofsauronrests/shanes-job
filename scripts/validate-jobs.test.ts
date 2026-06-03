import { describe, it, expect } from 'vitest';
import { JobSchema, JobsFileSchema } from './job-schema';

describe('Job validation', () => {
  it('validates a correct job record', () => {
    const validJob = {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: 'San Diego, CA',
      company: 'Rise8',
      discipline: 'Engineering',
      department: 'Engineering',
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
      company: 'Rise8',
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
      company: 'Rise8',
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

  it('fails validation for missing company', () => {
    const invalidJob = {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: 'San Diego, CA',
      company: '',
      applyUrl: 'https://example.com/apply',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Rippling',
      lastSeenAt: '2026-05-15T12:00:00Z',
    };

    const result = JobSchema.safeParse(invalidJob);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('company');
    }
  });

  it('fails validation for bad discipline', () => {
    const invalidJob = {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: 'San Diego, CA',
      company: 'Rise8',
      discipline: 'Sales',
      applyUrl: 'https://example.com/apply',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Rippling',
      lastSeenAt: '2026-05-15T12:00:00Z',
    };

    const result = JobSchema.safeParse(invalidJob);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('discipline');
    }
  });

  it('fails validation for non-HTTPS apply URL', () => {
    const invalidJob = {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: 'San Diego, CA',
      company: 'Rise8',
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
      company: 'Rise8',
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
          company: 'Rise8',
          discipline: 'Engineering',
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
          company: 'Rise8',
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
