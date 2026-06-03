import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      company: 'Rise8',
      discipline: 'Engineering',
      department: 'Engineering',
      applyUrl: 'https://example.com/apply/1',
      sourceUrl: 'https://example.com/jobs',
      sourceSystem: 'Test',
      lastSeenAt: '2026-05-15T12:00:00Z',
    },
    {
      id: 'test-job-2',
      title: 'Product Manager',
      location: 'Remote',
      company: 'Defense Unicorns',
      discipline: 'Product',
      department: 'R&D',
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
    // Reset URL before each test
    window.history.replaceState({}, '', '/');
  });

  it('shows loading state initially', () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}),
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

    expect(screen.getByRole('heading', { name: "Shane's Job List" })).toBeInTheDocument();
    expect(screen.getByText('San Diego, CA')).toBeInTheDocument();
    expect(screen.getByText('Rise8')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    expect(screen.getAllByText('Remote').length).toBeGreaterThan(0); // Button + location
    expect(screen.getByText('Defense Unicorns')).toBeInTheDocument();
    expect(screen.getAllByText('Engineering').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Product').length).toBeGreaterThan(0); // Button + discipline
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
      new Error('Network error'),
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
      screen.getByText('There are currently no open positions listed.'),
    ).toBeInTheDocument();
  });

  describe('filtering', () => {
    beforeEach(() => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockJobsData,
      });
    });

    it('shows job count', async () => {
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Showing 2 of 2 roles')).toBeInTheDocument();
      });
    });

    it('filters by role title case-insensitively', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'software');

      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.queryByText('Product Manager')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 roles')).toBeInTheDocument();
    });

    it('filters by location case-insensitively', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'remote');

      expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 roles')).toBeInTheDocument();
    });

    it('filters by company case-insensitively', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'rise8');

      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.queryByText('Product Manager')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 roles')).toBeInTheDocument();
    });

    it('filters by discipline case-insensitively', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'product');

      expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 roles')).toBeInTheDocument();
    });

    it('shows no-match state when filter returns no results', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'nonexistent');

      expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
      expect(screen.queryByText('Product Manager')).not.toBeInTheDocument();
      expect(screen.getByText('No jobs match your search.')).toBeInTheDocument();
      expect(screen.getByText('Try a different search term.')).toBeInTheDocument();
      expect(screen.getByText('Showing 0 of 2 roles')).toBeInTheDocument();
    });

    it('search input has accessible label', async () => {
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toHaveAccessibleName(/Filter by role, location, or company/i);
    });
  });

  describe('URL parameters', () => {
    beforeEach(() => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockJobsData,
      });
    });

    it('initializes search from URL query parameter', async () => {
      window.history.replaceState({}, '', '/?q=software');

      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByRole('searchbox')).toHaveValue('software');
      });

      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.queryByText('Product Manager')).not.toBeInTheDocument();
    });

    it('updates URL when search query changes', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'engineer');

      await waitFor(() => {
        expect(window.location.search).toBe('?q=engineer');
      });
    });

    it('removes query parameter when search is cleared', async () => {
      const user = userEvent.setup();
      window.history.replaceState({}, '', '/?q=test');

      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByRole('searchbox')).toHaveValue('test');
      });

      const searchInput = screen.getByRole('searchbox');
      await user.clear(searchInput);

      await waitFor(() => {
        expect(window.location.search).toBe('');
      });
    });

    it('handles empty query parameter', async () => {
      window.history.replaceState({}, '', '/?q=');

      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByRole('searchbox')).toHaveValue('');
      });

      expect(screen.getByText('Showing 2 of 2 roles')).toBeInTheDocument();
    });

    it('preserves URL encoding for special characters', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'C++');

      await waitFor(() => {
        expect(window.location.search).toBe('?q=C%2B%2B');
      });
    });

    it('shows copy link button when search query exists', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      // Button should not be visible initially
      expect(screen.queryByLabelText('Copy shareable link')).not.toBeInTheDocument();

      // Type a search query
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'engineer');

      // Button should now be visible
      await waitFor(() => {
        expect(screen.getByLabelText('Copy shareable link')).toBeInTheDocument();
      });
    });

    it('copies current URL to clipboard when copy button is clicked', async () => {
      const user = userEvent.setup();
      const mockWriteText = vi.fn().mockResolvedValue(undefined);

      // Mock clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: mockWriteText,
        },
        writable: true,
        configurable: true,
      });

      window.history.replaceState({}, '', '/?q=software');
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const copyButton = screen.getByLabelText('Copy shareable link');
      await user.click(copyButton);

      expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('?q=software'));
    });

    it('shows success state after copying link', async () => {
      const user = userEvent.setup();

      // Mock clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
        writable: true,
        configurable: true,
      });

      window.history.replaceState({}, '', '/?q=test');
      render(<JobsList />);

      // Wait for copy button to appear
      const copyButton = await screen.findByLabelText('Copy shareable link');
      expect(copyButton).toHaveTextContent('🔗');

      await user.click(copyButton);

      await waitFor(() => {
        expect(copyButton).toHaveTextContent('✓');
      });
    });
  });

  describe('quick filters', () => {
    beforeEach(() => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockJobsData,
      });
    });

    it('renders quick filter buttons', async () => {
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: 'Product' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Design' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Engineering' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remote' })).toBeInTheDocument();
    });

    it('filters by Product when Product button is clicked', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const productButton = screen.getByRole('button', { name: 'Product' });
      await user.click(productButton);

      expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 roles')).toBeInTheDocument();
    });

    it('filters by Design when Design button is clicked', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const designButton = screen.getByRole('button', { name: 'Design' });
      await user.click(designButton);

      expect(screen.getByText('No jobs match your search.')).toBeInTheDocument();
      expect(screen.getByText('Showing 0 of 2 roles')).toBeInTheDocument();
    });

    it('filters by Engineering when Engineering button is clicked', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const engineeringButton = screen.getByRole('button', { name: 'Engineering' });
      await user.click(engineeringButton);

      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.queryByText('Product Manager')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 roles')).toBeInTheDocument();
    });

    it('filters by Remote when Remote button is clicked', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const remoteButton = screen.getByRole('button', { name: 'Remote' });
      await user.click(remoteButton);

      expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 2 roles')).toBeInTheDocument();
    });

    it('shows active state on selected filter', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const productButton = screen.getByRole('button', { name: 'Product' });
      await user.click(productButton);

      expect(productButton).toHaveClass('active');
      expect(productButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('shows clear button when filter is active', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      // Clear button should not be visible initially
      expect(screen.queryByLabelText('Clear filter')).not.toBeInTheDocument();

      const productButton = screen.getByRole('button', { name: 'Product' });
      await user.click(productButton);

      // Clear button should now be visible
      expect(screen.getByLabelText('Clear filter')).toBeInTheDocument();
    });

    it('clears filter when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      // Apply a filter
      const productButton = screen.getByRole('button', { name: 'Product' });
      await user.click(productButton);

      expect(screen.queryByText('Software Engineer')).not.toBeInTheDocument();

      // Click clear
      const clearButton = screen.getByLabelText('Clear filter');
      await user.click(clearButton);

      // All jobs should be visible again
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
      expect(screen.getByText('Showing 2 of 2 roles')).toBeInTheDocument();
    });

    it('updates URL when quick filter is clicked', async () => {
      const user = userEvent.setup();
      render(<JobsList />);

      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });

      const remoteButton = screen.getByRole('button', { name: 'Remote' });
      await user.click(remoteButton);

      await waitFor(() => {
        expect(window.location.search).toBe('?q=Remote');
      });
    });
  });
});
