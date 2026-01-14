import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import AppRoutes from './routes/AppRoutes'
import './styles/global.css'

// Loading component for better UX
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '18px',
    color: '#1e3c72',
    fontWeight: '600'
  }}>
    Loading...
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <AppRoutes />
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
