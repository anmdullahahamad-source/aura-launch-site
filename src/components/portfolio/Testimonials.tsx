import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Section, SectionHeader } from "./Section";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const quotes = [
  { text: "Ibrahim brought corporate clarity and grassroots empathy together — a rare combination in public service today.", name: "Dr. Faruque Ahmed", role: "Local Government Advisor" },
  { text: "Under his leadership our union finally feels heard. He answers every call and follows through on every promise.", name: "Rahima Khatun", role: "Community Member, Ward 4" },
  { text: "A leader who treats young people as partners, not props. He's the future of our local politics.", name: "Tanvir Hasan", role: "Youth Council Member" },
  { text: "His digital citizen-services launch was a model others are now studying across the division.", name: "Eng. Salim Rahman", role: "LGED Division Officer" },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, []);

  const q = quotes[i];
  return (
    <Section id="testimonials">
      <SectionHeader
        eyebrow="Testimonials"
        title={<>Words from <span className="text-gradient-gold">the people</span></>}
      />

      <div className="relative max-w-3xl mx-auto">
        <div className="glass rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <Quote className="absolute top-6 left-6 h-10 w-10 text-gold/20" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-display text-xl sm:text-2xl leading-snug">"{q.text}"</p>
              <div className="mt-6">
                <div className="font-semibold text-gold">{q.name}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">{q.role}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button aria-label="Previous" onClick={() => setI((p) => (p - 1 + quotes.length) % quotes.length)} className="grid h-10 w-10 place-items-center rounded-full glass hover:glass-gold transition-all">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {quotes.map((_, idx) => (
              <button key={idx} aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-gold" : "w-2 bg-muted"}`} />
            ))}
          </div>
          <button aria-label="Next" onClick={() => setI((p) => (p + 1) % quotes.length)} className="grid h-10 w-10 place-items-center rounded-full glass hover:glass-gold transition-all">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Section>
  );
}
