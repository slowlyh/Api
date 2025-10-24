/*
 * Scrape Capcut Downloader
 * Base : https://anydownloader.com
 * Sumber : https://whatsapp.com/channel/0029Vb6chx1LI8YVtJJJ9a0Y
 * Author : ZenzzXD
 */

module.exports = function (app) {
  const cangcut = async (url) => {
    const body = new URLSearchParams({
      url,
      token: "153d8f770cb72578abab74c2e257fb85a1fd60dcb0330e32706763c90448ae01",
      hash: "aHR0cHM6Ly93d3cuY2FwY3V0LmNvbS90djIvWlNVQnVFVVBWLw==1037YXBp",
    });

    try {
      const r = await fetch("https://anydownloader.com/wp-json/api/download/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "https://anydownloader.com",
          Referer:
            "https://anydownloader.com/en/online-capcut-video-downloader-without-watermark/",
          "User-Agent": "Mozilla/5.0",
        },
        body,
      });
      const data = await r.json();
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  app.get("/download/capcut", async (req, res) => {
    try {
      const { url } = req.query;
      const result = await cangcut(url);

      res.status(200).json({
        status: true,
        result: result,
      });
    } catch (error) {
      res.json({ status: false, error: error.message });
    }
  });
};
