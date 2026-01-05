interface SectionDividerProps {
  /** Barva zgoraj */
  fromColor?: string;
  /** Barva spodaj */
  toColor?: string;
}

/**
 * Horizontalna linija med sekcijami z gradient ozadjem.
 */
export default function SectionDivider({
  fromColor = "#000000",
  toColor = "#000000",
}: SectionDividerProps) {
  return (
    <div
      className="relative z-20 py-8 md:py-12"
      style={{
        background: `linear-gradient(to bottom, ${fromColor} 0%, ${fromColor} 45%, ${toColor} 55%, ${toColor} 100%)`,
      }}
    >
      <div className="h-px w-full bg-white/20" />
    </div>
  );
}
