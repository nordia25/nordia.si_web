export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
  icon: "speed" | "design" | "code" | "security" | "analytics" | "mobile";
}

export interface ProjectMetric {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  duration: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categorySlug: string;
  year: string;
  color: string;
  image: string;
  heroImage: string;
  heroVideo?: string;
  client?: string;
  duration?: string;
  overview: string;
  challenge: string;
  solution: string;
  features: ProjectFeature[];
  technologies: string[];
  metrics: ProjectMetric[];
  gallery: ProjectImage[];
  process: ProcessStep[];
  benefits: ServiceBenefit[];
  pricing?: PricingTier[];
  faq: FAQ[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company?: string;
    image?: string;
  };
  caseStudyHighlights?: string[];
  nextProject?: string;
  prevProject?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "premium-website",
    title: "Premium Website",
    subtitle: "Digitalna izkušnja, ki spremeni vse",
    category: "Spletna stran",
    categorySlug: "spletna-stran",
    year: "2024",
    color: "#c4a77d",
    image: "/works/premium-website.jpg",
    heroImage: "/works/spletna_stran_hero.jpg",
    client: "Za tiste, ki vedo, kaj hočejo",
    duration: "6-10 tednov",
    overview:
      "Predstavljajte si, da vsak obiskovalec vaše strani postane stranka. Da vsak klik vodi k zaupanju. Da vsaka sekunda na strani krepi vašo zgodbo. To ni fantazija — to je rezultat, ko se oblikovanje sreča s strategijo.",
    challenge:
      "Poglejte svojo trenutno spletno stran. Nato poglejte stran svojega najmočnejšega konkurenta. Razlika, ki jo vidite? To je razlika, ki jo vidijo tudi vaše potencialne stranke — in na podlagi nje se odločajo.",
    solution:
      "Ne izdelujemo spletnih strani. Ustvarjamo digitalne izkušnje, ki ljudem ostanejo v spominu. Ko nekdo zapusti vašo stran, si bo zapomnil občutek. In ta občutek jih bo vrnil nazaj — kot stranko.",
    features: [
      {
        title: "Bliskovita hitrost",
        description:
          "3 sekunde čakanja = 53% obiskovalcev gre drugam. Vaša stran se bo naložila v manj kot sekundo. Vsaka milisekunda šteje — in mi štejemo vsako.",
        icon: "speed",
      },
      {
        title: "Animacije s pomenom",
        description:
          "Ne samo lepe — strateške. Vsaka animacija vodi pogled uporabnika točno tja, kamor želite. Obiskovalci ostanejo, ker jih izkušnja pritegne.",
        icon: "design",
      },
      {
        title: "SEO ki dejansko dela",
        description:
          "Tehnična perfekcija, ki jo Google obožuje. Vaši konkurenti plačujejo oglase — vi boste organsko na vrhu, ko vas stranke iščejo.",
        icon: "analytics",
      },
      {
        title: "Mobile-first realnost",
        description:
          "73% obiskovalcev pride s telefona. Če tam ne očarate — ste izgubili. Naše strani so perfektne na vsakem zaslonu, ki obstaja.",
        icon: "mobile",
      },
      {
        title: "Vi ste gospodarji",
        description:
          "CMS, ki je tako enostaven, da ga bo razumel vsak. Spremenite karkoli v sekundah — brez da bi nas poklicali. Vaša stran, vaš nadzor.",
        icon: "code",
      },
      {
        title: "Vedno na voljo",
        description:
          "99.9% uptime ni statistika — je obljuba. Vaša stran dela za vas 24/7, 365 dni na leto. Medtem ko spite, pridobivate stranke.",
        icon: "security",
      },
    ],
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "Sanity CMS",
      "Vercel Edge",
      "Three.js",
    ],
    metrics: [
      {
        value: 100,
        label: "Lighthouse Score",
        suffix: "/100",
      },
      {
        value: 0.8,
        label: "Čas nalaganja",
        suffix: "s",
      },
      {
        value: 99.9,
        label: "Uptime garancija",
        suffix: "%",
      },
      {
        value: 50,
        label: "Testiranih naprav",
        suffix: "+",
      },
    ],
    process: [
      {
        number: "01",
        title: "Globinski potop",
        description:
          "Pogovarjamo se. Poslušamo. Razumemo vaše podjetje bolje kot vaši zaposleni. Šele ko vemo, kdo ste — začnemo ustvarjati, kdo boste.",
        duration: "1 teden",
      },
      {
        number: "02",
        title: "Arhitektura izkušnje",
        description:
          "Vsak gumb, vsak naslov, vsak pixel ima svoje mesto. Načrtujemo pot uporabnika tako, da neizogibno vodi k akciji — brez da bi se počutil prisiljen.",
        duration: "1-2 tedna",
      },
      {
        number: "03",
        title: "Vizualna simfonija",
        description:
          "Barve, tipografija, prostor. Vsak element harmonizira z drugimi. Ko vidite prvi dizajn — boste vedeli. To je tisto.",
        duration: "2-3 tedni",
      },
      {
        number: "04",
        title: "Koda, ki diha",
        description:
          "Animacije, ki ne utripajo — dihajo. Interakcije, ki se ne zgodijo — se čutijo. Vsaka vrstica kode ima svoj namen.",
        duration: "2-3 tedni",
      },
      {
        number: "05",
        title: "Popolnost",
        description:
          "Testiramo na 50+ napravah. Optimiziramo do zadnje milisekunde. In ko vse deluje perfektno — takrat lansiramo.",
        duration: "1 teden",
      },
    ],
    benefits: [
      {
        title: "Postanete neizbežni",
        description:
          "Ko stranka primerja vas in konkurenco, ne bo primerjala cen — primerjala bo občutek. Vi boste izbrali občutek, ki prodaja.",
      },
      {
        title: "Stranke same pridejo",
        description:
          "Konec hladnih klicev. Konec lovljenja. Premium digitalna prisotnost privlači premium stranke — tiste, ki že vedo, da vas hočejo.",
      },
      {
        title: "Google vas najde prvi",
        description:
          "Medtem ko konkurenti plačujejo na tisoče za oglase, vi organsko dominirate iskanja. Vsak mesec več prometa — brez dodatnega evra.",
      },
      {
        title: "Investicija, ne strošek",
        description:
          "Template stran čez 2 leti zahteva zamenjavo. Premium stran čez 2 leti še vedno impresionira. Razlika? ROI ki raste z leti.",
      },
    ],
    pricing: [
      {
        name: "Essential",
        price: "od 3.500€",
        description: "Začetek transformacije — popoln za fokusirane podjetja",
        features: [
          "Do 5 strani vrhunske kvalitete",
          "Perfekten na vsakem zaslonu",
          "Animacije, ki očarajo",
          "Kontaktna forma ki konvertira",
          "SEO za organski promet",
          "30 dni podpore po lansiranju",
        ],
      },
      {
        name: "Professional",
        price: "od 7.000€",
        description: "Najpogostejša izbira — za tiste, ki vedo, da šteje vsak detail",
        features: [
          "Do 10 strani digitalne mojstrovine",
          "Premium animacije & interakcije",
          "CMS — vi upravljate vsebino",
          "Integracije z vašimi sistemi",
          "SEO strategija ki dominira",
          "90 dni premium podpore",
          "Analytics & tracking setup",
        ],
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "po dogovoru",
        description: "Za blagovne znamke, ki zahtevajo izjemno",
        features: [
          "Brez omejitev — vaša vizija",
          "Custom funkcionalnosti",
          "3D elementi & immersive efekti",
          "Več jezikov, več trgov",
          "Dedicated podpora 24/7",
          "Dolgoročno partnerstvo",
        ],
      },
    ],
    faq: [
      {
        question: "Zakaj ne bi uporabil cenejšega template?",
        answer:
          "Lahko. In potem boste izgledali kot vsi drugi. Template stranke vidijo v 3 sekundah — in gredo naprej. Naše stranke ostanejo povprečno 12 minut. V tem času postanete izbira, ne možnost.",
      },
      {
        question: "6-10 tednov se sliši dolgo. Ali gre hitreje?",
        answer:
          "Gre. Ampak mojstrovina zahteva čas. Vsak teden, ki ga vložimo, prinese leta vrednosti. Hitro in dobro — to lahko dobite. Hitro in odlično? To zahteva pravi čas.",
      },
      {
        question: "Kaj če ne bo delovalo za moje podjetje?",
        answer:
          "Zato najprej poslušamo. Ne začnemo kodirati, dokler ne razumemo vašega posla popolnoma. Vsak projekt je unikaten — in rezultat ni nikoli naključje, ampak izpolnitev skupne vizije.",
      },
      {
        question: "Ali bom lahko sam urejal vsebino?",
        answer:
          "Seveda. CMS je tako intuitiven, da ga bo vaša mama razumela. Spremenite tekst, dodajte slike, posodobite cene — vse v minutah, brez naše pomoči.",
      },
      {
        question: "Kaj točno dobim za to ceno?",
        answer:
          "Vse. Strategijo, dizajn, razvoj, animacije, SEO, testiranje in podporo po lansiranju. Ko oddamo projekt — deluje. Brez skritih stroškov, brez presenečenj.",
      },
    ],
    gallery: [
      {
        src: "/works/premium-website.jpg",
        alt: "Premium Website - Hero sekcija",
        caption: "Immersive hero sekcija z dinamičnimi elementi",
      },
      {
        src: "/works/premium-website.jpg",
        alt: "Premium Website - O nas",
        caption: "Storytelling sekcija z parallax efekti",
      },
      {
        src: "/works/premium-website.jpg",
        alt: "Premium Website - Storitve",
        caption: "Interaktivna predstavitev storitev",
      },
      {
        src: "/works/premium-website.jpg",
        alt: "Premium Website - Kontakt",
        caption: "Konverzijsko optimiziran kontaktni obrazec",
      },
    ],
    caseStudyHighlights: [
      "100/100 Lighthouse score — naš standard",
      "Pod 1 sekundo nalaganja — vedno",
      "Mobile-first pristop za vsak projekt",
      "SEO optimizacija vključena v vsako stran",
    ],
    testimonial: {
      quote:
        "Mislil sem, da vem, kaj hočem. Nordia mi je pokazala, kaj v resnici potrebujem. Spletna stran ni le spremenila našega online nastopa — spremenila je, kako nas stranke dojemajo. Zdaj smo izbira. Ne ena od možnosti.",
      author: "Marko Novak",
      role: "Direktor",
      company: "Boutique Studio",
    },
    nextProject: "ecommerce",
    prevProject: "3d-tiskanje",
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    subtitle: "Spletna trgovina ki prodaja",
    category: "Spletna trgovina",
    categorySlug: "spletna-trgovina",
    year: "2024",
    color: "#0ea5e9",
    image: "/works/ecommerce.jpg",
    heroImage: "/works/ecommerce.jpg",
    client: "Za prodajalce",
    duration: "8-14 tednov",
    overview:
      "Moderna spletna trgovina z izjemno uporabniško izkušnjo, optimiziranimi konverzijami in seamless checkout procesom, ki spremeni obiskovalce v kupce.",
    challenge:
      "Visoka stopnja zapuščenih košaric, počasno nalaganje in slaba mobilna izkušnja so ubijali prodajo. Potrebovali ste trgovino, ki dela za vas.",
    solution:
      "Razvili smo custom e-commerce rešitev z ultra-hitrim nalaganjem, intuitivnim checkout procesom in personaliziranimi priporočili.",
    features: [
      {
        title: "Hiter checkout",
        description:
          "One-click nakup za vračajoče stranke. Manj korakov = več zaključenih nakupov.",
        icon: "speed",
      },
      {
        title: "AI priporočila",
        description:
          "Personalizirana priporočila izdelkov povečujejo povprečno vrednost košarice.",
        icon: "analytics",
      },
      {
        title: "Varna plačila",
        description:
          "PCI DSS skladnost, Stripe/PayPal integracija za varno plačevanje.",
        icon: "security",
      },
      {
        title: "Mobilna optimizacija",
        description:
          "Več kot 60% nakupov se zgodi na mobilnih napravah. Vaša trgovina bo brezhibna.",
        icon: "mobile",
      },
    ],
    technologies: [
      "Next.js",
      "Shopify Headless",
      "TypeScript",
      "Tailwind CSS",
      "Stripe",
      "Algolia Search",
      "Klaviyo",
    ],
    metrics: [
      {
        value: 85,
        label: "Manj zapuščenih košaric",
        suffix: "%",
        prefix: "-",
      },
      {
        value: 220,
        label: "Povečanje prodaje",
        suffix: "%",
        prefix: "+",
      },
      {
        value: 1.2,
        label: "Čas nalaganja",
        suffix: "s",
      },
      {
        value: 4.9,
        label: "Ocena uporabnikov",
        suffix: "/5",
      },
    ],
    process: [
      {
        number: "01",
        title: "Analiza & strategija",
        description:
          "Analiziramo vašo trenutno prodajo, konkurenco in ciljno publiko.",
        duration: "1 teden",
      },
      {
        number: "02",
        title: "UX & checkout flow",
        description:
          "Oblikujemo optimalno uporabniško pot od vstopa do zaključka nakupa.",
        duration: "2 tedna",
      },
      {
        number: "03",
        title: "Dizajn & branding",
        description:
          "Vizualni dizajn ki gradi zaupanje in spodbuja nakupe.",
        duration: "2-3 tedni",
      },
      {
        number: "04",
        title: "Razvoj & integracije",
        description:
          "Implementacija s plačilnimi sistemi, zalogo in email marketingom.",
        duration: "3-4 tedni",
      },
      {
        number: "05",
        title: "Testiranje & optimizacija",
        description:
          "A/B testiranje, optimizacija hitrosti in lansiranje.",
        duration: "1-2 tedna",
      },
    ],
    benefits: [
      {
        title: "Več prodaje",
        description:
          "Optimiziran checkout in UX pomenita manj zapuščenih košaric in več zaključenih nakupov.",
      },
      {
        title: "Višja vrednost naročil",
        description:
          "Pametna priporočila in upselling povečujejo povprečno vrednost nakupa.",
      },
      {
        title: "Manj dela za vas",
        description:
          "Avtomatizirani procesi za naročila, zaloge in obvestila strankam.",
      },
      {
        title: "Skalabilnost",
        description:
          "Arhitektura ki raste z vami — od 100 do 100.000 naročil mesečno.",
      },
    ],
    faq: [
      {
        question: "Kateri plačilni sistemi so podprti?",
        answer:
          "Stripe, PayPal, kartična plačila, povzetje in vsi glavni slovenski plačilni sistemi.",
      },
      {
        question: "Ali lahko povežete z mojim ERP/zalogo?",
        answer:
          "Da, imamo izkušnje z integracijo večine slovenskih in mednarodnih sistemov.",
      },
      {
        question: "Kako je z mobilnim nakupovanjem?",
        answer:
          "Vsaka trgovina je mobile-first — optimizirana za nakupovanje na telefonu.",
      },
    ],
    gallery: [
      {
        src: "/works/ecommerce.jpg",
        alt: "E-commerce - Domača stran",
      },
    ],
    nextProject: "ai-integracija",
    prevProject: "premium-website",
  },
  {
    slug: "ai-integracija",
    title: "AI Integracija",
    subtitle: "Avtomatizirajte in optimizirajte",
    category: "AI & Avtomatizacija",
    categorySlug: "ai-avtomatizacija",
    year: "2025",
    color: "#3b82f6",
    image: "/works/ai_integration.jpg",
    heroImage: "/works/ai_integration.jpg",
    client: "Za napredna podjetja",
    duration: "4-8 tednov",
    overview:
      "Integracija naprednih AI rešitev v obstoječe poslovne procese za avtomatizacijo rutinskih nalog in povečanje učinkovitosti ekipe.",
    challenge:
      "Ponavljajoče naloge jemljejo čas vašim zaposlenim. Podpora strankam ne more biti 24/7. Potrebujete pametnejše rešitve.",
    solution:
      "Implementiramo custom AI chatbote, avtomatizacijo procesov in inteligentne asistente ki delajo za vas.",
    features: [
      {
        title: "AI Chatbot",
        description:
          "24/7 podpora strankam z razumevanjem naravnega jezika in konteksta.",
        icon: "code",
      },
      {
        title: "Avtomatizacija",
        description:
          "80% rutinskih nalog avtomatizirano — email, dokumenti, poročila.",
        icon: "speed",
      },
      {
        title: "Analitika",
        description:
          "Real-time vpogledi v obnašanje strank in poslovanje.",
        icon: "analytics",
      },
      {
        title: "Integracije",
        description:
          "Seamless povezava z vašimi obstoječimi sistemi.",
        icon: "security",
      },
    ],
    technologies: [
      "OpenAI GPT-4",
      "Claude AI",
      "LangChain",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    metrics: [
      {
        value: 80,
        label: "Avtomatizirane naloge",
        suffix: "%",
      },
      {
        value: 3,
        label: "Odzivni čas",
        suffix: "s",
      },
      {
        value: 95,
        label: "Zadovoljstvo strank",
        suffix: "%",
      },
      {
        value: 50,
        label: "Prihranek časa",
        suffix: "h/teden",
      },
    ],
    process: [
      {
        number: "01",
        title: "Analiza procesov",
        description:
          "Identificiramo ponavljajoče naloge in priložnosti za avtomatizacijo.",
        duration: "1 teden",
      },
      {
        number: "02",
        title: "Načrtovanje rešitve",
        description:
          "Oblikujemo AI rešitev prilagojeno vašim potrebam.",
        duration: "1 teden",
      },
      {
        number: "03",
        title: "Razvoj & trening",
        description:
          "Razvijemo in naučimo AI z vašimi podatki in kontekstom.",
        duration: "2-4 tedni",
      },
      {
        number: "04",
        title: "Integracija & testiranje",
        description:
          "Povežemo z obstoječimi sistemi in temeljito testiramo.",
        duration: "1-2 tedna",
      },
    ],
    benefits: [
      {
        title: "Prihranek časa",
        description: "Vaša ekipa se lahko posveti pomembnejšim nalogam.",
      },
      {
        title: "24/7 podpora",
        description: "AI asistent je vedno na voljo vašim strankam.",
      },
      {
        title: "Konsistentnost",
        description: "Enaka kakovost odgovorov ne glede na čas ali dan.",
      },
      {
        title: "Skalabilnost",
        description: "Obvladajte 10x več povpraševanj brez dodatnih zaposlitev.",
      },
    ],
    faq: [
      {
        question: "Ali AI res razume slovenščino?",
        answer:
          "Da, moderni AI modeli odlično razumejo in komunicirajo v slovenščini.",
      },
      {
        question: "Kako je z varnostjo podatkov?",
        answer:
          "Vaši podatki ostanejo varni — uporabljamo enterprise-grade varnostne standarde.",
      },
    ],
    gallery: [
      {
        src: "/works/ai_integration.jpg",
        alt: "AI Integracija - Dashboard",
      },
    ],
    nextProject: "3d-tiskanje",
    prevProject: "ecommerce",
  },
  {
    slug: "3d-tiskanje",
    title: "3D Tiskanje",
    subtitle: "Od ideje do izdelka",
    category: "Prototipiranje",
    categorySlug: "prototipiranje",
    year: "2025",
    color: "#2563eb",
    image: "/works/3d_printing.jpg",
    heroImage: "/works/3d_printing.jpg",
    client: "Za inovatorje",
    duration: "1-4 tedni",
    overview:
      "Spletna platforma za naročanje custom 3D printov z instant kalkulacijo cen, 3D predogledom in tracking sistemom.",
    challenge:
      "Kompleksen proces naročanja 3D printov — ročna komunikacija, počasne ponudbe in nepredvidljivi roki dostave.",
    solution:
      "Platformo z avtomatskim izračunom cen, interaktivnim 3D predogledom in real-time tracking sistemom.",
    features: [
      {
        title: "3D Predogled",
        description:
          "Interaktivna vizualizacija vašega modela pred naročilom.",
        icon: "design",
      },
      {
        title: "Instant cene",
        description:
          "Avtomatski izračun cene glede na material, velikost in kompleksnost.",
        icon: "speed",
      },
      {
        title: "Tracking",
        description:
          "Real-time sledenje proizvodnje in dostave vašega naročila.",
        icon: "analytics",
      },
      {
        title: "API integracija",
        description:
          "Za podjetja: povežite vaš sistem direktno z našo platformo.",
        icon: "code",
      },
    ],
    technologies: [
      "React",
      "Three.js",
      "WebGL",
      "Node.js",
      "MongoDB",
      "AWS S3",
      "Stripe",
    ],
    metrics: [
      {
        value: 70,
        label: "Hitrejše naročanje",
        suffix: "%",
      },
      {
        value: 0,
        label: "Napak v izračunih",
        suffix: "",
      },
      {
        value: 4.8,
        label: "Ocena platforme",
        suffix: "/5",
      },
      {
        value: 200,
        label: "Naročil na mesec",
        suffix: "+",
      },
    ],
    process: [
      {
        number: "01",
        title: "Naložite model",
        description: "Preprosto naložite vaš 3D model (STL, OBJ, STEP).",
        duration: "1 min",
      },
      {
        number: "02",
        title: "Izberite material",
        description:
          "Izberite med PLA, PETG, ABS, resin in drugimi materiali.",
        duration: "1 min",
      },
      {
        number: "03",
        title: "Preglejte & naročite",
        description:
          "Vizualizirajte v 3D, preverite ceno in naročite.",
        duration: "2 min",
      },
      {
        number: "04",
        title: "Spremljajte & prejmite",
        description: "Sledite proizvodnji in prejmite vaš izdelek.",
        duration: "3-7 dni",
      },
    ],
    benefits: [
      {
        title: "Takojšnje ponudbe",
        description: "Brez čakanja na ročne izračune — cena takoj.",
      },
      {
        title: "Vizualizacija",
        description: "Vidite točno kako bo izgledal vaš izdelek.",
      },
      {
        title: "Transparentnost",
        description: "Spremljajte vsak korak od naročila do dostave.",
      },
      {
        title: "Kvaliteta",
        description: "Premium materiali in natančno 3D tiskanje.",
      },
    ],
    faq: [
      {
        question: "Katere formate podpirate?",
        answer: "STL, OBJ, STEP, 3MF in večino standardnih 3D formatov.",
      },
      {
        question: "Kako hitro dobim izdelek?",
        answer:
          "Standardna dostava 5-7 delovnih dni, express 2-3 dni.",
      },
    ],
    gallery: [
      {
        src: "/works/3d_printing.jpg",
        alt: "3D Tiskanje - Platforma",
      },
    ],
    nextProject: "premium-website",
    prevProject: "ai-integracija",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectIndex(slug: string): number {
  return PROJECTS.findIndex((p) => p.slug === slug);
}
