import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika zasebnosti",
  description:
    "Politika zasebnosti podjetja Nordia d.o.o. — kako zbiramo, uporabljamo in varujemo vaše osebne podatke na spletni strani nordia.si.",
  alternates: {
    canonical: "https://nordia.si/zasebnost",
  },
};

export default function ZasebnostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
