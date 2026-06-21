import { useState } from "react";
import { Section, SectionHeader } from "./Section";
import { Trophy, Award, Star } from "lucide-react";
import { InteractiveCard } from "../InteractiveCard";
import { AchievementsInteraction } from "../AchievementsInteraction";
import { useTranslation } from "../../lib/i18n";

const icons = [Trophy, Award, Star];

export function Achievements() {
  const [revealKey, setRevealKey] = useState(0);
  const { t, tObject } = useTranslation();

  const items = [
    tObject<{ year: string; title: string; org: string }>("achievements.item1"),
    tObject<{ year: string; title: string; org: string }>("achievements.item2"),
    tObject<{ year: string; title: string; org: string }>("achievements.item3"),
  ];

  return (
    <Section id="achievements">
      <SectionHeader
        eyebrow={t("achievements.eyebrow")}
        title={
          <>
            {t("achievements.title")}
          </>
        }
      />

      <div className="flex justify-center mb-8">
        <AchievementsInteraction onActivate={() => setRevealKey((p) => p + 1)} />
      </div>

      <div key={revealKey} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => {
          const Icon = i < icons.length ? icons[i] : Trophy;
          return (
            <InteractiveCard
              key={it.title}
              tiltFactor={5}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 p-5 rounded-2xl glass"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl glass-gold">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-gold">{it.year}</div>
                <div className="font-display text-base font-semibold mt-0.5">{it.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{it.org}</div>
              </div>
            </InteractiveCard>
          );
        })}
      </div>
    </Section>
  );
}
