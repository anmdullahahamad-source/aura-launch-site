import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import { Sparkles, Building2, Sprout, GraduationCap, HandHeart, Eye } from "lucide-react";

const initiatives = [
  { Icon: Building2, title: "Digital Union Office", text: "Modernising public service delivery with online certificates, requests and grievance tracking." },
  { Icon: Sprout, title: "Green Mathbari", text: "Tree-planting, clean water and renewable-energy projects across every ward of the union." },
  { Icon: GraduationCap, title: "Scholar Bridge", text: "Merit and need-based scholarships for college students from underprivileged families." },
  { Icon: HandHeart, title: "Family Welfare", text: "Maternal-health camps, elderly care drives and rapid-response winter relief." },
  { Icon: Sparkles, title: "Youth Leadership Lab", text: "Mentorship, public-speaking and entrepreneurship training for the next generation." },
  { Icon: Eye, title: "Transparency First", text: "Quarterly public budget hearings and an open dashboard for every ongoing project." },
];

export function Leadership() {
  return (
    <Section id="leadership" className="overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-emerald-glow/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <SectionHeader
        eyebrow="Leadership & Politics"
        title={<>Public service, <span className="text-gradient-gold">reimagined</span></>}
        description="As President of Trishal 10 No. Mathbari Union, my work is anchored in six commitments."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {initiatives.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.07 }}
            whileHover={{ y: -6 }}
            className="group relative rounded-3xl glass p-6 overflow-hidden"
          >
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="grid h-12 w-12 place-items-center rounded-2xl glass-gold mb-5 group-hover:glow-gold transition-all">
              <it.Icon className="h-5 w-5 text-gold" />
            </div>
            <h3 className="font-display text-xl font-semibold">{it.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{it.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-14 relative rounded-3xl glass-gold p-8 sm:p-12 text-center max-w-3xl mx-auto"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/10 to-transparent" />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Future Vision</div>
          <p className="font-display text-2xl sm:text-3xl leading-snug">
            "A Mathbari where every child learns, every family thrives, and every voice is heard — built openly,
            powered by people, and ready for the world we are becoming."
          </p>
        </div>
      </motion.div>
    </Section>
  );
}
