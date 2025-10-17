module.exports = function (app) {
  const axios = require("axios");
  const crypto = require("crypto");

  class Util {
    static PRIMARY_KEY =
      "73587A446B5642716E6A6A48325742733561436D5A457847555273367A4E4B79";
    static X_TOKEN_KEY =
      "UAXFoplp5H87RRX7/HvrKAvO6rkH3IE/u0931xcvThO7sxOvv1cvz7H14iRSSHXM";
    static X_TOKEN_DEC =
      "OFx0xDz4WXeHQn+5mZtaf7eScT6WbgYRHV/cVLKIoYYbfpL0JYRPMY7G75BJQ5n2";
    static X_APP_KEY =
      "FJ7lkHHe8QSX1S5rCNkYlI9eBZTYLP1s2GgJFC5ZJhG6LWX37b5p7fyiZZN07uYR";
    static X_APP_DEC = "wy9V4gkza+fPVHVADo1nC8ln5otwFWqJ8xpElEXcS38=";

    /**
     * Decrypt a Base64 encoded AES string.
     *
     * @param {string} strToDecrypt - The encrypted string in Base64.
     * @param {string} secret - The 16+ character secret key.
     * @returns {string} Decrypted plaintext.
     * @throws {Error} If decryption fails.
     */
    static decrypt(strToDecrypt, secret) {
      if (typeof strToDecrypt !== "string" || typeof secret !== "string") {
        throw new TypeError("Both strToDecrypt and secret must be strings.");
      }

      try {
        const key = Buffer.from(secret, "utf-8");
        const iv = Buffer.from(secret.substring(0, 16), "utf-8");
        const encryptedText = Buffer.from(strToDecrypt, "base64");

        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        let decrypted = decipher.update(encryptedText, null, "utf8");
        decrypted += decipher.final("utf8");

        return decrypted.replace(/\n/g, "");
      } catch (error) {
        throw new Error(`Decryption failed: ${error.message}`);
      }
    }

    /**
     * Encrypt a string using AES and encode it with Base64.
     *
     * @param {string} strToEncrypt - The plaintext string to encrypt.
     * @param {string} secret - The 16+ character secret key.
     * @returns {string} Encrypted Base64 string.
     * @throws {Error} If encryption fails.
     */
    static encrypt(strToEncrypt, secret) {
      if (typeof strToEncrypt !== "string" || typeof secret !== "string") {
        throw new TypeError("Both strToEncrypt and secret must be strings.");
      }

      try {
        const key = Buffer.from(secret, "utf-8");
        const iv = Buffer.from(secret.substring(0, 16), "utf-8");
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

        let encrypted = cipher.update(strToEncrypt, "utf8", "base64");
        encrypted += cipher.final("base64");

        return encrypted.replace(/\n/g, "");
      } catch (error) {
        throw new Error(`Encryption failed: ${error.message}`);
      }
    }

    /**
     * Convert a hexadecimal string to a byte array (Buffer).
     *
     * @param {string} hexString - The hex string to convert (must be even-length).
     * @returns {Buffer} The byte array (Buffer).
     * @throws {Error} If input is not a valid hex string.
     */
    static hexToBytes(hexString) {
      if (typeof hexString !== "string") {
        throw new TypeError("Input must be a string.");
      }

      if (hexString.length % 2 !== 0) {
        throw new Error("Hex string must have an even length.");
      }

      // Validate that string only contains hex characters
      if (!/^[0-9a-fA-F]+$/.test(hexString)) {
        throw new Error("Hex string contains invalid characters.");
      }

      try {
        return Buffer.from(hexString, "hex");
      } catch (err) {
        throw new Error(`Failed to convert hex to bytes: ${err.message}`);
      }
    }

    /**
     * Get current UTC time from worldtimeapi.org
     *
     * @returns {number|null} Unix time in seconds, or null on failure
     */
    static getUtcTime() {
      try {
        return Math.floor(new Date().getTime() / 1000);
      } catch (err) {
        console.log(err);
        return null;
      }
    }
  }

  /**
   * Fetch data from a given URL using the configured API.
   *
   * @param {string} targetUrl - The URL to fetch (e.g., Twitter/X post link)
   * @param {object} options - Optional config for headers and cookie
   * @param {string} options.cookie - Cookie string if required
   * @returns {Promise<object>} Response data from the API
   */
  async function fetchUrlData(targetUrl, options = {}) {
    if (!targetUrl || typeof targetUrl !== "string") {
      throw new Error(
        "❌ Invalid input: 'targetUrl' must be a non-empty string.",
      );
    }

    try {
      new URL(targetUrl);
    } catch {
      throw new Error("❌ Invalid URL format. Please provide a valid URL.");
    }

    const { cookie = "" } = options;

    const data = new URLSearchParams();
    data.append("url", targetUrl);
    data.append("cookie", cookie);

    const key = Util.hexToBytes(Util.PRIMARY_KEY).toString();
    const unixTime = Util.getUtcTime();
    const xtokenKey = Util.decrypt(Util.X_TOKEN_KEY, key);
    const xtokenDec = Util.decrypt(Util.X_TOKEN_DEC, key);
    const xtoken = Util.encrypt(xtokenDec + "___" + unixTime, xtokenKey);
    const xappkeyKey = Util.decrypt(Util.X_APP_KEY, key);
    const xappkeyDec = Util.decrypt(Util.X_APP_DEC, key);
    const xappkey = Util.encrypt(xappkeyDec + "___" + unixTime, xappkeyKey);

    const config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: "https://downloaderapi.densavedownloader.app/index.php?action=extract",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
        referer: "https://downloaderapi.quqqashop.com/",
        "cache-control": "no-cache",
        "x-token": xtoken,
        "x-appkey": xappkey,
        "x-appcode": "haticitwitter",
        "content-type": "application/x-www-form-urlencoded",
      },
      data,
      timeout: 30000,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `⚠️ API Error (${error.response.status}): ${error.response.data?.message || "Unknown error"}`,
        );
      } else if (error.request) {
        throw new Error("❌ No response from server. Please try again later.");
      } else {
        throw new Error(`❌ Request failed: ${error.message}`);
      }
    }
  }

  app.get("/download/x", async (req, res) => {
    try {
      const { url } = req.query;
      const result = await fetchUrlData(url);

      res.status(200).json({
        status: true,
        result: result,
      });
    } catch (error) {
      res.json({ status: false, error: error.message });
    }
  });
};
