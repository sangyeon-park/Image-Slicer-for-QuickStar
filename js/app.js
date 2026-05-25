window.AppState = {
  rows: 0,
  cols: 0,
  buttons: [],
  sourceImage: null,
  cropRect: null,
  imgReal: null,
  slices: [],
};

(function () {
  const STEPS = [1, 2, 3, 4];
  let currentStep = 1;
  let suppressHistory = false;

  function pushHistory(state) {
    if (suppressHistory) return;
    history.pushState(state, '');
  }

  function showIntro() {
    document.getElementById('intro').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
  }

  function showApp() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  }

  function goToStep(n) {
    currentStep = n;
    STEPS.forEach(i => {
      const sec = document.getElementById('step' + i);
      const ind = document.getElementById('indicator-' + i);
      if (sec) sec.classList.toggle('active', i === n);
      if (ind) {
        ind.classList.toggle('active', i === n);
        ind.classList.toggle('done', i < n);
      }
    });

    if (n === 3) window.Step3 && window.Step3.init();
    if (n === 4) window.Step4 && window.Step4.init();

    pushHistory({ view: 'app', step: n });
  }

  function restart() {
    // Reset all state
    AppState.buttons = [];
    AppState.sourceImage = null;
    AppState.cropRect = null;
    AppState.imgReal = null;
    AppState.slices = [];

    // Reset upload UI
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) previewContainer.style.display = 'none';
    const btnToStep3 = document.getElementById('btnToStep3');
    if (btnToStep3) btnToStep3.disabled = true;

    // Go back to intro
    showIntro();

    // Clear grid occupancy map
    window.Step1 && window.Step1.reset();

    currentStep = 1;
    STEPS.forEach(i => {
      const sec = document.getElementById('step' + i);
      const ind = document.getElementById('indicator-' + i);
      if (sec) sec.classList.toggle('active', i === 1);
      if (ind) {
        ind.classList.remove('active', 'done');
        if (i === 1) ind.classList.add('active');
      }
    });

    pushHistory({ view: 'intro' });
  }

  // Intro → App
  document.getElementById('btnGetStarted').addEventListener('click', () => {
    showApp();
    goToStep(1);
  });

  // Normalize initial history entry, then react to back/forward.
  history.replaceState({ view: 'intro' }, '');
  window.addEventListener('popstate', e => {
    const s = e.state || { view: 'intro' };
    suppressHistory = true;
    try {
      if (s.view === 'app') {
        showApp();
        goToStep(s.step || 1);
      } else {
        showIntro();
        currentStep = 1;
        STEPS.forEach(i => {
          const sec = document.getElementById('step' + i);
          const ind = document.getElementById('indicator-' + i);
          if (sec) sec.classList.toggle('active', i === 1);
          if (ind) {
            ind.classList.remove('active', 'done');
            if (i === 1) ind.classList.add('active');
          }
        });
      }
    } finally {
      suppressHistory = false;
    }
  });

  // Step indicator: click "done" steps to navigate back
  STEPS.forEach(n => {
    const ind = document.getElementById('indicator-' + n);
    if (!ind) return;
    ind.addEventListener('click', () => {
      if (ind.classList.contains('done') || ind.classList.contains('active')) {
        goToStep(n);
      }
    });
  });

  // Step 1 → 2
  document.getElementById('btnToStep2').addEventListener('click', () => goToStep(2));

  // Step 2 ↔ 1 / → 3
  document.getElementById('btnToStep1From2').addEventListener('click', () => goToStep(1));
  document.getElementById('btnToStep3').addEventListener('click', () => goToStep(3));

  // Step 3 ↔ 2 / → 4
  document.getElementById('btnToStep2From3').addEventListener('click', () => goToStep(2));
  document.getElementById('btnCropAndContinue').addEventListener('click', () => {
    window.Step3 && window.Step3.commit();
    goToStep(4);
  });

  // Step 4 ↔ 3 / Restart
  document.getElementById('btnToStep3From4').addEventListener('click', () => goToStep(3));
  document.querySelectorAll('.js-restart').forEach(el => el.addEventListener('click', restart));

  window.goToStep = goToStep;
})();
