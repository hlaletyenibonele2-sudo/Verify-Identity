// ---------- Loading screen ----------
window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  setTimeout(() => loading.classList.add('hidden'), 600);
});

// ---------- Elements ----------
const form = document.getElementById('verificationForm');
const documentCard = document.getElementById('documentCard');
const documentPage = document.getElementById('documentPage');
const birthdayPage = document.getElementById('birthdayPage');
const verifyBtn = document.getElementById('verifyBtn');
const statusText = document.getElementById('statusText');
const music = document.getElementById('music');
const musicToggle = document.getElementById('musicToggle');
const progress = document.getElementById('progress');
const cursorHeart = document.getElementById('cursor-heart');
const floatingHearts = document.getElementById('floatingHearts');
const confettiHost = document.getElementById('confetti');

// ---------- Verification flow ----------
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const checked = document.getElementById('confirmCheck').checked;

  if (!name || !surname || !checked) {
    documentCard.classList.remove('shake');
    void documentCard.offsetWidth; // restart animation
    documentCard.classList.add('shake');
    return;
  }

  verifyBtn.disabled = true;
  verifyBtn.innerHTML = '<span class="spinner"></span><span class="btn-label">Verifying...</span>';
  statusText.textContent = 'STATUS: VERIFYING...';

  setTimeout(() => {
    documentPage.classList.remove('active');
    documentPage.style.display = 'none';
    birthdayPage.classList.remove('hidden');

   const NICKNAME = "Lathitha we bhuda"; // change this whenever
  document.getElementById('herName').textContent = NICKNAME;
  document.getElementById('finalName').textContent = NICKNAME;

    // start music on this click (user gesture, so autoplay restrictions won't block it)
    music.volume = 0.5;
    music.play().catch(() => {});
    musicToggle.classList.add('playing');

    startFloatingHearts();
    initScrollReveal();
    initTypewriter();
  }, 1100);
});

// ---------- Smooth scroll to a section ----------
function goTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
window.goTo = goTo;

// ---------- Reveal memories 1-5, reasons, and finale ONLY on explicit click ----------
// Until this runs, #lockedContent is display:none — nothing in it can be scrolled
// into or peeked at, even partially.
function openMemories() {
  const locked = document.getElementById('lockedContent');
  locked.classList.add('unlocked');

  // Give the browser two frames to actually paint the opacity:0 starting
  // state before we scroll to it — otherwise the fade can get skipped
  // entirely and content just snaps into view.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      goTo('memory1');
    });
  });
}
window.openMemories = openMemories;

// ---------- Replay ----------
function replayExperience() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelectorAll('.reveal').forEach(el => el.classList.remove('visible'));
  setTimeout(() => {
    document.querySelectorAll('.hero.reveal, .memory.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  }, 500);
}
window.replayExperience = replayExperience;

// ---------- Music toggle ----------
musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play().catch(() => {});
    musicToggle.classList.add('playing');
  } else {
    music.pause();
    musicToggle.classList.remove('playing');
  }
});

// ---------- Scroll progress + reveal-on-scroll ----------
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // fire confetti once when the finale section appears
        if (entry.target.id === 'finale') burstConfetti();
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(el => observer.observe(el));

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  });
}

// ---------- Cursor heart (desktop only) ----------
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursorHeart.style.left = e.clientX + 'px';
    cursorHeart.style.top = e.clientY + 'px';
    cursorHeart.style.opacity = 0.7;
    clearTimeout(window._heartTimeout);
    window._heartTimeout = setTimeout(() => { cursorHeart.style.opacity = 0; }, 400);
  });
}

// ---------- Floating hearts background ----------
function startFloatingHearts() {
  setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '♥';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    heart.style.fontSize = (12 + Math.random() * 14) + 'px';
    heart.style.animationDuration = (6 + Math.random() * 4) + 's';
    floatingHearts.appendChild(heart);
    setTimeout(() => heart.remove(), 10000);
  }, 1200);
}

// ---------- Confetti burst ----------
function burstConfetti() {
  const colors = ['#e0557a', '#ffb6c1', '#ffd966', '#8fd19e', '#a3c6f7'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confettiHost.appendChild(piece);
    setTimeout(() => piece.remove(), 4200);
  }
}

// ---------- Typewriter for the finale message ----------
function initTypewriter() {
  const el = document.getElementById('typewriter');
  const message = "Every scroll, every photo, every word here was for you. I hope it made you smile even for a second. Oh and by the way ndisabafuna abantwana ababini from you so make sure uqhubeka uziphatha kakuhle";
  let i = 0;

  const finale = document.getElementById('finale');
  const typeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && i === 0) {
        const type = () => {
          if (i < message.length) {
            el.textContent += message.charAt(i);
            i++;
            setTimeout(type, 28);
          }
        };
        type();
        typeObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  typeObserver.observe(finale);
}
