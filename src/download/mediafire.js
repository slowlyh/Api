/**
 * CR Ponta Sensei
 * CH https://whatsapp.com/channel/0029VagslooA89MdSX0d1X1z
 * WEB https://codeteam.my.id
 **/

module.exports = function (app) {
  const fetch = require("node-fetch");

  async function MediaFire(url) {
    try {
      const res1 = await fetch(
        "https://staging-mediafire-direct-url-ui-txd2.frontend.encr.app/api/mediafire/taskid",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "content-type": "application/json",
            "accept-language": "id-ID",
          },
        },
      );
      const data1 = await res1.json();
      const taskId = data1.taskId;
      const res2 = await fetch(
        `https://staging-mediafire-direct-url-ui-txd2.frontend.encr.app/api/mediafire/download/${taskId}`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "content-type": "application/json",
            "accept-language": "id-ID",
          },
          body: JSON.stringify({ url }),
        },
      );
      const data2 = await res2.json();
      return {
        fileName: data2.fileName,
        downloadUrl: data2.downloadUrl,
      };
    } catch {
      return null;
    }
  }

  app.get("/download/mediafire", async (req, res) => {
    try {
      const { url } = req.query;
      const result = await MediaFire(url);

      res.status(200).json({
        status: true,
        result: result,
      });
    } catch (error) {
      res.json({ status: false, error: error.message });
    }
  });
};
