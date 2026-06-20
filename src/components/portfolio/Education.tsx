import { motion, useReducedMotion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import { GraduationCap } from "lucide-react";
import { Timeline, TimelineItem } from "../ui/Timeline";
import { useIsMobile } from "../../hooks/useIsMobile";
import { EducationInteraction } from "../EducationInteraction";
import { useTranslation } from "../../lib/i18n";

export function Education() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { t, tObject } = useTranslation();

  const items = [
    tObject<{ year: string; title: string; org: string; desc: string }>("education.item1"),
    tObject<{ year: string; title: string; org: string; desc: string }>("education.item2"),
    tObject<{ year: string; title: string; org: string; desc: string }>("education.item3"),
    tObject<{ year: string; title: string; org: string; desc: string }>("education.item4"),
  ];

  return (
    <Section id="education">
      <SectionHeader
        eyebrow={t("education.eyebrow")}
        title={
          <motion.span
            whileHover={isMobile ? undefined : { scale: 1.03 }}
            className="inline-block transition-all duration-300 hover:[text-shadow:0_0_40px_oklch(0.78_0.14_85_/_0.4)]"
          >
            <span className="text-gradient-live text-5xl sm:text-6xl">{t("education.title1")}</span>{" "}
            <span className="text-gradient-gold text-5xl sm:text-6xl">{t("education.title2")}</span>
          </motion.span>
        }
      />

      <div className="relative">
        <div className="flex justify-center mb-10">
          <EducationInteraction />
        </div>

        <Timeline>
          {items.map((item, i) => (
            <TimelineItem
              key={item.title}
              icon={<GraduationCap className="h-3.5 w-3.5" />}
              date={item.year}
              title={item.title}
              org={item.org}
              description={item.desc}
              index={i}
              side={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </Timeline>
      </div>
    </Section>
  );
}
