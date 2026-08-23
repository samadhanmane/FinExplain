import React from "react";
import { Link } from "react-router-dom";
import { Scale, ArrowLeft, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export function TermsPage() {
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
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400">
            <Scale className="h-4 w-4" />
            <span>Terms of Service • Effective August 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Please read these Terms of Service ("Terms") carefully before using the FinExplain platform, APIs, and document analysis services.
          </p>
        </div>

        <div className="space-y-10 text-sm text-white/85 leading-relaxed">
          {/* Section 1 */}
          <section className="rounded-2xl border border-white/10 bg-surface/40 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">01.</span> Acceptance of Terms
            </h2>
            <p>
              By accessing or using FinExplain, signing in via Google OAuth or email, and uploading documents, you agree to be bound by these Terms. If you do not agree, do not access or use the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <span>02. Informational & Analytical Nature (Not Legal / Financial Advice)</span>
            </h2>
            <p className="text-amber-100/90 leading-relaxed">
              FinExplain is an evidence-first, automated AI tool built to extract, summarize, and cross-reference clauses within loan contracts, Key Fact Statements (KFS), and financial documents. <strong>FinExplain does not provide certified legal, investment, or statutory financial advisory services.</strong>
            </p>
            <p className="text-amber-100/80 text-xs italic">
              All borrowers and auditors must verify official executed agreements directly with their lending institution before making binding financial commitments.
            </p>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-white/10 bg-surface/40 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">03.</span> User Conduct & Document Uploads
            </h2>
            <p>You agree to only upload documents that you are authorized to inspect or evaluate. You may not upload:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
              <li>Malicious payloads, executable binaries, or corrupted files intended to disrupt system services.</li>
              <li>Material containing unauthorized classified or confidential trade secrets.</li>
              <li>Queries designed to perform prompt injection or bypass automated safety guardrails.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-white/10 bg-surface/40 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">04.</span> Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, FinExplain and its creators (Team CodeFlex) shall not be liable for any direct, indirect, incidental, or consequential damages resulting from discrepancies in third-party financial agreements or user credit decisions.
            </p>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-white/10 bg-surface/40 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400 font-mono text-sm">05.</span> Governing Law & Modifications
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of FinExplain following published modifications constitutes acceptance of the updated terms.
            </p>
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
