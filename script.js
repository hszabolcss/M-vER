let currentStep = 1;
const totalSteps = 4;
const stepsContainer = document.getElementById('steps');

function activateStep(step) {
  document.querySelectorAll('.step').forEach(s => {
    s.classList.remove('active');
    if (parseInt(s.dataset.step) === step) {
      s.classList.add('active');
    }
  });
  currentStep = step;
}

setInterval(() => {
  currentStep = currentStep >= totalSteps ? 1 : currentStep + 1;
  activateStep(currentStep);
}, 10000);

document.querySelectorAll('.step').forEach(step => {
  step.addEventListener('click', () => {
    const stepNum = parseInt(step.dataset.step);
    activateStep(stepNum);
  });
});