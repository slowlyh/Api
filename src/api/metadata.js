module.exports = function (app) {
  app.get("/api/metadata", async (req, res) => {
    try {
      const config = global.config;
      
      res.status(200).json({
        status: true,
        result: {
          creator: config.creator,
          whatsapp: config.whatsapp,
          github: config.github,
          youtube: config.youtube,
          apititle: config.apiTitle,  // Use lowercase to match metadata.json
          favicon: config.favicon
        }
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });
};
