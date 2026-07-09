import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react'

import Footer from './components/Footer'
import Header from './components/Header'
import EventsHeader from './components/EventsHeader'
import ContactUs from './pages/ContactUs'
import EventFormPage from './pages/EventFormPage'
import EventPage from './pages/EventPage'
import EventDetailsPage from './pages/EventDetailsPage'

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

function AppFrame() {
  const location = useLocation()
  const isEventPage = location.pathname.startsWith('/event') || location.pathname === '/' || location.pathname === '/contact'
  const isEventRegisterPage = location.pathname === '/event/register'
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
      
      {isEventPage ? (
        <EventsHeader
          title={getTitle()}
          breadcrumb={undefined}
        />
      ) : (
        <Header />
      )}
      <ScrollBehavior />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<EventPage />} />
          <Route path="/event/register" element={<EventFormPage />} />
          <Route path="/event/:id" element={<EventDetailsPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
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
