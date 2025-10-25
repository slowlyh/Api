module.exports = function (app) {
  app.get("/api/endpoints", async (req, res) => {
    try {
      const config = global.config;
      
      res.status(200).json({
        status: true,
        result: config.endpoints
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });
};
