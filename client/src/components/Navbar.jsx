import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'

const Navbar = ({ metadata }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const location = useLocation()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-dark-card/80 backdrop-blur-lg border-b border-dark-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gradient hover:opacity-80 transition-opacity">
            {metadata.apititle || 'API Service'}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-gray-300 hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/docs"
              className={`font-medium transition-colors ${
                isActive('/docs') ? 'text-primary' : 'text-gray-300 hover:text-primary'
              }`}
            >
              Documentation
            </Link>
            <Link
              to="/status"
              className={`font-medium transition-colors ${
                isActive('/status') ? 'text-primary' : 'text-gray-300 hover:text-primary'
              }`}
            >
              Status
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-dark-hover hover:bg-dark-border transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-dark-hover hover:bg-dark-border transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-dark-border">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`font-medium transition-colors ${
                  isActive('/') ? 'text-primary' : 'text-gray-300 hover:text-primary'
                }`}
              >
                Home
              </Link>
              <Link
                to="/docs"
                onClick={() => setIsOpen(false)}
                className={`font-medium transition-colors ${
                  isActive('/docs') ? 'text-primary' : 'text-gray-300 hover:text-primary'
                }`}
              >
                Documentation
              </Link>
              <Link
                to="/status"
                onClick={() => setIsOpen(false)}
                className={`font-medium transition-colors ${
                  isActive('/status') ? 'text-primary' : 'text-gray-300 hover:text-primary'
                }`}
              >
                Status
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
