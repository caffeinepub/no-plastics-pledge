import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Loader2, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import type { Certificate as CertificateType } from "../backend.d";
import { formatPledgeDate } from "../utils/dateFormat";

interface CertificateProps {
  certificate: CertificateType;
  onReset: () => void;
}

const PLEDGE_TEXT =
  "I pledge to eliminate single-use plastics from my daily life — refusing plastic bags, bottles, straws, cutlery, and packaging — and to inspire others to do the same.";

/* ─── Decorative SVG elements used inside the certificate ─────────────────── */

/** Botanical leaf motif — used as left/right flanking decoration */
function LeafMotif({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      role="img"
      aria-label="Botanical leaf decoration"
      style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}
    >
      <path
        d="M2 12 C8 4, 20 2, 28 8 C20 6, 14 10, 12 14 C20 10, 30 8, 40 12"
        stroke="oklch(0.50 0.14 140)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M2 12 C10 20, 22 22, 30 16 C22 18, 16 14, 14 10"
        stroke="oklch(0.55 0.12 142)"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M40 12 L46 12"
        stroke="oklch(0.50 0.14 140)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Elegant ornamental divider with diamond and lines */
function OrnamentalDivider({ wide = false }: { wide?: boolean }) {
  const lineW = wide ? 120 : 80;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div
        style={{
          height: "1px",
          width: `${lineW}px`,
          background:
            "linear-gradient(to right, transparent, oklch(0.52 0.16 140))",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "0 12px",
        }}
      >
        <span style={{ fontSize: "8px", color: "oklch(0.52 0.16 140)" }}>
          ◆
        </span>
        <span style={{ fontSize: "14px", color: "oklch(0.44 0.18 140)" }}>
          ✦
        </span>
        <span style={{ fontSize: "8px", color: "oklch(0.52 0.16 140)" }}>
          ◆
        </span>
      </div>
      <div
        style={{
          height: "1px",
          width: `${lineW}px`,
          background:
            "linear-gradient(to left, transparent, oklch(0.52 0.16 140))",
        }}
      />
    </div>
  );
}

export function Certificate({ certificate, onReset }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const dateFormatted = formatPledgeDate(certificate.timestamp);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f5f0e4",
        logging: false,
        width: 794,
        height: certRef.current.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [794, Math.round(canvas.height / 2)],
      });

      pdf.addImage(imgData, "JPEG", 0, 0, 794, Math.round(canvas.height / 2));
      pdf.save(`pledge-certificate-${certificate.id}.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.section
      data-ocid="pledge.success_state"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: "oklch(0.92 0.08 142)" }}
          >
            <CheckCircle
              className="w-8 h-8"
              style={{ color: "oklch(0.32 0.09 152)" }}
            />
          </motion.div>
          <h2
            className="font-display text-4xl font-bold mb-3"
            style={{ color: "oklch(0.22 0.07 148)" }}
          >
            You&apos;ve Joined the Movement!
          </h2>
          <p className="text-lg" style={{ color: "oklch(0.48 0.05 145)" }}>
            Your certificate of pledge is ready. Download it to share your
            commitment.
          </p>
        </div>

        {/* Certificate preview wrapper — scaled to fit viewport */}
        <div className="flex justify-center mb-8">
          <div className="w-full overflow-hidden" style={{ maxWidth: "100%" }}>
            <div
              style={{
                width: "794px",
                transformOrigin: "top center",
                transform: "scale(var(--cert-scale, 1))",
              }}
              className="certificate-scale-wrapper"
            >
              {/* ===== THE ACTUAL CERTIFICATE (captured by html2canvas) ===== */}
              <div
                id="certificate-print-area"
                ref={certRef}
                style={{
                  width: "794px",
                  background:
                    "linear-gradient(160deg, #faf6eb 0%, #f2ede0 30%, #e8f2e8 65%, #dff0df 100%)",
                  padding: "52px 60px 44px",
                  fontFamily: "'Crimson Pro', Georgia, serif",
                  position: "relative",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                {/* ── Watermark background text ─────────────────────────── */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontSize: "120px",
                      fontWeight: "900",
                      color: "oklch(0.62 0.12 142)",
                      opacity: 0.04,
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      userSelect: "none",
                      lineHeight: "1",
                      whiteSpace: "nowrap",
                    }}
                  >
                    PLEDGE
                  </div>
                </div>

                {/* ── Subtle radial glow in center ──────────────────────── */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, oklch(0.88 0.06 140 / 0.3) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />

                {/* ── Outer border — gold-green double frame ────────────── */}
                <div
                  style={{
                    position: "absolute",
                    inset: "10px",
                    border: "2.5px solid oklch(0.42 0.16 138)",
                    borderRadius: "6px",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "16px",
                    border: "1px solid oklch(0.62 0.12 138 / 0.45)",
                    borderRadius: "3px",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />

                {/* ── Corner flourishes ─────────────────────────────────── */}
                {(
                  [
                    {
                      pos: { top: "18px", left: "18px" },
                      rt: "0deg",
                      id: "tl",
                    },
                    {
                      pos: { top: "18px", right: "18px" },
                      rt: "90deg",
                      id: "tr",
                    },
                    {
                      pos: { bottom: "18px", right: "18px" },
                      rt: "180deg",
                      id: "br",
                    },
                    {
                      pos: { bottom: "18px", left: "18px" },
                      rt: "270deg",
                      id: "bl",
                    },
                  ] as const
                ).map(({ pos, rt, id }) => (
                  <div
                    key={id}
                    style={{
                      position: "absolute",
                      width: "32px",
                      height: "32px",
                      ...pos,
                      zIndex: 2,
                      transform: `rotate(${rt})`,
                      pointerEvents: "none",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      role="img"
                      aria-label="Corner flourish decoration"
                    >
                      <path
                        d="M2 30 L2 6 Q2 2 6 2 L30 2"
                        stroke="oklch(0.46 0.18 140)"
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="2"
                        cy="2"
                        r="2.5"
                        fill="oklch(0.46 0.18 140)"
                      />
                    </svg>
                  </div>
                ))}

                {/* ── All certificate content sits above the decorative layers ── */}
                <div style={{ position: "relative", zIndex: 3 }}>
                  {/* ── L' DORADO Header ────────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "6px",
                    }}
                  >
                    {/* Decorative top botanical row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "16px",
                        marginBottom: "14px",
                      }}
                    >
                      <LeafMotif />
                      <span
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.35em",
                          textTransform: "uppercase",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          color: "oklch(0.50 0.12 145)",
                          fontWeight: "600",
                        }}
                      >
                        EST. 2024
                      </span>
                      <LeafMotif flip />
                    </div>

                    {/* Main org name */}
                    <div
                      style={{
                        fontFamily: "Fraunces, Georgia, serif",
                        fontSize: "52px",
                        fontWeight: "900",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        lineHeight: "1",
                        background:
                          "linear-gradient(135deg, oklch(0.28 0.14 148) 0%, oklch(0.40 0.20 140) 50%, oklch(0.30 0.14 152) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        marginBottom: "8px",
                      }}
                    >
                      L&apos; DORADO
                    </div>

                    <OrnamentalDivider wide />
                  </div>

                  {/* ── Campaign sub-label ───────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "10px",
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "oklch(0.46 0.10 150)",
                      marginTop: "12px",
                      marginBottom: "4px",
                      fontWeight: "600",
                    }}
                  >
                    No Single-Use Plastics Campaign
                  </div>

                  {/* ── Certificate title ────────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: "Fraunces, Georgia, serif",
                      fontSize: "40px",
                      fontWeight: "700",
                      color: "oklch(0.20 0.08 148)",
                      lineHeight: "1.1",
                      marginBottom: "2px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Certificate of Pledge
                  </div>

                  {/* ── Ornamental divider ───────────────────────────────── */}
                  <div style={{ margin: "14px 0" }}>
                    <OrnamentalDivider />
                  </div>

                  {/* ── This certifies that ─────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: "Crimson Pro, Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "18px",
                      color: "oklch(0.42 0.06 145)",
                      marginBottom: "8px",
                    }}
                  >
                    This certifies that
                  </div>

                  {/* ── Pledger's name ───────────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        fontFamily: "Fraunces, Georgia, serif",
                        fontSize: "40px",
                        fontWeight: "600",
                        color: "oklch(0.24 0.12 150)",
                        letterSpacing: "-0.01em",
                        lineHeight: "1.2",
                        paddingBottom: "8px",
                        paddingLeft: "24px",
                        paddingRight: "24px",
                        borderBottom: "2px solid oklch(0.52 0.16 138)",
                        position: "relative",
                      }}
                    >
                      {certificate.name}
                      {/* Subtle underline glow */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-4px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          height: "1px",
                          width: "60%",
                          background: "oklch(0.65 0.12 138 / 0.5)",
                        }}
                      />
                    </div>
                  </div>

                  {/* ── Pledge text ──────────────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: "Crimson Pro, Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "15.5px",
                      lineHeight: "1.75",
                      color: "oklch(0.34 0.06 145)",
                      maxWidth: "580px",
                      margin: "0 auto 22px",
                      padding: "14px 20px",
                      background: "oklch(0.94 0.04 140 / 0.5)",
                      borderLeft: "3px solid oklch(0.52 0.16 140)",
                      borderRight: "3px solid oklch(0.52 0.16 140)",
                      borderRadius: "2px",
                    }}
                  >
                    &ldquo;{PLEDGE_TEXT}&rdquo;
                  </div>

                  {/* ── Thin section separator ───────────────────────────── */}
                  <div
                    style={{
                      borderTop: "1px solid oklch(0.80 0.06 138)",
                      marginBottom: "16px",
                      paddingTop: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    {/* Date */}
                    <div>
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "9px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "oklch(0.55 0.07 145)",
                          marginBottom: "3px",
                          fontWeight: "600",
                        }}
                      >
                        Date of Pledge
                      </div>
                      <div
                        style={{
                          fontFamily: "Crimson Pro, Georgia, serif",
                          fontSize: "17px",
                          fontWeight: "600",
                          color: "oklch(0.26 0.09 148)",
                        }}
                      >
                        {dateFormatted}
                      </div>
                    </div>

                    {/* Seal-style eco badge */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "50%",
                          border: "2px solid oklch(0.44 0.16 140)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "oklch(0.92 0.06 140 / 0.6)",
                          gap: "1px",
                        }}
                      >
                        <div style={{ fontSize: "18px", lineHeight: "1" }}>
                          🌿
                        </div>
                        <div
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "6px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "oklch(0.38 0.14 140)",
                            fontWeight: "700",
                          }}
                        >
                          PLEDGED
                        </div>
                      </div>
                    </div>

                    {/* Certificate No. */}
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "9px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "oklch(0.55 0.07 145)",
                          marginBottom: "3px",
                          fontWeight: "600",
                        }}
                      >
                        Certificate No.
                      </div>
                      <div
                        style={{
                          fontFamily: "Crimson Pro, Georgia, serif",
                          fontSize: "14px",
                          color: "oklch(0.44 0.07 145)",
                          fontStyle: "italic",
                        }}
                      >
                        #{certificate.id}
                      </div>
                    </div>
                  </div>

                  {/* ── Signature block ──────────────────────────────────── */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <img
                        src="/assets/generated/signature-stamp-transparent.dim_300x120.png"
                        alt="Campaign Organizer Signature"
                        style={{
                          width: "180px",
                          height: "72px",
                          objectFit: "contain",
                          display: "block",
                          marginBottom: "4px",
                        }}
                        crossOrigin="anonymous"
                      />
                      <div
                        style={{
                          borderTop: "1px solid oklch(0.62 0.12 138)",
                          paddingTop: "5px",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "9px",
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "oklch(0.52 0.08 148)",
                            marginBottom: "2px",
                            fontWeight: "600",
                          }}
                        >
                          Campaign Organizer
                        </div>
                        <div
                          style={{
                            fontFamily: "Fraunces, Georgia, serif",
                            fontSize: "14px",
                            fontWeight: "800",
                            letterSpacing: "0.08em",
                            color: "oklch(0.34 0.18 142)",
                          }}
                        >
                          L&apos; DORADO
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Bottom botanical row ─────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      opacity: 0.55,
                    }}
                  >
                    <LeafMotif />
                    <span style={{ fontSize: "12px" }}>🌱</span>
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "8px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "oklch(0.44 0.12 145)",
                        fontWeight: "600",
                      }}
                    >
                      FOR A CLEANER PLANET
                    </span>
                    <span style={{ fontSize: "12px" }}>🌊</span>
                    <LeafMotif flip />
                  </div>
                </div>
                {/* end z-index 3 wrapper */}
              </div>
            </div>
          </div>
        </div>

        {/* Certificate scale CSS */}
        <style>{`
          @media (max-width: 840px) {
            .certificate-scale-wrapper {
              transform: scale(0.85) !important;
              margin-bottom: -60px;
            }
          }
          @media (max-width: 700px) {
            .certificate-scale-wrapper {
              transform: scale(0.68) !important;
              margin-bottom: -140px;
            }
          }
          @media (max-width: 540px) {
            .certificate-scale-wrapper {
              transform: scale(0.52) !important;
              margin-bottom: -220px;
            }
          }
          @media (max-width: 430px) {
            .certificate-scale-wrapper {
              transform: scale(0.42) !important;
              margin-bottom: -280px;
            }
          }
        `}</style>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
          <Button
            data-ocid="certificate.download_button"
            onClick={handleDownload}
            disabled={isDownloading}
            size="lg"
            className="min-w-48 font-body font-semibold text-base h-12 shadow-eco transition-all duration-200 hover:shadow-eco-lg"
            style={{
              background: "oklch(0.32 0.09 152)",
              color: "oklch(0.97 0.005 120)",
            }}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating PDF…
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download Certificate as PDF
              </>
            )}
          </Button>

          <Button
            data-ocid="certificate.reset_button"
            onClick={onReset}
            variant="outline"
            size="lg"
            className="min-w-48 font-body font-semibold text-base h-12 border-2 transition-all duration-200"
            style={{
              borderColor: "oklch(0.65 0.1 138)",
              color: "oklch(0.32 0.09 152)",
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Another Pledge
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
