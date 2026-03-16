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
    const activeBg = hero?.querySelector('.hero-bg--active');
    const nextBg = hero?.querySelector('.hero-bg--next');
    const caption = hero?.querySelector('#hero-photo-caption');
    const prevBtn = hero?.querySelector('[data-hero-prev]');
    const nextBtn = hero?.querySelector('[data-hero-next]');
    if (!hero || !activeBg || !nextBg || !caption) return;

    const slides = [
      { image: hero.dataset.image1, caption: hero.dataset.caption1 || 'Marriott Marquis, Atlanta, GA' },
      { image: hero.dataset.image2, caption: hero.dataset.caption2 || 'The St. Regis, San Francisco, CA' },
      { image: hero.dataset.image3, caption: hero.dataset.caption3 || 'Los Angeles, CA' },
      { image: hero.dataset.image4, caption: hero.dataset.caption4 || 'Dallas, TX' },
      { image: hero.dataset.image5, caption: hero.dataset.caption5 || 'Santa Monica, CA' }
    ].filter((slide) => slide.image);

    if (!slides.length) return;

    let current = 0;
    let timerId;
    let isAnimating = false;

    const preload = () => {
      slides.forEach((slide) => {
        const img = new Image();
        img.src = slide.image;
      });
    };

    const applyCurrentSlide = () => {
      activeBg.style.backgroundImage = `url(${slides[current].image})`;
      nextBg.style.backgroundImage = `url(${slides[(current + 1) % slides.length].image})`;
      caption.textContent = slides[current].caption;
    };

    const transitionTo = (nextIndex, direction = 'next') => {
      if (isAnimating || nextIndex === current) return;
      isAnimating = true;

      const fromX = direction === 'next' ? '100%' : '-100%';
      const toX = direction === 'next' ? '-100%' : '100%';

      nextBg.style.transition = 'none';
      activeBg.style.transition = 'none';
      nextBg.style.transform = `translateX(${fromX})`;
      nextBg.style.backgroundImage = `url(${slides[nextIndex].image})`;
      void nextBg.offsetWidth;

      requestAnimationFrame(() => {
        activeBg.style.transition = 'transform .9s ease';
        nextBg.style.transition = 'transform .9s ease';
        activeBg.style.transform = `translateX(${toX})`;
        nextBg.style.transform = 'translateX(0)';
      });

      caption.classList.add('is-updating');
      window.setTimeout(() => {
        caption.textContent = slides[nextIndex].caption;
        caption.classList.remove('is-updating');
      }, 220);

      window.setTimeout(() => {
        activeBg.style.transition = 'none';
        nextBg.style.transition = 'none';
        activeBg.style.transform = 'translateX(0)';
        activeBg.style.backgroundImage = `url(${slides[nextIndex].image})`;
        nextBg.style.transform = 'translateX(100%)';
        current = nextIndex;
        isAnimating = false;
      }, 930);
    };

    const stepNext = () => transitionTo((current + 1) % slides.length, 'next');
    const stepPrev = () => transitionTo((current - 1 + slides.length) % slides.length, 'prev');

    const restartAuto = () => {
      window.clearInterval(timerId);
      timerId = window.setInterval(stepNext, 10000);
    };

    prevBtn?.addEventListener('click', () => {
      stepPrev();
      restartAuto();
    });

    nextBtn?.addEventListener('click', () => {
      stepNext();
      restartAuto();
    });

    preload();
    applyCurrentSlide();
    document.body.classList.add('js-slider-ready');
    restartAuto();
  };

  const runTypewriter = () => {
    const el = document.querySelector('.typewriter');
    const cta = document.querySelector('.hero-link-cta');
    if (!el) return;

    const speedMs = 48;
    const holdMs = 10000;

    const text1 = 'We secure rooms\nfor your groups\nat major global\nsports events.';
    const text2 = 'We also transfer your\nstaff and guests. On\narrival, on departure,\nand on match day.';
    const text3 = 'And on your behalf, we\nget access to hospitality:\ntickets and tables at the\nfinest venues in town.';

    const sequence = [text1, text2, text3];
    let seqIndex = 0;

    const typeText = (text, done) => {
      el.textContent = '';
      let i = 0;

      const tick = () => {
        if (i >= text.length) {
          done();
          return;
        }
        el.textContent += text.charAt(i);
        i += 1;
        window.setTimeout(tick, speedMs);
      };

      tick();
    };

    const runLoop = () => {
      const currentText = sequence[seqIndex % sequence.length];

      typeText(currentText, () => {
        if (seqIndex === 0) {
          if (cta) {
            window.setTimeout(() => {
              cta.classList.add('is-visible');
              window.setTimeout(() => {
                seqIndex = 1;
                runLoop();
              }, 5000);
            }, 1000);
          } else {
            window.setTimeout(() => {
              seqIndex = 1;
              runLoop();
            }, 5000);
          }
          return;
        }

        window.setTimeout(() => {
          seqIndex = (seqIndex + 1) % sequence.length;
          runLoop();
        }, holdMs);
      });
    };

    runLoop();
  };

  const initMobileMenu = () => {
    const trigger = document.querySelector('.mobile-menu-trigger');
    const panel = document.querySelector('#mobile-menu-panel');
    const label = trigger.querySelector('.mobile-menu-trigger__label');
    const links = Array.from(document.querySelectorAll('.mobile-menu-link'));
    const hasHero = !!document.querySelector('.hero--photo');

    if (!hasHero || !trigger || !panel || !label) return;

    const close = () => {
      document.body.classList.remove('mobile-menu-open');
      trigger.setAttribute('aria-expanded', 'false');
      label.textContent = 'Menü';
      panel.hidden = true;
    };

    const open = () => {
      document.body.classList.add('mobile-menu-open');
      trigger.setAttribute('aria-expanded', 'true');
      label.textContent = 'Close';
      panel.hidden = false;
    };

    trigger.addEventListener('click', () => {
      if (document.body.classList.contains('mobile-menu-open')) {
        close();
      } else {
        open();
      }
    });

    links.forEach((link) => link.addEventListener('click', close));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) close();
    }, { passive: true });

    close();
  };

  syncHeaderState();
  syncParallax();
  initHeroSlider();
  runTypewriter();
  initMobileMenu();
})();
