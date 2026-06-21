import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Stats } from "@/components/portfolio/Stats";
import { Leadership } from "@/components/portfolio/Leadership";
import { Education } from "@/components/portfolio/Education";
import { Experience } from "@/components/portfolio/Experience";
import { Skills } from "@/components/portfolio/Skills";
import { Achievements } from "@/components/portfolio/Achievements";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";

const Projects = lazy(() => import("@/components/portfolio/Projects"));
const Gallery = lazy(() => import("@/components/portfolio/Gallery"));
const Testimonials = lazy(() => import("@/components/portfolio/Testimonials"));

const DESC =
  "Ibrahim Khalil — Student, Marketing Officer & Youth Leader from Trishal, Mymensingh. Currently pursuing Honours in Philosophy and Fazil in Bengali, serving as President of Bangladesh Jamaat-e-Islami Youth Wing.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ibrahim Khalil — Student, Marketing Officer & Youth Leader" },
      { name: "description", content: DESC },
      {
        property: "og:title",
        content: "Ibrahim Khalil — Student, Marketing Officer & Youth Leader",
      },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Ibrahim Khalil",
          jobTitle: "President, Bangladesh Jamaat-e-Islami, 10 No. Mathbari Union Youth Wing",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Trishal",
            addressRegion: "Mymensingh",
            addressCountry: "Bangladesh",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main id="main-content" className="relative min-h-dvh overflow-x-clip">
      <ScrollProgress />
      <Nav />
      <Hero />
      <About />
      <Stats />
      <Leadership />
      <Education />
      <Experience />
      <Skills />
      <Achievements />
      <Suspense fallback={null}><Projects /></Suspense>
      <Suspense fallback={null}><Gallery /></Suspense>
      <Suspense fallback={null}><Testimonials /></Suspense>
      <Contact />
      <Footer />
    </main>
  );
}
