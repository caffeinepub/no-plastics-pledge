import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
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
  const certRef = useRef<HTMLDivElement>(null); // kept for DOM reference (not used by canvas draw)
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const dateFormatted = formatPledgeDate(certificate.timestamp);

  const CERT_WIDTH = 794;
  const CERT_HEIGHT = 567; // 7:5 ratio → 794 * 5 / 7 ≈ 567

  const drawCertificateToCanvas = (
    canvas: HTMLCanvasElement,
    scale: number,
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = CERT_WIDTH * scale;
    const H = CERT_HEIGHT * scale;
    canvas.width = W;
    canvas.height = H;

    ctx.scale(scale, scale);

    // ── Background gradient ────────────────────────────────────────────────
    const bgGrad = ctx.createLinearGradient(
      0,
      0,
      CERT_WIDTH * Math.cos((160 * Math.PI) / 180),
      CERT_HEIGHT,
    );
    bgGrad.addColorStop(0, "#faf6eb");
    bgGrad.addColorStop(0.3, "#f2ede0");
    bgGrad.addColorStop(0.65, "#e8f2e8");
    bgGrad.addColorStop(1, "#dff0df");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

    // ── Outer border ──────────────────────────────────────────────────────
    ctx.strokeStyle = "#2d6b3a";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(10, 10, CERT_WIDTH - 20, CERT_HEIGHT - 20);

    ctx.strokeStyle = "rgba(80,140,80,0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, CERT_WIDTH - 32, CERT_HEIGHT - 32);

    // ── Watermark "PLEDGE" ────────────────────────────────────────────────
    ctx.save();
    ctx.font = "900 120px Georgia, serif";
    ctx.fillStyle = "rgba(60,120,60,0.04)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PLEDGE", CERT_WIDTH / 2, CERT_HEIGHT / 2);
    ctx.restore();

    // helper for centered text
    const centerText = (
      text: string,
      y: number,
      font: string,
      color: string,
      maxWidth?: number,
    ) => {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      if (maxWidth) ctx.fillText(text, CERT_WIDTH / 2, y, maxWidth);
      else ctx.fillText(text, CERT_WIDTH / 2, y);
    };

    // ── EST. 2017 row ─────────────────────────────────────────────────────
    centerText("— EST. 2017 —", 62, "600 10px 'Arial', sans-serif", "#4a8a55");

    // ── L' DORADO main heading ────────────────────────────────────────────
    ctx.save();
    const headGrad = ctx.createLinearGradient(
      CERT_WIDTH * 0.2,
      0,
      CERT_WIDTH * 0.8,
      0,
    );
    headGrad.addColorStop(0, "#1e5c30");
    headGrad.addColorStop(0.5, "#2d7a3f");
    headGrad.addColorStop(1, "#1e5c30");
    ctx.font = "900 44px Georgia, serif";
    ctx.fillStyle = headGrad;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.letterSpacing = "0.08em";
    ctx.fillText("L' DORADO", CERT_WIDTH / 2, 115);
    ctx.restore();

    // ── Ornamental divider ────────────────────────────────────────────────
    const drawDivider = (y: number, lineW = 80) => {
      const cx = CERT_WIDTH / 2;
      ctx.strokeStyle = "#3d8c50";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - lineW - 20, y);
      ctx.lineTo(cx - 15, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 15, y);
      ctx.lineTo(cx + lineW + 20, y);
      ctx.stroke();
      ctx.font = "14px serif";
      ctx.fillStyle = "#2d6b3a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦", cx, y);
    };
    drawDivider(126, 120);

    // ── Sub-label ─────────────────────────────────────────────────────────
    centerText(
      "NO SINGLE-USE PLASTICS CAMPAIGN",
      145,
      "600 10px Arial, sans-serif",
      "#3d7a55",
    );

    // ── Certificate of Pledge ─────────────────────────────────────────────
    centerText(
      "Certificate of Pledge",
      182,
      "700 30px Georgia, serif",
      "#1a3d26",
    );

    drawDivider(194, 80);

    // ── This certifies that ───────────────────────────────────────────────
    ctx.font = "italic 15px Georgia, serif";
    ctx.fillStyle = "#4a6b52";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("This certifies that", CERT_WIDTH / 2, 218);

    // ── Pledger name ──────────────────────────────────────────────────────
    ctx.font = "600 34px Georgia, serif";
    ctx.fillStyle = "#1a3d2e";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(certificate.name, CERT_WIDTH / 2, 260);

    // Underline for name
    const nameWidth = Math.min(
      ctx.measureText(certificate.name).width + 48,
      500,
    );
    ctx.strokeStyle = "#3d8c50";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CERT_WIDTH / 2 - nameWidth / 2, 265);
    ctx.lineTo(CERT_WIDTH / 2 + nameWidth / 2, 265);
    ctx.stroke();

    // ── "has taken the following pledge" ──────────────────────────────────
    ctx.font = "italic 12px Georgia, serif";
    ctx.fillStyle = "#4a6b52";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("has taken the following pledge", CERT_WIDTH / 2, 284);

    // ── Pledge text box ───────────────────────────────────────────────────
    const pledgeBoxX = (CERT_WIDTH - 580) / 2;
    const pledgeBoxY = 292;
    const pledgeBoxW = 580;
    const pledgeBoxH = 68;
    ctx.fillStyle = "rgba(200,230,200,0.35)";
    ctx.fillRect(pledgeBoxX, pledgeBoxY, pledgeBoxW, pledgeBoxH);
    ctx.strokeStyle = "#3d8c50";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pledgeBoxX, pledgeBoxY);
    ctx.lineTo(pledgeBoxX, pledgeBoxY + pledgeBoxH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pledgeBoxX + pledgeBoxW, pledgeBoxY);
    ctx.lineTo(pledgeBoxX + pledgeBoxW, pledgeBoxY + pledgeBoxH);
    ctx.stroke();

    // Wrap pledge text
    ctx.font = "italic 13px Georgia, serif";
    ctx.fillStyle = "#2d5038";
    ctx.textAlign = "center";
    const pledgeWords = `"${PLEDGE_TEXT}"`.split(" ");
    let line = "";
    let pledgeY = pledgeBoxY + 20;
    const maxLineW = pledgeBoxW - 40;
    for (const word of pledgeWords) {
      const testLine = line ? `${line} ${word}` : word;
      if (ctx.measureText(testLine).width > maxLineW && line) {
        ctx.fillText(line, CERT_WIDTH / 2, pledgeY);
        line = word;
        pledgeY += 18;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, CERT_WIDTH / 2, pledgeY);

    // ── Horizontal separator ──────────────────────────────────────────────
    const sepY = 376;
    ctx.strokeStyle = "rgba(120,180,120,0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, sepY);
    ctx.lineTo(CERT_WIDTH - 30, sepY);
    ctx.stroke();

    // ── Date (left) ───────────────────────────────────────────────────────
    ctx.font = "600 9px Arial, sans-serif";
    ctx.fillStyle = "#4a7055";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("DATE OF PLEDGE", 52, sepY + 18);
    ctx.font = "600 17px Georgia, serif";
    ctx.fillStyle = "#1a3d26";
    ctx.fillText(dateFormatted, 52, sepY + 38);

    // ── Eco seal (center) ─────────────────────────────────────────────────
    const sealCX = CERT_WIDTH / 2;
    const sealCY = sepY + 26;
    ctx.strokeStyle = "#3d8c50";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealCX, sealCY, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(200,235,200,0.55)";
    ctx.fill();
    ctx.font = "22px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🌿", sealCX, sealCY - 4);
    ctx.font = "700 7px Arial, sans-serif";
    ctx.fillStyle = "#2d6b3a";
    ctx.fillText("PLEDGED", sealCX, sealCY + 16);

    // ── Certificate No. (right) ───────────────────────────────────────────
    ctx.font = "600 9px Arial, sans-serif";
    ctx.fillStyle = "#4a7055";
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("CERTIFICATE NO.", CERT_WIDTH - 52, sepY + 18);
    ctx.font = "italic 14px Georgia, serif";
    ctx.fillStyle = "#3d6050";
    ctx.fillText(`#${certificate.id}`, CERT_WIDTH - 52, sepY + 38);

    // ── Signature block (right-aligned) ──────────────────────────────────
    const sigX = CERT_WIDTH - 60;
    ctx.font = "600 26px 'Georgia', cursive, serif";
    ctx.fillStyle = "#1a3d2e";
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("Abhikansh", sigX, sepY + 72);

    ctx.font = "600 8.5px Arial, sans-serif";
    ctx.fillStyle = "#4a6055";
    ctx.fillText("FOUNDER & PRESIDENT", sigX, sepY + 86);

    ctx.strokeStyle = "#4a8c55";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sigX - 160, sepY + 93);
    ctx.lineTo(sigX, sepY + 93);
    ctx.stroke();

    ctx.font = "800 14px Georgia, serif";
    ctx.fillStyle = "#2a6038";
    ctx.fillText("L' DORADO", sigX, sepY + 108);

    // ── Bottom botanical row ──────────────────────────────────────────────
    ctx.font = "600 8px Arial, sans-serif";
    ctx.fillStyle = "rgba(70,140,80,0.55)";
    ctx.textAlign = "center";
    ctx.fillText(
      "🌱  FOR A CLEANER PLANET  🌊",
      CERT_WIDTH / 2,
      CERT_HEIGHT - 22,
    );
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const canvas = document.createElement("canvas");
      drawCertificateToCanvas(canvas, 2);

      const imgData = canvas.toDataURL("image/jpeg", 0.96);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [CERT_WIDTH, CERT_HEIGHT],
        hotfixes: ["px_scaling"],
      });

      pdf.addImage(imgData, "JPEG", 0, 0, CERT_WIDTH, CERT_HEIGHT);
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
                  height: "567px",
                  background:
                    "linear-gradient(160deg, #faf6eb 0%, #f2ede0 30%, #e8f2e8 65%, #dff0df 100%)",
                  padding: "24px 52px 20px",
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
                      marginBottom: "2px",
                    }}
                  >
                    {/* Decorative top botanical row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "16px",
                        marginBottom: "6px",
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
                        EST. 2017
                      </span>
                      <LeafMotif flip />
                    </div>

                    {/* Main org name */}
                    <div
                      style={{
                        fontFamily: "Fraunces, Georgia, serif",
                        fontSize: "44px",
                        fontWeight: "900",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        lineHeight: "1",
                        background:
                          "linear-gradient(135deg, oklch(0.28 0.14 148) 0%, oklch(0.40 0.20 140) 50%, oklch(0.30 0.14 152) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        marginBottom: "6px",
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
                      marginTop: "4px",
                      marginBottom: "2px",
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
                      fontSize: "30px",
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
                  <div style={{ margin: "6px 0" }}>
                    <OrnamentalDivider />
                  </div>

                  {/* ── This certifies that ─────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: "Crimson Pro, Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "15px",
                      color: "oklch(0.42 0.06 145)",
                      marginBottom: "4px",
                    }}
                  >
                    This certifies that
                  </div>

                  {/* ── Pledger's name ───────────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        fontFamily: "Fraunces, Georgia, serif",
                        fontSize: "34px",
                        fontWeight: "600",
                        color: "oklch(0.24 0.12 150)",
                        letterSpacing: "-0.01em",
                        lineHeight: "1.2",
                        paddingBottom: "6px",
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

                  {/* ── "has taken the following pledge" label ───────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: "Crimson Pro, Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "12px",
                      color: "oklch(0.48 0.06 145)",
                      marginBottom: "5px",
                      letterSpacing: "0.01em",
                    }}
                  >
                    has taken the following pledge
                  </div>

                  {/* ── Pledge text ──────────────────────────────────────── */}
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: "Crimson Pro, Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "13.5px",
                      lineHeight: "1.6",
                      color: "oklch(0.34 0.06 145)",
                      maxWidth: "580px",
                      margin: "0 auto 10px",
                      padding: "10px 20px",
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
                      marginBottom: "8px",
                      paddingTop: "8px",
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
                    <div style={{ textAlign: "right" }}>
                      {/* Signature name in handwriting script font */}
                      <div
                        style={{
                          fontFamily: "'Dancing Script', cursive",
                          fontSize: "28px",
                          fontWeight: "600",
                          color: "oklch(0.24 0.14 148)",
                          lineHeight: "1.2",
                          letterSpacing: "0.01em",
                          minWidth: "150px",
                          marginBottom: "2px",
                          /* Subtle ink-like text shadow for handwritten depth */
                          textShadow:
                            "0.5px 0.5px 0px oklch(0.28 0.12 148 / 0.18)",
                        }}
                      >
                        Abhikansh
                      </div>
                      {/* Designation label */}
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "8.5px",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                          color: "oklch(0.52 0.08 148)",
                          fontWeight: "600",
                          marginBottom: "6px",
                        }}
                      >
                        Founder &amp; President
                      </div>
                      {/* Separator line */}
                      <div
                        style={{
                          borderTop: "1px solid oklch(0.62 0.12 138)",
                          paddingTop: "5px",
                        }}
                      >
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
                      marginTop: "6px",
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

        {/* Certificate scale CSS — cert is 794×567px (7:5 ratio) */}
        <style>{`
          @media (max-width: 840px) {
            .certificate-scale-wrapper {
              transform: scale(0.85) !important;
              margin-bottom: -85px;
            }
          }
          @media (max-width: 700px) {
            .certificate-scale-wrapper {
              transform: scale(0.68) !important;
              margin-bottom: -181px;
            }
          }
          @media (max-width: 540px) {
            .certificate-scale-wrapper {
              transform: scale(0.52) !important;
              margin-bottom: -272px;
            }
          }
          @media (max-width: 430px) {
            .certificate-scale-wrapper {
              transform: scale(0.42) !important;
              margin-bottom: -329px;
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
