/**
 * Shared ultra-lightweight blur placeholders to avoid shipping large base64 strings
 * in multiple components.
 *
 * These are intentionally tiny to keep JS bundles lean.
 */

/** 1x1 transparent GIF (very small, widely supported) */
export const BLUR_DATA_URL_1PX =
  "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

