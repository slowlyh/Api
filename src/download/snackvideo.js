module.exports = function (app) {
  const axios = require("axios");
  const cheerio = require("cheerio");

  async function asu(videoUrl) {
    try {
      const encoded = encodeURIComponent(videoUrl);
      const bokep = {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/122.0.0.0 Mobile Safari/537.36",
        Referer: "https://www.expertstool.com/snack-video-downloader/",
      };

      const res = await axios.get(
        `https://www.expertstool.com/d.php?url=${encoded}`,
        { headers: bokep },
      );

      const $ = cheerio.load(res.data);
      let hasil = {};

      $("a").each((i, el) => {
        const link = $(el).attr("href");
        if (link && link.includes(".mp4")) {
          hasil.video = link;
        }
      });

      return hasil;
    } catch (err) {
      return { error: err.message };
    }
  }

  app.get("/download/snackvideo", async (req, res) => {
    try {
      const { url } = req.query;
      const result = await asu(url);

      res.status(200).json({
        status: true,
        result: result,
      });
    } catch (error) {
      res.json({ status: false, error: error.message });
    }
  });
};
