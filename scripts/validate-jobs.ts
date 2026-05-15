import { z } from 'zod';
import { readFileSync } from 'fs';
import { resolve } from 'path';

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

function validateJobs() {
  const jobsPath = resolve(process.cwd(), 'public/jobs.json');

  try {
    const fileContent = readFileSync(jobsPath, 'utf-8');
    const data = JSON.parse(fileContent);

    const result = JobsFileSchema.safeParse(data);

    if (!result.success) {
      console.error('❌ Validation failed:');
      result.error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }

    // Check for duplicate IDs
    const ids = new Set<string>();
    const duplicates: string[] = [];

    result.data.jobs.forEach((job) => {
      if (ids.has(job.id)) {
        duplicates.push(job.id);
      }
      ids.add(job.id);
    });

    if (duplicates.length > 0) {
      console.error('❌ Validation failed:');
      console.error(`  - Duplicate job IDs found: ${duplicates.join(', ')}`);
      process.exit(1);
    }

    console.log(`✅ Validation passed: ${result.data.jobs.length} jobs validated`);
    process.exit(0);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error('❌ Validation failed: public/jobs.json not found');
    } else if (error instanceof SyntaxError) {
      console.error('❌ Validation failed: Invalid JSON in public/jobs.json');
    } else {
      console.error('❌ Validation failed:', error);
    }
    process.exit(1);
  }
}

validateJobs();
