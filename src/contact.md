---
layout: base.njk
title: Contact
description: Contact INTERESTING AMERICA
pageClasses: subpage-home page-contact
templateEngineOverride: njk
hero_dimming_percent: 100
hero_image1: /images/uploads/hero-colony-hotel-mia.jpg
hero_caption1: The Colony Hotel*** · Miami Beach, FL
hero_image2: /images/uploads/hero-dallas-tx.jpg
hero_caption2: Dallas, TX · 2026 Soccer World Cup Host City
hero_image3: /images/uploads/hero-st-regis-san-francisco.jpg
hero_caption3: The St. Regis***** · San Francisco, CA
hero_kicker: Contact
hero_title: Send one clean<br>brief. We come back<br>with options<br>you can use.
hero_copy: "A concise first message is enough to start: event, city, dates, room volume, guest mix, decision timing and any non-negotiables."
hero_link_label: Jump to Inquiry
hero_link_url: /contact/#contact-form
---

<section class="story-section subpage-home-section subpage-home-section--contact-entry" id="contact-form">
  <div class="wrap-wide">
    <div class="story-grid subpage-home-contact-grid">
      <div class="story-static fade">
        <p class="eyebrow">Contact</p>
        <h2 class="section-title">One complete brief is enough for us to start moving.</h2>
        <p class="section-lead">If email is easier than forms, write to <a href="mailto:america@interesting.global">america@interesting.global</a>. Otherwise use the inquiry form below.</p>

        <form class="panel inquiry-form" name="event-inquiry" method="POST" action="{{ integrations.contactFormEndpoint }}">
          <input type="hidden" name="success_path" value="{{ '/thank-you/' | url }}">
          <p class="form-honeypot" aria-hidden="true"><label>Do not fill this out: <input name="company_website"></label></p>

          <div class="form-grid">
            <label>Full Name*<input type="text" name="full_name" required></label>
            <label>Company*<input type="text" name="company" required></label>
            <label>Work Email*<input type="email" name="email" required></label>
            <label>Phone / WhatsApp<input type="text" name="phone"></label>
            <label>Event*<select name="event" required><option value="" selected disabled>Select event</option><option>FIFA World Cup 2026</option><option>Winter Olympics 2026</option><option>LA Olympics 2028</option><option>Other major event</option></select></label>
            <label>Host City / Area*<input type="text" name="city_area" required></label>
            <label>Check-in*<input type="date" name="check_in" required></label>
            <label>Check-out*<input type="date" name="check_out" required></label>
            <label>Total Rooms*<input type="number" name="rooms_total" min="1" required></label>
            <label>Budget per Room / Night (USD)<input type="text" name="budget"></label>
            <label>Main Guest Mix<select name="guest_mix"><option value="" selected disabled>Select mix</option><option>Sponsor guests + staff</option><option>Media crews + journalists</option><option>Federation + families</option><option>Agency travelers</option><option>Mixed</option></select></label>
            <label>Required Services<select name="services_scope"><option value="" selected disabled>Select scope</option><option>Hotel only</option><option>Hotel + transfers</option><option>Hotel + hospitality access</option><option>Full package</option></select></label>
            <label class="form-span-2">Request Details*<textarea name="request_details" rows="6" required placeholder="Room split, level, location priorities, constraints"></textarea></label>
            <label class="form-span-2">Decision Deadline<input type="text" name="decision_deadline" placeholder="e.g. Friday 16:00 CET"></label>
          </div>

          <div class="form-actions">
            <button class="btn btn-primary" type="submit">Submit Inquiry</button>
            <p class="form-note">Direct email also works: <a href="mailto:america@interesting.global">america@interesting.global</a></p>
          </div>
        </form>
      </div>

      <div class="story-dynamic fade">
        <figure class="subpage-home-figure dynamic-media" data-speed="0.14" data-max-offset="30">
          <img src="{{ '/images/uploads/hero-dallas-tx.jpg' | url }}" alt="Dallas skyline" style="object-position:center 50%;">
          <figcaption>American host-city context and quick-turn event sourcing</figcaption>
        </figure>

        <div class="subpage-home-side-note">
          <p>Best starting points:</p>
          <ul class="clean-list">
            <li>Event, city, dates and room volume</li>
            <li>Guest mix and target standard</li>
            <li>Budget band and decision deadline</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>
