/**
 * Validate URL parameter
 */
const validateUrl = (req, res, next) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({
      status: false,
      error: 'URL parameter is required'
    });
  }
  
  try {
    new URL(url);
    next();
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: 'Invalid URL format'
    });
  }
};

/**
 * Validate text parameter
 */
const validateText = (req, res, next) => {
  const { text } = req.query;
  
  if (!text) {
    return res.status(400).json({
      status: false,
      error: 'Text parameter is required'
    });
  }
  
  if (text.length > 5000) {
    return res.status(400).json({
      status: false,
      error: 'Text is too long (max 5000 characters)'
    });
  }
  
  next();
};

/**
 * Rate limiting middleware (simple in-memory implementation)
 */
const rateLimiter = (() => {
  const requests = new Map();
  const WINDOW_MS = 60000; // 1 minute
  const MAX_REQUESTS = 30; // 30 requests per minute
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }
    
    const userRequests = requests.get(ip);
    const recentRequests = userRequests.filter(time => now - time < WINDOW_MS);
    
    if (recentRequests.length >= MAX_REQUESTS) {
      return res.status(429).json({
        status: false,
        error: 'Too many requests, please try again later'
      });
    }
    
    recentRequests.push(now);
    requests.set(ip, recentRequests);
    
    next();
  };
})();

module.exports = {
  validateUrl,
  validateText,
  rateLimiter
};
