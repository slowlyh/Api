import { useState, useEffect } from 'react'
import { Clock, Zap, TrendingUp, Server, Cpu, HardDrive, RefreshCw } from 'lucide-react'
import axios from 'axios'

const Status = ({ metadata }) => {
  const [status, setStatus] = useState({})
  const [health, setHealth] = useState({})
  const [cache, setCache] = useState({})
  const [realtimeStats, setRealtimeStats] = useState([])
  const [topEndpoints, setTopEndpoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statusRes, healthRes, cacheRes, realtimeRes, topRes] = await Promise.all([
        axios.get('/api/status'),
        axios.get('/api/health'),
        axios.get('/api/cache/stats'),
        axios.get('/api/stats/realtime'),
        axios.get('/api/stats/top?limit=10')
      ])

      if (statusRes.data.status) setStatus(statusRes.data.result)
      if (healthRes.data.status) setHealth(healthRes.data.result)
      if (cacheRes.data.status) setCache(cacheRes.data.result)
      if (realtimeRes.data.status) setRealtimeStats(realtimeRes.data.result || [])
      if (topRes.data.status) setTopEndpoints(topRes.data.result || [])

      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Failed to fetch status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatPercentage = (value) => {
    return (value * 100).toFixed(1) + '%'
  }

  if (loading && !status.status) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-blink"></div>
            <span className="text-green-400 font-semibold">All Systems Operational</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">System Status</span>
          </h1>
          <p className="text-xl text-gray-400">
            Real-time monitoring of API performance and system health
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-3xl font-bold mb-2">{status.uptime || 'Loading...'}</div>
            <div className="text-sm text-green-400 flex items-center gap-1">
              <TrendingUp size={16} />
              <span>99.9%</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-gray-400">Response Time</div>
            </div>
            <div className="text-3xl font-bold mb-2">&lt;100ms</div>
            <div className="text-sm text-green-400 flex items-center gap-1">
              <span>Optimal</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-gray-400">Total Requests</div>
            </div>
            <div className="text-3xl font-bold mb-2">{status.reqTotal || '0'}</div>
            <div className="text-sm text-green-400 flex items-center gap-1">
              <span>Active</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-gray-400">Endpoints</div>
            </div>
            <div className="text-3xl font-bold mb-2">{status.featureTotal || '0'}</div>
            <div className="text-sm text-green-400 flex items-center gap-1">
              <span>All Active</span>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card mb-12">
          <h3 className="text-2xl font-bold mb-6 text-gradient">System Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Platform</div>
              <div className="text-lg font-semibold font-mono">{health.platform || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Node Version</div>
              <div className="text-lg font-semibold font-mono">{health.nodeVersion || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">CPU Cores</div>
              <div className="text-lg font-semibold font-mono">{health.cpuCores || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Total Memory</div>
              <div className="text-lg font-semibold font-mono">{formatBytes(health.totalMemory)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Free Memory</div>
              <div className="text-lg font-semibold font-mono">{formatBytes(health.freeMemory)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Process Memory</div>
              <div className="text-lg font-semibold font-mono">{formatBytes(health.memoryUsage?.heapUsed)}</div>
            </div>
          </div>
        </div>

        {/* Cache Performance */}
        <div className="card mb-12">
          <h3 className="text-2xl font-bold mb-6 text-gradient">Cache Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Cache Hits</div>
              <div className="text-lg font-semibold font-mono">{cache.hits || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Cache Misses</div>
              <div className="text-lg font-semibold font-mono">{cache.misses || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Hit Ratio</div>
              <div className="text-lg font-semibold font-mono mb-2">
                {cache.hits_ratio ? formatPercentage(cache.hits_ratio) : '0%'}
              </div>
              <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: cache.hits_ratio ? `${cache.hits_ratio * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Cached Keys</div>
              <div className="text-lg font-semibold font-mono">{cache.keys || 0}</div>
            </div>
          </div>
        </div>

        {/* Top Endpoints */}
        {topEndpoints.length > 0 && (
          <div className="card mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gradient">Most Requested Endpoints</h3>
            <div className="space-y-3">
              {topEndpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg hover:bg-dark-hover transition-colors">
                  <code className="text-sm font-mono text-primary">{endpoint.endpoint}</code>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{endpoint.count} requests</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchData}
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          {lastUpdated && (
            <p className="text-sm text-gray-400 mt-4">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Status
