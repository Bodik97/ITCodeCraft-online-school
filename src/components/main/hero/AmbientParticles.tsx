/** Lightweight ambient particles / glyphs — keep count low. */
export function AmbientParticles() {
  const items = [
    { t: "{ }", x: "8%", y: "22%", d: "5.2s", delay: "0s", size: 12 },
    { t: "</>", x: "88%", y: "16%", d: "6.1s", delay: "0.8s", size: 11 },
    { t: "✦", x: "14%", y: "78%", d: "4.4s", delay: "1.2s", size: 10 },
    { t: "◇", x: "92%", y: "62%", d: "5.8s", delay: "0.4s", size: 11 },
    { t: "·", x: "48%", y: "10%", d: "3.6s", delay: "1.6s", size: 16 },
    { t: "{ }", x: "72%", y: "86%", d: "4.9s", delay: "0.2s", size: 10 },
  ];

  return (
    <div className="hero-ambient" aria-hidden="true">
      {items.map((p, i) => (
        <span
          key={i}
          className="hero-ambient-item"
          style={{
            left: p.x,
            top: p.y,
            fontSize: p.size,
            animationDuration: p.d,
            animationDelay: p.delay,
          }}
        >
          {p.t}
        </span>
      ))}
    </div>
  );
}
