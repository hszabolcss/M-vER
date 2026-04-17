const stepData = [
  {
    icon: "🎟️",
    title: "Gyors jegyvásárlás",
    desc: "Válasszon jegyet indulási és érkezési állomás között mindössze 3 kattintással. Azonnali visszaigazolás e-mailben és SMS-ben.",
  },
  {
    icon: "🛡️",
    title: "Késési biztosítás",
    desc: "Automatikus kártérítés már 5 perc késés esetén is. A rendszer mindent intéz Ön helyett.",
  },
  {
    icon: "📱",
    title: "Könnyed használat",
    desc: "Mobilbarát felület, egyszerű és intuitív kezelőfelület. Regisztráció nélkül is használható.",
  },
  {
    icon: "⚡",
    title: "Gyorsabb betöltés",
    desc: "Optimalizált oldal, amely minden eszközön és hálózaton villámgyorsan betöltődik.",
  },
];

let currentStep = 0;
const cycleTime = 6500;
let timerInterval = null;

function activateStep(index) {
  const steps = document.querySelectorAll(".step");
  if (!steps.length) return; // Ha nem a főoldalon vagyunk

  steps.forEach((step) => step.classList.remove("active"));
  const activeStep = document.querySelector(`.step[data-step="${index + 1}"]`);
  if (activeStep) activeStep.classList.add("active");

  const iconEl = document.getElementById("dynamic-icon");
  const titleEl = document.getElementById("dynamic-title");
  const descEl = document.getElementById("dynamic-desc");

  if (iconEl) iconEl.textContent = stepData[index].icon;
  if (titleEl) titleEl.textContent = stepData[index].title;
  if (descEl) descEl.textContent = stepData[index].desc;

  currentStep = index;

  const progress = document.getElementById("main-progress");
  if (progress) {
    progress.style.transition = "none";
    progress.style.width = "0%";
    setTimeout(() => {
      progress.style.transition = `width ${cycleTime}ms linear`;
      progress.style.width = "100%";
    }, 50);
  }
}

function startAutoCycle() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    let next = (currentStep + 1) % stepData.length;
    activateStep(next);
  }, cycleTime);
}

// Inicializálás betöltéskor
window.onload = () => {
  // Csak ha a főoldalon (index.html) vagyunk, indítjuk az animációt
  if (document.querySelector(".step")) {
    activateStep(0);
    startAutoCycle();

    document.querySelectorAll(".step").forEach((step, index) => {
      step.addEventListener("click", () => {
        clearInterval(timerInterval);
        activateStep(index);
        startAutoCycle();
      });
    });
  }
};