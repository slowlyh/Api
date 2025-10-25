const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General rate limiter (30 requests per minute)
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 30,
  message: {
    status: false,
    error: 'Too many requests, please try again later',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`);
    res.status(429).json({
      status: false,
      error: 'Too many requests from this IP, please try again later',
      retryAfter: '1 minute'
    });
  }
});

// Strict limiter for heavy endpoints (5 requests per minute)
const strictLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 5,
  message: {
    status: false,
    error: 'This endpoint has strict rate limiting. Please try again later',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  handler: (req, res) => {
    logger.warn(`Strict rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`);
    res.status(429).json({
      status: false,
      error: 'Rate limit exceeded for this resource-intensive endpoint',
      retryAfter: '1 minute'
    });
  }
});

// Moderate limiter for download endpoints (10 requests per minute)
const downloadLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10,
  message: {
    status: false,
    error: 'Download rate limit exceeded. Please try again later',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  handler: (req, res) => {
    logger.warn(`Download rate limit exceeded for IP: ${req.ip} on ${req.originalUrl}`);
    res.status(429).json({
      status: false,
      error: 'Too many download requests, please try again later',
      retryAfter: '1 minute'
    });
  }
});

// Lenient limiter for status/info endpoints (100 requests per minute)
const statusLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }
});

// Very lenient limiter for monitoring endpoints (200 requests per minute)
const monitoringLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }
});

module.exports = {
  generalLimiter,
  strictLimiter,
  downloadLimiter,
  statusLimiter,
  monitoringLimiter
};
