module.exports = function (app) {
  const axios = require("axios");
  const FormData = require("form-data");
  const crypto = require("crypto");

  async function unblurFromUrl(imageUrl) {
    const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(img.data);
    const serial = crypto.randomBytes(16).toString("hex");
    const fname = `Image_${crypto.randomBytes(6).toString("hex")}.jpg`;
    const form = new FormData();
    form.append("original_image_file", buffer, {
      filename: fname,
      contentType: "image/jpeg",
    });
    form.append("scale_factor", 2);
    form.append("upscale_type", "image-upscale");
    const headers = { ...form.getHeaders(), "product-serial": serial };

    try {
      const res = await axios.post(
        "https://api.unblurimage.ai/api/imgupscaler/v2/ai-image-unblur/create-job",
        form,
        { headers },
      );
      const jobId = res.data?.result?.job_id;
      if (!jobId) throw new Error("Job ID not found");

      let output,
        done = false;
      const timeout = Date.now() + 180000;
      while (!done && Date.now() < timeout) {
        const poll = await axios.get(
          `https://api.unblurimage.ai/api/imgupscaler/v2/ai-image-unblur/get-job/${jobId}`,
          { headers },
        );
        if (poll.data.code === 100000 && poll.data.result?.output_url?.[0]) {
          output = poll.data.result.output_url[0];
          done = true;
        } else await new Promise((r) => setTimeout(r, 3000));
      }
      return { jobId, filename: fname, output };
    } catch (e) {
      return { error: e.response?.data || e.message };
    }
  }

  app.get("/tools/unblur", async (req, res) => {
    try {
      const { url } = req.query;
      const result = await unblurFromUrl(url);

      res.status(200).json({
        status: true,
        result: result,
      });
    } catch (error) {
      res.json({ status: false, error: error.message });
    }
  });
};
