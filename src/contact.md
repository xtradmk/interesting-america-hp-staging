---
layout: base.njk
title: INTERESTING AMERICA
description: Accommodation, transfers and hospitality for major global sports events.
hide_footer: true
hero_dimming_percent: 100
hero_image1: /images/uploads/hero-atl-marriott-marquis.jpg
hero_caption1: Marriott Marquis**** · Atlanta, GA
hero_image2: /images/uploads/hero-st-regis-san-francisco.jpg
hero_caption2: The St. Regis***** · San Francisco, CA
hero_image3: /images/uploads/hero-los-angeles-ca.jpg
hero_caption3: Los Angeles, CA · Host City of the 2028 Summer Olympics
hero_image4: /images/uploads/hero-dallas-tx.jpg
hero_caption4: Dallas, TX · 2026 Soccer World Cup Host City
hero_image5: /images/uploads/hero-santa-monica-ca.jpg
hero_caption5: Santa Monica, CA
hero_image6: /images/uploads/hero-maracana-2014.jpg
hero_caption6: Maracana Stadium, Rio de Janiero, Brazil · 2014 World Cup Final Venue
hero_image7: /images/uploads/hero-colony-hotel-mia.jpg
hero_caption7: The Colony Hotel*** · Miami Beach, FL
hero_image8: /images/uploads/hero-sofi-2025.jpg
hero_caption8: 2028 Stadium, Inglewood, CA · Olympic Ceremonies and Swimming Venue
---

<section class="hero section hero--photo" id="home"
  style="--hero-overlay-opacity: {{ (hero_dimming_percent or 100) / 100 }}"
  data-image1="{{ hero_image1 | url }}"
  data-caption1="{{ hero_caption1 }}"
  data-image2="{{ hero_image2 | url }}"
  data-caption2="{{ hero_caption2 }}"
  data-image3="{{ hero_image3 | url }}"
  data-caption3="{{ hero_caption3 }}"
  data-image4="{{ hero_image4 | url }}"
  data-caption4="{{ hero_caption4 }}"
  data-image5="{{ hero_image5 | url }}"
  data-caption5="{{ hero_caption5 }}"
  data-image6="{{ hero_image6 | url }}"
  data-caption6="{{ hero_caption6 }}"
  data-image7="{{ hero_image7 | url }}"
  data-caption7="{{ hero_caption7 }}"
  data-image8="{{ hero_image8 | url }}"
  data-caption8="{{ hero_caption8 }}">
  <div class="hero-bg-track" aria-hidden="true">
    <div class="hero-bg hero-bg--active" style="background-image:url('{{ hero_image1 | url }}')"></div>
    <div class="hero-bg hero-bg--next" style="background-image:url('{{ hero_image2 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--1" style="background-image:url('{{ hero_image1 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--2" style="background-image:url('{{ hero_image2 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--3" style="background-image:url('{{ hero_image3 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--4" style="background-image:url('{{ hero_image4 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--5" style="background-image:url('{{ hero_image5 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--6" style="background-image:url('{{ hero_image6 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--7" style="background-image:url('{{ hero_image7 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--8" style="background-image:url('{{ hero_image8 | url }}')"></div>
    <div class="hero-bg-overlay"></div>
  </div>

  <div class="wrap-wide fade in">
    <div class="hero-copy-block">
      <h1 class="typewriter" data-text="We secure rooms&#10;for your groups&#10;at major global&#10;sports events.">We secure rooms<br>for your groups<br>at major global<br>sports events.</h1>
      <a class="hero-link-cta" href="{{ '/contact/' | url }}">
        <span class="hero-link-cta__text">Get in Touch</span>
        <span class="hero-link-cta__icon" aria-hidden="true">
          <svg viewBox="0 0 19 19" role="presentation" focusable="false">
            <path d="M14.458 10.687 L0 10.688 L0 8.313 L14.458 8.313 L7.808 1.663 L9.5 0 L19 9.5 L9.5 19 L7.808 17.337 Z" fill="currentColor"></path>
          </svg>
        </span>
      </a>
    </div>
  </div>

  <p class="hero-photo-caption" id="hero-photo-caption">{{ hero_caption1 }}</p>

  <div class="hero-slider-ui" aria-label="Header image controls">
    <button class="hero-slider-btn" type="button" data-hero-prev aria-label="Previous image">‹</button>
    <button class="hero-slider-btn" type="button" data-hero-next aria-label="Next image">›</button>
  </div>
</section>