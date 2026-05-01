export type GrowToolkit = {
  slug: string;
  shortLabel: string;
  fullTitle: string;
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
    summary:
      "GTKYP is your precinct orientation: map zones and neighborhoods, capture apartments and community anchors, name your strongest volunteers, and tie it together with a Big Blue Goal that lines up with the rest of the GROW sequence (GTKYV through TYSM). Precinct guides, data dashboards, and goal-setting templates in the packet unpack the same work spelled out in Target through Tasks.",
    toolkitPacketHref: "",
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
    slug: "gtkyv",
    shortLabel: "GTKYV",
    fullTitle: "GTKYV - Get To Know Your Voters",
    summary:
      "GTKYV is relationship-first outreach—meet voters as neighbors before you make asks, surface what they care about, and fold people into organizing through hosted gatherings and structured canvassing. Scripts, contact sheets, leave-behinds, and hosting guides connect directly to the Tools and Tasks sections that follow.",
    toolkitPacketHref: "",
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
    slug: "gotvol",
    shortLabel: "GOTVol",
    fullTitle: "GOTVol - Get Out The Volunteers",
    summary:
      "GOTVol builds the volunteer bench your registration and GOTV pushes need: clear plans, neighbor conversations, and steady follow-up so people are ready when GOTVR and GOTV ramp up. Planning templates, maps, VAN and Reach guidance, scripts, and leave-behinds flesh out the simple rhythm in Tasks—make a plan, talk to your neighbors, follow up.",
    toolkitPacketHref: "",
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
    slug: "gotvr",
    shortLabel: "GOTVR",
    fullTitle: "GOTVR - Get Our Texas Voters Registered",
    summary:
      "GOTVR focuses outreach on eligible Texans who are not yet registered at their current address, with enough runway before the registration deadline to absorb surveying, turf choices, and repeat contacts. You will pick a slice of the list (unregistered, suspended, non-surveyed, partisan targets, or broad), set goals, match canvass windows to your team, then knock doors with scripts and maps until registrations move.",
    toolkitPacketHref: "",
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
    summary:
      "GOTV is the final sprint: turn confirmed supporters into voters through intentional planning, persistent neighbor contact, and reminders through Election Day. Same core toolkit stack as GOTVol and GOTVR—plans, dashboards, maps, VAN/Reach, scripts, and leave-behinds—applied to ballot casting instead of registration.",
    toolkitPacketHref: "",
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
    summary:
      "TYSM closes the loop after votes are counted: thank voters and volunteers, name wins large and small, collect honest feedback, and rekindle one-to-one ties so your team does not go cold before the next cycle. You still plan, reach out, and follow up—now with gratitude and reflection as the through-line rather than ballots or registration.",
    toolkitPacketHref: "",
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
