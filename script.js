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

// Close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ─── HELPERS ───
function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Sending...' : btn.dataset.label;
}

function showSuccess(formBodyId, successId) {
  document.getElementById(formBodyId).style.display = 'none';
  document.getElementById(successId).classList.add('show');

  // Auto close after 3s and reset
  setTimeout(() => {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
    setTimeout(() => {
      const body = document.getElementById(formBodyId);
      body.style.display = '';
      document.getElementById(successId).classList.remove('show');
      body.querySelectorAll('input, textarea').forEach(i => i.value = '');
      body.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    }, 400);
  }, 2800);
}

function highlightEmpty(inputs) {
  let allFilled = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      allFilled = false;
      input.style.borderColor = 'rgba(255,80,80,0.6)';
      input.addEventListener('input', () => input.style.borderColor = '', { once: true });
    }
  });
  return allFilled;
}

// ─── QUOTE FORM SUBMIT ───
async function submitQuote() {
  const body = document.getElementById('quote-form-body');
  const inputs = body.querySelectorAll('input, textarea, select');
  if (!highlightEmpty(inputs)) return;

  const btn = body.querySelector('.btn-modal-submit');
  btn.dataset.label = btn.textContent;
  setLoading(btn, true);

  const payload = {
    firstName: body.querySelector('input[placeholder="John"]').value.trim(),
    lastName:  body.querySelector('input[placeholder="Doe"]').value.trim(),
    email:     body.querySelector('input[type="email"]').value.trim(),
    phone:     body.querySelector('input[type="tel"]').value.trim(),
    service:   body.querySelector('select').value,
    message:   body.querySelector('textarea').value.trim(),
  };

  try {
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Server error');
    showSuccess('quote-form-body', 'quote-success');
  } catch (err) {
    alert('Something went wrong. Please try again or email us directly.');
    console.error(err);
  } finally {
    setLoading(btn, false);
  }
}

// ─── CONTACT FORM SUBMIT ───
async function submitContact() {
  const body = document.getElementById('contact-form-body');
  const inputs = body.querySelectorAll('input, textarea');
  if (!highlightEmpty(inputs)) return;

  const btn = body.querySelector('.btn-modal-submit');
  btn.dataset.label = btn.textContent;
  setLoading(btn, true);

  const payload = {
    name:    body.querySelector('input[placeholder="John Doe"]').value.trim(),
    email:   body.querySelector('input[type="email"]').value.trim(),
    subject: body.querySelector('input[placeholder*="Inquiry"]').value.trim(),
    message: body.querySelector('textarea').value.trim(),
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Server error');
    showSuccess('contact-form-body', 'contact-success');
  } catch (err) {
    alert('Something went wrong. Please try again or email us directly.');
    console.error(err);
  } finally {
    setLoading(btn, false);
  }
}