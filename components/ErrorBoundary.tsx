"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Fallback UI - show content without animations
      return (
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#000",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 500,
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Nordia.
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2rem",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            Prosimo, osvežite stran ali nas kontaktirajte na info@nordia.si
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              fontWeight: 500,
              color: "#fff",
              backgroundColor: "#1d4ed8",
              border: "none",
              borderRadius: "9999px",
              cursor: "pointer",
            }}
          >
            Osveži stran
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
