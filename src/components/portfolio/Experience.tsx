import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import { Briefcase, ArrowUpRight } from "lucide-react";

const jobs = [
  {
    role: "President",
    org: "Trishal 10 No. Mathbari Union",
    period: "2023 — Present",
    points: [
      "Lead policy, planning and service delivery for over 30,000 residents.",
      "Launched a digital citizen-services portal reducing wait times by 60%.",
      "Secured partnerships with NGOs for safe water, education and health.",
    ],
  },
  {
    role: "Program Coordinator",
    org: "Youth Empowerment Initiative · Mymensingh",
    period: "2021 — 2023",
    points: [
      "Designed scholarship and skills-training programs for 2,000+ students.",
      "Built a mentor network connecting students with industry professionals.",
      "Organised the annual Mymensingh Youth Leadership Summit.",
    ],
  },
  {
    role: "Community Organiser",
    org: "Rural Development Forum",
    period: "2019 — 2021",
    points: [
      "Mobilised local volunteers for disaster relief and rebuilding.",
      "Coordinated free legal-aid clinics and women's literacy programs.",
    ],
  },
];

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="Experience"
        title={<>A career built on <span className="text-gradient-gold">service & impact</span></>}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {jobs.map((j, i) => (
          <motion.article
            key={j.org}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
            className="group relative glass rounded-3xl p-7 overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gold/10 blur-2xl group-hover:bg-gold/25 transition-colors" />

            <div className="flex items-start justify-between gap-4 relative">
              <div className="grid h-12 w-12 place-items-center rounded-2xl glass-gold">
                <Briefcase className="h-5 w-5 text-gold" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-gold group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="mt-6 text-xs uppercase tracking-widest text-gold">{j.period}</div>
            <h3 className="font-display text-2xl font-semibold mt-1">{j.role}</h3>
            <div className="text-sm text-muted-foreground mt-1">{j.org}</div>

            <ul className="mt-5 space-y-2.5">
              {j.points.map((p) => (
                <li key={p} className="text-sm text-muted-foreground/90 flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-gold shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
