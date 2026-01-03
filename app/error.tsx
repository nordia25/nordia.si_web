"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="max-w-lg text-center">
        {/* Error icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <svg
            className="h-10 w-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-4 font-display text-4xl md:text-5xl">
          Nekaj je šlo narobe
        </h1>

        {/* Description */}
        <p className="mb-8 text-lg leading-relaxed text-white/50">
          Prišlo je do nepričakovane napake. Prosimo, poskusite znova ali nas
          kontaktirajte, če se težava ponavlja.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mb-8 font-mono text-xs text-white/20">
            Koda napake: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-full bg-white px-8 py-4 font-medium text-black transition-colors duration-300 hover:bg-white/90"
          >
            Poskusi znova
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-8 py-4 font-medium transition-colors duration-300 hover:bg-white/5"
          >
            Nazaj domov
          </Link>
        </div>

        {/* Contact */}
        <p className="mt-12 text-sm text-white/30">
          Potrebujete pomoč?{" "}
          <a
            href="mailto:info@nordia.si"
            className="text-white/50 underline underline-offset-4 hover:text-white"
          >
            info@nordia.si
          </a>
        </p>
      </div>
    </div>
  );
}
