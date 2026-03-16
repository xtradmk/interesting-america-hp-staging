---
layout: base.njk
title: Contact
description: Contact INTERESTING AMERICA
pageClasses: subpage-collective
---

<section class="collective-hero section">
  <div class="wrap fade in">
    <p class="collective-kicker">Contact</p>
    <h1 class="collective-title">Funnel entry, send the full brief once.</h1>
  </div>
</section>

<section class="collective-text section">
  <div class="wrap fade">
    <p>Complete inputs mean faster and sharper first options. Incomplete briefs go to slower queue.</p>
  </div>
</section>

<section class="collective-form-block section">
  <div class="wrap fade">
    <form class="collective-form" name="event-inquiry" method="POST" data-netlify="true" netlify-honeypot="company_website">
      <input type="hidden" name="form-name" value="event-inquiry">
      <p class="form-honeypot" aria-hidden="true"><label>Do not fill this out: <input name="company_website"></label></p>

      <div class="collective-form-grid">
        <label>Full Name*<input type="text" name="full_name" required></label>
        <label>Company*<input type="text" name="company" required></label>
        <label>Work Email*<input type="email" name="email" required></label>
        <label>Phone / WhatsApp<input type="text" name="phone"></label>
        <label>Event*<select name="event" required><option value="" selected disabled>Select event</option><option>FIFA World Cup 2026</option><option>Winter Olympics 2026</option><option>LA Olympics 2028</option><option>Other major event</option></select></label>
        <label>Host City / Area*<input type="text" name="city_area" required></label>
        <label>Check-in*<input type="date" name="check_in" required></label>
        <label>Check-out*<input type="date" name="check_out" required></label>
        <label>Total Rooms*<input type="number" name="rooms_total" min="1" required></label>
        <label>Budget per Room/Night (USD)<input type="text" name="budget"></label>
        <label>Main Guest Mix<select name="guest_mix"><option value="" selected disabled>Select mix</option><option>Sponsor guests + staff</option><option>Media crews + journalists</option><option>Federation + families</option><option>Agency travelers</option><option>Mixed</option></select></label>
        <label>Required Services<select name="services_scope"><option value="" selected disabled>Select scope</option><option>Hotel only</option><option>Hotel + transfers</option><option>Hotel + hospitality access</option><option>Full package</option></select></label>
        <label class="span-2">Request Details*<textarea name="request_details" rows="6" required placeholder="Room split, level, location priorities, constraints"></textarea></label>
        <label class="span-2">Decision Deadline<input type="text" name="decision_deadline" placeholder="e.g. Friday 16:00 CET"></label>
      </div>

      <div class="collective-form-actions">
        <button class="btn btn-primary" type="submit">Submit Inquiry</button>
        <p>Direct email, <a href="mailto:usa@interesting-america.com">usa@interesting-america.com</a></p>
      </div>
    </form>
  </div>
</section>
