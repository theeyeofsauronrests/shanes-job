import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Resources } from './Resources';

describe('Resources', () => {
  it('renders the resources heading', () => {
    render(<Resources />);
    expect(screen.getByRole('heading', { name: /job search resources/i })).toBeInTheDocument();
  });

  it('renders Shane\'s Tips link', () => {
    render(<Resources />);
    const link = screen.getByRole('link', { name: /shane's tips for job hunters/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://shane-tips-for-jobs.lovable.app/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders Defense Tech Jobs link', () => {
    render(<Resources />);
    const link = screen.getByRole('link', { name: /defense tech jobs/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.defensetechjobs.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders Tectonic Defense link', () => {
    render(<Resources />);
    const link = screen.getByRole('link', { name: /tectonic defense/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.tectonicdefense.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders resource descriptions', () => {
    render(<Resources />);
    expect(screen.getByText(/not sure how to get started/i)).toBeInTheDocument();
    expect(screen.getByText(/comprehensive job board/i)).toBeInTheDocument();
    expect(screen.getByText(/news and analysis covering/i)).toBeInTheDocument();
  });

  it('describes Defense Tech Jobs comprehensively', () => {
    render(<Resources />);
    expect(screen.getByText(/must-follow, must-subscribe resource with extensive coverage/i)).toBeInTheDocument();
  });
});
