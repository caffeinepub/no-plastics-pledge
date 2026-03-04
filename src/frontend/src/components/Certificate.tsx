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
        backgroundColor: "#fff8f0",
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
            You've Joined the Movement!
          </h2>
          <p className="text-lg" style={{ color: "oklch(0.48 0.05 145)" }}>
            Your certificate of pledge is ready. Download it to share your
            commitment.
          </p>
        </div>

        {/* Certificate preview wrapper — scaled to fit viewport */}
        <div className="flex justify-center mb-8">
          <div
            className="w-full overflow-hidden"
            style={{
              maxWidth: "100%",
            }}
          >
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
                    "linear-gradient(135deg, #fff8f0 0%, #f5f0e8 40%, #eef5ee 100%)",
                  padding: "48px 56px",
                  fontFamily: "'Crimson Pro', Georgia, serif",
                  position: "relative",
                  boxSizing: "border-box",
                }}
              >
                {/* Outer decorative border — double lines */}
                <div
                  style={{
                    position: "absolute",
                    inset: "12px",
                    border: "2px solid oklch(0.45 0.12 138)",
                    borderRadius: "4px",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "18px",
                    border: "1px solid oklch(0.65 0.1 138 / 0.5)",
                    borderRadius: "2px",
                    pointerEvents: "none",
                  }}
                />

                {/* Corner ornaments */}
                {(
                  [
                    {
                      pos: { top: "20px", left: "20px" },
                      border: "2px 0 0 2px",
                      id: "tl",
                    },
                    {
                      pos: { top: "20px", right: "20px" },
                      border: "2px 2px 0 0",
                      id: "tr",
                    },
                    {
                      pos: { bottom: "20px", left: "20px" },
                      border: "0 0 2px 2px",
                      id: "bl",
                    },
                    {
                      pos: { bottom: "20px", right: "20px" },
                      border: "0 2px 2px 0",
                      id: "br",
                    },
                  ] as const
                ).map(({ pos, border, id }) => (
                  <div
                    key={id}
                    style={{
                      position: "absolute",
                      width: "24px",
                      height: "24px",
                      borderColor: "oklch(0.58 0.18 142)",
                      borderStyle: "solid",
                      borderWidth: border,
                      ...pos,
                    }}
                  />
                ))}

                {/* Leaf decorative top center */}
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "8px",
                    fontSize: "22px",
                  }}
                >
                  🌿
                </div>

                {/* Campaign name */}
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "oklch(0.48 0.1 150)",
                    marginBottom: "6px",
                  }}
                >
                  No Single-Use Plastics Campaign
                </div>

                {/* Title */}
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: "42px",
                    fontWeight: "700",
                    color: "oklch(0.22 0.07 148)",
                    lineHeight: "1.1",
                    marginBottom: "4px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Certificate of Pledge
                </div>

                {/* Ornamental divider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    margin: "16px 0",
                  }}
                >
                  <div
                    style={{
                      height: "1px",
                      width: "80px",
                      background: "oklch(0.58 0.18 142)",
                    }}
                  />
                  <div style={{ fontSize: "16px" }}>✦</div>
                  <div
                    style={{
                      height: "1px",
                      width: "80px",
                      background: "oklch(0.58 0.18 142)",
                    }}
                  />
                </div>

                {/* This certifies that */}
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "Crimson Pro, Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "18px",
                    color: "oklch(0.42 0.06 145)",
                    marginBottom: "10px",
                  }}
                >
                  This certifies that
                </div>

                {/* Pledger's Name */}
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: "38px",
                    fontWeight: "600",
                    color: "oklch(0.28 0.1 150)",
                    letterSpacing: "-0.01em",
                    marginBottom: "6px",
                    lineHeight: "1.2",
                    borderBottom: "1px solid oklch(0.75 0.1 138)",
                    paddingBottom: "10px",
                    maxWidth: "540px",
                    margin: "0 auto 16px",
                  }}
                >
                  {certificate.name}
                </div>

                {/* Pledge text */}
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "Crimson Pro, Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: "oklch(0.35 0.05 145)",
                    maxWidth: "560px",
                    margin: "0 auto 24px",
                  }}
                >
                  "{PLEDGE_TEXT}"
                </div>

                {/* Date and Certificate ID row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "24px",
                    paddingTop: "8px",
                    borderTop: "1px solid oklch(0.84 0.05 135)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "oklch(0.58 0.06 145)",
                        marginBottom: "3px",
                      }}
                    >
                      Date of Pledge
                    </div>
                    <div
                      style={{
                        fontFamily: "Crimson Pro, Georgia, serif",
                        fontSize: "17px",
                        fontWeight: "600",
                        color: "oklch(0.28 0.08 148)",
                      }}
                    >
                      {dateFormatted}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "oklch(0.58 0.06 145)",
                        marginBottom: "3px",
                      }}
                    >
                      Certificate No.
                    </div>
                    <div
                      style={{
                        fontFamily: "Crimson Pro, Georgia, serif",
                        fontSize: "14px",
                        color: "oklch(0.45 0.06 145)",
                        fontStyle: "italic",
                      }}
                    >
                      #{certificate.id}
                    </div>
                  </div>
                </div>

                {/* Signature block */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    gap: "12px",
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
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "oklch(0.42 0.08 148)",
                        borderTop: "1px solid oklch(0.65 0.1 138)",
                        paddingTop: "4px",
                      }}
                    >
                      Campaign Organizer
                    </div>
                  </div>
                </div>

                {/* Bottom leaf decoration */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "16px",
                    fontSize: "16px",
                    opacity: 0.5,
                  }}
                >
                  🌱 · 🌊 · 🌍
                </div>
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
