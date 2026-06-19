import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import { ExternalLink, ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Digital Union Services Portal",
    tag: "Governance · Tech",
    desc: "An online system for birth certificates, citizenship verifications and complaint tracking — reducing average wait from 9 days to under 36 hours.",
    bg: "from-emerald-glow/30 to-emerald-deep/40",
  },
  {
    title: "Scholar Bridge Program",
    tag: "Education",
    desc: "Merit and need-based scholarships funding 240 students across schools and colleges, with mentor pairing and career counselling.",
    bg: "from-gold/30 to-emerald-glow/20",
  },
  {
    title: "Green Mathbari Campaign",
    tag: "Environment",
    desc: "Planted 18,000+ trees, installed 65 solar street lights and built 12 community water-purification stations.",
    bg: "from-emerald-deep/40 to-gold/20",
  },
  {
    title: "Youth Leadership Summit",
    tag: "Community",
    desc: "An annual two-day summit bringing together 600+ young leaders, government, NGOs and industry mentors.",
    bg: "from-gold/25 to-emerald-glow/30",
  },
];

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        eyebrow="Projects"
        title={<>Initiatives <span className="text-gradient-gold">making a difference</span></>}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative rounded-3xl overflow-hidden glass"
          >
            <div className={`aspect-[16/9] bg-gradient-to-br ${p.bg} relative`}>
              <div className="absolute inset-0 grid-bg opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="font-display text-5xl text-gradient-gold opacity-30">{String(i + 1).padStart(2, "0")}</div>
              </div>
              <div className="absolute top-4 left-4 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">{p.tag}</div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl font-semibold group-hover:text-gradient-gold transition-all">{p.title}</h3>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-gold group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>

              <div className="mt-5 flex gap-2">
                <a href="#" className="inline-flex items-center gap-1.5 rounded-full glass-gold px-4 py-2 text-xs text-gold hover:glow-gold transition-all">
                  <ExternalLink className="h-3.5 w-3.5" /> Live Project
                </a>
                <a href="#" className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-white/5 transition-colors">
                  Learn more
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
