import { growToolkits } from "@/data/grow-toolkits";

export const ABOUT_NAV_SECTIONS = [
  { label: "Mission", href: "/about/mission" },
  { label: "People", href: "/about/people" },
  { label: "Partners", href: "/about/partners" },
  { label: "Data", href: "/about/data" },
] as const;

const GROW_NAV_SUMMARY =
  "Six toolkits to help leaders plan for and connect with their communities. Plain language, no inside baseball.";

const PAL_NAV_SUMMARY =
  "Plain-language Texas bill tracking for organizers and advocates. Public information should actually be public.";

export const SOLUTION_NAV_SECTIONS = [
  {
    label: "PAL",
    href: "/solutions/pal",
    summary: PAL_NAV_SUMMARY,
  },
  {
    label: "GROW",
    href: "/solutions/grow",
    summary: GROW_NAV_SUMMARY,
    children: growToolkits.map((t) => ({
      label: t.shortLabel,
      href: `/grow/${t.slug}`,
      summary: t.target[0] ?? "",
    })),
  },
] as const;

export type NavMegaSection = {
  readonly label: string;
  readonly href: string;
  readonly summary?: string;
  readonly children?: readonly {
    readonly label: string;
    readonly href: string;
    readonly summary?: string;
  }[];
};

export type HeaderNavItem =
  | { readonly kind: "link"; readonly label: string; readonly href: string }
  | {
      readonly kind: "dropdown";
      readonly label: string;
      readonly href: string;
      readonly sections: readonly NavMegaSection[];
    };

export const DESKTOP_NAV: readonly HeaderNavItem[] = [
  { kind: "dropdown", label: "About", href: "/about", sections: ABOUT_NAV_SECTIONS },
  { kind: "link", label: "Events", href: "/events" },
  { kind: "dropdown", label: "Solutions", href: "/solutions", sections: SOLUTION_NAV_SECTIONS },
];
