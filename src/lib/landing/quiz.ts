export type QuizOptions = {
  quizId: string;
  /** Classes for each result list item. */
  tagItemClass: string;
  /** Inner HTML of the check badge (span). */
  checkBadgeHtml: string;
};

/** Multi-step quiz with progress + result tags. */
export function initQuiz(options: QuizOptions): void {
  const quizEl = document.getElementById(options.quizId);
  if (!quizEl) return;

  const qSteps = Array.from(
    quizEl.querySelectorAll<HTMLElement>("[data-quiz-step]"),
  );
  const total = qSteps.length;
  if (total === 0) return;

  const progressEl = quizEl.querySelector<HTMLElement>("[data-quiz-progress]");
  const fillEl = quizEl.querySelector<HTMLElement>("[data-quiz-fill]");
  const resultEl = quizEl.querySelector<HTMLElement>("[data-quiz-result]");
  const tagsEl = quizEl.querySelector<HTMLElement>("[data-quiz-tags]");
  const restartBtn = quizEl.querySelector<HTMLElement>("[data-quiz-restart]");
  const answers: string[] = [];

  const setProgress = (n: number) => {
    if (fillEl) fillEl.style.width = `${(n / total) * 100}%`;
  };

  const showStep = (i: number) => {
    qSteps.forEach((s, idx) => {
      s.hidden = idx !== i;
    });
    if (resultEl) resultEl.hidden = true;
    if (progressEl) progressEl.textContent = `Крок ${i + 1}/${total}`;
    setProgress(i + 1);
  };

  const showResult = () => {
    qSteps.forEach((s) => {
      s.hidden = true;
    });
    if (progressEl) progressEl.textContent = "Готово!";
    setProgress(total);
    if (tagsEl) {
      tagsEl.innerHTML = "";
      answers.forEach((tag) => {
        const li = document.createElement("li");
        li.className = options.tagItemClass;
        li.innerHTML = `${options.checkBadgeHtml}<span class="leading-snug">${tag}</span>`;
        tagsEl.appendChild(li);
      });
    }
    if (resultEl) resultEl.hidden = false;
  };

  qSteps.forEach((step, i) => {
    step.querySelectorAll<HTMLElement>(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[i] = btn.getAttribute("data-tag") || "";
        if (i < total - 1) showStep(i + 1);
        else showResult();
      });
    });
  });

  restartBtn?.addEventListener("click", () => {
    answers.length = 0;
    showStep(0);
  });
}
