/**
 * Gamified Code Academy — Quiz JavaScript
 * Timer, question navigation, answer selection, submit
 */

class QuizEngine {
  constructor(options) {
    this.quizId = options.quizId;
    this.attemptId = options.attemptId;
    this.questions = options.questions;
    this.timeLimit = options.timeLimit; // seconds
    this.submitUrl = options.submitUrl;
    this.resultUrl = options.resultUrl;

    this.currentIndex = 0;
    this.answers = {};
    this.timer = null;
    this.timeRemaining = this.timeLimit;
    this.submitted = false;

    this.init();
  }

  init() {
    this.renderQuestion(0);
    this.startTimer();
    this.bindEvents();
    this.updateProgress();
  }

  bindEvents() {
    document.getElementById('prev-btn')?.addEventListener('click', () => this.navigate(-1));
    document.getElementById('next-btn')?.addEventListener('click', () => this.navigate(1));
    document.getElementById('submit-quiz-btn')?.addEventListener('click', () => this.confirmSubmit());

    // Question navigator dots
    document.querySelectorAll('.q-nav-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => this.goTo(i));
    });
  }

  renderQuestion(index) {
    const q = this.questions[index];
    if (!q) return;

    this.currentIndex = index;
    const container = document.getElementById('question-container');

    let optionsHTML = '';
    if (q.type === 'TF') {
      optionsHTML = this.renderOption(q, 'True', 'True');
      optionsHTML += this.renderOption(q, 'False', 'False');
    } else {
      q.options.forEach(([key, val]) => {
        optionsHTML += this.renderOption(q, key, val);
      });
    }

    const codeSnippet = q.code_snippet ? `
      <div class="code-snippet-box">
        <div class="code-snippet-header">
          <span style="color:var(--text-muted);font-size:12px;">Code</span>
        </div>
        <pre class="code-snippet-pre"><code>${this.escapeHtml(q.code_snippet)}</code></pre>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="question-header">
        <span class="question-badge">Question ${index + 1} of ${this.questions.length}</span>
        <span class="question-points">${q.points} pts</span>
      </div>
      <h2 class="question-text">${q.text}</h2>
      ${codeSnippet}
      <div class="options-grid" id="options-grid-${q.id}">
        ${optionsHTML}
      </div>
    `;

    // Re-bind option clicks
    container.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => this.selectAnswer(q.id, opt.dataset.value, opt));
    });

    // Restore saved answer
    if (this.answers[q.id]) {
      this.highlightSelected(q.id, this.answers[q.id]);
    }

    this.updateNavButtons();
    this.updateNavDots();
  }

  renderOption(q, key, val) {
    return `
      <div class="quiz-option ${this.answers[q.id] === key ? 'selected' : ''}"
           data-value="${key}" data-qid="${q.id}">
        <span class="option-key">${key}</span>
        <span class="option-text">${this.escapeHtml(val)}</span>
      </div>
    `;
  }

  selectAnswer(qId, value, optEl) {
    this.answers[qId] = value;

    // Visual feedback
    const grid = document.getElementById(`options-grid-${qId}`);
    grid?.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    optEl.classList.add('selected');

    // Update nav dot to answered
    const dot = document.querySelector(`.q-nav-dot[data-index="${this.currentIndex}"]`);
    if (dot) dot.classList.add('answered');

    // Auto-advance after short delay
    setTimeout(() => {
      if (this.currentIndex < this.questions.length - 1) {
        this.navigate(1);
      }
    }, 400);
  }

  highlightSelected(qId, value) {
    const grid = document.getElementById(`options-grid-${qId}`);
    grid?.querySelectorAll('.quiz-option').forEach(o => {
      if (o.dataset.value === value) o.classList.add('selected');
    });
  }

  navigate(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.questions.length) {
      this.renderQuestion(newIndex);
    }
  }

  goTo(index) {
    this.renderQuestion(index);
  }

  updateNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-quiz-btn');

    if (prevBtn) prevBtn.disabled = this.currentIndex === 0;
    if (nextBtn) nextBtn.style.display = this.currentIndex < this.questions.length - 1 ? 'flex' : 'none';
    if (submitBtn) submitBtn.style.display = this.currentIndex === this.questions.length - 1 ? 'flex' : 'none';
  }

  updateNavDots() {
    document.querySelectorAll('.q-nav-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }

  updateProgress() {
    const answered = Object.keys(this.answers).length;
    const pct = (answered / this.questions.length) * 100;
    const fill = document.getElementById('quiz-progress-fill');
    const label = document.getElementById('quiz-progress-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = `${answered} / ${this.questions.length} answered`;
  }

  startTimer() {
    const timerEl = document.getElementById('quiz-timer');
    if (!timerEl || !this.timeLimit) return;

    this.timer = setInterval(() => {
      this.timeRemaining--;

      const mins = Math.floor(this.timeRemaining / 60);
      const secs = this.timeRemaining % 60;
      timerEl.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

      if (this.timeRemaining <= 30) {
        timerEl.classList.add('timer-warning');
      }
      if (this.timeRemaining <= 0) {
        clearInterval(this.timer);
        GCA.toast.show('⏰ Time is up!', 'Auto-submitting your quiz...', 'warning');
        setTimeout(() => this.submit(), 1500);
      }
    }, 1000);
  }

  confirmSubmit() {
    const unanswered = this.questions.length - Object.keys(this.answers).length;
    if (unanswered > 0) {
      if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    }
    this.submit();
  }

  async submit() {
    if (this.submitted) return;
    this.submitted = true;

    clearInterval(this.timer);

    const submitBtn = document.getElementById('submit-quiz-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> Submitting...';
    }

    // Build FormData
    const formData = new FormData();
    formData.append('csrfmiddlewaretoken', GCA.getCsrfToken());
    formData.append('attempt_id', this.attemptId);
    this.questions.forEach(q => {
      formData.append(`answer_${q.id}`, this.answers[q.id] || '');
    });

    try {
      const resp = await fetch(this.submitUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();

      if (data.success) {
        // Show XP animation
        GCA.toast.xp(data.xp_earned, `Quiz completed! Score: ${data.percentage}%`);
        if (data.leveled_up) GCA.toast.levelUp(data.new_level);

        // Show results inline
        this.showResults(data);
      } else {
        GCA.toast.show('Error', data.error || 'Submission failed', 'error');
      }
    } catch (err) {
      GCA.toast.show('Network Error', 'Could not submit quiz. Try again.', 'error');
    }
  }

  showResults(data) {
    const container = document.getElementById('quiz-body');
    const pct = data.percentage;
    const scoreColor = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';

    container.innerHTML = `
      <div class="quiz-result-panel animate-fade-in-up">
        <div class="result-score-ring" style="--score-color: ${scoreColor}">
          <div class="result-score-inner">
            <div class="result-pct" style="color:${scoreColor}">${pct}%</div>
            <div class="result-label">${data.passed ? '🎉 Passed!' : '😅 Try Again'}</div>
          </div>
        </div>

        <div class="result-stats">
          <div class="result-stat">
            <span class="result-stat-icon">✅</span>
            <span class="result-stat-val">${data.answers?.filter(a => a.is_correct).length || 0}</span>
            <span class="result-stat-label">Correct</span>
          </div>
          <div class="result-stat">
            <span class="result-stat-icon">❌</span>
            <span class="result-stat-val">${data.answers?.filter(a => !a.is_correct).length || 0}</span>
            <span class="result-stat-label">Wrong</span>
          </div>
          <div class="result-stat">
            <span class="result-stat-icon">⚡</span>
            <span class="result-stat-val">${data.xp_earned}</span>
            <span class="result-stat-label">XP Earned</span>
          </div>
        </div>

        <div class="result-answers">
          <h3 style="margin-bottom:16px;font-size:16px;font-weight:700;">Answer Review</h3>
          ${(data.answers || []).map((a, i) => `
            <div class="answer-review ${a.is_correct ? 'correct' : 'wrong'}">
              <div class="answer-review-header">
                <span class="answer-icon">${a.is_correct ? '✅' : '❌'}</span>
                <span>Question ${i + 1}</span>
                <span class="ml-auto" style="font-size:12px;color:var(--text-muted);">
                  Your answer: <strong>${a.selected || '(no answer)'}</strong> |
                  Correct: <strong style="color:var(--success)">${a.correct}</strong>
                </span>
              </div>
              ${a.explanation ? `<div class="answer-explanation">${a.explanation}</div>` : ''}
            </div>
          `).join('')}
        </div>

        <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap;">
          <a href="/student/quiz/" class="btn btn-secondary">Back to Quizzes</a>
          <a href="/student/dashboard/" class="btn btn-primary">Dashboard</a>
        </div>
      </div>
    `;
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
