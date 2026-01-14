import React, { memo } from 'react'
import CTA from '../components/CTA'
import smartphoneImage from '../assets/output-onlinegiftools.gif'

const About: React.FC = memo(() => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container-fluid">
          <div className="about-content stack-responsive">
            <div className="about-text">
              <h1 className="about-title heading-responsive">
                <div>Empowering Lawyers.</div>
                <div>Connecting the Legal</div>
                <div>Community.</div>
              </h1>

              <div className="about-description">
                <p className="about-intro text-responsive">
                  Empowering Lawyers. Connecting the Legal Community.<br />
                  Legal Network was founded with the vision of digitally transforming the legal profession in India. We believe that collaboration among lawyers should be seamless, transparent, and effective — and technology is the bridge to make it happen.
                </p>

                <p className="about-list-intro text-responsive">Our platform enables lawyers to:</p>

                <ul className="about-features">
                  <li>Build an online professional presence.</li>
                  <li>Connect with peers across India.</li>
                  <li>Stay updated with legal developments.</li>
                  <li>Manage cases efficiently.</li>
                  <li>Gain visibility among clients through Expert Vakeel.</li>
                </ul>

                <p className="about-conclusion text-responsive">
                  By integrating with official eCourts APIs, we bring real-time legal case management directly to mobile — helping lawyers stay informed and organized wherever they are.
                </p>
              </div>
            </div>

            <div className="about-visual flex-center">
              <div className="about-image-container">
                <img
                  src={smartphoneImage}
                  alt="Legal Network Mobile App"
                  className="about-smartphone-image img-responsive"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="about-detailed">
        <div className="container-fluid">
          <div className="about-detailed-content p-responsive">
            <h2 className="detailed-title heading-responsive">Empowering the Legal Community with Technology</h2>

            <div className="detailed-text">
              <p className="text-responsive">
                In an era where every industry is embracing digital transformation, the legal profession deserves a platform that truly understands its needs. Legal Network was born with that vision — to bring lawyers, law firms, and legal professionals onto a single, intelligent, and secure digital ecosystem that enables them to connect, collaborate, and succeed.
              </p>

              <p className="text-responsive">
                Legal Network is not just another app — it's a movement to modernize India's legal community. By merging technology with the traditional practice of law, we aim to simplify the professional lives of lawyers, foster stronger collaboration, and create opportunities for growth across the country.
              </p>
            </div>

            <div className="detailed-section">
              <h3 className="section-heading">Our Journey</h3>
              <p className="text-responsive">
                The idea for Legal Network started with a simple observation — while lawyers play a critical role in society, they often lack a unified platform to connect with peers, manage their practice efficiently, or stay informed about legal updates. Most networking happens offline, through courts or associations, making collaboration limited and time-consuming.
              </p>
              <p className="text-responsive">
                We wanted to change that.
              </p>
              <p className="text-responsive">
                Our team of legal and tech professionals came together to design a mobile-first platform that bridges the gap between connectivity and convenience. Today, Legal Network serves as India's first professional networking app exclusively for lawyers, helping them build relationships, share knowledge, and grow their careers in meaningful ways.
              </p>
            </div>

            <div className="detailed-section">
              <h3 className="section-heading">What We Offer</h3>
              <p className="text-responsive">
                Legal Network is built with the everyday needs of legal professionals in mind. From networking to news to case management, everything you need is available in one smart mobile app.
              </p>
              
              <div className="offerings-list grid-responsive-2 gap-responsive">
                <div className="offering-item card-responsive">
                  <h4 className="offering-title">1. Lawyer Networking</h4>
                  <p className="text-responsive">
                    Create your professional profile in minutes and start connecting with other lawyers based on specialization, court, city, gender, or services offered. Whether you're looking to collaborate, discuss a case, or build partnerships, Legal Network makes it easy and instant.
                  </p>
                </div>

                <div className="offering-item card-responsive">
                  <h4 className="offering-title">2. Secure Communication</h4>
                  <p className="text-responsive">
                    The app allows lawyers to chat directly and securely with each other. It's a safe, professional environment designed for legal discussions and collaborations — free from spam or unverified users.
                  </p>
                </div>

                <div className="offering-item card-responsive">
                  <h4 className="offering-title">3. Legal News and Updates</h4>
                  <p className="text-responsive">
                    Stay informed with the latest legal developments, judgments, and news from authentic, verified sources. Legal Network enables you to read, comment, and share important updates so you can remain at the forefront of your field.
                  </p>
                </div>

                <div className="offering-item card-responsive">
                  <h4 className="offering-title">4. Ask & Answer Legal Queries</h4>
                  <p className="text-responsive">
                    The platform encourages knowledge sharing by letting lawyers ask or answer legal questions across various domains. It's an open space for learning, discussing complex matters, and supporting fellow professionals — fostering a strong legal community.
                  </p>
                </div>

                <div className="offering-item card-responsive">
                  <h4 className="offering-title">5. Smart Legal Diary</h4>
                  <p className="text-responsive">
                    Never miss a hearing again. Legal Network comes integrated with the official eCourts API, which syncs your case updates, hearing dates, and status directly from the court database. You can organize cases, set reminders, and access everything you need — anytime, anywhere.
                  </p>
                </div>

                <div className="offering-item card-responsive">
                  <h4 className="offering-title">6. Expert Vakeel Integration</h4>
                  <p className="text-responsive">
                    Legal Network is directly connected with Expert Vakeel, a client-facing website that bridges lawyers with clients seeking legal help. When a lawyer registers on Legal Network, their profile automatically becomes visible on Expert Vakeel, allowing them to:
                  </p>
                  <ul className="sub-list">
                    <li>Receive client leads directly through website chat.</li>
                    <li>Answer public legal queries for increased visibility.</li>
                    <li>Build a credible online presence and reputation.</li>
                  </ul>
                  <p className="text-responsive">
                    This integration creates a powerful two-way ecosystem — lawyers grow their reach while clients find verified, reliable legal help.
                  </p>
                </div>
              </div>
            </div>

            <div className="detailed-section">
              <h3 className="section-heading">Why We're Different</h3>
              <p className="text-responsive">
                Legal Network stands apart because it's designed by people who understand the legal profession. Every feature is built to address a real-world challenge faced by lawyers today.
              </p>
              
              <div className="differentiators">
                <div className="differentiator-item">
                  <strong>Verified Community:</strong> Only registered lawyers and law firms are allowed, ensuring a professional, trustworthy network.
                </div>
                <div className="differentiator-item">
                  <strong>Real-time Case Updates:</strong> Official eCourts integration means reliable and timely information.
                </div>
                <div className="differentiator-item">
                  <strong>India-Focused:</strong> Every feature, from specialization filters to courts, is tailored for India's legal system.
                </div>
                <div className="differentiator-item">
                  <strong>Data Privacy:</strong> Communication and data are end-to-end secure, ensuring complete confidentiality.
                </div>
                <div className="differentiator-item">
                  <strong>Cross-Platform Visibility:</strong> The connection with Expert Vakeel boosts your online reputation and helps you attract clients organically.
                </div>
              </div>
            </div>

            <div className="detailed-section">
              <h3 className="section-heading">Our Impact</h3>
              <p>
                Since its inception, Legal Network has rapidly grown into a thriving community of legal professionals across India. Thousands of lawyers now rely on it daily to:
              </p>
              <ul className="impact-list">
                <li>Discover new connections and collaborations.</li>
                <li>Stay informed on legal developments.</li>
                <li>Manage their practice digitally.</li>
                <li>Gain online exposure and leads through Expert Vakeel.</li>
              </ul>
              <p>
                By bridging the gap between technology and law, Legal Network is redefining how Indian lawyers work, connect, and grow.
              </p>
            </div>

            <div className="detailed-section">
              <h3 className="section-heading">Our Values</h3>
              <div className="values-grid">
                <div className="value-item">
                  <strong>Trust:</strong> Every member of Legal Network is verified, ensuring authenticity and credibility.
                </div>
                <div className="value-item">
                  <strong>Integrity:</strong> We maintain the highest standards of privacy and professionalism in everything we do.
                </div>
                <div className="value-item">
                  <strong>Innovation:</strong> We constantly evolve our platform to meet the changing needs of legal professionals.
                </div>
                <div className="value-item">
                  <strong>Collaboration:</strong> We believe growth happens when lawyers connect, learn, and share knowledge.
                </div>
                <div className="value-item">
                  <strong>Empowerment:</strong> Our goal is to make technology a tool for empowerment, not complexity.
                </div>
              </div>
            </div>

            <div className="detailed-section">
              <h3 className="section-heading">Our Commitment to the Legal Community</h3>
              <p>
                Legal Network is more than a platform — it's a commitment to modernizing India's legal profession. We are continuously adding new features, improving user experience, and integrating more official services to make the app even more powerful.
              </p>
              <p>
                Our roadmap includes expanding legal tech capabilities, adding AI-driven tools for document management and analytics, and enhancing collaboration between lawyers and clients in a secure, compliant way.
              </p>
              <p>
                We're working hand-in-hand with legal experts, bar associations, and technology partners to make sure Legal Network remains the go-to digital hub for India's legal community.
              </p>
            </div>

            <div className="detailed-section call-to-action">
              <h3 className="section-heading">Join the Legal Revolution</h3>
              <p>
                The future of law is digital — and Legal Network is leading the way. Whether you are a seasoned advocate or a young lawyer starting your practice, this is your space to connect, collaborate, and grow.
              </p>
              <p>
                Join the thousands of professionals already transforming their legal journey with us. Download the Legal Network app today and be part of India's growing digital legal ecosystem.
              </p>
              <p className="tagline">
                <strong>Legal Network — Connect. Collaborate. Succeed.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision Cards */}
      <section className="mission-vision-section">
        <div className="container-fluid">
          <div className="mission-vision-cards grid-responsive-2 gap-responsive">
            <div className="mission-card card-responsive">
              <h3 className="card-title">Our Mission</h3>
              <p className="card-content text-responsive">
                To empower every legal professional with the tools, knowledge, and network they need to thrive in a digital-first world.
              </p>
            </div>

            <div className="vision-card card-responsive">
              <h3 className="card-title">Our Vision</h3>
              <p className="card-content text-responsive">
                To become India's largest and most trusted digital legal ecosystem where lawyers and law firms can connect, collaborate, and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Vakeel Partnership Section */}
      <section className="expert-vakeel-section">
        <div className="container-fluid">
          <div className="expert-vakeel-content stack-responsive gap-responsive">
            <div className="expert-vakeel-text">
              <h2 className="partnership-title heading-responsive">
                Our Partnership with<br />
                Expert Vakeel
              </h2>
              <p className="partnership-description text-responsive">
                Legal Network works hand-in-hand with Expert Vakeel, a public platform where clients can search and connect with lawyers online.
              </p>
              <p className="benefits-intro text-responsive">This synergy ensures that lawyers gain:</p>
              <ul className="benefits-list">
                <li>Increased online visibility</li>
                <li>Direct client inquiries</li>
                <li>Better lead conversion opportunities</li>
              </ul>
              <p className="partnership-conclusion text-responsive">
                Meanwhile, clients get trusted, verified lawyers for their legal matters — creating a win-win ecosystem for everyone.
              </p>
              <a href="https://expertvakeel.com">
              <button className="visit-site-button">
               
                Visit Site
                
                </button>
                </a>
            </div>

            <div className="flex-center">
            
            </div>
          </div>
        </div>
      </section>

      {/* CTA Component */}
      <CTA />
    </div>
  )
})

About.displayName = 'About'

export default About
