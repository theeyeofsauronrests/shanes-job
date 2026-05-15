import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroCarousel } from './HeroCarousel';

describe('HeroCarousel', () => {
  it('renders carousel with accessible region', () => {
    render(<HeroCarousel />);

    const carousel = screen.getByRole('region', { name: /hero image carousel/i });
    expect(carousel).toBeInTheDocument();
  });

  it('renders all three images', () => {
    const { container } = render(<HeroCarousel />);

    const images = container.querySelectorAll('.carousel-slide');
    expect(images).toHaveLength(3);

    // First image should be visible (active)
    expect(images[0]).toHaveClass('carousel-slide-active');
  });

  it('has accessible prev and next controls', () => {
    render(<HeroCarousel />);

    const prevButton = screen.getByRole('button', { name: /previous slide/i });
    const nextButton = screen.getByRole('button', { name: /next slide/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('advances to next slide on next button click', async () => {
    const user = userEvent.setup();
    const { container } = render(<HeroCarousel />);

    const images = container.querySelectorAll('.carousel-slide');
    expect(images[0]).toHaveClass('carousel-slide-active');

    const nextButton = screen.getByRole('button', { name: /next slide/i });
    await user.click(nextButton);

    expect(images[1]).toHaveClass('carousel-slide-active');
    expect(images[0]).not.toHaveClass('carousel-slide-active');
  });

  it('goes to previous slide on prev button click', async () => {
    const user = userEvent.setup();
    const { container } = render(<HeroCarousel />);

    const images = container.querySelectorAll('.carousel-slide');
    const prevButton = screen.getByRole('button', { name: /previous slide/i });

    await user.click(prevButton);

    // Should wrap to last image (index 2)
    expect(images[2]).toHaveClass('carousel-slide-active');
    expect(images[0]).not.toHaveClass('carousel-slide-active');
  });

  it('has accessible indicator buttons', () => {
    render(<HeroCarousel />);

    const indicators = screen.getAllByRole('tab');
    expect(indicators).toHaveLength(3);

    indicators.forEach((indicator, index) => {
      expect(indicator).toHaveAccessibleName(`Go to slide ${index + 1}`);
    });

    // First indicator should be selected
    expect(indicators[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates to specific slide via indicator', async () => {
    const user = userEvent.setup();
    const { container } = render(<HeroCarousel />);

    const images = container.querySelectorAll('.carousel-slide');
    const indicators = screen.getAllByRole('tab');

    await user.click(indicators[2]);

    expect(images[2]).toHaveClass('carousel-slide-active');
    expect(indicators[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('wraps to first slide after last slide', async () => {
    const user = userEvent.setup();
    const { container } = render(<HeroCarousel />);

    const nextButton = screen.getByRole('button', { name: /next slide/i });

    // Click next three times to wrap around
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);

    const images = container.querySelectorAll('.carousel-slide');
    expect(images[0]).toHaveClass('carousel-slide-active');
  });

  it('images have descriptive alt text', () => {
    const { container } = render(<HeroCarousel />);

    const images = container.querySelectorAll('.carousel-slide');
    expect(images[0]).toHaveAttribute('alt', 'Military tank in rugged terrain');
    expect(images[1]).toHaveAttribute('alt', 'Advanced tactical controller system');
    expect(images[2]).toHaveAttribute('alt', 'Fighter aircraft in flight');
  });

  it('inactive slides are hidden from screen readers', () => {
    const { container } = render(<HeroCarousel />);

    const images = container.querySelectorAll('.carousel-slide');

    // Only active slide (index 0) should not have aria-hidden="true"
    expect(images[0]).not.toHaveAttribute('aria-hidden', 'true');
    expect(images[1]).toHaveAttribute('aria-hidden', 'true');
    expect(images[2]).toHaveAttribute('aria-hidden', 'true');
  });
});
