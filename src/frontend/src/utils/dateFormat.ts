/**
 * Format a bigint nanosecond timestamp to a nicely formatted date string.
 * e.g. "4th March 2026"
 */
export function formatPledgeDate(nanoseconds: bigint): string {
  const milliseconds = Number(nanoseconds / BigInt(1_000_000));
  const date = new Date(milliseconds);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const ordinal = getOrdinal(day);

  return `${day}${ordinal} ${month} ${year}`;
}

/**
 * Format a bigint nanosecond timestamp to short date "Mar 4, 2026"
 */
export function formatShortDate(nanoseconds: bigint): string {
  const milliseconds = Number(nanoseconds / BigInt(1_000_000));
  const date = new Date(milliseconds);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getOrdinal(n: number): string {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * Format a pledger's name for privacy: "Priya Sharma" -> "Priya S."
 */
export function formatPrivateName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() ?? "";
  return `${firstName} ${lastInitial}.`;
}
