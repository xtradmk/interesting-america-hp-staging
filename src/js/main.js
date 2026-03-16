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
    const prevBtn = hero?.querySelector('[data-hero-prev]');
    const nextBtn = hero?.querySelector('[data-hero-next]');
    const dotsWrap = hero?.querySelector('[data-hero-dots]');
    const dots = Array.from(hero?.querySelectorAll('[data-hero-dot]') || []);
    if (!hero || !track || !activeBg || !nextBg || !caption) return;

    const slides = [
      { image: hero.dataset.image1, caption: 'Marriott Marquis, Atlanta, GA' },
      { image: hero.dataset.image2, caption: 'The St. Regis, San Francisco, CA' },
      { image: hero.dataset.image3, caption: 'Los Angeles, CA' },
      { image: hero.dataset.image4, caption: 'Dallas, TX' },
      { image: hero.dataset.image5, caption: 'Santa Monica, CA' }
    ].filter((slide) => slide.image);

    if (!slides.length) return;

    let current = 0;
    let timerId;
    let isAnimating = false;

    const renderDots = () => {
      if (!dots.length) return;
      dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === current);
      });
    };

    const applyCurrentSlide = () => {
      activeBg.style.backgroundImage = `url('${slides[current].image}')`;
      caption.textContent = slides[current].caption;
      renderDots();
    };

    const transitionTo = (nextIndex, direction = 'next') => {
      if (isAnimating || nextIndex === current) return;
      isAnimating = true;

      const fromX = direction === 'next' ? '100%' : '-100%';
      const toX = direction === 'next' ? '-100%' : '100%';

      nextBg.style.transition = 'none';
      activeBg.style.transition = 'none';
      nextBg.style.transform = `translateX(${fromX})`;
      nextBg.style.backgroundImage = `url('${slides[nextIndex].image}')`;
      void nextBg.offsetWidth;

      activeBg.style.transition = 'transform .9s ease';
      nextBg.style.transition = 'transform .9s ease';
      activeBg.style.transform = `translateX(${toX})`;
      nextBg.style.transform = 'translateX(0)';

      caption.classList.add('is-updating');
      window.setTimeout(() => {
        caption.textContent = slides[nextIndex].caption;
        caption.classList.remove('is-updating');
      }, 220);

      window.setTimeout(() => {
        activeBg.style.transition = 'none';
        nextBg.style.transition = 'none';
        activeBg.style.transform = 'translateX(0)';
        activeBg.style.backgroundImage = `url('${slides[nextIndex].image}')`;
        nextBg.style.transform = 'translateX(100%)';
        current = nextIndex;
        renderDots();
        isAnimating = false;
      }, 930);
    };

    const goTo = (index) => {
      const direction = index > current ? 'next' : 'prev';
      transitionTo(index, direction);
      restartAuto();
    };

    const stepNext = () => transitionTo((current + 1) % slides.length, 'next');
    const stepPrev = () => transitionTo((current - 1 + slides.length) % slides.length, 'prev');

    const restartAuto = () => {
      window.clearInterval(timerId);
      timerId = window.setInterval(stepNext, 10000);
    };

    dots.forEach((dot, index) => {
      if (index >= slides.length) {
        dot.style.display = 'none';
        return;
      }
      dot.style.display = 'block';
      dot.addEventListener('click', () => {
        goTo(index);
      });
    });

    prevBtn?.addEventListener('click', () => {
      stepPrev();
      restartAuto();
    });

    nextBtn?.addEventListener('click', () => {
      stepNext();
      restartAuto();
    });

    applyCurrentSlide();
    restartAuto();
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
