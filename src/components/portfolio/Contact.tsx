import { motion } from "framer-motion";
import { useState } from "react";
import { Section, SectionHeader } from "./Section";
import { Mail, Phone, MapPin, Facebook, Linkedin, MessageCircle, Send } from "lucide-react";

const contacts = [
  { Icon: Mail, label: "Email", value: "ibrahim@example.com", href: "mailto:ibrahim@example.com" },
  { Icon: Phone, label: "Phone", value: "+880 1XXX-XXXXXX", href: "tel:+8801000000000" },
  { Icon: MessageCircle, label: "WhatsApp", value: "Chat with me", href: "https://wa.me/8801000000000" },
  { Icon: MapPin, label: "Office", value: "Mathbari Union, Trishal, Mymensingh", href: "#map" },
];

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Section id="contact">
      <SectionHeader
        eyebrow="Contact"
        title={<>Let's <span className="text-gradient-gold">build together</span></>}
        description="Whether it's a community concern, a partnership idea, or a media request — I'd love to hear from you."
      />

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <div className="space-y-4">
          {contacts.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-4 p-5 rounded-2xl glass hover:glass-gold transition-all group"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl glass-gold group-hover:glow-gold transition-all">
                <c.Icon className="h-5 w-5 text-gold" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.label}</div>
                <div className="text-sm font-medium truncate">{c.value}</div>
              </div>
            </motion.a>
          ))}

          <div className="flex gap-3 pt-2">
            {[Facebook, Linkedin, MessageCircle].map((Icon, idx) => (
              <a key={idx} href="#" aria-label="Social" className="grid h-12 w-12 place-items-center rounded-xl glass hover:glass-gold transition-all">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="glass rounded-3xl p-7 sm:p-9 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" id="name" />
            <Field label="Email" id="email" type="email" />
          </div>
          <Field label="Subject" id="subject" />
          <div>
            <label htmlFor="msg" className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea id="msg" rows={5} required className="mt-2 w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none transition-all" />
          </div>
          <button type="submit" className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium bg-gradient-to-br from-[oklch(0.85_0.14_88)] to-[oklch(0.65_0.16_75)] text-background hover:scale-[1.02] transition-all shadow-[var(--shadow-gold)]">
            {sent ? "Message sent ✓" : (<>Send Message <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>)}
          </button>
        </motion.form>
      </div>
    </Section>
  );
}

function Field({ label, id, type = "text" }: { label: string; id: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input id={id} type={type} required className="mt-2 w-full rounded-xl bg-input border border-border px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
    </div>
  );
}
