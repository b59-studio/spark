import { siteImages } from "@/lib/site-visuals";

/** Ordered `/public` artwork; index matches `growToolkits` (toolkits 1–6). */
export const growToolkitCoverPaths = siteImages.growToolkitCovers;

export type GrowToolkit = {
  slug: string;
  shortLabel: string;
  fullTitle: string;
  /** Heading on the GROW index carousel (plain language). */
  panelTitle: string;
  summary: string;
  /** Full URL for the toolkit packet when published (Drive, PDFs, etc.) */
  toolkitPacketHref: string;
  target: string[];
  timeframe: string[];
  tools: string[];
  tasks: string[];
};

export const growToolkits: GrowToolkit[] = [
  {
    slug: "gtkyp",
    shortLabel: "GTKYP",
    fullTitle: "GTKYP - Get To Know Your Precinct",
    panelTitle: "Precinct Planning",
    summary:
      "Map your precinct: zones, neighborhoods, and anchors. Name your strongest volunteers. Set a Big Blue Goal that lines up with the rest of GROW.",
    toolkitPacketHref:
      "https://drive.google.com/drive/folders/1z6R9kkpy1U8mnBbjMz-dj9zjQbjSGIEV?usp=share_link",
    target: ["Build knowledge about your precinct."],
    timeframe: [
      "Any time, ongoing, or as needed.",
      "Or about 5 months before Election Day (for example, begin in early June for an early November Election Day).",
    ],
    tools: [
      "Precinct guide for each zone with an overview of zone maps.",
      "Volunteer directory and voter relationship management references.",
      "Data dashboards.",
      "Community event spaces.",
    ],
    tasks: [
      "Complete your precinct guide for each zone.",
      "Describe your precinct's neighborhoods.",
      "List major apartment complexes (use the extended guide for apartment-heavy precincts).",
      "List public spaces and businesses.",
      "Describe your precinct and list your super volunteers (use the extended guide if needed).",
      "Outline your Big Blue Goal using goal-setting templates for GTKYV, GOTVR, GOTVol, GOTV, and TYSM.",
    ],
  },
  {
    slug: "gotvol",
    shortLabel: "GOTVol",
    fullTitle: "GOTVol - Get Out The Volunteers",
    panelTitle: "Volunteer Recruitment",
    summary:
      "Grow the volunteer bench your registration and GOTV pushes need. Plan, talk to neighbors, and follow up so people are ready when those programs ramp up.",
    toolkitPacketHref:
      "https://drive.google.com/drive/folders/1qp8SgjEJf06QM77zg6s1YdeNA1PsCe2z?usp=share_link",
    target: ["Recruit volunteers for GOTVR and GOTV campaigns."],
    timeframe: [
      "At least 3 months before Election Day (for example, begin in early August for an early November Election Day).",
    ],
    tools: [
      "Planning template.",
      "Data dashboard.",
      "Maps.",
      "VAN and Reach how-tos.",
      "Scripts.",
      "Leave-behind materials.",
      "Connections and info for volunteers and voters.",
    ],
    tasks: ["Make a plan.", "Talk to your neighbors.", "Follow up."],
  },
  {
    slug: "gtkyv",
    shortLabel: "GTKYV",
    fullTitle: "GTKYV - Get To Know Your Voters",
    panelTitle: "Voter Engagement",
    summary:
      "Meet voters as neighbors before the hard ask: learn what they care about and bring them in through hosted events and canvassing.",
    toolkitPacketHref:
      "https://drive.google.com/drive/folders/18O7OSJpWOdOD76nesojPeFOP-1WtrYCV?usp=share_link",
    target: [
      "Connect with voters before approaching them with an ask.",
      "Introduce yourself to your neighbors.",
      "Learn the issues important to your neighbors.",
      "Strengthen existing relationships by including neighbors in organizing.",
    ],
    timeframe: [
      "Any time, ongoing.",
      "Or about 4 months before Election Day (for example, begin in early July for an early November Election Day).",
    ],
    tools: [
      "Scripts and leave-behind materials.",
      "Contact sheet.",
      "Event hosting tools.",
    ],
    tasks: [
      "Plan an event and invite neighbors.",
      "Organize volunteers to support event planning and canvassing.",
      "Determine event time and location using precinct community spaces.",
      "Review hosting guides for flow, questions, and activities.",
      "Canvass to invite neighbors with scripts, contact logs, and leave-behind invites.",
      "Host the event and gather sign-ins, listening circle tools, run-of-show materials, and event scripts.",
    ],
  },
  {
    slug: "gotvr",
    shortLabel: "GOTVR",
    fullTitle: "GOTVR - Get Our Texas Voters Registered",
    panelTitle: "Voter Registration",
    summary:
      "Register eligible Texans who are not yet registered at their current address. Pick your audience and turf, set goals, and canvass with scripts and maps ahead of the deadline.",
    toolkitPacketHref:
      "https://drive.google.com/drive/folders/1DhD6J00Vtvp9kRIklY1fkhUCee_G1v4l?usp=sharing",
    target: [
      "Register Texans to vote at unregistered addresses in your area.",
    ],
    timeframe: [
      "At least 2 months before Election Day, or at least 30 days before the voter registration deadline.",
      "For example, begin in early September when the registration deadline is in early October.",
    ],
    tools: [
      "Planning template.",
      "Data dashboard.",
      "Maps.",
      "VAN and Reach how-tos.",
      "Scripts.",
      "Leave-behind materials.",
      "Connections and info for volunteers and voters.",
    ],
    tasks: [
      "Determine focus: unregistered addresses, suspended voters, non-surveyed voters, Democratic voters, or all.",
      "Set process and outcome goals.",
      "Decide where to canvass using voter maps and precinct priorities.",
      "Decide when to canvass based on shifts, team size, pair strategy, and availability.",
      "Use doorknocking windows like Saturday mornings, Sunday afternoons, Saturday afternoons, and weekday late afternoons.",
      "Talk to your neighbors and follow up.",
    ],
  },
  {
    slug: "gotv",
    shortLabel: "GOTV",
    fullTitle: "GOTV - Get Out The Vote",
    panelTitle: "Voter Mobilization",
    summary:
      "Turn confirmed supporters into ballots with a tight plan and neighbor contact through Election Day. The same core tools as earlier phases, focused on voting instead of registration.",
    toolkitPacketHref:
      "https://drive.google.com/drive/folders/1alBGDI9_bVJH1zFov8JQZRril71DDzEI?usp=sharing",
    target: ["Mobilize voters to vote in the upcoming election."],
    timeframe: [
      "At least 30 days before Election Day (for example, begin in early October for an early November Election Day).",
    ],
    tools: [
      "Planning template.",
      "Data dashboard.",
      "Maps.",
      "VAN and Reach how-tos.",
      "Scripts.",
      "Leave-behind materials.",
      "Connections and info for volunteers and voters.",
    ],
    tasks: [
      "Make a plan.",
      "Talk to your neighbors.",
      "Follow up until they go vote.",
    ],
  },
  {
    slug: "tysm",
    shortLabel: "TYSM",
    fullTitle: "TYSM - Thank Y'all So Much",
    panelTitle: "Voter Appreciation",
    summary:
      "After Election Day, thank voters and volunteers, note wins, gather feedback, and keep relationships warm for the next cycle.",
    toolkitPacketHref:
      "https://drive.google.com/drive/folders/1LIYZJzlTgmCm4hdjApsyDVUwVLUsmFCJ?usp=sharing",
    target: [
      "Thank voters and volunteers for prior election-cycle contributions.",
      "Celebrate wins, no matter how small.",
      "Gather feedback for improvement.",
      "Strengthen relationships by re-engaging and making personal connections.",
    ],
    timeframe: [
      "Ideally no later than 40 days after Election Day, though thanking people is always worthwhile.",
      "For example, complete by early December for an early November Election Day.",
    ],
    tools: [
      "Planning template.",
      "Data dashboard.",
      "Maps.",
      "VAN and Reach how-tos.",
      "Scripts.",
      "Leave-behind materials.",
      "Connections and info for volunteers and voters.",
    ],
    tasks: [
      "Make a plan.",
      "Thank your voters and volunteers.",
      "Follow up.",
    ],
  },
];

export function getGrowToolkitBySlug(slug: string) {
  return growToolkits.find((toolkit) => toolkit.slug === slug);
}

export function getGrowToolkitNav(slug: string) {
  const index = growToolkits.findIndex((toolkit) => toolkit.slug === slug);
  if (index < 0) {
    return null;
  }
  const total = growToolkits.length;
  return {
    index,
    number: index + 1,
    total,
    prev: index > 0 ? growToolkits[index - 1]! : null,
    next: index < total - 1 ? growToolkits[index + 1]! : null,
  };
}

export function getGrowToolkitCoverPath(slug: string): string | null {
  const nav = getGrowToolkitNav(slug);
  if (!nav) {
    return null;
  }
  return growToolkitCoverPaths[nav.index] ?? null;
}
