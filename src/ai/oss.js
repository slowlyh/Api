// Scraper By Fgsi
module.exports = function (app) {
  const axios = require("axios");

  async function gradientChat({
    model,
    clusterMode,
    messages,
    enableThinking,
  }) {
    // === Build Params ===
    if (!["Qwen3 235B", "GPT OSS 120B"].includes(model)) {
      throw new Error("Model harus 'Qwen3 235B' atau 'GPT OSS 120B'");
    }
    if (!["nvidia", "hybrid"].includes(clusterMode)) {
      throw new Error("clusterMode harus 'nvidia' atau 'hybrid'");
    }
    const params = { model, clusterMode, messages };
    if (model === "GPT OSS 120B") {
      params.enableThinking = !!enableThinking;
    }

    // === Request ===
    const response = await axios.post(
      "https://chat.gradient.network/api/generate",
      params,
      {
        headers: {
          accept: "*/*",
          "content-type": "application/json",
          origin: "https://chat.gradient.network",
          referer: "https://chat.gradient.network/",
        },
        responseType: "text",
      },
    );

    // === Parse Response ===
    const raw = response.data;
    const lines = raw.trim().split(/\r?\n/);
    const result = {
      jobInfo: null,
      clusterInfo: null,
      replies: [],
      content: "",
      blockUpdates: [],
    };
    for (const line of lines) {
      if (!line.trim()) continue;
      let obj;
      try {
        obj = JSON.parse(line);
      } catch {
        continue;
      }
      switch (obj.type) {
        case "clusterInfo":
          result.clusterInfo = obj.data;
          break;
        case "reply":
          result.replies.push(obj.data);
          result.content += obj.data?.content || "";
          break;
        case "blockUpdate":
          result.blockUpdates.push(...obj.data);
          break;
      }
    }

    return result;
  }

  app.get("/ai/oss", async (req, res) => {
    try {
      const { text } = req.query;

      const result = await gradientChat({
        model: "GPT OSS 120B",
        clusterMode: "nvidia",
        messages: [{ role: "user", content: text }],
        enableThinking: true,
      });

      res.status(200).json({
        status: true,
        result: result.content,
      });
    } catch (error) {
      res.json({ status: false, error: error.message });
    }
  });
};
