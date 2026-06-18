#!/usr/bin/env node
/**
 * Seed WordPress Pages from the marketing site's existing in-code content, so
 * the team can edit them in wp-admin instead of starting from a blank page.
 *
 * Credentials come from the environment — nothing secret lives in this file.
 *
 *   WP_API_URL=https://cms.jfseamus.com \
 *   WP_USER=<your wp username> \
 *   WP_APP_PASSWORD='xxxx xxxx xxxx xxxx xxxx xxxx' \
 *   node scripts/seed-wp-pages.mjs [--force]
 *
 * Safe to re-run: by default a page is created only if one with that slug does
 * NOT already exist; existing pages are skipped. Pass --force to update existing
 * pages too — needed to overwrite the placeholder content on the People page.
 *
 * The 9 toolkit pages and `events` seed as DRAFTS — they're not live yet; the
 * team develops and publishes them from wp-admin. Everything else publishes.
 *
 * The solutions / grow / pal sections were retired and folded into a single
 * year-round "Toolkits" section, so links here point at /toolkits.
 */

const API = (process.env.WP_API_URL || "").replace(/\/$/, "");
const USER = process.env.WP_USER || "";
// App passwords are displayed with spaces; WordPress ignores them on auth.
const PASS = (process.env.WP_APP_PASSWORD || "").replace(/\s+/g, "");
const FORCE = process.argv.includes("--force");

if (!API || !USER || !PASS) {
  console.error("Set WP_API_URL, WP_USER, and WP_APP_PASSWORD environment variables.");
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${USER}:${PASS}`).toString("base64");

/** Route slug -> { title, content (semantic HTML), status }. Links are relative
 *  to the marketing site on purpose. status defaults to "publish". */
const PAGES = [
  {
    slug: "people",
    title: "People",
    content: `<p>Our work is shaped by the organizers and neighbors we serve, the people making sure the lights stay on after everyone else leaves. Here is how we show up together.</p>
<h2>How we work</h2>
<h3>1. Listen first</h3>
<p>We map local priorities, barriers, and capacity with coalition partners before recommending any strategy. Grassroots, not amateur. Accessible, not detached.</p>
<h3>2. Co-design tools</h3>
<p>We build customizable resources for different experience levels, political contexts, and community identities. Plain language over gatekeeping. No consultant voice.</p>
<h3>3. Activate year-round</h3>
<p>We align campaigns with electoral and legislative calendars so people can take meaningful action all year, not only in peak election moments. Built to outlast individual campaign cycles.</p>
<h3>4. Share ownership</h3>
<p>Our goal is durable local leadership and sustainable organizing systems communities can continue running independently. Pass the torch without losing momentum.</p>`,
  },
  {
    slug: "mission",
    title: "Mission",
    content: `<p>We offer free, accurate, and people-centered tools for democratic organizations to take effective action when they need to, today. Our work is built to outlast individual campaign cycles. We preserve institutional knowledge, pass the torch without losing momentum, and make power legible to the people doing the work.</p>
<h2>Community-rooted practice</h2>
<p>Our free, people-centered, community-rooted resources help neighbors learn, practice, and lead democratic engagement in ways that fit their realities. Plain language over gatekeeping. Analytics translated into human-readable insights.</p>
<h2>Strengthening local partners</h2>
<p>We exist to grow, strengthen, and supplement local coalition partners and campaigns, not supplant them. TX*SPARK is civic infrastructure, not a competing campaign. We democratize access to information and reduce duplicated labor across the movement.</p>
<h2>Information when it matters</h2>
<p>Helping democratic institutions and community organizers access up-to-date, accurate information is a core part of our mission, so people can take informed action today, not after the moment has passed. Public information should actually be public. Accountability over opacity is how we operate.</p>
<p>For a deeper look at pipelines, update rhythms, and why trustworthy data sits at the center of how we build tools, read our page on <a href="/about/data">data integrity</a>.</p>
<h2>What we believe</h2>
<p>People already have the motivation to act. What they need is trusted structure, the kind that survives the people who built it. TX*SPARK turns civic energy into durable local power by giving communities the tools, strategy, and support to organize together all year, without reinventing the wheel every cycle.</p>
<blockquote><p>Lasting civic power is built when local communities have the tools and confidence to organize on their own terms. Understand your district without a political science degree.</p></blockquote>`,
  },
  {
    slug: "data",
    title: "Data integrity",
    content: `<p>TX*SPARK works to make sure you have the most up-to-date, actionable information in front of you, whether you are tracking bills, building outreach lists, or coordinating in the field. Public information should actually be public. That reliability is a core part of our promise, because your work does not get done if you cannot trust the data you are working with.</p>
<h2>Current, not stale</h2>
<p>Clean pipelines, regular updates, and plain-language presentation come together so you can move with confidence: what you see reflects the Capitol and your community as they are today, not a stale snapshot from last week. Data people can actually use. Accountability over opacity.</p>
<h2>See it in our tools</h2>
<p>GROW and PAL turn that commitment into workflows you can use every week. Organizing support aligned to real calendars, and bill tracking built on fresh pulls from Texas Legislature Online. Make power legible without living inside raw portals.</p>
<p><a href="/grow">See how we use this data in action</a></p>`,
  },
  {
    slug: "work",
    title: "Work",
    content: `<p>We've built voting registration platforms and designed shoes. We'll tell you more about it here soon.</p>
<p><a href="/about">Work with Us</a></p>`,
  },
  {
    slug: "about",
    title: "About TX*SPARK",
    content: `<p>TX*SPARK is a Texas-based data and technology PAC rooted in Austin, building practical tools and trusted support systems so local leaders can turn civic energy into year-round impact. We are not a campaign organization. We fill civic infrastructure gaps, reduce duplicated labor, and make civic tools legible to ordinary people.</p>
<p>TX*SPARK gives organizers, volunteers, and coalition partners free, practical tools to move from civic frustration to coordinated action. From precinct organizing to bill tracking, we help Texans organize with clarity, consistency, and confidence. Rebellious where it counts, trustworthy where it matters.</p>
<h2>Year-round</h2>
<p>Continuity over chaos. TX*SPARK provides organizing support that outlasts individual campaign cycles, not just peak election windows. We preserve institutional knowledge and pass the torch without losing momentum.</p>
<h2>Community-led</h2>
<p>Built with partners and never instead of them. We co-design with local leadership, share ownership, and build systems that survive the people who built them.</p>
<h2>Action-ready</h2>
<p>Data and tools people can actually use, right now. We translate analytics into plain language so organizers and campaign teams can move without gatekeeping or consultant-speak.</p>
<h2>Mission, people, partners &amp; data</h2>
<h3><a href="/about/mission">Mission</a></h3>
<p>Free, people-centered resources that help neighbors learn, practice, and lead democratic engagement and strengthen local coalitions without replacing them. We fill civic infrastructure gaps, not campaign stages.</p>
<h3><a href="/about/people">People</a></h3>
<p>How we listen with partners, co-design tools for real contexts, keep work aligned with electoral and legislative calendars, and share ownership so leadership stays local. Systems survive the people who built them.</p>
<h3><a href="/about/partners">Partners</a></h3>
<p>Trusted organizations and paths to connect: partner materials, events, and ways to build alongside communities across Texas. We supplement existing orgs. We don't compete with them.</p>
<h3><a href="/about/data">Data</a></h3>
<p>How we keep information current and actionable through clean pipelines and regular updates so you can trust what you see when organizing and advocating. Public information should actually be public.</p>`,
  },
  {
    slug: "partners",
    title: "Partners",
    content: `<h2>Partner resources</h2>
<p>Resources from trusted organizations aligned with democratic initiatives, curated to complement what TX*SPARK builds, not replace it.</p>
<p>This section features materials from our trusted partners who are also pushing democratic initiatives and supporting grassroots efforts in Texas. We democratize access to information and reduce duplicated labor across the movement.</p>
<h2>Partner with TX*SPARK</h2>
<p>Is your organization or coalition looking to deepen civic engagement in Texas? TX*SPARK offers free toolkits, guides, and materials you can put to work in your programs, and we welcome conversations about collaboration, co-hosted events, and ways we can build alongside your goals. We fill infrastructure gaps. We don't compete with the orgs already doing the work.</p>
<ul>
<li><a href="/grow">Toolkits</a> — toolkits, guides, and print-ready materials.</li>
<li><a href="/events">Events</a> — meet-ups, canvasses, and learning spaces.</li>
<li><a href="mailto:info@txspark.com">Partner with us</a> — let us build alongside your community goals.</li>
</ul>`,
  },
  {
    slug: "sitemap",
    title: "Sitemap",
    content: `<p>Browse all key TX*SPARK pages in one place.</p>
<h2>Main pages</h2>
<ul>
<li><a href="/">Home</a></li>
<li><a href="/about">About</a></li>
<li><a href="/events">Events</a></li>
<li><a href="/work">Our Work</a></li>
</ul>
<h2>About</h2>
<ul>
<li><a href="/about/mission">Mission</a></li>
<li><a href="/about/people">People</a></li>
<li><a href="/about/partners">Partners</a></li>
<li><a href="/about/data">Data</a></li>
</ul>
<h2>Programs &amp; tools</h2>
<ul>
<li><a href="/grow">Toolkits</a></li>
<li><a href="/pal">PAL</a></li>
</ul>
<h2>Legal</h2>
<ul>
<li><a href="/about/sitemap">Sitemap</a></li>
<li><a href="/about/privacy">Privacy Policy</a></li>
<li><a href="/about/terms">Terms of Use</a></li>
</ul>`,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    content: `<p>Last updated: April 23, 2026</p>
<p>TX*SPARK PAC ("TX*SPARK," "we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect information when you visit our website.</p>
<h2>Information We Collect</h2>
<p>We may collect limited personal information that you voluntarily provide, such as your name, email address, or organization when you contact us.</p>
<p>We may also collect non-personal information automatically, including browser type, device information, and usage data, to help us understand how the site is used.</p>
<h2>How We Use Information</h2>
<p>We use information to:</p>
<ul>
<li>Respond to inquiries</li>
<li>Improve our website and services</li>
<li>Maintain the security and integrity of our systems</li>
</ul>
<p>We do not sell personal information.</p>
<h2>Cookies and Analytics</h2>
<p>We may use cookies or similar technologies to understand site usage and improve performance. You can control cookies through your browser settings.</p>
<h2>Data Sharing</h2>
<p>We do not share personal information with third parties except as required by law or to operate the website (for example, hosting or analytics providers).</p>
<h2>Data Security</h2>
<p>We take reasonable measures to protect information from unauthorized access, disclosure, or misuse.</p>
<h2>Your Choices</h2>
<p>You may contact us to request access to, correction of, or deletion of your personal information.</p>
<h2>Changes to this Policy</h2>
<p>We may update this policy from time to time. Updates will be posted on this page.</p>
<h2>Contact</h2>
<p>Questions about this policy can be directed to: <a href="mailto:info@txspark.com">info@txspark.com</a></p>`,
  },
  {
    slug: "terms",
    title: "Terms of Use",
    content: `<p>Last updated: April 23, 2026</p>
<p>By accessing or using this website, you agree to these Terms of Use.</p>
<h2>Use of the Site</h2>
<p>This website is provided for informational purposes only. You may use it for lawful purposes and in accordance with these terms.</p>
<h2>Intellectual Property</h2>
<p>All content on this site, including text, graphics, logos, and software, is the property of TX*SPARK PAC or its licensors and is protected by applicable laws. You may not reproduce or distribute content without permission.</p>
<h2>No Warranties</h2>
<p>This site is provided "as is." We make no warranties regarding accuracy, completeness, or availability.</p>
<h2>Limitation of Liability</h2>
<p>TX*SPARK is not liable for any damages arising from use of or inability to use this website.</p>
<h2>External Links</h2>
<p>This site may contain links to third-party websites. We are not responsible for their content or practices.</p>
<h2>Changes</h2>
<p>We may update these Terms of Use at any time. Continued use of the site constitutes acceptance of the updated terms.</p>
<h2>Governing Law</h2>
<p>These terms are governed by the laws of the United States and the State of Texas, without regard to conflict of law principles.</p>
<h2>Contact</h2>
<p>Questions about this policy can be directed to: <a href="mailto:info@txspark.com">info@txspark.com</a></p>`,
  },
  {
    slug: "toolkits",
    title: "Toolkits",
    content: `<p>TX*SPARK organizing runs year-round, not just in the weeks before an election. Our toolkits break the work into clear, repeatable steps so local teams always know what to do next, whatever the calendar says.</p>
<p>The model is supported by nine toolkits that move a community through the full cycle of organizing: getting to know your precinct and neighbors, recruiting volunteers, registering and turning out voters, thanking the people who showed up, and tracking the legislation that affects them.</p>
<h2>The nine toolkits</h2>
<ul>
<li>Get To Know Your Precinct</li>
<li>Get Out The Volunteers</li>
<li>Get To Know Your Voters</li>
<li>Get Our Texas Voters Registered</li>
<li>Get Out The Vote</li>
<li>Thank Y'all So Much</li>
<li>Bill tracking (PAL) — part 1</li>
<li>Bill tracking (PAL) — part 2</li>
<li>Bill tracking (PAL) — part 3</li>
</ul>
<p>Each toolkit is being prepared as its own editable guide. Check back as we publish them.</p>`,
  },
  {
    slug: "toolkit-precinct",
    title: "Get To Know Your Precinct",
    status: "draft",
    content: `<p>Map your precinct: zones, neighborhoods, and anchors. Name your strongest volunteers. Set a Big Blue Goal that lines up with the rest of the cycle.</p>
<p><em>Draft — content to be finalized.</em></p>`,
  },
  {
    slug: "toolkit-volunteers",
    title: "Get Out The Volunteers",
    status: "draft",
    content: `<p>Grow the volunteer bench your registration and turnout pushes need. Plan, talk to neighbors, and follow up so people are ready when those programs ramp up.</p>
<p><em>Draft — content to be finalized.</em></p>`,
  },
  {
    slug: "toolkit-voters",
    title: "Get To Know Your Voters",
    status: "draft",
    content: `<p>Meet voters as neighbors before the hard ask: learn what they care about and bring them in through hosted events and canvassing.</p>
<p><em>Draft — content to be finalized.</em></p>`,
  },
  {
    slug: "toolkit-registration",
    title: "Get Our Texas Voters Registered",
    status: "draft",
    content: `<p>Register eligible Texans who are not yet registered at their current address. Pick your audience and turf, set goals, and canvass with scripts and maps ahead of the deadline.</p>
<p><em>Draft — content to be finalized.</em></p>`,
  },
  {
    slug: "toolkit-mobilization",
    title: "Get Out The Vote",
    status: "draft",
    content: `<p>Turn confirmed supporters into ballots with a tight plan and neighbor contact through Election Day.</p>
<p><em>Draft — content to be finalized.</em></p>`,
  },
  {
    slug: "toolkit-appreciation",
    title: "Thank Y'all So Much",
    status: "draft",
    content: `<p>After Election Day, thank voters and volunteers, note wins, gather feedback, and keep relationships warm for the next cycle.</p>
<p><em>Draft — content to be finalized.</em></p>`,
  },
  {
    slug: "toolkit-pal-1",
    title: "Bill Tracking (PAL) — Part 1",
    status: "draft",
    content: `<p>People's Advocacy Lobby (PAL): plain-language Texas bill tracking tied to Texas Legislature Online, so organizers can spot movement and compare versions without living inside raw portals.</p>
<p><em>Draft — content to be finalized. PAL is being split into three toolkits.</em></p>`,
  },
  {
    slug: "toolkit-pal-2",
    title: "Bill Tracking (PAL) — Part 2",
    status: "draft",
    content: `<p>Part of the PAL split into three toolkits.</p>
<p><em>Placeholder — content to be added.</em></p>`,
  },
  {
    slug: "toolkit-pal-3",
    title: "Bill Tracking (PAL) — Part 3",
    status: "draft",
    content: `<p>Part of the PAL split into three toolkits.</p>
<p><em>Placeholder — content to be added.</em></p>`,
  },
  {
    slug: "events",
    title: "Events",
    status: "draft",
    content: `<p>TX*SPARK events bring neighbors together for practical, year-round civic action aligned with electoral and legislative calendars. From skill sharing to direct outreach, each event is designed to help local teams organize with confidence and care.</p>
<h2>What to expect</h2>
<ul>
<li><strong>Community meet-ups:</strong> connect with organizers, partners, and neighbors building local momentum.</li>
<li><strong>Canvasses and outreach:</strong> support direct voter and community engagement efforts with tools you can actually use in the field.</li>
<li><strong>Workshops:</strong> hands-on trainings and practical tools for teams doing grassroots work.</li>
</ul>
<p><em>Draft — the live Events page currently shows the organization calendar and mailing-list signup. Publish this page when you want editable content to replace it.</em></p>`,
  },
];

async function findBySlug(slug) {
  const res = await fetch(
    `${API}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=id&status=publish,draft`,
    { headers: { Accept: "application/json", Authorization: auth } }
  );
  if (!res.ok) throw new Error(`lookup failed (${res.status})`);
  const arr = await res.json();
  return arr[0]?.id ?? null;
}

async function upsert(page) {
  const existingId = await findBySlug(page.slug);

  if (existingId && !FORCE) {
    console.log(`skip   ${page.slug} — already exists (id ${existingId})`);
    return;
  }

  const url = existingId
    ? `${API}/wp-json/wp/v2/pages/${existingId}`
    : `${API}/wp-json/wp/v2/pages`;

  const res = await fetch(url, {
    method: "POST", // WP accepts POST for both create and update
    headers: { "Content-Type": "application/json", Authorization: auth },
    body: JSON.stringify({
      slug: page.slug,
      title: page.title,
      content: page.content,
      status: page.status || "publish",
    }),
  });

  if (!res.ok) {
    throw new Error(`write failed (${res.status}): ${await res.text()}`);
  }
  const body = await res.json();
  const verb = existingId ? "update" : "create";
  console.log(`${verb} ${page.slug} -> id ${body.id} (${page.status || "publish"})`);
}

let failures = 0;
for (const page of PAGES) {
  try {
    await upsert(page);
  } catch (e) {
    failures++;
    console.error(`ERROR  ${page.slug}: ${e.message}`);
  }
}
process.exit(failures ? 1 : 0);
