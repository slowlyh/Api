import { useState, useEffect, useCallback } from 'react'
import { Search, X, Copy, Play, Check, Menu, Home, ChevronDown, ChevronUp, Activity, Layers, Zap, ChevronRight } from 'lucide-react'

const Docs = ({ metadata }) => {
  const [endpoints, setEndpoints] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedEndpoints, setExpandedEndpoints] = useState({})
  const [testParams, setTestParams] = useState({})
  const [testResults, setTestResults] = useState({})
  const [testLoading, setTestLoading] = useState({})
  const [copied, setCopied] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Route management
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    // Parse current route
    const path = window.location.pathname
    const categoryMatch = path.match(/\/category\/([^/]+)/)
    if (categoryMatch) {
      setSelectedCategory(decodeURIComponent(categoryMatch[1]))
    } else {
      setSelectedCategory(null)
    }
    setCurrentPath(path)
  }, [])

  useEffect(() => {
    // Fetch endpoints
    fetch('/api/endpoints')
      .then(response => response.json())
      .then(data => {
        if (data.status && data.result) {
          setEndpoints(data.result)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch endpoints:', error)
        setLoading(false)
      })
  }, [])

  const totalFeatures = Object.values(endpoints).reduce((sum, items) => sum + items.length, 0)
  const totalCategories = Object.keys(endpoints).length

  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    
    const categoryMatch = path.match(/\/category\/([^/]+)/)
    if (categoryMatch) {
      setSelectedCategory(decodeURIComponent(categoryMatch[1]))
    } else {
      setSelectedCategory(null)
    }
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(window.location.origin + text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const toggleEndpoint = (categoryIndex, endpointIndex) => {
    const key = `${categoryIndex}-${endpointIndex}`
    setExpandedEndpoints(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleTest = async (endpoint, key) => {
    setTestLoading(prev => ({ ...prev, [key]: true }))
    setTestResults(prev => ({ ...prev, [key]: null }))

    try {
      let url = endpoint.path
      const params = testParams[key] || {}
      
      Object.entries(params).forEach(([paramKey, value]) => {
        url = url.replace(`${paramKey}=`, `${paramKey}=${encodeURIComponent(value)}`)
      })

      const response = await fetch(url)
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.startsWith('image/')) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        setTestResults(prev => ({ 
          ...prev, 
          [key]: { success: response.ok, data: null, imageUrl, isImage: true } 
        }))
      } else {
        const data = await response.json()
        setTestResults(prev => ({ 
          ...prev, 
          [key]: { success: response.ok, data, isImage: false } 
        }))
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [key]: { 
          success: false, 
          data: { error: error.message },
          isImage: false
        } 
      }))
    } finally {
      setTestLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  const updateTestParam = useCallback((key, paramName, value) => {
    setTestParams(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [paramName]: value
      }
    }))
  }, [])

  const extractParams = (path) => {
    const matches = path.match(/[?&]([^=]+)=/g)
    if (!matches) return []
    return matches.map(m => m.replace(/[?&]/g, '').replace('=', ''))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const DashboardView = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          {metadata.apititle || 'API'}
        </h1>
        <p className="text-base md:text-lg text-gray-400">
          Next-generation API with random features for developers.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg">
              <Activity className="text-blue-400" size={20} />
            </div>
            <span className="px-2 md:px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">API Status</p>
          <p className="text-lg md:text-2xl font-bold">Live</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg">
              <Layers className="text-blue-400" size={20} />
            </div>
          </div>
          <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Categories</p>
          <p className="text-lg md:text-2xl font-bold">{totalCategories}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg">
              <Zap className="text-purple-400" size={20} />
            </div>
          </div>
          <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Requests</p>
          <p className="text-lg md:text-2xl font-bold">0</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-pink-500/20 rounded-lg">
              <Zap className="text-pink-400" size={20} />
            </div>
          </div>
          <p className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">Features</p>
          <p className="text-lg md:text-2xl font-bold">{totalFeatures}</p>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Getting Started</h2>
        <p className="text-sm md:text-base text-gray-400 mb-4">
          Welcome to the API documentation. Select a category from the sidebar to explore available endpoints.
        </p>
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
            <div>
              <p className="font-medium mb-1 text-sm md:text-base">Browse Categories</p>
              <p className="text-xs md:text-sm text-gray-400">Choose from {totalCategories} available categories in the sidebar</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
            <div>
              <p className="font-medium mb-1 text-sm md:text-base">Select an Endpoint</p>
              <p className="text-xs md:text-sm text-gray-400">Click on any endpoint to view details and parameters</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
            <div>
              <p className="font-medium mb-1 text-sm md:text-base">Try It Out</p>
              <p className="text-xs md:text-sm text-gray-400">Test endpoints directly in the browser with the interactive tool</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const CategoryView = () => {
    const categoryEndpoints = endpoints[selectedCategory] || []
    const filteredEndpoints = categoryEndpoints.filter(endpoint =>
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 capitalize bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            {selectedCategory}
          </h1>
          <p className="text-base md:text-lg text-gray-400">
            {categoryEndpoints.length} Endpoints
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search endpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 md:py-4 bg-slate-900 border border-slate-800 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm md:text-base"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Endpoints */}
        <div className="space-y-3 md:space-y-4">
          {filteredEndpoints.map((endpoint, index) => {
            const key = `${selectedCategory}-${index}`
            const isExpanded = expandedEndpoints[key]
            const params = extractParams(endpoint.path)
            const testResult = testResults[key]
            const isTestLoading = testLoading[key]

            return (
              <div key={index} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
                {/* Endpoint Header */}
                <div 
                  className="p-4 md:p-6 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  onClick={() => toggleEndpoint(selectedCategory, index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                        <span className="px-2 md:px-3 py-1 bg-slate-950 text-gray-100 text-xs md:text-sm font-semibold rounded-lg">
                          {endpoint.method}
                        </span>
                        <code className="text-blue-400 text-xs md:text-sm break-all">{endpoint.path}</code>
                      </div>
                      <h3 className="text-base md:text-lg font-medium mb-1">{endpoint.name}</h3>
                      <p className="text-gray-400 text-xs md:text-sm">{endpoint.desc}</p>
                    </div>
                    <button className="p-2 hover:bg-slate-950 rounded-lg transition-colors flex-shrink-0">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Endpoint Details */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950">
                    <div className="p-4 md:p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Play size={18} className="text-blue-500" />
                        <h4 className="font-semibold text-sm md:text-base">TRY IT OUT</h4>
                      </div>

                      {/* Method Tabs */}
                      <div className="flex gap-2 border-b border-slate-800">
                        <button className="px-3 md:px-4 py-2 border-b-2 border-blue-500 font-medium text-sm md:text-base">
                          {endpoint.method}
                        </button>
                      </div>

                      {/* Parameters */}
                      {params.length > 0 && (
                        <div className="space-y-3">
                          {params.map(param => {
                            const inputId = `input-${key}-${param}`
                            return (
                              <div key={param}>
                                <label htmlFor={inputId} className="block text-xs md:text-sm mb-2">
                                  {param} <span className="text-red-400">*</span>
                                </label>
                                <input
                                  id={inputId}
                                  type="text"
                                  placeholder={`Input ${param} for generating response.`}
                                  value={testParams[key]?.[param] || ''}
                                  onChange={(e) => updateTestParam(key, param, e.target.value)}
                                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-900 border border-slate-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all text-sm md:text-base"
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Execute Button */}
                      <button
                        onClick={() => handleTest(endpoint, key)}
                        disabled={isTestLoading}
                        className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                      >
                        {isTestLoading ? 'Loading...' : 'Execute'}
                      </button>

                      {/* Test Result */}
                      {testResult && (
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 md:p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-3 h-3 rounded-full ${testResult.success ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <span className="font-semibold text-sm md:text-base">{testResult.success ? 'Success' : 'Error'}</span>
                          </div>
                          {testResult.isImage ? (
                            <div className="mt-3">
                              <img 
                                src={testResult.imageUrl} 
                                alt="API Response" 
                                className="max-w-full h-auto rounded-lg border border-slate-800"
                              />
                            </div>
                          ) : (
                            <pre className="text-xs md:text-sm text-gray-300 overflow-x-auto">
                              {JSON.stringify(testResult.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}

                      {/* cURL Command */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs md:text-sm font-medium">CURL COMMAND</span>
                        </div>
                        <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-3 md:p-4">
                          <pre className="text-xs md:text-sm text-gray-300 overflow-x-auto pr-10">
                            {`curl -X ${endpoint.method} "${window.location.origin}${endpoint.path}"`}
                          </pre>
                          <button
                            onClick={() => handleCopy(endpoint.path, `curl-${key}`)}
                            className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            {copied === `curl-${key}` ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* HTTP Status Codes */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs md:text-sm font-medium">HTTP STATUS CODES</span>
                        </div>
                        <div className="border border-slate-800 rounded-lg overflow-hidden overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-900">
                              <tr>
                                <th className="text-left p-3 md:p-4 text-xs md:text-sm font-medium">Code</th>
                                <th className="text-left p-3 md:p-4 text-xs md:text-sm font-medium">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              <tr>
                                <td className="p-3 md:p-4">
                                  <div className="flex items-center gap-2">
                                    <Check size={16} className="text-green-400" />
                                    <span className="font-medium text-sm">200</span>
                                  </div>
                                </td>
                                <td className="p-3 md:p-4 text-xs md:text-sm text-gray-400">OK - Request successful</td>
                              </tr>
                              <tr>
                                <td className="p-3 md:p-4">
                                  <div className="flex items-center gap-2">
                                    <X size={16} className="text-red-400" />
                                    <span className="font-medium text-sm">400</span>
                                  </div>
                                </td>
                                <td className="p-3 md:p-4 text-xs md:text-sm text-gray-400">Bad Request - Invalid parameters</td>
                              </tr>
                              <tr>
                                <td className="p-3 md:p-4">
                                  <div className="flex items-center gap-2">
                                    <X size={16} className="text-red-400" />
                                    <span className="font-medium text-sm">405</span>
                                  </div>
                                </td>
                                <td className="p-3 md:p-4 text-xs md:text-sm text-gray-400">Method Not Allowed</td>
                              </tr>
                              <tr>
                                <td className="p-3 md:p-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-yellow-400 text-sm">⚠</span>
                                    <span className="font-medium text-sm">429</span>
                                  </div>
                                </td>
                                <td className="p-3 md:p-4 text-xs md:text-sm text-gray-400">Too Many Requests</td>
                              </tr>
                              <tr>
                                <td className="p-3 md:p-4">
                                  <div className="flex items-center gap-2">
                                    <X size={16} className="text-red-400" />
                                    <span className="font-medium text-sm">500</span>
                                  </div>
                                </td>
                                <td className="p-3 md:p-4 text-xs md:text-sm text-gray-400">Internal Server Error</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-slate-800">
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            {metadata.apititle || 'API'}
          </h2>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          <div className="space-y-2">
            {/* Dashboard */}
            <button
              onClick={() => navigateTo('/')}
              className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                !selectedCategory ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800'
              }`}
            >
              <Home size={18} />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* Categories Section */}
            <div className="pt-4 pb-2 px-2">
              <p className="text-xs text-gray-500 uppercase font-semibold">Categories</p>
            </div>
            
            <div className="space-y-2">
              {Object.entries(endpoints).map(([category, items]) => (
                <button
                  key={category}
                  onClick={() => navigateTo(`/category/${encodeURIComponent(category)}`)}
                  className={`w-full group rounded-lg transition-all ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50' 
                      : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium capitalize text-sm md:text-base ${
                        selectedCategory === category ? 'text-blue-400' : 'text-gray-200'
                      }`}>
                        {category}
                      </span>
                      <ChevronRight size={16} className={`${
                        selectedCategory === category ? 'text-blue-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{items.length} endpoints</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        selectedCategory === category 
                          ? 'bg-blue-500/30 text-blue-300' 
                          : 'bg-slate-700 text-gray-300'
                      }`}>
                        {items.length}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 md:px-8 py-6 md:py-12 max-w-7xl lg:ml-0">
          {selectedCategory ? <CategoryView /> : <DashboardView />}
        </div>
      </div>
    </div>
  )
}

export default Docs