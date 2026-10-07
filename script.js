const RULES = [
  {
    id: "length",
    label: "At least 12 characters",
    test: (value) => value.length >= 12,
  },
  {
    id: "upper",
    label: "Contains an uppercase letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lower",
    label: "Contains a lowercase letter",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "digit",
    label: "Contains a number",
    test: (value) => /\d/.test(value),
  },
  {
    id: "special",
    label: "Contains a special character",
    test: (value) => /[^A-Za-z0-9\s]/.test(value),
  },
  {
    id: "spaces",
    label: "Contains no spaces",
    test: (value) => value.length > 0 && !/\s/.test(value),
  },
  {
    id: "common",
    label: "Is not a common password",
    test: (value) => {
      const common = new Set([
        "password",
        "password1",
        "password123",
        "123456",
        "12345678",
        "123456789",
        "qwerty",
        "qwerty123",
        "admin",
        "letmein",
        "welcome",
        "iloveyou",
        "abc123",
        "monkey",
        "dragon",
      ]);
      return value.length > 0 && !common.has(value.toLowerCase());
    },
  },
];

const form = document.getElementById("password-form");
const input = document.getElementById("password-input");
const panel = document.querySelector(".strength-panel");
const strengthValue = document.getElementById("strength-value");
const strengthLabel = document.querySelector(".strength-label");
const passedList = document.getElementById("rules-passed");
const failedList = document.getElementById("rules-failed");

const strengthMeter = document.getElementById("strength-meter");
const togglePasswordBtn = document.getElementById("toggle-password");

function renderList(element, items) {
  element.replaceChildren();
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "None";
    element.appendChild(empty);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function analyzePassword(value) {
  const passed = [];
  const failed = [];

  RULES.forEach((rule) => {
    if (rule.test(value)) {
      passed.push(rule.label);
    } else {
      failed.push(rule.label);
    }
  });

  const score = passed.length;
  const total = RULES.length;
  const percentage = (score / total) * 100;

  let rating = "Weak";
  let ratingClass = "weak";
  let meterColor = "var(--fail)";

  if (value.length === 0) {
    rating = "—";
    ratingClass = "";
    meterColor = "var(--fail)";
  } else if (score === total) {
    rating = "Super Strong";
    ratingClass = "super-strong";
    meterColor = "#10b981";
  } else if (score >= 6) {
    rating = "Strong";
    ratingClass = "strong";
    meterColor = "var(--pass)";
  } else if (score >= 4) {
    rating = "Fair";
    ratingClass = "fair";
    meterColor = "#c47a12";
  }

  strengthValue.textContent = rating;
  strengthLabel.classList.remove("weak", "fair", "strong", "super-strong");
  if (ratingClass) {
    strengthLabel.classList.add(ratingClass);
  }
  
  strengthMeter.style.width = value.length === 0 ? "0%" : `${percentage}%`;
  strengthMeter.style.backgroundColor = meterColor;

  renderList(passedList, passed);
  renderList(failedList, failed);
  
  if (value.length > 0) {
    panel.hidden = false;
  }
}

input.addEventListener("input", () => {
  analyzePassword(input.value);
});

togglePasswordBtn.addEventListener("click", () => {
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);
  
  if (type === "text") {
    togglePasswordBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  } else {
    togglePasswordBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
});


// Quiz Logic
const calcScoreBtn = document.getElementById('calc-score-btn');
const quizResult = document.getElementById('quiz-result');
const accordions = document.querySelectorAll('.accordion-item');

if (calcScoreBtn) {
  calcScoreBtn.addEventListener('click', () => {
    const q1 = document.querySelector('input[name="q1"]:checked')?.value;
    const q2 = document.querySelector('input[name="q2"]:checked')?.value;
    const q3 = document.querySelector('input[name="q3"]:checked')?.value;
    
    if (!q1 || !q2 || !q3) {
      quizResult.textContent = "Please answer all 3 questions to get your score.";
      quizResult.hidden = false;
      quizResult.style.borderLeftColor = "var(--fail)";
      return;
    }
    
    let score = 0;
    if (q1 === 'no') score++;
    if (q2 === 'yes') score++;
    if (q3 === 'yes') score++;
    
    let focusCategory = '';
    let message = '';
    
    if (q1 === 'yes') {
      focusCategory = 'password';
      message = "You should prioritize Password Security. Reusing passwords puts all your accounts at risk.";
    } else if (q2 === 'no') {
      focusCategory = 'mfa';
      message = "You should prioritize Multi-Factor Authentication. It's one of the strongest defenses against account takeover.";
    } else if (q3 === 'no') {
      focusCategory = 'device';
      message = "You should prioritize Device Security. An unlocked device exposes all your active sessions.";
    } else {
      focusCategory = 'privacy';
      message = "Great job on the basics! Now let's review your Privacy Settings.";
    }
    
    quizResult.innerHTML = `<strong>Score: ${score}/3</strong><br>${message}`;
    quizResult.hidden = false;
    quizResult.style.borderLeftColor = score === 3 ? "var(--pass)" : "var(--fail)";
    
    // Highlight and open the target accordion
    accordions.forEach(acc => {
      acc.classList.remove('highlight');
      const header = acc.querySelector('.accordion-header');
      const content = acc.querySelector('.accordion-content');
      
      if (acc.dataset.category === focusCategory) {
        acc.classList.add('highlight');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + "px";
        
        // Scroll to it smoothly
        setTimeout(() => {
          acc.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });
}

// Accordion Logic
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    const content = header.nextElementSibling;
    const accordionItem = header.parentElement;
    
    // Remove highlight when interacted with
    accordionItem.classList.remove('highlight');

    if (expanded) {
      header.setAttribute('aria-expanded', 'false');
      content.style.maxHeight = null;
    } else {
      header.setAttribute('aria-expanded', 'true');
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// Checklist Progress Logic
const habitChecks = document.querySelectorAll('.habit-check');
const globalProgressBar = document.getElementById('global-progress-bar');
const progressText = document.getElementById('progress-text');

function updateHabitProgress() {
  if (habitChecks.length === 0) return;
  const checked = document.querySelectorAll('.habit-check:checked').length;
  const percentage = Math.round((checked / habitChecks.length) * 100);
  
  if (globalProgressBar) {
    globalProgressBar.style.width = `${percentage}%`;
  }
  if (progressText) {
    progressText.textContent = `${percentage}%`;
  }
}

habitChecks.forEach(check => {
  check.addEventListener('change', updateHabitProgress);
});
// Init
updateHabitProgress();
