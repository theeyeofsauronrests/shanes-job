import { describe, it, expect } from 'vitest';
import { parseCSV, validateRow, convertToJob } from './import-jobs';

describe('import-jobs', () => {
  describe('parseCSV', () => {
    it('parses valid CSV with quotes', () => {
      const csv = `title,location,company,applyUrl,sourceSystem,department
"Software Engineer","San Diego, CA",Rise8,https://example.com/apply,Greenhouse,Engineering
"Product Manager","Remote",Defense Unicorns,https://example.com/apply2,Greenhouse,R&D`;

      const rows = parseCSV(csv);

      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual({
        title: 'Software Engineer',
        location: 'San Diego, CA',
        company: 'Rise8',
        applyUrl: 'https://example.com/apply',
        sourceSystem: 'Greenhouse',
        department: 'Engineering',
        discipline: undefined,
      });
    });

    it('throws error if CSV has no data rows', () => {
      const csv = 'title,location,company,applyUrl,sourceSystem';

      expect(() => parseCSV(csv)).toThrow('must contain a header row and at least one data row');
    });

    it('throws error if header is missing required field', () => {
      const csv = `title,location,applyUrl,sourceSystem
"Software Engineer","San Diego, CA",https://example.com/apply,Greenhouse`;

      expect(() => parseCSV(csv)).toThrow('CSV header missing required field: company');
    });
  });

  describe('validateRow', () => {
    const validRow = {
      title: 'Software Engineer',
      location: 'San Diego, CA',
      company: 'Rise8',
      applyUrl: 'https://example.com/apply',
      sourceSystem: 'Greenhouse',
      department: 'Engineering',
    };

    it('validates a correct row', () => {
      expect(() => validateRow(validRow, 2)).not.toThrow();
    });

    it('throws error if title is missing', () => {
      const row = { ...validRow, title: '' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: title is required');
    });

    it('throws error if location is missing', () => {
      const row = { ...validRow, location: '' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: location is required');
    });

    it('throws error if company is missing', () => {
      const row = { ...validRow, company: '' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: company is required');
    });

    it('throws error if discipline is invalid', () => {
      const row = { ...validRow, discipline: 'Sales' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: discipline must be one of Product, Design, Engineering');
    });

    it('throws error if applyUrl is missing', () => {
      const row = { ...validRow, applyUrl: '' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: applyUrl is required');
    });

    it('throws error if applyUrl is not https', () => {
      const row = { ...validRow, applyUrl: 'http://example.com/apply' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: applyUrl must be an https:// URL');
    });

    it('throws error if sourceSystem is missing', () => {
      const row = { ...validRow, sourceSystem: '' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: sourceSystem is required');
    });

    it('throws multiple errors for multiple invalid fields', () => {
      const row = { ...validRow, title: '', location: '', applyUrl: '' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: title is required, location is required, applyUrl is required');
    });
  });

  describe('convertToJob', () => {
    const csvRow = {
      title: 'Software Engineer',
      location: 'San Diego, CA',
      company: 'Rise8',
      applyUrl: 'https://example.com/apply',
      sourceSystem: 'Greenhouse',
      department: 'Engineering',
    };

    it('converts CSV row to Job record', () => {
      const job = convertToJob(csvRow, 0);

      expect(job).toMatchObject({
        title: 'Software Engineer',
        location: 'San Diego, CA',
        company: 'Rise8',
        discipline: 'Engineering',
        department: 'Engineering',
        applyUrl: 'https://example.com/apply',
        sourceUrl: 'https://example.com/apply',
        sourceSystem: 'Greenhouse',
      });
      expect(job.id).toMatch(/^rise8-manual-0-/);
      expect(job.lastSeenAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('generates unique IDs for different jobs', () => {
      const job1 = convertToJob(csvRow, 0);
      const job2 = convertToJob({ ...csvRow, title: 'Product Manager' }, 1);

      expect(job1.id).not.toBe(job2.id);
    });

    it('generates ID from company, title, and index', () => {
      const job = convertToJob({ ...csvRow, title: 'Senior Software Engineer (Level III)' }, 5);

      expect(job.id).toBe('rise8-manual-5-senior-software-engineer-level-iii');
    });

    it('uses provided discipline when valid', () => {
      const job = convertToJob({ ...csvRow, discipline: 'Product' }, 0);

      expect(job.discipline).toBe('Product');
    });

    it('trims whitespace from fields', () => {
      const rowWithSpaces = {
        title: '  Software Engineer  ',
        location: '  San Diego, CA  ',
        company: '  Rise8  ',
        applyUrl: '  https://example.com/apply  ',
        sourceSystem: '  Greenhouse  ',
        department: '  Engineering  ',
      };

      const job = convertToJob(rowWithSpaces, 0);

      expect(job.title).toBe('Software Engineer');
      expect(job.location).toBe('San Diego, CA');
      expect(job.company).toBe('Rise8');
      expect(job.applyUrl).toBe('https://example.com/apply');
      expect(job.sourceSystem).toBe('Greenhouse');
      expect(job.department).toBe('Engineering');
    });
  });
});
