import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Section, SectionHeader } from "./Section";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { ContactInteraction } from "../ContactInteraction";
import { SmoothReveal } from "../SmoothReveal";
import { sendContactEmail, contactSchema, type ContactFormData } from "../../lib/actions/contact";
import { useTranslation } from "../../lib/i18n";

const contactKeys = [
  { Icon: Mail, labelKey: "contact.labels.email", valueKey: "contact.values.email", href: "mailto:kholilebrahim2005@gmail.com" },
  { Icon: Phone, labelKey: "contact.labels.offline", valueKey: "contact.values.offline", href: "tel:01872946117" },
  { Icon: MessageCircle, labelKey: "contact.labels.whatsapp", valueKey: "contact.values.whatsapp", href: "https://wa.me/8801846827978" },
  { Icon: MapPin, labelKey: "contact.labels.office", valueKey: "contact.values.office", href: "#map" },
  { Icon: Facebook, labelKey: "contact.labels.facebook", valueKey: "contact.values.facebook", href: "https://www.facebook.com/md.ibrahim.kholil.652607" },
];

const socialKeys = [
  { Icon: Facebook, labelKey: "contact.facebookAria", href: "https://www.facebook.com/md.ibrahim.kholil.652607" },
  { Icon: Linkedin, labelKey: "contact.linkedinAria", href: "https://www.linkedin.com/in/ibrahim-khalil-2005" },
  { Icon: MessageCircle, labelKey: "contact.whatsappAria", href: "https://wa.me/8801846827978" },
];

type SubmitState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success" }
  | { status: "error"; message: string };

export function Contact() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [focusTrigger, setFocusTrigger] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  useEffect(() => {
    if (focusTrigger === 0) return;
    const form = formRef.current;
    if (!form) return;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    const nameInput = form.querySelector<HTMLInputElement>("#name");
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 500);
    }
  }, [focusTrigger]);

  const handleFormFocus = useCallback(() => {
    setFocusTrigger((p) => p + 1);
  }, []);

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      setSubmitState({ status: "sending" });
      try {
        const result = await sendContactEmail({ data });
        if (result.success) {
          setSubmitState({ status: "success" });
          reset();
          successTimer.current = setTimeout(() => {
            setSubmitState({ status: "idle" });
          }, 8000);
        } else {
          setSubmitState({ status: "error", message: result.error });
        }
      } catch {
        setSubmitState({
          status: "error",
          message: t("contact.errorDefault"),
        });
      }
    },
    [reset, t],
  );

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setSubmitState({ status: "idle" });
  }, []);

  return (
    <Section id="contact">
      <SectionHeader
        eyebrow={t("contact.eyebrow")}
        title={
          <>
            {t("contact.title1")} <span className="text-gradient-gold">{t("contact.title2")}</span>
          </>
        }
        description={t("contact.description")}
      />

      <div className="flex justify-center mb-8">
        <ContactInteraction onActivate={handleFormFocus} />
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-8 items-start">
        <div className="space-y-4">
          {contactKeys.map((c, i) => (
            <SmoothReveal direction="up" delay={i * 0.1} key={c.labelKey}>
              <motion.a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                whileHover={isMobile ? undefined : { scale: 1.03, y: -2 }}
                className="flex items-center gap-4 p-5 rounded-2xl glass hover:glass-gold transition-all duration-300 group"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl glass-gold group-hover:glow-gold transition-all duration-300">
                  <c.Icon className="h-5 w-5 text-gold" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t(c.labelKey)}
                  </div>
                  <div className="text-sm font-medium truncate">{t(c.valueKey)}</div>
                </div>
              </motion.a>
            </SmoothReveal>
          ))}

          <div className="flex gap-3 pt-2">
            {socialKeys.map((s, idx) => (
              <SmoothReveal direction="up" delay={0.4 + idx * 0.08} key={s.labelKey}>
                <motion.a
                  href={s.href}
                  target={s.href !== "#" ? "_blank" : undefined}
                  rel={s.href !== "#" ? "noopener noreferrer" : undefined}
                  aria-label={t(s.labelKey)}
                  whileHover={isMobile ? undefined : { scale: 1.1, y: -2 }}
                  className="grid h-12 w-12 place-items-center rounded-xl glass hover:glass-gold hover:glow-gold transition-all duration-300"
                >
                  <s.Icon className="h-4 w-4" />
                </motion.a>
              </SmoothReveal>
            ))}
          </div>
        </div>

        <SmoothReveal
          direction="up"
          className="glass rounded-3xl p-7 sm:p-9 space-y-5 relative overflow-hidden"
        >
          {submitState.status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10 mb-5">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {t("contact.successTitle")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {t("contact.successText")}
              </p>
            </motion.div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
              {focusTrigger > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 pointer-events-none rounded-3xl"
                  style={{
                    background:
                      "radial-gradient(600px circle at 50% 30%, oklch(0.78 0.14 85 / 0.06), transparent)",
                  }}
                />
              )}

              {submitState.status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 mb-5"
                >
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
                  <div className="text-sm text-red-300 flex-1">{submitState.message}</div>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="text-xs text-gold hover:text-gold/80 underline whitespace-nowrap"
                  >
                    {t("contact.dismiss")}
                  </button>
                </motion.div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t("contact.formName")} id="name" error={errors.name?.message}>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    disabled={submitState.status === "sending"}
                    {...register("name")}
                    className="mt-2 w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50"
                  />
                </Field>
                <Field label={t("contact.formEmail")} id="email" error={errors.email?.message}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled={submitState.status === "sending"}
                    {...register("email")}
                    className="mt-2 w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50"
                  />
                </Field>
              </div>

              <Field label={t("contact.formSubject")} id="subject" error={errors.subject?.message}>
                <input
                  id="subject"
                  type="text"
                  disabled={submitState.status === "sending"}
                  {...register("subject")}
                  className="mt-2 w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50"
                />
              </Field>

              <Field label={t("contact.formMessage")} id="msg" error={errors.message?.message}>
                <textarea
                  id="msg"
                  rows={5}
                  disabled={submitState.status === "sending"}
                  {...register("message")}
                  className="mt-2 w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none transition-all disabled:opacity-50"
                />
              </Field>

              <button
                type="submit"
                disabled={submitState.status === "sending"}
                className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium bg-gradient-to-br from-[oklch(0.85_0.14_88)] to-[oklch(0.65_0.16_75)] text-background hover:scale-[1.02] transition-all shadow-[var(--shadow-gold)] disabled:opacity-60 disabled:hover:scale-100 w-full sm:w-auto"
              >
                {submitState.status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    {t("contact.sendMessage")}
                    <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </SmoothReveal>
      </div>
    </Section>
  );
}

function Field({
  label,
  error,
  id,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 mt-1.5 flex items-center gap-1"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </motion.p>
      )}
    </div>
  );
}
