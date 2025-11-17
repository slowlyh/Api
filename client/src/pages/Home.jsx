import { useState, useEffect } from 'react'
import { Book, TrendingUp, Bot, Download, Image, Sparkles, Zap, Code, Menu, X, ExternalLink } from 'lucide-react'

const Home = ({ metadata }) => {
  const [stats, setStats] = useState({
    totalEndpoints: '13+',
    totalRequests: '0',
    uptime: '99.9%',
    responseTime: '<100ms'
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Fetch API status
    fetch('/api/status')
      .then(response => response.json())
      .then(data => {
        if (data.status && data.result) {
          const result = data.result
          setStats({
            totalEndpoints: result.featureTotal || '13+',
            totalRequests: result.reqTotal || '0',
            uptime: result.uptime || '99.9%',
            responseTime: '<100ms'
          })
        }
      })
      .catch(error => {
        console.error('Failed to fetch stats:', error)
      })
  }, [])

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'AI Integration',
      description: 'Access GPT OSS 120B for powerful AI chat capabilities with thinking mode enabled'
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'Media Downloaders',
      description: 'Download videos from CapCut, Facebook, Twitter, SnackVideo, and MediaFire'
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: 'Random Content',
      description: 'Get random anime images, waifu pictures, and Blue Archive characters'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Image Processing',
      description: 'AI-powered image unblur and upscale for enhanced image quality'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast & Reliable',
      description: 'High-performance API with minimal latency and maximum uptime'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Easy Integration',
      description: 'Simple RESTful endpoints with comprehensive documentation'
    }
  ]

  const navigateTo = (path) => {
    window.location.href = path
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button 
              onClick={() => navigateTo('/')}
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              {metadata.apititle || 'API Service'}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigateTo('/docs')}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                <Book className="w-4 h-4" />
                Documentation
              </button>
              <button
                onClick={() => navigateTo('/status')}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                API Status
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    navigateTo('/docs')
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  <Book className="w-4 h-4" />
                  Documentation
                </button>
                <button
                  onClick={() => {
                    navigateTo('/status')
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  API Status
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 md:py-20 px-4">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full mb-6 md:mb-8">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                <span className="text-blue-400 font-medium text-sm md:text-base">Modern API Service</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  {metadata.apititle || 'API Service'}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-xl text-gray-400 mb-8 md:mb-10 max-w-3xl mx-auto">
                Powerful RESTful API with AI integration, media downloaders, random content generators, and image processing tools. Built for developers who need reliable and fast API services.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <button
                  onClick={() => navigateTo('/docs')}
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors text-sm md:text-base"
                >
                  <Book className="w-4 h-4 md:w-5 md:h-5" />
                  View Documentation
                </button>
                <button
                  onClick={() => navigateTo('/status')}
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors text-sm md:text-base"
                >
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                  API Status
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20 bg-slate-900/50 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  Powerful Features
                </span>
              </h2>
              <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
                Everything you need to build amazing applications with our comprehensive API
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors group">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  API Statistics
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-center hover:border-blue-500/50 transition-colors">
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stats.totalEndpoints}
                </div>
                <div className="text-xs md:text-base text-gray-400">API Endpoints</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-center hover:border-blue-500/50 transition-colors">
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stats.totalRequests}
                </div>
                <div className="text-xs md:text-base text-gray-400">Total Requests</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-center hover:border-blue-500/50 transition-colors">
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stats.uptime}
                </div>
                <div className="text-xs md:text-base text-gray-400">Uptime</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-center hover:border-blue-500/50 transition-colors">
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stats.responseTime}
                </div>
                <div className="text-xs md:text-base text-gray-400">Avg Response</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Brand */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-3 md:mb-4">
                {metadata.apititle || 'API Service'}
              </h3>
              <p className="text-sm md:text-base text-gray-400 mb-4">
                Modern RESTful API service providing AI integration, media tools, and more.
              </p>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-400">All systems operational</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigateTo('/docs')}
                    className="text-sm md:text-base text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <Book className="w-4 h-4" />
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('/status')}
                    className="text-sm md:text-base text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    API Status
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('/')}
                    className="text-sm md:text-base text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Home
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <span className="text-sm md:text-base text-gray-400">API Version: 1.0</span>
                </li>
                <li>
                  <span className="text-sm md:text-base text-gray-400">Uptime: {stats.uptime}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-800 text-center">
            <p className="text-xs md:text-sm text-gray-400">
              © {new Date().getFullYear()} {metadata.apititle || 'API Service'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home