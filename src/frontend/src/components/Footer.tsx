export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="py-8 px-4 text-center"
      style={{
        background: "oklch(0.16 0.05 148)",
        color: "oklch(0.72 0.06 140)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-3">
          {/* Logo/motto */}
          <div className="text-2xl">🌊</div>
          <p
            className="font-display text-lg font-semibold"
            style={{ color: "oklch(0.82 0.08 138)" }}
          >
            No Single-Use Plastics Campaign
          </p>
          <p
            className="font-body text-sm max-w-md"
            style={{ color: "oklch(0.6 0.04 145)" }}
          >
            Together, we can protect our oceans and create a cleaner, healthier
            planet for generations to come.
          </p>

          <div
            className="w-16 h-px mt-2"
            style={{ background: "oklch(0.35 0.06 148)" }}
          />

          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.5 0.04 145)" }}
          >
            An initiative by{" "}
            <span style={{ color: "oklch(0.55 0.18 142)", fontWeight: 600 }}>
              L&apos; DORADO
            </span>
            {" · "}© {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-current"
              style={{ color: "oklch(0.65 0.1 142)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
