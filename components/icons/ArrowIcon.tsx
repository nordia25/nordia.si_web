interface ArrowIconProps {
  className?: string;
  strokeWidth?: number;
}

export default function ArrowIcon({
  className = "w-4 h-4",
  strokeWidth = 2,
}: ArrowIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}
