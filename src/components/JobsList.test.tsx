import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { JobsList } from './JobsList';
import type { JobsData } from '../types/jobs';

const mockJobsData: JobsData = {
  generatedAt: '2026-05-15T12:00:00Z',
  sourceNotes: ['Test data'],
  jobs: [
    {
      id: 'test-job-1',
      title: 'Software Engineer',
      location: 'San Diego, CA',
      legacyCompany: 'Accelint',
      applyUrl: 'https://example.com/apply/1',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Test',
      lastSeenAt: '2026-05-15T12:00:00Z',
    },
    {
      id: 'test-job-2',
      title: 'Project Manager',
      location: 'Chantilly, VA',
      legacyCompany: 'Vitesse',
      applyUrl: 'https://example.com/apply/2',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Test',
      lastSeenAt: '2026-05-15T12:00:00Z',
    },
  ],
};

describe('JobsList', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  it('shows loading state initially', () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {})
    );

    render(<JobsList />);
    expect(screen.getByText('Loading jobs...')).toBeInTheDocument();
  });

  it('renders jobs list when data loads successfully', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobsData,
    });

    render(<JobsList />);

    await waitFor(() => {
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    expect(screen.getByText('San Diego, CA')).toBeInTheDocument();
    expect(screen.getByText('Accelint')).toBeInTheDocument();
    expect(screen.getByText('Project Manager')).toBeInTheDocument();
    expect(screen.getByText('Chantilly, VA')).toBeInTheDocument();
    expect(screen.getByText('Vitesse')).toBeInTheDocument();
  });

  it('displays last updated date', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobsData,
    });

    render(<JobsList />);

    await waitFor(() => {
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });

  it('apply links have correct attributes', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobsData,
    });

    render(<JobsList />);

    await waitFor(() => {
      const applyLinks = screen.getAllByRole('link', { name: /Apply for/i });
      expect(applyLinks).toHaveLength(2);

      applyLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  it('shows error state when fetch fails', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<JobsList />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load jobs')).toBeInTheDocument();
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByText('Please try refreshing the page.')).toBeInTheDocument();
  });

  it('shows error state when response is not ok', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    render(<JobsList />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load jobs')).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to load jobs data: Not Found/)).toBeInTheDocument();
  });

  it('shows empty state when no jobs exist', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        generatedAt: '2026-05-15T12:00:00Z',
        jobs: [],
      }),
    });

    render(<JobsList />);

    await waitFor(() => {
      expect(screen.getByText('No jobs available')).toBeInTheDocument();
    });

    expect(
      screen.getByText('There are currently no open positions listed.')
    ).toBeInTheDocument();
  });
});
