/**
 * Gamified Code Academy — Main JavaScript
 * Theme switching, sidebar, toasts, global utilities
 */

// ─── Theme Manager ──────────────────────────────────────────────────────────

const ThemeManager = {
  init() {
    const saved = localStorage.getItem('gca-theme') || 'dark';
    this.apply(saved);
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggle());
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gca-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// ─── Sidebar Manager ────────────────────────────────────────────────────────

const SidebarManager = {
  init() {
    const toggle = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('main-sidebar');

    toggle?.addEventListener('click', () => this.open());
    overlay?.addEventListener('click', () => this.close());

    // Mark active nav item
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href && currentPath.startsWith(href) && href !== '/') {
        item.classList.add('active');
      }
    });
  },

  open() {
    document.getElementById('main-sidebar')?.classList.add('open');
    document.getElementById('sidebar-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    document.getElementById('main-sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// ─── Toast Manager ──────────────────────────────────────────────────────────

const ToastManager = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(title, message = '', type = 'success', duration = 4000) {
    const icons = {
      xp: '⚡', success: '✅', error: '❌', warning: '⚠️',
      'level-up': '🎉', achievement: '🏆', info: '💡'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '🔔'}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;padding:4px;margin-left:8px;">✕</button>
    `;

    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), duration + 500);
  },

  xp(amount, source) {
    this.show(`+${amount} XP Earned!`, source, 'xp');
    this.floatingXP(amount);
  },

  levelUp(level) {
    this.show(`🎉 Level Up!`, `You reached Level ${level}!`, 'level-up', 6000);
  },

  achievement(name) {
    this.show(`🏆 Achievement Unlocked!`, name, 'achievement', 5000);
  },

  floatingXP(amount) {
    const el = document.createElement('div');
    el.textContent = `+${amount} XP`;
    el.style.cssText = `
      position: fixed; bottom: 100px; right: 30px; z-index: 9999;
      font-size: 24px; font-weight: 900; color: #8B85FF;
      animation: xp-pop 1.5s ease forwards; pointer-events: none;
      text-shadow: 0 0 20px rgba(108,99,255,0.8);
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }
};

// ─── XP Progress Animator ───────────────────────────────────────────────────

const XPAnimator = {
  animate(barEl, targetPct, duration = 1200) {
    if (!barEl) return;
    let start = null;
    const startWidth = parseFloat(barEl.style.width) || 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      barEl.style.width = (startWidth + (targetPct - startWidth) * eased) + '%';
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  },

  animateCounter(el, target, duration = 1200, suffix = '') {
    if (!el) return;
    const start = parseInt(el.textContent.replace(/\D/g, '')) || 0;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
};

// ─── CSRF Helper ────────────────────────────────────────────────────────────

function getCsrfToken() {
  return document.querySelector('[name=csrfmiddlewaretoken]')?.value ||
         document.cookie.split('; ').find(r => r.startsWith('csrftoken='))?.split('=')[1] || '';
}

async function postJSON(url, data) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    },
    body: JSON.stringify(data),
  });
  return resp.json();
}

async function postForm(url, formData) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'X-CSRFToken': getCsrfToken() },
    body: formData,
  });
  return resp.json();
}

// ─── Notification Bell ──────────────────────────────────────────────────────

const NotificationManager = {
  init() {
    const markAllBtn = document.getElementById('mark-all-read');
    markAllBtn?.addEventListener('click', async () => {
      await postJSON('/api/notifications/mark-all-read/', {});
      document.querySelectorAll('.notification-dot').forEach(d => d.remove());
      document.querySelectorAll('.notif-count').forEach(el => { el.textContent = '0'; el.style.display = 'none'; });
    });
  }
};

// ─── Search ─────────────────────────────────────────────────────────────────

const SearchManager = {
  init() {
    const input = document.getElementById('global-search');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = e.target.value.trim();
        if (q.length >= 2) {
          window.location.href = `/student/coding/?q=${encodeURIComponent(q)}`;
        }
      }, 500);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = e.target.value.trim();
        if (q) window.location.href = `/student/coding/?q=${encodeURIComponent(q)}`;
      }
    });
  }
};

// ─── Dropdown ────────────────────────────────────────────────────────────────

function initDropdowns() {
  document.querySelectorAll('[data-dropdown-toggle]').forEach(trigger => {
    const targetId = trigger.getAttribute('data-dropdown-toggle');
    const target = document.getElementById(targetId);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = target.classList.contains('open');
      document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('open'));
      if (!isOpen) target.classList.add('open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('open'));
  });
}

// ─── Scroll Animations ──────────────────────────────────────────────────────

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .stat-card, .achievement-card, .subject-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ─── Mini Charts (Canvas) ────────────────────────────────────────────────────

function drawMiniChart(canvasId, data, color = '#6C63FF') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  if (!data || data.length === 0) return;

  const max = Math.max(...data, 1);
  const min = 0;
  const range = max - min;
  const step = w / (data.length - 1);

  const points = data.map((val, i) => ({
    x: i * step,
    y: h - ((val - min) / range) * (h - 10) - 5,
  }));

  // Fill area
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '40');
  grad.addColorStop(1, color + '00');

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((p, i) => {
    if (i > 0) {
      const prev = points[i - 1];
      const cpx = (prev.x + p.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
    }
  });
  ctx.lineTo(points[points.length - 1].x, h);
  ctx.lineTo(points[0].x, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((p, i) => {
    if (i > 0) {
      const prev = points[i - 1];
      const cpx = (prev.x + p.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
    }
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.stroke();

  // Dots on recent points
  const lastPoint = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowBlur = 12;
  ctx.fill();
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────

function drawBarChart(canvasId, labels, data, color = '#6C63FF') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const max = Math.max(...data, 1);
  const barWidth = (w / data.length) * 0.7;
  const gap = (w / data.length) * 0.3;

  data.forEach((val, i) => {
    const barH = ((val / max) * (h - 30)) || 4;
    const x = i * (w / data.length) + gap / 2;
    const y = h - barH - 20;

    const grad = ctx.createLinearGradient(x, y, x, h);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '60');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Label
    ctx.fillStyle = '#6B6A8A';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i] || '', x + barWidth / 2, h - 4);
  });
}

// ─── Progress bar initializer ────────────────────────────────────────────────

function initProgressBars() {
  document.querySelectorAll('.progress-fill[data-pct]').forEach(el => {
    const pct = parseFloat(el.getAttribute('data-pct')) || 0;
    el.style.width = '0%';
    setTimeout(() => XPAnimator.animate(el, pct), 200);
  });
}

// ─── Counter animations ──────────────────────────────────────────────────────

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.getAttribute('data-counter')) || 0;
    el.textContent = '0';
    setTimeout(() => XPAnimator.animateCounter(el, target), 300);
  });
}

// ─── Copy to clipboard ───────────────────────────────────────────────────────

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.color = 'var(--success)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.color = '';
    }, 2000);
  });
}

// ─── Initialize all ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  SidebarManager.init();
  ToastManager.init();
  NotificationManager.init();
  SearchManager.init();
  initDropdowns();
  initScrollAnimations();
  initProgressBars();
  initCounters();

  // Expose globals
  window.GCA = {
    toast: ToastManager,
    xp: XPAnimator,
    postJSON,
    postForm,
    getCsrfToken,
    drawMiniChart,
    drawBarChart,
    copyToClipboard,
  };
});
