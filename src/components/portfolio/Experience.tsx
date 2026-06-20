import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import { Briefcase, ArrowUpRight } from "lucide-react";
import { Timeline, TimelineItem } from "../ui/Timeline";
import { ExperienceInteraction } from "../ExperienceInteraction";
import { useTranslation } from "../../lib/i18n";

const jobs = [
  {
    role: "experience.role",
    org: "experience.org",
    period: "experience.period",
    points: ["experience.desc1", "experience.desc2", "experience.desc3"],
  },
];

export function Experience() {
  const { t } = useTranslation();
  return (
    <Section id="experience">
      <SectionHeader
        eyebrow={t("experience.eyebrow")}
        title={
          <>
            {t("experience.title1")} <span className="text-gradient-gold">{t("experience.title2")}</span>
          </>
        }
      />

      <div className="relative">
        <div className="flex justify-center mb-10">
          <ExperienceInteraction />
        </div>

        <Timeline className="max-w-3xl">
          {jobs.map((j, i) => (
            <TimelineItem
              key={j.period}
              icon={<Briefcase className="h-3.5 w-3.5" />}
              date={t(j.period)}
              title={t(j.role)}
              org={t(j.org)}
              index={i}
              side="left"
            >
              <ul className="mt-4 space-y-2.5">
                {j.points.map((p) => (
                  <li key={p} className="text-sm text-muted-foreground/90 flex gap-2.5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-gold shrink-0" />
                    <span>{t(p)}</span>
                  </li>
                ))}
              </ul>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </Section>
  );
}
