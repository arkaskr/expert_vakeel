import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivacyPolicy from '../pages/Privacy-policy'

// Lazy load pages for better performance
const About = lazy(() => import('../pages/About'))
const Contact = lazy(() => import('../pages/Contact'))
const HowItWorks = lazy(() => import('../pages/HowItWorks'))
const Pricing = lazy(() => import('../pages/Pricing'))
const Support = lazy(() => import('../pages/Support'))
const Download = lazy(() => import('../pages/Download'))
const TermsOfUse = lazy(() => import('../pages/Terms-of-use'))

// Loading component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    fontSize: '16px',
    color: '#1e3c72'
  }}>
    Loading page...
  </div>
)

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/support" element={<Support />} />
        <Route path="/download" element={<Download />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
