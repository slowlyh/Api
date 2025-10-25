const NodeCache = require('node-cache');
const logger = require('./logger');

// Create cache instance
// stdTTL: default time to live in seconds (5 minutes)
// checkperiod: period in seconds to check for expired keys (1 minute)
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false
});

// Cache statistics
let stats = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0
};

// Get value from cache
const get = (key) => {
  try {
    const value = cache.get(key);
    if (value !== undefined) {
      stats.hits++;
      logger.debug(`Cache HIT: ${key}`);
      return value;
    }
    stats.misses++;
    logger.debug(`Cache MISS: ${key}`);
    return null;
  } catch (error) {
    logger.error(`Cache GET error for key ${key}: ${error.message}`);
    return null;
  }
};

// Set value in cache
const set = (key, value, ttl = null) => {
  try {
    const success = ttl ? cache.set(key, value, ttl) : cache.set(key, value);
    if (success) {
      stats.sets++;
      logger.debug(`Cache SET: ${key} (TTL: ${ttl || 'default'})`);
    }
    return success;
  } catch (error) {
    logger.error(`Cache SET error for key ${key}: ${error.message}`);
    return false;
  }
};

// Delete value from cache
const del = (key) => {
  try {
    const count = cache.del(key);
    if (count > 0) {
      stats.deletes++;
      logger.debug(`Cache DELETE: ${key}`);
    }
    return count;
  } catch (error) {
    logger.error(`Cache DELETE error for key ${key}: ${error.message}`);
    return 0;
  }
};

// Clear all cache
const flush = () => {
  try {
    cache.flushAll();
    logger.info('Cache flushed');
    return true;
  } catch (error) {
    logger.error(`Cache FLUSH error: ${error.message}`);
    return false;
  }
};

// Get cache statistics
const getStats = () => {
  const cacheStats = cache.getStats();
  return {
    ...stats,
    keys: cacheStats.keys,
    hits_ratio: stats.hits / (stats.hits + stats.misses) || 0,
    memory: process.memoryUsage()
  };
};

// Cache middleware for Express routes
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = `cache:${req.originalUrl}`;
    const cachedResponse = get(key);
    
    if (cachedResponse) {
      logger.debug(`Serving cached response for: ${req.originalUrl}`);
      return res.json(cachedResponse);
    }
    
    // Store original res.json
    const originalJson = res.json.bind(res);
    
    // Override res.json
    res.json = (data) => {
      // Cache the response
      set(key, data, duration);
      // Send the response
      return originalJson(data);
    };
    
    next();
  };
};

// Clear cache by pattern
const clearByPattern = (pattern) => {
  try {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    matchingKeys.forEach(key => del(key));
    logger.info(`Cleared ${matchingKeys.length} cache entries matching pattern: ${pattern}`);
    return matchingKeys.length;
  } catch (error) {
    logger.error(`Cache CLEAR PATTERN error: ${error.message}`);
    return 0;
  }
};

// Event listeners
cache.on('expired', (key, value) => {
  logger.debug(`Cache key expired: ${key}`);
});

cache.on('flush', () => {
  logger.info('Cache was flushed');
});

module.exports = {
  get,
  set,
  del,
  flush,
  getStats,
  cacheMiddleware,
  clearByPattern
};
