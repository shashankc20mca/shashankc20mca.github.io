// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

function closeMenu() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = 'Menu';
}

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// Highlight the section you're reading in the menu
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(section => observer.observe(section));
}

// Replay the pipeline animation
const pipeline = document.querySelector('.pipeline');
const replay = document.querySelector('.pipeline-replay');
replay.addEventListener('click', () => {
  pipeline.classList.remove('is-running');
  void pipeline.offsetWidth; // forces the browser to restart the animation
  pipeline.classList.add('is-running');
});

// Copy email to clipboard
const copyBtn = document.querySelector('.copy-btn');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyBtn.textContent = 'Email copied';
  } catch {
    copyBtn.textContent = copyBtn.dataset.email;
  }
  setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 2000);
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();



// Enquiry form (sends submissions to your email through Web3Forms)
const enquiryForm = document.getElementById('enquiry-form');

if (enquiryForm) {
  const submitBtn = enquiryForm.querySelector('.submit-btn');
  const errorBox = document.getElementById('form-error');
  const successBox = document.getElementById('form-success');
  const successText = document.getElementById('success-text');
  const messageBox = document.getElementById('message');
  const charCount = document.getElementById('char-count');

  messageBox.addEventListener('input', () => {
    charCount.textContent = messageBox.value.length;
  });

  enquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const data = Object.fromEntries(new FormData(enquiryForm));

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      const firstName = data.name.trim().split(' ')[0];
      successText.textContent =
        `Thank you, ${firstName}. I'll review your message and get back to you at ${data.email} within 1–2 business days.`;

      enquiryForm.reset();
      charCount.textContent = '0';
      enquiryForm.hidden = true;
      successBox.hidden = false;
      successBox.focus();
    } catch (error) {
      errorBox.textContent =
        "Your enquiry couldn't be sent. Please try again, or email me directly at shashank20mca@gmail.com.";
      errorBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send enquiry';
    }
  });

  document.getElementById('send-another').addEventListener('click', () => {
    successBox.hidden = true;
    enquiryForm.hidden = false;
    document.getElementById('name').focus();
  });
}