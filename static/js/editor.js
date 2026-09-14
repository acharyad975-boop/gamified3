/**
 * Gamified Code Academy — Code Editor JavaScript
 * Custom editor with syntax highlighting hints, run/submit, AI features
 */

class CodeEditor {
  constructor(options) {
    this.textarea = document.getElementById(options.textareaId || 'code-editor');
    this.langSelect = document.getElementById(options.langSelectId || 'lang-selector');
    this.runBtn = document.getElementById(options.runBtnId || 'run-btn');
    this.submitBtn = document.getElementById(options.submitBtnId || 'submit-btn');
    this.outputPanel = document.getElementById(options.outputPanelId || 'output-panel');
    this.analyzeBtn = document.getElementById(options.analyzeBtnId || 'analyze-btn');
    this.explainBtn = document.getElementById(options.explainBtnId || 'explain-btn');
    this.optimizeBtn = document.getElementById(options.optimizeBtnId || 'optimize-btn');

    this.runUrl = options.runUrl;
    this.submitUrl = options.submitUrl;
    this.challengeSlug = options.challengeSlug;

    this.init();
  }

  init() {
    this.setupTabIndent();
    this.setupLineNumbers();
    this.setupLangChange();
    this.bindButtons();
  }

  setupTabIndent() {
    if (!this.textarea) return;
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const val = this.textarea.value;
        this.textarea.value = val.substring(0, start) + '    ' + val.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
      }

      // Auto-close brackets
      const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
      if (pairs[e.key]) {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const val = this.textarea.value;
        const close = pairs[e.key];
        this.textarea.value = val.substring(0, start) + e.key + close + val.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
      }
    });
  }

  setupLineNumbers() {
    const lineNums = document.getElementById('line-numbers');
    if (!lineNums || !this.textarea) return;

    const update = () => {
      const lines = this.textarea.value.split('\n').length;
      lineNums.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('\n');
    };

    this.textarea.addEventListener('input', update);
    this.textarea.addEventListener('scroll', () => {
      lineNums.scrollTop = this.textarea.scrollTop;
    });
    update();
  }

  setupLangChange() {
    this.langSelect?.addEventListener('change', () => {
      const lang = this.langSelect.value;
      const starterCodes = window.GCA_STARTER_CODES || {};
      if (starterCodes[lang] && !this.textarea.value.trim()) {
        this.textarea.value = starterCodes[lang];
      }
    });
  }

  bindButtons() {
    this.runBtn?.addEventListener('click', () => this.runCode());
    this.submitBtn?.addEventListener('click', () => this.submitCode());
    this.analyzeBtn?.addEventListener('click', () => this.analyzeCode());
    this.explainBtn?.addEventListener('click', () => this.explainCode());
    this.optimizeBtn?.addEventListener('click', () => this.optimizeCode());
  }

  getCode() { return this.textarea?.value || ''; }
  getLang() { return this.langSelect?.value || 'python'; }

  async runCode() {
    const code = this.getCode();
    if (!code.trim()) {
      GCA.toast.show('Empty Code', 'Write some code first!', 'warning');
      return;
    }

    const customInput = document.getElementById('custom-input')?.value || '';
    this.setOutput('⏳ Running...', 'running');
    this.runBtn.disabled = true;

    try {
      const data = await GCA.postJSON(this.runUrl, {
        code,
        language: this.getLang(),
        custom_input: customInput,
      });

      if (data.error === 'TIME_LIMIT_EXCEEDED') {
        this.setOutput('⏰ Time Limit Exceeded\nYour code took too long to run.', 'error');
      } else if (data.stderr) {
        this.setOutput('❌ Error:\n' + data.stderr, 'error');
      } else {
        this.setOutput('✅ Output (' + data.runtime_ms + 'ms):\n' + (data.stdout || '(no output)'), 'success');
      }
    } catch (e) {
      this.setOutput('❌ Network error. Try again.', 'error');
    } finally {
      this.runBtn.disabled = false;
    }
  }

  async submitCode() {
    const code = this.getCode();
    if (!code.trim()) {
      GCA.toast.show('Empty Code', 'Write some code first!', 'warning');
      return;
    }

    this.setOutput('⏳ Submitting and running all test cases...', 'running');
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '<div class="spinner spinner-sm"></div> Submitting...';

    try {
      const data = await GCA.postJSON(this.submitUrl, {
        code,
        language: this.getLang(),
      });

      const statusIcons = {
        ACCEPTED: '✅', WRONG_ANSWER: '❌', TLE: '⏰',
        RUNTIME_ERROR: '💥', COMPILATION_ERROR: '🔧', INTERNAL_ERROR: '⚠️',
      };

      const icon = statusIcons[data.status] || '❓';
      const statusColor = data.status === 'ACCEPTED' ? 'var(--success)' : 'var(--danger)';

      let outputText = `${icon} Status: ${data.status.replace(/_/g, ' ')}\n`;
      outputText += `Tests Passed: ${data.passed_tests} / ${data.total_tests}\n`;
      if (data.status === 'ACCEPTED') {
        outputText += `\n🎉 Challenge solved! XP has been awarded.`;
      }

      this.setOutput(outputText, data.status === 'ACCEPTED' ? 'success' : 'error');

      // Show submission result card
      this.showSubmissionResult(data);

      if (data.status === 'ACCEPTED') {
        GCA.toast.xp(0, 'Challenge solved! Check your XP!');
      }

    } catch (e) {
      this.setOutput('❌ Submission failed. Try again.', 'error');
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = '🚀 Submit';
    }
  }

  showSubmissionResult(data) {
    const panel = document.getElementById('submission-result-panel');
    if (!panel) return;

    const isAccepted = data.status === 'ACCEPTED';
    panel.style.display = 'block';
    panel.className = `submission-result-panel ${isAccepted ? 'accepted' : 'rejected'}`;
    panel.innerHTML = `
      <div class="submission-status">
        <span class="status-icon">${isAccepted ? '✅' : '❌'}</span>
        <div>
          <div style="font-size:18px;font-weight:800;color:${isAccepted ? 'var(--success)' : 'var(--danger)'}">
            ${data.status.replace(/_/g, ' ')}
          </div>
          <div style="font-size:13px;color:var(--text-muted);">
            ${data.passed_tests} / ${data.total_tests} tests passed
          </div>
        </div>
        ${isAccepted ? `
          <div class="xp-badge ml-auto">⚡ XP Earned!</div>
        ` : ''}
      </div>
      ${data.submission_id ? `
        <a href="/student/submission/${data.submission_id}/" class="btn btn-secondary btn-sm mt-12">
          View Details & AI Analysis →
        </a>
      ` : ''}
    `;
  }

  setOutput(text, type = 'normal') {
    if (!this.outputPanel) return;
    const colors = {
      success: 'var(--success)',
      error: 'var(--danger)',
      running: 'var(--warning)',
      normal: 'var(--text-secondary)',
    };
    this.outputPanel.style.color = colors[type] || colors.normal;
    this.outputPanel.textContent = text;
  }

  async analyzeCode() {
    const submissionId = document.getElementById('submission-id')?.value;
    if (!submissionId) {
      GCA.toast.show('Submit First', 'Submit your code to get AI analysis!', 'warning');
      return;
    }

    this.analyzeBtn.disabled = true;
    this.analyzeBtn.innerHTML = '<div class="spinner spinner-sm"></div> Analyzing...';

    try {
      const data = await fetch(`/api/ai/analyze/${submissionId}/`).then(r => r.json());
      if (data.success) this.showAnalysis(data);
    } catch (e) {
      GCA.toast.show('Analysis failed', 'Try again later.', 'error');
    } finally {
      this.analyzeBtn.disabled = false;
      this.analyzeBtn.innerHTML = '🤖 AI Analyze';
    }
  }

  showAnalysis(data) {
    const panel = document.getElementById('ai-panel');
    if (!panel) return;

    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="ai-panel-header">
        <h3>🤖 AI Code Analysis</h3>
        <div class="total-score" style="
          font-size: 32px; font-weight: 900;
          background: var(--gradient-primary);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        ">${data.total_score}<span style="font-size:16px;opacity:0.6;">/100</span></div>
      </div>

      <div class="score-breakdown">
        ${this.scoreRow('Correctness', data.correctness_score, 40)}
        ${this.scoreRow('Code Quality', data.quality_score, 20)}
        ${this.scoreRow('Readability', data.readability_score, 15)}
        ${this.scoreRow('Efficiency', data.efficiency_score, 15)}
        ${this.scoreRow('Best Practices', data.best_practices_score, 10)}
      </div>

      <div class="complexity-row">
        <div class="complexity-badge">
          <span>⏱️ Time: <strong>${data.time_complexity}</strong></span>
        </div>
        <div class="complexity-badge">
          <span>💾 Space: <strong>${data.space_complexity}</strong></span>
        </div>
      </div>

      ${data.feedback ? `
        <div class="ai-feedback">
          <h4>📝 Feedback</h4>
          <p>${data.feedback}</p>
        </div>
      ` : ''}

      ${data.suggestions ? `
        <div class="ai-suggestions">
          <h4>💡 Suggestions</h4>
          <div style="white-space:pre-line;font-size:13px;color:var(--text-secondary);line-height:1.6;">${data.suggestions}</div>
        </div>
      ` : ''}
    `;

    // Animate score bars
    panel.querySelectorAll('.score-fill[data-pct]').forEach(el => {
      const pct = el.getAttribute('data-pct');
      el.style.width = '0%';
      setTimeout(() => { el.style.width = pct + '%'; }, 100);
    });
  }

  scoreRow(label, score, max) {
    const pct = Math.round((score / max) * 100);
    const color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
    return `
      <div class="score-row">
        <span class="score-label">${label}</span>
        <div class="score-bar">
          <div class="score-fill" data-pct="${pct}" style="background:${color};height:6px;border-radius:3px;transition:width 0.8s ease;"></div>
        </div>
        <span class="score-value" style="color:${color}">${score}/${max}</span>
      </div>
    `;
  }

  async explainCode() {
    const code = this.getCode();
    if (!code.trim()) return;

    this.explainBtn.disabled = true;
    this.explainBtn.innerHTML = '<div class="spinner spinner-sm"></div>';

    try {
      const data = await GCA.postJSON('/api/ai/explain/', {
        code, language: this.getLang()
      });

      if (data.success) {
        this.showExplanation(data.explanation);
      }
    } catch (e) {
      GCA.toast.show('Failed', 'Explanation unavailable.', 'error');
    } finally {
      this.explainBtn.disabled = false;
      this.explainBtn.innerHTML = '📖 Explain';
    }
  }

  showExplanation(explanation) {
    const panel = document.getElementById('ai-panel');
    if (!panel) return;
    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="ai-panel-header">
        <h3>📖 Code Explanation</h3>
        <button onclick="document.getElementById('ai-panel').style.display='none'" class="btn btn-secondary btn-sm">Close</button>
      </div>
      <div class="explanation-content" style="white-space:pre-line;font-size:13px;line-height:1.8;color:var(--text-secondary);">
        ${explanation}
      </div>
    `;
  }

  async optimizeCode() {
    const code = this.getCode();
    if (!code.trim()) return;

    this.optimizeBtn.disabled = true;
    this.optimizeBtn.innerHTML = '<div class="spinner spinner-sm"></div>';

    try {
      const data = await GCA.postJSON('/api/ai/optimize/', {
        code, language: this.getLang()
      });

      if (data.success) {
        this.showOptimization(data);
      }
    } catch (e) {
      GCA.toast.show('Failed', 'Optimization unavailable.', 'error');
    } finally {
      this.optimizeBtn.disabled = false;
      this.optimizeBtn.innerHTML = '⚡ Optimize';
    }
  }

  showOptimization(data) {
    const panel = document.getElementById('ai-panel');
    if (!panel) return;
    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="ai-panel-header">
        <h3>⚡ Code Optimization</h3>
      </div>
      <div class="complexity-row" style="margin-bottom:16px;">
        <div class="complexity-badge">Before: <strong>${data.original_complexity}</strong></div>
        <span style="color:var(--text-muted)">→</span>
        <div class="complexity-badge" style="border-color:var(--success);color:var(--success)">After: <strong>${data.optimized_complexity}</strong></div>
      </div>
      <div style="margin-bottom:16px;">
        <h4 style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--text-secondary);">💡 Suggestions</h4>
        ${data.suggestions.map(s => `<div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;">• ${s}</div>`).join('')}
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h4 style="font-size:13px;font-weight:700;color:var(--text-secondary);">🔧 Optimized Code</h4>
          <button onclick="document.getElementById('code-editor').value = \`${data.optimized_code.replace(/`/g, '\\`')}\`;GCA.toast.show('Applied!','Optimized code applied to editor.','success')"
            class="btn btn-success btn-sm">Apply Code</button>
        </div>
        <pre style="background:var(--bg-code);border-radius:8px;padding:14px;font-size:12px;overflow-x:auto;border:1px solid var(--border);">${data.optimized_code}</pre>
      </div>
    `;
  }
}
