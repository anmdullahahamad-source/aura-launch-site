import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import { Trophy, Award, Medal, Star } from "lucide-react";

const items = [
  { Icon: Trophy, year: "2024", title: "Outstanding Young Leader Award", org: "Mymensingh Division Council" },
  { Icon: Award, year: "2023", title: "Community Service Recognition", org: "Bangladesh Youth Council" },
  { Icon: Medal, year: "2022", title: "Best Union Digital Transformation", org: "LGED National Awards" },
  { Icon: Star, year: "2021", title: "Excellence in Public Engagement", org: "Civil Society Forum" },
  { Icon: Award, year: "2020", title: "Volunteer of the Year", org: "Red Crescent Bangladesh" },
  { Icon: Trophy, year: "2019", title: "National Debate Champion", org: "Inter-University Tournament" },
];

export function Achievements() {
  return (
    <Section id="achievements">
      <SectionHeader
        eyebrow="Achievements"
        title={<>Honours <span className="text-gradient-gold">& recognition</span></>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="flex gap-4 p-5 rounded-2xl glass"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl glass-gold">
              <it.Icon className="h-5 w-5 text-gold" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-gold">{it.year}</div>
              <div className="font-display text-base font-semibold mt-0.5">{it.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{it.org}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
