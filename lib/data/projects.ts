import type { Project } from "./types";

const PROJECTS: readonly Project[] = [
  {
    slug: "premium-website",
    title: "Premium|spletna stran",
    category: "Spletna stran",
    image: "/works/premium-website.jpg",
    number: "01",
    color: "#3b82f6",
    backColor: "#1d4ed8",
    accentColor: "#2563eb",
    oneLiner: "Spletna stran, ki prodaja — tudi ko spite.",
    description: "Potencialna stranka vas oceni v sekundi. Zgradimo stran, ki v tej sekundi zgradi zaupanje — in spremeni obiskovalce v stranke.",
    bullets: [
      "Lighthouse score 100 — bliskovito hitra",
      "SEO-first pristop za organsko rast",
      "Responsive design za vse naprave",
    ],
    closingText: "Zgradimo vam stran, ki prodaja — tiho, zanesljivo, tudi ko spite.",
  },
  {
    slug: "ecommerce",
    title: "Spletna|trgovina",
    category: "Spletna trgovina",
    image: "/works/ecommerce.jpg",
    number: "02",
    color: "#22d3ee",
    backColor: "#0e7490",
    accentColor: "#06b6d4",
    oneLiner: "Vaša trgovina, odprta 24/7.",
    description: "Medtem ko spite, vaša spletna trgovina prodaja. Zgradimo sistem, ki vodi stranko od prvega klika do plačila — brez trenja, brez izgubljenih prodaj.",
    bullets: [
      "Stripe, PayPal — varno in hitro",
      "Avtomatska sinhronizacija zalog",
      "Checkout optimiziran za konverzijo",
    ],
    closingText: "Vaši izdelki si zaslužijo platformo, ki jih zna prodati. Mi jo zgradimo.",
  },
  {
    slug: "ai-integracija",
    title: "AI|Avtomatizacija",
    category: "AI Avtomatizacija",
    image: "/works/ai_integration.jpg",
    number: "03",
    color: "#a855f7",
    backColor: "#7e22ce",
    accentColor: "#9333ea",
    oneLiner: "Procesi, ki so vas upočasnjevali, zdaj delajo sami.",
    description: "Vsako podjetje ima opravila, ki požirajo čas. Razvijemo programe po meri — od avtomatizacije procesov do integracije AI v vašo obstoječo infrastrukturo. Vi rastete, sistem dela.",
    bullets: [
      "Prilagojeni programi za vaše specifične potrebe",
      "AI integracija v obstoječo trgovino ali sistem",
      "Ure ročnega dela postanejo minute",
    ],
    closingText: "Ustvarimo vam rešitve, ki avtomatizirajo zamudne procese — da se vi posvetite rasti.",
  },
  {
    slug: "3d-tiskanje",
    title: "3D|Tiskanje",
    category: "3D Tiskanje",
    image: "/works/3d_printing.jpg",
    number: "04",
    color: "#94a3b8",
    backColor: "#475569",
    accentColor: "#64748b",
    oneLiner: "Od ideje do izdelka v 48 urah.",
    description: "Ideja v glavi je ena stvar. Izdelek v rokah je druga. Preizkusite koncept, preden investirate v drago proizvodnjo — popravljajte, dokler ni popolno.",
    bullets: [
      "FDM & SLA tehnologija",
      "Industrijski materiali (PLA, PETG, Resin)",
      "Iterativno prototipiranje",
    ],
    closingText: "Vašo idejo spremenimo v izdelek, ki ga lahko preizkusite — hitro, natančno, brez tveganja.",
  },
];

/**
 * Get all projects data
 * Async wrapper for future CMS/database integration
 */
export async function getProjects(): Promise<readonly Project[]> {
  return PROJECTS;
}
