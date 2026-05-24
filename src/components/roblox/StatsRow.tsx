import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function Stat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="stat-pill flex flex-col items-center min-w-[130px]">
      <span ref={ref} className="text-3xl font-display font-bold text-white">
        {count.toLocaleString("uk-UA")}
        {suffix}
      </span>
      <span className="text-slate-400 text-xs mt-1 font-medium">{label}</span>
    </div>
  );
}

type StatItem = { value: number; label: string; suffix: string };

export default function StatsRow({ stats }: { stats: StatItem[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12 fade-in-up">
      {stats.map((s) => (
        <Stat key={s.label} value={s.value} label={s.label} suffix={s.suffix} />
      ))}
    </div>
  );
}
