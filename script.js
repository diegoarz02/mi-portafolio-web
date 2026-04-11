/* ==========================================
   CONFIG
   ========================================== */
const GITHUB_USER   = 'diegoarz02';
const TYPEWRITER    = ['Data Scientist', 'ML Engineer', 'AI Developer', 'Estadístico', 'Analytics Translator'];

/* ==========================================
   SCROLL: PROGRESS + NAVBAR + BACK-TO-TOP
   ========================================== */
const $progress = document.getElementById('scroll-progress');
const $navbar   = document.getElementById('navbar');
const $backTop  = document.getElementById('back-top');

window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if ($progress) $progress.style.width = (s / h * 100) + '%';
    if ($navbar)   $navbar.classList.toggle('scrolled', s > 60);
    if ($backTop)  $backTop.classList.toggle('visible', s > 400);
    highlightNav();
}, { passive: true });

if ($backTop) $backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ==========================================
   ACTIVE NAV
   ========================================== */
function highlightNav() {
    const pos = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(sec => {
        const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (link) {
            const active = pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight;
            link.classList.toggle('active', active);
        }
    });
}

/* ==========================================
   MOBILE MENU
   ========================================== */
const $ham   = document.getElementById('hamburger');
const $links = document.getElementById('nav-links');

if ($ham && $links) {
    $ham.addEventListener('click', () => {
        $ham.classList.toggle('open');
        $links.classList.toggle('open');
    });
    $links.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => {
            $ham.classList.remove('open');
            $links.classList.remove('open');
        });
    });
}

/* ==========================================
   SCROLL REVEAL
   ========================================== */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

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
   SKILL BARS — animate on viewport entry
   ========================================== */
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.sb-fill').forEach(bar => {
            const pct = bar.dataset.pct;
            requestAnimationFrame(() => { bar.style.width = pct + '%'; });
        });
        skillObs.unobserve(entry.target);
    });
}, { threshold: 0.35 });

document.querySelectorAll('.skill-group').forEach(g => skillObs.observe(g));

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
        $submitB.textContent = 'Enviando...';
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
            $note.textContent = 'Hubo un error al enviar. Escríbeme directamente a diegoalonso.araujo24@gmail.com';
            $note.className = 'form-note error';
        } finally {
            $submitB.disabled = false;
            $submitB.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Enviar mensaje`;
        }
    });
}

/* ==========================================
   FOOTER YEAR
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const $y = document.getElementById('year');
    if ($y) $y.textContent = new Date().getFullYear();
});
