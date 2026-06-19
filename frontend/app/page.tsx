import { THEME_CONFIG } from "@/lib/theme-constants";
import { Check, ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

/* ─── Navbar ─────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#050505]/90 backdrop-blur-sm border-b border-white/[0.06]">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white">
          <THEME_CONFIG.icons.ai className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-sm font-medium tracking-tight">MLForge</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {[
            { label: "Platform", href: "#platform" },
            { label: "Workflow", href: "#workflow" },
            { label: "Pricing", href: "#pricing" },
            { label: "Docs", href: "#docs" },
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="text-[13px] text-white/40 hover:text-white/80 transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Link href="/auth" className="text-[13px] text-white/40 hover:text-white/80 transition-colors">Sign in</Link>
          <Link href="/auth" className="text-[13px] font-medium text-black bg-white px-3.5 py-1.5 hover:bg-white/90 transition-colors">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-44 pb-32">
        <p className="text-xs font-medium text-white/40 tracking-[0.15em] uppercase mb-6">
          SmartML Platform
        </p>

        <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[1.08] tracking-tight text-white max-w-3xl mb-6">
          Upload a dataset.<br />
          <span className="text-white/35">Get a trained model.</span>
        </h1>

        <p className="text-[15px] text-white/50 font-normal leading-relaxed max-w-lg mb-10">
          MLForge automates the full machine learning lifecycle — from raw CSV to
          live prediction API — with AI-guided recommendations at every step.
          No ML expertise required to get started.
        </p>

        <div className="flex items-center gap-4">
          <Link href="/auth" className="inline-flex items-center gap-2 text-sm font-medium bg-white text-black px-5 h-10 hover:bg-white/90 transition-colors">
            Start for free
          </Link>
          <Link href="#workflow" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group">
            See how it works <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-24 pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { value: "5 steps", label: "Upload to prediction" },
            { value: "Auto", label: "EDA & recommendations" },
            { value: "RF / LR", label: "Models supported" },
            { value: "REST", label: "Prediction API" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-semibold text-white mb-0.5">{value}</p>
              <p className="text-[12px] text-white/35 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLIENTS ───────────────────────────────────────────────── */}
      <div className="border-t border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-10 overflow-x-auto">
          <span className="text-[11px] text-white/25 uppercase tracking-widest shrink-0">Built with</span>
          {["FastAPI", "Next.js", "PostgreSQL", "scikit-learn", "Recharts"].map((name) => (
            <span key={name} className="text-[12px] font-medium text-white/20 hover:text-white/50 transition-colors shrink-0 cursor-default">
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── PLATFORM FEATURES ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-28" id="platform">
        <p className="text-[11px] text-white/35 uppercase tracking-[0.18em] mb-4">Platform</p>
        <h2 className="text-3xl font-semibold text-white tracking-tight mb-4 max-w-lg">
          Every step of ML, automated.
        </h2>
        <p className="text-[14px] text-white/45 max-w-md leading-relaxed mb-16">
          MLForge handles the repetitive, error-prone work of data preparation and model
          selection — so you can focus on the actual problem you're solving.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
          {[
            {
              icon: THEME_CONFIG.icons.storage,
              title: "Dataset upload & versioning",
              desc: "Upload any CSV file. MLForge automatically extracts column types, row counts, dtypes, and stores versioned snapshots of every dataset.",
            },
            {
              icon: THEME_CONFIG.icons.discover,
              title: "Automated EDA",
              desc: "Instantly compute mean, median, standard deviation, missing value rates, skew, outliers, and correlation — with zero configuration.",
            },
            {
              icon: THEME_CONFIG.icons.magic,
              title: "AI-guided recommendations",
              desc: "MLForge suggests the right fixes: impute or drop missing values, log-transform skewed columns, cap outliers, one-hot encode categoricals.",
            },
            {
              icon: THEME_CONFIG.icons.layers,
              title: "Preprocessing engine",
              desc: "Apply approved recommendations in one click. Cleaned datasets are versioned separately, feature schemas are locked in for training.",
            },
            {
              icon: THEME_CONFIG.icons.pipeline,
              title: "One-click model training",
              desc: "Train Random Forest or Logistic/Linear Regression on cleaned datasets. Metrics (accuracy, RMSE, R²) tracked and stored in the model registry.",
            },
            {
              icon: THEME_CONFIG.icons.fast,
              title: "Prediction API",
              desc: "Submit inputs against any trained model via REST. Dynamic validation uses the locked feature schema, with confidence scores returned.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#050505] p-8 flex flex-col gap-5 group hover:bg-white/[0.02] transition-colors">
              <Icon className="h-4 w-4 text-white/30" strokeWidth={1.5} />
              <div>
                <h3 className="text-[14px] font-medium text-white mb-2">{title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORKFLOW ──────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06]" id="workflow">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <p className="text-[11px] text-white/35 uppercase tracking-[0.18em] mb-4">How it works</p>
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-16 max-w-md">
            Five steps from raw data to live predictions.
          </h2>

          <div className="divide-y divide-white/[0.06]">
            {[
              {
                n: "01",
                title: "Upload your dataset",
                tag: "Data Layer",
                desc: "Upload any CSV file. MLForge parses the schema, infers column types, stores metadata, and creates the first dataset version automatically.",
              },
              {
                n: "02",
                title: "Explore & understand",
                tag: "EDA Engine",
                desc: "Fetch automated EDA stats: distributions, missing value rates, skew scores, correlation matrices. AI highlights the most critical issues first.",
              },
              {
                n: "03",
                title: "Apply AI recommendations",
                tag: "Preprocessing",
                desc: "Review AI-suggested fixes with priority labels. Apply them in one request — imputation, encoding, outlier capping — and save the cleaned version.",
              },
              {
                n: "04",
                title: "Train a model",
                tag: "Model Registry",
                desc: "Select a task type (classification or regression). MLForge auto-selects or lets you pick an algorithm, trains it, and stores metrics and the model artifact.",
              },
              {
                n: "05",
                title: "Predict via API",
                tag: "Inference",
                desc: "Submit inputs to your trained model via the REST API. The feature schema validates inputs dynamically. Predictions return with confidence scores.",
              },
            ].map(({ n, title, tag, desc }) => (
              <div key={n} className="py-8 grid md:grid-cols-12 gap-4 group">
                <p className="md:col-span-1 text-[11px] font-mono text-white/20 pt-0.5">{n}</p>
                <div className="md:col-span-3">
                  <p className="text-[14px] font-medium text-white">{title}</p>
                </div>
                <p className="md:col-span-5 text-[13px] text-white/40 leading-relaxed">{desc}</p>
                <div className="md:col-span-3 flex md:justify-end items-start">
                  <span className="text-[10px] text-white/25 border border-white/10 px-2 py-0.5 uppercase tracking-widest">{tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TERMINAL / CODE DEMO ──────────────────────────────────── */}
      <section className="border-t border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] text-white/35 uppercase tracking-[0.18em] mb-4">API-first</p>
            <h2 className="text-3xl font-semibold text-white tracking-tight mb-4">
              Everything is an API.<br />Automate your entire pipeline.
            </h2>
            <p className="text-[14px] text-white/40 leading-relaxed mb-8 max-w-sm">
              Every action in MLForge is exposed via a clean REST API backed by FastAPI.
              Script your pipelines, integrate with existing tools, or build on top.
            </p>
            <Link href="#" className="inline-flex items-center gap-1.5 text-[13px] text-white/50 hover:text-white transition-colors group">
              API Reference <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="border border-white/[0.08] bg-black/60 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 h-9 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="h-2 w-2 rounded-full bg-white/10" />
              <div className="h-2 w-2 rounded-full bg-white/10" />
              <div className="h-2 w-2 rounded-full bg-white/10" />
              <span className="text-[10px] font-mono text-white/20 ml-3">mlforge api</span>
            </div>
            <div className="p-5 font-mono text-[12px] leading-6 space-y-1">
              <div className="text-white/25"># Upload dataset</div>
              <div className="text-white/45">POST /datasets/upload</div>
              <div className="text-white/20 ml-4">→ dataset_id: "ds_a3f7"</div>
              <div className="mt-3 text-white/25"># Get EDA + recommendations</div>
              <div className="text-white/45">GET /datasets/ds_a3f7/eda</div>
              <div className="text-white/20 ml-4">→ stats: {"{"} missing: 12%, skew: 2.3 {"}"}</div>
              <div className="text-white/20 ml-4">→ recommendations: [...]</div>
              <div className="mt-3 text-white/25"># Apply preprocessing</div>
              <div className="text-white/45">POST /datasets/ds_a3f7/preprocess</div>
              <div className="text-white/20 ml-4">→ cleaned_version: "ds_a3f7_v2"</div>
              <div className="mt-3 text-white/25"># Train model</div>
              <div className="text-white/45">POST /models/train</div>
              <div className="text-white/20 ml-4">→ model_id: "mdl_9c2a"</div>
              <div className="text-white/20 ml-4">→ accuracy: 0.947</div>
              <div className="mt-3 text-white/25"># Predict</div>
              <div className="text-white/45">POST /models/mdl_9c2a/predict</div>
              <div className="text-white/60 ml-4">→ prediction: "approved"  p: 0.91</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ─────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <blockquote className="max-w-3xl">
            <p className="text-[1.45rem] font-normal text-white/60 leading-[1.55] tracking-tight mb-8">
              "I uploaded a loan approval dataset on Saturday morning. By the afternoon I had
              a trained Random Forest model with 94.7% accuracy, served via a REST endpoint —
              without writing a single line of ML code."
            </p>
            <footer className="flex items-center gap-3">
              <div className="h-8 w-8 border border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-medium text-white/40">AK</div>
              <div>
                <p className="text-[13px] font-medium text-white">Arjun Kapoor</p>
                <p className="text-[11px] text-white/30">Full-Stack Engineer · Fintech Startup</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06]" id="pricing">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <p className="text-[11px] text-white/35 uppercase tracking-[0.18em] mb-4">Pricing</p>
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-16">Simple, transparent pricing.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
            {[
              {
                name: "Starter",
                price: "$29",
                period: "/mo",
                desc: "For individuals learning ML or building side projects.",
                features: [
                  "5 datasets",
                  "10 model training runs / mo",
                  "3 prediction endpoints",
                  "Community support",
                ],
                cta: "Get started",
                featured: false,
              },
              {
                name: "Pro",
                price: "$44",
                period: "/mo",
                desc: "For engineers shipping ML into real products.",
                features: [
                  "Unlimited datasets & versions",
                  "Unlimited training runs",
                  "Batch prediction API",
                  "SHAP feature explanations",
                ],
                cta: "Start free trial",
                featured: true,
              },
              {
                name: "Team",
                price: "Custom",
                period: "",
                desc: "For organizations that need shared workspaces, SSO, and SLAs.",
                features: [
                  "Multi-user project isolation",
                  "Async job queue (Celery)",
                  "AutoML algorithm selection",
                  "Dedicated support",
                ],
                cta: "Contact us",
                featured: false,
              },
            ].map(({ name, price, period, desc, features, cta, featured }) => (
              <div key={name} className={`p-8 flex flex-col gap-6 ${featured ? "bg-white/[0.04]" : "bg-[#050505]"}`}>
                <div>
                  <p className="text-[11px] text-white/35 uppercase tracking-widest mb-3">{name}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-semibold text-white">{price}</p>
                    {period && <p className="text-[12px] text-white/30">{period}</p>}
                  </div>
                  <p className="text-[12px] text-white/35 mt-2 leading-relaxed">{desc}</p>
                </div>

                <ul className="flex-1 space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[12px] text-white/40">
                      <Check className="h-3 w-3 text-white/30 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/auth" className={`h-9 flex items-center justify-center text-[12px] font-medium transition-colors ${featured
                  ? "bg-white text-black hover:bg-white/90"
                  : "border border-white/10 text-white/50 hover:text-white hover:border-white/20"
                  }`}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-32">
          <p className="text-[11px] text-white/35 uppercase tracking-[0.18em] mb-6">Get started</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight max-w-xl mb-5">
            From CSV to model<br />in one weekend.
          </h2>
          <p className="text-[14px] text-white/40 leading-relaxed max-w-sm mb-10">
            No ML experience required. MLForge guides you from raw data to a live, queryable model endpoint.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link href="/auth" className="inline-flex items-center gap-2 text-sm font-medium bg-white text-black px-5 h-10 hover:bg-white/90 transition-colors">
              Create free account <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="#" className="inline-flex items-center gap-2 text-sm text-white/40 border border-white/10 px-5 h-10 hover:text-white/70 hover:border-white/20 transition-colors">
              View roadmap
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <THEME_CONFIG.icons.ai className="h-4 w-4 text-white/50" strokeWidth={1.5} />
              <span className="text-sm font-medium text-white/50">MLForge</span>
            </div>
            <p className="text-[12px] text-white/25 leading-relaxed max-w-[14rem]">
              The SmartML platform — upload data, get a trained model.
            </p>
          </div>

          {[
            { heading: "Platform", links: ["Datasets", "EDA", "Preprocessing", "Model Registry", "Prediction API"] },
            { heading: "Developers", links: ["API Docs", "FastAPI Backend", "NextJS Frontend", "Changelog"] },
            { heading: "Company", links: ["About", "Blog", "Roadmap", "Contact"] },
          ].map(({ heading, links }) => (
            <div key={heading} className="space-y-3">
              <p className="text-[10px] font-medium text-white/25 uppercase tracking-widest">{heading}</p>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-[12px] text-white/30 hover:text-white/60 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <p className="text-[10px] font-mono text-white/15">© 2026 MLFORGE . ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
