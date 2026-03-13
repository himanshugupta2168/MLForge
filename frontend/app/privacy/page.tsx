import Link from "next/link"
import { Brain } from "lucide-react"

function PolicyNav() {
    return (
        <header className="border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-white/50" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-white/50">MLForge</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/terms" className="text-[12px] text-white/40 hover:text-white/70 transition-colors">Terms</Link>
                    <Link href="/privacy" className="text-[12px] text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
                </div>
            </div>
        </header>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-12">
            <h2 className="text-base font-semibold text-white mb-4 pb-3 border-b border-white/[0.06]">{title}</h2>
            <div className="space-y-3 text-[13px] text-white/50 leading-7">{children}</div>
        </section>
    )
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <PolicyNav />

            <main className="max-w-4xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="mb-16 pb-10 border-b border-white/[0.06]">
                    <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] mb-4">Legal</p>
                    <h1 className="text-4xl font-semibold tracking-tight mb-3">Privacy Policy</h1>
                    <p className="text-[13px] text-white/35">Last updated: March 14, 2026 · Covers all MLForge services and sub-processors.</p>
                </div>

                <div className="max-w-2xl">
                    <Section title="1. Overview">
                        <p>
                            MLForge Inc. ("MLForge," "we," "us," or "our") is committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, store, and share information when you use
                            the MLForge platform — including our web application, APIs, CLI, and related services
                            (collectively, the "Service").
                        </p>
                        <p>
                            This policy applies to all users of the Service worldwide. By using MLForge, you acknowledge
                            that you have read and understood this policy. If you do not agree, please discontinue use
                            of the Service.
                        </p>
                    </Section>

                    <Section title="2. Information We Collect">
                        <p><span className="text-white/70 font-medium">2.1 Account Information</span></p>
                        <p>
                            When you register, we collect your email address, hashed password (if using credentials login),
                            name, and OAuth provider profile data (e.g., GitHub username, Google profile ID). This
                            information is used to authenticate you and manage your account.
                        </p>

                        <p><span className="text-white/70 font-medium">2.2 User-Uploaded Data</span></p>
                        <p>
                            MLForge stores datasets, files, and metadata you upload. This includes CSV file contents,
                            column schemas, row counts, inferred data types, and dataset version history. This data is
                            stored in isolated per-user storage and is not shared across accounts.
                        </p>

                        <p><span className="text-white/70 font-medium">2.3 Model and Pipeline Data</span></p>
                        <p>
                            We store model artifacts, training configurations, hyperparameters, evaluation metrics
                            (accuracy, RMSE, R², F1), feature schemas, preprocessing steps applied, and model version
                            history. This is required to provide inference, comparison, and auditing capabilities.
                        </p>

                        <p><span className="text-white/70 font-medium">2.4 Usage and Telemetry Data</span></p>
                        <p>
                            We automatically collect technical usage data, including: API request logs (endpoint, timestamp,
                            latency, status code), training job durations, compute resource consumption, browser/client type,
                            IP address, and session identifiers. This data is used for platform performance, billing, and
                            security monitoring.
                        </p>

                        <p><span className="text-white/70 font-medium">2.5 Communications</span></p>
                        <p>
                            If you contact us via email or support channels, we retain the content of those communications
                            to resolve your request and improve our support quality.
                        </p>
                    </Section>

                    <Section title="3. How We Use Your Information">
                        <ul className="list-none space-y-3 pl-2">
                            {[
                                { label: "Service delivery", desc: "To process datasets, run EDA pipelines, train ML models, serve prediction APIs, and maintain dataset/model version histories." },
                                { label: "Authentication", desc: "To verify your identity, manage sessions, and protect your account from unauthorized access." },
                                { label: "Billing and plans", desc: "To track usage against your subscription limits, process payments via secure third-party processors, and manage invoice records." },
                                { label: "Security and fraud prevention", desc: "To monitor for abuse, unauthorized API usage, and suspicious activity patterns that may indicate a compromised account." },
                                { label: "Product improvement", desc: "To understand how the platform is used in aggregate (not individual-level) and improve features, performance, and reliability." },
                                { label: "Communications", desc: "To send transactional emails (e.g., email verification, password reset, training job completion), important service updates, and — with your consent — product news." },
                            ].map(({ label, desc }) => (
                                <li key={label} className="flex items-start gap-3">
                                    <span className="mt-2 h-1 w-1 rounded-full bg-white/20 shrink-0" />
                                    <span><span className="text-white/65 font-medium">{label}:</span> {desc}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2">
                            MLForge does not use your uploaded datasets, model weights, or prediction inputs to train
                            its own machine learning systems. Your data is used solely to power your own workflows.
                        </p>
                    </Section>

                    <Section title="4. Data Storage and Security">
                        <p>
                            All data is encrypted in transit using TLS 1.2+ and encrypted at rest using AES-256.
                            Datasets and model artifacts are stored in isolated object storage buckets with
                            per-account access controls. Database records are stored in a managed, access-controlled
                            PostgreSQL instance.
                        </p>
                        <p>
                            Access to production systems containing user data is restricted to authorized MLForge
                            engineers via multi-factor authentication and role-based access controls. All internal
                            access is logged and reviewed. We undergo periodic security audits and are working toward
                            SOC2 Type II certification.
                        </p>
                        <p>
                            Despite these measures, no system is 100% secure. In the event of a data breach affecting
                            your personal information, we will notify you in accordance with applicable law and provide
                            guidance on protective actions.
                        </p>
                    </Section>

                    <Section title="5. Data Retention">
                        <p>
                            We retain your account information and User Data for as long as your account is active.
                            Upon account deletion, your data will be scheduled for permanent deletion within 30 days.
                            You may request an export of your datasets and model artifacts before deletion.
                        </p>
                        <p>
                            Aggregate, anonymized usage statistics may be retained indefinitely for analytical and
                            product improvement purposes. These cannot be traced back to individual users.
                        </p>
                        <p>
                            API request logs containing IP addresses are retained for up to 90 days for security
                            and debugging purposes, then permanently deleted.
                        </p>
                    </Section>

                    <Section title="6. Third-Party Services and Sub-Processors">
                        <p>
                            MLForge uses the following categories of third-party services to operate the platform.
                            Each is bound by data processing agreements consistent with applicable privacy law:
                        </p>
                        <ul className="list-none space-y-3 pl-2">
                            {[
                                { label: "Cloud infrastructure", desc: "Object storage, compute, and networking (e.g., AWS, GCP, or similar). Data is stored in the region closest to your account's selected region." },
                                { label: "Payment processing", desc: "Billing and subscription management (e.g., Stripe). MLForge does not store raw credit card data — all payment data is handled by PCI-DSS compliant processors." },
                                { label: "Authentication providers", desc: "GitHub and Google OAuth for social login. Only public profile data and email are retrieved; no private repository or account data is accessed." },
                                { label: "Email delivery", desc: "Transactional email services for account notifications, job alerts, and system updates." },
                                { label: "Error monitoring", desc: "Application error tracking tools (e.g., Sentry) that capture stack traces and request metadata for debugging. Personal data is minimized in error reports." },
                            ].map(({ label, desc }) => (
                                <li key={label} className="flex items-start gap-3">
                                    <span className="mt-2 h-1 w-1 rounded-full bg-white/20 shrink-0" />
                                    <span><span className="text-white/65 font-medium">{label}:</span> {desc}</span>
                                </li>
                            ))}
                        </ul>
                        <p>
                            We do not sell your personal information to any third party, and we do not share your data
                            with advertisers or marketing platforms.
                        </p>
                    </Section>

                    <Section title="7. Machine Learning Specific Considerations">
                        <p>
                            MLForge processes user-uploaded datasets to compute statistical summaries (mean, median,
                            standard deviation, correlation coefficients, missing value rates, skewness), detect data
                            quality issues, and suggest preprocessing transformations. This processing occurs entirely
                            within your isolated environment.
                        </p>
                        <p>
                            AI recommendations generated by MLForge (e.g., "impute with median," "apply log transform")
                            are derived from the dataset you upload. The recommendation logic is algorithmic and
                            deterministic — it does not involve training on your data or sharing your data with
                            any external AI system.
                        </p>
                        <p>
                            Prediction inputs submitted to your deployed model endpoints are not retained beyond
                            what is required for the API response, unless you have explicitly enabled prediction
                            logging in your account settings.
                        </p>
                    </Section>

                    <Section title="8. Your Rights">
                        <p>
                            Depending on your jurisdiction, you may have the following rights with respect to
                            your personal data:
                        </p>
                        <ul className="list-none space-y-3 pl-2">
                            {[
                                "Access — Request a copy of the personal data we hold about you.",
                                "Correction — Request correction of inaccurate or incomplete data.",
                                "Deletion — Request deletion of your account and associated personal data.",
                                "Portability — Request an export of your datasets and model artifacts in standard formats.",
                                "Restriction — Request that we restrict processing of your data in certain circumstances.",
                                "Objection — Object to processing of your data for marketing or profiling purposes.",
                                "Withdraw consent — Where processing is based on consent, withdraw it at any time.",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2.5">
                                    <span className="mt-2 h-1 w-1 rounded-full bg-white/20 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p>
                            To exercise any of these rights, contact{" "}
                            <a href="mailto:privacy@mlforge.io" className="text-white/60 underline underline-offset-2 hover:text-white transition-colors">
                                privacy@mlforge.io
                            </a>
                            . We will respond within 30 days.
                        </p>
                    </Section>

                    <Section title="9. Cookies and Tracking">
                        <p>
                            MLForge uses only strictly necessary cookies: a session authentication cookie to keep you
                            logged in, and a CSRF protection cookie. We do not use third-party advertising cookies,
                            marketing pixels, or cross-site tracking technologies.
                        </p>
                        <p>
                            You can clear cookies at any time via your browser settings. Clearing the session cookie
                            will log you out of the platform.
                        </p>
                    </Section>

                    <Section title="10. Children's Privacy">
                        <p>
                            The Service is not directed at individuals under 16 years of age. We do not knowingly
                            collect personal data from children. If we become aware that a child under 16 has provided
                            personal data, we will delete that data promptly. If you believe a child has registered
                            without parental consent, please contact{" "}
                            <a href="mailto:privacy@mlforge.io" className="text-white/60 underline underline-offset-2 hover:text-white transition-colors">
                                privacy@mlforge.io
                            </a>.
                        </p>
                    </Section>

                    <Section title="11. International Data Transfers">
                        <p>
                            MLForge is operated from the United States. If you are located outside the United States,
                            your data may be transferred to and processed in the United States, which may have different
                            data protection laws than your jurisdiction. By using the Service, you consent to this transfer.
                        </p>
                        <p>
                            For users in the European Economic Area (EEA), United Kingdom, or Switzerland, we rely on
                            Standard Contractual Clauses (SCCs) as the legal mechanism for cross-border data transfers.
                        </p>
                    </Section>

                    <Section title="12. Changes to This Policy">
                        <p>
                            We may update this Privacy Policy periodically. For material changes, we will notify you
                            via email at least 14 days before the change takes effect. The "Last updated" date at the
                            top of this page reflects the most recent revision.
                        </p>
                    </Section>

                    <Section title="13. Contact Us">
                        <p>
                            For privacy-related questions, data requests, or to report a concern, contact our Data
                            Protection contact at{" "}
                            <a href="mailto:privacy@mlforge.io" className="text-white/60 underline underline-offset-2 hover:text-white transition-colors">
                                privacy@mlforge.io
                            </a>
                            .
                        </p>
                        <p>
                            MLForge Inc.<br />
                            Wilmington, Delaware, United States
                        </p>
                    </Section>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-8">
                <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-mono text-white/15">© 2026 MLFORGE INC.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">Terms</Link>
                        <Link href="/privacy" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
