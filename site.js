(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.querySelector('[data-page]');
  document.documentElement.classList.add('is-ready');

  if (!reduceMotion && window.gsap && page) {
    const enter = page.querySelectorAll('[data-enter]');
    gsap.from(enter, { y: 34, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out' });

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, { y: 34, opacity: 0 }, {
          y: 0, opacity: 1, duration: .9, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 84%', once: true }
        });
      });

      const heroImage = document.querySelector('.hero-photo');
      if (heroImage) {
        gsap.to(heroImage, {
          y: -26, rotation: -1, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
      }

      ['.cert-grid', '.hobby-grid', '.achievement-row'].forEach((selector) => {
        const items = document.querySelectorAll(selector + ' > *');
        if (items.length) {
          gsap.from(items, {
            y: 26, opacity: 0, duration: .7, stagger: .09, ease: 'power3.out',
            scrollTrigger: { trigger: selector, start: 'top 86%', once: true }
          });
        }
      });

      const statBand = document.querySelector('.stat-band-inner');
      if (statBand) {
        gsap.from(statBand.children, {
          x: -18, opacity: 0, duration: .6, stagger: .1, ease: 'power3.out',
          scrollTrigger: { trigger: statBand, start: 'top 92%', once: true }
        });
      }

      gsap.utils.toArray('.stat-fill').forEach((fill) => {
        gsap.to(fill, {
          width: (fill.dataset.level || 50) + '%', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: fill, start: 'top 92%', once: true }
        });
      });

      const progress = document.createElement('div');
      progress.className = 'scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progress);
      gsap.to(progress, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true }
      });
    }

    document.querySelectorAll('.button-dark, .button-light, .button-outline, .nav-cta').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const box = button.getBoundingClientRect();
        const x = (event.clientX - box.left - box.width / 2) * .08;
        const y = (event.clientY - box.top - box.height / 2) * .08;
        gsap.to(button, { x, y, duration: .25, ease: 'power3.out', overwrite: true });
      });
      button.addEventListener('pointerleave', () => gsap.to(button, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .4)', overwrite: true }));
    });
  }

  const current = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const target = link.getAttribute('href').replace('.html', '').replace('index', 'home');
    if (target === current) link.setAttribute('aria-current', 'page');
  });

  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIndex = 0;
  window.addEventListener('keydown', (event) => {
    kIndex = event.key === KONAMI[kIndex] ? kIndex + 1 : (event.key === KONAMI[0] ? 1 : 0);
    if (kIndex === KONAMI.length) {
      kIndex = 0;
      const enabled = document.body.classList.toggle('retro-mode');
      const toast = document.createElement('div');
      toast.className = 'cheat-toast';
      toast.setAttribute('role', 'status');
      toast.textContent = enabled ? 'CHEAT CODE ACTIVATED: retro mode on' : 'CHEAT CODE DISABLED: retro mode off';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2600);
    }
  });

  const stack = document.querySelector('#project-stack');
  if (stack) {
    const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const render = (projects) => {
      if (!projects || !projects.length) {
        stack.innerHTML = '<p class="admin-empty">// project archive is empty. new case studies will appear here.</p>';
        return;
      }
      stack.innerHTML = projects.map((project) => {
        const tags = (project.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
        const achievements = (project.achievements || []).map((a) => `<span class="achievement">${escapeHtml(a)}</span>`).join('');
        const live = project.liveUrl ? `<a class="button-light" href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noreferrer">Visit live site</a>` : '';
        const image = project.image || `https://picsum.photos/seed/${encodeURIComponent(project.title || 'project')}/1200/900`;
        return `<article class="project"><div class="project-image"><img src="${escapeHtml(image)}" alt="Screenshot of ${escapeHtml(project.title)}" loading="lazy"></div><div class="project-body"><div><p class="eyebrow">${escapeHtml(project.status || 'project')}</p><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p>${achievements ? `<div class="achievement-row" aria-label="Project achievements">${achievements}</div>` : ''}</div><div><div class="project-meta">${tags}</div><div class="project-actions">${live}</div></div></div></article>`;
      }).join('');
    };
    fetch('projects.json').then((response) => response.json()).then(render).catch(() => render([]));
  }

  console.log('%c mohammad@studio:~$ ', 'background:#c7f36b;color:#0b0d0c;font-weight:bold;padding:2px 6px;border-radius:3px', 'You opened the console. Achievement unlocked.');
  console.log('%c view-source is a form of flattery. -> github.com/mohammadmajalizadeh ', 'color:#9da69e');
})();
