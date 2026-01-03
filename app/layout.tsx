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
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nordia.si"),
  title: {
    default: "Nordia — Premium spletne strani in digitalne rešitve",
    template: "%s | Nordia",
  },
  description:
    "High-end studio za spletne strani, aplikacije in digitalne produkte. Storytelling, motion in vrhunski UX/UI. Začnimo projekt.",
  keywords: [
    "spletne strani",
    "digitalne rešitve",
    "web development",
    "UI/UX design",
    "digital products",
    "venture builder",
    "premium web design",
    "Slovenia",
    "aplikacije",
    "motion design",
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
      "High-end studio za spletne strani, aplikacije in digitalne produkte. Storytelling, motion in vrhunski UX/UI.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nordia — Premium digitalne rešitve",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nordia — Premium spletne strani in digitalne rešitve",
    description:
      "High-end studio za spletne strani, aplikacije in digitalne produkte. Storytelling, motion in vrhunski UX/UI.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nordia",
  url: "https://nordia.si",
  logo: "https://nordia.si/logo.png",
  description:
    "High-end studio za spletne strani, aplikacije in digitalne produkte.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "SI",
  },
  sameAs: ["https://instagram.com/nordia_si"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl" className={texGyreHeros.variable}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
