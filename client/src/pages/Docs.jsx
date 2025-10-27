import { useState, useEffect } from 'react'
import { Search, X, Copy, Play, Check } from 'lucide-react'
import axios from 'axios'

const Docs = ({ metadata }) => {
  const [endpoints, setEndpoints] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)
  const [testParams, setTestParams] = useState({})
  const [testResult, setTestResult] = useState(null)
  const [testLoading, setTestLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Fetch endpoints
    axios.get('/api/endpoints')
      .then(response => {
        if (response.data.status && response.data.result) {
          setEndpoints(response.data.result)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch endpoints:', error)
        setLoading(false)
      })
  }, [])

  const filteredEndpoints = Object.entries(endpoints).reduce((acc, [category, items]) => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {})

  const handleCopy = (text) => {
    navigator.clipboard.writeText(window.location.origin + text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTest = async (endpoint) => {
    setTestLoading(true)
    setTestResult(null)

    try {
      // Build URL with params
      let url = endpoint.path
      Object.entries(testParams).forEach(([key, value]) => {
        url = url.replace(`${key}=`, `${key}=${encodeURIComponent(value)}`)
      })

      const response = await axios.get(url)
      setTestResult({ success: true, data: response.data })
    } catch (error) {
      setTestResult({ 
        success: false, 
        data: error.response?.data || { error: error.message } 
      })
    } finally {
      setTestLoading(false)
    }
  }

  const openModal = (endpoint) => {
    setSelectedEndpoint(endpoint)
    setTestParams({})
    setTestResult(null)
  }

  const closeModal = () => {
    setSelectedEndpoint(null)
    setTestParams({})
    setTestResult(null)
  }

  if (loading) {
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
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">{metadata.apititle || 'API'}</span>
          </h1>
          <p className="text-xl text-gray-400">
            Next-generation API with random features for developers.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-dark-card border border-dark-border rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
        </div>

        {/* Endpoints */}
        {Object.keys(filteredEndpoints).length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No endpoints found</h3>
            <p className="text-gray-400">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(filteredEndpoints).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-3xl font-bold mb-6 capitalize text-gradient">
                  {category}
                </h2>
                <div className="grid gap-4">
                  {items.map((endpoint, index) => (
                    <div key={index} className="card group cursor-pointer" onClick={() => openModal(endpoint)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-lg">
                              {endpoint.method}
                            </span>
                            <h3 className="text-xl font-semibold">{endpoint.name}</h3>
                            {endpoint.status === 'Active' && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 mb-3">{endpoint.desc}</p>
                          <code className="text-sm bg-dark-bg px-3 py-2 rounded-lg text-primary block overflow-x-auto">
                            {endpoint.path}
                          </code>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopy(endpoint.path)
                          }}
                          className="p-2 rounded-lg bg-dark-hover hover:bg-primary/20 hover:text-primary transition-all"
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEndpoint && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-dark-border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedEndpoint.name}</h3>
                  <p className="text-gray-400">{selectedEndpoint.desc}</p>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Endpoint URL */}
              <div>
                <div className="flex items-center gap-2 bg-dark-bg p-4 rounded-lg">
                  <code className="flex-1 text-primary overflow-x-auto">
                    {window.location.origin}{selectedEndpoint.path}
                  </code>
                  <button
                    onClick={() => handleCopy(selectedEndpoint.path)}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Test Result */}
              {testResult && (
                <div className="bg-dark-bg rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${testResult.success ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="font-semibold">{testResult.success ? 'Success' : 'Error'}</span>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}

              {testLoading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Docs
