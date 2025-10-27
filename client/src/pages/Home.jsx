import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Book, TrendingUp, Bot, Download, Image, Sparkles, Zap, Code } from 'lucide-react'
import axios from 'axios'

const Home = ({ metadata }) => {
  const [stats, setStats] = useState({
    totalEndpoints: '13+',
    totalRequests: '0',
    uptime: '99.9%',
    responseTime: '<100ms'
  })

  useEffect(() => {
    // Fetch API status
    axios.get('/api/status')
      .then(response => {
        if (response.data.status && response.data.result) {
          const data = response.data.result
          setStats({
            totalEndpoints: data.featureTotal || '13+',
            totalRequests: data.reqTotal || '0',
            uptime: data.uptime || '99.9%',
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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-full mb-8 animate-slide-down">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Modern API Service</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              <span className="text-gradient">{metadata.apititle || 'API Service'}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Powerful RESTful API with AI integration, media downloaders, random content generators, and image processing tools. Built for developers who need reliable and fast API services.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/docs" className="btn-primary inline-flex items-center justify-center gap-2">
                <Book className="w-5 h-5" />
                View Documentation
              </Link>
              <Link to="/status" className="btn-secondary inline-flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                API Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-card/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-gradient">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to build amazing applications with our comprehensive API
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white mb-6 glow group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              <span className="text-gradient">API Statistics</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-5xl font-bold text-gradient mb-2">{stats.totalEndpoints}</div>
              <div className="text-gray-400">API Endpoints</div>
            </div>
            <div className="card text-center">
              <div className="text-5xl font-bold text-gradient mb-2">{stats.totalRequests}</div>
              <div className="text-gray-400">Total Requests</div>
            </div>
            <div className="card text-center">
              <div className="text-5xl font-bold text-gradient mb-2">{stats.uptime}</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="card text-center">
              <div className="text-5xl font-bold text-gradient mb-2">{stats.responseTime}</div>
              <div className="text-gray-400">Avg Response</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
