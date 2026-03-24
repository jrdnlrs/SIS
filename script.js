// ─── SERVICE TAB SWITCHING ───
function switchTab(idx) {
  document.querySelectorAll('.svc-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === idx);
  });
  document.querySelectorAll('.svc-panel').forEach((panel, i) => {
    panel.classList.toggle('active', i === idx);
  });
}

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── MODAL SYSTEM ───
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal when clicking outside the modal box
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ─── FORM SUBMIT (mock — swap for real backend later) ───
function submitForm(formBodyId, successId) {
  const body = document.getElementById(formBodyId);
  const success = document.getElementById(successId);
  if (!body || !success) return;

  // Basic validation — check all required inputs are filled
  const inputs = body.querySelectorAll('input, textarea, select');
  let allFilled = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      allFilled = false;
      input.style.borderColor = 'rgba(255,80,80,0.6)';
      input.addEventListener('input', () => input.style.borderColor = '', { once: true });
    }
  });

  if (!allFilled) return;

  // Show success state
  body.style.display = 'none';
  success.classList.add('show');

  // Auto-close after 3s and reset
  setTimeout(() => {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
    setTimeout(() => {
      body.style.display = '';
      success.classList.remove('show');
      body.querySelectorAll('input, textarea').forEach(i => i.value = '');
      body.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    }, 400);
  }, 2800);
}