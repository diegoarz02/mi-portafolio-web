/* ==========================================
   CONFIG
   ========================================== */
const GITHUB_USERNAME   = 'diegoarz02';
const TYPEWRITER_WORDS  = ['Data Scientist', 'ML Engineer', 'AI Developer', 'Estadístico', 'Problem Solver'];

/* ==========================================
   PARTICLE NETWORK CANVAS
   ========================================== */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLORS = ['129,140,248', '20,184,166', '217,70,239'];
    const COUNT  = window.innerWidth < 768 ? 38 : 72;
    const MAX_D  = 130;
    let particles = [];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

    class Dot {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * canvas.width;
            this.y  = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.22;
            this.vy = (Math.random() - 0.5) * 0.22;
            this.r  = Math.random() * 1.4 + 0.3;
            this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.o  = Math.random() * 0.32 + 0.06;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.c},${this.o})`;
            ctx.fill();
        }
    }

    function init() { resize(); particles = Array.from({ length: COUNT }, () => new Dot()); }

    function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < MAX_D) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(129,140,248,${(1 - d / MAX_D) * 0.1})`;
                    ctx.lineWidth = 0.55;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(frame);
    }

    init(); frame();
    window.addEventListener('resize', init);
})();

/* ==========================================
   CUSTOM CURSOR
   ========================================== */
(function initCursor() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    document.body.style.cursor = 'none';
    let rx = 0, ry = 0, mx = 0, my = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });

    (function animRing() {
        rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a, button, .skill-tag, .project-card, .contact-btn, .tilt-card')
        .forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
        });
})();

/* ==========================================
   SCROLL: PROGRESS + NAVBAR + BACK-TO-TOP
   ========================================== */
const $scrollBar = document.getElementById('scroll-progress');
const $navbar    = document.getElementById('navbar');
const $btt       = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if ($scrollBar) $scrollBar.style.width = (s / h * 100) + '%';
    if ($navbar)    $navbar.classList.toggle('scrolled', s > 60);
    if ($btt)       $btt.classList.toggle('visible', s > 500);
    updateActiveNav();
}, { passive: true });

if ($btt) $btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ==========================================
   ACTIVE NAV ON SCROLL
   ========================================== */
function updateActiveNav() {
    const pos = window.scrollY + 130;
    document.querySelectorAll('section[id]').forEach(sec => {
        const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (link) link.classList.toggle('active', pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight);
    });
}

/* ==========================================
   MOBILE MENU
   ========================================== */
const $ham  = document.getElementById('hamburger');
const $menu = document.getElementById('nav-links');
if ($ham && $menu) {
    $ham.addEventListener('click', () => { $ham.classList.toggle('open'); $menu.classList.toggle('open'); });
    $menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { $ham.classList.remove('open'); $menu.classList.remove('open'); }));
}

/* ==========================================
   SCROLL REVEAL
   ========================================== */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObs.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-right').forEach(el => revealObs.observe(el));

/* ==========================================
   TYPEWRITER
   ========================================== */
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    let wi = 0, ci = 0, del = false;

    function tick() {
        const word = TYPEWRITER_WORDS[wi];
        el.textContent = del ? word.slice(0, --ci) : word.slice(0, ++ci);

        if (!del && ci === word.length) { setTimeout(() => { del = true; tick(); }, 1800); return; }
        if (del && ci === 0) { del = false; wi = (wi + 1) % TYPEWRITER_WORDS.length; }

        setTimeout(tick, del ? 42 : 95);
    }
    setTimeout(tick, 900);
})();

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCount(el, target) {
    let start = null;
    (function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1600, 1);
        el.textContent = Math.floor(easeOutCubic(p) * target);
        if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    })(performance.now());
}

const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('[data-target]').forEach(el => animateCount(el, +el.dataset.target));
        counterObs.unobserve(entry.target);
    });
}, { threshold: 0.5 });

const $metrics = document.querySelector('.hero-metrics');
if ($metrics) counterObs.observe($metrics);

/* ==========================================
   3D CARD TILT
   ========================================== */
function initTilt() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width  - 0.5;
            const y = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transition = 'box-shadow 0.3s, border-color 0.3s';
            card.style.transform  = `perspective(800px) rotateX(${y * -9}deg) rotateY(${x * 9}deg) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s, border-color 0.3s';
            card.style.transform  = '';
        });
    });
}
initTilt();

/* ==========================================
   MAGNETIC BUTTONS
   ========================================== */
(function initMagnetic() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.hero-actions .btn-primary, .hero-actions .btn-secondary, .contact-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.style.transition = 'none');
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
            const y = ((e.clientY - r.top)  / r.height - 0.5) * 16;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.4s ease, background 0.3s, box-shadow 0.3s, color 0.3s';
            btn.style.transform  = '';
        });
    });
})();

/* ==========================================
   GITHUB API
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    fetchProfile();
    fetchRepos();
});

async function fetchProfile() {
    const grid = document.getElementById('github-stats');
    const fallback = `
        <div class="stat-card"><h3>Top 10%</h3><p>Décimo Superior · UNMSM</p></div>
        <div class="stat-card"><h3>8+</h3><p>Repos Open Source</p></div>
        <div class="stat-card"><h3>PRONABEC</h3><p>Becario del Estado</p></div>
        <div class="stat-card"><h3>BCP</h3><p>Practicante IA · 2026</p></div>`;
    try {
        const res  = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        grid.innerHTML = `
            <div class="stat-card"><h3>Top 10%</h3><p>Décimo Superior · UNMSM</p></div>
            <div class="stat-card"><h3>${data.public_repos}</h3><p>Repos Open Source</p></div>
            <div class="stat-card"><h3>PRONABEC</h3><p>Becario del Estado</p></div>
            <div class="stat-card"><h3>BCP</h3><p>Practicante IA · 2026</p></div>`;
    } catch {
        grid.innerHTML = fallback;
    }
}

async function fetchRepos() {
    const loader    = document.getElementById('loader');
    const container = document.getElementById('projects-container');
    try {
        const res   = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=9`);
        if (!res.ok) throw new Error();
        const repos = await res.json();
        loader.style.display = 'none';
        if (!repos.length) { container.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-muted)">No hay repositorios públicos aún.</p>'; return; }

        container.innerHTML = repos.map(buildCard).join('');

        // Stagger reveal for injected cards
        container.querySelectorAll('.project-card').forEach((card, i) => {
            card.dataset.delay = i * 55;
            card.classList.add('reveal');
            revealObs.observe(card);
        });

        initTilt();
    } catch {
        loader.style.display = 'none';
        container.innerHTML = `<div style="text-align:center;grid-column:1/-1;color:var(--text-muted)">
            <p style="margin-bottom:1rem">Error al conectar con GitHub API.</p>
            <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener" class="btn-primary">Visitar mi GitHub</a></div>`;
    }
}

function buildCard(repo) {
    const lang    = repo.language || 'Markdown';
    let langClass = '';
    if (lang.includes('Jupyter'))    langClass = 'lang-Jupyter';
    else if (lang.includes('Python')) langClass = 'lang-Python';
    else if (lang.includes('R'))      langClass = 'lang-R';
    else if (lang.includes('Java'))   langClass = 'lang-JavaScript';

    const desc = repo.description || 'Proyecto de Ciencia de Datos y Análisis alojado en GitHub.';
    const name = repo.name.replace(/[-_]/g, ' ');

    const iconStar   = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    const iconFork   = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M6 8v2a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V8"/></svg>`;
    const iconFolder = `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
    const iconLink   = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

    return `<div class="project-card tilt-card">
        <div class="project-header">
            <div class="project-icon">${iconFolder}</div>
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="link-btn">GitHub ${iconLink}</a>
        </div>
        <h3 class="project-title">${name}</h3>
        <p class="project-description">${desc}</p>
        <div class="project-footer">
            <div class="project-language"><span class="language-dot ${langClass}"></span><span>${lang}</span></div>
            <div class="project-stats">
                ${repo.stargazers_count > 0 ? `<span>${iconStar} ${repo.stargazers_count}</span>` : ''}
                ${repo.forks_count      > 0 ? `<span>${iconFork} ${repo.forks_count}</span>`      : ''}
            </div>
        </div>
    </div>`;
}
