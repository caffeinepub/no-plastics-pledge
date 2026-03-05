import { ArrowDown, Users } from "lucide-react";
import { motion } from "motion/react";
import { useGetTotalPledges } from "../hooks/useQueries";

export function HeroSection() {
  const { data: totalPledges, isLoading } = useGetTotalPledges();

  const count = totalPledges ? Number(totalPledges) : 0;

  const scrollToPledge = () => {
    document
      .getElementById("pledge-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/ocean-hero-bg.dim_1600x900.jpg')",
        }}
      />

      {/* Gradient overlay — dark at bottom for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.12 0.04 220 / 0.55) 0%, oklch(0.10 0.05 148 / 0.75) 60%, oklch(0.08 0.05 148 / 0.92) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex flex-col items-center gap-1 mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-body font-semibold backdrop-blur-sm"
            style={{
              background: "oklch(0.95 0.1 142 / 0.15)",
              border: "1px solid oklch(0.75 0.15 142 / 0.4)",
              color: "oklch(0.92 0.1 138)",
            }}
          >
            🌿 An initiative by L&apos; DORADO
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6"
          style={{ color: "oklch(0.97 0.015 90)" }}
        >
          Join the{" "}
          <span
            style={{
              color: "oklch(0.78 0.2 142)",
              textShadow: "0 0 40px oklch(0.58 0.2 142 / 0.5)",
            }}
          >
            No Single-Use
          </span>
          <br />
          Plastics Pledge
        </motion.h1>

        {/* Mission statement */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-body text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ color: "oklch(0.88 0.02 120 / 0.9)" }}
        >
          Every year,{" "}
          <strong style={{ color: "oklch(0.82 0.15 85)" }}>
            8 million tonnes
          </strong>{" "}
          of plastic enter our oceans, threatening marine life and ecosystems.
          By refusing single-use plastics, we can turn the tide. Make your
          pledge today and inspire a wave of change.
        </motion.p>

        {/* Pledge counter */}
        <motion.div
          data-ocid="counter.section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.65,
            duration: 0.5,
            type: "spring",
            stiffness: 150,
          }}
          className="inline-flex items-center gap-4 px-8 py-5 rounded-2xl mb-10 backdrop-blur-md"
          style={{
            background: "oklch(0.15 0.04 148 / 0.6)",
            border: "1px solid oklch(0.55 0.12 142 / 0.35)",
          }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full"
            style={{ background: "oklch(0.45 0.15 142 / 0.3)" }}
          >
            <Users
              className="w-6 h-6"
              style={{ color: "oklch(0.78 0.18 138)" }}
            />
          </div>
          <div className="text-left">
            {isLoading ? (
              <div
                className="h-9 w-28 rounded-lg animate-pulse mb-1"
                style={{ background: "oklch(0.4 0.05 145 / 0.5)" }}
              />
            ) : (
              <div
                className="font-display text-4xl font-bold count-animate"
                style={{ color: "oklch(0.92 0.1 138)" }}
              >
                {count.toLocaleString()}
              </div>
            )}
            <div
              className="font-body text-sm font-medium"
              style={{ color: "oklch(0.75 0.06 140)" }}
            >
              people have taken the pledge
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            type="button"
            onClick={scrollToPledge}
            className="group flex items-center gap-3 px-10 py-4 rounded-2xl font-body font-bold text-lg transition-all duration-300 hover:shadow-eco-lg hover:scale-[1.02] active:scale-[0.99]"
            style={{
              background: "oklch(0.48 0.15 142)",
              color: "oklch(0.97 0.01 120)",
              boxShadow: "0 4px 32px oklch(0.45 0.18 142 / 0.4)",
            }}
          >
            Take the Pledge Now
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Animated wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20"
          style={{ fill: "oklch(0.97 0.01 130)" }}
          aria-hidden="true"
          role="presentation"
        >
          <path d="M0,60 C360,100 720,20 1080,60 C1260,80 1380,40 1440,60 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </section>
  );
}
