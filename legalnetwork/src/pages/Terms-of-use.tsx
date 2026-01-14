import { Gavel, Users, FileText, Ban, AlertTriangle, Scale, Mail, Globe, ArrowLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfUse() {
    const sections = [
        {
            id: "eligibility",
            title: "1. Eligibility",
            icon: <Users className="w-5 h-5 text-blue-600" />,
            content: (
                <div className="space-y-4">
                    <p className="legal-info-text">Legal Network is intended exclusively for:</p>
                    <ul className="legal-info-text list-none space-y-2">
                        {[
                            "Licensed advocates, lawyers, law firms",
                            "Legal professionals",
                            "Adults aged 18 years or above"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mt-2">
                        <p className="legal-info-text font-medium text-gray-700">
                            <strong>Note:</strong> We reserve the right to suspend or terminate accounts that provide false or misleading information.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "services",
            title: "2. Nature of Services",
            icon: <FileText className="w-5 h-5 text-indigo-600" />,
            content: (
                <div className="space-y-4">
                    <p className="legal-info-text">Legal Network provides:</p>
                    <ul className="grid sm:grid-cols-2 gap-2 legal-info-text">
                        {[
                            "Lawyer discovery", "Professional networking",
                            "Secure communication tools", "Legal news & discussions",
                            "Digital legal diary & case tracking", "Expert Vakeel integration"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-2">
                        <p className="legal-info-text font-medium text-yellow-800 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Legal Network does not provide legal advice, legal representation, or guarantee professional outcomes.</span>
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "accounts",
            title: "3 & 4. User Accounts & Profiles",
            icon: <Users className="w-5 h-5 text-purple-600" />,
            content: (
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="legal-info-card">
                        <h4 className="legal-info-title">Account Responsibility</h4>
                        <ul className="space-y-2 legal-info-text">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                You are responsible for account confidentiality.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                Notify us immediately of unauthorized use.
                            </li>
                        </ul>
                    </div>
                    <div className="legal-info-card">
                        <h4 className="legal-info-title">Profile Content</h4>
                        <ul className="space-y-2 legal-info-text">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                Must be truthful and professional.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                Must not be misleading or defamatory.
                            </li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "communication",
            title: "5. Messaging & Communication",
            icon: <Mail className="w-5 h-5 text-cyan-600" />,
            content: (
                <div className="bg-cyan-50/30 rounded-xl p-5 border border-cyan-100">
                    <p className="legal-info-text mb-3">You agree not to share unlawful, defamatory, or abusive content.</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "No Spam", "No Solicitation", "Client Confidentiality", "Advocate Ethics"
                        ].map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-medium rounded-full border border-cyan-100">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: "integrations",
            title: "6 & 7. Integrations (eCourts & Expert Vakeel)",
            icon: <Globe className="w-5 h-5 text-green-600" />,
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-green-50/30 rounded-xl border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">eCourts API</h4>
                        <p className="text-xs text-gray-600">Case data retrieved on request. Not affiliated with eCourts.</p>
                    </div>
                    <div className="p-4 bg-green-50/30 rounded-xl border border-green-100">
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">Expert Vakeel</h4>
                        <p className="text-xs text-gray-600">Platform for client connection. Engagements governed by professional rules.</p>
                    </div>
                </div>
            )
        },
        {
            id: "conduct",
            title: "8 & 9. Conduct & Prohibited Activities",
            icon: <Ban className="w-5 h-5 text-red-600" />,
            content: (
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="legal-info-card border-gray-200">
                        <h4 className="legal-info-title">Do's</h4>
                        <ul className="legal-info-text space-y-1">
                            <li>✓ Comply with Advocates Act</li>
                            <li>✓ Maintain confidentiality</li>
                        </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <h4 className="font-semibold text-red-900 mb-2 text-sm">Dont's</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                            <li>✗ Unlawful purposes</li>
                            <li>✗ Impersonation</li>
                            <li>✗ Malware/Scraping</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "liability",
            title: "12 & 13. Liability & Indemnification",
            icon: <Scale className="w-5 h-5 text-orange-600" />,
            content: (
                <div className="bg-orange-50/50 rounded-xl p-5 border border-orange-100 legal-info-text space-y-2">
                    <p>
                        <strong>Limitation:</strong> We are not liable for indirect damages or professional outcomes.
                    </p>
                    <p>
                        <strong>Indemnification:</strong> You agree to hold us harmless from claims arising from your use or violations.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="legal-page">
            <div className="legal-container">
                {/* Header */}
                <div className="legal-header">
                    <div className="legal-icon-wrapper">
                        <Gavel className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1>Terms & Conditions</h1>
                    <p>
                        These Terms govern your access to and use of the Legal Network website.
                    </p>
                    <div className="legal-last-updated">
                        <span>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="legal-section-list">
                    {sections.map((section) => (
                        <section key={section.id} className="legal-card">
                            <div className="legal-card-content">
                                <div className="legal-card-header">
                                    <div className="legal-card-icon">
                                        {section.icon}
                                    </div>
                                    <h2 className="legal-card-title">{section.title}</h2>
                                </div>
                                {section.content}
                            </div>
                        </section>
                    ))}

                    {/* Additional Legal Blocks */}
                    <div className="legal-grid">
                        {[
                            {
                                title: "10. Intellectual Property",
                                content: "All content engaged is owned by Legal Network. You grant us license to display your uploaded content."
                            },
                            {
                                title: "11. Privacy",
                                content: "Your use is also governed by our Privacy Policy."
                            },
                            {
                                title: "14. Termination",
                                content: "We reserve the right to suspend accounts for violations without notice."
                            },
                            {
                                title: "16. Governing Law",
                                content: "Governed by the laws of India. Courts of New Delhi shall have exclusive jurisdiction."
                            }
                        ].map((card, i) => (
                            <div key={i} className="legal-info-card">
                                <h3 className="legal-info-title">{card.title}</h3>
                                <p className="legal-info-text">{card.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <section className="legal-contact-box">
                        <h2 className="legal-contact-title">Contact Information</h2>
                        <p className="legal-contact-text">
                            For questions regarding these Terms, please contact us.
                        </p>
                        <div className="legal-contact-actions">
                            <a
                                href="mailto:support@legalnetwork.in"
                                className="legal-btn-white"
                            >
                                <Mail className="w-4 h-4" />
                                support@legalnetwork.in
                            </a>
                            <a
                                href="https://www.legalnetwork.in"
                                target="_blank"
                                rel="noreferrer"
                                className="legal-btn-outline"
                            >
                                <Globe className="w-4 h-4" />
                                www.legalnetwork.in
                            </a>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="legal-footer">
                    <div className="legal-footer-links">
                        <Link to="/" className="legal-link-back">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="legal-link-back"
                        >
                            <Printer className="w-4 h-4" />
                            Print Terms
                        </button>
                    </div>
                    <p>© {new Date().getFullYear()} Legal Network. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
