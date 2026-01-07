// Global state
let selectedDojo = null;

// Dojo selection and UI updates
function selectDojo(dojo) {
  selectedDojo = dojo;
  document.getElementById('dojoTitle').textContent = dojo.name;
  document.getElementById('dojoAddress').textContent = dojo.address;

  // Update selected style on list items
  document.querySelectorAll('.dojo-item-contact').forEach(item => item.classList.remove('selected'));
  const index = DOJOS.indexOf(dojo);
  document.querySelectorAll('.dojo-item-contact')[index].classList.add('selected');

  // Update active button
  document.querySelectorAll('.location-btn').forEach(btn => btn.classList.remove('active'));
  if (dojo.id === 'homudojo') {
    document.getElementById('whitefieldBtn').classList.add('active');
  } else {
    document.getElementById('silveroakBtn').classList.add('active');
  }
}

// Update schedule table in modal
function updateSchedule() {
  const tbody = document.getElementById('scheduleBody');
  tbody.innerHTML = '';
  selectedDojo.schedule.forEach(c => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td style="padding:12px">${c.className}</td>
      <td style="padding:12px">${c.day}</td>
      <td style="padding:12px">${c.time}</td>
      <td style="padding:12px"><strong>${selectedDojo.name}</strong></td>
    `;
  });
}

// Initialize event listeners and functionality
document.addEventListener('DOMContentLoaded', () => {
  // Dojo selection buttons
  document.getElementById('whitefieldBtn').addEventListener('click', () => selectDojo(DOJOS[0]));
  document.getElementById('silveroakBtn').addEventListener('click', () => selectDojo(DOJOS[1]));

  // Make dojo list items clickable
  document.querySelectorAll('.dojo-item-contact').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      selectDojo(DOJOS[index]);
    });
  });

  // Schedule modal
  document.getElementById('openSchedule').addEventListener('click', e => {
    e.preventDefault();
    updateSchedule();
    document.getElementById('scheduleModal').classList.add('active');
  });
  document.getElementById('closeSchedule').addEventListener('click', () => {
    document.getElementById('scheduleModal').classList.remove('active');
  });

  // Close modal on background click
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) m.classList.remove('active');
    });
  });

  // Preloader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 400);
  });

  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    mobileNav.setAttribute('aria-hidden', expanded);
  });

  // FAB menu toggle
  const fab = document.getElementById('fab');
  const fabMenu = document.getElementById('fabMenu');
  fab.addEventListener('click', () => {
    const expanded = fab.getAttribute('aria-expanded') === 'true';
    fab.setAttribute('aria-expanded', !expanded);
    fabMenu.classList.toggle('active', !expanded);
  });

  // Back to top button & section fade-in
  const topBtn = document.getElementById('topBtn');
  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('visible', window.scrollY > 320);
    document.querySelectorAll('section:not(#home)').forEach(sec => {
      if (sec.getBoundingClientRect().top < window.innerHeight * 0.8) {
        sec.classList.add('visible');
      }
    });
  });
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Counter animation
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el, duration = 2000) => {
    const target = +el.dataset.target;
    let current = 0;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      current = Math.floor(progress * target);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(c => animateCounter(c, 2500));
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (counters.length) {
    observer.observe(document.getElementById('stats'));
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1 && href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        if (mobileNav && hamburger) {
          mobileNav.setAttribute('aria-hidden', 'true');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Escape key to close modals/menus
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
      if (mobileNav && hamburger) {
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      if (fab && fabMenu) {
        fabMenu.classList.remove('active');
        fab.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Initial dojo selection
  selectDojo(DOJOS[0]);

  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    } else {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
});
