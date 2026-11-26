(() => {
  const icon = document.querySelector('[data-dark-favicon]');
  if (!icon || !window.matchMedia) return;

  const light = icon.href;
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const updateIcon = () => {
    icon.href = dark.matches ? icon.dataset.darkFavicon : light;
  };

  updateIcon();
  dark.addEventListener('change', updateIcon);
})();
