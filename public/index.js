// Index page script
async function loadMetadata() {
  try {
    const response = await fetch('/api/metadata');
    const data = await response.json();
    
    if (data.status && data.result) {
      const metadata = data.result;
      
      // Update page title and icon
      document.getElementById('pageTitle').textContent = `${metadata.apiTitle || metadata.creator} - Home`;
      if (metadata.favicon) {
        document.getElementById('icon').href = metadata.favicon;
      }
      
      // Update navbar and hero
      document.getElementById('navLogo').textContent = metadata.apiTitle || metadata.creator;
      document.getElementById('apiTitle').textContent = metadata.apiTitle || metadata.creator;
      
      // Update footer
      document.getElementById('footerText').textContent = `© ${new Date().getFullYear()} Powered by ${metadata.creator}`;
      document.getElementById('githubLink').href = metadata.github;
      document.getElementById('whatsappLink').href = metadata.whatsapp;
      document.getElementById('telegramLink').href = metadata.telegram;
    }
  } catch (error) {
    console.error('Failed to load metadata:', error);
  }
}

async function loadStats() {
  try {
    const response = await fetch('/api/status');
    const data = await response.json();
    
    if (data.status && data.result) {
      document.getElementById('totalRequests').textContent = data.result.reqTotal || '0';
      document.getElementById('totalEndpoints').textContent = data.result.featureTotal + '+' || '13+';
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// Theme toggle
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  });
}

// Mobile menu toggle
function initializeNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  loadMetadata();
  loadStats();
  initializeTheme();
  initializeNavbar();
});
