/**
 * Real-Time Email OTP Registration Script
 * Gamified Code Academy
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const emailInput = document.getElementById('email');
  const fullNameInput = document.getElementById('full_name');
  const firstNameInput = document.getElementById('first_name');
  const lastNameInput = document.getElementById('last_name');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm_password');
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const resendOtpBtn = document.getElementById('resend-otp-btn');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');
  const submitBtn = document.getElementById('register-btn');
  const otpSection = document.getElementById('otp-section');
  const otpStatusMsg = document.getElementById('otp-status-message');
  const emailFeedback = document.getElementById('email-action-feedback');
  const otpInput = document.getElementById('otp-code-input');
  const sessionTokenInput = document.getElementById('session_token');
  const emailVerifiedBadge = document.getElementById('email-verified-badge');
  const countdownDisplay = document.getElementById('resend-countdown');

  let countdownInterval = null;
  let isEmailVerified = false;

  // ─── Helpers ─────────────────────────────────────────────────────────────

  function getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
  }

  function showMessage(element, text, type = 'info') {
    if (!element) return;
    element.innerHTML = text;
    element.className = `otp-message ${type} show`;
    element.style.display = 'block';
  }

  function hideMessage(element) {
    if (!element) return;
    element.style.display = 'none';
    element.className = 'otp-message';
    element.innerHTML = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getFullName() {
    if (fullNameInput && fullNameInput.value.trim()) {
      return fullNameInput.value.trim();
    }
    const fn = firstNameInput ? firstNameInput.value.trim() : '';
    const ln = lastNameInput ? lastNameInput.value.trim() : '';
    return `${fn} ${ln}`.trim();
  }

  // ─── Countdown Timer ──────────────────────────────────────────────────────

  function startCountdown(seconds = 60) {
    if (countdownInterval) clearInterval(countdownInterval);

    if (resendOtpBtn) {
      resendOtpBtn.disabled = true;
      resendOtpBtn.classList.add('disabled');
    }
    let remaining = seconds;

    const updateLabel = () => {
      if (countdownDisplay) countdownDisplay.textContent = `(${remaining}s)`;
      if (resendOtpBtn) {
        resendOtpBtn.innerHTML = `<span>🔄 Resend OTP</span> <span class="countdown-tag">${remaining}s</span>`;
      }
    };

    updateLabel();

    countdownInterval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        if (resendOtpBtn) {
          resendOtpBtn.disabled = false;
          resendOtpBtn.classList.remove('disabled');
          resendOtpBtn.innerHTML = `<span>🔄 Resend OTP</span>`;
        }
      } else {
        updateLabel();
      }
    }, 1000);
  }

  // ─── Send OTP Action ──────────────────────────────────────────────────────

  async function handleSendOtp(isResend = false) {
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const btn = isResend ? resendOtpBtn : sendOtpBtn;

    hideMessage(emailFeedback);
    hideMessage(otpStatusMsg);

    if (!email) {
      showMessage(emailFeedback, '⚠️ Please enter your email address first.', 'error');
      if (emailInput) emailInput.focus();
      return;
    }

    if (!validateEmail(email)) {
      showMessage(emailFeedback, '⚠️ Please enter a valid email address (e.g. name@example.com).', 'error');
      if (emailInput) emailInput.focus();
      return;
    }

    // Set button loading state
    const originalBtnHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Sending...`;

    try {
      const response = await fetch('/api/send-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
          email: email,
          full_name: getFullName(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success
        hideMessage(emailFeedback);
        showMessage(otpStatusMsg, `✉️ ${data.message || 'OTP sent successfully to your email.'}`, 'success');

        // Reveal OTP section
        if (otpSection) {
          otpSection.style.display = 'block';
          otpSection.classList.add('fade-in');
        }
        
        // Hide initial send button
        if (sendOtpBtn) {
          sendOtpBtn.style.display = 'none';
        }

        // Start 60s countdown
        startCountdown(data.cooldown_seconds || 60);

        // Focus OTP input
        if (otpInput) {
          otpInput.value = '';
          otpInput.focus();
        }
      } else {
        // Error from backend
        let errorMsg = data.message || 'Failed to send OTP. Please try again.';
        if (data.code === 'EMAIL_EXISTS') {
          errorMsg = `❌ ${data.message} <a href="/login/" style="color:var(--text-link);text-decoration:underline;margin-left:6px;">Log in here →</a>`;
        }

        // Display in appropriate feedback box
        if (otpSection && otpSection.style.display !== 'none') {
          showMessage(otpStatusMsg, errorMsg, 'error');
        } else {
          showMessage(emailFeedback, errorMsg, 'error');
        }

        if (data.remaining_seconds) {
          startCountdown(data.remaining_seconds);
        }
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      const networkErr = '❌ Network error while sending OTP. Please check your connection and try again.';
      if (otpSection && otpSection.style.display !== 'none') {
        showMessage(otpStatusMsg, networkErr, 'error');
      } else {
        showMessage(emailFeedback, networkErr, 'error');
      }
    } finally {
      if (!isResend && !isEmailVerified && btn) {
        btn.innerHTML = originalBtnHtml;
        btn.disabled = false;
      }
    }
  }

  // ─── Verify OTP Action ────────────────────────────────────────────────────

  async function handleVerifyOtp() {
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const otp = (otpInput ? otpInput.value : '').trim();

    if (!otp || otp.length !== 6) {
      showMessage(otpStatusMsg, '⚠️ Please enter the complete 6-digit OTP.', 'error');
      if (otpInput) otpInput.focus();
      return;
    }

    verifyOtpBtn.disabled = true;
    const originalVerifyText = verifyOtpBtn.innerHTML;
    verifyOtpBtn.innerHTML = `Verifying...`;
    hideMessage(otpStatusMsg);

    try {
      const response = await fetch('/api/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Successful Verification
        isEmailVerified = true;
        showMessage(otpStatusMsg, `<strong>${data.message || 'Email verified successfully ✓'}</strong>`, 'verified');

        // Store session token in hidden input
        if (sessionTokenInput && data.session_token) {
          sessionTokenInput.value = data.session_token;
        }

        // Lock email and OTP input
        if (emailInput) {
          emailInput.readOnly = true;
          emailInput.classList.add('is-verified');
        }
        if (otpInput) otpInput.readOnly = true;

        // Show verified badge
        if (emailVerifiedBadge) {
          emailVerifiedBadge.style.display = 'inline-flex';
        }

        // Disable OTP action buttons
        if (verifyOtpBtn) verifyOtpBtn.style.display = 'none';
        if (resendOtpBtn) resendOtpBtn.style.display = 'none';
        if (countdownInterval) clearInterval(countdownInterval);

        // Unlock registration submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-locked');
          submitBtn.classList.add('pulse-glow');
        }
      } else {
        // OTP failed / expired / wrong
        const errorMsg = data.message || 'Invalid OTP. Please try again.';
        showMessage(otpStatusMsg, `❌ ${errorMsg}`, 'error');
        if (otpInput) {
          otpInput.classList.add('is-invalid');
          otpInput.select();
        }
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      showMessage(otpStatusMsg, '❌ Network error during OTP verification. Please try again.', 'error');
    } finally {
      if (!isEmailVerified && verifyOtpBtn) {
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.innerHTML = originalVerifyText;
      }
    }
  }

  // ─── Attach Event Listeners ──────────────────────────────────────────────

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSendOtp(false);
    });
  }

  if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSendOtp(true);
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleVerifyOtp();
    });
  }

  // Auto-submit OTP verification on typing 6th digit
  if (otpInput) {
    otpInput.addEventListener('input', () => {
      otpInput.value = otpInput.value.replace(/[^0-9]/g, '').slice(0, 6);
      if (otpInput.value.length === 6) {
        handleVerifyOtp();
      }
    });

    otpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleVerifyOtp();
      }
    });
  }

  // If email changes after verification, require re-verification
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (isEmailVerified) {
        isEmailVerified = false;
        emailInput.readOnly = false;
        emailInput.classList.remove('is-verified');
        if (sessionTokenInput) sessionTokenInput.value = '';
        if (emailVerifiedBadge) emailVerifiedBadge.style.display = 'none';
        if (sendOtpBtn) sendOtpBtn.style.display = 'inline-flex';
        if (verifyOtpBtn) verifyOtpBtn.style.display = 'inline-flex';
        if (resendOtpBtn) resendOtpBtn.style.display = 'inline-flex';
        if (otpSection) otpSection.style.display = 'none';
        if (submitBtn) submitBtn.disabled = true;
        hideMessage(otpStatusMsg);
        hideMessage(emailFeedback);
      }
    });
  }

  // ─── Registration Form Submit Guard ───────────────────────────────────────

  if (form) {
    form.addEventListener('submit', (e) => {
      if (!isEmailVerified && (!sessionTokenInput || !sessionTokenInput.value)) {
        e.preventDefault();
        showMessage(emailFeedback, '⚠️ Please send and verify the OTP sent to your email before completing registration.', 'error');
        if (otpSection && otpSection.style.display === 'none') {
          handleSendOtp(false);
        } else if (otpInput) {
          otpInput.focus();
        }
        return false;
      }

      // Check passwords match
      if (passwordInput && confirmPasswordInput) {
        if (passwordInput.value !== confirmPasswordInput.value) {
          e.preventDefault();
          alert('Passwords do not match. Please re-enter your passwords.');
          confirmPasswordInput.focus();
          return false;
        }
      }
    });
  }

  // ─── Live Password Strength Meter ─────────────────────────────────────────

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      const wrap = document.getElementById('pw-strength');
      const bar = document.getElementById('pw-strength-bar');
      const label = document.getElementById('pw-strength-label');

      if (!wrap || !bar || !label) return;

      if (!val) {
        wrap.style.display = 'none';
        return;
      }

      wrap.style.display = 'block';
      let score = 0;
      if (val.length >= 8) score += 25;
      if (/[A-Z]/.test(val)) score += 25;
      if (/[0-9]/.test(val)) score += 25;
      if (/[^A-Za-z0-9]/.test(val)) score += 25;

      bar.style.width = `${score}%`;

      if (score <= 25) {
        bar.style.backgroundColor = '#ef4444';
        label.textContent = 'Weak';
        label.style.color = '#ef4444';
      } else if (score <= 50) {
        bar.style.backgroundColor = '#f59e0b';
        label.textContent = 'Fair';
        label.style.color = '#f59e0b';
      } else if (score <= 75) {
        bar.style.backgroundColor = '#3b82f6';
        label.textContent = 'Good';
        label.style.color = '#3b82f6';
      } else {
        bar.style.backgroundColor = '#10b981';
        label.textContent = 'Strong ✓';
        label.style.color = '#10b981';
      }
    });
  }
});

// ─── Global Password Visibility Toggle ──────────────────────────────────────

window.togglePwd = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '🙈';
  } else {
    input.type = 'password';
    btn.innerHTML = '👁️';
  }
};
