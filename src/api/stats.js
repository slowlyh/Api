const { metrics } = require('../../utils/metrics');
const { monitoringLimiter } = require('../../middlewares/rateLimiter');

// Store for endpoint statistics
const endpointStats = new Map();

// Update endpoint stats
function updateEndpointStats(endpoint, duration, statusCode) {
  if (!endpointStats.has(endpoint)) {
    endpointStats.set(endpoint, {
      count: 0,
      totalDuration: 0,
      avgDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
      successCount: 0,
      errorCount: 0,
      lastAccessed: null
    });
  }
  
  const stats = endpointStats.get(endpoint);
  stats.count++;
  stats.totalDuration += duration;
  stats.avgDuration = stats.totalDuration / stats.count;
  stats.minDuration = Math.min(stats.minDuration, duration);
  stats.maxDuration = Math.max(stats.maxDuration, duration);
  stats.lastAccessed = new Date().toISOString();
  
  if (statusCode >= 200 && statusCode < 400) {
    stats.successCount++;
  } else {
    stats.errorCount++;
  }
}

module.exports = function (app) {
  // Get realtime statistics
  app.get('/api/stats/realtime', monitoringLimiter, (req, res) => {
    try {
      const stats = {
        endpoints: [],
        summary: {
          totalEndpoints: endpointStats.size,
          totalRequests: 0,
          avgResponseTime: 0,
          successRate: 0
        }
      };
      
      let totalRequests = 0;
      let totalDuration = 0;
      let totalSuccess = 0;
      let totalErrors = 0;
      
      // Convert Map to array and calculate totals
      endpointStats.forEach((data, endpoint) => {
        stats.endpoints.push({
          endpoint: endpoint,
          requests: data.count,
          avgResponseTime: Math.round(data.avgDuration),
          minResponseTime: Math.round(data.minDuration),
          maxResponseTime: Math.round(data.maxDuration),
          successCount: data.successCount,
          errorCount: data.errorCount,
          successRate: ((data.successCount / data.count) * 100).toFixed(2) + '%',
          lastAccessed: data.lastAccessed
        });
        
        totalRequests += data.count;
        totalDuration += data.totalDuration;
        totalSuccess += data.successCount;
        totalErrors += data.errorCount;
      });
      
      // Sort by request count (most popular first)
      stats.endpoints.sort((a, b) => b.requests - a.requests);
      
      // Calculate summary
      stats.summary.totalRequests = totalRequests;
      stats.summary.avgResponseTime = totalRequests > 0 
        ? Math.round(totalDuration / totalRequests) 
        : 0;
      stats.summary.successRate = totalRequests > 0
        ? ((totalSuccess / totalRequests) * 100).toFixed(2) + '%'
        : '0%';
      stats.summary.totalSuccess = totalSuccess;
      stats.summary.totalErrors = totalErrors;
      
      res.status(200).json({
        status: true,
        result: stats
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });

  // Get specific endpoint stats
  app.get('/api/stats/endpoint', monitoringLimiter, (req, res) => {
    try {
      const { path } = req.query;
      
      if (!path) {
        return res.status(400).json({
          status: false,
          error: 'Path parameter is required'
        });
      }
      
      const stats = endpointStats.get(path);
      
      if (!stats) {
        return res.status(404).json({
          status: false,
          error: 'Endpoint not found in statistics'
        });
      }
      
      res.status(200).json({
        status: true,
        result: {
          endpoint: path,
          requests: stats.count,
          avgResponseTime: Math.round(stats.avgDuration) + 'ms',
          minResponseTime: Math.round(stats.minDuration) + 'ms',
          maxResponseTime: Math.round(stats.maxDuration) + 'ms',
          successCount: stats.successCount,
          errorCount: stats.errorCount,
          successRate: ((stats.successCount / stats.count) * 100).toFixed(2) + '%',
          lastAccessed: stats.lastAccessed
        }
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });

  // Get top endpoints by requests
  app.get('/api/stats/top', monitoringLimiter, (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const topEndpoints = [];
      
      endpointStats.forEach((data, endpoint) => {
        topEndpoints.push({
          endpoint: endpoint,
          requests: data.count,
          avgResponseTime: Math.round(data.avgDuration) + 'ms'
        });
      });
      
      topEndpoints.sort((a, b) => b.requests - a.requests);
      
      res.status(200).json({
        status: true,
        result: topEndpoints.slice(0, limit)
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });

  // Get slowest endpoints
  app.get('/api/stats/slowest', monitoringLimiter, (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const slowestEndpoints = [];
      
      endpointStats.forEach((data, endpoint) => {
        slowestEndpoints.push({
          endpoint: endpoint,
          avgResponseTime: Math.round(data.avgDuration),
          maxResponseTime: Math.round(data.maxDuration),
          requests: data.count
        });
      });
      
      slowestEndpoints.sort((a, b) => b.avgResponseTime - a.avgResponseTime);
      
      res.status(200).json({
        status: true,
        result: slowestEndpoints.slice(0, limit).map(e => ({
          ...e,
          avgResponseTime: e.avgResponseTime + 'ms',
          maxResponseTime: e.maxResponseTime + 'ms'
        }))
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });
};

// Export update function for use in middleware
module.exports.updateEndpointStats = updateEndpointStats;
