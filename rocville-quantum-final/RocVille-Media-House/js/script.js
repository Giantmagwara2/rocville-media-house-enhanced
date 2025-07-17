// 1. Mobile Menu with Smooth Animation <button class="citation-flag" data-index="3">
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('header nav ul');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
});

// 2. Smooth Scrolling with ScrollSpy <button class="citation-flag" data-index="5">
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', async (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    
    if (target) {
      await target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// 3. Form Validation with Real-Time Feedback <button class="citation-flag" data-index="9">
document.querySelectorAll('.contact-form form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    
    try {
      status.textContent = 'Sending...';
      status.style.color = 'var(--accent)';
      
      // Simulate API call (replace with actual endpoint)
      // await fetch('/submit', { method: 'POST', body: new FormData(form) });
      
      // Mock success
      setTimeout(() => {
        status.textContent = 'Message sent! 🎉';
        status.style.color = 'var(--success)';
        form.reset();
      }, 2000);
    } catch (error) {
      status.textContent = 'Error. Try again.';
      status.style.color = 'var(--error)';
    }
  });

  // Real-time field validation
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      if (field.validity.valid) {
        field.style.borderColor = '';
      } else {
        field.style.borderColor = 'var(--error)';
      }
    });
  });
});

// 4. Lazy Loading with Intersection Observer <button class="citation-flag" data-index="5">
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src || img.src;
      observer.unobserve(img);
    }
  });
});

lazyImages.forEach(img => observer.observe(img));

// 5. Dynamic Division Showcase <button class="citation-flag" data-index="2"><button class="citation-flag" data-index="7">
document.querySelectorAll('.division-item').forEach(item => {
  item.addEventListener('mouseover', () => {
    item.style.transform = 'scale(1.05) rotate(-2deg)';
    item.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)';
  });
  
  item.addEventListener('mouseout', () => {
    item.style.transform = 'scale(1)';
    item.style.boxShadow = '';
  });
});

// 6. Playful Cursor with Division-Specific Colors <button class="citation-flag" data-index="6">
const cursor = document.querySelector('.cursor-follower');
document.addEventListener('mousemove', (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

document.querySelectorAll('.division-item').forEach(item => {
  item.addEventListener('mouseover', () => {
    cursor.style.background = item.dataset.color || 'var(--accent)';
  });
  item.addEventListener('mouseout', () => {
    cursor.style.background = 'var(--accent)';
  });
});

// 7. Back-to-Top Button with Progress <button class="citation-flag" data-index="8">
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  backToTop.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
  backToTop.style.background = `linear-gradient(90deg, var(--accent) ${window.pageYOffset / 5}%, transparent ${window.pageYOffset / 5}%)`;
});

// 8. A/B Testing Integration <button class="citation-flag" data-index="9">
document.body.classList.add(
  Math.random() > 0.5 ? 'variant-a' : 'variant-b'
);

// 9. Dark Mode Detection <button class="citation-flag" data-index="6">
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', (e) => {
  document.body.classList.toggle('dark-mode', e.matches);
});

// Add to script.js
// Portfolio Filtering <button class="citation-flag" data-index="7">
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    // Filter portfolio items (basic example)
    const filter = button.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.style.display = filter === '*' || item.classList.contains(filter) ? 'block' : 'none';
    });
  });
});

// Add to script.js for division-based cursor colors
document.querySelectorAll('.team-member').forEach(member => {
  member.addEventListener('mouseover', () => {
    document.querySelector('.cursor-follower').style.background = member.dataset.color;
  });
  member.addEventListener('mouseout', () => {
    document.querySelector('.cursor-follower').style.background = 'var(--accent)';
  });
});

// Add to script.js for filtering
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Show/hide service items
    document.querySelectorAll('.service-item').forEach(item => {
      if (filter === '*' || item.classList.contains(filter.slice(1))) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Add to script.js
// Division-Specific Cursor Colors <button class="citation-flag" data-index="6">
document.querySelectorAll('.info-item').forEach(item => {
  item.addEventListener('mouseover', () => {
    const color = item.dataset.color;
    document.querySelector('.cursor-follower').style.background = color;
  });
  item.addEventListener('mouseout', () => {
    document.querySelector('.cursor-follower').style.background = 'var(--accent-color)';
  });
});

// Form Validation with Division Selection <button class="citation-flag" data-index="9">
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.querySelector('.form-status');
  const division = document.getElementById('division').value;

  if (!division) {
    status.textContent = 'Please select a division.';
    status.style.color = 'var(--error)';
    return;
  }

  status.textContent = 'Sending...';
  status.style.color = 'var(--accent-color)';

  try {
    // Simulate API call
    setTimeout(() => {
      status.textContent = 'Message sent! 🎉';
      status.style.color = 'var(--success)';
      document.getElementById('contactForm').reset();
    }, 2000);
  } catch (error) {
    status.textContent = 'Error. Try again.';
    status.style.color = 'var(--error)';
  }
});

// Verify AOS initialization in script.js
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true, // Prevent repeat animations <button class="citation-flag" data-index="6">
});

// Test mobile menu toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
  const menu = document.querySelector('.nav-menu ul');
  menu.style.display = menu.style.display === 'block' ? '' : 'block';
});

// Add to script.js for filtering
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    
    // Update active button state
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
      if (filter === '*' || item.classList.contains(filter.slice(1))) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Ensure filtering works for all divisions
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter service items
    document.querySelectorAll('.service-item').forEach(item => {
      item.style.display = filter === '*' || item.classList.contains(filter.slice(1)) 
        ? 'block' 
        : 'none';
    });
  });
});

// Add to script.js for division-specific cursor colors
document.querySelectorAll('.info-item').forEach(item => {
  item.addEventListener('mouseover', () => {
    document.querySelector('.cursor-follower').style.background = item.dataset.color;
  });
  item.addEventListener('mouseout', () => {
    document.querySelector('.cursor-follower').style.background = 'var(--accent-color)';
  });
});

// Form Submission with Feedback <button class="citation-flag" data-index="9">
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.querySelector('.form-status');
  const division = document.getElementById('division').value;

  if (!division) {
    status.textContent = 'Please select a division.';
    status.style.color = 'var(--error)';
    return;
  }

  status.textContent = 'Sending...';
  status.style.color = 'var(--accent-color)';
  status.style.opacity = 1;

  try {
    // Simulate API call
    setTimeout(() => {
      status.textContent = 'Message sent! 🎉';
      status.style.color = 'var(--success)';
      document.getElementById('contactForm').reset();
    }, 2000);
  } catch (error) {
    status.textContent = 'Error. Try again.';
    status.style.color = 'var(--error)';
  }
});

// Add to script.js for filtering
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    
    // Update active button state
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.style.display = filter === '*' || item.classList.contains(filter.slice(1)) 
        ? 'block' 
        : 'none';
    });
  });
});

// Add to main.js
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS <button class="citation-flag" data-index="6">
  AOS.init({ duration: 800, once: true });
  
  // Mobile Menu Toggle <button class="citation-flag" data-index="3">
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu ul');
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
  });

  // Back-to-Top Button <button class="citation-flag" data-index="9">
  const backToTop = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
    backToTop.style.opacity = window.scrollY > 500 ? 1 : 0;
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});