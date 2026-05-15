import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders footer element', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('displays maintainer name', () => {
    render(<Footer />);
    expect(screen.getByText(/Created by Shane Quinlan/i)).toBeInTheDocument();
  });

  it('displays unofficial disclaimer text', () => {
    render(<Footer />);
    expect(
      screen.getByText(/This is a side project/i)
    ).toBeInTheDocument();
  });

  it('renders profile image with correct alt text', () => {
    render(<Footer />);
    const image = screen.getByAltText('Portrait of Shane Quinlan');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/shane.png');
  });

  it('renders LinkedIn link with correct attributes', () => {
    render(<Footer />);
    const linkedInLink = screen.getByRole('link', { name: /Shane Quinlan on LinkedIn/i });

    expect(linkedInLink).toBeInTheDocument();
    expect(linkedInLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/shane-quinlan-58848363/'
    );
    expect(linkedInLink).toHaveAttribute('target', '_blank');
    expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders email link with correct attributes', () => {
    render(<Footer />);
    const emailLink = screen.getByRole('link', { name: /Email Shane Quinlan/i });

    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:shane.quinlan@hypergiant.com');
  });

  it('email link does not have target="_blank"', () => {
    render(<Footer />);
    const emailLink = screen.getByRole('link', { name: /Email Shane Quinlan/i });

    expect(emailLink).not.toHaveAttribute('target', '_blank');
  });

  it('displays both LinkedIn and Email links', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('has accessible link labels', () => {
    render(<Footer />);

    expect(screen.getByLabelText('Shane Quinlan on LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Shane Quinlan')).toBeInTheDocument();
  });
});
