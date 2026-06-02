/* site02 — progressive enhancement: gentle reveal-on-scroll for natural flow.
   No-JS and reduced-motion users see everything immediately (nothing is hidden
   unless we can animate it). */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var nodes = document.querySelectorAll(
    'main section:not(.hero), .feat, .pain, .tool, .connect-card, .sensor, .video, .cs-card, .proof-card, .quote, .stat, .flow-steps li'
  );
  if (!nodes.length) return;

  // Only hide things now that we know we can reveal them.
  nodes.forEach(function (el) { el.classList.add('reveal'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  nodes.forEach(function (el) { io.observe(el); });

  // Stagger items within a grid so cards cascade rather than pop together.
  ['.feat-grid', '.pain-grid', '.tool-grid', '.connect-grid', '.sensor-grid',
   '.video-grid', '.proof-grid', '.quote-grid', '.flow-steps', '.stats'
  ].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (grid) {
      Array.prototype.slice.call(grid.children).forEach(function (child, i) {
        child.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
      });
    });
  });
})();

/* Calendly popup for off-home "Start a conversation" buttons.
   These links fall back to the homepage embed (index.html#book) when JS or
   Calendly is unavailable — so a raw calendly.com link never opens. */
(function () {
  var url = 'https://calendly.com/cmisztur-mriiot/30min?hide_gdpr_banner=1&background_color=f6f4ee&text_color=181a1d&primary_color=0b59cf';
  document.querySelectorAll('a[href="index.html#book"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
        e.preventDefault();
        window.Calendly.initPopupWidget({ url: url });
      }
    });
  });
})();

/* Size the inline Calendly embed to its actual content height. The embed ships
   with a fixed height that's taller than the booking UI, leaving dead white
   space below it (worst on mobile). Calendly posts its real page height as it
   renders — track it so the bordered card hugs the content. */
(function () {
  var widget = document.querySelector('.calendly-inline-widget');
  if (!widget) return;
  window.addEventListener('message', function (e) {
    if (typeof e.origin === 'string' && e.origin.indexOf('calendly.com') === -1) return;
    var data = e.data;
    if (data && typeof data === 'object' && data.event === 'calendly.page_height' && data.payload) {
      // Calendly sometimes posts a spurious tiny height (e.g. "2px") before the
      // booking UI has laid out. Applying it collapses the embed to a blank
      // sliver, so ignore implausible values and keep the inline default height
      // as the fallback; real heights (~800-1100px) still hug the content.
      var h = parseInt(data.payload.height, 10);
      if (h > 300) { widget.style.height = h + 'px'; }
    }
  });
})();
