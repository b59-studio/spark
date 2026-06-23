export const ABOUT_NAV_SECTIONS = [
  { label: "Mission", href: "/about/mission" },
  { label: "People", href: "/about/people" },
  { label: "Partners", href: "/about/partners" },
  { label: "Data", href: "/about/data" },
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
  { kind: "link", label: "Toolkits", href: "/toolkits" },
];
