const axios = require("axios");
const moment = require('moment-timezone');

/**
 * Format date to Indonesian format
 * @param {number} numer - Timestamp
 * @returns {string} Formatted date string
 */
function tanggal(numer) {
  const myMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  
  const tgl = new Date(numer);
  const day = tgl.getDate();
  const bulan = tgl.getMonth();
  const thisDay = myDays[tgl.getDay()];
  const yy = tgl.getYear();
  const year = (yy < 1000) ? yy + 1900 : yy;
  
  return `${thisDay}, ${day}/${myMonths[bulan]}/${year}`;
}

/**
 * Capitalize first letter of string
 * @param {string} string - Input string
 * @returns {string} Capitalized string
 */
const capital = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Download file as buffer
 * @param {string} url - File URL
 * @param {object} options - Axios options
 * @returns {Promise<Buffer>} File buffer
 */
const getBuffer = async (url, options = {}) => {
  try {
    const res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    });
    return res.data;
  } catch (err) {
    throw new Error(`Failed to get buffer: ${err.message}`);
  }
};

/**
 * Fetch JSON data from URL
 * @param {string} url - API URL
 * @param {object} options - Axios options
 * @returns {Promise<any>} JSON data
 */
const fetchJson = async (url, options = {}) => {
  try {
    const res = await axios({
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
      },
      ...options
    });
    return res.data;
  } catch (err) {
    throw new Error(`Failed to fetch JSON: ${err.message}`);
  }
};

/**
 * Calculate uptime from seconds
 * @param {number} seconds - Uptime in seconds
 * @returns {string} Formatted uptime string
 */
const uptime = function(seconds = process.uptime()) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  
  const dDisplay = d > 0 ? d + (d == 1 ? "d " : "d ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
  const sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
  
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

module.exports = {
  tanggal,
  capital,
  getBuffer,
  fetchJson,
  uptime
};
