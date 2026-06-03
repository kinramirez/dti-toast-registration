import { Link, NavLink, useLocation } from "react-router-dom";
import rectangle from '@/assets/rectangle.png'
import dtiLogo from '@/assets/dti_wedding_fair_logo_colored.svg'
import { ArrowLeft } from 'lucide-react'

function navItemClassName({ isActive }) {
  return [
    'text-sm transition-colors',
    isActive ? 'text-[#1877F2]' : 'text-[#E8E8E8] hover:text-white',
  ].join(' ')
}

export default function EventsHeader({ title = 'Events', breadcrumb } = {}) {
  const hasTitle = Boolean(title)
  const location = useLocation()
  const isEventsPage = location.pathname === '/'

  return (
    <header aria-label="Events page header" className="text-white relative z-9">
      <div
        className="relative overflow-hidden bg-brand-dark bg-center bg-cover"
        style={{ backgroundImage: `url(${rectangle})` }}
      >
        <div className="absolute inset-0 bg-brand-dark/70" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-container px-8 max-sm:px-6 pt-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Left: Logo */}
            <div className="flex justify-start">
              <Link to="/" aria-label="DTI Wedding Fair" className="transition-opacity hover:opacity-90 shrink-0">
                <img
                  src={dtiLogo}
                  alt="DTI Wedding Fair"
                  className="h-12 sm:h-16 md:h-24 lg:h-32 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Center: Empty placeholder to maintain grid balance */}
            <div />

            {/* Right: Contact Button */}
            <div className="flex justify-end">
              <Link
                to="/contact"
                className="bg-[#1877F2] font-semibold hover:opacity-90 transition-opacity text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-saira whitespace-nowrap shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className={`pt-12 ${hasTitle ? 'pb-12' : 'pb-40'}`}>
            {hasTitle && (
              <>
                <h1 className="m-0 mt-8 text-center font-bold uppercase tracking-hero text-[80px] sm:text-hero-md md:text-hero animate-fade-in-up">
                  {title}
                </h1>

                {breadcrumb && (
                  <nav
                    aria-label="Breadcrumb"
                    className="mt-4 flex justify-center text-sm text-white/80 animate-fade-in-up delay-100"
                  >
                    {breadcrumb}
                  </nav>
                )}
              </>
            )}

            {/* Back Arrow — below title, bottom-left, only when not on /events */}
            {!isEventsPage && !breadcrumb && (
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm group"
                aria-label="Back to Events"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Events</span>
              </Link>
            )}
          </div>
        </div>

        <div className="h-[3px] bg-white/15" />
      </div>
    </header>
  )
}