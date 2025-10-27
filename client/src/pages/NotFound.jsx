import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-20">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="text-9xl font-bold text-gradient mb-8 animate-pulse-slow">
            404
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          
          {/* Description */}
          <p className="text-xl text-gray-400 mb-10">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Decorative Element */}
          <div className="mt-16 opacity-20">
            <svg className="w-64 h-64 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
