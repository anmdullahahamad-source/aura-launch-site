import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Download, Mail, Phone, Facebook, Linkedin, ArrowRight, MapPin } from "lucide-react";
import portrait from "@/assets/hero-portrait.jpg";

const roles = [
  "Community Leader",
  "Public Representative",
  "Social Worker",
  "Youth Mentor",
  "Professional",
  "Student",
];

function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = roles[i];
    const speed = del ? 40 : 90;
    const t = setTimeout(() => {
      if (!del && text === current) {
        setTimeout(() => setDel(true), 1400);
        return;
      }
      if (del && text === "") {
        setDel(false);
        setI((i + 1) % roles.length);
        return;
      }
      setText(del ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i]);

  return (
    <span className="text-gradient-gold">
      {text}
      <span className="ml-1 inline-block w-0.5 h-[0.9em] -mb-1 bg-gold animate-pulse" />
    </span>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative min-h-dvh pt-32 pb-20 overflow-hidden">
      <div className="aurora" />
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-emerald-glow/20 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-gold/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass-gold text-xs uppercase tracking-[0.2em] text-gold mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              President · Trishal 10 No. Mathbari Union
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight"
            >
              Ibrahim
              <br />
              <span className="shimmer-text">Khalil</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl"
            >
              I am a <Typewriter /> dedicated to building a stronger, more inclusive future for the people of Mymensingh — one community, one voice, one initiative at a time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <MapPin className="h-4 w-4 text-gold" />
              Mymensingh, Bangladesh
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium bg-gradient-to-br from-[oklch(0.85_0.14_88)] to-[oklch(0.65_0.16_75)] text-background hover:scale-[1.03] transition-all shadow-[var(--shadow-gold)]"
              >
                Contact Me
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium glass hover:glass-gold transition-all"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex items-center gap-3"
            >
              {[
                { Icon: Mail, href: "mailto:ibrahim@example.com", label: "Email" },
                { Icon: Phone, href: "tel:+8801000000000", label: "Call" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-xl glass hover:glass-gold hover:-translate-y-1 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative mx-auto max-w-md">
              {/* Glow ring */}
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-gold/30 via-emerald-glow/20 to-transparent blur-2xl" />
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-gold/60 via-emerald-glow/40 to-gold/60 opacity-70" />

              <div className="relative rounded-[1.85rem] overflow-hidden glass">
                <img
                  src={portrait}
                  alt="Ibrahim Khalil — President, Trishal 10 No. Mathbari Union"
                  className="w-full h-auto aspect-[7/9] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-5 -left-3 sm:-left-6 rounded-2xl glass-gold px-4 py-3"
                >
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Serving since</div>
                  <div className="text-lg font-display font-semibold text-gradient-gold">2020</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-6 -right-3 sm:-right-6 rounded-2xl glass px-4 py-3"
                >
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Community Programs</div>
                  <div className="text-lg font-display font-semibold text-gradient-emerald">120+</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
