module.exports = function (app) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  const qs = require("qs");

  async function asu(url) {
    try {
      const payload = qs.stringify({ fb_url: url });
      const res = await axios.post(
        "https://saveas.co/smart_download.php",
        payload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0",
          },
        },
      );
      const $ = cheerio.load(res.data);
      const thumb = $(".box img").attr("src") || null;
      const title = $(".box .info h2").text().trim() || null;
      const desc =
        $(".box .info p").first().text().replace("Description:", "").trim() ||
        null;
      const duration =
        $(".box .info p").last().text().replace("Duration:", "").trim() || null;
      const sd = $("#sdLink").attr("href") || null;
      const hd = $("#hdLink").attr("href") || null;
      return { title, desc, duration, thumb, sd, hd };
    } catch (e) {
      return { status: "error", message: e.message };
    }
  }

  app.get("/download/facebook", async (req, res) => {
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
