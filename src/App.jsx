import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'

import Footer from './components/Footer'
import ContactUs from './pages/ContactUs'
import EventFormPage from './pages/EventFormPage'
import EventDetailsPage from './pages/EventDetailsPage'
import { getLatestEvent } from './api/events'

function ScrollBehavior() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

// Resolves the latest upcoming event and redirects to its registration
// page. Used for '/' and any unmatched route instead of a hardcoded GUID.
function LatestEventRedirect() {
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    getLatestEvent()
      .then((event) => {
        if (cancelled) return
        const guid = event?.guid ?? event?.id ?? event?.eventGuId ?? event?.guId
        if (guid) {
          navigate(`/event/register/${guid}`, { replace: true })
        } else {
          setFailed(true)
        }
      })
      .catch((err) => {
        console.error('Failed to resolve latest event for redirect:', err)
        if (!cancelled) setFailed(true)
      })

    return () => { cancelled = true }
  }, [navigate])

  if (failed) {
    return (
      <div className="relative z-10 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-6 py-16 max-w-md">
          <h2 className="text-2xl font-bold text-[#5D5D5D] mb-3 font-satoshi">
            No Events Available
          </h2>
          <p className="text-[#737373] text-sm leading-relaxed font-satoshi">
            Please check back soon.
          </p>
        </div>
      </div>
    )
  }

  // Brief loading state while the latest event resolves
  return (
    <div className="relative z-10 bg-white min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#C55F61] animate-bounce [animation-delay:-0.2s]" />
        <span className="h-2 w-2 rounded-full bg-[#C55F61] animate-bounce [animation-delay:-0.1s]" />
        <span className="h-2 w-2 rounded-full bg-[#C55F61] animate-bounce" />
      </div>
    </div>
  )
}

function AppFrame() {
  const location = useLocation()
  const isEventPage = location.pathname.startsWith('/event') || location.pathname === '/contact'
  const isEventRegisterPage = location.pathname.startsWith('/event/register')
  const isEventDetailsPage = /^\/event\/[^/]+$/.test(location.pathname) && !isEventRegisterPage
  const isContactPage = location.pathname === '/contact'

  const getTitle = () => {
    if (isContactPage) return 'Contact Us'
    if (isEventRegisterPage) return null
    if (isEventDetailsPage) return null
    if (location.pathname === '/') return null
    if (isEventPage) return 'Events'
    return null
  }

  return (
    <div className="appShell">
      <main className="appMain">
        <Routes>
          <Route path="/" element={<LatestEventRedirect />} />
          <Route path="/event/register" element={<EventFormPage />} />
          <Route path="/event/register/:id" element={<EventFormPage />} />
          <Route path="/event/:id" element={<EventDetailsPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="*" element={<LatestEventRedirect />} />
        </Routes>
      </main>
      {!isEventRegisterPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppFrame />
    </BrowserRouter>
  )
}

export default App