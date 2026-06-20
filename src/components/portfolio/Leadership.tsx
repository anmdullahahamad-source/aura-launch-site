import { Section, SectionHeader } from "./Section";
import { SmoothReveal } from "../SmoothReveal";
import { Sparkles, Building2, MapPin, Clock, Quote } from "lucide-react";
import { InteractiveCard } from "../InteractiveCard";
import { Timeline, TimelineItem } from "../ui/Timeline";
import { LeadershipInteraction } from "../LeadershipInteraction";
import { useTranslation } from "../../lib/i18n";

const roleIcons = [Sparkles, Building2];

export function Leadership() {
  const { t, tObject } = useTranslation();
  const roles = tObject<{ title: string; org: string; unit: string; period: string; description: string }[]>("leadership.roles");

  return (
    <Section id="leadership" className="overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-emerald-glow/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <SectionHeader
        eyebrow={t("leadership.eyebrow")}
        title={
          <>
            {t("leadership.title1")} <span className="text-gradient-gold">{t("leadership.title2")}</span>
          </>
        }
        description={t("leadership.description")}
      />

      <div className="relative">
        <div className="flex justify-center mb-10">
          <LeadershipInteraction />
        </div>

        <Timeline className="max-w-3xl">
          {roles.map((r, i) => (
            <TimelineItem
              key={r.title}
              icon={<Clock className="h-3.5 w-3.5" />}
              date={r.period}
              title={r.title}
              org={r.org}
              description={r.unit}
              index={i}
              side="left"
            >
              <p className="text-sm text-muted-foreground/80 mt-2 leading-relaxed">
                {r.description}
              </p>
            </TimelineItem>
          ))}
        </Timeline>
      </div>

      <SmoothReveal
        direction="up"
        delay={0.25}
        className="mt-14 relative rounded-3xl glass-gold p-8 sm:p-12 text-center max-w-3xl mx-auto"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/10 to-transparent pointer-events-none" />
        <div className="relative">
          <Quote className="mx-auto h-8 w-8 text-gold/30 mb-4" />
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4">{t("leadership.futureVision")}</div>
          <p className="font-display text-xl sm:text-2xl leading-relaxed text-foreground/90">
            &ldquo;{t("leadership.quote")}&rdquo;
          </p>
        </div>
      </SmoothReveal>
    </Section>
  );
}
