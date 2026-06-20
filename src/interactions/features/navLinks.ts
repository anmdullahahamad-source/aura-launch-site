import type { IFeature } from "../core/types";

export interface NavLink {
  label: string;
  sectionId: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Education", sectionId: "education" },
  { label: "Leadership", sectionId: "leadership" },
  { label: "Achievements", sectionId: "achievements" },
  { label: "Community Service", sectionId: "testimonials" },
  { label: "Contact", sectionId: "contact" },
];

export function scrollToSection(sectionId: string): void {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

const NAV_LINKS_FEATURE: IFeature = {
  id: "nav-links",
  name: "Navigation Links",
  version: "1.0.0",
  priority: 6,
};

export default NAV_LINKS_FEATURE;
