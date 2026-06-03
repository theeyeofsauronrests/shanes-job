import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Resources } from './Resources';

describe('Resources', () => {
  it('renders the resources heading', () => {
    render(<Resources />);
    expect(screen.getByRole('heading', { name: /defense tech resources/i })).toBeInTheDocument();
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
    expect(screen.getByText(/the og of deftech jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/the go-to resource for deftech news/i)).toBeInTheDocument();
  });

  it('emphasizes that Defense Tech Jobs is superior', () => {
    render(<Resources />);
    expect(screen.getByText(/it will always have more and better jobs than this site/i)).toBeInTheDocument();
  });
});
