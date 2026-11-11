document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('skyscope-model');
  const status = document.getElementById('skyscope-model-status');
  const buttons = [...document.querySelectorAll('[data-skyscope-model]')];
  const reset = document.getElementById('skyscope-reset');
  if (!viewer || !status || !reset || buttons.length === 0) return;

  const models = {
    building: { src: 'media/skyscope/building-reconstruction.glb', alt: 'Interactive building scene reconstructed from project imagery', label: 'Building reconstruction · drag to rotate' },
    thermal: { src: 'media/skyscope/thermal-mesh.glb', alt: 'Interactive thermal-colored reconstruction sample from SkyScope project data', label: 'Thermal reconstruction sample · drag to rotate' }
  };

  buttons.forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.skyscopeModel;
    if (!models[mode]) return;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    viewer.src = models[mode].src;
    viewer.alt = models[mode].alt;
    status.textContent = models[mode].label;
  }));

  reset.addEventListener('click', () => {
    viewer.cameraTarget = 'auto auto auto';
    viewer.cameraOrbit = '35deg 65deg 150%';
    status.textContent = 'View reset · drag to rotate';
  });

  viewer.addEventListener('error', () => {
    status.textContent = 'The 3D model could not load. Please refresh the page.';
  });
});
