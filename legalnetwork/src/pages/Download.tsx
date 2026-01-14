import React, { memo } from 'react'

const Download: React.FC = memo(() => {
  return (
    <div className="download-page p-responsive">
      <section className="download-header text-center mb-responsive">
        <h1 className="download-page-title heading-responsive">Download The App</h1>
        <p className="download-page-subtitle text-responsive">
          Get LegalNetwork on your mobile device for access anywhere, anytime
        </p>
      </section>

      <section className="download-content stack-responsive gap-responsive">
        <div className="app-preview flex-center">
          <div className="phone-mockup-download">
            <div className="phone-screen-download">
              <div className="app-icon-download">⚖️</div>
              <h3 className="app-name-download">LegalNetwork</h3>
              <p className="app-description-download">Professional Legal Network</p>
            </div>
          </div>
        </div>

        <div className="download-section card-responsive">
          <h2 className="download-section-title">Available Now</h2>
          <div className="download-store-buttons stack-responsive gap-responsive">
            <a href="#" className="store-button full-width-mobile">
              <div className="store-icon">🍎</div>
              <div className="store-info">
                <div className="store-text">Download on the</div>
                <div className="store-name">App Store</div>
              </div>
            </a>
            <a href="#" className="store-button full-width-mobile">
              <div className="store-icon">🤖</div>
              <div className="store-info">
                <div className="store-text">Get it on</div>
                <div className="store-name">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        <div className="download-features card-responsive">
          <h2 className="download-section-title">App Features</h2>
          <div className="feature-grid-download grid-responsive-2 gap-responsive">
            <div className="feature-download card-responsive">
              <div className="feature-icon-download">📱</div>
              <div>
                <h3 className="feature-title-download">Mobile Access</h3>
                <p className="feature-text-download text-responsive">
                  Access your professional network and legal resources on the go
                </p>
              </div>
            </div>
            <div className="feature-download card-responsive">
              <div className="feature-icon-download">🔔</div>
              <div>
                <h3 className="feature-title-download">Push Notifications</h3>
                <p className="feature-text-download text-responsive">
                  Stay updated with instant notifications for messages and opportunities
                </p>
              </div>
            </div>
            <div className="feature-download card-responsive">
              <div className="feature-icon-download">💬</div>
              <div>
                <h3 className="feature-title-download">Secure Messaging</h3>
                <p className="feature-text-download text-responsive">
                  Communicate securely with other legal professionals
                </p>
              </div>
            </div>
            <div className="feature-download card-responsive">
              <div className="feature-icon-download">📁</div>
              <div>
                <h3 className="feature-title-download">Document Access</h3>
                <p className="feature-text-download text-responsive">
                  View and manage your legal documents and resources
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="system-requirements card-responsive">
          <h2 className="download-section-title">System Requirements</h2>
          <div className="requirements-grid grid-responsive-2 gap-responsive">
            <div className="requirement card-responsive">
              <h3 className="requirement-title">iOS</h3>
              <p className="requirement-text text-responsive">
                Requires iOS 12.0 or later. Compatible with iPhone, iPad, and iPod touch.
              </p>
            </div>
            <div className="requirement card-responsive">
              <h3 className="requirement-title">Android</h3>
              <p className="requirement-text text-responsive">
                Requires Android 8.0 or later. Compatible with smartphones and tablets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
})

Download.displayName = 'Download'

export default Download
