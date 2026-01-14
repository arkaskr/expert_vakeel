import React, { useState, memo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoImage from '../assets/logo.png'  
import './Header.css'

const Header: React.FC = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname])
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [])
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  return (
    <header className="header">
      <div className="container-fluid">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img src={logoImage} alt="Legal Network Logo" className="logo-image" />
          </Link>

          <nav className="nav-desktop">
            <ul className="nav-desktop-list">
              <li className="nav-desktop-item">
                <Link
                  to="/how-it-works"
                  className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li className="nav-desktop-item">
                <Link
                  to="/about"
                  className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                >
                  About Legal Network
                </Link>
              </li>
              <li className="nav-desktop-item">
                <Link
                  to="/pricing"
                  className={`nav-link ${isActive('/pricing') ? 'active' : ''}`}
                >
                  Pricing
                </Link>
              </li>
              <li className="nav-desktop-item">
                <Link
                  to="/support"
                  className={`nav-link ${isActive('/support') ? 'active' : ''}`}
                >
                  Help & Support
                </Link>
              </li>
              {/* <li className="nav-desktop-item">
                <Link
                  to="/download"
                  className={`nav-link ${isActive('/download') ? 'active' : ''}`}
                >
                  Download The App
                </Link>
              </li> */}
            </ul>
          </nav>

          <button
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>
        </div>

        <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-mobile-list">
            <li className="nav-mobile-item">
              <Link
                to="/how-it-works"
                className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li className="nav-mobile-item">
              <Link
                to="/about"
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                About Legal Network
              </Link>
            </li>
            <li className="nav-mobile-item">
              <Link
                to="/pricing"
                className={`nav-link ${isActive('/pricing') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Pricing
              </Link>
            </li>
            <li className="nav-mobile-item">
              <Link
                to="/support"
                className={`nav-link ${isActive('/support') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Help & Support
              </Link>
            </li>
            {/* <li className="nav-mobile-item">
              <Link
                to="/download"
                className={`nav-link ${isActive('/download') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Download The App
              </Link>
            </li> */}
        </ul>
      </nav>
      </div>
    </header>
  )
})

Header.displayName = 'Header'

export default Header