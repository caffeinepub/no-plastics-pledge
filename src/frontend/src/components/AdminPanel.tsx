import type { Pledge } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { ArrowLeft, Lock, LogOut, ShieldCheck, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { actor, isFetching } = useActor();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pledges, setPledges] = useState<Pledge[] | null>(null);

  const isUnlocked = pledges !== null;
  const isActorReady = !!actor && !isFetching;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !actor) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await actor.getAdminPledges(password);
      // Sort by certificate ID (numeric) ascending
      const sorted = [...result].sort((a, b) => {
        const numA = Number.parseInt(a.certificateId, 10);
        const numB = Number.parseInt(b.certificateId, 10);
        if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
        return a.certificateId.localeCompare(b.certificateId);
      });
      setPledges(sorted);
    } catch {
      setError("Incorrect password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setPledges(null);
    setPassword("");
    setError(null);
  };

  const formatTimestamp = (ts: bigint) => {
    return new Date(Number(ts / 1_000_000n)).toLocaleString();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.1 0.04 148)" }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md"
        style={{
          background: "oklch(0.1 0.04 148 / 0.9)",
          borderBottom: "1px solid oklch(0.45 0.1 142 / 0.25)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            type="button"
            data-ocid="admin.close_button"
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-body font-medium transition-all hover:opacity-90"
            style={{ color: "oklch(0.6 0.04 145)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to site</span>
          </button>

          <div
            className="h-5 w-px"
            style={{ background: "oklch(0.45 0.1 142 / 0.25)" }}
          />

          <div className="flex items-center gap-2">
            <ShieldCheck
              className="w-4 h-4"
              style={{ color: "oklch(0.55 0.18 142)" }}
            />
            <span
              className="font-body text-sm font-semibold"
              style={{ color: "oklch(0.92 0.06 138)" }}
            >
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* ── LOCKED STATE ── */
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex items-center justify-center px-4 py-16"
            >
              <div
                className="w-full max-w-sm rounded-2xl p-8"
                style={{
                  background: "oklch(0.16 0.05 148)",
                  border: "1px solid oklch(0.45 0.1 142 / 0.25)",
                  boxShadow: "0 8px 40px oklch(0.08 0.04 148 / 0.6)",
                }}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.22 0.07 145 / 0.8)" }}
                  >
                    <Lock
                      className="w-6 h-6"
                      style={{ color: "oklch(0.55 0.18 142)" }}
                    />
                  </div>
                </div>

                {/* Heading */}
                <h1
                  className="font-display text-2xl font-bold text-center mb-1"
                  style={{ color: "oklch(0.92 0.06 138)" }}
                >
                  Admin Panel
                </h1>
                <p
                  className="font-body text-sm text-center mb-7"
                  style={{ color: "oklch(0.6 0.04 145)" }}
                >
                  Enter your password to view pledger records
                </p>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Input
                      data-ocid="admin.input"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      disabled={isLoading || !isActorReady}
                      className="w-full font-body"
                      style={{
                        background: "oklch(0.12 0.04 148)",
                        border: "1px solid oklch(0.45 0.1 142 / 0.35)",
                        color: "oklch(0.92 0.06 138)",
                      }}
                    />
                  </div>

                  {/* Actor not ready notice */}
                  {!isActorReady && !isLoading && (
                    <p
                      data-ocid="admin.loading_state"
                      className="font-body text-xs text-center"
                      style={{ color: "oklch(0.6 0.04 145)" }}
                    >
                      Connecting to network…
                    </p>
                  )}

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        data-ocid="admin.error_state"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="font-body text-sm px-3 py-2 rounded-lg"
                        style={{
                          color: "oklch(0.72 0.18 25)",
                          background: "oklch(0.18 0.06 25 / 0.4)",
                          border: "1px solid oklch(0.45 0.15 25 / 0.3)",
                        }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <Button
                    data-ocid="admin.submit_button"
                    type="submit"
                    disabled={isLoading || !password.trim() || !isActorReady}
                    className="w-full font-body font-semibold transition-all"
                    style={{
                      background: "oklch(0.48 0.15 142)",
                      color: "oklch(0.97 0.01 120)",
                      border: "none",
                    }}
                  >
                    {isLoading ? (
                      <span
                        data-ocid="admin.loading_state"
                        className="flex items-center gap-2"
                      >
                        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Verifying…
                      </span>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* ── UNLOCKED STATE ── */
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="flex-1 px-4 sm:px-6 py-8"
            >
              <div className="max-w-6xl mx-auto">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <h2
                      className="font-display text-2xl sm:text-3xl font-bold"
                      style={{ color: "oklch(0.92 0.06 138)" }}
                    >
                      Pledger Records
                    </h2>
                    {/* Count badge */}
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-sm font-semibold"
                      style={{
                        background: "oklch(0.22 0.07 145 / 0.8)",
                        color: "oklch(0.78 0.18 138)",
                        border: "1px solid oklch(0.45 0.1 142 / 0.35)",
                      }}
                    >
                      <Users className="w-3.5 h-3.5" />
                      {pledges.length}{" "}
                      {pledges.length === 1 ? "pledger" : "pledgers"}
                    </span>
                  </div>

                  <Button
                    data-ocid="admin.logout_button"
                    type="button"
                    onClick={handleLogout}
                    variant="outline"
                    className="flex items-center gap-2 font-body text-sm"
                    style={{
                      borderColor: "oklch(0.45 0.1 142 / 0.35)",
                      color: "oklch(0.6 0.04 145)",
                      background: "transparent",
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>

                {/* Table / Empty state */}
                {pledges.length === 0 ? (
                  <div
                    data-ocid="admin.empty_state"
                    className="flex flex-col items-center justify-center py-20 rounded-2xl"
                    style={{
                      background: "oklch(0.16 0.05 148)",
                      border: "1px solid oklch(0.45 0.1 142 / 0.25)",
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                      style={{ background: "oklch(0.22 0.07 145 / 0.5)" }}
                    >
                      <Users
                        className="w-6 h-6"
                        style={{ color: "oklch(0.55 0.18 142)" }}
                      />
                    </div>
                    <p
                      className="font-display text-lg font-semibold mb-1"
                      style={{ color: "oklch(0.92 0.06 138)" }}
                    >
                      No pledges yet
                    </p>
                    <p
                      className="font-body text-sm"
                      style={{ color: "oklch(0.6 0.04 145)" }}
                    >
                      Records will appear here once people start pledging.
                    </p>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "oklch(0.16 0.05 148)",
                      border: "1px solid oklch(0.45 0.1 142 / 0.25)",
                    }}
                  >
                    {/* Scrollable wrapper for small screens */}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[560px]">
                        <thead>
                          <tr
                            style={{
                              background: "oklch(0.19 0.06 148)",
                              borderBottom:
                                "1px solid oklch(0.45 0.1 142 / 0.25)",
                            }}
                          >
                            {[
                              "Certificate #",
                              "Name",
                              "Email",
                              "Date & Time",
                            ].map((heading) => (
                              <th
                                key={heading}
                                className="font-body text-xs font-semibold uppercase tracking-wider px-5 py-3.5 text-left"
                                style={{ color: "oklch(0.6 0.04 145)" }}
                              >
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {pledges.map((pledge, index) => (
                            <tr
                              key={pledge.certificateId}
                              data-ocid={`admin.row.${index + 1}`}
                              className="transition-colors"
                              style={{
                                borderBottom:
                                  index < pledges.length - 1
                                    ? "1px solid oklch(0.45 0.1 142 / 0.12)"
                                    : "none",
                              }}
                              onMouseEnter={(e) => {
                                (
                                  e.currentTarget as HTMLElement
                                ).style.background =
                                  "oklch(0.19 0.06 148 / 0.6)";
                              }}
                              onMouseLeave={(e) => {
                                (
                                  e.currentTarget as HTMLElement
                                ).style.background = "transparent";
                              }}
                            >
                              {/* Certificate # */}
                              <td className="px-5 py-3.5">
                                <span
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-body text-sm font-bold"
                                  style={{
                                    background: "oklch(0.22 0.07 145 / 0.6)",
                                    color: "oklch(0.78 0.18 138)",
                                  }}
                                >
                                  {pledge.certificateId}
                                </span>
                              </td>

                              {/* Name */}
                              <td className="px-5 py-3.5">
                                <span
                                  className="font-body text-sm font-medium"
                                  style={{ color: "oklch(0.92 0.06 138)" }}
                                >
                                  {pledge.name}
                                </span>
                              </td>

                              {/* Email */}
                              <td className="px-5 py-3.5">
                                <span
                                  className="font-body text-sm"
                                  style={{ color: "oklch(0.72 0.05 142)" }}
                                >
                                  {pledge.email}
                                </span>
                              </td>

                              {/* Date & Time */}
                              <td className="px-5 py-3.5">
                                <span
                                  className="font-body text-sm"
                                  style={{ color: "oklch(0.6 0.04 145)" }}
                                >
                                  {formatTimestamp(pledge.timestamp)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
