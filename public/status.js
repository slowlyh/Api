// Status page script
let autoRefreshInterval;

// Load all data
async function loadAllData() {
  try {
    await Promise.all([
      loadMetadata(),
      loadHealthData(),
      loadCacheStats(),
      loadRealtimeStats(),
      loadTopEndpoints()
    ]);
    
    updateLastUpdated();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

// Load metadata
async function loadMetadata() {
  try {
    const response = await fetch('/api/metadata');
    const data = await response.json();
    const metadata = data.result;

    if (metadata.favicon) {
      document.getElementById('icon').href = metadata.favicon;
    }
    document.getElementById('pageTitle').textContent = `${metadata.apiTitle} - Status`;
    document.getElementById('navLogo').textContent = metadata.apiTitle;
    document.getElementById('footerText').textContent = `© ${new Date().getFullYear()} Powered by ${metadata.creator}`;

    document.getElementById('githubLink').href = metadata.github;
    document.getElementById('whatsappLink').href = metadata.whatsapp;
    document.getElementById('telegramLink').href = metadata.youtube;
  } catch (error) {
    console.error('Failed to load metadata:', error);
  }
}

// Load health data
async function loadHealthData() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    const health = data.result;

    // Update status badge
    document.getElementById('statusText').textContent = 'All Systems Operational';
    document.getElementById('statusBadge').className = 'status-badge';

    // Update metrics
    document.getElementById('uptime').textContent = health.service.uptime;
    document.getElementById('responseTime').textContent = '< 100ms';
    document.getElementById('totalRequests').textContent = health.requests.total.toLocaleString();
    document.getElementById('totalEndpoints').textContent = '15+';

    // Update system info
    document.getElementById('platform').textContent = health.system.platform;
    document.getElementById('nodeVersion').textContent = health.system.nodeVersion;
    document.getElementById('cpuCores').textContent = health.system.cpuCount;
    document.getElementById('totalMemory').textContent = health.system.totalMemory;
    document.getElementById('freeMemory').textContent = health.system.freeMemory;
    document.getElementById('processMemory').textContent = health.process.memory.rss;

    // Update cache stats
    if (health.cache) {
      document.getElementById('cacheHits').textContent = health.cache.hits.toLocaleString();
      document.getElementById('cacheMisses').textContent = health.cache.misses.toLocaleString();
      
      const hitRatio = (health.cache.hits_ratio * 100).toFixed(1);
      document.getElementById('hitRatio').textContent = hitRatio + '%';
      document.getElementById('hitRatioBar').style.width = hitRatio + '%';
      document.getElementById('cachedKeys').textContent = health.cache.keys;
    }
  } catch (error) {
    console.error('Failed to load health data:', error);
    document.getElementById('statusText').textContent = 'Unable to fetch status';
    document.getElementById('statusBadge').className = 'status-badge degraded';
  }
}

// Load cache stats
async function loadCacheStats() {
  try {
    const response = await fetch('/api/cache/stats');
    const data = await response.json();
    const stats = data.result;

    document.getElementById('cacheHits').textContent = stats.hits.toLocaleString();
    document.getElementById('cacheMisses').textContent = stats.misses.toLocaleString();
    
    const hitRatio = (stats.hits_ratio * 100).toFixed(1);
    document.getElementById('hitRatio').textContent = hitRatio + '%';
    document.getElementById('hitRatioBar').style.width = hitRatio + '%';
    document.getElementById('cachedKeys').textContent = stats.keys;
  } catch (error) {
    console.error('Failed to load cache stats:', error);
  }
}

// Load realtime statistics
async function loadRealtimeStats() {
  try {
    const response = await fetch('/api/stats/realtime');
    const data = await response.json();
    const stats = data.result;

    const statsContainer = document.getElementById('realtimeStats');
    statsContainer.innerHTML = '';

    if (!stats.endpoints || stats.endpoints.length === 0) {
      statsContainer.innerHTML = '<div class="endpoint-item"><span class="endpoint-name">No statistics available yet. Make some requests first!</span></div>';
      return;
    }

    // Display top 10 endpoints with stats
    stats.endpoints.slice(0, 10).forEach(endpoint => {
      const item = document.createElement('div');
      item.className = 'endpoint-item';
      item.innerHTML = `
        <div style="flex: 1;">
          <div class="endpoint-name">${endpoint.endpoint}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Requests: ${endpoint.requests} | Success: ${endpoint.successRate}
          </div>
        </div>
        <div class="endpoint-status">
          <div style="text-align: right;">
            <div style="font-weight: 600; color: var(--primary);">${endpoint.avgResponseTime}ms</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">avg</div>
          </div>
        </div>
      `;
      statsContainer.appendChild(item);
    });
  } catch (error) {
    console.error('Failed to load realtime stats:', error);
    document.getElementById('realtimeStats').innerHTML = '<div class="endpoint-item"><span class="endpoint-name">Failed to load statistics</span></div>';
  }
}

// Load top endpoints
async function loadTopEndpoints() {
  try {
    const response = await fetch('/api/stats/top?limit=5');
    const data = await response.json();
    const topEndpoints = data.result;

    const topContainer = document.getElementById('topEndpoints');
    topContainer.innerHTML = '';

    if (!topEndpoints || topEndpoints.length === 0) {
      topContainer.innerHTML = '<div class="endpoint-item"><span class="endpoint-name">No data available yet</span></div>';
      return;
    }

    topEndpoints.forEach((endpoint, index) => {
      const item = document.createElement('div');
      item.className = 'endpoint-item';
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); min-width: 30px;">
            #${index + 1}
          </div>
          <div style="flex: 1;">
            <div class="endpoint-name">${endpoint.endpoint}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
              ${endpoint.avgResponseTime} average
            </div>
          </div>
        </div>
        <div class="endpoint-status">
          <div style="font-weight: 600; color: var(--success);">${endpoint.requests}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">requests</div>
        </div>
      `;
      topContainer.appendChild(item);
    });
  } catch (error) {
    console.error('Failed to load top endpoints:', error);
    document.getElementById('topEndpoints').innerHTML = '<div class="endpoint-item"><span class="endpoint-name">Failed to load data</span></div>';
  }
}

// Update last updated time
function updateLastUpdated() {
  const now = new Date();
  document.getElementById('lastUpdated').textContent = now.toLocaleTimeString();
}

// Refresh data
function initializeRefreshButton() {
  document.getElementById('refreshBtn').addEventListener('click', async () => {
    const btn = document.getElementById('refreshBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    
    await loadAllData();
    
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
  });
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

// Auto refresh every 30 seconds
function startAutoRefresh() {
  autoRefreshInterval = setInterval(() => {
    loadAllData();
  }, 30000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  loadAllData();
  initializeTheme();
  initializeNavbar();
  initializeRefreshButton();
  startAutoRefresh();
});

// Clear interval on page unload
window.addEventListener('beforeunload', () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }
});
