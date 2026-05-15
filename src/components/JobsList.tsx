import { useState, useEffect } from 'react';
import type { JobsData } from '../types/jobs';

export function JobsList() {
  const [data, setData] = useState<JobsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      job.legacyCompany.toLowerCase().includes(query)
    );
  });

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Lyntris Jobs</h1>
        <p className="last-updated">
          Last updated: {new Date(data.generatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="jobs-filter">
        <label htmlFor="job-search" className="search-label">
          Filter by role, location, or company
        </label>
        <input
          id="job-search"
          type="search"
          className="search-input"
          placeholder="Filter by role, location, or company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
              <p className="job-company">{job.legacyCompany}</p>
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
    </div>
  );
}
