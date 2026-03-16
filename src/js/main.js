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

  const initHeroSlider = () => {
    const hero = document.querySelector('.hero--photo');
    const track = hero?.querySelector('.hero-bg-track');
    const activeBg = hero?.querySelector('.hero-bg--active');
    const nextBg = hero?.querySelector('.hero-bg--next');
    const caption = hero?.querySelector('#hero-photo-caption');
    if (!hero || !track || !activeBg || !nextBg || !caption) return;

    const slides = [
      {
        image: hero.dataset.imageOne,
        caption: 'The Beverly Hills Hotel, Beverly Hills, CA'
      },
      {
        image: hero.dataset.imageTwo,
        caption: 'Atlanta Marriott Marquis, Atlanta, GA'
      }
    ];

    let current = 0;
    activeBg.style.backgroundImage = `url('${slides[current].image}')`;
    caption.textContent = slides[current].caption;

    window.setInterval(() => {
      const next = (current + 1) % slides.length;
      nextBg.style.transform = 'translateX(100%)';
      nextBg.style.backgroundImage = `url('${slides[next].image}')`;
      // force layout flush before transition
      void nextBg.offsetWidth;

      track.classList.add('is-sliding');
      caption.classList.add('is-updating');

      window.setTimeout(() => {
        caption.textContent = slides[next].caption;
        caption.classList.remove('is-updating');
      }, 220);

      window.setTimeout(() => {
        track.classList.remove('is-sliding');
        activeBg.style.transform = 'translateX(0)';
        activeBg.style.backgroundImage = `url('${slides[next].image}')`;
        nextBg.style.transform = 'translateX(100%)';
        current = next;
      }, 950);
    }, 15000);
  };

  const runTypewriter = () => {
    const el = document.querySelector('.typewriter');
    const cta = document.querySelector('.hero-link-cta');
    if (!el) return;

    const fullText = el.dataset.text || el.textContent || '';
    el.textContent = '';

    let i = 0;
    const speedMs = 90;

    const tick = () => {
      if (i >= fullText.length) {
        if (cta) window.setTimeout(() => cta.classList.add('is-visible'), 1000);
        return;
      }
      el.textContent += fullText.charAt(i);
      i += 1;
      window.setTimeout(tick, speedMs);
    };

    tick();
  };

  syncHeaderState();
  syncParallax();
  initHeroSlider();
  runTypewriter();
})();
