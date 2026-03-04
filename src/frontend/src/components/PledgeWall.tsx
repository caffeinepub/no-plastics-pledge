import { Leaf, Users } from "lucide-react";
import { motion } from "motion/react";
import { useGetRecentCertificates } from "../hooks/useQueries";
import { formatPrivateName, formatShortDate } from "../utils/dateFormat";

// Fallback sample data to show on first load
const SAMPLE_PLEDGERS = [
  {
    id: "sample-1",
    name: "Priya Sharma",
    timestamp: BigInt(1740000000000000000),
  },
  {
    id: "sample-2",
    name: "James O'Brien",
    timestamp: BigInt(1739900000000000000),
  },
  {
    id: "sample-3",
    name: "Mei Lin Chen",
    timestamp: BigInt(1739800000000000000),
  },
  {
    id: "sample-4",
    name: "Arjun Patel",
    timestamp: BigInt(1739700000000000000),
  },
  {
    id: "sample-5",
    name: "Sofia Martinez",
    timestamp: BigInt(1739600000000000000),
  },
  {
    id: "sample-6",
    name: "David Okafor",
    timestamp: BigInt(1739500000000000000),
  },
];

function PledgerCard({
  name,
  timestamp,
  index,
}: {
  name: string;
  timestamp: bigint;
  index: number;
}) {
  const displayName = formatPrivateName(name);
  const dateStr = formatShortDate(timestamp);
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Rotating background colors for avatar badges
  const avatarColors = [
    { bg: "oklch(0.88 0.06 142)", fg: "oklch(0.28 0.1 148)" },
    { bg: "oklch(0.88 0.06 218)", fg: "oklch(0.25 0.1 220)" },
    { bg: "oklch(0.88 0.07 85)", fg: "oklch(0.28 0.08 65)" },
    { bg: "oklch(0.88 0.06 165)", fg: "oklch(0.28 0.1 160)" },
    { bg: "oklch(0.90 0.05 120)", fg: "oklch(0.28 0.08 130)" },
    { bg: "oklch(0.88 0.07 65)", fg: "oklch(0.28 0.08 50)" },
  ];
  const color = avatarColors[index % avatarColors.length];

  return (
    <motion.div
      data-ocid={`pledge_wall.item.${index + 1}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:shadow-eco cursor-default"
      style={{ background: "white", border: "1px solid oklch(0.90 0.025 138)" }}
    >
      {/* Avatar circle */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-body font-bold text-sm"
        style={{ background: color.bg, color: color.fg }}
      >
        {initials}
      </div>

      {/* Name and date */}
      <div className="flex-1 min-w-0">
        <p
          className="font-body font-semibold text-sm truncate"
          style={{ color: "oklch(0.25 0.07 148)" }}
        >
          {displayName}
        </p>
        <p
          className="font-body text-xs"
          style={{ color: "oklch(0.58 0.04 145)" }}
        >
          {dateStr}
        </p>
      </div>

      {/* Leaf icon */}
      <Leaf
        className="flex-shrink-0 w-4 h-4"
        style={{ color: "oklch(0.58 0.15 142)" }}
      />
    </motion.div>
  );
}

export function PledgeWall() {
  const { data: certificates, isLoading } = useGetRecentCertificates();

  const pledgers =
    certificates && certificates.length > 0 ? certificates : SAMPLE_PLEDGERS;

  return (
    <section
      data-ocid="pledge_wall.section"
      className="py-20 px-4"
      style={{ background: "oklch(0.95 0.015 130)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-body font-semibold mb-4"
            style={{
              background: "oklch(0.85 0.08 142)",
              color: "oklch(0.28 0.1 148)",
            }}
          >
            <Users className="w-4 h-4" />
            Our Pledgers
          </div>
          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "oklch(0.18 0.05 145)" }}
          >
            A Growing Movement
          </h2>
          <p
            className="font-body text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: "oklch(0.45 0.06 145)" }}
          >
            Every name here represents a commitment to a cleaner, plastic-free
            world.
          </p>
        </motion.div>

        {/* Pledgers grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"] as const).map((sk) => (
              <div
                key={sk}
                className="h-[72px] rounded-xl animate-pulse"
                style={{ background: "oklch(0.90 0.02 138)" }}
              />
            ))}
          </div>
        ) : pledgers.length === 0 ? (
          <div
            data-ocid="pledge_wall.empty_state"
            className="text-center py-16 rounded-2xl"
            style={{
              background: "white",
              border: "2px dashed oklch(0.84 0.04 138)",
            }}
          >
            <div className="text-5xl mb-3">🌱</div>
            <h3
              className="font-display text-2xl font-bold mb-2"
              style={{ color: "oklch(0.35 0.07 148)" }}
            >
              Be the First Pledger
            </h3>
            <p
              className="font-body text-base"
              style={{ color: "oklch(0.55 0.05 145)" }}
            >
              Start the movement by taking the pledge above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pledgers.map((cert, i) => (
              <PledgerCard
                key={cert.id}
                name={cert.name}
                timestamp={cert.timestamp}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Call to action at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-10"
        >
          <p
            className="font-body text-sm"
            style={{ color: "oklch(0.55 0.04 145)" }}
          >
            Showing most recent pledgers · Names shown for privacy
          </p>
        </motion.div>
      </div>
    </section>
  );
}
