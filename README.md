# 🚀 API Service

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Modern RESTful API with AI chat, media downloaders, and real-time monitoring.

## ✨ Features

- 🤖 AI Chat (GPT OSS 120B)
- 📥 Media Downloaders (Facebook, Twitter/X, CapCut, MediaFire, SnackVideo)
- 🎲 Random Content (Anime, Waifu, Blue Archive)
- 🛠️ Image Tools (Unblur, Upscale)
- 📊 Real-time Statistics
- 🔒 Multi-tier Rate Limiting
- 🐳 Docker Ready

## 📋 Info

**Stack**: Node.js 18+ • Express.js 4.x • Docker  
**Port**: 1038 (configurable)  
**Version**: 2.1.0

## 📁 Structure

```
├─ src/           # API endpoints (auto-loaded)
├─ page/          # HTML pages (docs, status)
├─ public/        # Static assets & scripts
├─ config/        # Configuration
├─ middlewares/   # Rate limiting, validation
├─ utils/         # Logger, cache, metrics
├─ metadata.json  # API branding
└─ endpoints.json # Endpoint definitions
```

## 🚀 Quick Start

```bash
# Install
npm install

# Configure
cp .env.example .env
# Edit metadata.json with your info

# Run
npm start
# → http://localhost:1038

# Docker
docker-compose up -d
```

## ⚙️ Configuration

**metadata.json** - API branding:
```json
{
  "creator": "Your Name",
  "apititle": "Your API",
  "github": "https://github.com/you",
  "whatsapp": "https://wa.me/phone",
  "favicon": "/public/favicon.ico"
}
```

**.env** - Server config:
```env
PORT=1038
NODE_ENV=production
LOG_LEVEL=info
RATE_LIMIT_MAX_REQUESTS=30
```

## 📡 Endpoints

### AI
```bash
GET /ai/oss?text=<query>  # GPT chat
```

### Downloaders
```bash
GET /download/capcut?url=<url>
GET /download/facebook?url=<url>
GET /download/x?url=<url>
GET /download/snackvideo?url=<url>
GET /download/mediafire?url=<url>
```

### Random Content
```bash
GET /random/ba        # Blue Archive
GET /random/waifu     # Anime waifu
GET /random/papayang  # Romantic
```

### Tools
```bash
GET /tools/unblur?url=<image_url>  # Unblur & upscale
```

### Monitoring
```bash
GET /api/status              # Server status
GET /api/health              # Health metrics
GET /api/stats/realtime      # Live stats
GET /api/stats/top?limit=10  # Top endpoints
GET /api/cache/stats         # Cache stats
GET /metrics                 # Prometheus
```

**Full documentation**: http://localhost:1038/docs

## 🔧 Add Endpoint

1. Create `src/category/name.js`:
```js
module.exports = function (app) {
  app.get("/category/name", async (req, res) => {
    try {
      const { param } = req.query;
      if (!param) return res.status(400).json({ status: false, error: 'Required' });
      
      const result = await yourLogic(param);
      res.json({ status: true, result });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
```

2. Add to `endpoints.json`:
```json
{
  "Category": [{
    "name": "Name",
    "desc": "Description",
    "method": "GET",
    "path": "/category/name?param="
  }]
}
```

3. Restart server (auto-loaded)

## 🐳 Docker

```bash
# With Docker Compose (includes Prometheus + Grafana)
docker-compose up -d

# Manual
docker build -t api .
docker run -d -p 1038:1038 --name api api
```

**Services**:
- API: http://localhost:1038
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## 📊 Monitoring

**Pages**:
- Status: http://localhost:1038/status
- Docs: http://localhost:1038/docs

**Endpoints**:
- `/metrics` - Prometheus metrics
- `/api/health` - System health
- `/api/stats/realtime` - Live stats

**Logs**: `logs/` directory (daily rotation)

## 📤 Response Format

**Success**:
```json
{
  "status": true,
  "creator": "<from metadata.json>",
  "result": { ... }
}
```

**Error**:
```json
{
  "status": false,
  "creator": "<from metadata.json>",
  "error": "Error message"
}
```

## ⚠️ Error Codes

- **400** - Invalid parameters
- **404** - Endpoint not found
- **429** - Rate limit exceeded
- **500** - Server error

## 🔒 Rate Limits

- General: 30 req/min
- AI: 5 req/min
- Downloads: 10 req/min
- Monitoring: 200 req/min
- Static files: Unlimited

## 🛠️ Development

**Guidelines**:
- Use async/await
- Add error handling
- Validate inputs
- Follow existing patterns

**Scripts**:
```bash
npm start              # Start server
npm run dev            # Dev mode (nodemon)
npm run docker:build   # Build image
npm run docker:up      # Start compose
```

**Environment**:
- `PORT` - Server port (default: 1038)
- `NODE_ENV` - Environment mode
- `LOG_LEVEL` - Log level (info/warn/error)
- `RATE_LIMIT_MAX_REQUESTS` - Rate limit (default: 30/min)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Follow code style
4. Test changes
5. Submit pull request

## 🐛 Troubleshooting

**Port in use**:
```bash
# Windows
netstat -ano | findstr :1038
# Linux/Mac
lsof -i :1038
```

**Module errors**:
```bash
npm install
```

**Docker issues**:
```bash
docker-compose logs api
docker-compose restart api
```

## 📚 Resources

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [Docker Documentation](https://docs.docker.com/)
- [Express.js](https://expressjs.com/)
- [Prometheus](https://prometheus.io/)

## 📝 Configuration

Edit `metadata.json` for branding  
Edit `endpoints.json` for endpoint docs  
Edit `.env` for server settings

## 📄 License

MIT License - see LICENSE file for details

---