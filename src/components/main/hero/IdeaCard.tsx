export function IdeaCard() {
  return (
    <div className="hero-idea" data-hero-idea aria-hidden="true">
      <span className="hero-idea-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.2 11c.6.5 1 1.2 1.1 2h4.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 3v2"
            stroke="#fbbf24"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </span>
      <span className="hero-idea-label">IDEA</span>
      <span className="hero-idea-trail" data-idea-trail />
    </div>
  );
}
