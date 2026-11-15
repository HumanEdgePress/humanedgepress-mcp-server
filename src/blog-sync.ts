/**
 * Dual Blog & Editorial Page Sync Engine for Human Edge Press
 *
 * Automatically indexes:
 *  1. Live Shopify Blog articles (`/blogs/<handle>/articles.json` across `news`, `journal`, `research`, `articles`)
 *  2. Live foundational editorial essays & research hubs hosted under `https://humanedgepress.com/pages/*`
 *
 * Security standard:
 *  - Uses `safeJsonFetch` and `safeHtmlFetch` from `./catalog-sync.js`
 *  - Strict HTTPS + `humanedgepress.com` host lock + 5s timeout + Content-Type checks
 */

import { isSafeAndSecureUrl, safeHtmlFetch, safeJsonFetch, stripHtmlToText } from "./catalog-sync.js";

export type TopicPillar =
  | "infant-vision-and-sensory"
  | "screen-free-early-childhood"
  | "socratic-homeschooling"
  | "early-steam"
  | "character-and-virtues"
  | "teen-attention-and-social-media"
  | "young-adults-and-ai"
  | "parent-tools-and-research"
  | "studio-previews";

export interface BlogOrEssayRecord {
  id: string;
  slug: string;
  sourceType: "shopify_blog" | "editorial_page" | "authority_guide";
  blogHandle?: string;
  title: string;
  url: string;
  author: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  topicPillar: TopicPillar;
  targetAgeGroup: string;
  summary: string;
  headings: string[];
  keyTakeaways: string[];
  scientificConcepts: string[];
  relatedBookHandles: string[];
  tags: string[];
  bodyMarkdown: string;
}

interface RawShopifyArticle {
  id: number;
  title: string;
  handle: string;
  author?: string;
  body_html?: string;
  summary_html?: string;
  tags?: string | string[];
  published_at?: string;
  updated_at?: string;
}

interface EditorialPageSpec {
  slug: string;
  urlPath: string;
  fallbackTitle: string;
  author: string;
  topicPillar: TopicPillar;
  targetAgeGroup: string;
  summary: string;
  keyTakeaways: string[];
  scientificConcepts: string[];
  relatedBookHandles: string[];
  tags: string[];
}

const EDITORIAL_PAGES_TO_SYNC: EditorialPageSpec[] = [
  {
    slug: "socratic-homeschooling",
    urlPath: "/pages/socratic-homeschooling",
    fallbackTitle: "Analog Roots First, Digital Wings Later: Why We Publish 100% Screen-Free Books for Ages 0–7",
    author: "Human Edge Press Editorial Team",
    topicPillar: "socratic-homeschooling",
    targetAgeGroup: "0-7 years (Parents & Homeschoolers)",
    summary:
      "Human Edge Press's foundational publishing philosophy explaining why physical pages, parent 'serve-and-return' dialogue, hands-on STEAM, and character virtues outperform digital apps during the first seven years of brain development.",
    keyTakeaways: [
      "Children ages 0–7 experience a documented 'Transfer Deficit' on 2D touchscreens—struggling to transfer digital lessons into 3D real-world understanding—whereas physical page-turning anchors spatial memory and executive attention.",
      "A parent's live voice, facial expressions, and Socratic questions ('Serve & Return') wire language and emotional regulation far more effectively than passive tap-to-hear tablet apps.",
      "Screen-free STEAM starts at the kitchen table with real objects (blocks, shadows, water, magnets, sorting) rather than early screen coding.",
      "Character virtues—curiosity, kindness, patience, bravery, honesty, focus, and persistence—are the true un-automatable 'Human Edge'.",
      "Pro-childhood, not anti-technology: anchor analog focus and curiosity before age 7 so children command digital tools with agency later."
    ],
    scientificConcepts: [
      "Transfer Deficit (2D screen vs. 3D physical learning)",
      "Serve & Return Caregiver-Child Interaction",
      "Spatial Memory of Physical Print Pages",
      "Socratic Questioning & Joint Attention",
      "Executive Function & Unhurried Focus"
    ],
    relatedBookHandles: [
      "master-screen-free-chest-bundle",
      "human-virtues-box-bundle",
      "steam-little-thinkers-bundle",
      "newborn-sensory-starter-bundle",
      "human-edge-curious",
      "s-is-for-science-steam-alphabet-board-book"
    ],
    tags: ["socratic-homeschooling", "screen-free", "ages-0-7", "transfer-deficit", "serve-and-return", "manifesto"]
  },
  {
    slug: "teen-social-media",
    urlPath: "/pages/teen-social-media",
    fallbackTitle: "The Cortical Thickness Crisis: Rebuilding Teen Focus in a Screen-Trapped World",
    author: "Dr. Johnathan Edge · Human Edge Press",
    topicPillar: "teen-attention-and-social-media",
    targetAgeGroup: "Teens (Ages 12–18) & Parents",
    summary:
      "Neurodevelopmental analysis of how variable-reward social media feeds hijack adolescent prefrontal plasticity, thin cortical control layers, and degrade focus stamina—paired with three practical family ground rules to rebuild deep attention.",
    keyTakeaways: [
      "Algorithmic feeds use variable reward schedules (infinite scroll, unpredictable notifications, social validation loops) to trigger rapid dopamine spikes while the teen prefrontal cortex is still highly plastic.",
      "Conditioning adolescents to expect novel stimulation every ~6 seconds erodes deep reading stamina and correlates in neuroimaging studies with cortical thinning in cognitive-control regions.",
      "Tactile real-world engagement (physical books, woodworking, handwriting, athletics, music) activates C-tactile afferent fibers and grounds nervous-system regulation.",
      "Strategic timing—protecting sleep, bedrooms, and long-form analog blocks—rebuilds sustained focus without requiring total technological isolation."
    ],
    scientificConcepts: [
      "Prefrontal Cortex Plasticity & Cortical Thickness",
      "Variable-Ratio Dopamine Reward Loops",
      "Focus Stamina Degradation (6-Second Stimulation Conditioning)",
      "C-Tactile Fiber Activation Through Physical Craft & Print"
    ],
    relatedBookHandles: ["human-edge-focused", "human-edge-patient", "human-edge-persistent", "human-edge-listening"],
    tags: ["teen-screen-time", "social-media", "cortical-thickness", "dopamine", "attention-stamina", "neuroscience"]
  },
  {
    slug: "young-adults-ai",
    urlPath: "/pages/young-adults-ai",
    fallbackTitle: "The Human Veto: Developing Un-Automatable Value in the Age of Commodity AI",
    author: "Human Edge Press Editorial Team",
    topicPillar: "young-adults-and-ai",
    targetAgeGroup: "Young Adults (Ages 16–25), Educators & Parents",
    summary:
      "Framework for thriving alongside generative AI by cultivating 'The Human Veto' (ethical & editorial judgment), a unique Specific Knowledge Stack, and refined personal taste that statistical models cannot synthesize.",
    keyTakeaways: [
      "As generative AI drives the marginal cost of average prose, code, and summaries toward zero, purely mechanical compliance ceases to be a career moat.",
      "'The Human Veto' is the capacity to evaluate, challenge, edit, or reject machine output using first-principles reasoning, domain truth, and moral accountability.",
      "Building a 'Specific Knowledge Stack'—combining deep reading, real-world craft, interpersonal empathy, and cross-disciplinary curiosity—creates un-automatable leverage.",
      "Reclaiming unstructured analog afternoons for deep books, synthesis, and physical creation sharpens original taste and independent voice."
    ],
    scientificConcepts: [
      "The Human Veto (Editorial & Moral Agency Over AI Output)",
      "Specific Knowledge Stack",
      "Taste & First-Principles Judgment vs. Statistical Averaging",
      "Deep Reading & Cognitive Synthesis"
    ],
    relatedBookHandles: [
      "human-edge-creative",
      "human-edge-curious",
      "human-edge-honest",
      "human-edge-brave",
      "t-is-for-technology-steam-alphabet-board-book"
    ],
    tags: ["ai-literacy", "young-adults", "the-human-veto", "critical-thinking", "future-of-work", "taste-and-judgment"]
  },
  {
    slug: "tools",
    urlPath: "/pages/tools",
    fallbackTitle: "Parent Hub & Science Tools: Top Screen-Free Parenting, Homeschool Resources & Research Vault",
    author: "Human Edge Press Editorial Team",
    topicPillar: "parent-tools-and-research",
    targetAgeGroup: "0-7 years (Parents, Co-ops & Educators)",
    summary:
      "Curated parent resource hub indexing vetted pediatric, developmental, and outdoor-learning organizations (Harvard Center on the Developing Child, 1000 Hours Outside, Reading Rockets, AAP HealthyChildren, Reach Out and Read) alongside the Human Edge Press Research Vault.",
    keyTakeaways: [
      "Families can build a rich, joyful early homeschool and read-aloud culture for ages 0–7 with zero paid educational apps.",
      "Combines Harvard 'Serve & Return' brain-architecture guidance, AAP early screen-time boundaries, dialogic reading practices, and daily outdoor play benchmarks.",
      "Connects developmental science directly to age-graded physical book selection across Newborn (0–2), Toddler STEAM (2–4), Pre-K (3–5), and Virtue Hardcovers (3–7)."
    ],
    scientificConcepts: [
      "Pediatric Screen-Time Guidelines (Ages 0–5)",
      "Dialogic Read-Aloud Comprehension",
      "Outdoor Sensory-Motor Balance",
      "Early Literacy & Phonemic Awareness"
    ],
    relatedBookHandles: [
      "master-screen-free-chest-bundle",
      "big-pre-k-learning-workbook",
      "newborn-sensory-starter-bundle",
      "steam-little-thinkers-bundle"
    ],
    tags: ["parent-tools", "research-vault", "homeschool-resources", "pediatric-science", "screen-free-parenting"]
  },
  {
    slug: "oddlings-workbooks",
    urlPath: "/pages/oddlings-workbooks",
    fallbackTitle: "Oddlings: Wonder in Action Workbooks (Ages 2–5 · In the Studio Preview)",
    author: "Human Edge Press Studio",
    topicPillar: "studio-previews",
    targetAgeGroup: "2-5 years",
    summary:
      "Inside look at Human Edge Press's upcoming 6-book series of 100% screen-free discovery workbooks (672 pages, 297 missions) guided by Tiko, Benny, and Cedric around LOOK • TRY • TALK • PLAY.",
    keyTakeaways: [
      "Replaces passive restaurant/travel tablet handoffs and repetitive worksheet drills with open-and-go parent-child discovery missions.",
      "Structured in two formats: 160-page Home Workbooks (72 missions) and 64-page Portable Travel Workbooks (27 missions) across ages 2–3, 3–4, and 4–5.",
      "Zero QR codes, zero companion apps—every spread triggers real-world observation, movement, and conversation."
    ],
    scientificConcepts: ["LOOK • TRY • TALK • PLAY Active Inquiry Cycle", "Embodied Toddler Attention"],
    relatedBookHandles: ["big-pre-k-learning-workbook", "steam-little-thinkers-bundle"],
    tags: ["oddlings", "workbooks", "ages-2-5", "travel-activities", "in-the-studio", "screen-free"]
  },
  {
    slug: "first-think-first-words",
    urlPath: "/pages/first-think-first-words",
    fallbackTitle: "First Think First Words Board Books (TK & Pre-K Ages 4–5 · In the Studio Preview)",
    author: "Human Edge Press Studio",
    topicPillar: "studio-previews",
    targetAgeGroup: "4-5 years (TK & Pre-K)",
    summary:
      "Preview of Human Edge Press's upcoming six-book vocabulary board book series teaching 67 concrete observable words (objects, verbs, opposites) inside full-context scenes with Page 19 Grown-Up Prompts.",
    keyTakeaways: [
      "Moves beyond isolated noun flashcards by embedding objects, action verbs, and opposites inside rich observable scenes.",
      "Uses the LOOK • POINT • COMPARE • SAY sequence to build relational thinking (Notice & Match, Count & Compare, Name & Sort, Observe & Classify).",
      "Every book closes with a dedicated Page 19 Grown-Up Vocabulary Prompt so parents know exactly what questions spark rich conversation."
    ],
    scientificConcepts: ["Contextual Vocabulary Acquisition", "Relational & Categorization Reasoning", "Dialogic Reading Prompts"],
    relatedBookHandles: ["big-pre-k-learning-workbook", "s-is-for-science-steam-alphabet-board-book", "m-is-for-math-steam-alphabet-board-book"],
    tags: ["first-think-first-words", "vocabulary", "pre-k", "tk", "ages-4-5", "in-the-studio"]
  },
  {
    slug: "human-edge-stories",
    urlPath: "/pages/human-edge-stories",
    fallbackTitle: "Human Edge Stories Picture Books (Ages 5–8 · Debut: The Bridge That Needed a New Plan)",
    author: "Human Edge Press Studio",
    topicPillar: "studio-previews",
    targetAgeGroup: "5-8 years",
    summary:
      "Preview of Human Edge Press's upcoming 32-page hardcover narrative picture book series for ages 5–8—featuring zero villains, zero sermons, active listening across perspectives, and hands-on physical problem-solving.",
    keyTakeaways: [
      "Grows naturally out of the Ages 3–7 Human Edge virtue series into longer 10\"×10\" read-aloud fiction.",
      "Debut Book 01 ('The Bridge That Needed a New Plan') models children holding two good engineering ideas together, testing visible cause-and-effect, and revising collaboratively.",
      "Designed to earn moral and practical insight through story tension rather than didactic lecturing."
    ],
    scientificConcepts: ["Collaborative Synthesis", "Perspective-Taking Without Villains", "Iterative Physical Prototyping"],
    relatedBookHandles: [
      "e-is-for-engineering-steam-alphabet-board-book",
      "human-edge-listening",
      "human-edge-persistent",
      "human-edge-creative"
    ],
    tags: ["human-edge-stories", "picture-books", "ages-5-8", "collaborative-problem-solving", "in-the-studio"]
  }
];

function extractMainHtmlAndHeadings(fullHtml: string): {
  pageTitle: string | null;
  headings: string[];
  markdown: string;
} {
  const titleMatch = fullHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawPageTitle = titleMatch ? stripHtmlToText(titleMatch[1]).replace(/\s*[–—|-]\s*Human Edge Press.*$/i, "").trim() : null;

  // Isolate <main> if present so nav/header/footer noise is excluded
  const mainMatch = fullHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const targetHtml = (mainMatch ? mainMatch[1] : fullHtml)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, " ");

  const headings: string[] = [];
  const headingRegex = /<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(targetHtml)) !== null) {
    const hText = stripHtmlToText(match[2]).trim();
    if (hText && hText.length > 2 && !headings.includes(hText)) {
      headings.push(hText);
    }
  }

  // Convert structural tags to clean Markdown
  const md = targetHtml
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_, inner) => `\n\n# ${stripHtmlToText(inner)}\n\n`)
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_, inner) => `\n\n## ${stripHtmlToText(inner)}\n\n`)
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_, inner) => `\n\n### ${stripHtmlToText(inner)}\n\n`)
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => `\n- ${stripHtmlToText(inner)}`)
    .replace(/<\/(p|div|section|article|blockquote)>/gi, "\n\n");

  const cleanedMd = stripHtmlToText(md)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    pageTitle: rawPageTitle || null,
    headings,
    markdown: cleanedMd
  };
}

function inferTopicPillarFromArticle(title: string, tags: string[], body: string): TopicPillar {
  const hay = `${title} ${tags.join(" ")} ${body}`.toLowerCase();
  if (hay.includes("high-contrast") || hay.includes("newborn") || hay.includes("optic") || hay.includes("infant")) {
    return "infant-vision-and-sensory";
  }
  if (hay.includes("socratic") || hay.includes("homeschool") || hay.includes("unit stud")) {
    return "socratic-homeschooling";
  }
  if (hay.includes("steam") || hay.includes("science") || hay.includes("engineering") || hay.includes("math")) {
    return "early-steam";
  }
  if (hay.includes("teen") || hay.includes("social media") || hay.includes("cortical") || hay.includes("dopamine")) {
    return "teen-attention-and-social-media";
  }
  if (hay.includes("human veto") || hay.includes("young adult") || hay.includes("artificial intelligence") || /\bai\b/.test(hay)) {
    return "young-adults-and-ai";
  }
  if (hay.includes("virtue") || hay.includes("character") || hay.includes("kindness") || hay.includes("brave") || hay.includes("patient")) {
    return "character-and-virtues";
  }
  return "screen-free-early-childhood";
}

export interface FetchLiveBlogsOptions {
  storeUrl?: string;
  blogHandles?: string[];
  onProgress?: (msg: string) => void;
}

export async function fetchLiveBlogsAndPages(options: FetchLiveBlogsOptions = {}): Promise<BlogOrEssayRecord[]> {
  const storeUrl = (options.storeUrl || "https://humanedgepress.com").replace(/\/+$/, "");
  const blogHandles = options.blogHandles || ["news", "journal", "research", "articles", "guides"];
  const log = options.onProgress || (() => {});

  const records: BlogOrEssayRecord[] = [];
  const seenUrls = new Set<string>();

  // 1. Sync published Shopify Blog articles across candidate blog handles
  for (const blogHandle of blogHandles) {
    const endpoint = `${storeUrl}/blogs/${blogHandle}/articles.json?limit=250`;
    if (!isSafeAndSecureUrl(endpoint)) continue;
    try {
      const payload = await safeJsonFetch<{ articles?: RawShopifyArticle[] }>(endpoint);
      const articles = Array.isArray(payload.articles) ? payload.articles : [];
      if (articles.length > 0) {
        log(`[BlogSync] Found ${articles.length} published Shopify blog article(s) in /blogs/${blogHandle}`);
      }
      for (const art of articles) {
        if (!art.published_at || !art.handle || !art.title) continue;
        const canonicalUrl = `${storeUrl}/blogs/${blogHandle}/${art.handle}`;
        if (seenUrls.has(canonicalUrl)) continue;
        seenUrls.add(canonicalUrl);

        const tags = Array.isArray(art.tags)
          ? art.tags.map((t) => String(t).trim()).filter(Boolean)
          : typeof art.tags === "string"
            ? art.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [];

        const parsed = extractMainHtmlAndHeadings(art.body_html || "");
        const summaryText = stripHtmlToText(art.summary_html || "") || parsed.markdown.split("\n\n")[0] || art.title;
        const wordCount = parsed.markdown.split(/\s+/).filter(Boolean).length;

        records.push({
          id: `blog:${art.handle}`,
          slug: art.handle,
          sourceType: "shopify_blog",
          blogHandle,
          title: art.title.trim(),
          url: canonicalUrl,
          author: art.author || "Human Edge Press Editorial Team",
          publishedAt: art.published_at,
          updatedAt: art.updated_at,
          readingTimeMinutes: Math.max(2, Math.round(wordCount / 200)),
          topicPillar: inferTopicPillarFromArticle(art.title, tags, parsed.markdown),
          targetAgeGroup: "Parents & Educators (Ages 0–8+)",
          summary: summaryText.slice(0, 420),
          headings: parsed.headings,
          keyTakeaways: parsed.headings.slice(0, 5),
          scientificConcepts: [],
          relatedBookHandles: ["master-screen-free-chest-bundle"],
          tags,
          bodyMarkdown: parsed.markdown
        });
      }
    } catch {
      // Non-existent blog handle returns 404 on Shopify; safely continue
    }
  }

  // 2. Sync live foundational editorial & research pages under /pages/*
  for (const spec of EDITORIAL_PAGES_TO_SYNC) {
    const pageUrl = `${storeUrl}${spec.urlPath}`;
    if (seenUrls.has(pageUrl)) continue;

    let liveTitle = spec.fallbackTitle;
    let liveHeadings: string[] = [];
    let liveMarkdown = "";
    let publishedAt: string | undefined;
    let updatedAt: string | undefined;

    // Try Shopify /pages/<slug>.json first
    try {
      const pageJson = await safeJsonFetch<{
        page?: { title?: string; body_html?: string; published_at?: string; updated_at?: string };
      }>(`${storeUrl}/pages/${spec.slug}.json`);
      if (pageJson.page) {
        publishedAt = pageJson.page.published_at;
        updatedAt = pageJson.page.updated_at;
        if (pageJson.page.body_html && stripHtmlToText(pageJson.page.body_html).length > 120) {
          const parsed = extractMainHtmlAndHeadings(pageJson.page.body_html);
          liveHeadings = parsed.headings;
          liveMarkdown = parsed.markdown;
        }
      }
    } catch {
      // Proceed to HTML extraction fallback for OS 2.0 section-rendered pages
    }

    if (liveMarkdown.length < 120) {
      try {
        log(`[BlogSync] Syncing editorial page ${pageUrl} ...`);
        const html = await safeHtmlFetch(pageUrl);
        const parsed = extractMainHtmlAndHeadings(html);
        if (parsed.headings[0] && parsed.headings[0].length > 12) {
          liveTitle = parsed.headings[0];
        } else if (parsed.pageTitle) {
          liveTitle = parsed.pageTitle;
        }
        liveHeadings = parsed.headings;
        liveMarkdown = parsed.markdown;
      } catch (err) {
        log(`[BlogSync] Warning: fallback to curated summary for ${pageUrl} (${err instanceof Error ? err.message : String(err)})`);
      }
    }

    if (!liveMarkdown || liveMarkdown.length < 80) {
      liveMarkdown = [
        `# ${spec.fallbackTitle}`,
        "",
        spec.summary,
        "",
        "## Key Takeaways",
        ...spec.keyTakeaways.map((k) => `- ${k}`)
      ].join("\n");
    }

    const wordCount = liveMarkdown.split(/\s+/).filter(Boolean).length;
    seenUrls.add(pageUrl);

    records.push({
      id: `page:${spec.slug}`,
      slug: spec.slug,
      sourceType: "editorial_page",
      title: liveTitle,
      url: pageUrl,
      author: spec.author,
      publishedAt,
      updatedAt,
      readingTimeMinutes: Math.max(3, Math.round(wordCount / 200)),
      topicPillar: spec.topicPillar,
      targetAgeGroup: spec.targetAgeGroup,
      summary: spec.summary,
      headings: liveHeadings.length > 0 ? liveHeadings : spec.keyTakeaways.slice(0, 4),
      keyTakeaways: spec.keyTakeaways,
      scientificConcepts: spec.scientificConcepts,
      relatedBookHandles: spec.relatedBookHandles,
      tags: spec.tags,
      bodyMarkdown: liveMarkdown
    });
  }

  return records;
}
