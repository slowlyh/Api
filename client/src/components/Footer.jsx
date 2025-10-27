import { Github, MessageCircle, Youtube } from 'lucide-react'

const Footer = ({ metadata }) => {
  return (
    <footer className="bg-dark-card border-t border-dark-border py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 {metadata.creator || 'API Service'}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {metadata.github && metadata.github !== '#' && (
              <a
                href={metadata.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-hover hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            )}
            {metadata.whatsapp && metadata.whatsapp !== '#' && (
              <a
                href={metadata.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-hover hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            )}
            {metadata.youtube && metadata.youtube !== '#' && (
              <a
                href={metadata.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-hover hover:bg-primary/20 hover:text-primary transition-all"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
