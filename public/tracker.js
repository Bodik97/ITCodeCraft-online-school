(function () {
  'use strict';

  var THROTTLE_MS = 500;
  var startTime = Date.now();
  var lastSent = Object.create(null);

  function canSend(event, label) {
    var key = event + '\u0000' + (label || '');
    var now = Date.now();
    var prev = lastSent[key] || 0;
    if (now - prev < THROTTLE_MS) return false;
    lastSent[key] = now;
    return true;
  }

  function payload(event, label) {
    return {
      event: event,
      label: label || '',
      url: typeof location !== 'undefined' ? location.href : '',
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent || '' : '',
      timestamp: Date.now(),
    };
  }

  function send(event, label, options) {
    var skipThrottle = options && options.skipThrottle;
    if (!skipThrottle && !canSend(event, label)) return;
    if (skipThrottle) {
      var k = event + '\u0000' + (label || '');
      lastSent[k] = Date.now();
    }
    var body = payload(event, label);
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(function () {});
  }

  window.itccTrack = function (event, label, options) {
    send(event, label || '', options || {});
  };

  send('page_view', location.pathname + location.search || '/');

  document.addEventListener(
    'click',
    function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var btn = t.closest('button, [role="button"]');
      if (btn) {
        if (btn.closest('#modal-open, [data-modal-open]')) return;
        var bLabel =
          (btn.getAttribute('aria-label') || btn.innerText || '')
            .trim()
            .slice(0, 200) || '[button]';
        send('button_click', bLabel);
        return;
      }
      var a = t.closest('a[href]');
      if (a) {
        if (a.matches('#modal-open, [data-modal-open]')) return;
        var text = (a.innerText || '').trim().slice(0, 120);
        var href = a.getAttribute('href') || '';
        send('link_click', text + ' | ' + href);
      }
    },
    true,
  );

  document.addEventListener(
    'submit',
    function (e) {
      var form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (form.getAttribute('data-itcc-form') === 'register-lead') return;
      var id = form.id || '';
      var action = form.getAttribute('action') || '';
      send('form_submit', (id || action || 'form').slice(0, 200));
    },
    true,
  );

  window.addEventListener('beforeunload', function () {
    var sec = Math.max(0, Math.round((Date.now() - startTime) / 1000));
    var body = payload('time_on_page', String(sec) + 's');
    var json = JSON.stringify(body);
    if (navigator.sendBeacon) {
      var blob = new Blob([json], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
        keepalive: true,
      }).catch(function () {});
    }
  });
})();
