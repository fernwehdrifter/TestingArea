// scripts.js - keep site logic here

// Insert current year into footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Wire up hero buttons
  const trialBtn = document.getElementById('btn-trial');
  const coursesBtn = document.getElementById('btn-courses');
  const contactForm = document.getElementById('contact-form');
  const chatBtn = document.getElementById('chat-btn');

  if (trialBtn) {
    trialBtn.addEventListener('click', () => {
      const el = document.getElementById('contact-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (coursesBtn) {
    coursesBtn.addEventListener('click', () => {
      const el = document.getElementById('courses');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Demo action — replace with real backend integration
      alert('Form submitted (demo) – connect to backend');
      // Optionally clear the form:
      contactForm.reset();
    });
  }

  if (chatBtn) {
    chatBtn.addEventListener('click', openChat);
  }
});

// chat placeholder - replace with actual provider init
function openChat() {
  alert('Chat placeholder – connect a chat provider (Tidio / Crisp / Intercom) or your AI bot here.');
}
