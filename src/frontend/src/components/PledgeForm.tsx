import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, HandshakeIcon, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Certificate } from "../backend.d";
import { useTakePledge } from "../hooks/useQueries";

const PLEDGE_TEXT =
  "I pledge to eliminate single-use plastics from my daily life — refusing plastic bags, bottles, straws, cutlery, and packaging — and to inspire others to do the same.";

interface PledgeFormProps {
  onSuccess: (certificate: Certificate) => void;
}

export function PledgeForm({ onSuccess }: PledgeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const { isActorReady, ...mutation } = useTakePledge();

  const validate = () => {
    const errors: { name?: string; email?: string } = {};
    if (!name.trim()) errors.name = "Please enter your full name.";
    if (!email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    mutation.mutate(
      { name: name.trim(), email: email.trim() },
      {
        onSuccess: (certificate) => {
          onSuccess(certificate);
        },
        onError: (err) => {
          // Reset mutation to show error state cleanly
          console.error("Pledge submission error:", err);
        },
      },
    );
  };

  const isDuplicate =
    mutation.isError &&
    mutation.error?.message?.toLowerCase().includes("already");

  return (
    <section
      id="pledge-form"
      className="py-20 px-4 relative"
      style={{ background: "oklch(0.97 0.01 130)" }}
    >
      {/* Background leaf pattern */}
      <div className="absolute inset-0 leaf-pattern pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-body font-semibold mb-4"
              style={{
                background: "oklch(0.88 0.06 142)",
                color: "oklch(0.28 0.1 148)",
              }}
            >
              <HandshakeIcon className="w-4 h-4" />
              Make Your Pledge
            </div>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "oklch(0.18 0.05 145)" }}
            >
              I'm Ready to Commit
            </h2>
            <p
              className="text-lg font-body max-w-md mx-auto leading-relaxed"
              style={{ color: "oklch(0.45 0.06 145)" }}
            >
              Join thousands of people choosing a plastic-free future. Your
              commitment matters.
            </p>
          </div>

          {/* Form card */}
          <div
            className="rounded-2xl p-8 shadow-eco-lg relative overflow-hidden"
            style={{ background: "white" }}
          >
            {/* Subtle top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.32 0.09 152), oklch(0.58 0.18 142), oklch(0.32 0.09 152))",
              }}
            />

            <form onSubmit={handleSubmit} noValidate>
              {/* Name field */}
              <div className="mb-6">
                <Label
                  htmlFor="pledge-name"
                  className="font-body font-semibold text-sm mb-2 block"
                  style={{ color: "oklch(0.28 0.06 148)" }}
                >
                  Full Name *
                </Label>
                <Input
                  id="pledge-name"
                  data-ocid="pledge.name_input"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name)
                      setFieldErrors((p) => ({ ...p, name: undefined }));
                  }}
                  autoComplete="name"
                  className="h-12 font-body text-base"
                  style={{
                    borderColor: fieldErrors.name
                      ? "oklch(0.577 0.245 27.325)"
                      : undefined,
                  }}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name && (
                  <p
                    id="name-error"
                    data-ocid="pledge.error_state"
                    className="flex items-center gap-1.5 mt-1.5 text-sm font-body"
                    style={{ color: "oklch(0.5 0.2 27)" }}
                    role="alert"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="mb-6">
                <Label
                  htmlFor="pledge-email"
                  className="font-body font-semibold text-sm mb-2 block"
                  style={{ color: "oklch(0.28 0.06 148)" }}
                >
                  Email Address *
                </Label>
                <Input
                  id="pledge-email"
                  data-ocid="pledge.email_input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email)
                      setFieldErrors((p) => ({ ...p, email: undefined }));
                    if (mutation.isError) mutation.reset();
                  }}
                  autoComplete="email"
                  className="h-12 font-body text-base"
                  style={{
                    borderColor:
                      fieldErrors.email || isDuplicate
                        ? "oklch(0.577 0.245 27.325)"
                        : undefined,
                  }}
                  aria-invalid={!!fieldErrors.email || isDuplicate}
                  aria-describedby={
                    fieldErrors.email
                      ? "email-error"
                      : isDuplicate
                        ? "duplicate-error"
                        : undefined
                  }
                />
                {fieldErrors.email && (
                  <p
                    id="email-error"
                    data-ocid="pledge.error_state"
                    className="flex items-center gap-1.5 mt-1.5 text-sm font-body"
                    style={{ color: "oklch(0.5 0.2 27)" }}
                    role="alert"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Pledge text — read-only */}
              <div className="mb-6">
                <Label
                  className="font-body font-semibold text-sm mb-2 block"
                  style={{ color: "oklch(0.28 0.06 148)" }}
                >
                  Your Pledge
                </Label>
                <div
                  className="rounded-xl p-5 font-serif italic text-base leading-relaxed relative"
                  style={{
                    background: "oklch(0.94 0.04 138)",
                    color: "oklch(0.28 0.07 148)",
                    borderLeft: "4px solid oklch(0.45 0.12 138)",
                  }}
                >
                  <span
                    style={{
                      color: "oklch(0.45 0.12 138)",
                      fontSize: "24px",
                      lineHeight: "1",
                      marginRight: "4px",
                    }}
                  >
                    "
                  </span>
                  {PLEDGE_TEXT}
                  <span
                    style={{
                      color: "oklch(0.45 0.12 138)",
                      fontSize: "24px",
                      lineHeight: "1",
                      marginLeft: "2px",
                    }}
                  >
                    "
                  </span>
                </div>
              </div>

              {/* API error */}
              {mutation.isError && (
                <div
                  data-ocid="pledge.error_state"
                  className="mb-4 p-4 rounded-xl flex items-start gap-3"
                  style={{
                    background: "oklch(0.95 0.04 27)",
                    border: "1px solid oklch(0.85 0.1 27)",
                  }}
                  role="alert"
                >
                  <AlertCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "oklch(0.5 0.2 27)" }}
                  />
                  <div>
                    <p
                      className="font-body font-semibold text-sm"
                      style={{ color: "oklch(0.35 0.15 27)" }}
                    >
                      {isDuplicate
                        ? "You've already taken the pledge!"
                        : "Something went wrong. Please try again."}
                    </p>
                    {isDuplicate && (
                      <p
                        className="font-body text-sm mt-0.5"
                        style={{ color: "oklch(0.45 0.12 27)" }}
                      >
                        This email has already been registered. Your pledge is
                        already counted. 🌱
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                data-ocid="pledge.submit_button"
                disabled={mutation.isPending || !isActorReady}
                className="w-full h-14 text-lg font-body font-bold rounded-xl shadow-eco transition-all duration-300 hover:shadow-eco-lg hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background:
                    mutation.isPending || !isActorReady
                      ? "oklch(0.48 0.07 152)"
                      : "oklch(0.32 0.09 152)",
                  color: "oklch(0.97 0.005 120)",
                  border: "none",
                }}
              >
                {!isActorReady ? (
                  <span
                    data-ocid="pledge.loading_state"
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting…
                  </span>
                ) : mutation.isPending ? (
                  <span
                    data-ocid="pledge.loading_state"
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Your Pledge…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <HandshakeIcon className="h-5 w-5" />
                    Take the Pledge
                  </span>
                )}
              </Button>

              <p
                className="text-center text-xs font-body mt-3"
                style={{ color: "oklch(0.6 0.04 145)" }}
              >
                Your information is secure and will only be used to generate
                your certificate.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
