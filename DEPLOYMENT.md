# 🚀 Deployment Guide

> Complete guide for deploying the API service in production environments

## 📊 Quick Links

- [Docker Deployment](#1-docker-deployment-recommended) (Recommended)
- [Manual Deployment](#2-manual-deployment)
- [CI/CD Setup](#3-cicd-deployment)
- [Monitoring](#-monitoring)
- [Configuration](#-configuration)
- [Production Checklist](#-production-checklist)

---

## 📦 Deployment Options

### 1. Docker Deployment (Recommended)

#### Quick Start
```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop
docker-compose down
```

#### Custom Configuration
```bash
# Create .env file
cp .env.example .env

# Edit configuration
nano .env

# Start with custom config
docker-compose up -d
```

#### Access Services
- **API**: http://localhost:1038
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

---

### 2. Manual Deployment

#### Prerequisites
- Node.js 18+
- npm or yarn
- PM2 (for production)

#### Steps
```bash
# Install dependencies
npm install --production

# Create .env
cp .env.example .env

# Start with PM2
pm2 start index.js --name api

# View logs
pm2 logs api

# Monitor
pm2 monit
```

---

### 3. CI/CD Deployment

#### GitHub Actions
Automatic testing and deployment on push to main branch.

**Workflows**:
- `test.yml` - Run tests on all branches
- `deploy.yml` - Deploy to production on main branch

**Setup**:
1. Workflows are already configured in `.github/workflows/`
2. No lock file required (uses `npm install`)
3. Push to any branch to run tests:
```bash
git push origin your-branch
```

4. Push to main branch for deployment:
```bash
git push origin main
```

5. Check Actions tab for status

**Optional: Configure Deployment**:
Add secrets to GitHub repository for automated deployment:
- `SERVER_HOST` - Your server IP/domain
- `SERVER_USER` - SSH username
- `SSH_PRIVATE_KEY` - SSH private key

Then uncomment deployment step in `deploy.yml`

---

## 🐳 Docker Commands

### Build
```bash
# Build image
docker build -t api .

# Build with tag
docker build -t api:v2.0 .
```

### Run
```bash
# Run container
docker run -d \
  -p 1038:1038 \
  -e NODE_ENV=production \
  --name api \
  api

# Run with volume mounts
docker run -d \
  -p 1038:1038 \
  -v $(pwd)/logs:/app/logs \
  -v $(pwd)/metadata.json:/app/metadata.json:ro \
  --name api \
  api
```

### Manage
```bash
# View logs
docker logs -f api

# Stop
docker stop api

# Remove
docker rm api

# Execute command
docker exec -it api sh
```

---

## 📊 Monitoring

### Real-time Statistics
Access live stats at: http://localhost:1038/status

**Available Statistics**:
- Live endpoint performance tracking
- Request counts per endpoint
- Average response times
- Success/failure rates
- Top requested endpoints
- Slowest endpoints

**API Endpoints**:
```bash
# Real-time stats
curl http://localhost:1038/api/stats/realtime

# Top endpoints
curl http://localhost:1038/api/stats/top?limit=10

# Slowest endpoints
curl http://localhost:1038/api/stats/slowest?limit=10

# Specific endpoint stats
curl http://localhost:1038/api/stats/endpoint?path=/ai/oss
```

### Prometheus Metrics
Access metrics at: http://localhost:1038/metrics

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
```bash
# Basic health check
curl http://localhost:1038/health

# Detailed health metrics
curl http://localhost:1038/api/health

# Cache statistics
curl http://localhost:1038/api/cache/stats
```

### Grafana Dashboard
1. Access: http://localhost:3000
2. Login: admin/admin
3. Add Prometheus data source: http://prometheus:9090
4. Import dashboard or create custom

---

## 💾 Data Management

### Cache Management
```bash
# View cache statistics
curl http://localhost:1038/api/cache/stats

# Clear all cache
curl -X POST http://localhost:1038/api/cache/clear
```

### Log Files
Logs are stored in `logs/` directory with daily rotation:
- `error-YYYY-MM-DD.log` - Error logs
- `combined-YYYY-MM-DD.log` - All logs
- `access-YYYY-MM-DD.log` - Access logs

**Log Management**:
```bash
# View recent logs
tail -f logs/combined-$(date +%Y-%m-%d).log

# View error logs
tail -f logs/error-$(date +%Y-%m-%d).log

# Clean old logs (older than 14 days)
find logs/ -name "*.log" -mtime +14 -delete
```

---

## 🔧 Configuration

### Environment Variables
```env
PORT=1038
NODE_ENV=production
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
CORS_ORIGIN=*
CACHE_TTL=300
```

### Metadata Configuration
Edit `metadata.json` for complete branding:
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

### Endpoints Configuration
Edit `endpoints.json` to customize available endpoints:
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

## 🔄 Updates

### Docker Update
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up -d --build
```

### Manual Update
```bash
# Pull changes
git pull origin main

# Install dependencies
npm install --production

# Restart
pm2 restart api
```

---

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs api

# Check container status
docker ps -a

# Inspect container
docker inspect api

# Check health
docker-compose ps
```

### Port already in use
```bash
# Find process using port
netstat -ano | findstr :1038  # Windows
lsof -i :1038                 # Linux/Mac

# Change port in .env
PORT=8080

# Or stop conflicting service
docker-compose down
```

### Metrics not showing
```bash
# Check metrics endpoint
curl http://localhost:1038/metrics

# Check Prometheus config
docker-compose logs prometheus

# Check Prometheus targets
# Visit: http://localhost:9090/targets
```

### High memory usage
```bash
# Check memory stats
docker stats api

# Clear cache
curl -X POST http://localhost:1038/api/cache/clear

# Restart container
docker-compose restart api
```

### Logs not appearing
```bash
# Check log directory permissions
ls -la logs/

# Check Winston configuration
cat utils/logger.js

# View container logs
docker logs -f api
```

### Rate limit issues
```bash
# Check current rate limit settings
cat .env | grep RATE_LIMIT

# Adjust in .env
RATE_LIMIT_MAX_REQUESTS=100

# Restart to apply
docker-compose restart api
```

---

## 🔗 Reverse Proxy Setup

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:1038;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Caddy Configuration
```caddy
api.yourdomain.com {
    reverse_proxy localhost:1038
}
```

---

## 📚 Additional Resources

### Documentation
- [API README](README.md) - Complete API documentation
- [Docker Documentation](https://docs.docker.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [Insomnia](https://insomnia.rest/) - API client
- [UptimeRobot](https://uptimerobot.com/) - Uptime monitoring
- [Sentry](https://sentry.io/) - Error tracking

---

## 📝 Notes

- Default port: **1038** (configurable)
- Health check: `GET /health`
- Metrics: `GET /metrics`
- Status page: `http://localhost:1038/status`
- Documentation: `http://localhost:1038/docs`
- All endpoints return JSON format
- Rate limiting is enabled by default
- Logs rotate daily automatically

---

**Version**: 2.1.0  
**Last Updated**: October 25, 2025  
**Status**: Production Ready ✅
