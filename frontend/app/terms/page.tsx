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

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <PolicyNav />

            <main className="max-w-4xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="mb-16 pb-10 border-b border-white/[0.06]">
                    <p className="text-[11px] text-white/30 uppercase tracking-[0.2em] mb-4">Legal</p>
                    <h1 className="text-4xl font-semibold tracking-tight mb-3">Terms of Service</h1>
                    <p className="text-[13px] text-white/35">Last updated: March 14, 2026 · Effective immediately upon account creation.</p>
                </div>

                <div className="max-w-2xl">
                    <Section title="1. Acceptance of Terms">
                        <p>
                            By accessing or using the MLForge platform ("Service"), including its web application,
                            APIs, CLI tools, and associated services, you agree to be bound by these Terms of Service
                            ("Terms"). If you do not agree to these Terms, you may not use the Service.
                        </p>
                        <p>
                            These Terms apply to all users of MLForge, including individuals, teams, and organizations.
                            If you are accepting these Terms on behalf of a company or other legal entity, you represent
                            that you have the authority to bind that entity to these Terms.
                        </p>
                    </Section>

                    <Section title="2. Description of Service">
                        <p>
                            MLForge is a machine learning infrastructure platform that provides tools for dataset
                            management, automated exploratory data analysis (EDA), data preprocessing, model training,
                            model registry management, and prediction API serving. The Service is designed to help
                            engineering teams build, train, and deploy machine learning models at scale.
                        </p>
                        <p>
                            MLForge does not guarantee specific model accuracy, performance, or business outcomes.
                            All machine learning outputs produced by the platform are probabilistic in nature and should
                            be validated by qualified engineers before use in production or business-critical systems.
                        </p>
                    </Section>

                    <Section title="3. Account Registration and Security">
                        <p>
                            To use the Service, you must create an account with a valid email address and password,
                            or authenticate via a supported OAuth provider (GitHub, Google). You are responsible for
                            maintaining the confidentiality of your account credentials.
                        </p>
                        <p>
                            You agree to notify MLForge immediately of any unauthorized use of your account. MLForge
                            will not be liable for any loss arising from unauthorized use of your account due to your
                            failure to keep credentials secure.
                        </p>
                        <p>
                            You must be at least 16 years of age to create an account. Accounts created by automated
                            processes, bots, or for the purpose of abuse are prohibited and may be terminated without notice.
                        </p>
                    </Section>

                    <Section title="4. Dataset and Data Uploads">
                        <p>
                            You retain full ownership of all datasets, files, and data you upload to MLForge
                            ("User Data"). By uploading data, you grant MLForge a limited, non-exclusive, royalty-free
                            license to store, process, and analyze that data solely for the purpose of providing the Service.
                        </p>
                        <p>
                            You are solely responsible for ensuring that data you upload complies with applicable laws,
                            including data protection regulations such as GDPR, CCPA, HIPAA, or analogous local laws.
                            You must not upload datasets containing personally identifiable information (PII) without
                            appropriate authorization, anonymization, or legal basis.
                        </p>
                        <p>
                            You must not upload data that is confidential, proprietary, or subject to third-party rights
                            unless you have explicit authorization. MLForge reserves the right to remove data that is
                            reported to violate third-party intellectual property rights.
                        </p>
                        <p>
                            MLForge will not share, sell, or use your User Data to train its own models without your
                            explicit written consent. Automated EDA and AI recommendation pipelines operate solely on
                            your data in your isolated environment.
                        </p>
                    </Section>

                    <Section title="5. Model Training and AI Outputs">
                        <p>
                            Models trained via MLForge ("User Models") are your intellectual property. MLForge claims
                            no ownership over model weights, parameters, or artifacts produced from your data using
                            our training infrastructure.
                        </p>
                        <p>
                            You acknowledge that machine learning models are statistical systems capable of producing
                            incorrect, biased, or unexpected outputs. You agree not to rely solely on any model prediction
                            or AI-generated recommendation for life-critical, medical, legal, financial, or other
                            high-stakes decisions without independent human review and validation.
                        </p>
                        <p>
                            MLForge provides automated AI recommendations for preprocessing (e.g., imputation strategies,
                            encoding methods, outlier handling). These recommendations are heuristic in nature and do not
                            constitute professional data science advice.
                        </p>
                    </Section>

                    <Section title="6. Prediction API Usage">
                        <p>
                            Access to the MLForge Prediction API is subject to rate limits determined by your subscription
                            tier. Exceeding API rate limits may result in throttling or temporary suspension of API access.
                        </p>
                        <p>
                            You must not use the Prediction API to process data that you do not have the right to process,
                            or for discriminatory, harmful, or illegal purposes. Any use of the API that results in harm to
                            individuals or groups based on race, gender, age, disability, or other protected characteristics
                            is expressly prohibited.
                        </p>
                        <p>
                            MLForge provides API uptime SLAs on Enterprise and higher plans only. Free and Starter plans
                            have no uptime guarantee and may experience periods of unavailability.
                        </p>
                    </Section>

                    <Section title="7. Acceptable Use Policy">
                        <p>You agree not to use the Service to:</p>
                        <ul className="list-none space-y-2 pl-4">
                            {[
                                "Train models intended to generate disinformation, deepfakes, or synthetic media designed to deceive.",
                                "Process data to build surveillance systems, predictive policing tools, or social scoring applications.",
                                "Reverse-engineer, decompile, or attempt to extract MLForge's proprietary algorithms or infrastructure code.",
                                "Scrape, crawl, or use automated tools to access the Service beyond standard API usage.",
                                "Upload malicious files, malware, or data designed to interfere with platform operations.",
                                "Misrepresent the accuracy or nature of outputs generated via the Service to end users.",
                                "Circumvent billing, rate limits, or usage restrictions through technical or deceptive means.",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2.5">
                                    <span className="mt-2 h-1 w-1 rounded-full bg-white/20 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="8. Subscription, Billing, and Cancellation">
                        <p>
                            MLForge offers free and paid subscription tiers. Paid plans are billed monthly or annually
                            in advance. All fees are non-refundable except where required by law or at MLForge's sole discretion.
                        </p>
                        <p>
                            You may cancel your subscription at any time. Upon cancellation, your access to paid features
                            will continue until the end of the current billing period. After that period, your account
                            will be downgraded to the free tier and data exceeding free tier limits may be subject to
                            deletion with 30 days notice.
                        </p>
                        <p>
                            MLForge reserves the right to modify pricing with 30 days notice. Continued use of the
                            Service after a price change constitutes acceptance of the new pricing.
                        </p>
                    </Section>

                    <Section title="9. Intellectual Property">
                        <p>
                            The MLForge platform, including its software, UI, APIs, documentation, and branding, is
                            owned by MLForge Inc. and protected by copyright, trademark, and other intellectual property
                            laws. You may not reproduce, distribute, or create derivative works of any platform component
                            without prior written consent.
                        </p>
                        <p>
                            Feedback, suggestions, or feature requests you submit to MLForge may be used by MLForge
                            without obligation, attribution, or compensation.
                        </p>
                    </Section>

                    <Section title="10. Termination">
                        <p>
                            MLForge reserves the right to suspend or terminate your account at any time, with or without
                            cause, including for violation of these Terms. Upon termination, your right to access the
                            Service ceases immediately.
                        </p>
                        <p>
                            You may terminate your account at any time from your account settings. Upon termination, your
                            data will be retained for 30 days before permanent deletion, during which you may request an
                            export of your datasets and model artifacts.
                        </p>
                    </Section>

                    <Section title="11. Disclaimer of Warranties">
                        <p>
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND,
                            EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                            OR NON-INFRINGEMENT. MLFORGE DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
                            ERROR-FREE, OR FREE OF BUGS, VIRUSES, OR OTHER HARMFUL COMPONENTS.
                        </p>
                    </Section>

                    <Section title="12. Limitation of Liability">
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, MLFORGE SHALL NOT BE LIABLE FOR ANY INDIRECT,
                            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA,
                            BUSINESS OPPORTUNITIES, OR GOODWILL, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                        </p>
                        <p>
                            MLFORGE'S AGGREGATE LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR
                            THE SERVICE SHALL NOT EXCEED THE AMOUNTS PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING
                            THE CLAIM.
                        </p>
                    </Section>

                    <Section title="13. Governing Law">
                        <p>
                            These Terms are governed by and construed in accordance with the laws of the State of Delaware,
                            United States, without regard to its conflict of law provisions. Any disputes arising under
                            these Terms shall be subject to the exclusive jurisdiction of the courts located in Delaware.
                        </p>
                    </Section>

                    <Section title="14. Changes to Terms">
                        <p>
                            MLForge may update these Terms periodically. Material changes will be communicated via email
                            or a prominent notice within the platform at least 14 days before they take effect. Your
                            continued use of the Service after changes take effect constitutes your acceptance of the
                            updated Terms.
                        </p>
                    </Section>

                    <Section title="15. Contact">
                        <p>
                            For questions or concerns about these Terms, contact us at{" "}
                            <a href="mailto:legal@mlforge.io" className="text-white/60 underline underline-offset-2 hover:text-white transition-colors">
                                legal@mlforge.io
                            </a>
                            .
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
