// Analytics helper functions
function trackEvent(eventName, parameters = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }
}

function trackResumeDownload() {
  trackEvent('resume_download', {
    event_category: 'recruitment',
    event_label: 'resume_pdf',
    value: 1
  });
}

function trackSocialClick(platform) {
  trackEvent('social_click', {
    event_category: 'recruitment',
    event_label: platform,
    value: 1
  });
}

function trackPortfolioClick(projectName) {
  trackEvent('portfolio_click', {
    event_category: 'engagement',
    event_label: projectName,
    value: 1
  });
}

function trackPageEngagement(pageName) {
  trackEvent('page_engagement', {
    event_category: 'engagement',
    event_label: pageName,
    value: 1
  });
}

function trackBlogShare(platform, postTitle) {
  trackEvent('blog_share', {
    event_category: 'engagement',
    event_label: `${platform}_${postTitle}`,
    value: 1
  });
}

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
    const srcset = img.srcset;
    
    // Update main src
    const darkSrc = src.replace('-light-', '-dark-');
    img.src = darkSrc;
    
    // Update srcset if it exists
    if (srcset) {
      const darkSrcset = srcset.replace(/-light-/g, '-dark-');
      img.srcset = darkSrcset;
    }
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
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Element is considered in viewport if any part of it is visible
    return (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= windowHeight &&
      rect.left <= windowWidth
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
  // Trigger once on load with a small delay to ensure DOM is fully rendered
  setTimeout(handleScroll, 100);
  
  // Also trigger when window is fully loaded
  window.addEventListener('load', () => {
    setTimeout(handleScroll, 50);
  });

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

  // Track page engagement after user has been on page for 10 seconds
  setTimeout(() => {
    const pageName = document.title.split(' - ')[0] || 'Home';
    trackPageEngagement(pageName);
  }, 10000);

  // Track resume download clicks
  const resumeButtons = document.querySelectorAll('.resume-btn, a[download]');
  resumeButtons.forEach(button => {
    button.addEventListener('click', () => {
      trackResumeDownload();
    });
  });

  // Track social media clicks
  const socialLinks = document.querySelectorAll('.social a');
  socialLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      let platform = 'unknown';
      
      if (href.includes('github.com')) platform = 'github';
      else if (href.includes('linkedin.com')) platform = 'linkedin';
      else if (href.includes('stackoverflow.com')) platform = 'stackoverflow';
      else if (href.includes('twitter.com') || href.includes('x.com')) platform = 'twitter';
      
      trackSocialClick(platform);
    });
  });

  // Track portfolio project clicks
  const portfolioLinks = document.querySelectorAll('.portfolio-link, .portfolio-item a');
  portfolioLinks.forEach(link => {
    link.addEventListener('click', () => {
      const projectName = link.querySelector('h3')?.textContent || 'unknown_project';
      trackPortfolioClick(projectName);
    });
  });

  // Track navigation clicks
  const navLinks = document.querySelectorAll('.navbar a, .drawer-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const pageName = link.textContent.trim();
      trackEvent('navigation_click', {
        event_category: 'navigation',
        event_label: pageName.toLowerCase(),
        value: 1
      });
    });
  });

  // Track dark mode usage
  modeSwitch.forEach(switchEl => {
    const originalClickHandler = switchEl.onclick;
    switchEl.addEventListener('click', () => {
      const isDarkMode = !container.classList.contains('active');
      trackEvent('theme_switch', {
        event_category: 'engagement',
        event_label: isDarkMode ? 'dark' : 'light',
        value: 1
      });
    });
  });
});

