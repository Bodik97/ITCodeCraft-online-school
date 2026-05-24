
import { useState } from "react";

type Testimonial = {
  initials: string;
  name: string;
  sub: string;
  course?: string;
  text: string;
  highlight?: string;
  image?: string;
};

type Props = {
  items: Testimonial[];
};

export default function TestimonialsCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* 1. ПАНЕЛЬ БАТЬКІВ (Адаптивна сітка аватарів) */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-5 mb-8 md:mb-12 px-2">
        {items.map((t, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="relative transition-all duration-300 transform active:scale-90 focus:outline-none"
          >
            {/* Аватарки: w-11 (44px) на мобільних, w-16 (64px) на десктопі */}
            <div className={`
              w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl border-2 transition-all duration-300 overflow-hidden
              ${i === index 
                ? "border-[#6366F1] scale-110 shadow-lg shadow-indigo-100" 
                : "border-[#C7D2FE] opacity-70 hover:opacity-100"}
            `}>
              <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
            </div>
            
            <div className={`
              mx-auto mt-1.5 w-1 h-1 rounded-full transition-all duration-300
              ${i === index ? "bg-[#6366F1] scale-125" : "bg-transparent"}
            `}></div>
          </button>
        ))}
      </div>

      {/* 2. КАРТКА ВІДГУКУ */}
      <div className="relative bg-white rounded-2rem md:rounded-[3rem] p-5 sm:p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-100/40 mx-2">
        
        <div key={index} className="animate-soft-fade">
          {/* Шапка: Ім'я та Курс */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8 text-left">
            <div>
              <h4 className="text-lg sm:text-xl md:text-3xl font-display font-bold text-[#0F172A] leading-tight">
                {items[index].name}
              </h4>
              <p className="text-[#6366F1] font-semibold text-xs md:text-base">
                {items[index].sub}
              </p>
            </div>
            {items[index].course && (
               <div className="self-start">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-slate-50 text-slate-500 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                     Курс: {items[index].course}
                  </span>
               </div>
            )}
          </div>

          {/* Текст відгуку */}
          <p className="text-slate-600 text-sm sm:text-base md:text-2xl leading-relaxed italic mb-8 md:mb-10 text-left">
            «{items[index].text}»
          </p>

          {/* Блок результату */}
          <div className="bg-[#00B06F]/5 border border-[#00B06F]/10 rounded-xl md:rounded-2xl p-4 md:p-6 mb-8">
            <div className="flex items-start gap-3 md:gap-4 text-left">
              <span className="text-xl md:text-2xl">🚀</span>
              <div>
                <p className="text-[9px] md:text-[10px] font-bold text-[#00B06F] uppercase tracking-widest mb-1">Досягнення дитини:</p>
                <p className="text-slate-700 font-bold text-xs md:text-base leading-tight">
                  {items[index].highlight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. НАВІГАЦІЯ (Стрілки та CTA) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-slate-50 pt-6 md:pt-8">
          {/* Стрілки */}
          <div className="flex gap-4 w-full justify-center lg:justify-start lg:w-auto">
            <button 
              onClick={prev}
              className="flex-1 lg:flex-none w-14 h-12 flex items-center justify-center rounded-xl border-2 border-[#C7D2FE] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-all active:scale-90"
              aria-label="Попередній"
            >
              <span className="text-xl md:text-2xl">←</span>
            </button>
            <button 
              onClick={next}
              className="flex-1 lg:flex-none w-14 h-12 flex items-center justify-center rounded-xl border-2 border-[#C7D2FE] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-all active:scale-90"
              aria-label="Наступний"
            >
              <span className="text-xl md:text-2xl">→</span>
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
}