import { useEffect, useRef } from "react";
import gsap from "gsap";
import { IdeaCard } from "./IdeaCard";
import { CodeEditor } from "./CodeEditor";
import { DigitalPlayground } from "./DigitalPlayground";
import { AmbientParticles } from "./AmbientParticles";
import {
  CODE_PLAIN,
  HERO_TIMELINE as T,
  SOFT,
  SPRING,
} from "./timeline";
import "./hero-scene.css";

const HTML_LINES = [
  '<span class="tok-kw">const</span> idea = <span class="tok-str">"GAME"</span>;',
  '<span class="tok-fn">create</span>(idea);',
] as const;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isCoarsePointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches
  );
}

function typeLine(
  el: HTMLElement,
  plain: string,
  html: string,
  duration: number,
  tl: gsap.core.Timeline,
  at: number,
) {
  const state = { n: 0 };
  tl.to(
    state,
    {
      n: plain.length,
      duration,
      ease: "none",
      onUpdate: () => {
        const n = Math.floor(state.n);
        if (n >= plain.length) {
          el.innerHTML = html;
        } else {
          el.textContent = plain.slice(0, n);
        }
      },
    },
    at,
  );
}

export default function HeroScene() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const idea = root.querySelector<HTMLElement>("[data-hero-idea]");
    const editor = root.querySelector<HTMLElement>("[data-hero-editor]");
    const playground = root.querySelector<HTMLElement>("[data-hero-playground]");
    const createEl = root.querySelector<HTMLElement>("[data-hero-create]");
    const caret = root.querySelector<HTMLElement>("[data-hero-caret]");
    const runBtn = root.querySelector<HTMLElement>("[data-hero-run]");
    const ripple = root.querySelector<HTMLElement>("[data-hero-ripple]");
    const pointer = root.querySelector<HTMLElement>("[data-hero-pointer]");
    const trail = root.querySelector<HTMLElement>("[data-idea-trail]");
    const burstLayer = root.querySelector<HTMLElement>("[data-burst]");
    const codeEls = [
      ...root.querySelectorAll<HTMLElement>("[data-code-text]"),
    ];
    const pgObjs = [...root.querySelectorAll<HTMLElement>("[data-pg-obj]")];

    if (!idea || !editor || !playground || !createEl || !pointer) return;

    if (prefersReducedMotion()) {
      gsap.set(idea, { opacity: 0 });
      gsap.set(editor, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "none",
        xPercent: -50,
        yPercent: -46,
      });
      codeEls.forEach((el, i) => {
        el.innerHTML = HTML_LINES[i];
      });
      gsap.set(runBtn, { opacity: 1 });
      gsap.set(playground, { opacity: 1 });
      gsap.set(createEl, { opacity: 1, y: 0, filter: "none" });
      gsap.set(pgObjs, { opacity: 1, scale: 1, xPercent: -50, yPercent: -50 });
      gsap.set([pointer, caret], { opacity: 0 });
      return;
    }

    const isMobile = window.innerWidth < 768;
    const ideaXPercent = isMobile ? -50 : 0;

    const resetNonIdea = () => {
      gsap.set(editor, {
        opacity: 0,
        scale: 0.92,
        x: 0,
        y: 24,
        filter: "blur(6px)",
        xPercent: -50,
        yPercent: -46,
      });
      gsap.set(playground, { opacity: 0 });
      gsap.set(createEl, { opacity: 0, y: 18, filter: "blur(8px)" });
      gsap.set(pgObjs, {
        opacity: 0,
        scale: 0.4,
        xPercent: -50,
        yPercent: -50,
      });
      gsap.set(runBtn, { opacity: 0, scale: 0.9 });
      gsap.set(pointer, { opacity: 0, x: 36, y: 48, scale: 1 });
      gsap.set(caret, { opacity: 0 });
      gsap.set(ripple, { scale: 0, opacity: 0 });
      codeEls.forEach((el) => {
        el.textContent = "";
      });
      if (burstLayer) burstLayer.innerHTML = "";
    };

    // First paint: everything hidden
    gsap.set(idea, {
      opacity: 0,
      scale: 0.88,
      x: 0,
      y: 14,
      filter: "blur(6px)",
      xPercent: ideaXPercent,
    });
    gsap.set(trail, { scaleX: 0, opacity: 0 });
    resetNonIdea();
    root.classList.add("is-ready");

    const tl = gsap.timeline({
      repeat: -1,
      paused: true,
      defaults: { ease: SPRING },
      onRepeat: () => {
        // Keep IDEA visible between loops — only reset CODE/playground
        resetNonIdea();
        gsap.set(idea, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          xPercent: ideaXPercent,
        });
        // Trail must start hidden so it only animates once per loop
        gsap.set(trail, { scaleX: 0, opacity: 0 });
      },
    });

    // Loop always begins with IDEA already on screen
    tl.set(
      idea,
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        xPercent: ideaXPercent,
      },
      T.idea.start,
    );
    tl.fromTo(
      trail,
      { scaleX: 0.2, opacity: 0.15 },
      { scaleX: 1, opacity: 0.55, duration: 0.45, ease: SOFT, immediateRender: false },
      T.idea.start + 0.05,
    );
    tl.to({}, { duration: 0.45 }, T.idea.start + 0.35);

    // Scene 02 — CODE
    tl.to(
      idea,
      {
        opacity: 0.4,
        scale: 0.9,
        x: -10,
        y: -24,
        duration: 0.45,
        ease: SOFT,
      },
      T.code.start,
    );
    tl.to(trail, { opacity: 0, duration: 0.25 }, T.code.start);
    tl.to(
      editor,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
      },
      T.code.start + 0.05,
    );
    tl.set(caret, { opacity: 1 }, T.code.start + 0.4);
    typeLine(
      codeEls[0],
      CODE_PLAIN[0],
      HTML_LINES[0],
      0.55,
      tl,
      T.code.start + 0.4,
    );
    typeLine(
      codeEls[1],
      CODE_PLAIN[1],
      HTML_LINES[1],
      0.35,
      tl,
      T.code.start + 1.0,
    );
    tl.to(
      runBtn,
      { opacity: 1, scale: 1, duration: 0.28 },
      T.code.start + 1.35,
    );

    // Scene 03 — RUN
    tl.to(pointer, { opacity: 1, duration: 0.12 }, T.run.start);
    tl.to(
      pointer,
      { x: 0, y: 0, duration: 0.28, ease: "power2.inOut" },
      T.run.start + 0.05,
    );
    tl.to(pointer, { scale: 0.88, duration: 0.06 }, T.run.start + 0.34);
    tl.to(editor, { scale: 1.02, duration: 0.08 }, T.run.start + 0.34);
    tl.fromTo(
      ripple,
      { scale: 0.2, opacity: 0.55 },
      { scale: 2.4, opacity: 0, duration: 0.4, ease: "power2.out" },
      T.run.start + 0.34,
    );
    tl.call(
      () => {
        if (!burstLayer || !runBtn) return;
        burstLayer.innerHTML = "";
        const rect = runBtn.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();
        const ox = rect.left + rect.width / 2 - rootRect.left;
        const oy = rect.top + rect.height / 2 - rootRect.top;
        for (let i = 0; i < 10; i++) {
          const p = document.createElement("span");
          p.className = "hero-burst-dot";
          p.style.left = `${ox}px`;
          p.style.top = `${oy}px`;
          burstLayer.appendChild(p);
          const angle = (Math.PI * 2 * i) / 10;
          const dist = 28 + Math.random() * 34;
          gsap.to(p, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            opacity: 0,
            scale: 0.2,
            duration: 0.45 + Math.random() * 0.12,
            ease: "power2.out",
          });
        }
      },
      undefined,
      T.run.start + 0.34,
    );
    tl.to(pointer, { scale: 1, duration: 0.1 }, T.run.start + 0.4);
    tl.to(editor, { scale: 1, duration: 0.15 }, T.run.start + 0.42);
    tl.to(pointer, { opacity: 0, duration: 0.18 }, T.run.start + 0.45);

    // Scene 04 — PLAYGROUND
    tl.to(
      editor,
      {
        opacity: 0,
        scale: 0.72,
        filter: "blur(10px)",
        duration: 0.55,
        ease: "power2.in",
      },
      T.playground.start,
    );
    tl.to(idea, { opacity: 0, scale: 0.7, duration: 0.35 }, T.playground.start);
    tl.to(playground, { opacity: 1, duration: 0.35 }, T.playground.start + 0.25);
    tl.to(
      pgObjs,
      {
        opacity: 1,
        scale: 1,
        duration: 0.65,
        stagger: { each: 0.06, from: "center" },
        ease: "back.out(1.4)",
      },
      T.playground.start + 0.3,
    );
    tl.to(
      createEl,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
      },
      T.playground.start + 0.55,
    );
    tl.to({}, { duration: Math.max(T.playground.duration - 0.9, 0.4) }, T.playground.start + 0.9);

    // Scene 05 — collapse playground → IDEA (editor stays hidden)
    tl.to(
      createEl,
      { opacity: 0, y: -10, filter: "blur(6px)", duration: 0.35, ease: SOFT },
      T.collapse.start,
    );
    tl.to(
      pgObjs,
      {
        opacity: 0,
        scale: 0.25,
        duration: 0.55,
        stagger: 0.04,
        ease: "power2.in",
      },
      T.collapse.start + 0.1,
    );
    tl.to(playground, { opacity: 0, duration: 0.35 }, T.collapse.start + 0.5);

    tl.set(
      editor,
      {
        opacity: 0,
        scale: 0.92,
        y: 24,
        filter: "blur(6px)",
        xPercent: -50,
        yPercent: -46,
      },
      T.collapse.start + 0.55,
    );
    tl.set([runBtn, caret, pointer], { opacity: 0 }, T.collapse.start + 0.55);
    tl.set(runBtn, { scale: 0.9 }, T.collapse.start + 0.55);
    tl.set(pointer, { x: 36, y: 48, scale: 1 }, T.collapse.start + 0.55);
    tl.call(
      () => {
        codeEls.forEach((el) => {
          el.textContent = "";
        });
        if (burstLayer) burstLayer.innerHTML = "";
      },
      undefined,
      T.collapse.start + 0.55,
    );

    // Return to IDEA — same pose as loop start (trail stays hidden until Scene 01)
    tl.to(
      idea,
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
      },
      T.collapse.start + 0.65,
    );
    tl.set(trail, { scaleX: 0, opacity: 0 }, T.collapse.start + 0.65);
    tl.to({}, { duration: 0.5 }, T.collapse.start + 1.3);

    // One-time boot: fade IDEA in, then start the looping timeline (already on IDEA)
    const boot = gsap.to(idea, {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.7,
      ease: SPRING,
      onComplete: () => {
        tl.play(0);
      },
    });

    // Micro-float layer (desynced) — keeps CSS centering on outer; physics uses inner
    const floatTweens = pgObjs.map((el) => {
      const dur = parseFloat(el.dataset.float || "4");
      const floatEl = el.querySelector<HTMLElement>("[data-pg-float]");
      if (!floatEl) return null;
      const isStar = el.dataset.pgObj === "star";
      return gsap.to(floatEl, {
        y: isStar ? 0 : "+=9",
        scale: isStar ? 1.08 : 1,
        rotation: el.dataset.pgObj === "block" ? 6 : el.dataset.pgObj === "rocket" ? -4 : 2,
        duration: dur,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: Math.random() * 1.4,
      });
    });

    // Cursor physics
    const enablePhysics = !isCoarsePointer() && window.innerWidth >= 768;
    let raf = 0;
    let mx = 0;
    let my = 0;
    let active = false;

    type SpringObj = {
      el: HTMLElement;
      inner: HTMLElement;
      ox: number;
      oy: number;
      tx: number;
      ty: number;
      vx: number;
      vy: number;
      rot: number;
      vrot: number;
    };

    const springs: SpringObj[] = [];

    const measure = () => {
      springs.length = 0;
      pgObjs.forEach((el) => {
        if (getComputedStyle(el).display === "none") return;
        const inner = el.querySelector<HTMLElement>("[data-pg-inner]");
        if (!inner) return;
        const r = el.getBoundingClientRect();
        springs.push({
          el,
          inner,
          ox: r.left + r.width / 2,
          oy: r.top + r.height / 2,
          tx: 0,
          ty: 0,
          vx: 0,
          vy: 0,
          rot: 0,
          vrot: 0,
        });
      });
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      active = Number(gsap.getProperty(playground, "opacity")) > 0.35;
    };

    const tick = () => {
      if (enablePhysics && active) {
        for (const s of springs) {
          const dx = s.ox - mx;
          const dy = s.oy - my;
          const dist = Math.hypot(dx, dy) || 1;
          const radius = 130;
          let forceX = 0;
          let forceY = 0;
          if (dist < radius) {
            const f = (1 - dist / radius) * 16;
            forceX = (dx / dist) * f;
            forceY = (dy / dist) * f;
          }
          s.vx = (s.vx + (forceX - s.tx) * 0.12) * 0.78;
          s.vy = (s.vy + (forceY - s.ty) * 0.12) * 0.78;
          s.tx += s.vx;
          s.ty += s.vy;
          const targetRot = forceX * 0.4;
          s.vrot = (s.vrot + (targetRot - s.rot) * 0.1) * 0.8;
          s.rot += s.vrot;
          const depth = 1 + Math.min(Math.hypot(s.tx, s.ty) / 90, 0.08);
          s.inner.style.transform = `translate3d(${s.tx.toFixed(2)}px,${s.ty.toFixed(2)}px,0) rotate(${s.rot.toFixed(2)}deg) scale(${depth.toFixed(3)})`;
        }
      } else if (enablePhysics) {
        for (const s of springs) {
          s.vx *= 0.85;
          s.vy *= 0.85;
          s.tx *= 0.9;
          s.ty *= 0.9;
          s.rot *= 0.9;
          if (Math.abs(s.tx) < 0.05 && Math.abs(s.ty) < 0.05) {
            s.inner.style.transform = "";
          } else {
            s.inner.style.transform = `translate3d(${s.tx.toFixed(2)}px,${s.ty.toFixed(2)}px,0) rotate(${s.rot.toFixed(2)}deg)`;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    if (enablePhysics) {
      measure();
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("resize", measure, { passive: true });
      raf = requestAnimationFrame(tick);
    }

    return () => {
      boot.kill();
      tl.kill();
      floatTweens.forEach((t) => t?.kill());
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
      root.classList.remove("is-ready");
    };
  }, []);

  return (
    <div className="hero-scene" ref={rootRef} aria-hidden="true">
      <AmbientParticles />
      <div className="hero-scene-stage">
        <IdeaCard />
        <CodeEditor />
        <DigitalPlayground />
      </div>
      <div className="hero-burst-layer" data-burst />
    </div>
  );
}
