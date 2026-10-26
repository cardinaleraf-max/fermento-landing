(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.lucide) window.lucide.createIcons();

  // ---------- Header ----------
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- Reveal ----------
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { revealObs.observe(el); });

  function whenVisible(el, fn, threshold) {
    if (!el) return;
    var o = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { o.disconnect(); fn(); }
    }, { threshold: threshold || 0.3 });
    o.observe(el);
  }

  // ---------- Hero ----------
  var heroApp = document.querySelector('.hero-app');
  requestAnimationFrame(function () { heroApp.classList.add('is-in'); });

  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduced) { el.textContent = target; return; }
    var start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / 1100, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 400);
  });

  var tilt = document.getElementById('tilt');
  if (tilt && !reduced && window.matchMedia('(hover: hover)').matches) {
    heroApp.addEventListener('mousemove', function (e) {
      var r = heroApp.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = 'rotateY(' + (-7 + x * 6) + 'deg) rotateX(' + (3 - y * 5) + 'deg)';
    });
    heroApp.addEventListener('mouseleave', function () { tilt.style.transform = ''; });
  }

  // ---------- Grafico vendite ----------
  var spark = document.getElementById('spark');
  if (spark) {
    var mesi = ['N', 'D', 'G', 'F', 'M', 'A', 'M', 'G', 'L', 'A', 'S', 'O'];
    var valori = [42, 58, 30, 34, 46, 61, 74, 88, 96, 79, 66, 71];
    var max = Math.max.apply(null, valori);
    mesi.forEach(function (m, i) {
      var col = document.createElement('div');
      col.className = 'spark-col' + (i === mesi.length - 1 ? ' is-now' : '');
      col.innerHTML = '<i></i><small>' + m + '</small>';
      spark.appendChild(col);
    });
    whenVisible(spark, function () {
      spark.querySelectorAll('.spark-col i').forEach(function (bar, i) {
        bar.style.transitionDelay = (i * 45) + 'ms';
        bar.style.height = (valori[i] / max * 100) + '%';
      });
    });
  }

  // ---------- Campo: file di semina ----------
  var rows = document.querySelector('.field-map .rows');
  if (rows) {
    var ns = 'http://www.w3.org/2000/svg';
    for (var x = 20; x < 196; x += 9) {
      var l = document.createElementNS(ns, 'line');
      l.setAttribute('x1', x); l.setAttribute('y1', 14);
      l.setAttribute('x2', x - 24); l.setAttribute('y2', 108);
      rows.appendChild(l);
    }
    var clip = document.createElementNS(ns, 'clipPath');
    clip.setAttribute('id', 'campo-clip');
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('d', document.querySelector('.field-map path').getAttribute('d'));
    clip.appendChild(p);
    rows.parentNode.insertBefore(clip, rows);
    rows.setAttribute('clip-path', 'url(#campo-clip)');
  }

  // ---------- Filiera: stepper ----------
  var chain = document.getElementById('chain');
  if (chain) {
    var tabs = Array.prototype.slice.call(chain.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var current = 0;
    var DUR = 7000;
    var timer = null;
    var auto = !reduced;
    chain.style.setProperty('--dur', DUR + 'ms');

    function show(i, focus) {
      current = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        var on = k === current;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
        panels[k].classList.remove('is-on');
      });
      panels[current].offsetHeight; // riavvia le animazioni del pannello
      panels[current].classList.add('is-on');
      if (focus) tabs[current].focus({ preventScroll: true });
      // scorre solo la barra degli step, mai la pagina
      var strip = chain.querySelector('.chain-steps');
      var li = tabs[current].parentNode;
      strip.scrollTo({ left: li.offsetLeft - (strip.clientWidth - li.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
      if (panels[current].id === 'st-trac') animateTree();
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (auto) timer = setTimeout(function () { show(current + 1); }, DUR);
    }
    function stopAuto() {
      auto = false;
      clearTimeout(timer);
      chain.classList.add('is-paused');
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { stopAuto(); show(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { stopAuto(); show(current + 1, true); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { stopAuto(); show(current - 1, true); e.preventDefault(); }
      });
    });
    chain.querySelector('.chain-panels').addEventListener('click', stopAuto);

    if (reduced) chain.classList.add('is-paused');
    // parte quando la sezione è in vista, così si vede dal primo step
    tabs.forEach(function (t, k) { t.tabIndex = k === 0 ? 0 : -1; });
    whenVisible(chain, function () { show(0); }, 0.35);
  }

  // ---------- Tracciabilità: direzione ----------
  var tree = document.getElementById('trace-tree');
  function animateTree() {
    if (!tree) return;
    Array.prototype.forEach.call(tree.children, function (li, i) {
      li.style.animation = 'none';
      li.offsetHeight; // riavvia l'animazione
      li.style.animation = '';
      li.style.setProperty('--i', i);
    });
  }
  document.querySelectorAll('.trace-toggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.classList.contains('is-on')) return;
      document.querySelectorAll('.trace-toggle button').forEach(function (o) { o.classList.toggle('is-on', o === b); });
      Array.prototype.slice.call(tree.children).reverse().forEach(function (li) { tree.appendChild(li); });
      animateTree();
    });
  });

  // ---------- Chat Bira ----------
  var chatBody = document.getElementById('chat-body');
  if (chatBody) {
    var items = Array.prototype.slice.call(chatBody.querySelectorAll('[data-seq]'));
    if (reduced) {
      items.forEach(function (el) { el.classList.add('is-shown'); });
    } else {
      whenVisible(chatBody, function () {
        var i = 0;
        function next() {
          if (i >= items.length) return;
          var el = items[i++];
          if (el.classList.contains('msg-b')) {
            var t = document.createElement('div');
            t.className = 'typing';
            t.innerHTML = '<i></i><i></i><i></i>';
            chatBody.insertBefore(t, el);
            setTimeout(function () {
              t.remove();
              el.classList.add('is-shown');
              setTimeout(next, 1300);
            }, 1100);
          } else {
            el.classList.add('is-shown');
            setTimeout(next, el.classList.contains('tools') ? 500 : 650);
          }
        }
        next();
      }, 0.4);
    }
  }

  // ---------- Video ----------
  var lazyVideos = document.querySelectorAll('video[preload="none"]');
  var vidObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !reduced) {
        e.target.load();
        e.target.play().catch(function () {});
        vidObs.unobserve(e.target);
      }
    });
  }, { rootMargin: '300px' });
  lazyVideos.forEach(function (v) { vidObs.observe(v); });

  var demoVideo = document.getElementById('demo-video');
  var demoPlay = document.getElementById('demo-play');
  if (demoVideo && demoPlay) {
    demoPlay.addEventListener('click', function () { demoVideo.controls = true; demoVideo.play(); });
    demoVideo.addEventListener('play', function () { demoPlay.classList.add('is-hidden'); });
    demoVideo.addEventListener('pause', function () { if (!demoVideo.ended) demoPlay.classList.remove('is-hidden'); });
    demoVideo.addEventListener('ended', function () {
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
      else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
      else if (demoVideo.webkitDisplayingFullscreen) demoVideo.webkitExitFullScreen();
      demoVideo.controls = false;
      demoVideo.load(); // torna alla copertina
      demoPlay.classList.remove('is-hidden');
      var card = document.querySelector('.form-card');
      setTimeout(function () {
        document.getElementById('inizia').scrollIntoView({ behavior: 'smooth' });
        card.classList.add('is-highlighted');
        setTimeout(function () { card.classList.remove('is-highlighted'); }, 2500);
      }, 400);
    });
  }

  // ---------- Form demo ----------
  var form = document.getElementById('demo-form');
  var msg = document.getElementById('form-msg');
  var submit = document.getElementById('demo-submit');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var missing = Array.prototype.find.call(form.querySelectorAll('input[required]:not([type="radio"])'), function (el) { return !el.value.trim(); });
      if (missing) {
        msg.className = 'form-msg form-msg-error';
        msg.textContent = 'Compila nome, birrificio ed email.';
        missing.focus();
        return;
      }
      var email = form.querySelector('#f-email');
      if (!email.checkValidity()) {
        msg.className = 'form-msg form-msg-error';
        msg.textContent = "Controlla l'indirizzo email.";
        email.focus();
        return;
      }
      if (!form.querySelector('input[name="sistema_operativo"]:checked')) {
        msg.className = 'form-msg form-msg-error';
        msg.textContent = 'Scegli il sistema operativo: Windows o Mac.';
        return;
      }
      var payload = {};
      new FormData(form).forEach(function (val, key) { payload[key] = val; });
      submit.disabled = true;
      submit.textContent = 'Invio in corso…';
      msg.className = 'form-msg';
      msg.textContent = '';
      try {
        var res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        var json = await res.json();
        if (res.ok && json.success) {
          form.style.display = 'none';
          msg.className = 'form-msg form-msg-success';
          msg.textContent = 'Richiesta inviata. Ti mando il link della demo via email entro 24 ore.';
        } else {
          throw new Error('Invio fallito');
        }
      } catch (err) {
        submit.disabled = false;
        submit.textContent = 'Richiedi la demo';
        msg.className = 'form-msg form-msg-error';
        msg.textContent = 'Qualcosa non è andato. Riprova o scrivici su WhatsApp.';
      }
    });
  }
})();
