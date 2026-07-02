import { Link, useLocation } from "react-router-dom";
import toast_logo_red from '@/assets/toast_logo_red.png'
import { ArrowLeft } from 'lucide-react'

export default function EventsHeader({ title = 'Events', breadcrumb, showBreadcrumb = true } = {}) {
  const hasTitle = Boolean(title)
  const location = useLocation()
  const isEventsPage = location.pathname === '/'

  return (
    <header aria-label="Events page header" className="relative z-10" style={{ backgroundColor: '#FFF6F3' }}>
      <div className="relative mx-auto w-full max-w-container px-8 max-sm:px-6 py-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Left: Logo */}
          <div className="flex justify-start">
            <Link to="/" aria-label="Toast Wedding Fair" className="transition-opacity hover:opacity-90 shrink-0">
              <img
                src={toast_logo_red}
                alt="Toast Wedding Fair"
                className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: Empty placeholder to maintain grid balance */}
          <div />

          {/* Right: Contact Button */}
          <div className="flex justify-end">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200"
              style={{
                background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.boxShadow = '0px 4px 12px rgba(197, 95, 97, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Title area — only when title is provided (non-/ routes) */}
        {hasTitle && (
          <div className="pt-8 pb-4">
            <h1 className="m-0 text-center font-bold uppercase tracking-hero text-[48px] sm:text-[64px] md:text-[80px] text-[#121212] font-saira animate-fade-in-up">
              {title}
            </h1>

            {showBreadcrumb && breadcrumb && (
              <nav
                aria-label="Breadcrumb"
                className="mt-4 flex justify-center text-sm text-[#737373] animate-fade-in-up delay-100 font-satoshi"
              >
                {breadcrumb}
              </nav>
            )}
          </div>
        )}

        {/* Back Arrow — only when not on /events, not on event details, and no breadcrumb */}
        {!isEventsPage && !breadcrumb && !location.pathname.startsWith('/event/') && (
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 text-[#737373] hover:text-[#C55F61] transition-colors text-sm group font-satoshi"
            aria-label="Back to Events"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Events</span>
          </Link>
        )}
      </div>
    </header>
  )
}
