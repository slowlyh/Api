const cache = require('../../utils/cache');

module.exports = function (app) {
  // Get cache statistics
  app.get('/api/cache/stats', (req, res) => {
    try {
      const stats = cache.getStats();
      
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

  // Clear all cache
  app.post('/api/cache/clear', (req, res) => {
    try {
      const success = cache.flush();
      
      if (success) {
        res.status(200).json({
          status: true,
          message: 'Cache cleared successfully'
        });
      } else {
        res.status(500).json({
          status: false,
          error: 'Failed to clear cache'
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });

  // Clear cache by pattern
  app.post('/api/cache/clear/:pattern', (req, res) => {
    try {
      const { pattern } = req.params;
      const count = cache.clearByPattern(pattern);
      
      res.status(200).json({
        status: true,
        message: `Cleared ${count} cache entries`,
        count: count
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });
};
