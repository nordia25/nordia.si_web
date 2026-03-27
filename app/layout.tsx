import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const texGyreHeros = localFont({
  src: [
    {
      path: "./fonts/texgyreheros-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/texgyreheros-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nordia.si"),
  title: {
    default: "Nordia — Premium spletne strani in digitalne rešitve",
    template: "%s | Nordia",
  },
  description:
    "Premium studio za spletne strani, spletne trgovine in AI avtomatizacije. Vrhunski UX/UI design, bliskovita hitrost in SEO optimizacija. Slovenija.",
  keywords: [
    "spletne strani",
    "spletna trgovina",
    "digitalne rešitve",
    "izdelava spletnih strani",
    "web design",
    "UI/UX oblikovanje",
    "AI avtomatizacija",
    "SEO optimizacija",
    "spletna agencija Slovenija",
    "premium web design",
    "e-commerce",
    "3D tiskanje",
    "aplikacije",
    "digitalna agencija",
  ],
  authors: [{ name: "Nordia d.o.o.", url: "https://nordia.si" }],
  creator: "Nordia d.o.o.",
  publisher: "Nordia d.o.o.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "sl_SI",
    url: "https://nordia.si",
    siteName: "Nordia",
    title: "Nordia — Premium spletne strani in digitalne rešitve",
    description:
      "Premium studio za spletne strani, spletne trgovine in AI avtomatizacije. Vrhunski UX/UI design in SEO optimizacija.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nordia — Premium spletne strani, spletne trgovine in digitalne rešitve",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nordia — Premium spletne strani in digitalne rešitve",
    description:
      "Premium studio za spletne strani, spletne trgovine in AI avtomatizacije. Vrhunski UX/UI design in SEO optimizacija.",
    images: ["/og-image.jpg"],
    creator: "@nordia_si",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://nordia.si",
    languages: {
      "sl-SI": "https://nordia.si",
      "x-default": "https://nordia.si",
    },
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": "https://nordia.si/#organization",
  name: "Nordia",
  legalName: "Nordia d.o.o.",
  url: "https://nordia.si",
  logo: "https://nordia.si/og-image.jpg",
  image: "https://nordia.si/og-image.jpg",
  description:
    "Premium studio za spletne strani, spletne trgovine, AI avtomatizacije in digitalne produkte v Sloveniji.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Runarsko 1A",
    addressLocality: "Nova Vas",
    postalCode: "1385",
    addressCountry: "SI",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.815,
    longitude: 14.5144,
  },
  areaServed: {
    "@type": "Country",
    name: "Slovenia",
  },
  sameAs: [
    "https://instagram.com/nordia.si",
    "https://linkedin.com/company/nordia",
    "https://github.com/nordia",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@nordia.si",
    contactType: "customer service",
    availableLanguage: ["Slovenian", "English"],
  },
  founder: [
    {
      "@type": "Person",
      name: "Nikolaj Taras Fras",
      jobTitle: "CEO - Komercialni direktor",
      url: "https://linkedin.com/in/taras-fras",
    },
    {
      "@type": "Person",
      name: "Izak Ivančič",
      jobTitle: "CTO - Tehnični direktor",
      url: "https://linkedin.com/in/izak-ivancic",
    },
  ],
  knowsAbout: [
    "Web Development",
    "UI/UX Design",
    "E-Commerce",
    "AI Automation",
    "Digital Products",
    "3D Printing",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Digitalne storitve",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Premium spletna stran",
          description:
            "Oblikovanje in razvoj premium spletnih strani z Lighthouse 100, SEO-first pristopom in responsive designom.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Spletna trgovina",
          description:
            "E-commerce rešitve s Stripe/PayPal integracijami, avtomatsko sinhronizacijo zalog in optimiziranim checkoutom.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Avtomatizacija",
          description:
            "Prilagojeni programi za avtomatizacijo procesov in integracija AI v obstoječo poslovno infrastrukturo.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "3D Tiskanje",
          description:
            "FDM in SLA 3D tiskanje s profesionalnimi materiali za hitro prototipiranje — od ideje do izdelka v 48 urah.",
        },
      },
    ],
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://nordia.si/#website",
  url: "https://nordia.si",
  name: "Nordia",
  description:
    "Premium studio za spletne strani, spletne trgovine, AI avtomatizacije in digitalne produkte.",
  publisher: {
    "@id": "https://nordia.si/#organization",
  },
  inLanguage: "sl-SI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl" className={`${texGyreHeros.variable} no-js`} suppressHydrationWarning>
      <head>
        {/* Remove no-js class immediately when JS executes - enables CSS fallbacks if JS fails */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
        {/* Preload hero image for faster LCP */}
        <link
          rel="preload"
          as="image"
          href="/works/nordia-hero-bg.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite),
          }}
        />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
