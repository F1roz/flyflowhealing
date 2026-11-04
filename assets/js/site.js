/* flyflowhealing — site interactions (no dependencies) */
(function () {
  var d = document, root = d.documentElement, body = d.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* header: solid on scroll, hide on scroll down */
  var header = d.querySelector('.site-header'), lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 40);
      header.classList.toggle('hide', y > 400 && y > lastY && !body.classList.contains('menu-open'));
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  var menuBtn = d.querySelector('.menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', function () {
    var open = body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) menuBtn.click();
  });

  /* reveal on scroll */
  var rv = d.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* statement: words light up as you scroll */
  var st = d.querySelectorAll('.statement');
  st.forEach(function (el) {
    var out = [];
    el.childNodes.forEach(function (n) {
      var isEm = n.nodeType === 1, txt = n.textContent;
      txt.split(/(\s+)/).forEach(function (w) {
        if (!w.trim()) { out.push(w); return; }
        out.push('<span class="w' + (isEm ? ' em' : '') + '">' + w + '</span>');
      });
    });
    el.innerHTML = out.join('');
  });
  function lightWords() {
    st.forEach(function (el) {
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      var ws = el.querySelectorAll('.w'), n = Math.round(p * ws.length);
      ws.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
    });
  }
  if (st.length) { window.addEventListener('scroll', lightWords, { passive: true }); lightWords(); }

  /* parallax images */
  var px = d.querySelectorAll('[data-parallax]');
  if (px.length && !reduce) {
    var ticking = false;
    function para() {
      px.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect(), vh = window.innerHeight;
        var c = (r.top + r.height / 2 - vh / 2) / vh;
        img.style.transform = 'translate3d(0,' + (c * -40 - 20).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(para); } }, { passive: true });
    para();
  }

  /* article reading progress */
  var bar = d.querySelector('.progress');
  if (bar) window.addEventListener('scroll', function () {
    var h = d.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
  }, { passive: true });

  /* custom Lovelight cursor + magnetic buttons */
  if (fine && !reduce) {
    var ring = d.createElement('div'), dot = d.createElement('div');
    ring.className = 'cursor'; ring.innerHTML = '<span class="label">View</span>';
    dot.className = 'cursor-dot';
    ring.setAttribute('aria-hidden', 'true'); dot.setAttribute('aria-hidden', 'true');
    body.appendChild(ring); body.appendChild(dot);
    var mx = -100, my = -100, rx = -100, ry = -100, shown = false;
    d.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (!shown) { shown = true; rx = mx; ry = my; root.classList.add('has-cursor'); }
    });
    d.addEventListener('mouseleave', function () { root.classList.remove('has-cursor'); shown = false; });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();
    d.addEventListener('mouseover', function (e) {
      var t = e.target.closest('a,button,summary,[data-cursor],label,input,textarea,select');
      ring.classList.remove('hover', 'view');
      if (!t) return;
      if (t.matches('input,textarea,select')) return;
      if (t.dataset.cursor) { ring.classList.add('view'); ring.querySelector('.label').textContent = t.dataset.cursor; }
      else ring.classList.add('hover');
    });
    d.addEventListener('mousedown', function () { ring.classList.add('down'); });
    d.addEventListener('mouseup', function () { ring.classList.remove('down'); });

    d.querySelectorAll('[data-magnetic]').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        b.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* soft page transitions for internal links */
  if (!reduce) {
    d.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|https?:)/.test(href) || a.hasAttribute('download')) return;
      e.preventDefault();
      root.classList.add('leaving');
      setTimeout(function () { window.location.href = a.href; }, 420);
    });
    window.addEventListener('pageshow', function () { root.classList.remove('leaving'); });
  }

  /* copy buttons */
  d.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var v = b.getAttribute('data-copy'), old = b.textContent;
      function done(msg) { b.textContent = msg; setTimeout(function () { b.textContent = old; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(v).then(function () { done('Copied'); }, function () { done(v); });
      } else done(v);
    });
  });

  /* contact note: opens the visitor's email app with the message filled in */
  var form = d.querySelector('form.note');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var f = new FormData(form), msg = form.querySelector('.form-msg');
    var subject = 'Hello from ' + f.get('name') + ' (' + f.get('topic') + ')';
    var bodyTxt = f.get('message') + '\n\n' + f.get('name') + '\n' + f.get('email');
    window.location.href = 'mailto:flyflow.mentoring@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyTxt);
    msg.textContent = 'Your email app should open with your note ready to send. If it doesn’t, write to flyflow.mentoring@gmail.com.';
  });

  var yr = d.querySelector('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();
})();
