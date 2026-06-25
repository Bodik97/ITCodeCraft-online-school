import { useState } from "react";

type Review = {
  name: string;
  role: string;
  course?: string;
  text: string;
  highlight?: string;
  img: string;
};

type Props = {
  items: Review[];
};

export default function ReviewsCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  const active = items[index];

  return (
    <div className="max-w-5xl mx-auto">
      {/* 1. Панель аватарок-перемикачів */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-5 mb-8 md:mb-12 px-2">
        {items.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={t.name}
            className="relative transition-all duration-300 transform active:scale-90 focus:outline-none"
          >
            <div
              className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                i === index
                  ? "border-neon-cyan scale-110 shadow-neon-cyan"
                  : "border-slate-200/70 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={`/assets/reviews/${t.img}.webp`}
                alt={t.name}
                width="64"
                height="64"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`mx-auto mt-1.5 w-1 h-1 rounded-full transition-all duration-300 ${
                i === index ? "bg-neon-cyan scale-125" : "bg-transparent"
              }`}
            />
          </button>
        ))}
      </div>

      {/* 2. Картка відгуку */}
      <div className="relative bg-surface rounded-sm p-5 sm:p-8 md:p-12 border border-slate-200/70 mx-2">
        <div key={index} className="reviews-soft-fade">
          {/* Шапка: ім'я + курс */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8 text-left">
            <div className="flex items-center gap-3">
              <img
                src={`/assets/reviews/${active.img}.webp`}
                alt={active.name}
                width="48"
                height="48"
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-ink leading-tight">
                  {active.name}
                </h4>
                <p className="text-slate-500 text-xs md:text-sm">{active.role}</p>
              </div>
            </div>
            {active.course && (
              <div className="self-start">
                <span className="px-2 py-0.5 md:px-3 md:py-1 bg-surface-light text-gray-500 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-slate-200/70">
                  Курс: {active.course}
                </span>
              </div>
            )}
          </div>

          {/* Текст відгуку */}
          <p className="text-slate-600 text-sm sm:text-base md:text-2xl leading-relaxed italic mb-8 md:mb-10 text-left">
            «{active.text}»
          </p>

          {/* Блок результату */}
          {active.highlight && (
            <div className="bg-neon-lime/5 border border-neon-lime/20 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="flex items-start gap-3 md:gap-4 text-left">
                <span className="text-xl md:text-2xl">🚀</span>
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold text-neon-lime uppercase tracking-widest mb-1">
                    Досягнення дитини:
                  </p>
                  <p className="text-ink font-bold text-xs md:text-base leading-tight">
                    {active.highlight}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Навігація */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-200/70 pt-6 md:pt-8 mt-8">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Попередній відгук"
              className="w-14 h-12 flex items-center justify-center rounded-xl border-2 border-slate-200/70 text-neon-cyan hover:bg-neon-cyan hover:text-paper transition-all active:scale-90"
            >
              <span className="text-xl md:text-2xl">←</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Наступний відгук"
              className="w-14 h-12 flex items-center justify-center rounded-xl border-2 border-slate-200/70 text-neon-cyan hover:bg-neon-cyan hover:text-paper transition-all active:scale-90"
            >
              <span className="text-xl md:text-2xl">→</span>
            </button>
          </div>
          <span className="text-xs md:text-sm font-mono text-slate-500">
            {index + 1} / {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}
