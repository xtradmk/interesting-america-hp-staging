(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.fade').forEach((el) => observer.observe(el));

  const header = document.querySelector('.site-header');
  const parallaxItems = Array.from(document.querySelectorAll('.dynamic-media'));

  const syncHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  const syncParallax = () => {
    if (!parallaxItems.length) return;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.speed || 0.18);
      const rect = item.getBoundingClientRect();
      const offset = (window.innerHeight * 0.5 - rect.top) * speed;
      item.style.transform = `translateY(${Math.max(Math.min(offset, 30), -30).toFixed(1)}px)`;
    });
  };

  const onScroll = () => {
    syncHeaderState();
    syncParallax();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', syncParallax, { passive: true });

  const runTypewriter = () => {
    const el = document.querySelector('.typewriter');
    if (!el) return;

    const fullText = el.dataset.text || el.textContent || '';
    el.textContent = '';

    let i = 0;
    const speedMs = 45;

    const tick = () => {
      if (i >= fullText.length) return;
      el.textContent += fullText.charAt(i);
      i += 1;
      window.setTimeout(tick, speedMs);
    };

    tick();
  };

  syncHeaderState();
  syncParallax();
  runTypewriter();
})();
