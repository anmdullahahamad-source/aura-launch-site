import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import { GraduationCap } from "lucide-react";

const items = [
  { year: "2021 — Present", title: "Master of Public Administration", org: "University of Dhaka", desc: "Specialising in governance, policy and digital public service delivery." },
  { year: "2017 — 2021", title: "Bachelor of Social Science", org: "Mymensingh Government College", desc: "Graduated with distinction in political science and sociology." },
  { year: "2015 — 2017", title: "Higher Secondary Certificate", org: "Trishal Nazrul Academy", desc: "GPA 5.00 · Debate team captain · Student council member." },
  { year: "2013 — 2015", title: "Secondary School Certificate", org: "Mathbari High School", desc: "Top of class · Scout leader · Founder of community reading circle." },
];

export function Education() {
  return (
    <Section id="education">
      <SectionHeader
        eyebrow="Education"
        title={<>Foundations of <span className="text-gradient-gold">a lifelong learner</span></>}
      />

      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent -translate-x-1/2" />

        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`relative flex gap-4 sm:gap-8 mb-10 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
          >
            <div className="hidden sm:block flex-1" />
            <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 mt-6">
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-gold to-emerald-glow glow-gold" />
            </div>
            <div className="ml-12 sm:ml-0 flex-1 glass rounded-2xl p-6 hover:-translate-y-1 transition-all">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold mb-2">
                <GraduationCap className="h-3.5 w-3.5" />
                {item.year}
              </div>
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <div className="text-sm text-muted-foreground mt-1">{item.org}</div>
              <p className="text-sm text-muted-foreground/80 mt-3">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
