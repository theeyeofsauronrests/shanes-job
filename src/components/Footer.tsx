export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <img
          src="/shane.png"
          alt="Portrait of Shane Quinlan"
          className="footer-profile-image"
        />
        <div className="footer-text">
          <p className="footer-maintainer">Created by Shane Quinlan</p>
          <p className="footer-subtitle">
            This is a side project — not an official product of Lyntris, Accelint, or Vitesse Systems
          </p>
          <div className="footer-links">
            <a
              href="https://www.linkedin.com/in/shane-quinlan-58848363/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="Shane Quinlan on LinkedIn"
            >
              LinkedIn
            </a>
            <span className="footer-separator">•</span>
            <a
              href="mailto:shane.quinlan@hypergiant.com"
              className="footer-link"
              aria-label="Email Shane Quinlan"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
