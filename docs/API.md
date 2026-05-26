# Lyntris Jobs API Documentation

## Overview

The Lyntris Jobs API provides programmatic access to open positions at Accelint and Vitesse during the Lyntris transition. The API is **free, public, and requires no authentication**.

**Base URL:** `https://beta-lyntris-jobs.vercel.app/api/`

## Endpoints

### GET /api/jobs.json

Returns all current job openings from both Accelint and Vitesse.

**URL:** `https://beta-lyntris-jobs.vercel.app/api/jobs.json`

**Method:** `GET`

**Authentication:** None required

**CORS:** Enabled for all origins

**Response Format:**

```json
{
  "version": "1.0",
  "generatedAt": "2026-05-26T18:17:28.039Z",
  "sources": [
    {
      "name": "Accelint",
      "system": "Rippling",
      "method": "DOM Scraping",
      "lastScraped": "2026-05-26T18:17:28.039Z",
      "jobCount": 20,
      "status": "success"
    },
    {
      "name": "Vitesse",
      "system": "ADP",
      "method": "API Interception",
      "lastScraped": "2026-05-26T18:17:28.039Z",
      "jobCount": 52,
      "status": "success"
    }
  ],
  "totalJobs": 72,
  "jobs": [
    {
      "id": "accelint-scraped-f31affef-06ff-45a0-976b-ebca9a0e4ce2",
      "title": "Senior Software Engineer",
      "location": "San Diego, CA",
      "legacyCompany": "Accelint",
      "applyUrl": "https://ats.rippling.com/accelintjobboardtest/jobs/f31affef-06ff-45a0-976b-ebca9a0e4ce2",
      "sourceUrl": "https://ats.rippling.com/accelintjobboardtest/jobs",
      "sourceSystem": "Rippling",
      "lastSeenAt": "2026-05-26T18:17:18.974Z"
    },
    {
      "id": "vitesse-scraped-9202872088259_1",
      "title": "Contracts Manager",
      "location": "Longmont, CO",
      "legacyCompany": "Vitesse",
      "applyUrl": "https://vitessesys.com/careers/",
      "sourceUrl": "https://vitessesys.com/careers/",
      "sourceSystem": "ADP",
      "lastSeenAt": "2026-05-26T18:17:28.039Z"
    }
  ],
  "accessUrl": "https://beta-lyntris-jobs.vercel.app/api/jobs.json",
  "cors": "enabled"
}
```

### GET /api/metadata.json

Returns metadata about the last scrape run, including job counts and warnings.

**URL:** `https://beta-lyntris-jobs.vercel.app/api/metadata.json`

**Method:** `GET`

**Authentication:** None required

**Response Format:**

```json
{
  "lastSuccessfulScrape": "2026-05-26T18:17:28.039Z",
  "sources": [
    {
      "name": "Accelint",
      "system": "Rippling",
      "method": "DOM Scraping",
      "lastScraped": "2026-05-26T18:17:28.039Z",
      "jobCount": 20,
      "status": "success"
    },
    {
      "name": "Vitesse",
      "system": "ADP",
      "method": "API Interception",
      "lastScraped": "2026-05-26T18:17:28.039Z",
      "jobCount": 52,
      "status": "success"
    }
  ],
  "totalJobs": 72,
  "warnings": [],
  "scrapeMethod": "on-demand"
}
```

## Response Schema

### Job Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the job |
| `title` | string | Job title / role name |
| `location` | string | Job location (city, state) or "Remote" |
| `legacyCompany` | string | Either "Accelint" or "Vitesse" |
| `applyUrl` | string | Direct link to apply for this position |
| `sourceUrl` | string | URL where the job was originally posted |
| `sourceSystem` | string | ATS system ("Rippling" or "ADP") |
| `lastSeenAt` | string | ISO 8601 timestamp of when job was last scraped |

### Root Response Object

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | API version (currently "1.0") |
| `generatedAt` | string | ISO 8601 timestamp of when data was generated |
| `sources` | array | Array of source objects with scrape status |
| `totalJobs` | number | Total number of jobs across all sources |
| `jobs` | array | Array of job objects |
| `accessUrl` | string | Canonical URL for this API endpoint |
| `cors` | string | CORS status (always "enabled") |

## Usage Examples

### JavaScript / TypeScript

**Basic Fetch:**

```javascript
fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Total jobs: ${data.totalJobs}`);
    
    data.jobs.forEach(job => {
      console.log(`${job.title} at ${job.legacyCompany}`);
      console.log(`  Location: ${job.location}`);
      console.log(`  Apply: ${job.applyUrl}\n`);
    });
  })
  .catch(error => console.error('Error fetching jobs:', error));
```

**With Async/Await:**

```javascript
async function fetchLyntrisJobs() {
  try {
    const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json');
    const data = await response.json();
    
    return data.jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

// Usage
const jobs = await fetchLyntrisJobs();
console.log(`Found ${jobs.length} open positions`);
```

### React

**Functional Component with Hooks:**

```tsx
import { useEffect, useState } from 'react';

interface Job {
  id: string;
  title: string;
  location: string;
  legacyCompany: 'Accelint' | 'Vitesse';
  applyUrl: string;
}

function LyntrisJobsWidget() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json');
        const data = await response.json();
        setJobs(data.jobs);
      } catch (err) {
        setError('Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="jobs-widget">
      <h2>Open Positions ({jobs.length})</h2>
      
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Company:</strong> {job.legacyCompany}
          </p>
          <a 
            href={job.applyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="apply-button"
          >
            Apply Now
          </a>
        </div>
      ))}
    </div>
  );
}

export default LyntrisJobsWidget;
```

**With Custom Hook:**

```tsx
import { useEffect, useState } from 'react';

function useLyntrisJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json')
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { jobs, loading, error };
}

// Usage in component
function JobsPage() {
  const { jobs, loading, error } = useLyntrisJobs();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Open Positions</h1>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
```

### Vue.js

```vue
<template>
  <div class="jobs-widget">
    <h2>Open Positions ({{ jobs.length }})</h2>
    
    <div v-if="loading">Loading jobs...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    
    <div v-else>
      <div v-for="job in jobs" :key="job.id" class="job-card">
        <h3>{{ job.title }}</h3>
        <p><strong>Location:</strong> {{ job.location }}</p>
        <p><strong>Company:</strong> {{ job.legacyCompany }}</p>
        <a :href="job.applyUrl" target="_blank" rel="noopener noreferrer">
          Apply Now
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const jobs = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json');
    const data = await response.json();
    jobs.value = data.jobs;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
```

### Filtering Examples

**Filter by Company:**

```javascript
const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json');
const data = await response.json();

// Get only Accelint jobs
const accelintJobs = data.jobs.filter(job => job.legacyCompany === 'Accelint');

// Get only Vitesse jobs
const vitesseJobs = data.jobs.filter(job => job.legacyCompany === 'Vitesse');
```

**Filter by Location:**

```javascript
const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json');
const data = await response.json();

// Remote jobs only
const remoteJobs = data.jobs.filter(job => 
  job.location.toLowerCase().includes('remote')
);

// California jobs
const caJobs = data.jobs.filter(job => 
  job.location.includes('CA')
);
```

**Search by Title:**

```javascript
const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json');
const data = await response.json();

// Search for "engineer" in title
const engineerJobs = data.jobs.filter(job => 
  job.title.toLowerCase().includes('engineer')
);
```

### Next.js (Server Components)

```tsx
// app/jobs/page.tsx
async function getJobs() {
  const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  
  return response.json();
}

export default async function JobsPage() {
  const data = await getJobs();
  
  return (
    <div>
      <h1>Open Positions</h1>
      <p>Total: {data.totalJobs} jobs</p>
      
      {data.jobs.map(job => (
        <div key={job.id}>
          <h2>{job.title}</h2>
          <p>{job.location} - {job.legacyCompany}</p>
          <a href={job.applyUrl}>Apply</a>
        </div>
      ))}
    </div>
  );
}
```

## Data Freshness

- **Update Frequency:** Data is refreshed manually on-demand (typically weekly)
- **Staleness Check:** Use the `generatedAt` timestamp to determine data age
- **Source Status:** Check `sources[].status` to verify successful scraping

**Example Staleness Check:**

```javascript
const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json');
const data = await response.json();

const generatedDate = new Date(data.generatedAt);
const now = new Date();
const ageInHours = (now - generatedDate) / (1000 * 60 * 60);

if (ageInHours > 168) { // 1 week
  console.warn('Job data is more than 1 week old');
}
```

## Rate Limiting

**None.** The API is a static JSON file served by Vercel CDN with global caching. You can make as many requests as needed.

## Caching

The API responses are cached by Vercel's CDN for optimal performance:

- **Global edge caching** for fast worldwide access
- **Automatic invalidation** when new data is scraped
- **Recommended client-side caching:** 1 hour

**Client-Side Caching Example:**

```javascript
// Cache for 1 hour
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function getCachedJobs() {
  const cached = localStorage.getItem('lyntris-jobs');
  const cacheTime = localStorage.getItem('lyntris-jobs-time');
  
  if (cached && cacheTime) {
    const age = Date.now() - parseInt(cacheTime);
    if (age < CACHE_DURATION) {
      return JSON.parse(cached);
    }
  }
  
  // Fetch fresh data
  const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json');
  const data = await response.json();
  
  // Cache it
  localStorage.setItem('lyntris-jobs', JSON.stringify(data));
  localStorage.setItem('lyntris-jobs-time', Date.now().toString());
  
  return data;
}
```

## Error Handling

**Best Practices:**

```javascript
async function fetchJobsSafely() {
  try {
    const response = await fetch('https://beta-lyntris-jobs.vercel.app/api/jobs.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data.jobs || !Array.isArray(data.jobs)) {
      throw new Error('Invalid response format');
    }
    
    return data;
    
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    
    // Return fallback data or empty state
    return {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      sources: [],
      totalJobs: 0,
      jobs: [],
      accessUrl: 'https://beta-lyntris-jobs.vercel.app/api/jobs.json',
      cors: 'enabled'
    };
  }
}
```

## CORS Support

The API includes full CORS support with headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD
Access-Control-Allow-Headers: Content-Type
```

This means you can call the API from any website without CORS issues.

## Support

This is an unofficial community project maintained by Shane Quinlan.

- **GitHub Issues:** https://github.com/theeyeofsauronrests/beta-lyntris-jobs/issues
- **Email:** shane.quinlan@hypergiant.com

## License

This API and its data are provided under the Apache-2.0 license. See the repository for details.
