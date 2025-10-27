require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const config = require('./config/config');
const logger = require('./utils/logger');
const { generalLimiter } = require('./middlewares/rateLimiter');
const { metricsMiddleware } = require('./utils/metrics');

require("./function.js");

const app = express();
const PORT = config.port;

// Trust proxy configuration
// Set to false if not behind a proxy, or configure properly if behind proxy
app.set('trust proxy', false);
app.set("json spaces", 2);

// Security & Performance Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Request logging
app.use(logger.requestLogger);

// Metrics collection
app.use(metricsMiddleware);

// Rate limiting
app.use((req, res, next) => {
  // Skip rate limiting for static files and HTML pages
  const skipPaths = [
    '/public/',
    '/page/',
    '/favicon.ico',
    '/',
    '/docs',
    '/status'
  ];
  
  const isStaticFile = req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i);
  const isPageRoute = skipPaths.some(path => req.path === path || req.path.startsWith(path));
  
  if (isStaticFile || isPageRoute) {
    return next();
  }
  
  // Apply rate limiting to API routes only
  generalLimiter(req, res, next);
});

// Static file serving
const distPath = path.join(__dirname, 'dist');

// Serve React static files
app.use(express.static(distPath));

// Set global variables
global.apikey = config.apiKey || null;
global.reqTotal = 0;
global.config = config;

// Middleware untuk format JSON response dan request counter
app.use((req, res, next) => {
  global.reqTotal += 1;

  const originalJson = res.json;
  res.json = function (data) {
    if (data && typeof data === 'object') {
      const responseData = {
        status: data.status,
        creator: config.creator,
        ...data
      };
      return originalJson.call(this, responseData);
    }
    return originalJson.call(this, data);
  };

  next();
});

// Load dynamic routes
let totalRoutes = 0;
const apiFolder = path.join(__dirname, './src');

fs.readdirSync(apiFolder).forEach((subfolder) => {
  const subfolderPath = path.join(apiFolder, subfolder);
  if (fs.statSync(subfolderPath).isDirectory()) {
    fs.readdirSync(subfolderPath).forEach((file) => {
      const filePath = path.join(subfolderPath, file);
      if (path.extname(file) === '.js') {
        require(filePath)(app);
        totalRoutes++;
        console.log(chalk.bgHex('#FFFF99').hex('#333').bold(` Loaded Route: ${path.basename(file)} `));
      }
    });
  }
});

console.log(chalk.bgHex('#90EE90').hex('#333').bold(' Load Complete! ✓ '));
console.log(chalk.bgHex('#90EE90').hex('#333').bold(` Total Routes Loaded: ${totalRoutes} `));

// React SPA
app.get('*', (req, res) => {
  // Return 404 JSON for API routes that don't exist
  if (req.path.startsWith('/api') || req.path.startsWith('/ai') || 
      req.path.startsWith('/download') || req.path.startsWith('/random') || 
      req.path.startsWith('/tools') || req.path.startsWith('/metrics')) {
    return res.status(404).json({ 
      status: false, 
      error: 'Endpoint not found',
      path: req.path 
    });
  }
  
  // Serve React app for all other routes
  const indexPath = path.join(distPath, 'index.html');
  
  // Check if React build exists
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).json({ 
      status: false, 
      error: 'React build not found. Please run: npm run client:build',
      hint: 'Build the React app first before starting the server'
    });
  }
});

// Start server
app.listen(PORT, () => {
  const reactBuildExists = fs.existsSync(path.join(distPath, 'index.html'));
  
  console.log('\n' + chalk.cyan('═'.repeat(60)));
  console.log(chalk.bold.green('  🚀 API Server Started Successfully!'));
  console.log(chalk.cyan('═'.repeat(60)));
  console.log('');
  console.log(chalk.white('  📋 Server Information:'));
  console.log(chalk.gray('  ├─ ') + chalk.white('Version: ') + chalk.yellow('v2.1.0'));
  console.log(chalk.gray('  ├─ ') + chalk.white('Port: ') + chalk.yellow(PORT));
  console.log(chalk.gray('  ├─ ') + chalk.white('Environment: ') + chalk.yellow(config.nodeEnv));
  console.log(chalk.gray('  ├─ ') + chalk.white('Routes Loaded: ') + chalk.yellow(totalRoutes));
  console.log(chalk.gray('  ├─ ') + chalk.white('Frontend: ') + (reactBuildExists ? chalk.green('React ✓') : chalk.red('Not Built ✗')));
  console.log(chalk.gray('  └─ ') + chalk.white('PID: ') + chalk.yellow(process.pid));
  console.log('');
  console.log(chalk.white('  🌐 Access URLs:'));
  console.log(chalk.gray('  ├─ ') + chalk.white('Local: ') + chalk.cyan(`http://localhost:${PORT}`));
  console.log(chalk.gray('  ├─ ') + chalk.white('Docs: ') + chalk.cyan(`http://localhost:${PORT}/docs`));
  console.log(chalk.gray('  ├─ ') + chalk.white('Status: ') + chalk.cyan(`http://localhost:${PORT}/status`));
  console.log(chalk.gray('  └─ ') + chalk.white('Health: ') + chalk.cyan(`http://localhost:${PORT}/health`));
  console.log('');
  console.log(chalk.white('  📊 Monitoring:'));
  console.log(chalk.gray('  ├─ ') + chalk.white('Metrics: ') + chalk.cyan(`http://localhost:${PORT}/metrics`));
  console.log(chalk.gray('  ├─ ') + chalk.white('Cache Stats: ') + chalk.cyan(`http://localhost:${PORT}/api/cache/stats`));
  console.log(chalk.gray('  └─ ') + chalk.white('API Status: ') + chalk.cyan(`http://localhost:${PORT}/api/status`));
  console.log('');
  console.log(chalk.white('  ⚙️  Features:'));
  console.log(chalk.gray('  ├─ ') + chalk.green('✓') + chalk.white(' Logging (Winston)'));
  console.log(chalk.gray('  ├─ ') + chalk.green('✓') + chalk.white(' Caching (NodeCache)'));
  console.log(chalk.gray('  ├─ ') + chalk.green('✓') + chalk.white(' Rate Limiting'));
  console.log(chalk.gray('  ├─ ') + chalk.green('✓') + chalk.white(' Prometheus Metrics'));
  console.log(chalk.gray('  ├─ ') + chalk.green('✓') + chalk.white(' Security Headers (Helmet)'));
  console.log(chalk.gray('  └─ ') + chalk.green('✓') + chalk.white(' Gzip Compression'));
  console.log('');
  console.log(chalk.cyan('═'.repeat(60)));
  
  if (!reactBuildExists) {
    console.log('');
    console.log(chalk.bgYellow.black(' ⚠️  WARNING '));
    console.log(chalk.yellow('  React build not found! Run these commands:'));
    console.log(chalk.gray('  1. ') + chalk.white('npm run client:install'));
    console.log(chalk.gray('  2. ') + chalk.white('npm run client:build'));
    console.log('');
  }
  
  console.log(chalk.gray('  Press CTRL+C to stop the server'));
  console.log(chalk.cyan('═'.repeat(60)) + '\n');
  
  logger.info(`Server started on port ${PORT} (PID: ${process.pid}) - Frontend: ${reactBuildExists ? 'React' : 'Not Built'}`);
});

module.exports = app;