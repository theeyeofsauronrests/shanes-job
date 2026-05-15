import { describe, it, expect } from 'vitest';
import { parseCSV, validateRow, convertToJob } from './import-jobs';
import type { CSVRow } from './import-jobs';

describe('import-jobs', () => {
  describe('parseCSV', () => {
    it('parses valid CSV with quotes', () => {
      const csv = `title,location,legacyCompany,applyUrl,sourceSystem
"Software Engineer","San Diego, CA",Accelint,https://example.com/apply,Rippling
"Systems Engineer","Remote, USA",Vitesse,https://example.com/apply2,ADP`;

      const rows = parseCSV(csv);

      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual({
        title: 'Software Engineer',
        location: 'San Diego, CA',
        legacyCompany: 'Accelint',
        applyUrl: 'https://example.com/apply',
        sourceSystem: 'Rippling',
      });
    });

    it('throws error if CSV has no data rows', () => {
      const csv = `title,location,legacyCompany,applyUrl,sourceSystem`;

      expect(() => parseCSV(csv)).toThrow('must contain a header row and at least one data row');
    });

    it('throws error if header is missing required field', () => {
      const csv = `title,location,applyUrl,sourceSystem
"Software Engineer","San Diego, CA",https://example.com/apply,Rippling`;

      expect(() => parseCSV(csv)).toThrow('CSV header missing required field: legacyCompany');
    });

    it('throws error if row has wrong number of columns', () => {
      const csv = `title,location,legacyCompany,applyUrl,sourceSystem
"Software Engineer","San Diego, CA",Accelint`;

      expect(() => parseCSV(csv)).toThrow('Row 2: Expected 5 columns, got 3');
    });
  });

  describe('validateRow', () => {
    const validRow = {
      title: 'Software Engineer',
      location: 'San Diego, CA',
      legacyCompany: 'Accelint',
      applyUrl: 'https://example.com/apply',
      sourceSystem: 'Rippling',
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

    it('throws error if legacyCompany is missing', () => {
      const row = { ...validRow, legacyCompany: '' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: legacyCompany is required');
    });

    it('throws error if legacyCompany is invalid', () => {
      const row = { ...validRow, legacyCompany: 'InvalidCompany' };
      expect(() => validateRow(row, 2)).toThrow('Row 2: legacyCompany must be "Accelint" or "Vitesse"');
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
      legacyCompany: 'Accelint',
      applyUrl: 'https://example.com/apply',
      sourceSystem: 'Rippling',
    };

    it('converts CSV row to Job record', () => {
      const job = convertToJob(csvRow, 0);

      expect(job).toMatchObject({
        title: 'Software Engineer',
        location: 'San Diego, CA',
        legacyCompany: 'Accelint',
        applyUrl: 'https://example.com/apply',
        sourceUrl: 'https://example.com/apply',
        sourceSystem: 'Rippling',
      });
      expect(job.id).toMatch(/^accelint-manual-0-/);
      expect(job.lastSeenAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('generates unique IDs for different jobs', () => {
      const job1 = convertToJob(csvRow, 0);
      const job2 = convertToJob({ ...csvRow, title: 'Project Manager' }, 1);

      expect(job1.id).not.toBe(job2.id);
    });

    it('generates ID from title and index', () => {
      const job = convertToJob({ ...csvRow, title: 'Senior Software Engineer (Level III)' }, 5);

      expect(job.id).toBe('accelint-manual-5-senior-software-engineer-level-iii');
    });

    it('handles Vitesse jobs', () => {
      const vitesseRow = {
        ...csvRow,
        legacyCompany: 'Vitesse',
        location: 'Chantilly, VA',
      };

      const job = convertToJob(vitesseRow, 0);

      expect(job.legacyCompany).toBe('Vitesse');
      expect(job.id).toMatch(/^vitesse-manual-0-/);
    });

    it('trims whitespace from fields', () => {
      const rowWithSpaces = {
        title: '  Software Engineer  ',
        location: '  San Diego, CA  ',
        legacyCompany: 'Accelint',
        applyUrl: '  https://example.com/apply  ',
        sourceSystem: '  Rippling  ',
      };

      const job = convertToJob(rowWithSpaces, 0);

      expect(job.title).toBe('Software Engineer');
      expect(job.location).toBe('San Diego, CA');
      expect(job.applyUrl).toBe('https://example.com/apply');
      expect(job.sourceSystem).toBe('Rippling');
    });
  });
});
