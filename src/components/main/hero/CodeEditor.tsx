import { CODE_LINES } from "./timeline";

export function CodeEditor() {
  return (
    <div className="hero-editor" data-hero-editor aria-hidden="true">
      <div className="hero-editor-bar">
        <span className="hero-editor-dot hero-editor-dot--r" />
        <span className="hero-editor-dot hero-editor-dot--y" />
        <span className="hero-editor-dot hero-editor-dot--g" />
        <span className="hero-editor-title">create.ts</span>
      </div>
      <div className="hero-editor-body">
        <div className="hero-editor-lines" data-hero-code>
          {CODE_LINES.map((_, i) => (
            <div key={i} className="hero-editor-line" data-code-line={i}>
              <span className="hero-editor-ln">{i + 1}</span>
              <span
                className="hero-editor-code"
                data-code-text={i}
                dangerouslySetInnerHTML={{ __html: "" }}
              />
            </div>
          ))}
          <span className="hero-editor-caret" data-hero-caret />
        </div>
        <div className="hero-run-btn" data-hero-run>
          <span className="hero-run-label">RUN</span>
          <span className="hero-run-icon" aria-hidden="true">
            ▶
          </span>
          <span className="hero-run-ripple" data-hero-ripple />
        </div>
      </div>
      <div className="hero-pointer" data-hero-pointer aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 3l14 8.5-6.2 1.6L10 21 5 3z"
            fill="#0f172a"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
