---
layout: base.njk
title: Services
description: Services by INTERESTING AMERICA
pageClasses: subpage-home page-services
templateEngineOverride: njk
hero_dimming_percent: 100
hero_image1: /images/uploads/hero-sofi-2025.jpg
hero_caption1: 2028 Stadium, Inglewood, CA · Olympic Ceremonies and Swimming Venue
hero_image2: /images/uploads/hero-atl-marriott-marquis.jpg
hero_caption2: Marriott Marquis**** · Atlanta, GA
hero_image3: /images/uploads/hero-colony-hotel-mia.jpg
hero_caption3: The Colony Hotel*** · Miami Beach, FL
hero_title: Global accommodation,<br>transfers,<br>and hospitality,<br>all in one place.
hero_copy: We provide solutions for federations, sponsors, media, and travel agencies since 2010.
hero_link_label: Start an Inquiry
hero_link_url: /contact/
---

{% include "modules/subpage-home-hero.njk" %}

<section class="story-section story-section--reverse subpage-home-section" id="services-content">
  <div class="wrap-wide">
    <div class="services-showcase">
      <figure class="services-showcase__media dynamic-media" data-speed="0.14" data-max-offset="30">
        <img src="{{ '/images/uploads/hero-atl-marriott-marquis.jpg' | url }}" alt="Interior of the Marriott Marquis in Atlanta" style="object-position:center 38%;">
      </figure>

      <div class="services-showcase__content">
        <h2 class="services-showcase__headline" data-letter-reveal>
          We secure rooms for your groups at major global sports events.
        </h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

        <a class="hero-link-cta hero-link-cta--static services-showcase__cta" href="{{ '/contact/' | url }}">
          <span class="hero-link-cta__text">Get in Touch</span>
          <span class="hero-link-cta__icon" aria-hidden="true">
            <svg viewBox="0 0 19 19" role="presentation" focusable="false">
              <path d="M14.458 10.687 L0 10.688 L0 8.313 L14.458 8.313 L7.808 1.663 L9.5 0 L19 9.5 L9.5 19 L7.808 17.337 Z" fill="currentColor"></path>
            </svg>
          </span>
        </a>
      </div>
    </div>
  </div>
</section>
