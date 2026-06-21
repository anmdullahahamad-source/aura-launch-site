import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import img0 from "@/assets/img-0.jpg";
import img1 from "@/assets/img-1.jpg";
import img2 from "@/assets/img-2.png";
import img3 from "@/assets/img-3.jpg";
import img4 from "@/assets/img-4.jpg";
import img5 from "@/assets/img-5.jpg";
import img6 from "@/assets/img-6.jpg";
import img7 from "@/assets/img-7.jpg";
import img8 from "@/assets/img-8.jpg";
import { GalleryInteraction } from "../GalleryInteraction";
import { useTranslation } from "../../lib/i18n";

const imageSources = [img0, img1, img2, img3, img4, img5, img6, img7, img8];

export default function Gallery() {
  const prefersReduced = useReducedMotion();
  const [zoomKey, setZoomKey] = useState(0);
  const { t, tArray } = useTranslation();
  const captions = tArray("gallery.captions");

  return (
    <Section id="gallery">
      <SectionHeader
        eyebrow={t("gallery.eyebrow")}
        title={
          <>
            {t("gallery.title1")} <span className="text-gradient-gold">{t("gallery.title2")}</span>
          </>
        }
        description={t("gallery.description")}
      />

      <div className="flex justify-center mb-8">
        <GalleryInteraction onActivate={() => setZoomKey((p) => p + 1)} />
      </div>

      <div key={zoomKey} className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {captions.map((label, i) => (
          <motion.figure
            key={`${label}-${i}`}
            initial={prefersReduced ? {} : { opacity: 0, scale: zoomKey > 0 ? 1.08 : 0.95 }}
            whileInView={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden glass group cursor-pointer"
          >
            <div className="aspect-[4/3] relative">
              <img
                src={imageSources[i]}
                alt={label}
                width="400"
                height="300"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 grid-bg opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <figcaption className="absolute bottom-3 left-3 right-3 text-xs text-foreground/90 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                {label}
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
