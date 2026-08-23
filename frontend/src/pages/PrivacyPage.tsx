import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, ArrowLeft, Eye, FileText, CheckCircle2 } from "lucide-react";

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 text-white transition hover:opacity-80">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black font-bold font-mono text-sm shadow-md">
              FE
            </span>
            <span className="font-extrabold tracking-tight text-lg">FinExplain</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16 space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Last Updated: August 2026 • Effective Immediately</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            FinExplain ("we", "our", or "us") is dedicated to safeguarding your personal financial information. This Privacy Policy details how we collect, handle, protect, and redact data when you use the FinExplain web application, Google OAuth authentication, and document analysis services.
          </p>
        </div>

        <div className="space-y-10 text-sm text-white/85 leading-relaxed">
          {/* Section 1 */}
          <section className="rounded-2xl border border-white/10 bg-surface/40 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">01.</span> Information We Collect
            </h2>
            <p>We collect only the minimum necessary information required to authenticate you and process your financial documents:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
              <li><strong className="text-white">Account Information (Google OAuth):</strong> When signing in with Google, we receive your verified email address, full name, and avatar URL strictly for account identification.</li>
              <li><strong className="text-white">Uploaded Loan Documents:</strong> Key Fact Statements (KFS), Sanction Letters, Loan Agreements, and Amortization Schedules that you explicitly upload for inspection.</li>
              <li><strong className="text-white">Query & Interaction Logs:</strong> Questions submitted during document audits to calculate evidence scores and provide citation-backed answers.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-white/10 bg-surface/40 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">02.</span> Automated PII Redaction & Ingress Guards
            </h2>
            <p>FinExplain incorporates an automated PII Redaction Guard (`PiiGuard`) at the ingestion boundary before any external language model processing:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
              <li>Permanent Indian Permanent Account Numbers (PAN), Aadhaar numbers, phone numbers, and bank account numbers are dynamically masked with `[REDACTED_PII]` tokens.</li>
              <li>We never use your private loan contracts or personal credit history to train generalized machine learning models.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-white/10 bg-surface/40 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">03.</span> How We Use Your Data
            </h2>
            <p>Your data is processed strictly for the following functional purposes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mb-1.5" />
                <h3 className="font-semibold text-white text-xs">Deterministic Analysis</h3>
                <p className="text-[11px] text-muted-foreground mt-1">Extracting loan facts, APRs, covenants, and foreclosure rules.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mb-1.5" />
                <h3 className="font-semibold text-white text-xs">Citation Grounding</h3>
                <p className="text-[11px] text-muted-foreground mt-1">Linking every factual answer directly to its verified source page.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-white/10 bg-surface/40 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">04.</span> Data Retention & Your Rights
            </h2>
            <p>You maintain 100% ownership over your data. You may request permanent deletion of your account and all associated parsed documents at any time from your account Settings or by contacting support.</p>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-white/10 bg-surface/40 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">05.</span> Contact Us
            </h2>
            <p>For privacy inquiries, audit questions, or data removal requests, contact our security team at:</p>
            <p className="font-mono text-xs text-cyan-400">privacy@finexplain.com • support@finexplain.com</p>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FinExplain. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
