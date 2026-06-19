"use client";

type Theme = "light" | "dark";

/** Read the theme actually in effect: an explicit choice wins, else the OS preference. */
function resolveActiveTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Private mode / storage disabled — the choice just won't persist.
  }
}

function SunIcon() {
  return (
    <svg
      className="theme-toggle-icon theme-toggle-icon--sun"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="theme-toggle-icon theme-toggle-icon--moon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/**
 * Flips between light and dark. First load with no stored choice follows the OS
 * (handled in CSS); clicking sets an explicit, persisted preference. Which icon
 * shows is driven entirely by CSS off `data-theme` + the media query, so the
 * server and client render identical markup (no hydration flash).
 */
export default function ThemeToggle() {
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      onClick={() => applyTheme(resolveActiveTheme() === "dark" ? "light" : "dark")}
    >
      <SunIcon />
      <MoonIcon />
    </button>
  );
}
