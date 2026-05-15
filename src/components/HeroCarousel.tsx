import { useState, useEffect } from 'react';

const images = [
  { src: '/hero1.png', alt: 'Military tank in rugged terrain' },
  { src: '/hero2.png', alt: 'Advanced tactical controller system' },
  { src: '/hero3.png', alt: 'Fighter aircraft in flight' },
];

const AUTO_ADVANCE_INTERVAL = 5000; // 5 seconds

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, AUTO_ADVANCE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="hero-carousel" role="region" aria-label="Hero image carousel">
      <div className="carousel-container">
        <button
          className="carousel-control carousel-control-prev"
          onClick={goToPrevious}
          aria-label="Previous slide"
          type="button"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className="carousel-slides">
          {images.map((image, index) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              className={`carousel-slide ${index === currentIndex ? 'carousel-slide-active' : ''}`}
              aria-hidden={index !== currentIndex}
            />
          ))}
        </div>

        <button
          className="carousel-control carousel-control-next"
          onClick={goToNext}
          aria-label="Next slide"
          type="button"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="carousel-indicators" role="tablist" aria-label="Carousel slides">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? 'carousel-indicator-active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === currentIndex}
            role="tab"
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
