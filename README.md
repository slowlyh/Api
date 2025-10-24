# 🚀 Modern API Service

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, production-ready RESTful API service built with Express.js providing various endpoints for AI chat, media downloaders, random content generators, and image processing tools. Features comprehensive logging, caching, real-time monitoring, and Docker support.

## ✨ Key Features

- 🤖 **AI Integration** - GPT OSS 120B chat capabilities
- 📥 **Media Downloaders** - Facebook, Twitter/X, CapCut, MediaFire, SnackVideo
- 🎲 **Random Content** - Anime images, waifu, Blue Archive characters
- 🛠️ **Image Tools** - AI-powered unblur and upscale
- 📊 **Real-time Monitoring** - Live endpoint statistics and performance tracking
- 🔒 **Multi-tier Rate Limiting** - Smart rate limiting with different tiers
- 🐳 **Docker Ready** - Full containerization with Docker Compose
- 📈 **Prometheus Metrics** - Production-grade monitoring
- 🎨 **Modern UI** - Beautiful documentation and status pages

## 📋 Quick Info

| Property | Value |
|----------|-------|
| **Language** | JavaScript (Node.js 18+) |
| **Framework** | Express.js 4.x |
| **Port** | 1038 (configurable) |
| **Architecture** | Modular route-based |
| **Monitoring** | Prometheus + Real-time stats |
| **Deployment** | Docker, Docker Compose, CI/CD |
| **Version** | 2.1.0 |
| **Status** | Production Ready ✅ |

## Project Structure
```
├─ .github/workflows/     # CI/CD pipelines
│  ├─ deploy.yml         # Deployment workflow
│  └─ test.yml           # Testing workflow
├─ page/                  # HTML pages
│  ├─ index.html         # Landing page
│  ├─ docs.html          # API documentation
│  ├─ status.html        # Status monitoring
│  ├─ 404.html           # Not found page
│  └─ 500.html           # Error page
├─ public/                # Static assets
│  ├─ styles.css         # Global styles
│  ├─ index.js           # Home page script
│  ├─ docs.js            # Documentation script
│  └─ status.js          # Status page script
├─ config/                # Configuration files
│  └─ config.js          # Centralized config loader
├─ middlewares/           # Express middlewares
│  ├─ errorHandler.js    # Error handling
│  ├─ rateLimiter.js     # Rate limiting (multi-tier)
│  └─ validator.js       # Request validation
├─ utils/                 # Utility functions
│  ├─ helpers.js         # Helper functions
│  ├─ logger.js          # Winston logger (daily rotation)
│  ├─ cache.js           # Caching system (NodeCache)
│  └─ metrics.js         # Prometheus metrics
├─ src/                   # API route modules
│  ├─ ai/                # AI endpoints
│  │  └─ oss.js         # GPT OSS 120B chat
│  ├─ api/               # API info endpoints
│  │  ├─ api.js         # Status endpoint
│  │  ├─ metadata.js    # Metadata endpoint
│  │  ├─ endpoints.js   # Endpoints list
│  │  ├─ health.js      # Health checks
│  │  ├─ cache.js       # Cache management
│  │  ├─ metrics.js     # Metrics endpoint
│  │  └─ stats.js       # Realtime statistics
│  ├─ download/          # Media downloader endpoints
│  │  ├─ capcut.js
│  │  ├─ fb.js
│  │  ├─ mediafire.js
│  │  ├─ snackvideo.js
│  │  └─ x.js
│  ├─ random/            # Random content generators
│  │  ├─ random-bluearchive.js
│  │  ├─ random-papayang.js
│  │  └─ random-waifu.js
│  └─ tools/             # Utility tools
│     └─ unblur.js      # Image unblur/upscale
├─ logs/                  # Log files (auto-generated)
├─ Dockerfile            # Docker container config
├─ docker-compose.yml    # Docker Compose setup
├─ prometheus.yml        # Prometheus configuration
├─ .env.example          # Environment variables template
├─ .gitignore            # Git ignore rules
├─ endpoints.json        # API endpoints documentation
├─ metadata.json         # Creator info & branding
├─ function.js           # Global function loader
├─ index.js              # Main entry point
└─ package.json          # Dependencies
```

## 🎯 Features

### 🤖 AI Integration
- **GPT OSS 120B** - Advanced AI chat with thinking mode
- Open-source model via Gradient Network
- Conversational AI capabilities

### 📥 Media Downloaders
| Platform | Features |
|----------|----------|
| **CapCut** | No watermark, HD quality |
| **Facebook** | SD/HD options, direct download |
| **Twitter/X** | Videos & images support |
| **SnackVideo** | Full video download |
| **MediaFire** | Direct file download |

### 🎲 Random Content Generators
- **Blue Archive** - Random character images from the game
- **Waifu** - Curated anime waifu images
- **Pap Ayang** - Romantic couple images

### 🛠️ Image Processing Tools
- **AI Unblur** - Enhance blurry images
- **Upscale** - Increase image resolution
- **Smart Processing** - AI-powered enhancement

### 📊 Monitoring & Analytics

#### Real-time Statistics
- Live endpoint performance tracking
- Request count per endpoint
- Average response times
- Success/failure rates
- Top requested endpoints
- Slowest endpoints identification

#### Health Monitoring
- System metrics (CPU, Memory, Uptime)
- Process information
- Cache statistics
- Request tracking

#### Prometheus Metrics
- HTTP request counters
- Response time histograms
- Active requests gauge
- Cache hit/miss ratios
- Error tracking by type

### 🔒 Security & Performance

#### Multi-tier Rate Limiting
| Tier | Limit | Endpoints |
|------|-------|----------|
| **General** | 30 req/min | Most API endpoints |
| **Strict** | 5 req/min | AI endpoints |
| **Download** | 10 req/min | Media downloaders |
| **Status** | 100 req/min | Status/info endpoints |
| **Monitoring** | 200 req/min | Stats/metrics |
| **Static** | Unlimited | Pages & assets |

#### Security Headers
- Helmet.js integration
- CORS configuration
- XSS protection
- Content Security Policy

#### Performance Optimization
- Gzip compression
- In-memory caching (NodeCache)
- Response caching
- Static file optimization

#### Logging
- Winston logger with daily rotation
- Separate error/combined/access logs
- Structured logging format
- Log level configuration

### 🐳 DevOps & Deployment
- **Docker** - Multi-stage builds, optimized images
- **Docker Compose** - Full stack (API + Prometheus + Grafana)
- **CI/CD** - GitHub Actions workflows
- **Health Checks** - Docker health monitoring
- **Environment Config** - .env support

## How It Works
- **Modular Architecture**: Each endpoint is a separate module in `src/`
- **Auto-loading Routes**: Server automatically loads all `.js` files from `src/` subdirectories
- **Configuration System**: Separated config (metadata.json, endpoints.json, .env)
- **Middleware Pipeline**: Logging, metrics, rate limiting, error handling
- **Global Utilities**: Helper functions available globally via `function.js`
- **Monitoring**: Prometheus metrics collection on every request

## 📡 API Endpoints

### 🤖 AI Endpoints

#### Chat with GPT OSS 120B
```http
GET /ai/oss?text=<query>
```
**Parameters:**
- `text` (required) - Your question or prompt

**Example:**
```bash
curl "http://localhost:1038/ai/oss?text=What is Node.js?"
```

**Response:**
```json
{
  "status": true,
  "result": {
    "response": "Node.js is a JavaScript runtime...",
    "thinking": "Analyzing the question..."
  }
}
```

---

### 📥 Download Endpoints

#### CapCut Video Downloader
```http
GET /download/capcut?url=<capcut_url>
```

#### Facebook Video Downloader
```http
GET /download/facebook?url=<fb_url>
```

#### Twitter/X Media Downloader
```http
GET /download/x?url=<twitter_url>
```

#### SnackVideo Downloader
```http
GET /download/snackvideo?url=<snack_url>
```

#### MediaFire File Downloader
```http
GET /download/mediafire?url=<mediafire_url>
```

**Example:**
```bash
curl "http://localhost:1038/download/facebook?url=https://facebook.com/video/123"
```

---

### 🎲 Random Content Endpoints

```http
GET /random/ba          # Random Blue Archive image
GET /random/waifu       # Random anime waifu
GET /random/papayang    # Random romantic image
```

**Response:**
```json
{
  "status": true,
  "result": {
    "url": "https://...",
    "title": "Character name"
  }
}
```

---

### 🛠️ Tools Endpoints

#### Image Unblur & Upscale
```http
GET /tools/unblur?url=<image_url>
```

**Example:**
```bash
curl "http://localhost:1038/tools/unblur?url=https://example.com/image.jpg"
```

---

### 📊 Monitoring Endpoints

#### Server Status
```http
GET /api/status
```
Returns server uptime, request count, and basic statistics.

#### Detailed Health Check
```http
GET /api/health
```
Returns comprehensive system metrics:
- CPU usage
- Memory usage
- Process information
- Cache statistics
- Request counts

#### Real-time Statistics
```http
GET /api/stats/realtime
```
Live endpoint performance data with request counts and response times.

#### Endpoint-Specific Stats
```http
GET /api/stats/endpoint?path=/ai/oss
```

#### Top Endpoints
```http
GET /api/stats/top?limit=10
```
Most requested endpoints.

#### Slowest Endpoints
```http
GET /api/stats/slowest?limit=10
```
Endpoints with highest average response time.

#### Reset Statistics
```http
POST /api/stats/reset
```
Clear all collected statistics.

---

### 🗄️ Cache Management

```http
GET  /api/cache/stats   # Cache statistics
POST /api/cache/clear   # Clear all cache
```

---

### ℹ️ API Information

```http
GET /api/metadata       # API metadata & creator info
GET /api/endpoints      # List all available endpoints
```

---

### 📈 Metrics

```http
GET /metrics            # Prometheus metrics
GET /health             # Basic health check
```

## Adding a New Endpoint

1. **Create a new file** in the appropriate `src/` subdirectory:

```js
// src/category/endpoint-name.js
module.exports = function (app) {
  // Optional: Import required modules
  const axios = require('axios');
  
  // Define your endpoint logic
  async function yourFunction(param) {
    try {
      // Your logic here
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  // Register the route
  app.get("/category/endpoint", async (req, res) => {
    try {
      const { param } = req.query;
      
      // Validate input
      if (!param) {
        return res.status(400).json({
          status: false,
          error: 'Parameter is required'
        });
      }
      
      const result = await yourFunction(param);
      
      res.status(200).json({
        status: true,
        result: result
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  });
};
```

2. **Update `endpoints.json`** to include your endpoint in the documentation:

```json
{
  "category": [
    {
      "name": "Endpoint Name",
      "desc": "Description of what it does",
      "method": "GET",
      "status": "Active",
      "path": "/category/endpoint?param="
    }
  ]
}
```

3. **Restart the server** - The endpoint will be automatically loaded!

## Available Scripts

```bash
# Development
npm start              # Start the server
npm run dev            # Start with auto-reload (nodemon)

# Docker
npm run docker:build   # Build Docker image
npm run docker:run     # Run Docker container
npm run docker:up      # Start with docker-compose
npm run docker:down    # Stop docker-compose
npm run docker:logs    # View docker logs

# Testing
npm test               # Run tests
```

## Installation

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```
Edit `.env` file with your configuration:
```env
PORT=1038
LOG_LEVEL=info
```

**Note**: Creator info and branding are configured in `metadata.json`, not `.env`

4. **Start the server**
```bash
npm start
```

Server will run on `http://localhost:1038`

## Docker Deployment

### Quick Start with Docker Compose
```bash
# Start all services (API + Prometheus + Grafana)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down
```

### Access Services
- **API**: http://localhost:1038
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

### Manual Docker Build
```bash
# Build image
docker build -t api .

# Run container
docker run -d -p 1038:1038 --name api api

# View logs
docker logs -f api
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

## Monitoring

### Prometheus Metrics
Access metrics at: `http://localhost:1038/metrics`

**Available Metrics**:
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request duration histogram
- `http_requests_active` - Active requests gauge
- `endpoint_response_time_seconds` - Response time per endpoint
- `cache_hits_total` - Cache hits counter
- `cache_misses_total` - Cache misses counter
- `cache_size` - Current cache size
- `errors_total` - Total errors by type

### Health Checks
- `GET /health` - Basic health check
- `GET /api/health` - Detailed system metrics

### Logs
Logs are stored in `logs/` directory with daily rotation:
- `error-YYYY-MM-DD.log` - Error logs
- `combined-YYYY-MM-DD.log` - All logs
- `access-YYYY-MM-DD.log` - Access logs

## Development

### Project Guidelines
- Follow existing code style and patterns
- Use async/await for asynchronous operations
- Add proper error handling with try-catch
- Validate user inputs before processing
- Document complex functions with JSDoc comments

### Environment Variables
| Variable | Description | Default |
|----------|-------------|----------|
| `PORT` | Server port | 1038 |
| `NODE_ENV` | Environment (development/production) | development |
| `LOG_LEVEL` | Logging level (debug/info/warn/error) | info |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 60000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 30 |

**Note**: Creator info (`creator`, `whatsapp`, `github`, etc.) is configured in `metadata.json`, not environment variables.

## 📤 Response Format

All endpoints return JSON with a consistent format:

### ✅ Success Response
```json
{
  "status": true,
  "creator": "<from metadata.json>",
  "result": {
    // Endpoint-specific data
  }
}
```

**Example:**
```json
{
  "status": true,
  "creator": "@YourName",
  "result": {
    "message": "Success",
    "data": {...}
  }
}
```

### ❌ Error Response
```json
{
  "status": false,
  "creator": "<from metadata.json>",
  "error": "Error message"
}
```

**Example:**
```json
{
  "status": false,
  "creator": "@YourName",
  "error": "Invalid URL parameter"
}
```

### 📊 Statistics Response
```json
{
  "status": true,
  "result": {
    "endpoints": [
      {
        "endpoint": "/ai/oss",
        "requests": 150,
        "avgResponseTime": "245ms",
        "successRate": "98.5%"
      }
    ]
  }
}
```

## Error Handling

- **400 Bad Request**: Invalid or missing parameters
- **404 Not Found**: Endpoint does not exist
- **429 Too Many Requests**: Rate limit exceeded (30 requests/minute)
- **500 Internal Server Error**: Server-side error

## Rate Limiting

API implements multi-tier rate limiting:
- **General API**: 30 requests/minute per IP
- **AI Endpoints**: 5 requests/minute (strict)
- **Download Endpoints**: 10 requests/minute
- **Status/Info**: 100 requests/minute
- **Monitoring**: 200 requests/minute
- **Static Files & Pages**: No limit

Exceeding limits returns HTTP 429 with retry-after header.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing code style and patterns
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style Guidelines
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Handle errors properly with try-catch
- Validate user inputs
- Follow the modular pattern for new endpoints

## Troubleshooting

### Server won't start
- Check if port 1038 is already in use
- Verify all dependencies are installed (`npm install`)
- Check `.env` file configuration

### Module not found errors
- Run `npm install` to install missing dependencies
- Check `package.json` for required packages

### API returns errors
- Check request parameters are correct
- Verify URL format for downloader endpoints
- Check server logs for detailed error messages

## Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [HIGH_PRIORITY_FEATURES.md](HIGH_PRIORITY_FEATURES.md) - High priority features documentation

## Tech Stack

### Core
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: JavaScript (CommonJS)

### Security & Performance
- **Security**: Helmet (security headers)
- **Compression**: Gzip compression
- **Rate Limiting**: express-rate-limit (multi-tier)
- **Caching**: node-cache (in-memory)

### Monitoring & Logging
- **Logging**: Winston (daily rotation)
- **Metrics**: prom-client (Prometheus)
- **Monitoring**: Prometheus + Grafana

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Health Checks**: Basic health monitoring

## License

MIT License - see LICENSE file for details

## Configuration

### metadata.json
Configure API branding and creator information:
```json
{
  "creator": "Your Name",
  "whatsapp": "https://wa.me/yourphone",
  "github": "https://github.com/yourusername",
  "youtube": "https://t.me/yourusername",
  "favicon": "/public/favicon.ico",
  "apititle": "Your API Name"
}
```

### endpoints.json
Define available endpoints for documentation:
```json
{
  "Category Name": [
    {
      "name": "Endpoint Name",
      "desc": "Description",
      "method": "GET",
      "status": "Active",
      "path": "/path/to/endpoint?param="
    }
  ]
}
```

## Credits

Configurable via `metadata.json`

## Support

Configurable via `metadata.json`

---

**Version**: 2.1.0  
**Status**: Production Ready  
**Note**: This API is for educational purposes. Please respect rate limits and use responsibly.
