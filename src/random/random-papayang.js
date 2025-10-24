module.exports = function (app) {
  async function getPapAyang() {
    try {
      // Array of pap ayang images
      const images = [
        "https://img12.pixhost.to/images/507/570627648_skyzopedia.jpg",
        // Add more URLs here for variety
      ];
      
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const response = await getBuffer(randomImage);
      return response;
    } catch (error) {
      throw error;
    }
  }

  app.get("/random/papayang", async (req, res) => {
    try {
      const imageBuffer = await getPapAyang();
      res.writeHead(200, {
        "Content-Type": "image/jpeg",
        "Content-Length": imageBuffer.length,
      });
      res.end(imageBuffer);
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`);
    }
  });
};
