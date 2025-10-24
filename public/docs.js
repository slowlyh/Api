// Global variables
let currentEndpoint = "";
let settings = {};
let allEndpoints = [];
let expandedCategories = new Set();

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

async function initializeApp() {
  // Hide main content initially
  document.querySelector('.main-content').style.display = 'none';
  document.querySelector('.footer').style.display = 'none';
  
  try {
    // Load settings
    await loadSettings();
    
    // Initialize components
    initializeNavbar();
    initializeThemeToggle();
    initializeSearch();
    initializeModalListeners();
    initializeSmoothScroll();
    
    // Show content after loading
    setTimeout(() => {
      hideLoadingScreen();
    }, 1500);
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    hideLoadingScreen();
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.style.opacity = '0';
  
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    document.querySelector('.main-content').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
  }, 500);
}

async function loadSettings() {
  try {
    // Load metadata from API
    const metadataResponse = await fetch("/api/metadata");
    const metadataData = await metadataResponse.json();
    const metadata = metadataData.result;
    
    // Load endpoints from API
    const endpointsResponse = await fetch("/api/endpoints");
    const endpointsData = await endpointsResponse.json();
    
    // Merge into settings object for compatibility
    settings = {
      creator: metadata.creator,
      whatsapp: metadata.whatsapp,
      github: metadata.github,
      youtube: metadata.youtube,
      favicon: metadata.favicon,
      apititle: metadata.apiTitle,
      endpoints: endpointsData.result
    };
    
    // Set favicon
    if (settings.favicon) {
      document.getElementById("icon").href = settings.favicon;
    }
    
    // Update page content
    document.getElementById("pageTitle").textContent = `${settings.apititle} - Documentation`;
    document.getElementById("apiTitle").textContent = settings.apititle;
    document.getElementById("navLogo").textContent = settings.apititle;
    document.getElementById("footerText").textContent = `© ${new Date().getFullYear()} Powered by ${settings.creator}`;
    
    // Update social links
    document.getElementById("githubLink").href = settings.github;
    document.getElementById("whatsappLink").href = settings.whatsapp;
    document.getElementById("telegramLink").href = settings.youtube;
    
    // Process endpoints for search
    processEndpoints();
    
    // Render API documentation
    renderAPIDocumentation();
    
  } catch (error) {
    console.error('Failed to load settings:', error);
    // Fallback to direct JSON files if API fails
    try {
      const metadata = await fetch("/metadata.json").then(res => res.json());
      const endpoints = await fetch("/endpoints.json").then(res => res.json());
      settings = {
        ...metadata,
        endpoints: endpoints
      };
      // Retry rendering
      processEndpoints();
      renderAPIDocumentation();
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
  }
}

function processEndpoints() {
  allEndpoints = [];
  
  if (!settings.endpoints) return;
  
  Object.keys(settings.endpoints).forEach(category => {
    settings.endpoints[category].forEach(api => {
      allEndpoints.push({
        ...api,
        category: category,
        searchText: `${api.name} ${api.desc || ''} ${api.path} ${category}`.toLowerCase()
      });
    });
  });
}

function initializeNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
  
  // Close mobile menu when clicking on links
  navMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      navMenu.classList.remove('active');
      const icon = navToggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    }
  });
}

function initializeThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
  
  function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (query) {
      searchClear.style.display = 'block';
      filterEndpoints(query);
    } else {
      searchClear.style.display = 'none';
      renderAPIDocumentation();
    }
  });
  
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    renderAPIDocumentation();
    searchInput.focus();
  });
}

function filterEndpoints(query) {
  const filteredEndpoints = allEndpoints.filter(endpoint => 
    endpoint.searchText.includes(query.toLowerCase())
  );
  
  if (filteredEndpoints.length === 0) {
    document.getElementById('apiContent').innerHTML = '';
    document.getElementById('noResults').classList.remove('d-none');
  } else {
    document.getElementById('noResults').classList.add('d-none');
    renderFilteredEndpoints(filteredEndpoints);
  }
}

function renderFilteredEndpoints(endpoints) {
  const apiContent = document.getElementById('apiContent');
  apiContent.innerHTML = '';
  
  // Group by category
  const groupedEndpoints = {};
  endpoints.forEach(endpoint => {
    if (!groupedEndpoints[endpoint.category]) {
      groupedEndpoints[endpoint.category] = [];
    }
    groupedEndpoints[endpoint.category].push(endpoint);
  });
  
  // Render each category
  Object.keys(groupedEndpoints).forEach(category => {
    const categorySection = createCategorySection(category, groupedEndpoints[category]);
    apiContent.appendChild(categorySection);
  });
}

function renderAPIDocumentation() {
  const apiContent = document.getElementById('apiContent');
  document.getElementById('noResults').classList.add('d-none');
  
  if (!settings.endpoints) return;
  
  apiContent.innerHTML = '';
  
  Object.keys(settings.endpoints).forEach(category => {
    const categorySection = createCategorySection(category, settings.endpoints[category]);
    apiContent.appendChild(categorySection);
  });
}

function createCategorySection(category, endpoints) {
  const section = document.createElement('div');
  section.className = 'category-section';
  
  const categoryId = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
  const isExpanded = expandedCategories.has(category);
  
  section.innerHTML = `
    <div class="category-header" data-category="${category}">
      <h2 class="category-title">${category}</h2>
      <button class="category-toggle">
        <i class="fas fa-chevron-${isExpanded ? 'up' : 'down'}"></i>
      </button>
    </div>
    <div class="category-content ${isExpanded ? 'expanded' : ''}" id="${categoryId}">
      <div class="endpoints-list"></div>
    </div>
  `;
  
  const endpointsList = section.querySelector('.endpoints-list');
  
  endpoints.forEach((api, index) => {
    const endpointCard = createEndpointCard(api, index);
    endpointsList.appendChild(endpointCard);
  });
  
  // Add toggle functionality
  const categoryHeader = section.querySelector('.category-header');
  const categoryContent = section.querySelector('.category-content');
  const toggleBtn = section.querySelector('.category-toggle');
  const toggleIcon = toggleBtn.querySelector('i');
  
  categoryHeader.addEventListener('click', () => {
    const isCurrentlyExpanded = categoryContent.classList.contains('expanded');
    
    if (isCurrentlyExpanded) {
      categoryContent.classList.remove('expanded');
      toggleIcon.classList.remove('fa-chevron-up');
      toggleIcon.classList.add('fa-chevron-down');
      expandedCategories.delete(category);
    } else {
      categoryContent.classList.add('expanded');
      toggleIcon.classList.remove('fa-chevron-down');
      toggleIcon.classList.add('fa-chevron-up');
      expandedCategories.add(category);
    }
  });
  
  return section;
}

function createEndpointCard(api, index) {
  const card = document.createElement('div');
  card.className = 'endpoint-card';
  card.style.animationDelay = `${index * 0.1}s`;
  
  // Determine method class
  const method = (api.methods || 'GET').toUpperCase();
  const methodClass = `method-${method.toLowerCase()}`;
  
  card.innerHTML = `
    <div class="method-badge ${methodClass}">${method}</div>
    <div class="endpoint-info">
      <div class="endpoint-path">${api.path}</div>
      <div class="endpoint-description">${api.desc || 'No description available'}</div>
    </div>
    <div class="endpoint-actions">
      <button class="action-btn try-api-btn" 
              data-endpoint="${api.path}" 
              data-name="${api.name}" 
              data-desc="${api.desc || ''}"
              title="Try API">
        <i class="fas fa-play"></i>
      </button>
      <button class="action-btn copy-endpoint-btn" 
              data-endpoint="${api.path}"
              title="Copy URL">
        <i class="fas fa-link"></i>
      </button>
    </div>
  `;
  
  // Add event listeners
  const tryBtn = card.querySelector('.try-api-btn');
  const copyBtn = card.querySelector('.copy-endpoint-btn');
  
  tryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openAPIModal(api.path, api.name, api.desc || '');
  });
  
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const fullURL = window.location.origin + api.path;
    copyToClipboard(fullURL);
    
    const icon = copyBtn.querySelector('i');
    icon.classList.remove('fa-link');
    icon.classList.add('fa-check');
    setTimeout(() => {
      icon.classList.remove('fa-check');
      icon.classList.add('fa-link');
    }, 2000);
  });
  
  // Make entire card clickable
  card.addEventListener('click', () => {
    openAPIModal(api.path, api.name, api.desc || '');
  });
  
  return card;
}

function openAPIModal(endpoint, name, desc) {
  const modal = document.getElementById('apiResponseModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const endpointUrl = document.getElementById('endpointUrl');
  const paramForm = document.getElementById('paramForm');
  const executeBtn = document.getElementById('executeBtn');
  const responseContainer = document.getElementById('responseContainer');
  const loadingSpinner = document.getElementById('loadingSpinner');
  
  // Reset modal state completely
  currentEndpoint = endpoint;
  modalTitle.textContent = name;
  modalSubtitle.textContent = desc;
  endpointUrl.textContent = window.location.origin + endpoint;
  
  // Clear and reset form
  paramForm.innerHTML = '';
  paramForm.style.display = 'block';
  
  // Reset buttons and containers
  executeBtn.style.display = 'none';
  responseContainer.classList.add('d-none');
  loadingSpinner.style.display = 'none';
  
  // Clear response content
  document.getElementById('responseContent').innerHTML = '';
  
  // Check if endpoint has parameters
  if (endpoint.includes('?')) {
    const queryParams = endpoint.split('?')[1].split('&');
    const paramNames = [];
    
    queryParams.forEach(param => {
      const paramName = param.split('=')[0];
      if (paramName && !paramNames.includes(paramName)) {
        paramNames.push(paramName);
        
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        formGroup.innerHTML = `
          <label class="form-label" for="${paramName}">${paramName}</label>
          <input type="text"
                 class="form-input"
                 id="${paramName}"
                 name="${paramName}"
                 placeholder="Enter value for ${paramName}"
                 required />
        `;
        paramForm.appendChild(formGroup);
      }
    });
    
    executeBtn.style.display = 'flex';
  } else {
    // No parameters, execute immediately
    executeAPI(endpoint);
  }
  
  modal.classList.add('active');
}

function initializeModalListeners() {
  // Modal event listeners
  document.getElementById('btnClose').addEventListener('click', closeModal);
  document.getElementById('apiResponseModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById('copyBtn').addEventListener('click', () => {
    const url = document.getElementById('endpointUrl').textContent;
    copyToClipboard(url);
    
    const icon = document.getElementById('copyBtn').querySelector('i');
    icon.classList.remove('fa-copy');
    icon.classList.add('fa-check');
    setTimeout(() => {
      icon.classList.remove('fa-check');
      icon.classList.add('fa-copy');
    }, 2000);
  });

  document.getElementById('executeBtn').addEventListener('click', () => {
    const form = document.getElementById('paramForm');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    let endpoint = currentEndpoint.split('?')[0] + '?';
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach((input, index) => {
      endpoint += `${input.name}=${encodeURIComponent(input.value)}`;
      if (index < inputs.length - 1) endpoint += '&';
    });
    
    executeAPI(endpoint);
  });
}

function closeModal() {
  document.getElementById('apiResponseModal').classList.remove('active');
}

async function executeAPI(endpoint) {
  const loadingSpinner = document.getElementById('loadingSpinner');
  const responseContainer = document.getElementById('responseContainer');
  const responseContent = document.getElementById('responseContent');
  const executeBtn = document.getElementById('executeBtn');
  const paramForm = document.getElementById('paramForm');
  
  // Show loading state
  loadingSpinner.style.display = 'block';
  executeBtn.style.display = 'none';
  paramForm.style.display = 'none';
  responseContainer.classList.add('d-none');
  
  try {
    const fullURL = window.location.origin + endpoint;
    const response = await fetch(fullURL);
    const contentType = response.headers.get('content-type');
    
    loadingSpinner.style.display = 'none';
    responseContainer.classList.remove('d-none');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      responseContent.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } else if (contentType && contentType.startsWith('image/')) {
      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      responseContent.innerHTML = `<img src="${imgUrl}" class="image-response" alt="API Response" />`;
    } else {
      const text = await response.text();
      responseContent.innerHTML = `<pre>${text}</pre>`;
    }
    
  } catch (error) {
    loadingSpinner.style.display = 'none';
    responseContainer.classList.remove('d-none');
    responseContent.innerHTML = `<pre style="color: var(--danger);">Error: ${error.message}</pre>`;
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  });
}

function initializeSmoothScroll() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
