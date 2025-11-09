// js/scripts.js
// Enhanced site behavior: year, smooth scroll, contact form, chat drawer, lazy-loading, accessibility
// Replace fake network calls with your real backend fetch()/webhook as needed.

document.addEventListener('DOMContentLoaded', () => {
  // --- Populate copyright year ---
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Utility: smooth scroll to selector and focus for accessibility ---
  function smoothScrollTo(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // allow keyboard focus after scroll
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    // remove tabindex after a short delay to keep DOM clean
    setTimeout(() => target.removeAttribute('tabindex'), 2000);
  }

  // --- Smooth-scroll for anchor links (nav) ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      ev.preventDefault();
      smoothScrollTo(href);
    });
  });

  // --- Hero buttons ---
  const trialBtn = document.getElementById('btn-trial');
  const coursesBtn = document.getElementById('btn-courses');

  if (trialBtn) {
    trialBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      smoothScrollTo('#contact');
      setTimeout(() => {
        const first = document.querySelector('#contact-form [name="name"]');
        if (first) first.focus();
      }, 600);
    });
  }

  if (coursesBtn) {
    coursesBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      smoothScrollTo('#courses');
    });
  }

  // --- When a course-card button is clicked, preselect course and open contact ---
  document.addEventListener('click', (ev) => {
    const el = ev.target;
    if (!el) return;
    if (el.matches('.course-card .btn')) {
      ev.preventDefault();
      // try read course title
      const card = el.closest('.course-card');
      const courseTitle = card?.querySelector('h4')?.textContent?.trim() || '';
      smoothScrollTo('#contact');
      setTimeout(() => {
        const select = document.querySelector('#contact-form select[name="course"]');
        if (select && courseTitle) {
          // attempt to match an option by substring (case-insensitive)
          const lower = courseTitle.toLowerCase();
          let matched = false;
          Array.from(select.options).forEach(opt => {
            if (!matched && opt.textContent.toLowerCase().includes(lower.split('–')[0].trim())) {
              select.value = opt.value || opt.textContent;
              matched = true;
            }
          });
        }
        document.querySelector('#contact-form [name="name"]')?.focus();
      }, 600);
    }
  });

  // --- Contact form handling (client-side) ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const submitBtn = contactForm.querySelector('[type="submit"]');
      if (!submitBtn) return;

      const name = (contactForm.elements['name']?.value || '').trim();
      const phone = (contactForm.elements['phone']?.value || '').trim();
      const email = (contactForm.elements['email']?.value || '').trim();

      if (!name || !phone || !email) {
        showFormMessage('Please fill required fields.', 'error');
        return;
      }

      // simple phone digits check
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 7) {
        showFormMessage('Please enter a valid phone number.', 'error');
        return;
      }

      // disable submit during "send"
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';

      try {
        // -------------------------
        // Replace this block with a real POST to your backend/webhook.
        // Example:
        // await fetch('https://your-endpoint.example/submit', {
        //   method: 'POST',
        //   body: new FormData(contactForm)
        // });
        // -------------------------
        await new Promise(r => setTimeout(r, 900)); // fake network delay

        contactForm.reset();
        showFormMessage('Thanks — your request has been sent. We will contact you soon!', 'success');
      } catch (err) {
        console.error('Submit error', err);
        showFormMessage('Something went wrong — please try again later.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // ephemeral form message UI
  function showFormMessage(text, status = 'info') {
    let el = document.querySelector('.form-message');
    if (!el) {
      el = document.createElement('div');
      el.className = 'form-message';
      const container = document.querySelector('#contact .card') || document.body;
      container.appendChild(el);
    }
    el.textContent = text;
    el.dataset.status = status;
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => {
      el.textContent = '';
      delete el.dataset.status;
    }, 6000);
  }

  // --- Chat drawer (simple UI) ---
  const chatBtnEl = document.getElementById('chat-btn');
  if (chatBtnEl) {
    const drawer = document.createElement('aside');
    drawer.className = 'chat-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <header class="chat-header">
        <strong>Chat with us</strong>
        <button class="chat-close" aria-label="Close chat">×</button>
      </header>
      <div class="chat-body">
        <p class="muted small">Send a quick message and we'll call you back.</p>
        <form id="chat-form">
          <input name="chat-name" placeholder="Your name" />
          <input name="chat-phone" placeholder="Phone number" />
          <textarea name="chat-msg" placeholder="Message" rows="3"></textarea>
          <button type="submit" class="btn btn-primary full">Send</button>
        </form>
      </div>
    `;
    document.body.appendChild(drawer);

    const openDrawer = () => {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.querySelector('input')?.focus();
    };
    const closeDrawer = () => {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      chatBtnEl.focus();
    };

    chatBtnEl.addEventListener('click', openDrawer);
    drawer.querySelector('.chat-close')?.addEventListener('click', closeDrawer);

    // basic chat form fake submit
    drawer.addEventListener('submit', (ev) => {
      if (ev.target && ev.target.id === 'chat-form') {
        ev.preventDefault();
        const btn = drawer.querySelector('[type="submit"]');
        btn.disabled = true;
        const prev = btn.textContent;
        btn.textContent = 'Sending…';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = prev;
          drawer.querySelector('#chat-form').reset();
          alert('Thanks — we will contact you soon.');
          closeDrawer();
        }, 800);
      }
    });
  }

  // --- Lazy-load gallery images & iframe ---
  const galleryImgs = document.querySelectorAll('.gallery img');
  if ('loading' in HTMLImageElement.prototype) {
    galleryImgs.forEach(img => img.setAttribute('loading', 'lazy'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src || img.getAttribute('data-src') || img.src;
          if (src && img.src !== src) img.src = src;
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    galleryImgs.forEach(img => {
      if (!img.dataset.src) img.dataset.src = img.src;
      img.src = '';
      io.observe(img);
    });
  }

  // lazy-load iframes (prefer native)
  document.querySelectorAll('iframe').forEach(iframe => {
    if (!iframe.getAttribute('loading')) iframe.setAttribute('loading', 'lazy');
  });

  // --- Accessibility polish: keyboard activation for course buttons ---
  document.querySelectorAll('.course-card .btn').forEach(b => {
    b.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        b.click();
      }
    });
  });
});
