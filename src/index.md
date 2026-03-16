---
layout: base.njk
title: INTERESTING AMERICA
description: Accommodation, transfers and hospitality for major global sports events.
hero_dimming_percent: 100
hero_image1: /images/uploads/hero-atl-marriott-marquis.jpg
hero_caption1: Marriott Marquis****, Atlanta, GA
hero_image2: /images/uploads/hero-st-regis-san-francisco.jpg
hero_caption2: The St. Regis*****, San Francisco, CA
hero_image3: /images/uploads/hero-los-angeles-ca.jpg
hero_caption3: Los Angeles, CA - Host City of the 2028 Summer Olympics
hero_image4: /images/uploads/hero-dallas-tx.jpg
hero_caption4: Dallas, TX - 2026 Soccer World Cup Host City
hero_image5: /images/uploads/hero-santa-monica-ca.jpg
hero_caption5: Santa Monica, CA
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
  data-caption5="{{ hero_caption5 }}">
  <div class="hero-bg-track" aria-hidden="true">
    <div class="hero-bg hero-bg--active" style="background-image:url('{{ hero_image1 | url }}')"></div>
    <div class="hero-bg hero-bg--next" style="background-image:url('{{ hero_image2 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--1" style="background-image:url('{{ hero_image1 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--2" style="background-image:url('{{ hero_image2 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--3" style="background-image:url('{{ hero_image3 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--4" style="background-image:url('{{ hero_image4 | url }}')"></div>
    <div class="hero-bg hero-bg--css hero-bg--5" style="background-image:url('{{ hero_image5 | url }}')"></div>
    <div class="hero-bg-overlay"></div>
  </div>

  <div class="wrap-wide fade in">
    <div class="hero-copy-block">
      <h1 class="typewriter" data-text="We secure rooms for your groups at major global sports events.">We secure rooms for your groups at major global sports events.</h1>
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

<section class="section story-section">
  <div class="wrap story-grid fade">
    <div class="story-static">
      <p class="eyebrow">SPECIALISING</p>
      <h2 class="section-title">A 2026-grade execution layer for sports travel.</h2>
      <p class="section-lead">Built on speed, risk control and operational precision for major event pressure windows.</p>
      <a class="btn btn-primary" href="{{ '/services/' | url }}">See services</a>
    </div>

    <div class="story-dynamic dynamic-media" data-speed="0.24">
      <div class="placeholder-media">
        <span>SECTION IMAGE 01</span>
      </div>
    </div>
  </div>
</section>

<section class="section story-section story-section--reverse">
  <div class="wrap story-grid fade">
    <div class="story-dynamic dynamic-media" data-speed="0.2">
      <div class="placeholder-media">
        <span>SECTION IMAGE 02</span>
      </div>
    </div>

    <div class="story-static">
      <p class="eyebrow">SERVICES</p>
      <h2 class="section-title">Hotels, transfers and hospitality access.</h2>
      <p class="section-lead">Hard-to-find room inventory, coordinated transport, and venue access through trusted relationships.</p>
      <div class="mini-grid">
        <article class="card">
          <h3>Hotel Brokerage</h3>
          <p>Strategic city and stadium locations, structured for groups and decision speed.</p>
        </article>
        <article class="card">
          <h3>Transfers</h3>
          <p>Arrival, departure and match-day movement, coordinated end-to-end.</p>
        </article>
      </div>
    </div>
  </div>
</section>

<section class="section story-section">
  <div class="wrap story-grid fade">
    <div class="story-static">
      <p class="eyebrow">TRUST</p>
      <h2 class="section-title">Confidence through execution.</h2>
      <p class="section-lead">For sponsors, federations, TV & media, travel agencies and family offices, delivered with operational discipline since 2010.</p>
      <ul class="clean-list">
        <li>Fast qualification and feasibility framing</li>
        <li>Clear option architecture with trade-offs</li>
        <li>Reliable delivery from booking to check-out</li>
      </ul>
    </div>

    <div class="story-dynamic dynamic-media" data-speed="0.22">
      <div class="placeholder-media">
        <span>SECTION IMAGE 03</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap fade" style="text-align:center">
    <h2 class="section-title">Work with us</h2>
    <p class="section-lead" style="margin:0 auto 20px">Send your event, room volume and timeline, we’ll return practical options fast.</p>
    <a class="btn btn-primary" href="{{ '/contact/' | url }}">Start the conversation</a>
  </div>
</section>