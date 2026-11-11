document.addEventListener('DOMContentLoaded', () => {
  const viewer = document.getElementById('skyscope-model');
  const status = document.getElementById('skyscope-model-status');
  const reset = document.getElementById('skyscope-reset');
  if (!viewer || !status || !reset) return;

  reset.addEventListener('click', () => {
    viewer.contentWindow?.postMessage({ type: 'skyscope-reset' }, window.location.origin);
  });

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin || event.source !== viewer.contentWindow || !event.data) return;
    if (event.data.type === 'skyscope-loaded') status.textContent = 'Thermal-color building reconstruction · drag to rotate';
    if (event.data.type === 'skyscope-error') status.textContent = 'The 3D scene could not load. Please refresh the page.';
  });
});
