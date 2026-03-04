import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import type { Certificate as CertificateType } from "./backend.d";
import { Certificate } from "./components/Certificate";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { PledgeForm } from "./components/PledgeForm";
import { PledgeWall } from "./components/PledgeWall";

export default function App() {
  const [certificate, setCertificate] = useState<CertificateType | null>(null);

  const handlePledgeSuccess = (cert: CertificateType) => {
    setCertificate(cert);
    // Scroll to certificate section
    setTimeout(() => {
      document.getElementById("certificate-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleReset = () => {
    setCertificate(null);
    // Scroll back to form
    setTimeout(() => {
      document.getElementById("pledge-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />

      {/* Header/Nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{
          background: "oklch(0.1 0.04 148 / 0.85)",
          borderBottom: "1px solid oklch(0.45 0.1 142 / 0.25)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌿</span>
            <span
              className="font-display font-bold text-lg tracking-tight"
              style={{ color: "oklch(0.92 0.06 138)" }}
            >
              No Plastics Pledge
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              document
                .getElementById("pledge-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="hidden sm:inline-flex items-center px-5 py-2 rounded-lg font-body font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "oklch(0.48 0.15 142)",
              color: "oklch(0.97 0.01 120)",
            }}
          >
            Take the Pledge
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero */}
        <HeroSection />

        {/* Certificate section (shown after successful pledge) */}
        <AnimatePresence>
          {certificate && (
            <div id="certificate-section">
              <Certificate certificate={certificate} onReset={handleReset} />
            </div>
          )}
        </AnimatePresence>

        {/* Pledge Form (hidden after successful pledge) */}
        <AnimatePresence>
          {!certificate && <PledgeForm onSuccess={handlePledgeSuccess} />}
        </AnimatePresence>

        {/* Pledge Wall */}
        <PledgeWall />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
