import React, { useState, memo } from 'react'

const Contact: React.FC = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
  }

  return (
    <div className="contact-page p-responsive">
      <section className="contact-page-header text-center mb-responsive">
        <h1 className="contact-page-title heading-responsive">Contact Us</h1>
        <p className="contact-page-subtitle text-responsive">
          Have questions? We're here to help. Reach out to us anytime.
        </p>
      </section>

      <section className="contact-content stack-responsive gap-responsive">
        <div className="info-section grid-responsive-2 gap-responsive">
          <div className="info-card card-responsive">
            <div className="info-icon">📧</div>
            <h3 className="info-title">Email</h3>
            <p className="info-text text-responsive">support@legalnetwork.com</p>
          </div>

          <div className="info-card card-responsive">
            <div className="info-icon">📱</div>
            <h3 className="info-title">Phone</h3>
            <p className="info-text text-responsive">+1 (555) 123-4567</p>
          </div>

          <div className="info-card card-responsive">
            <div className="info-icon">📍</div>
            <h3 className="info-title">Office</h3>
            <p className="info-text text-responsive">123 Legal Street, Suite 100<br/>New York, NY 10001</p>
          </div>

          <div className="info-card card-responsive">
            <div className="info-icon">🕐</div>
            <h3 className="info-title">Hours</h3>
            <p className="info-text text-responsive">Mon-Fri: 9:00 AM - 6:00 PM<br/>Sat-Sun: Closed</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form card-responsive">
          <h2 className="contact-form-title">Send us a Message</h2>

          <div className="form-group">
            <label htmlFor="name" className="form-label">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">Subject *</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="membership">Membership</option>
              <option value="partnership">Partnership Opportunity</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="form-textarea"
              placeholder="Tell us how we can help you..."
            />
          </div>

          <button type="submit" className="form-submit-button full-width-mobile">
            Send Message
          </button>
        </form>
      </section>
    </div>
  )
})

Contact.displayName = 'Contact'

export default Contact
