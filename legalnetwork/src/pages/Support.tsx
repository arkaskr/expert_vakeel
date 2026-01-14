import React, { useState, memo } from 'react'
// import dotenv from 'dotenv'

const API_BASE_URL = 'https://api.legalnetwork.in/api'

const Support: React.FC = memo(() => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    briefExplanation: ''
  })

  // Add additional state for API integration
  const [error, setError] = useState<string>('')
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Map form data to API expected format
      const apiData = {
        userId: formData.email, // Using email as userId for now (you might want to generate a unique ID)
        userType: 'CLIENT', // Default to CLIENT, you can add a dropdown to select user type
        purpose: 'SUPPORT', // Default purpose
        category: 'GENERAL', // Default category, you can add a dropdown for categories
        title: `Support Request from ${formData.fullName}`,
        description: `${formData.briefExplanation}`,
        status: 'PENDING'
      }

      const response = await fetch(`${API_BASE_URL}/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit support request')
      }

      // Show success message
      setIsSubmitted(true)

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        contactNumber: '',
        briefExplanation: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setError(error instanceof Error ? error.message : 'There was an error submitting your form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="support-page p-responsive">
      <section className="support-header text-center mb-responsive">
        <div className="container-fluid">
          <h1 className="support-title heading-responsive">We're Eagerly Waiting To<br />Hear From You!</h1>
          <p className="support-subtitle text-responsive">
            We offer our services to a range of client base including those dealing with commerce and industry. Our beneficiaries in criminal litigation cases also include different multinational corporations, public sector bodies, and individual business owners.
          </p>
        </div>
      </section>

      <section className="support-content-fullscreen">
        <div className="support-grid-fullscreen stack-responsive gap-responsive">
          <div className="contact-form-section-fullscreen card-responsive">
            <h2 className="form-title-fullscreen">
              Fill Up Our Quick Form & We'll Be In Touch!
            </h2>
            <p className="form-subtitle-fullscreen text-responsive">
              We'll Get Back To You Within 24 Hours. Thanks.
            </p>

            {error && (
              <div className="error-message" style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ffcdd2',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {isSubmitted ? (
              <div className="success-message text-center">
                <div className="success-icon">✓</div>
                <h3 className="success-title">Thank You!</h3>
                <p className="success-text text-responsive">
                  Your message has been received successfully. We'll get back to you within 24 hours.
                </p>
                <button
                  className="submit-button-fullscreen full-width-mobile"
                  onClick={() => setIsSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form-fullscreen" onSubmit={handleSubmit}>
                <div className="form-group-fullscreen">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter Your Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input-fullscreen"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group-fullscreen">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input-fullscreen"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group-fullscreen">
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Enter Your Contact Number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="form-input-fullscreen"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group-fullscreen">
                  <textarea
                    name="briefExplanation"
                    placeholder="Explain In Brief Here!"
                    value={formData.briefExplanation}
                    onChange={handleInputChange}
                    className="form-textarea-fullscreen"
                    rows={4}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className="submit-button-fullscreen full-width-mobile"
                  disabled={isSubmitting}
                  style={{
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></span>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Now'
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="contact-info-section-fullscreen card-responsive text-center">
            <h2 className="contact-title-fullscreen">Write To Us</h2>
            <div className="contact-details-fullscreen mb-responsive">
              <p className="contact-item-fullscreen text-responsive">info@legalnetwork.in</p>
              <p className="contact-item-fullscreen text-responsive">+91-9711840150</p>
            </div>

            <h2 className="contact-title-fullscreen whatsapp-title-fullscreen">
              Connect Us On Whats App
            </h2>
          </div>
        </div>
      </section>
<br />
      {/* Experience Section */}
    </div>
  )
})

Support.displayName = 'Support'

export default Support
