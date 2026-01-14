import React, { memo } from 'react'
import DownloadButtons from './DownloadButtons'
import smartphoneImage from '../assets/GIF3.gif'

const CTA: React.FC = memo(() => {
  return (
    <section className="cta-section">
      <div className="container-fluid">
        <div className="cta-content">
          <div className="cta-text">
            <h2 className="cta-title">
              <span className="cta-gray">Get Started with</span> <span className="cta-black">Legal</span> <span className="cta-blue">Network</span> <span className="cta-gray">Today!</span>
            </h2>
            <p className="cta-subtitle">
              Connect with verified lawyers, collaborate on legal matters, share insights, and grow your legal career — all in one powerful app.
            </p>
            
            <DownloadButtons className="cta-download-buttons" />
          </div>
          
          <div className="cta-visual">
            <img 
              src={smartphoneImage} 
              alt="Legal Network App"
              className="cta-smartphone-image"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
})

CTA.displayName = 'CTA'

export default CTA
