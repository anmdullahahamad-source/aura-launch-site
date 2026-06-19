import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";

const skills = [
  { name: "Leadership", value: 96 },
  { name: "Public Speaking", value: 93 },
  { name: "Community Development", value: 95 },
  { name: "Team Management", value: 90 },
  { name: "Event Management", value: 88 },
  { name: "Communication", value: 94 },
  { name: "Project Management", value: 89 },
  { name: "Research & Policy", value: 85 },
  { name: "Digital Skills", value: 87 },
  { name: "Microsoft Office", value: 92 },
];

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        eyebrow="Skills"
        title={<>Capabilities sharpened by <span className="text-gradient-gold">a decade of practice</span></>}
      />

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 max-w-5xl mx-auto">
        {skills.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-medium">{s.name}</span>
              <span className="text-xs text-gold font-display">{s.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.2 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-glow via-gold to-emerald-glow"
                style={{ backgroundSize: "200% 100%" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
