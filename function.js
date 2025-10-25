// Import utilities from modular helpers
const { tanggal, capital, getBuffer, fetchJson, uptime } = require('./utils/helpers');

// Set global functions for backward compatibility
global.tanggal = tanggal;
global.capital = capital;
global.getBuffer = getBuffer;
global.fetchJson = fetchJson;
global.uptime = uptime;
global.reqTotal = 0;

module.exports = { tanggal, capital, getBuffer, fetchJson, uptime };