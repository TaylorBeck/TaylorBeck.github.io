document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const darkContainer = container.cloneNode(true);
  darkContainer.id = 'container-dark';
  darkContainer.classList.remove('active');
  document.body.appendChild(darkContainer);

  const modeSwitch = document.querySelectorAll('.mode-switch');
  const icons = document.querySelectorAll('.mode-switch i');

  // Function to set the mode
  function setMode(isDarkMode) {
    if (isDarkMode) {
      container.classList.remove('active');
      darkContainer.classList.add('active');
      icons.forEach(icon => icon.classList.add('bx-sun'));
    } else {
      container.classList.add('active');
      darkContainer.classList.remove('active');
      icons.forEach(icon => icon.classList.remove('bx-sun'));
    }
  }

  // Check localStorage for saved mode on page load
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  setMode(isDarkMode);

  // Update image sources for dark mode
  const darkImages = darkContainer.querySelectorAll('img');
  darkImages.forEach(img => {
    const src = img.src;
    const darkSrc = src.replace('-light.', '-dark.');
    img.src = darkSrc;
  });

  // Mode switch event listener
  modeSwitch.forEach(switchEl => {
    switchEl.addEventListener('click', () => {
      switchEl.classList.add('disabled');
      setTimeout(() => {
        switchEl.classList.remove('disabled');
      }, 1500);

      const newMode = container.classList.contains('active');
      setMode(newMode);
      localStorage.setItem('darkMode', newMode);
    });
  });

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Function to check if an element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Function to handle scroll and animate items
  function handleScroll() {
    const animateItems = document.querySelectorAll('.animate-item, .about-text, .about-image, .experience-image, .experience');
    animateItems.forEach(item => {
      if (isInViewport(item) && !item.classList.contains('animate-in')) {
        item.classList.add('animate-in');
      }
    });
  }

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  // Trigger once on load
  handleScroll();

  // Navigation drawer functionality
  function setupNavDrawer(containerElement) {
    const menuIcon = containerElement.querySelector('.menu-icon');
    const closeIcon = containerElement.querySelector('.close-icon');
    const navDrawer = containerElement.querySelector('.nav-drawer');

    menuIcon.addEventListener('click', () => {
      navDrawer.classList.add('open');
    });

    closeIcon.addEventListener('click', () => {
      navDrawer.classList.remove('open');
    });

    // Close drawer when clicking outside
    navDrawer.addEventListener('click', (e) => {
      if (e.target === navDrawer) {
        navDrawer.classList.remove('open');
      }
    });

    // Set active nav link for drawer
    const drawerNavLinks = containerElement.querySelectorAll('.drawer-nav a');
    
    drawerNavLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Setup nav drawer for both light and dark containers
  setupNavDrawer(container);
  setupNavDrawer(darkContainer);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
});
