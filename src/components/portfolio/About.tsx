import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import { Users, GraduationCap, Briefcase, HeartHandshake } from "lucide-react";

const pillars = [
  { Icon: Users, title: "Leadership", text: "Building bridges between people, government and grassroots needs." },
  { Icon: GraduationCap, title: "Education", text: "Championing access to quality learning for every young mind." },
  { Icon: Briefcase, title: "Professional", text: "Bringing corporate discipline into public service delivery." },
  { Icon: HeartHandshake, title: "Community", text: "Standing with families through every season of life." },
];

export function About() {
  return (
    <Section id="about">
      <SectionHeader
        eyebrow="About Me"
        title={<>A new kind of leader for <span className="text-gradient-gold">a new generation</span></>}
        description="Rooted in Mymensingh. Driven by service. Built for the digital age."
      />

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6 text-lg leading-relaxed text-muted-foreground"
        >
          <p>
            I am <span className="text-foreground font-medium">Ibrahim Khalil</span>, currently serving as the
            <span className="text-gold"> President of Trishal 10 No. Mathbari Union</span>. My journey blends
            disciplined academics, professional experience, and a lifelong commitment to community service —
            a combination I believe modern public leadership demands.
          </p>
          <p>
            Over the years I have led youth-empowerment initiatives, rural development projects, educational
            outreach, and social welfare campaigns — partnering with students, farmers, women entrepreneurs
            and elders to design programs that actually move the needle for families across the union.
          </p>
          <p>
            My vision is simple: build a transparent, technology-enabled, opportunity-rich local government
            that the next generation can be proud of — and that the older generation can finally trust.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-5 group"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl glass-gold mb-4 group-hover:glow-gold transition-all">
                <p.Icon className="h-5 w-5 text-gold" />
              </div>
              <div className="font-display text-lg font-semibold">{p.title}</div>
              <p className="text-sm text-muted-foreground mt-1.5">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
