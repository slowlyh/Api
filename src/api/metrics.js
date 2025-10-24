const { register } = require('../../utils/metrics');

module.exports = function (app) {
  // Prometheus metrics endpoint
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });
};
