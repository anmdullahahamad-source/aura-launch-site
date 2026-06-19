import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";

const tiles = [
  { label: "Community Meeting", h: "h-72", g: "from-emerald-deep/50 to-emerald-glow/30" },
  { label: "Youth Summit 2024", h: "h-56", g: "from-gold/30 to-emerald-glow/20" },
  { label: "Education Drive", h: "h-64", g: "from-emerald-glow/30 to-gold/20" },
  { label: "Tree Plantation", h: "h-80", g: "from-emerald-deep/60 to-emerald-glow/20" },
  { label: "Public Address", h: "h-56", g: "from-gold/25 to-emerald-deep/40" },
  { label: "Health Camp", h: "h-72", g: "from-emerald-glow/25 to-gold/15" },
  { label: "Cultural Festival", h: "h-64", g: "from-gold/35 to-emerald-glow/25" },
  { label: "Relief Distribution", h: "h-60", g: "from-emerald-deep/40 to-gold/20" },
];

export function Gallery() {
  return (
    <Section id="gallery">
      <SectionHeader
        eyebrow="Gallery"
        title={<>Moments from <span className="text-gradient-gold">the field</span></>}
        description="Snapshots from community programs, public events and grassroots leadership."
      />

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
        {tiles.map((t, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            className={`relative break-inside-avoid rounded-2xl overflow-hidden glass group cursor-pointer`}
          >
            <div className={`${t.h} bg-gradient-to-br ${t.g} relative`}>
              <div className="absolute inset-0 grid-bg opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <figcaption className="absolute bottom-3 left-3 right-3 text-xs text-foreground/90 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                {t.label}
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
