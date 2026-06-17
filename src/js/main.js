(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.fade').forEach((el) => observer.observe(el));

  const header = document.querySelector('.site-header');
  const parallaxItems = Array.from(document.querySelectorAll('.dynamic-media'));
  const letterRevealBlocks = Array.from(document.querySelectorAll('[data-letter-reveal]')).map((el) => {
    const fragment = document.createDocumentFragment();
    const appendWord = (word) => {
      if (!word) return;
      const wordSpan = document.createElement('span');
      wordSpan.className = 'letter-reveal-word';

      Array.from(word).forEach((char) => {
        const span = document.createElement('span');
        span.className = 'letter-reveal-char';
        span.textContent = char;
        wordSpan.appendChild(span);
      });

      fragment.appendChild(wordSpan);
    };

    Array.from(el.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const normalizedText = node.textContent.replace(/\s+/g, ' ').trim();
        if (!normalizedText) return;

        normalizedText.split(' ').forEach((word, index) => {
          if (index > 0) fragment.appendChild(document.createTextNode(' '));
          appendWord(word);
        });
        return;
      }

      if (node.nodeName === 'BR') {
        fragment.appendChild(document.createElement('br'));
      }
    });

    el.replaceChildren(fragment);

    return {
      el,
      chars: Array.from(el.querySelectorAll('.letter-reveal-char'))
    };
  });

  const syncHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  const syncParallax = () => {
    if (!parallaxItems.length) return;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.speed || 0.18);
      const maxOffset = Number(item.dataset.maxOffset || 54);
      const rect = item.getBoundingClientRect();
      const offset = (window.innerHeight * 0.5 - rect.top) * speed;
      item.style.transform = `translate3d(0, ${Math.max(Math.min(offset, maxOffset), -maxOffset).toFixed(1)}px, 0)`;
    });
  };

  const syncLetterReveal = () => {
    if (!letterRevealBlocks.length) return;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const mix = (from, to, progress) => Math.round(from + (to - from) * progress);

    letterRevealBlocks.forEach(({ el, chars }) => {
      if (!chars.length) return;

      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.86;
      const endTop = window.innerHeight * 0.5 - rect.height;
      const progress = clamp((start - rect.top) / (start - endTop), 0, 1);
      const scaled = progress * (chars.length + 3);

      chars.forEach((char, index) => {
        const charProgress = clamp(scaled - index, 0, 1);
        const r = mix(207, 11, charProgress);
        const g = mix(212, 16, charProgress);
        const b = mix(218, 32, charProgress);
        char.style.color = `rgb(${r}, ${g}, ${b})`;
      });
    });
  };

  const onScroll = () => {
    syncHeaderState();
    syncParallax();
    syncLetterReveal();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    syncParallax();
    syncLetterReveal();
  }, { passive: true });

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
      { image: hero.dataset.image5, caption: hero.dataset.caption5 || 'Santa Monica, CA' },
      { image: hero.dataset.image6, caption: hero.dataset.caption6 || 'Maracana Stadium, Rio de Janiero, Brazil · 2014 World Cup Final Venue' },
      { image: hero.dataset.image7, caption: hero.dataset.caption7 || 'The Colony Hotel*** · Miami Beach, FL' },
      { image: hero.dataset.image8, caption: hero.dataset.caption8 || '2028 Stadium, Inglewood, CA · Olympic Ceremonies and Swimming Venue' },
      { image: hero.dataset.image9, caption: hero.dataset.caption9 || 'Stade de France, Paris, France · Summer Olympics 2024' },
      { image: hero.dataset.image10, caption: hero.dataset.caption10 || 'Soccer City Stadium, Johannesburg, South Africa · World Cup 2010' }
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
    const subcopy = document.querySelector('.hero-home-subcopy');
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
          if (cta || subcopy) {
            window.setTimeout(() => {
              cta?.classList.add('is-visible');
              subcopy?.classList.add('is-visible');
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
    if (!trigger || !panel) return;

    const label = trigger.querySelector('.mobile-menu-trigger__label');
    const links = Array.from(document.querySelectorAll('.mobile-menu-link'));

    if (!label) return;

    const close = () => {
      document.body.classList.remove('mobile-menu-open');
      trigger.setAttribute('aria-expanded', 'false');
      label.textContent = 'Menu';
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

  const initContactFormToggles = () => {
    const toggle = document.querySelector('[data-varying-dates-toggle]');
    const note = document.querySelector('[data-varying-dates-note]');
    if (!toggle || !note) return;

    const sync = () => {
      note.hidden = !toggle.checked;
    };

    toggle.addEventListener('change', sync);
    sync();
  };

  const initLegalOverlays = () => {
    const openers = Array.from(document.querySelectorAll('[data-open-legal]'));
    const overlays = Array.from(document.querySelectorAll('[data-legal-overlay]'));
    if (!openers.length || !overlays.length) return;

    const closeAll = () => {
      overlays.forEach((overlay) => {
        overlay.hidden = true;
      });
      document.body.classList.remove('legal-overlay-open');
    };

    const openOverlay = (name) => {
      let opened = false;
      overlays.forEach((overlay) => {
        const isMatch = overlay.getAttribute('data-legal-overlay') === name;
        overlay.hidden = !isMatch;
        opened = opened || isMatch;
      });
      document.body.classList.toggle('legal-overlay-open', opened);
    };

    openers.forEach((opener) => {
      opener.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        openOverlay(opener.getAttribute('data-open-legal'));
      });
    });

    overlays.forEach((overlay) => {
      overlay.querySelectorAll('[data-close-legal]').forEach((closer) => {
        closer.addEventListener('click', closeAll);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeAll();
    });
  };

  const initErrorPage = () => {
    if (!document.body.classList.contains('page-404')) return;

    const requestedPath = document.querySelector('[data-requested-path]');
    const redirectNote = document.querySelector('[data-redirect-note]');
    const homeHref = document.querySelector('.logo')?.getAttribute('href') || '/';
    const normalizedHome = homeHref.endsWith('/') ? homeHref : `${homeHref}/`;
    const currentPath = window.location.pathname;
    const lowerPath = currentPath.toLowerCase();
    const aliasRedirects = new Map([
      [`${normalizedHome}tc`, `${normalizedHome}t-c/`],
      [`${normalizedHome}tc/`, `${normalizedHome}t-c/`]
    ]);

    if (requestedPath) {
      requestedPath.textContent = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    }

    const aliasTarget = aliasRedirects.get(lowerPath);
    if (!aliasTarget) return;

    if (redirectNote) {
      redirectNote.hidden = false;
      redirectNote.innerHTML = `Redirecting to <a href="${aliasTarget}">T&amp;C</a>…`;
    }

    window.setTimeout(() => {
      window.location.replace(aliasTarget);
    }, redirectNote ? 900 : 0);
  };

  const initAboutInteractions = () => {
    if (!document.body.classList.contains('page-about')) return;

    const processSteps = Array.from(document.querySelectorAll('[data-about-step]'));
    const processGrid = document.querySelector('.about-page-process-grid');
    const projectCards = Array.from(document.querySelectorAll('[data-about-project-card]'));
    const timeline = document.querySelector('[data-about-timeline]');
    const timelineEntries = Array.from(document.querySelectorAll('[data-about-timeline-entry]'));

    if (processSteps.length) {
      const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)');
      let pinnedStep = null;

      const setActiveStep = (activeStep = null) => {
        processSteps.forEach((step) => {
          const isActive = step === activeStep;
          step.classList.toggle('is-active', isActive);
          step.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      };

      processSteps.forEach((step) => {
        step.addEventListener('mouseenter', () => {
          if (!supportsHover.matches || pinnedStep) return;
          setActiveStep(step);
        });

        step.addEventListener('focusin', () => {
          if (pinnedStep) return;
          setActiveStep(step);
        });

        step.addEventListener('click', () => {
          pinnedStep = pinnedStep === step ? null : step;
          setActiveStep(pinnedStep);
        });

        step.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          pinnedStep = pinnedStep === step ? null : step;
          setActiveStep(pinnedStep);
        });
      });

      processGrid?.addEventListener('mouseleave', () => {
        if (supportsHover.matches && !pinnedStep) setActiveStep(null);
      });

      if (supportsHover.matches) setActiveStep(null);
    }

    if (projectCards.length) {
      const setActiveProjectCard = (targetCard) => {
        projectCards.forEach((card) => {
          card.classList.toggle('is-active', card === targetCard);
        });
      };

      projectCards.forEach((card) => {
        card.addEventListener('mouseenter', () => setActiveProjectCard(card));
        card.addEventListener('focusin', () => setActiveProjectCard(card));
        card.addEventListener('click', () => setActiveProjectCard(card));
      });
    }

    if (timeline && timelineEntries.length) {
      const syncTimeline = () => {
        const focusY = window.innerHeight * 0.5;
        let activeEntry = timelineEntries[0];
        let bestDistance = Number.POSITIVE_INFINITY;

        timelineEntries.forEach((entry) => {
          const rect = entry.getBoundingClientRect();
          const center = rect.top + rect.height * 0.5;
          const distance = Math.abs(center - focusY);
          if (distance < bestDistance) {
            bestDistance = distance;
            activeEntry = entry;
          }
        });

        timelineEntries.forEach((entry) => {
          entry.classList.toggle('is-active', entry === activeEntry);
        });

        const timelineRect = timeline.getBoundingClientRect();
        const activeRect = activeEntry.getBoundingClientRect();
        const nodeOffset = parseFloat(getComputedStyle(timeline).getPropertyValue('--about-timeline-node-offset')) || 16.5;
        const progress = Math.max(0, activeRect.top - timelineRect.top + nodeOffset);
        timeline.style.setProperty('--about-timeline-progress', `${progress.toFixed(1)}px`);
      };

      window.addEventListener('scroll', syncTimeline, { passive: true });
      window.addEventListener('resize', syncTimeline, { passive: true });
      syncTimeline();
    }
  };

  syncHeaderState();
  syncParallax();
  syncLetterReveal();
  initHeroSlider();
  runTypewriter();
  initMobileMenu();
  initContactFormToggles();
  initLegalOverlays();
  initErrorPage();
  initAboutInteractions();
  initTermsConfirmation();
  initConfirmationSuccess();
  initPrefillFromUrl();
})();

function initTermsConfirmation() {
  const form = document.querySelector('[data-terms-form]');
  const checkbox = document.querySelector('[data-terms-checkbox]');
  const submitBtn = document.querySelector('[data-terms-submit]');

  if (!form || !checkbox || !submitBtn) return;

  const updateSubmitState = () => {
    submitBtn.disabled = !checkbox.checked;
  };

  checkbox.addEventListener('change', updateSubmitState);
  updateSubmitState();

  form.addEventListener('submit', (event) => {
    if (!checkbox.checked) {
      event.preventDefault();
      submitBtn.disabled = true;
      return;
    }
  });
}

function initConfirmationSuccess() {
  const fullNameEl = document.getElementById('success-full-name');
  if (!fullNameEl) return;

  const params = new URLSearchParams(window.location.search);
  const fullName = params.get('full_name');
  const email = params.get('email');
  const termsVersion = params.get('terms_version');
  const confirmedAt = params.get('confirmed_at');

  if (fullName) fullNameEl.textContent = decodeURIComponent(fullName);
  if (email) document.getElementById('success-email').textContent = decodeURIComponent(email);
  if (termsVersion) document.getElementById('success-terms-version').textContent = decodeURIComponent(termsVersion);
  if (confirmedAt) document.getElementById('success-confirmed-at').textContent = decodeURIComponent(confirmedAt);
}

function initPrefillFromUrl() {
  const form = document.querySelector('form[data-prefill-from-url]');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const reserved = new Set(['success_path']);

  params.forEach((value, key) => {
    if (reserved.has(key)) return;

    const field = form.querySelector(`[name="${CSS.escape(key)}"]`);
    if (!field) return;
    if (field.type === 'checkbox' || field.type === 'radio') return;

    field.value = decodeURIComponent(value);
  });
}
