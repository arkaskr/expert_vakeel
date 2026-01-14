import React, { memo } from 'react'
import appStoreBadge from '../assets/appstore.webp'
import googlePlayBadge from '../assets/googleplay.webp'

type Props = {
  className?: string
}

const DownloadButtons: React.FC<Props> = memo(({ className }) => {
  return (
    <div className={className ? className : 'download-buttons'}>
      <a href="#" className="download-button">
        <div className="download-button-image">
          <img
            src={appStoreBadge}
            alt="Download on the App Store"
            className="app-store-badge"
            loading="lazy"
            decoding="async"
          />
        </div>
      </a>
      <a href="#" className="download-button">
        <div className="download-button-image">
          <img
            src={googlePlayBadge}
            alt="GET IT ON Google Play"
            className="google-play-badge"
            loading="lazy"
            decoding="async"
          />
        </div>
      </a>
    </div>
  )
})

DownloadButtons.displayName = 'DownloadButtons'

export default DownloadButtons


