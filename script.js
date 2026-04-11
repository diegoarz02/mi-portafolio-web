/* ==========================================
   CONFIG
   ========================================== */
const GITHUB_USER = 'diegoarz02';
const TYPEWRITER  = ['Data Scientist', 'ML Engineer', 'AI Developer', 'Estadístico', 'Analytics Translator'];

/* ==========================================
   SIDEBAR TOGGLE
   ========================================== */
const $sidebar    = document.querySelector('[data-sidebar]');
const $sidebarBtn = document.querySelector('[data-sidebar-btn]');

if ($sidebar && $sidebarBtn) {
  $sidebarBtn.addEventListener('click', () => {
    const isOpen = $sidebar.classList.toggle('active');
    $sidebarBtn.querySelector('span').textContent = isOpen ? 'Ocultar contactos' : 'Mostrar contactos';
  });
}

/* ==========================================
   TAB SWITCHING
   ========================================== */
const $navLinks = document.querySelectorAll('[data-nav-link]');
const $articles = document.querySelectorAll('[data-page]');

$navLinks.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    $navLinks.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    $articles.forEach(art => {
      const isTarget = art.dataset.page === target;
      art.classList.toggle('active', isTarget);
      if (isTarget && target === 'resume') triggerSkillBars(art);
    });

    // scroll to top of content on mobile
    if (window.innerWidth <= 700) {
      document.querySelector('.navbar').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ==========================================
   TYPEWRITER
   ========================================== */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  let wi = 0, ci = 0, del = false;
  function tick() {
    const word = TYPEWRITER[wi];
    el.textContent = del ? word.slice(0, --ci) : word.slice(0, ++ci);
    if (!del && ci === word.length) { setTimeout(() => { del = true; tick(); }, 1900); return; }
    if (del && ci === 0) { del = false; wi = (wi + 1) % TYPEWRITER.length; }
    setTimeout(tick, del ? 40 : 90);
  }
  setTimeout(tick, 800);
})();

/* ==========================================
   SKILL BARS
   ========================================== */
function triggerSkillBars(container) {
  container.querySelectorAll('.skill-progress-fill').forEach(bar => {
    requestAnimationFrame(() => { bar.style.width = bar.dataset.pct + '%'; });
  });
}

// Trigger if resume tab visible on load
const resumeArticle = document.querySelector('[data-page="resume"]');
if (resumeArticle) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { triggerSkillBars(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  obs.observe(resumeArticle);
}

/* ==========================================
   GITHUB REPOS
   ========================================== */
async function loadGitHubRepos() {
  const $grid = document.getElementById('github-grid');
  if (!$grid) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`);
    if (!res.ok) throw new Error();
    const repos = await res.json();
    const filtered = repos.filter(r => !r.fork).slice(0, 8);

    if (!filtered.length) {
      $grid.innerHTML = '<p class="loading-repos">No se encontraron repositorios.</p>';
      return;
    }

    $grid.innerHTML = filtered.map(r => `
      <div class="repo-card">
        <a href="${r.html_url}" target="_blank" rel="noopener" class="repo-name">${r.name}</a>
        <p class="repo-desc">${r.description || 'Sin descripción'}</p>
        <div class="repo-meta">
          ${r.language ? `<span class="repo-lang">${r.language}</span>` : ''}
          <span class="repo-stars">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${r.stargazers_count}
          </span>
        </div>
      </div>
    `).join('');
  } catch {
    $grid.innerHTML = `<p class="loading-repos">Visita <a href="https://github.com/${GITHUB_USER}" target="_blank" style="color:var(--gold)">github.com/${GITHUB_USER}</a> para ver todos los repositorios.</p>`;
  }
}

loadGitHubRepos();

/* ==========================================
   CONTACT FORM (Formspree)
   ========================================== */
const $form    = document.getElementById('contact-form');
const $note    = document.getElementById('form-note');
const $submitB = document.getElementById('submit-btn');

if ($form) {
  $form.addEventListener('submit', async e => {
    e.preventDefault();
    $submitB.disabled = true;
    $submitB.querySelector('span').textContent = 'Enviando...';
    $note.textContent = '';
    $note.className = 'form-note';

    try {
      const res = await fetch($form.action, {
        method: 'POST',
        body: new FormData($form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        $note.textContent = 'Mensaje enviado correctamente. Te responderé pronto.';
        $note.className = 'form-note success';
        $form.reset();
      } else {
        throw new Error();
      }
    } catch {
      $note.textContent = 'Hubo un error al enviar. Escríbeme a diegoalonso.araujo24@gmail.com';
      $note.className = 'form-note error';
    } finally {
      $submitB.disabled = false;
      $submitB.querySelector('span').textContent = 'Enviar mensaje';
    }
  });
}
