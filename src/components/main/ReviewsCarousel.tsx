import { useState, useRef, useEffect } from "react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const next = () => setIndex((i) => Math.min(i + 1, items.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || touchStart === null) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - touchStart;
    
    // add some resistance when dragging past the ends
    if ((index === 0 && offset > 0) || (index === items.length - 1 && offset < 0)) {
      setDragOffset(offset * 0.3);
    } else {
      setDragOffset(offset);
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    
    if (dragOffset > 50) {
      prev();
    } else if (dragOffset < -50) {
      next();
    }
    
    setDragOffset(0);
    setTouchStart(null);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) onTouchEnd();
    };
    
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [isDragging, dragOffset]);

  return (
    <div className="max-w-5xl mx-auto overflow-hidden">
      {/* 1. Панель аватарок-перемикачів */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-5 mb-8 md:mb-12 px-2 relative z-10">
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
                className="w-full h-full object-cover pointer-events-none"
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

      {/* 2. Картки відгуків (Слайдер) */}
      <div 
        className="overflow-hidden mx-2 cursor-grab active:cursor-grabbing touch-pan-y"
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          ref={containerRef}
          className="flex transition-transform ease-out"
          style={{ 
            transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`,
            transitionDuration: isDragging ? '0ms' : '400ms'
          }}
        >
          {items.map((active, i) => (
            <div key={i} className="w-full shrink-0 px-2 sm:px-4">
              <div className="relative bg-surface rounded-sm p-5 sm:p-8 md:p-12 border border-slate-200/70 h-[530px] sm:h-[460px] md:h-[680px] flex flex-col pointer-events-none lg:h-[550px]">
                
                {/* Шапка: ім'я + курс */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <img
                      src={`/assets/reviews/${active.img}.webp`}
                      alt={active.name}
                      width="48"
                      height="48"
                      className="w-12 h-12 rounded-full object-cover shrink-0 pointer-events-none"
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
                <div className="flex-1 overflow-y-auto pr-2 mb-6 md:mb-10 min-h-0 pointer-events-auto">
                  <p className="text-slate-600 text-sm sm:text-base md:text-2xl leading-relaxed italic text-left">
                    «{active.text}»
                  </p>
                </div>

                {/* Блок результату */}
                {active.highlight && (
                  <div className="bg-neon-lime/5 border border-neon-lime/20 rounded-xl md:rounded-2xl p-4 md:p-6 shrink-0 mt-auto">
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
            </div>
          ))}
        </div>
      </div>

      {/* 3. Навігація */}
      <div className="flex items-center justify-between gap-4 border-t border-slate-200/70 pt-6 md:pt-8 mt-8 mx-2 px-2 sm:px-4">
        <div className="flex gap-3 relative z-10">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Попередній відгук"
            className="w-14 h-12 flex items-center justify-center rounded-xl border-2 border-slate-200/70 text-neon-cyan hover:bg-neon-cyan hover:text-paper transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neon-cyan disabled:active:scale-100 disabled:cursor-not-allowed"
          >
            <span className="text-xl md:text-2xl">←</span>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index === items.length - 1}
            aria-label="Наступний відгук"
            className="w-14 h-12 flex items-center justify-center rounded-xl border-2 border-slate-200/70 text-neon-cyan hover:bg-neon-cyan hover:text-paper transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neon-cyan disabled:active:scale-100 disabled:cursor-not-allowed"
          >
            <span className="text-xl md:text-2xl">→</span>
          </button>
        </div>
        <span className="text-xs md:text-sm font-mono text-slate-500">
          {index + 1} / {items.length}
        </span>
      </div>
    </div>
  );
}
