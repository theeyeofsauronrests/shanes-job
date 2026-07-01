import { useState, useEffect } from 'react';
import type { JobsData } from '../types/jobs';
import { HeroCarousel } from './HeroCarousel';
import { Disclaimer } from './Disclaimer';
import { Resources } from './Resources';
import { Footer } from './Footer';

export function JobsList() {
  const [data, setData] = useState<JobsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize search query from URL parameter
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  // Load jobs data
  useEffect(() => {
    fetch('/jobs.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load jobs data: ${response.statusText}`);
        }
        return response.json();
      })
      .then((jobsData: JobsData) => {
        setData(jobsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
        setLoading(false);
      });
  }, []);

  // Sync search query to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="jobs-loading">
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-error">
        <h2>Unable to load jobs</h2>
        <p>{error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  if (!data || data.jobs.length === 0) {
    return (
      <div className="jobs-empty">
        <h2>No jobs available</h2>
        <p>There are currently no open positions listed.</p>
      </div>
    );
  }

  const filteredJobs = data.jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      (job.discipline?.toLowerCase().includes(query) ?? false) ||
      (job.industry?.toLowerCase().includes(query) ?? false)
    );
  });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <p className="eyebrow">Product, Design, and Engineering roles</p>
        <h1>Shane&apos;s Job List</h1>
        <p className="jobs-intro">
          Curated opportunities for Product Managers, Designers, and Engineers.
        </p>
        <p className="last-updated">
          Last updated: {new Date(data.generatedAt).toLocaleDateString()}
        </p>
      </div>

      <HeroCarousel />

      <Disclaimer />

      <Resources />

      <div className="quick-filters">
        <button
          type="button"
          onClick={() => setSearchQuery('Product')}
          className={`quick-filter-button ${searchQuery.toLowerCase() === 'product' ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase() === 'product'}
        >
          Product
        </button>
        <button
          type="button"
          onClick={() => setSearchQuery('Design')}
          className={`quick-filter-button ${searchQuery.toLowerCase() === 'design' ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase() === 'design'}
        >
          Design
        </button>
        <button
          type="button"
          onClick={() => setSearchQuery('Engineering')}
          className={`quick-filter-button ${searchQuery.toLowerCase() === 'engineering' ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase() === 'engineering'}
        >
          Engineering
        </button>
        <button
          type="button"
          onClick={() => setSearchQuery('Remote')}
          className={`quick-filter-button ${searchQuery.toLowerCase() === 'remote' ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase() === 'remote'}
        >
          Remote
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="quick-filter-clear"
            aria-label="Clear filter"
          >
            Clear
          </button>
        )}
      </div>

      <div className="quick-filters">
        <button
          type="button"
          onClick={() => setSearchQuery('Space')}
          className={`quick-filter-button ${searchQuery.toLowerCase().includes('space') ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase().includes('space')}
        >
          Space & Satellites
        </button>
        <button
          type="button"
          onClick={() => setSearchQuery('Robotics')}
          className={`quick-filter-button ${searchQuery.toLowerCase().includes('robotics') ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase().includes('robotics')}
        >
          Robotics & Autonomy
        </button>
        <button
          type="button"
          onClick={() => setSearchQuery('Defense')}
          className={`quick-filter-button ${searchQuery.toLowerCase().includes('defense') ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase().includes('defense')}
        >
          Defense Software
        </button>
        <button
          type="button"
          onClick={() => setSearchQuery('Cyber')}
          className={`quick-filter-button ${searchQuery.toLowerCase().includes('cyber') ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase().includes('cyber')}
        >
          Cybersecurity
        </button>
        <button
          type="button"
          onClick={() => setSearchQuery('AI')}
          className={`quick-filter-button ${searchQuery.toLowerCase().includes('ai') ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase().includes('ai')}
        >
          AI & Analytics
        </button>
        <button
          type="button"
          onClick={() => setSearchQuery('Manufacturing')}
          className={`quick-filter-button ${searchQuery.toLowerCase().includes('manufacturing') ? 'active' : ''}`}
          aria-pressed={searchQuery.toLowerCase().includes('manufacturing')}
        >
          Manufacturing
        </button>
      </div>

      <div className="jobs-filter">
        <label htmlFor="job-search" className="search-label">
          Filter by role, location, company, or industry
        </label>
        <div className="search-input-container">
          <input
            id="job-search"
            type="search"
            className="search-input"
            placeholder="Filter by role, location, company, or industry"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleCopyLink}
              className="copy-link-button"
              aria-label="Copy shareable link"
              title="Copy link to share this search"
            >
              {copySuccess ? '✓' : '🔗'}
            </button>
          )}
        </div>
        <p className="job-count">
          Showing {filteredJobs.length} of {data.jobs.length} roles
        </p>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="jobs-no-match">
          <p>No jobs match your search.</p>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="jobs-list">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h2 className="job-title">{job.title}</h2>
              <p className="job-location">{job.location}</p>
              <div className="job-meta">
                <span className="job-company">{job.company}</span>
                {job.discipline ? (
                  <span className="job-discipline">{job.discipline}</span>
                ) : null}
                {job.industry ? (
                  <span className="job-industry">{job.industry}</span>
                ) : null}
              </div>
              {job.department ? <p className="job-department">{job.department}</p> : null}
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="job-apply-link"
                aria-label={`Apply for ${job.title}`}
              >
                Apply
              </a>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
