import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pitch",
  robots: { index: false, follow: false },
};

export default function PitchPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <video
        className="h-auto max-h-screen w-full max-w-5xl"
        controls
        autoPlay
        playsInline
        preload="metadata"
        width={1920}
        height={1080}
      >
        <source src="/pitch-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
