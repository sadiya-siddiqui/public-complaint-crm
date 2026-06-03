/* ════════════════════════════════════════════
   P-CRM script.js — Voice, Submit, Track, UI
   ════════════════════════════════════════════ */

const API = "http://localhost:5000/api/complaints";

/* ── Particle Canvas ───────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let pts = [];

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

  for (let i = 0; i < 70; i++) pts.push({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: Math.random() * 1.8 + 0.4,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    o: Math.random() * 0.4 + 0.1
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = isDark() ? '56,189,248' : '3,105,161';
    pts.forEach((a, i) => {
      pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${color},${0.12 * (1 - d / 130)})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
      });
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${a.o})`;
      ctx.fill();
      a.x += a.dx; a.y += a.dy;
      if (a.x < 0 || a.x > canvas.width) a.dx *= -1;
      if (a.y < 0 || a.y > canvas.height) a.dy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Navbar scroll ─────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', scrollY > 60);
});

/* ── Mobile menu ───────────────────────────── */
function toggleMenu() {
  document.getElementById('navLinks')?.classList.toggle('show');
}
document.addEventListener('click', e => {
  const nav = document.getElementById('navLinks');
  const toggle = document.getElementById('menuToggle');
  if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('show');
  }
});

/* ── Dark / Light Theme ────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('pcrm-theme') || 'dark';
  applyTheme(saved);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('pcrm-theme', next);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-icon').forEach(el => {
    el.textContent = theme === 'dark' ? '🌙' : '☀️';
  });
}

/* ── Smooth scroll ─────────────────────────── */
function smoothScroll(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ── Counter animation ─────────────────────── */
(function initCounters() {
  const cards = document.querySelectorAll('.counter-val[data-target]');
  if (!cards.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      let val = 0;
      const step = target / 80;
      const t = setInterval(() => {
        val = Math.min(val + step, target);
        el.textContent = Math.floor(val).toLocaleString();
        if (val >= target) clearInterval(t);
      }, 18);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  cards.forEach(c => obs.observe(c));
})();

/* ── Scroll reveal ─────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.prob-card, .step-card, .perk, .counter-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    obs.observe(el);
  });
})();

/* ── Pre-fill complaint from problem cards ─── */
function fillComplaint(text) {
  const desc = document.getElementById('description');
  if (desc) {
    desc.value = text;
    smoothScroll('complaintFormSection');
    setTimeout(() => desc.focus(), 600);
  }
}

/* ════════════════════════════════════════════
   VOICE RECOGNITION
   ════════════════════════════════════════════ */
let recognition = null;
let isRecording = false;

function toggleVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    setVoiceStatus('⚠️ Voice recognition not supported in this browser. Try Chrome!', 'warn');
    return;
  }

  if (isRecording) {
    stopVoice();
  } else {
    startVoice();
  }
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'hi-IN'; // Hindi + English fallback
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.maxAlternatives = 1;

  const desc = document.getElementById('description');
  const wave = document.getElementById('voiceWave');
  const btn = document.getElementById('voiceBtn');
  const label = document.getElementById('voiceBtnLabel');
  let interimText = '';
  const baseText = desc.value;

  recognition.onstart = () => {
    isRecording = true;
    wave.classList.add('active');
    btn.classList.add('recording');
    label.textContent = 'Stop';
    setVoiceStatus('🎙️ Listening… speak your complaint clearly.', 'ok');
  };

  recognition.onresult = (e) => {
    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) final += t;
      else interim += t;
    }
    if (final) interimText += final;
    desc.value = (baseText ? baseText + ' ' : '') + interimText + interim;
  };

  recognition.onerror = (e) => {
    const msgs = {
      'not-allowed': '❌ Microphone access denied. Please allow mic permissions.',
      'network': '❌ Network error. Check your connection.',
      'no-speech': '⚠️ No speech detected. Try again.',
    };
    setVoiceStatus(msgs[e.error] || '❌ Error: ' + e.error, 'warn');
    stopVoice();
  };

  recognition.onend = () => {
    if (isRecording) {
      // auto-restart if still supposed to be recording
      try { recognition.start(); } catch(e) { stopVoice(); }
    }
  };

  try { recognition.start(); } catch(e) { setVoiceStatus('❌ Could not start microphone.', 'warn'); }
}

function stopVoice() {
  isRecording = false;
  if (recognition) { try { recognition.stop(); } catch(e){} recognition = null; }
  const wave = document.getElementById('voiceWave');
  const btn = document.getElementById('voiceBtn');
  const label = document.getElementById('voiceBtnLabel');
  if (wave) wave.classList.remove('active');
  if (btn) btn.classList.remove('recording');
  if (label) label.textContent = 'Speak';
  setVoiceStatus('✅ Voice input captured! Review and submit.', 'ok');
  setTimeout(() => setVoiceStatus('', ''), 4000);
}

function setVoiceStatus(msg, type) {
  const el = document.getElementById('voiceStatus');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'warn' ? 'var(--danger)' : 'var(--accent3)';
}

/* ════════════════════════════════════════════
   COMPLAINT FORM SUBMIT
   ════════════════════════════════════════════ */
const form = document.getElementById('complaintForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (isRecording) stopVoice();

    const label = document.getElementById('submitLabel');
    const loader = document.getElementById('submitLoader');
    label.textContent = 'Submitting…';
    loader.classList.remove('hidden');

    const data = {
      name: document.getElementById('name').value.trim(),
      mobile: document.getElementById('mobile').value.trim(),
      area: document.getElementById('area').value.trim(),
      description: document.getElementById('description').value.trim(),
    };

    let trackingId;
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      trackingId = result.trackingId;
    } catch {
      trackingId = 'PCRM' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
    }

    label.textContent = 'Submit Complaint';
    loader.classList.add('hidden');
    form.classList.add('hidden');
    const box = document.getElementById('successBox');
    document.getElementById('trackingIdDisplay').textContent = trackingId;
    box.classList.remove('hidden');
  });
}

function copyTrackingId() {
  const id = document.getElementById('trackingIdDisplay')?.textContent;
  if (id) {
    navigator.clipboard.writeText(id).catch(() => {});
    const btn = document.querySelector('.copy-id-btn span');
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 2500); }
  }
}

function resetForm() {
  document.getElementById('complaintForm')?.classList.remove('hidden');
  document.getElementById('successBox')?.classList.add('hidden');
  document.getElementById('complaintForm')?.reset();
  setVoiceStatus('', '');
}

/* ════════════════════════════════════════════
   TRACK COMPLAINT
   ════════════════════════════════════════════ */
async function trackComplaint() {
  const id = document.getElementById('trackInput')?.value.trim();
  const result = document.getElementById('trackResult');
  if (!result) return;

  if (!id) {
    result.innerHTML = '⚠️ Please enter a tracking ID.';
    result.style.borderColor = 'var(--warn)';
    result.classList.remove('hidden');
    return;
  }

  result.innerHTML = '<span style="color:var(--text3)">🔍 Searching…</span>';
  result.classList.remove('hidden');

  try {
    const res = await fetch(API);
    const complaints = await res.json();
    const found = complaints.find(c => c.trackingId === id);
    if (found) {
      const icon = found.status === 'Resolved' ? '✅' : '⏳';
      const col = found.status === 'Resolved' ? 'var(--accent3)' : 'var(--warn)';
      result.innerHTML = `
        ${icon} <strong style="color:${col}">${found.status}</strong>
        &nbsp;|&nbsp; <span style="color:var(--text2)">Name: ${found.name}</span>
        &nbsp;|&nbsp; <span style="color:var(--text2)">Area: ${found.area}</span>
      `;
      result.style.borderColor = col;
    } else {
      result.innerHTML = '❌ No complaint found with this ID. Please check and try again.';
      result.style.borderColor = 'var(--danger)';
    }
  } catch {
    result.innerHTML = '⚠️ Could not connect to server. Check your backend.';
    result.style.borderColor = 'var(--warn)';
  }
}

// Enter key on track input
document.getElementById('trackInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') trackComplaint();
});
