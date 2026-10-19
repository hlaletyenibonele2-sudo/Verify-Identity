
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

// ---------- AUTHORIZED RECIPIENT ----------
// Change these two values to her exact name and surname.
const CORRECT_NAME = "Lathitha";
const CORRECT_SURNAME = "Sapo";

// Name comparison ignores capitalization and extra spaces.
function normalizeName(value) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

// ---------- Verification flow ----------
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Prevent repeated submissions while verification is running.
  if (verifyBtn.disabled) return;

  const name = document.getElementById('name').value;
  const surname = document.getElementById('surname').value;
  const checked = document.getElementById('confirmCheck').checked;

  // Require all fields.
  if (!name.trim() || !surname.trim() || !checked) {
    documentCard.classList.remove('shake');
    void documentCard.offsetWidth;
    documentCard.classList.add('shake');

    statusText.textContent = !checked
      ? 'ERROR: PLEASE CONFIRM RECIPIENT STATUS'
      : 'ERROR: COMPLETE ALL REQUIRED FIELDS';

    return;
  }

  // Check BOTH first name and surname before granting access.
  const isAuthorized =
    normalizeName(name) === normalizeName(CORRECT_NAME) &&
    normalizeName(surname) === normalizeName(CORRECT_SURNAME);

  if (!isAuthorized) {
    statusText.textContent = 'ACCESS DENIED: IDENTITY MISMATCH';

    documentCard.classList.remove('shake');
    void documentCard.offsetWidth;
    documentCard.classList.add('shake');

    // Clear the incorrect details and keep the birthday page hidden.
    document.getElementById('name').value = '';
    document.getElementById('surname').value = '';

    alert(
      'IDENTITY VERIFICATION FAILED.\n\n' +
      'Access to this document has been denied.'
    );

    return;
  }

  // Only the correct name and surname reach this point.
  verifyBtn.disabled = true;
  verifyBtn.innerHTML =
    '<span class="spinner"></span>' +
    '<span class="btn-label">Verifying...</span>';

  statusText.textContent = 'STATUS: VERIFYING...';

  setTimeout(() => {
    statusText.textContent = 'STATUS: VERIFIED';

    documentPage.classList.remove('active');
    documentPage.style.display = 'none';
    birthdayPage.classList.remove('hidden');

    // Personalize the birthday headings.
    // Change this nickname if you want a different display name.
    const NICKNAME = 'Lathitha we bhuda';

    document.getElementById('herName').textContent = NICKNAME;
    document.getElementById('finalName').textContent = NICKNAME;

    // Start music after successful verification.
    music.volume = 0.5;
    music.play()
      .then(() => musicToggle.classList.add('playing'))
      .catch(() => {
        // She can still start the music using the Music button.
        musicToggle.classList.remove('playing');
      });

    startFloatingHearts();
    initScrollReveal();
    initTypewriter();
  }, 1100);
});

// ---------- Smooth scroll to a section ----------
function goTo(id) {
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth'
  });
}
window.goTo = goTo;

// ---------- Reveal memories only on explicit click ----------
function openMemories() {
  const locked = document.getElementById('lockedContent');
  locked.classList.add('unlocked');

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

  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
  });

  setTimeout(() => {
    document.querySelectorAll('.hero.reveal, .memory.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 500);
}
window.replayExperience = replayExperience;

// ---------- Music toggle ----------
musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play()
      .then(() => musicToggle.classList.add('playing'))
      .catch(() => {});
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

        if (entry.target.id === 'finale') {
          burstConfetti();
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px'
  });

  revealEls.forEach(el => observer.observe(el));

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = docHeight > 0
      ? (scrollTop / docHeight) * 100
      : 0;

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

    window._heartTimeout = setTimeout(() => {
      cursorHeart.style.opacity = 0;
    }, 400);
  });
}

// ---------- Floating hearts background ----------
let heartsInterval = null;

function startFloatingHearts() {
  // Avoid creating multiple background intervals.
  if (heartsInterval !== null) return;

  heartsInterval = setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '♥';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.setProperty(
      '--drift',
      (Math.random() * 60 - 30) + 'px'
    );
    heart.style.fontSize = (12 + Math.random() * 14) + 'px';
    heart.style.animationDuration = (6 + Math.random() * 4) + 's';

    floatingHearts.appendChild(heart);

    setTimeout(() => heart.remove(), 10000);
  }, 1200);
}

// ---------- Confetti burst ----------
function burstConfetti() {
  const colors = [
    '#e0557a',
    '#ffb6c1',
    '#ffd966',
    '#8fd19e',
    '#a3c6f7'
  ];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.borderRadius =
      Math.random() > 0.5 ? '50%' : '2px';

    confettiHost.appendChild(piece);

    setTimeout(() => piece.remove(), 4200);
  }
}

// ---------- Typewriter for the finale message ----------
function initTypewriter() {
  const el = document.getElementById('typewriter');

  const message =
    "Every scroll, every photo, every word here was for you. " +
    "I hope it made you smile even for a second. " +
    "It's your special day!!!!!";

  let i = 0;
  let started = false;

  const finale = document.getElementById('finale');

  const typeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;

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


