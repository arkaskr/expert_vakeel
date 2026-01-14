import { ArrowLeft, Shield, FileText, Users, Share2, Lock, Globe, Mail, Printer } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
    const sections = [
        {
            id: "scope",
            title: "1. Scope of This Policy",
            icon: <Shield className="w-5 h-5 text-blue-600" />,
            content: (
                <div className="space-y-4">
                    <p className="legal-info-text">This Privacy Policy applies to:</p>
                    <ul className="grid sm:grid-cols-2 gap-2 legal-info-text">
                        {[
                            "Lawyers and legal professionals registered on Legal Network",
                            "Visitors and users of the Legal Network website",
                            "Users interacting with Legal Network via the Expert Vakeel platform"
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="legal-info-text italic">This policy does not apply to third-party websites or services linked from our Platform.</p>
                </div>
            )
        },
        {
            id: "collection",
            title: "2. Information We Collect",
            icon: <FileText className="w-5 h-5 text-indigo-600" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                        <h4 className="font-semibold text-indigo-900 mb-3 text-sm">2.1 Personal & Professional Information</h4>
                        <p className="legal-info-text mb-3">When you register or use Legal Network, we may collect:</p>
                        <ul className="grid sm:grid-cols-2 gap-2 legal-info-text">
                            {[
                                "Full name", "Email address", "Mobile number", "Gender (optional)",
                                "City and state", "Bar registration details", "Years of experience",
                                "Courts of practice", "Legal specialization(s)", "Profile photo and bio"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">2.2 Communication Data</h4>
                            <ul className="space-y-2 legal-info-text">
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">•</span>
                                    One-on-one chat messages
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">•</span>
                                    Shared content (docs, images)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">•</span>
                                    Client inquiries from Expert Vakeel
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">2.3 Case & Usage Data</h4>
                            <ul className="space-y-2 legal-info-text">
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">•</span>
                                    Case details from eCourts API
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">•</span>
                                    Personal case notes
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gray-400 mt-1">•</span>
                                    Device & interaction logs
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "usage",
            title: "3. Use of Information",
            icon: <Users className="w-5 h-5 text-purple-600" />,
            content: (
                <ul className="grid sm:grid-cols-2 gap-3">
                    {[
                        "Create and manage lawyer profiles",
                        "Enable professional networking",
                        "Facilitate secure messaging",
                        "Provide legal news and updates",
                        "Manage digital legal diaries",
                        "Connect lawyers with clients",
                        "Improve platform performance",
                        "Comply with legal obligations"
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 legal-info-text bg-gray-50 p-3 rounded-lg">
                            <span className="text-purple-500 mt-0.5">✓</span>
                            {item}
                        </li>
                    ))}
                </ul>
            )
        },
        {
            id: "integrations",
            title: "4 & 5. Integrations (eCourts & Expert Vakeel)",
            icon: <Globe className="w-5 h-5 text-cyan-600" />,
            content: (
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-cyan-50/30 rounded-xl border border-cyan-100">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">eCourts API Integration</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            We fetch publicly available case information at your request. We do not alter official court data and store it only for case management services. Legal Network is not affiliated with eCourts.
                        </p>
                    </div>
                    <div className="p-4 bg-cyan-50/30 rounded-xl border border-cyan-100">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Expert Vakeel Integration</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            We connect you with clients via Expert Vakeel. Contact details are shared only to facilitate professional communication.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "sharing",
            title: "6. Data Sharing & Disclosure",
            icon: <Share2 className="w-5 h-5 text-orange-600" />,
            content: (
                <div className="bg-orange-50/50 rounded-xl p-5 border border-orange-100">
                    <p className="text-sm font-medium text-orange-800 mb-4">
                        We do not sell or rent personal data. Information may be shared only:
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            "With service providers (hosting, analytics)",
                            "To comply with legal obligations",
                            "To protect safety and integrity",
                            "With user consent"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded border border-orange-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: "security",
            title: "7. Data Storage & Security",
            icon: <Lock className="w-5 h-5 text-green-600" />,
            content: (
                <div className="space-y-3">
                    <p className="legal-info-text">We implement appropriate security measures:</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "Secure servers", "Encrypted communication", "Access control", "Regular updates"
                        ].map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                                {item}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">Note: No system is 100% secure, and we cannot guarantee absolute security.</p>
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
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1>Privacy Policy</h1>
                    <p>
                        Legal Network (“we”, “our”, “us”) is committed to protecting the privacy and personal data of its users.
                    </p>
                    <div className="legal-last-updated">
                        <span>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>

                {/* Introduction */}
                <div className="legal-intro-card">
                    <p className="legal-info-text">
                        This Privacy Policy explains how we collect, use, disclose, store, and protect information when you access or use the Legal Network website and mobile application (collectively, the “Platform”). By accessing or using Legal Network, you agree to the terms of this Privacy Policy.
                    </p>
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

                    {/* Additional Sections Group */}
                    <div className="legal-grid">
                        {[
                            {
                                title: "8. User Rights",
                                content: "Access, update, correct, or delete your data. Contact us to exercise these rights."
                            },
                            {
                                title: "9. Data Retention",
                                content: "We retain data as long as your account is active or required for legal/business purposes."
                            },
                            {
                                title: "10. Cookies",
                                content: "We use cookies to improve functionality and analyze usage. You can disable them in settings."
                            },
                            {
                                title: "11. Children’s Privacy",
                                content: "Legal Network is for professionals and adults. We do not knowingly collect data from minors."
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
                            If you have any questions or concerns regarding this Privacy Policy, please contact us.
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
                            Print Policy
                        </button>
                    </div>
                    <p>© {new Date().getFullYear()} Legal Network. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
