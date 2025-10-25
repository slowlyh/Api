const promClient = require('prom-client');

// Create a Registry
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metrics

// HTTP request duration histogram
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

// HTTP request counter
const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Active requests gauge
const httpRequestsActive = new promClient.Gauge({
  name: 'http_requests_active',
  help: 'Number of active HTTP requests'
});

// Cache metrics
const cacheHits = new promClient.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits'
});

const cacheMisses = new promClient.Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses'
});

const cacheSize = new promClient.Gauge({
  name: 'cache_size',
  help: 'Current number of items in cache'
});

// API endpoint response time
const endpointResponseTime = new promClient.Summary({
  name: 'api_endpoint_response_time_ms',
  help: 'API endpoint response time in milliseconds',
  labelNames: ['endpoint'],
  percentiles: [0.5, 0.9, 0.95, 0.99]
});

// Error counter
const errorTotal = new promClient.Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'endpoint']
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpRequestsActive);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);
register.registerMetric(cacheSize);
register.registerMetric(endpointResponseTime);
register.registerMetric(errorTotal);

// Middleware to track HTTP metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Check if this is a static file or page route
  const isStaticFile = req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i);
  const isPageRoute = ['/', '/docs', '/status'].includes(req.path);
  const isMetadataEndpoint = ['/api/metadata', '/api/endpoints'].includes(req.path);
  const isMonitoringEndpoint = req.path.startsWith('/api/stats/') || 
                                req.path === '/api/health' || 
                                req.path === '/api/cache/stats' ||
                                req.path === '/metrics' ||
                                req.path === '/health' ||
                                req.path === '/ready' ||
                                req.path === '/live';
  const skipStats = isStaticFile || isPageRoute || isMetadataEndpoint || isMonitoringEndpoint;
  
  // Increment active requests
  httpRequestsActive.inc();
  
  // Track response
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const durationMs = Date.now() - start;
    const route = req.route ? req.route.path : req.path;
    
    // Record metrics
    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration
    );
    
    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode
    });
    
    endpointResponseTime.observe(
      { endpoint: route },
      duration * 1000
    );
    
    // Decrement active requests
    httpRequestsActive.dec();
    
    // Track errors
    if (res.statusCode >= 400) {
      errorTotal.inc({
        type: res.statusCode >= 500 ? 'server_error' : 'client_error',
        endpoint: route
      });
    }
    
    // Update realtime endpoint stats (skip static files and pages)
    if (!skipStats) {
      try {
        const { updateEndpointStats } = require('../src/api/stats');
        updateEndpointStats(route, durationMs, res.statusCode);
      } catch (err) {
        // Stats module might not be loaded yet, ignore
      }
    }
  });
  
  next();
};

// Update cache metrics
const updateCacheMetrics = (stats) => {
  if (stats.hits !== undefined) {
    cacheHits.inc(stats.hits);
  }
  if (stats.misses !== undefined) {
    cacheMisses.inc(stats.misses);
  }
  if (stats.keys !== undefined) {
    cacheSize.set(stats.keys);
  }
};

module.exports = {
  register,
  metricsMiddleware,
  updateCacheMetrics,
  metrics: {
    httpRequestDuration,
    httpRequestTotal,
    httpRequestsActive,
    cacheHits,
    cacheMisses,
    cacheSize,
    endpointResponseTime,
    errorTotal
  }
};
