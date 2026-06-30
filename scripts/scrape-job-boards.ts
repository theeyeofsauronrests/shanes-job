import { execFile } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import type { Discipline, Job, JobsData } from '../src/types/jobs';
import { inferDiscipline } from '../src/utils/roleFilter';

type BoardKind = 'ashby' | 'getro' | 'greenhouse' | 'lever' | 'rippling';

type JobBoardTarget = {
  company: string;
  kind: BoardKind;
  sourceSystem: string;
  sourceUrl: string;
};

type RawJob = {
  sourceId: string;
  title: string;
  location: string;
  applyUrl: string;
  department?: string;
  lastSeenAt?: string;
};

type SourceMetadata = {
  name: string;
  system: string;
  url: string;
  status: 'success' | 'failed';
  scrapedCount: number;
  jobCount: number;
  warning?: string;
};

export type ScrapeOutput = {
  data: JobsData;
  metadata: {
    generatedAt: string;
    sources: SourceMetadata[];
    totalJobs: number;
    warnings: string[];
    scrapeMethod: string;
  };
};

const PUBLIC_JOBS_PATH = join(process.cwd(), 'public/jobs.json');
const API_DIR = join(process.cwd(), 'public/api');
const API_JOBS_PATH = join(API_DIR, 'jobs.json');
const API_METADATA_PATH = join(API_DIR, 'metadata.json');
const execFileAsync = promisify(execFile);

export const JOB_BOARD_TARGETS: JobBoardTarget[] = [
  {
    company: 'Lyntris',
    kind: 'rippling',
    sourceSystem: 'Rippling',
    sourceUrl: 'https://ats.rippling.com/accelintjobboardtest/jobs',
  },
  {
    company: '8VC Portfolio',
    kind: 'getro',
    sourceSystem: 'Getro',
    sourceUrl: 'https://jobs.8vc.com/jobs?q=design',
  },
  {
    company: '8VC Portfolio',
    kind: 'getro',
    sourceSystem: 'Getro',
    sourceUrl: 'https://jobs.8vc.com/jobs?q=product',
  },
  {
    company: '8VC Portfolio',
    kind: 'getro',
    sourceSystem: 'Getro',
    sourceUrl: 'https://jobs.8vc.com/jobs?q=engineer',
  },
  {
    company: 'Rise8',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/rise8',
  },
  {
    company: 'Second Front Systems',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/Second-Front-Systems',
  },
  {
    company: 'Defense Unicorns',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/defenseunicorns',
  },
  {
    company: 'Vannevar Labs',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/vannevarlabs',
  },
  {
    company: 'Forterra',
    kind: 'rippling',
    sourceSystem: 'Rippling',
    sourceUrl: 'https://ats.rippling.com/forterra/jobs',
  },
  {
    company: 'Shield AI',
    kind: 'lever',
    sourceSystem: 'Lever',
    sourceUrl: 'https://jobs.lever.co/shieldai',
  },
  {
    company: 'Saronic',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/saronic',
  },
  {
    company: 'OneBrief',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/onebrief',
  },
  {
    company: 'Skydio',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/skydio',
  },
  {
    company: 'True Anomaly',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/trueanomalyinc',
  },
  {
    company: 'Chaos Industries',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/chaosindustries',
  },
  {
    company: 'Nominal',
    kind: 'lever',
    sourceSystem: 'Lever',
    sourceUrl: 'https://jobs.lever.co/nominal',
  },
  {
    company: 'Altana AI',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/altanaai',
  },
  {
    company: 'Noda AI',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/noda-ai',
  },
  {
    company: 'Leo Labs',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/leolabsinc',
  },
  {
    company: 'Raft',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/raft',
  },
  {
    company: 'Legion Intelligence',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/yurtsai',
  },
  {
    company: 'Rune',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/runetech',
  },
  {
    company: 'Gallatin',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/gallatin',
  },
  {
    company: 'CesiumAstro',
    kind: 'lever',
    sourceSystem: 'Lever',
    sourceUrl: 'https://jobs.lever.co/CesiumAstro',
  },
  {
    company: 'Hermeus',
    kind: 'lever',
    sourceSystem: 'Lever',
    sourceUrl: 'https://jobs.lever.co/hermeus',
  },
  {
    company: 'Astranis',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/astranis',
  },
  {
    company: 'Antares',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/Antares',
  },
  {
    company: 'K2 Space',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/k2spacecorporation',
  },
  {
    company: 'Varda Space Industries',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/vardaspace',
  },
  {
    company: 'Aalyria',
    kind: 'rippling',
    sourceSystem: 'Rippling',
    sourceUrl: 'https://ats.rippling.com/aalyria-careers/jobs',
  },
  {
    company: 'Radiant',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/radiant-industries',
  },
  {
    company: 'Quindar',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/quindar',
  },
  {
    company: 'Starfish Space',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/starfish-space-inc',
  },
  {
    company: 'Loft Orbital',
    kind: 'lever',
    sourceSystem: 'Lever',
    sourceUrl: 'https://jobs.lever.co/loftorbital',
  },
  {
    company: 'Machina Labs',
    kind: 'lever',
    sourceSystem: 'Lever',
    sourceUrl: 'https://jobs.lever.co/MachinaLabs',
  },
  {
    company: 'Chainguard',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/chainguard',
  },
  {
    company: 'Chainalysis',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/chainalysis-careers',
  },
  {
    company: 'Hadrian',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/hadrian-automation',
  },
  {
    company: 'ICEYE US',
    kind: 'ashby',
    sourceSystem: 'Ashby',
    sourceUrl: 'https://jobs.ashbyhq.com/iceye-us-jobs',
  },
  {
    company: 'Boom Supersonic',
    kind: 'rippling',
    sourceSystem: 'Rippling',
    sourceUrl: 'https://ats.rippling.com/boom-supersonic/jobs',
  },
  {
    company: 'JetZero',
    kind: 'greenhouse',
    sourceSystem: 'Greenhouse',
    sourceUrl: 'https://job-boards.greenhouse.io/jetzero',
  },
];

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

function asString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return '';
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const text = asString(item);
    return text.length > 0 ? [text] : [];
  });
}

function parseEmbeddedJson(html: string, pattern: RegExp, label: string): unknown {
  const match = html.match(pattern);
  if (!match?.[1]) {
    throw new Error(`Could not find ${label} embedded JSON`);
  }

  return JSON.parse(match[1]);
}

function toIsoDate(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    return fallback;
  }

  return parsed.toISOString();
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createJobId(company: string, sourceSystem: string, sourceId: string): string {
  return `${toSlug(company)}-${toSlug(sourceSystem)}-${toSlug(sourceId)}`;
}

function normalizeLocation(value: string): string {
  return value.replace(/\s+/g, ' ').trim() || 'Location not specified';
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

async function fetchText(url: string): Promise<{ body: string; status: number; statusText: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/json',
        'User-Agent': 'ShanesJobList/1.0 public-job-board-scraper',
      },
    });

    return {
      body: await response.text(),
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'fetch failed';
    if (!message.includes('fetch failed')) {
      throw error;
    }

    const { stdout } = await execFileAsync('curl', [
      '-L',
      '--silent',
      '--show-error',
      '--write-out',
      '\n__HTTP_STATUS__:%{http_code}',
      url,
    ], {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large API responses
    });
    const marker = '\n__HTTP_STATUS__:';
    const markerIndex = stdout.lastIndexOf(marker);

    if (markerIndex === -1) {
      throw new Error('curl fallback did not return a status code');
    }

    return {
      body: stdout.slice(0, markerIndex),
      status: Number(stdout.slice(markerIndex + marker.length).trim()),
      statusText: '',
    };
  }
}

function parseGreenhouseJobs(html: string): RawJob[] {
  const context = parseEmbeddedJson(
    html,
    /window\.__remixContext\s*=\s*(\{[\s\S]*?\});<\/script>/,
    'Greenhouse context',
  );
  const state = asRecord(asRecord(context)?.state);
  const loaderData = asRecord(state?.loaderData);
  const routeData = asRecord(loaderData?.['routes/$url_token']);
  const jobPosts = asRecord(routeData?.jobPosts);
  const data = jobPosts?.data;

  if (!Array.isArray(data)) {
    return [];
  }

  return data.flatMap((item): RawJob[] => {
    const record = asRecord(item);
    const sourceId = asString(record?.id);
    const title = asString(record?.title);
    const location = normalizeLocation(asString(record?.location));
    const applyUrl = asString(record?.absolute_url);
    const department = asRecord(record?.department);
    const departmentPath = asStringArray(department?.path);
    const departmentName = asString(department?.name);
    const departmentParts = [...departmentPath, departmentName].filter((part) => part.length > 0);

    if (!sourceId || !title || !applyUrl) {
      return [];
    }

    return [
      {
        sourceId,
        title,
        location,
        applyUrl,
        department: departmentParts.length > 0 ? departmentParts.join(' / ') : undefined,
        lastSeenAt: asString(record?.updated_at),
      },
    ];
  });
}

function parseAshbyJobs(html: string, sourceUrl: string): RawJob[] {
  const appData = parseEmbeddedJson(
    html,
    /window\.__appData\s*=\s*(\{[\s\S]*?\});\s*fetch\(/,
    'Ashby app data',
  );
  const jobBoard = asRecord(asRecord(appData)?.jobBoard);
  const jobPostings = jobBoard?.jobPostings;

  if (!Array.isArray(jobPostings)) {
    return [];
  }

  return jobPostings.flatMap((item): RawJob[] => {
    const record = asRecord(item);
    const sourceId = asString(record?.id);
    const title = asString(record?.title);
    const location = normalizeLocation(asString(record?.locationName));
    const departmentName = asString(record?.departmentName);
    const teamName = asString(record?.teamName);
    const department = teamName || departmentName;

    if (!sourceId || !title) {
      return [];
    }

    return [
      {
        sourceId,
        title,
        location,
        applyUrl: `${sourceUrl}/${sourceId}`,
        department: department || undefined,
        lastSeenAt: asString(record?.updatedAt) || asString(record?.publishedDate),
      },
    ];
  });
}

function getRipplingLocation(record: Record<string, unknown>): string {
  const locations = record.locations;
  if (!Array.isArray(locations) || locations.length === 0) {
    return 'Location not specified';
  }

  const location = asRecord(locations[0]);
  const name = asString(location?.name);
  const city = asString(location?.city);
  const stateCode = asString(location?.stateCode);
  const state = asString(location?.state);

  if (name.length > 0) {
    return name;
  }

  if (city.length > 0 && stateCode.length > 0) {
    return `${city}, ${stateCode}`;
  }

  if (city.length > 0 && state.length > 0) {
    return `${city}, ${state}`;
  }

  return 'Location not specified';
}

function parseRipplingJobs(html: string): RawJob[] {
  const nextData = parseEmbeddedJson(
    html,
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
    'Rippling Next data',
  );
  const props = asRecord(asRecord(nextData)?.props);
  const pageProps = asRecord(props?.pageProps);
  const dehydratedState = asRecord(pageProps?.dehydratedState);
  const queries = dehydratedState?.queries;

  if (!Array.isArray(queries)) {
    return [];
  }

  const jobQuery = queries.find((query) => {
    const record = asRecord(query);
    const queryKey = record?.queryKey;
    return (
      Array.isArray(queryKey) &&
      queryKey[0] === 'board' &&
      queryKey[2] === 'job-posts'
    );
  });
  const jobItems = asRecord(asRecord(asRecord(jobQuery)?.state)?.data)?.items;

  if (!Array.isArray(jobItems)) {
    return [];
  }

  return jobItems.flatMap((item): RawJob[] => {
    const record = asRecord(item);
    const sourceId = asString(record?.id);
    const title = asString(record?.name);
    const applyUrl = asString(record?.url);
    const department = asString(asRecord(record?.department)?.name);

    if (!sourceId || !title || !applyUrl) {
      return [];
    }

    return [
      {
        sourceId,
        title,
        location: getRipplingLocation(record),
        applyUrl,
        department: department || undefined,
      },
    ];
  });
}

async function fetchLeverJobs(sourceUrl: string): Promise<RawJob[]> {
  // Extract company slug from sourceUrl (e.g., "shieldai" from "https://jobs.lever.co/shieldai")
  const companySlug = sourceUrl.split('/').pop();
  if (!companySlug) {
    throw new Error('Could not extract company slug from Lever URL');
  }

  const apiUrl = `https://api.lever.co/v0/postings/${companySlug}?mode=json`;
  const { body, status } = await fetchText(apiUrl);

  if (status >= 400) {
    throw new Error(`Lever API returned ${status}`);
  }

  const data = JSON.parse(body);
  if (!Array.isArray(data)) {
    return [];
  }

  return data.flatMap((item): RawJob[] => {
    const record = asRecord(item);
    const sourceId = asString(record?.id);
    const title = asString(record?.text);
    const categories = asRecord(record?.categories);
    const location = normalizeLocation(asString(categories?.location));
    const applyUrl = asString(record?.hostedUrl);
    const department = asString(categories?.department) || asString(categories?.team);

    if (!sourceId || !title || !applyUrl) {
      return [];
    }

    return [
      {
        sourceId,
        title,
        location,
        applyUrl,
        department: department || undefined,
        lastSeenAt: asString(record?.updatedAt) || asString(record?.createdAt),
      },
    ];
  });
}

function toFilteredJob(target: JobBoardTarget, rawJob: RawJob, timestamp: string): Job | undefined {
  const discipline = inferDiscipline({
    title: rawJob.title,
    department: rawJob.department,
  });

  if (!discipline || !isHttpsUrl(rawJob.applyUrl)) {
    return undefined;
  }

  return {
    id: createJobId(target.company, target.sourceSystem, rawJob.sourceId),
    title: rawJob.title.trim(),
    location: normalizeLocation(rawJob.location),
    company: target.company,
    discipline,
    department: rawJob.department,
    applyUrl: rawJob.applyUrl,
    sourceUrl: target.sourceUrl,
    sourceSystem: target.sourceSystem,
    lastSeenAt: toIsoDate(rawJob.lastSeenAt, timestamp),
  };
}

async function scrapeTarget(target: JobBoardTarget, timestamp: string): Promise<{
  jobs: Job[];
  metadata: SourceMetadata;
}> {
  // Lever uses API, others use HTML scraping
  if (target.kind === 'lever') {
    const rawJobs = await fetchLeverJobs(target.sourceUrl);
    const jobs = rawJobs.flatMap((rawJob): Job[] => {
      const job = toFilteredJob(target, rawJob, timestamp);
      return job ? [job] : [];
    });

    return {
      jobs,
      metadata: {
        name: target.company,
        system: target.sourceSystem,
        url: target.sourceUrl,
        status: 'success',
        scrapedCount: rawJobs.length,
        jobCount: jobs.length,
      },
    };
  }

  const { body, status, statusText } = await fetchText(target.sourceUrl);

  if (target.kind === 'getro' && status === 403) {
    const warning = `${target.company} Getro source returned 403; public API access is required for automated export.`;
    return {
      jobs: [],
      metadata: {
        name: target.company,
        system: target.sourceSystem,
        url: target.sourceUrl,
        status: 'failed',
        scrapedCount: 0,
        jobCount: 0,
        warning,
      },
    };
  }

  if (status >= 400) {
    throw new Error(`${status} ${statusText}`);
  }

  const rawJobs = (() => {
    if (target.kind === 'greenhouse') {
      return parseGreenhouseJobs(body);
    }

    if (target.kind === 'ashby') {
      return parseAshbyJobs(body, target.sourceUrl);
    }

    if (target.kind === 'rippling') {
      return parseRipplingJobs(body);
    }

    return [];
  })();
  const jobs = rawJobs.flatMap((rawJob): Job[] => {
    const job = toFilteredJob(target, rawJob, timestamp);
    return job ? [job] : [];
  });

  return {
    jobs,
    metadata: {
      name: target.company,
      system: target.sourceSystem,
      url: target.sourceUrl,
      status: 'success',
      scrapedCount: rawJobs.length,
      jobCount: jobs.length,
    },
  };
}

function dedupeJobs(jobs: Job[]): Job[] {
  return Array.from(
    jobs
      .reduce((jobMap, job) => {
        if (!jobMap.has(job.applyUrl)) {
          jobMap.set(job.applyUrl, job);
        }
        return jobMap;
      }, new Map<string, Job>())
      .values(),
  ).sort((left, right) => {
    const companyCompare = left.company.localeCompare(right.company);
    if (companyCompare !== 0) {
      return companyCompare;
    }

    return left.title.localeCompare(right.title);
  });
}

export async function scrapeConfiguredJobBoards(
  targets: JobBoardTarget[] = JOB_BOARD_TARGETS,
): Promise<ScrapeOutput> {
  const timestamp = new Date().toISOString();
  const allJobs: Job[] = [];
  const sources: SourceMetadata[] = [];

  for (const target of targets) {
    try {
      const result = await scrapeTarget(target, timestamp);
      allJobs.push(...result.jobs);
      sources.push(result.metadata);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown scrape error';
      sources.push({
        name: target.company,
        system: target.sourceSystem,
        url: target.sourceUrl,
        status: 'failed',
        scrapedCount: 0,
        jobCount: 0,
        warning: message,
      });
    }
  }

  const jobs = dedupeJobs(allJobs);
  const warnings = sources.flatMap((source) => (source.warning ? [source.warning] : []));
  const data: JobsData = {
    generatedAt: timestamp,
    sourceNotes: [
      'Jobs are collected from public job boards only.',
      'Results are filtered to Product, Design, and Engineering-adjacent roles.',
      '8VC Getro URLs are configured, but Getro returned 403 to unauthenticated automated fetches.',
    ],
    jobs,
  };

  return {
    data,
    metadata: {
      generatedAt: timestamp,
      sources,
      totalJobs: jobs.length,
      warnings,
      scrapeMethod: 'public-board-fetch',
    },
  };
}

export function writeScrapeOutput(output: ScrapeOutput): void {
  writeFileSync(PUBLIC_JOBS_PATH, JSON.stringify(output.data, null, 2), 'utf-8');

  mkdirSync(API_DIR, { recursive: true });
  writeFileSync(
    API_JOBS_PATH,
    JSON.stringify(
      {
        version: '2.0',
        ...output.data,
        sources: output.metadata.sources,
        totalJobs: output.metadata.totalJobs,
      },
      null,
      2,
    ),
    'utf-8',
  );
  writeFileSync(API_METADATA_PATH, JSON.stringify(output.metadata, null, 2), 'utf-8');
}

export function getScrapeCountsByCompany(jobs: Job[]): Record<string, number> {
  return jobs.reduce<Record<string, number>>((counts, job) => {
    counts[job.company] = (counts[job.company] ?? 0) + 1;
    return counts;
  }, {});
}
