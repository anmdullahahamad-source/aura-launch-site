import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Stats } from "@/components/portfolio/Stats";
import { Leadership } from "@/components/portfolio/Leadership";
import { Education } from "@/components/portfolio/Education";
import { Experience } from "@/components/portfolio/Experience";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Achievements } from "@/components/portfolio/Achievements";
import { Gallery } from "@/components/portfolio/Gallery";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";

const DESC = "Ibrahim Khalil — President, Trishal 10 No. Mathbari Union. Student, professional, community leader and public representative serving Mymensingh, Bangladesh.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ibrahim Khalil — President, Mathbari Union | Leader & Public Representative" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Ibrahim Khalil — President, Mathbari Union" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Ibrahim Khalil",
        jobTitle: "President, Trishal 10 No. Mathbari Union",
        address: { "@type": "PostalAddress", addressLocality: "Trishal", addressRegion: "Mymensingh", addressCountry: "Bangladesh" },
      }),
    }],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <ScrollProgress />
      <Nav />
      <Hero />
      <About />
      <Stats />
      <Leadership />
      <Education />
      <Experience />
      <Skills />
      <Projects />
      <Achievements />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
