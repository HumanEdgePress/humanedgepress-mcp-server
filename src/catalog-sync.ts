/**
 * Shared Shopify Book Catalog Sync & Pedagogical Enrichment Engine
 *
 * Used both at runtime inside `src/index.ts` (for zero-touch background live catalog sync)
 * and at build/CI time via `scripts/sync-store-data.js`.
 *
 * Security standard:
 *  - Mandatory HTTPS enforcement (`isSafeAndSecureUrl`)
 *  - Domain & TLD blocklist + no raw IP/localhost
 *  - Host lock strictly restricted to `humanedgepress.com` / `www.humanedgepress.com`
 *  - Strict 5-second timeout (`AbortSignal.timeout(5000)`)
 *  - Redirects blocked (`redirect: "error"`)
 *  - Strict `application/json` / `text/html` Content-Type verification
 */

export interface BookVariant {
  id: number;
  title: string;
  price: number;
  priceFormatted: string;
  available: boolean;
  sku?: string | null;
  imageUrl?: string | null;
  checkoutUrl: string;
}

export interface BookPedagogy {
  summary: string;
  developmentalGoal: string;
  characterDuo?: string | null;
  virtueOrPillar?: string | null;
  parentPrompts: string[];
  physicalSpecs: string;
}

export interface BookProduct {
  id: number;
  title: string;
  handle: string;
  url: string;
  productType: string;
  series: string;
  ageStage: string;
  stageNumber: number;
  skillsAndVirtues: string[];
  occasions: string[];
  minPrice: number;
  maxPrice: number;
  priceFormatted: string;
  author: string;
  vendor: string;
  tags: string[];
  publishedAt?: string;
  createdAt?: string;
  featuredImage?: string | null;
  images: string[];
  variants: BookVariant[];
  pedagogy: BookPedagogy;
  rawBody: string;
}

export interface StudioPreviewLine {
  id: string;
  title: string;
  seriesSlug: string;
  url: string;
  ageStage: string;
  formatSummary: string;
  methodology: string;
  upcomingTitles: string[];
  summary: string;
  status: "in_the_studio";
}

export interface BookCollection {
  id: number;
  title: string;
  handle: string;
  url: string;
  ageStage: string;
  description: string;
  productsCount: number;
  productHandles: string[];
  imageUrl?: string | null;
  publishedAt?: string;
  updatedAt?: string;
}

export interface PressInfo {
  pressName: string;
  legalName: string;
  storeUrl: string;
  shopifyUcpEndpoint: string;
  tagline: string;
  manifestoTitle: string;
  mission: string;
  location: string;
  supportEmail: string;
  coreBeliefs: {
    title: string;
    concept: string;
    summary: string;
  }[];
  policies: {
    shipping: {
      processingTime: string;
      transitTime: string;
      flatRateUnderThreshold: string;
      freeShippingThreshold: string;
      details: string;
    };
    returns: {
      guaranteeName: string;
      windowDays: number;
      returnShippingCost: string;
      refundSpeed: string;
      eligibility: string;
    };
    wholesaleAndSchools: string;
  };
  ageStageRoadmap: Record<
    string,
    {
      stageLabel: string;
      ages: string;
      format: string;
      developmentalFocus: string;
      recommendedSeries: string[];
    }
  >;
}

export interface CatalogSnapshot {
  books: BookProduct[];
  studioLines: StudioPreviewLine[];
  collections: BookCollection[];
  pressInfo: PressInfo;
  syncedAt: string;
}

// ---------------------------------------------------------------------------
// 1. Pre-Flight Security Sanitizer & Safe Network Fetchers
// ---------------------------------------------------------------------------

export function isSafeAndSecureUrl(urlStr: string): string | null {
  if (!urlStr || typeof urlStr !== "string") return null;
  try {
    let clean = urlStr.trim();
    if (clean.startsWith("http://")) {
      clean = clean.replace("http://", "https://");
    }
    const parsed = new URL(clean);
    if (parsed.protocol !== "https:") return null;

    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || /^(\d{1,3}\.){3}\d{1,3}$/.test(host) || host.includes(":")) return null;
    if (/\.(xyz|top|work|click|link|cc|to|gq|cf|tk|ml|zip|exe|apk)$/i.test(host)) return null;

    const blacklist = ["stlcatholic.org"];
    if (blacklist.some((b) => host.includes(b))) return null;

    return parsed.toString();
  } catch {
    return null;
  }
}

export const ALLOWED_SYNC_HOSTS = new Set(["humanedgepress.com", "www.humanedgepress.com"]);

export async function safeJsonFetch<T = unknown>(urlStr: string): Promise<T> {
  const secureUrl = isSafeAndSecureUrl(urlStr);
  if (!secureUrl) {
    throw new Error(`Insecure or blocked URL rejected: ${urlStr}`);
  }
  const host = new URL(secureUrl).hostname.toLowerCase();
  if (!ALLOWED_SYNC_HOSTS.has(host)) {
    throw new Error(
      `Zero-cost host lock: outbound requests are strictly restricted to humanedgepress.com (rejected ${host})`
    );
  }

  let lastErr: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(secureUrl, {
        signal: AbortSignal.timeout(5000),
        redirect: "error",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; HumanEdgePressMCPSync/1.0; +https://humanedgepress.com)",
          Accept: "application/json"
        }
      });

      if (!res.ok) {
        if (res.status >= 500 && attempt < 2) {
          await new Promise((r) => setTimeout(r, 400));
          continue;
        }
        throw new Error(`HTTP error ${res.status} (${res.statusText}) fetching ${secureUrl}`);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      if (!contentType.includes("application/json")) {
        throw new Error(`Unexpected Content-Type '${contentType}' (expected application/json) from ${secureUrl}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      lastErr = err;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export async function safeHtmlFetch(urlStr: string): Promise<string> {
  const secureUrl = isSafeAndSecureUrl(urlStr);
  if (!secureUrl) {
    throw new Error(`Insecure or blocked URL rejected: ${urlStr}`);
  }
  const host = new URL(secureUrl).hostname.toLowerCase();
  if (!ALLOWED_SYNC_HOSTS.has(host)) {
    throw new Error(
      `Zero-cost host lock: outbound requests are strictly restricted to humanedgepress.com (rejected ${host})`
    );
  }

  let lastErr: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(secureUrl, {
        signal: AbortSignal.timeout(5000),
        redirect: "error",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; HumanEdgePressMCPSync/1.0; +https://humanedgepress.com)",
          Accept: "text/html,application/xhtml+xml"
        }
      });

      if (!res.ok) {
        if (res.status >= 500 && attempt < 2) {
          await new Promise((r) => setTimeout(r, 400));
          continue;
        }
        throw new Error(`HTTP error ${res.status} (${res.statusText}) fetching ${secureUrl}`);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();
      if (!contentType.includes("text/html")) {
        throw new Error(`Unexpected Content-Type '${contentType}' (expected text/html) from ${secureUrl}`);
      }

      return await res.text();
    } catch (err) {
      lastErr = err;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

// ---------------------------------------------------------------------------
// 2. HTML Sanitizing & Pedagogical Metadata Enrichment
// ---------------------------------------------------------------------------

export function stripHtmlToText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|section|article|tr)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&bull;/gi, "•")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

interface CuratedBookEnrichment {
  virtueOrPillar: string;
  characterDuo?: string;
  author?: string;
  developmentalGoal: string;
  parentPrompts: string[];
  skillsAndVirtues: string[];
  occasions: string[];
}

const CURATED_BOOK_METADATA: Record<string, CuratedBookEnrichment> = {
  // Stage 1: High-Contrast Baby Board Books (Ages 0-2)
  "baby-faces-high-contrast-board-book": {
    virtueOrPillar: "Facial Recognition & Early Emotional Connection",
    developmentalGoal:
      "Supports newborn retinal and optic-nerve focus (0–6+ months) while introducing facial expressions, eye contact, serve-and-return imitation, and early emotion vocabulary.",
    parentPrompts: [
      "Copy the face on the page together—smile wide, look surprised, or make a calm sleepy face and pause 5 seconds for your baby to respond.",
      "Hold the page 8 to 12 inches from your newborn's eyes and watch which expression holds their gaze the longest.",
      "For older infants (9–18 months), name the feeling aloud: 'Look at those wide eyes—he looks surprised! Can we make a surprised face?'"
    ],
    skillsAndVirtues: ["visual-tracking", "facial-recognition", "serve-and-return", "emotional-vocabulary", "eye-contact"],
    occasions: ["Baby Shower & Newborn Registry", "Tummy Time & First Months", "First Birthday"]
  },
  "animal-friends-high-contrast-board-book": {
    virtueOrPillar: "Visual Contrast & Early Animal Sound Imitation",
    developmentalGoal:
      "Strengthens infant figure-ground visual discrimination with bold black-and-white animal silhouettes while encouraging early vocalization and sound play.",
    parentPrompts: [
      "Trace the bold outline of the animal slowly with your finger while making its sound and waiting for your baby to babble back.",
      "Prop the board book upright during tummy time to encourage neck lift and steady visual fixation.",
      "Ask toddlers (12–24 months): 'Where are the ears? Which animal makes a big sound and which one makes a quiet sound?'"
    ],
    skillsAndVirtues: ["visual-tracking", "tummy-time", "early-speech", "animal-recognition", "sensory-focus"],
    occasions: ["Baby Shower & Newborn Registry", "Tummy Time & First Months", "First Birthday"]
  },
  "big-machines-high-contrast-board-book": {
    virtueOrPillar: "Spatial Motion, Shapes & Mechanical Curiosity",
    developmentalGoal:
      "Builds early geometric shape recognition (wheels, scoops, wings, tracks) and cause-and-effect curiosity through crisp high-contrast vehicle illustrations.",
    parentPrompts: [
      "Count the bold round wheels on the page while tapping each one gently with your child's finger.",
      "Pair reading with real-world motion: roll a wooden car or lift a block like an excavator scoop to connect print to physical play.",
      "Ask young toddlers: 'What job does this big machine help people do?'"
    ],
    skillsAndVirtues: ["visual-tracking", "shape-recognition", "cause-and-effect", "spatial-awareness", "early-motor"],
    occasions: ["Baby Shower & Newborn Registry", "First Birthday", "Toddler Travel & Quiet Time"]
  },
  "our-world-high-contrast-board-book": {
    virtueOrPillar: "Nature Observation & Everyday Environment",
    developmentalGoal:
      "Anchors infants and young toddlers to natural forms—sun, trees, clouds, water, and home objects—bridging high-contrast page focus to outdoor observation.",
    parentPrompts: [
      "Carry the book outside or near a window and match one bold shape on the page (like a leaf or tree) to the real thing.",
      "Pause on each spread for unhurried looking rather than rushing—let your baby's eyes lead when it's time to turn the page.",
      "Ask: 'What do we see up in the sky today, and what do we feel under our feet?'"
    ],
    skillsAndVirtues: ["visual-tracking", "nature-study", "joint-attention", "vocabulary-building", "calm-focus"],
    occasions: ["Baby Shower & Newborn Registry", "First Birthday", "Screen-Free Nature Play"]
  },
  "little-hands-high-contrast-board-book": {
    virtueOrPillar: "Fine Motor Reach, Grasp & Body Awareness",
    developmentalGoal:
      "Celebrates grasping, clapping, waving, and page-turning to connect visual tracking with sensorimotor hand-eye coordination.",
    parentPrompts: [
      "Gently touch each of your baby's fingers as you look at the hands on the spread—waving, opening wide, and clapping slowly.",
      "Invite older babies (6–18 months) to help turn the thick board pages themselves to build pincer grip and agency.",
      "Ask: 'What can our two little hands build, hold, or wave hello to right now?'"
    ],
    skillsAndVirtues: ["fine-motor", "hand-eye-coordination", "visual-tracking", "body-awareness", "tactile-learning"],
    occasions: ["Baby Shower & Newborn Registry", "Tummy Time & First Months", "First Birthday"]
  },
  "smart-future-high-contrast-baby-book": {
    virtueOrPillar: "Curiosity, Patterns & Early Symbolic Thinking",
    developmentalGoal:
      "Introduces bold patterns, symmetries, and discovery motifs that stimulate early visual cortex pathways without flashing screens or noisy batteries.",
    parentPrompts: [
      "Notice which pattern—stripes, circles, or stars—draws your baby's eyes first and describe what they're looking at in a warm, steady voice.",
      "Compare two spreads side-by-side: 'Look how these lines curve like waves, and these corners stand sharp and straight.'",
      "Use as a calm pre-nap wind-down ritual where quiet black-and-white focus replaces overstimulation."
    ],
    skillsAndVirtues: ["pattern-recognition", "visual-tracking", "cognitive-focus", "calm-routines", "early-stem"],
    occasions: ["Baby Shower & Newborn Registry", "New Parent Gift", "First Birthday"]
  },

  // Stage 2: STEAM Alphabet Board Books (Ages 2-4)
  "s-is-for-science-steam-alphabet-board-book": {
    virtueOrPillar: "Science — Observation, Hypothesis & Everyday Wonder",
    author: "Ethan Finch",
    developmentalGoal:
      "Translates A-to-Z scientific concepts into tangible toddler observations—shadows, magnets, seeds, water, and magnification—cultivating Socratic curiosity before formal schooling.",
    parentPrompts: [
      "Pick one letter on today's spread and test it at the kitchen table—what sinks, what floats, or where does a shadow stretch?",
      "Ask 'What do you notice?' before explaining how something works, giving your toddler space to form their own guess first.",
      "Ask: 'If we changed one thing—made it wetter, heavier, or brighter—what do you think would happen next?'"
    ],
    skillsAndVirtues: ["science", "steam", "observation", "socratic-inquiry", "alphabet-literacy", "curiosity"],
    occasions: ["2nd–4th Birthday", "Preschool & Homeschool Starter", "Holiday Educational Gift"]
  },
  "t-is-for-technology-steam-alphabet-board-book": {
    virtueOrPillar: "Technology — Human Tools, Simple Machines & Invention",
    author: "Ethan Finch",
    developmentalGoal:
      "Reframes 'technology' for ages 2–4 where it truly begins: human-made tools like wheels, levers, hinges, gears, compasses, and lenses—showing kids that humans invent and direct tools, not the other way around.",
    parentPrompts: [
      "Go on a 3-minute 'tool hunt' around the house to spot hinges on doors, wheels on strollers, or spoons acting as levers.",
      "Ask: 'What problem did someone want to solve when they built this tool?'",
      "Ask: 'How does using our own hands with this tool feel different from just watching a picture move?'"
    ],
    skillsAndVirtues: ["technology", "steam", "simple-machines", "tool-literacy", "problem-solving", "alphabet-literacy"],
    occasions: ["2nd–4th Birthday", "Preschool & Homeschool Starter", "Screen-Free STEM Gift"]
  },
  "e-is-for-engineering-steam-alphabet-board-book": {
    virtueOrPillar: "Engineering — Bridges, Balance, Structures & Iteration",
    author: "Ethan Finch",
    developmentalGoal:
      "Introduces structural thinking—arches, foundations, joints, balance, and testing—encouraging toddlers to build, topple, and revise with wooden blocks and everyday materials.",
    parentPrompts: [
      "After reading a spread, grab 6 blocks or cups and try building a wide base vs. a narrow base—which tower stands taller?",
      "When a block bridge falls, celebrate like an engineer: 'Aha! Now we see where it wobbled—how should we change our plan?'",
      "Ask: 'What holds up the roof over our heads or the bridge we drove across today?'"
    ],
    skillsAndVirtues: ["engineering", "steam", "spatial-reasoning", "resilience", "hands-on-building", "alphabet-literacy"],
    occasions: ["2nd–4th Birthday", "Preschool & Homeschool Starter", "Little Builders Gift"]
  },
  "a-is-for-art-steam-alphabet-board-book": {
    virtueOrPillar: "Art — Color, Texture, Line, Rhythm & Human Expression",
    author: "Ethan Finch",
    developmentalGoal:
      "Connects A-to-Z artistic elements—brushstrokes, clay, collage, symmetry, perspective, and negative space—nurturing original human taste and tactile creativity.",
    parentPrompts: [
      "Look closely at the colors and shapes on one spread: 'Does this page feel fast and bouncy, or quiet and slow?'",
      "Pair with crayons, torn paper, or playdough so your child can try one texture or line style right after reading.",
      "Ask: 'If you painted how today felt outside, which three colors would you choose first?'"
    ],
    skillsAndVirtues: ["art", "steam", "creativity", "visual-literacy", "fine-motor", "aesthetic-taste"],
    occasions: ["2nd–4th Birthday", "Creative Toddler Gift", "Preschool & Homeschool Starter"]
  },
  "m-is-for-math-steam-alphabet-board-book": {
    virtueOrPillar: "Math — Counting, Patterns, Symmetry, Measurement & Comparison",
    author: "Ethan Finch",
    developmentalGoal:
      "Grounds early numeracy in concrete, touchable relationships—more vs. fewer, halves, sorting, spirals, and measurement—building number sense without rote drill apps.",
    parentPrompts: [
      "Count real snacks, pinecones, or socks alongside the page to match one-to-one correspondence with fingers.",
      "Ask comparison questions at mealtime: 'Which plate has more berries? How could we share them equally?'",
      "Spot repeating patterns together (red-blue-red-blue or clap-tap-clap-tap): 'What comes next in our pattern?'"
    ],
    skillsAndVirtues: ["math", "steam", "number-sense", "pattern-recognition", "sorting-and-logic", "alphabet-literacy"],
    occasions: ["2nd–4th Birthday", "Preschool & Homeschool Starter", "Pre-K Readiness Gift"]
  },

  // Stage 3: The Human Edge Series — 12 Hardcover Virtue Storybooks (Ages 3-7)
  "human-edge-curious": {
    virtueOrPillar: "Curiosity",
    characterDuo: "Maya & Fox",
    developmentalGoal:
      "Follows Maya & Fox in the garden as they slow down to ask 'Why?' and investigate hidden details—teaching children that genuine wonder is the spark of lifelong learning.",
    parentPrompts: [
      "What tiny detail in the garden caught Maya and Fox's attention when they slowed down?",
      "What is one thing you saw outside this week that made you wonder 'How does that work?'",
      "If we went exploring in our yard or neighborhood tomorrow with no rush, what would you look closely at first?"
    ],
    skillsAndVirtues: ["curious", "curiosity", "wonder", "observation", "socratic-inquiry", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Character & SEL Library", "Homeschool Read-Aloud"]
  },
  "human-edge-creative": {
    virtueOrPillar: "Creativity",
    characterDuo: "Ruby & Octopus",
    developmentalGoal:
      "Joins Ruby & Octopus in the studio as an unexpected spill or limitation turns into an original invention—building divergent thinking and creative confidence.",
    parentPrompts: [
      "How did Ruby and Octopus turn something that didn't go as planned into a brand-new idea?",
      "Have you ever made something out of cardboard, blocks, or drawings that surprised you?",
      "What could we build or invent together using only three everyday things in this room?"
    ],
    skillsAndVirtues: ["creative", "creativity", "imagination", "adaptability", "divergent-thinking", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Character & SEL Library", "Young Makers & Artists"]
  },
  "human-edge-focused": {
    virtueOrPillar: "Focus & Deep Attention",
    characterDuo: "Amir & Owl",
    developmentalGoal:
      "Follows Amir & Owl in the woodshop practicing single-tasked, unhurried craftsmanship—helping children experience the calm pride of sustained attention in a distracted world.",
    parentPrompts: [
      "What helped Amir and Owl stay steady when distractions popped up around the woodshop?",
      "How does your body feel when you work carefully on one puzzle, drawing, or Lego build until it's done?",
      "What is one project we can clear the table for and give our whole attention to tomorrow?"
    ],
    skillsAndVirtues: ["focused", "focus", "deep-attention", "executive-function", "craftsmanship", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Kindergarten Readiness", "Screen-Free Focus Habit"]
  },
  "human-edge-kind": {
    virtueOrPillar: "Kindness",
    characterDuo: "Caleb & Retriever",
    developmentalGoal:
      "Joins Caleb & Retriever on the playground as Caleb notices a new classmate sitting alone and makes room with sidewalk chalk—showing that noticing someone before they ask is a uniquely human gift.",
    parentPrompts: [
      "Who did Caleb notice on the playground, and what small thing did he do first?",
      "How do you think the new classmate felt when Caleb made space and shared the chalk?",
      "Who could we notice and make room for at school, church, or the park tomorrow?"
    ],
    skillsAndVirtues: ["kind", "kindness", "generosity", "inclusion", "social-awareness", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Back to School & Classroom Gift", "Character & SEL Library"]
  },
  "human-edge-empathetic": {
    virtueOrPillar: "Empathy",
    characterDuo: "Sofia & Elephant",
    developmentalGoal:
      "Walks with Sofia & Elephant by the stream as they sit quietly beside a friend having a heavy day—teaching perspective-taking and emotional presence rather than rushing to fix feelings.",
    parentPrompts: [
      "How could Sofia and Elephant tell how their friend was feeling even before any words were spoken?",
      "When you feel sad or overwhelmed, what helps you feel understood and cared for?",
      "How can we check in on someone we love when they seem quiet or left out?"
    ],
    skillsAndVirtues: ["empathetic", "empathy", "emotional-intelligence", "compassion", "perspective-taking", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Sibling & Friendship Transitions", "Character & SEL Library"]
  },
  "human-edge-thankful": {
    virtueOrPillar: "Gratitude",
    characterDuo: "Priya & Firefly",
    developmentalGoal:
      "Sits with Priya & Firefly on the evening porch noticing ordinary gifts—warm bread, firefly light, helping hands—cultivating grounded gratitude over constant wanting.",
    parentPrompts: [
      "What small everyday things did Priya and Firefly notice once the evening grew quiet?",
      "Who did something helpful for our family today that we might have rushed past?",
      "What are three simple things from today—a sound, a taste, or a moment—that you're glad happened?"
    ],
    skillsAndVirtues: ["thankful", "gratitude", "mindfulness", "contentment", "appreciation", "character-virtue"],
    occasions: ["Thanksgiving & Holiday Gift", "Bedtime Read-Aloud", "Ages 3–7 Birthday"]
  },
  "human-edge-brave": {
    virtueOrPillar: "Bravery & Courage",
    characterDuo: "Zuri & Robin",
    developmentalGoal:
      "Follows Zuri & Robin in the meadow taking one honest first step despite nervous butterflies—teaching kids that bravery isn't having zero fear, it's stepping forward alongside it.",
    parentPrompts: [
      "Did Zuri wait until she wasn't nervous anymore, or did she take a small step while still feeling butterflies?",
      "Can you remember a time something felt scary at first—like a new class, pool, or dark room—and you tried anyway?",
      "What is one 'small brave step' you'd like to try this week with me cheering you on?"
    ],
    skillsAndVirtues: ["brave", "bravery", "courage", "confidence", "trying-new-things", "character-virtue"],
    occasions: ["First Day of Preschool / Kindergarten", "Ages 3–7 Birthday", "Overcoming Fears"]
  },
  "human-edge-persistent": {
    virtueOrPillar: "Persistence & Grit",
    characterDuo: "Theo & Beaver",
    developmentalGoal:
      "Follows Theo & Beaver on the riverbank rebuilding after rising water washes away their first try—building frustration tolerance, growth mindset, and resilient problem-solving.",
    parentPrompts: [
      "What did Theo and Beaver do right after their first build came apart—did they quit right away or pause and look?",
      "What is something you can do easily now (like pedaling, zipping a coat, or drawing) that used to feel super hard?",
      "Next time a tower falls or a puzzle gets tricky, what can we say to ourselves before trying one new angle?"
    ],
    skillsAndVirtues: ["persistent", "persistence", "resilience", "grit", "frustration-tolerance", "growth-mindset", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Learning New Skills", "Character & SEL Library"]
  },
  "human-edge-patient": {
    virtueOrPillar: "Patience",
    characterDuo: "Kenji & Turtle",
    developmentalGoal:
      "Joins Kenji & Turtle in the garden discovering that seeds, bread dough, and good things grow on steady natural timelines—counteracting instant-click digital impatience.",
    parentPrompts: [
      "What happened when Kenji wanted the garden to hurry up, and what did Turtle help him notice while waiting?",
      "What are some wonderful things in real life that can't be rushed with a button—like seeds sprouting or cookies baking?",
      "When waiting in a line or waiting for a turn feels long, what calm game or observation can we do together?"
    ],
    skillsAndVirtues: ["patient", "patience", "delayed-gratification", "self-regulation", "calmness", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Emotional Regulation Support", "Screen-Free Parenting"]
  },
  "human-edge-honest": {
    virtueOrPillar: "Honesty & Integrity",
    characterDuo: "Mateo & Deer",
    developmentalGoal:
      "Walks with Mateo & Deer on the forest trail when telling the truth after a mistake feels hard—showing children how honesty repairs trust and lightens a heavy heart.",
    parentPrompts: [
      "Why did Mateo feel a knot in his stomach before speaking up, and how did he feel afterward?",
      "Why do people trust each other even more when someone tells the truth about an accident?",
      "How can our family always make it safe to say, 'I made a mistake, can we fix it together?'"
    ],
    skillsAndVirtues: ["honest", "honesty", "integrity", "trust", "accountability", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Family Values Read-Aloud", "Character & SEL Library"]
  },
  "human-edge-helpful": {
    virtueOrPillar: "Helpfulness & Stewardship",
    characterDuo: "Amina & Dolphin",
    developmentalGoal:
      "Follows Amina & Dolphin at the beach pitching in with real responsibility—nurturing joyful contribution at home and in the community.",
    parentPrompts: [
      "How did Amina and Dolphin spot a way to help before anyone assigned them a chore?",
      "How does it feel when everyone pitches in together to carry, clean, or build something big?",
      "What is one real family job you'd love to be in charge of helping with this week?"
    ],
    skillsAndVirtues: ["helpful", "helpfulness", "responsibility", "teamwork", "service", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Big Brother / Big Sister Gift", "Homeschool & Family Culture"]
  },
  "human-edge-listening": {
    virtueOrPillar: "Active Listening",
    characterDuo: "Amara & Rabbit",
    developmentalGoal:
      "Climbs up with Amara & Rabbit into the treehouse to discover what you hear when you stop interrupting and truly listen—to friends, stories, and nature.",
    parentPrompts: [
      "What clue did Amara miss at first when she was rushing to talk, and what changed when she listened like Rabbit?",
      "What is the difference between waiting for your turn to talk and really listening to understand someone's idea?",
      "Let's close our eyes for 20 seconds right now—how many quiet sounds can we hear inside and outside?"
    ],
    skillsAndVirtues: ["listening", "active-listening", "communication", "attention", "respect", "character-virtue"],
    occasions: ["Ages 3–7 Birthday", "Preschool & Kindergarten Readiness", "Character & SEL Library"]
  },

  // Activity Workbook & Curated Bundles
  "big-pre-k-learning-workbook": {
    virtueOrPillar: "Pre-K Pencil Control, Logic, Phonics & Early Math",
    developmentalGoal:
      "Builds hand strength, pencil grip, letter/number formation, visual matching, and logical sequencing on real paper—developing C-tactile and sensorimotor pathways that tablet tracing cannot replicate.",
    parentPrompts: [
      "Keep workbook sessions short, upbeat, and child-led (10–15 minutes at the kitchen table with real crayons or pencils).",
      "Ask your child to talk through their thinking: 'How did you figure out which path goes through the maze?'",
      "Connect a page to physical play afterward—trace letters in sand, count real spoons, or spot shapes on a walk."
    ],
    skillsAndVirtues: ["pre-k", "fine-motor", "pencil-grip", "early-literacy", "number-sense", "logic-puzzles"],
    occasions: ["Preschool & TK Readiness", "Road Trips & Flights", "Screen-Free Quiet Time"]
  },
  "newborn-sensory-starter-bundle": {
    virtueOrPillar: "Complete Newborn Visual & Serve-and-Return Starter Set",
    developmentalGoal:
      "Curated 3-book high-contrast board book box set designed for months 0–24—supporting optic nerve maturation, tummy time endurance, facial imitation, and early parent-baby bonding.",
    parentPrompts: [
      "Keep one book by the changing pad, one on the tummy-time mat, and one in the diaper bag for calm screen-free moments anywhere.",
      "Rotate titles weekly and follow your baby's gaze—pause whenever they lock onto a bold face or animal silhouette.",
      "Qualifies automatically for Free US Standard Shipping."
    ],
    skillsAndVirtues: ["visual-tracking", "tummy-time", "baby-bonding", "serve-and-return", "sensory-development"],
    occasions: ["Baby Shower & Newborn Registry", "Welcome Home Baby Gift", "Grandparent Gift"]
  },
  "steam-little-thinkers-bundle": {
    virtueOrPillar: "Early STEAM Inquiry Starter Box Set",
    author: "Ethan Finch",
    developmentalGoal:
      "Curated 3-book STEAM Alphabet board book set introducing toddlers (ages 2–4) to hands-on scientific observation, simple tools, engineering structures, and everyday math.",
    parentPrompts: [
      "Pair one spread per afternoon with a 5-minute kitchen or backyard experiment—magnets, blocks, shadows, or sorting.",
      "Practice asking 'What do you notice?' and 'What do you think will happen if...?'",
      "Qualifies automatically for Free US Standard Shipping."
    ],
    skillsAndVirtues: ["steam", "science", "engineering", "math", "socratic-inquiry", "alphabet-literacy"],
    occasions: ["2nd–4th Birthday", "Toddler Gift Box", "Homeschool & Montessori Shelf"]
  },
  "human-virtues-box-bundle": {
    virtueOrPillar: "Core Character & Social-Emotional Hardcover Box Set",
    developmentalGoal:
      "Curated 5-book hardcover collection from The Human Edge Series (ages 3–7) pairing memorable child-and-animal stories with built-in parent Socratic conversation prompts.",
    parentPrompts: [
      "Focus on one virtue story each week at bedtime and revisit its 3 parent conversation prompts around the dinner table.",
      "Notice and name the virtue in real life when your child practices bravery, kindness, focus, curiosity, or creativity.",
      "Qualifies automatically for Free US Standard Shipping."
    ],
    skillsAndVirtues: ["character-virtue", "kindness", "bravery", "curiosity", "creativity", "focus", "emotional-intelligence"],
    occasions: ["Ages 3–7 Birthday", "Holiday Family Gift", "Classroom & Homeschool Library"]
  },
  "master-screen-free-chest-bundle": {
    virtueOrPillar: "Complete Birth-to-Age-7 Developmental Home Library (23 Books)",
    developmentalGoal:
      "Flagship collector's library spanning all three developmental stages (High-Contrast Baby 0–2, STEAM Alphabet 2–4, and Human Edge Hardcover Virtues 3–7)—anchoring an entire early childhood in physical print.",
    parentPrompts: [
      "Grows seamlessly with one child from newborn tummy time through age 7—or serves siblings across baby, toddler, and early elementary stages simultaneously.",
      "Save significantly compared to individual titles while unlocking Free US Shipping and the 30-Day Family Guarantee.",
      "Ideal centerpiece gift from grandparents, homeschool co-ops, or family registries."
    ],
    skillsAndVirtues: [
      "complete-library",
      "visual-tracking",
      "steam",
      "character-virtue",
      "socratic-inquiry",
      "screen-free-home"
    ],
    occasions: ["Heirloom Family & Grandparent Gift", "Complete Homeschool Library", "Multi-Sibling Bundle", "Baby Registry Group Gift"]
  }
};

export const STUDIO_PREVIEW_LINES: StudioPreviewLine[] = [
  {
    id: "oddlings-workbooks",
    title: "Oddlings: Wonder in Action Workbooks",
    seriesSlug: "oddlings-workbooks",
    url: "https://humanedgepress.com/pages/oddlings-workbooks",
    ageStage: "2-5 years (Ages 2–3, 3–4 & 4–5)",
    formatSummary:
      "6 screen-free print workbooks across 672 total pages (160-page Home Workbooks & 64-page Portable Travel Workbooks) with 297 open-and-go missions",
    methodology:
      "Guided by plush-textured companions Tiko, Benny, and Cedric around shared LOOK • TRY • TALK • PLAY discovery missions—zero apps, zero QR codes, zero busywork drills.",
    upcomingTitles: [
      "My Day and My World",
      "Little Trips and Tiny Finds",
      "Patterns Around Us",
      "Make and Notice",
      "Questions and Choices",
      "Ready to Explore"
    ],
    summary:
      "Upcoming six-book line of tactile home and travel discovery workbooks for ages 2–5 turning table time, restaurants, and road trips into parent-child observation missions.",
    status: "in_the_studio"
  },
  {
    id: "first-think-first-words",
    title: "First Think First Words Board Books",
    seriesSlug: "first-think-first-words",
    url: "https://humanedgepress.com/pages/first-think-first-words",
    ageStage: "4-5 years (TK & Pre-K)",
    formatSummary:
      "6 square 6\"×6\" illustrated board books (20 pages each, 67 concrete observable words across objects, verbs & opposites) with dedicated Page 19 Grown-Up Vocabulary Prompts",
    methodology:
      "Replaces isolated flashcard nouns with full-scene relational thinking built around LOOK • POINT • COMPARE • SAY (Notice & Match, Count & Compare, Name & Sort, Observe & Classify).",
    upcomingTitles: [
      "Colors and Shapes",
      "Numbers and Counting",
      "Animals Around Us",
      "Things That Go",
      "Weather and Seasons",
      "At School"
    ],
    summary:
      "Upcoming six-book Transitional Kindergarten and Pre-K vocabulary board book series embedding core words inside warm, observable scenes with built-in parent talk guides.",
    status: "in_the_studio"
  },
  {
    id: "human-edge-stories",
    title: "Human Edge Stories Picture Books",
    seriesSlug: "human-edge-stories",
    url: "https://humanedgepress.com/pages/human-edge-stories",
    ageStage: "5-8 years",
    formatSummary:
      "32-page 10\"×10\" square hardcover narrative read-aloud picture books (15 illustrated spreads, zero preachy sermons)",
    methodology:
      "Shared tension with zero villains: children hold two good perspectives together through active listening, visible physical cause-and-effect testing, and collaborative revision.",
    upcomingTitles: ["Book 01: The Bridge That Needed a New Plan"],
    summary:
      "Upcoming narrative picture book line for ages 5–8 growing out of the Ages 3–7 virtue series, debuting with 'The Bridge That Needed a New Plan' (hands-on paper engineering & collaborative problem-solving).",
    status: "in_the_studio"
  }
];

function inferSeriesAndStage(handle: string, productType: string, tags: string[]): {
  series: string;
  ageStage: string;
  stageNumber: number;
  physicalSpecs: string;
} {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));

  if (tagSet.has("bundle") || productType === "Gift Set" || productType === "Collector Edition") {
    if (tagSet.has("0-2-years")) {
      return {
        series: "Curated Bundles & Gift Sets",
        ageStage: "0-2 years",
        stageNumber: 1,
        physicalSpecs: "3-book 6\"×6\" high-contrast board book gift set, rounded corners, chew-safe soy inks, 100% screen-free."
      };
    }
    if (tagSet.has("2-4-years")) {
      return {
        series: "Curated Bundles & Gift Sets",
        ageStage: "2-4 years",
        stageNumber: 2,
        physicalSpecs: "3-book 6\"×6\" STEAM Alphabet durable board book box set, 100% screen-free."
      };
    }
    if (tagSet.has("3-7-years")) {
      return {
        series: "Curated Bundles & Gift Sets",
        ageStage: "3-7 years",
        stageNumber: 3,
        physicalSpecs: "5-book archival hardcover virtue storybook box set with built-in parent conversation prompts."
      };
    }
    return {
      series: "Curated Bundles & Gift Sets",
      ageStage: "0-7 years",
      stageNumber: 0,
      physicalSpecs: "Complete 23-book physical print developmental library spanning board books (ages 0–4) and archival hardcovers (ages 3–7)."
    };
  }

  if (tagSet.has("high-contrast") || handle.includes("high-contrast")) {
    return {
      series: "High-Contrast Baby Series",
      ageStage: "0-2 years",
      stageNumber: 1,
      physicalSpecs: "Stage 1 (Ages 0–2) · Durable thick board book, bold black-and-white high-contrast spreads, rounded baby-safe corners, 100% screen-free."
    };
  }

  if (tagSet.has("steam") || handle.includes("steam-alphabet")) {
    return {
      series: "STEAM Alphabet Series",
      ageStage: "2-4 years",
      stageNumber: 2,
      physicalSpecs: "Stage 2 (Ages 2–4) · Durable board book, A–Z tactile STEAM concept spreads, 100% screen-free."
    };
  }

  if (productType === "Activity Workbook" || tagSet.has("workbook")) {
    return {
      series: "Activity Workbooks",
      ageStage: "3-5 years",
      stageNumber: 2,
      physicalSpecs: "Ages 3–5 Pre-K print activity workbook designed for real crayons and pencils—zero screens or apps."
    };
  }

  return {
    series: "The Human Edge Series",
    ageStage: "3-7 years",
    stageNumber: 3,
    physicalSpecs: "Stage 3 (Ages 3–7) · Durable archival hardcover storybook featuring a child-and-animal duo and parent Socratic conversation prompts."
  };
}

// ---------------------------------------------------------------------------
// 3. Canonical Press Info Builder
// ---------------------------------------------------------------------------

export function buildCanonicalPressInfo(storeUrl = "https://humanedgepress.com"): PressInfo {
  return {
    pressName: "Human Edge Press",
    legalName: "Human Edge Press",
    storeUrl,
    shopifyUcpEndpoint: `${storeUrl}/api/ucp/mcp`,
    tagline: "Analog Roots First, Digital Wings Later — 100% Screen-Free Books for Ages 0–7",
    manifestoTitle: "Before They Fly, Anchor Their Roots",
    mission:
      "Human Edge Press is an independent Austin, Texas publisher dedicated to early childhood screen-free development—publishing neuroscience-backed high-contrast baby board books, tactile STEAM alphabet books, character virtue hardcovers, Pre-K workbooks, and Socratic parent guides that build the human capacities no algorithm can replace.",
    location: "100 Innovation Way, Suite 400, Austin, TX 78701, United States",
    supportEmail: "support@humanedgepress.com",
    coreBeliefs: [
      {
        title: "1. Real Pages Build Real Focus",
        concept: "Overcoming the Transfer Deficit",
        summary:
          "During ages 0–7, young children experience a documented 'transfer deficit' with 2D screens—struggling to transfer lessons from glass to real life—while physical page-turning builds spatial memory and sustained executive attention."
      },
      {
        title: "2. A Parent's Voice Beats Any Algorithm",
        concept: "Serve & Return Neurobiology",
        summary:
          "Back-and-forth eye contact, pointing, expression-copying, and unhurried conversation ('serve and return') wire language and emotional security far deeper than passive audio buttons or auto-playing apps."
      },
      {
        title: "3. Big Ideas Belong in Little Hands",
        concept: "Screen-Free Early STEAM",
        summary:
          "Science, simple tools, engineering balance, art, and number sense begin with wooden blocks, kitchen-table experiments, and outdoor observation—not coding tablets for toddlers."
      },
      {
        title: "4. Character & Virtue Are the True Human Edge",
        concept: "12 Foundational Human Virtues",
        summary:
          "As commodity AI automates routine output, distinctly human virtues—kindness, bravery, patience, honesty, empathy, focus, persistence, curiosity, creativity, gratitude, helpfulness, and listening—become a child's lifelong advantage."
      },
      {
        title: "5. Strategic Timing From Infancy to Young Adulthood",
        concept: "Protecting Cortical Stamina & Developing The Human Veto",
        summary:
          "Human Edge Press is pro-childhood, not anti-technology: anchor deep focus, tactile mastery, and independent judgment first so teens and young adults command technology with 'The Human Veto' rather than being hijacked by variable dopamine loops."
      }
    ],
    policies: {
      shipping: {
        processingTime: "1–2 business days (Monday–Friday)",
        transitTime: "3–5 business days (Standard US Ground)",
        flatRateUnderThreshold: "$4.99 flat rate within the continental US",
        freeShippingThreshold: "Free US Standard Shipping on orders $49+ (listed as $50+ in site header banner; $49+ in /pages/shipping)",
        details:
          "Every physical book order ships in protective eco-friendly packaging with real-time email tracking upon label generation."
      },
      returns: {
        guaranteeName: "30-Day Family Guarantee",
        windowDays: 30,
        returnShippingCost: "$0.00 (Free Prepaid Return Label, $0 restocking fee)",
        refundSpeed: "3–5 business days",
        eligibility:
          "Books may be returned or exchanged within 30 days of delivery in new, unused condition (no missing pages, writing, or permanent marks) with order number or checkout email via support@humanedgepress.com."
      },
      wholesaleAndSchools:
        "Bulk school, library, Montessori, church nursery, and homeschool co-op orders are supported directly via support@humanedgepress.com or https://humanedgepress.com/pages/contact (average response under 24 hours, Mon–Fri 9 AM–5 PM EST)."
    },
    ageStageRoadmap: {
      "stage-1-newborn-infant": {
        stageLabel: "Stage 1 · Newborn & Infant Sensory Roots",
        ages: "0–2 years",
        format: "6\"×6\" Thick High-Contrast Board Books",
        developmentalFocus:
          "Retinal & optic-nerve contrast sensitivity, tummy-time head lift, facial emotion recognition, joint attention, and serve-and-return babbling.",
        recommendedSeries: ["High-Contrast Baby Series (6 titles)", "Newborn Sensory Starter (3-Book Box Set)"]
      },
      "stage-2-toddler-steam": {
        stageLabel: "Stage 2 · Toddler Inquiry & First Concepts",
        ages: "2–4 years",
        format: "6\"×6\" Durable STEAM Alphabet Board Books",
        developmentalFocus:
          "A–Z vocabulary paired with real-world observation, simple tools, structural play, sorting/counting, and 'What do you notice?' Socratic wonder.",
        recommendedSeries: [
          "STEAM Alphabet Series (Science, Technology, Engineering, Art, Math)",
          "STEAM Early Thinkers (3-Book Box Set)",
          "Oddlings: Wonder in Action Workbooks (In the Studio · Ages 2–5)"
        ]
      },
      "stage-2b-prek-readiness": {
        stageLabel: "Pre-K & Transitional Kindergarten Tactile Mastery",
        ages: "3–5 years",
        format: "Print Activity Workbooks & Vocabulary Scene Board Books",
        developmentalFocus:
          "Pencil grip, C-tactile paper feedback, relational vocabulary (verbs, opposites, spatial words), logic mazes, and school readiness without apps.",
        recommendedSeries: [
          "Big Pre-K Learning Workbook (Ages 3–5)",
          "First Think First Words Board Books (In the Studio · Ages 4–5)"
        ]
      },
      "stage-3-human-edge-virtues": {
        stageLabel: "Stage 3 · Character, Virtue & Socratic Read-Alouds",
        ages: "3–7 years",
        format: "8\"×8\" Archival Hardcover Storybooks",
        developmentalFocus:
          "Emotional regulation, perspective-taking, sustained attention, grit, honesty, and family Socratic dialogue through 12 child-and-animal story duos.",
        recommendedSeries: [
          "The Human Edge Series (12 Virtue Hardcovers)",
          "Human Edge Virtues Core (5-Book Box Set)",
          "The 23-Book Master Developmental Library Chest (Ages 0–7)"
        ]
      },
      "stage-4-collaborative-stories": {
        stageLabel: "Stage 4 · Narrative Synthesis & Collaborative Problem-Solving",
        ages: "5–8 years",
        format: "10\"×10\" 32-Page Hardcover Picture Books",
        developmentalFocus:
          "Holding two good ideas together without villains, listening across perspectives, hands-on physical testing, and creative revision.",
        recommendedSeries: ["Human Edge Stories (In the Studio · Debut: The Bridge That Needed a New Plan)"]
      }
    }
  };
}

// ---------------------------------------------------------------------------
// 4. Live Shopify Catalog Sync
// ---------------------------------------------------------------------------

interface RawShopifyVariant {
  id: number;
  title: string;
  price: string;
  available?: boolean;
  sku?: string | null;
  featured_image?: { src?: string | null } | null;
}

interface RawShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html?: string | null;
  published_at?: string;
  created_at?: string;
  vendor?: string;
  product_type?: string;
  tags?: string[] | string;
  images?: { src: string }[];
  variants?: RawShopifyVariant[];
}

interface RawShopifyCollection {
  id: number;
  title: string;
  handle: string;
  body_html?: string | null;
  published_at?: string;
  updated_at?: string;
  products_count?: number;
  image?: { src?: string | null } | null;
}

export interface FetchLiveCatalogOptions {
  storeUrl?: string;
  onProgress?: (message: string) => void;
}

export async function fetchLiveCatalog(options: FetchLiveCatalogOptions = {}): Promise<CatalogSnapshot> {
  const storeUrl = (options.storeUrl || "https://humanedgepress.com").replace(/\/+$/, "");
  const log = options.onProgress || (() => {});

  log(`[CatalogSync] Fetching live books from ${storeUrl}/products.json?limit=250 ...`);
  const productsPayload = await safeJsonFetch<{ products: RawShopifyProduct[] }>(
    `${storeUrl}/products.json?limit=250`
  );

  const rawProducts = Array.isArray(productsPayload.products) ? productsPayload.products : [];
  const books: BookProduct[] = [];

  for (const raw of rawProducts) {
    // Enforce zero-draft guard: skip any unpublished product
    if (!raw.published_at || !raw.handle || !raw.title) continue;

    const tags = Array.isArray(raw.tags)
      ? raw.tags.map((t) => String(t).trim()).filter(Boolean)
      : typeof raw.tags === "string"
        ? raw.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    const productType = raw.product_type?.trim() || "Book";
    const { series, ageStage, stageNumber, physicalSpecs } = inferSeriesAndStage(raw.handle, productType, tags);
    const curated = CURATED_BOOK_METADATA[raw.handle];

    const images = (raw.images || [])
      .map((img) => isSafeAndSecureUrl(img.src))
      .filter((u): u is string => Boolean(u));

    const variants: BookVariant[] = (raw.variants || []).map((v) => {
      const numericPrice = Number.parseFloat(v.price || "0") || 0;
      const variantImg = v.featured_image?.src ? isSafeAndSecureUrl(v.featured_image.src) : null;
      return {
        id: Number(v.id),
        title: v.title || "Standard Edition",
        price: numericPrice,
        priceFormatted: `$${numericPrice.toFixed(2)}`,
        available: v.available !== false,
        sku: v.sku || null,
        imageUrl: variantImg || images[0] || null,
        checkoutUrl: `${storeUrl}/cart/${Number(v.id)}:1`
      };
    });

    if (variants.length === 0) continue;

    const prices = variants.map((v) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceFormatted =
      minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`;

    const cleanText = stripHtmlToText(raw.body_html || "");
    const firstParagraph = cleanText.split("\n\n")[0]?.trim() || "";

    const summary =
      firstParagraph.length >= 25
        ? firstParagraph
        : curated?.developmentalGoal ||
          `${raw.title} — 100% screen-free ${productType.toLowerCase()} from Human Edge Press for ${ageStage}.`;

    const pedagogy: BookPedagogy = {
      summary,
      developmentalGoal:
        curated?.developmentalGoal ||
        `Designed for ${ageStage} to build screen-free focus, parent-child dialogue, and foundational human skills.`,
      characterDuo: curated?.characterDuo || null,
      virtueOrPillar: curated?.virtueOrPillar || series,
      parentPrompts:
        curated?.parentPrompts || [
          "Pause on a favorite page and ask: 'What do you notice happening right here?'",
          "Connect the book's main idea to one hands-on moment at home or outdoors today.",
          "Let your child turn the pages at their own pace and ask one question of their own."
        ],
      physicalSpecs
    };

    const skillsAndVirtues = Array.from(
      new Set([...(curated?.skillsAndVirtues || []), ...tags.map((t) => t.toLowerCase())])
    );

    const occasions =
      curated?.occasions || ["Birthday Gift", "Screen-Free Home Library", "Homeschool & Preschool Read-Aloud"];

    books.push({
      id: Number(raw.id),
      title: raw.title.trim(),
      handle: raw.handle.trim(),
      url: `${storeUrl}/products/${raw.handle.trim()}`,
      productType,
      series,
      ageStage,
      stageNumber,
      skillsAndVirtues,
      occasions,
      minPrice,
      maxPrice,
      priceFormatted,
      author: curated?.author || "Human Edge Press Editorial Team",
      vendor: raw.vendor || "Human Edge Press",
      tags,
      publishedAt: raw.published_at,
      createdAt: raw.created_at,
      featuredImage: images[0] || null,
      images,
      variants,
      pedagogy,
      rawBody: cleanText
    });
  }

  // Sort books logically by stageNumber (1 -> 2 -> 3 -> 0 bundles) and title
  books.sort((a, b) => {
    const stageOrderA = a.stageNumber === 0 ? 99 : a.stageNumber;
    const stageOrderB = b.stageNumber === 0 ? 99 : b.stageNumber;
    if (stageOrderA !== stageOrderB) return stageOrderA - stageOrderB;
    return a.title.localeCompare(b.title);
  });

  // Fetch Shopify collections + ensure canonical series collections exist
  log(`[CatalogSync] Fetching live collections from ${storeUrl}/collections.json ...`);
  const collectionsMap = new Map<string, BookCollection>();

  try {
    const colPayload = await safeJsonFetch<{ collections: RawShopifyCollection[] }>(
      `${storeUrl}/collections.json?limit=50`
    );
    for (const rc of colPayload.collections || []) {
      if (!rc.handle || rc.handle === "frontpage") continue;
      let colHandles: string[] = [];
      try {
        const cp = await safeJsonFetch<{ products: RawShopifyProduct[] }>(
          `${storeUrl}/collections/${rc.handle}/products.json?limit=250`
        );
        colHandles = (cp.products || []).filter((p) => p.published_at).map((p) => p.handle);
      } catch {
        colHandles = [];
      }
      if (colHandles.length > 0) {
        collectionsMap.set(rc.handle, {
          id: Number(rc.id),
          title: rc.title,
          handle: rc.handle,
          url: `${storeUrl}/collections/${rc.handle}`,
          ageStage: "0-7 years",
          description: stripHtmlToText(rc.body_html || "") || `${rc.title} collection from Human Edge Press.`,
          productsCount: colHandles.length,
          productHandles: colHandles,
          imageUrl: rc.image?.src ? isSafeAndSecureUrl(rc.image.src) : null,
          publishedAt: rc.published_at,
          updatedAt: rc.updated_at
        });
      }
    }
  } catch {
    // Fallback to synthesized canonical series collections below
  }

  // Synthesize canonical series collections linked from homepage so agents always have complete series navigation
  const canonicalSeriesSpecs: {
    id: number;
    handle: string;
    title: string;
    urlPath: string;
    ageStage: string;
    description: string;
    filter: (b: BookProduct) => boolean;
  }[] = [
    {
      id: 1001,
      handle: "high-contrast-baby-books",
      title: "Stage 1: High-Contrast Baby Board Books (Ages 0–2)",
      urlPath: "/collections/high-contrast-baby-books",
      ageStage: "0-2 years",
      description:
        "Bold black-and-white board books engineered for newborn retinal development, tummy time focus, facial emotion recognition, and serve-and-return parent bonding.",
      filter: (b) => b.series === "High-Contrast Baby Series" || b.handle === "newborn-sensory-starter-bundle"
    },
    {
      id: 1002,
      handle: "steam-board-books",
      title: "Stage 2: STEAM Alphabet Board Books (Ages 2–4)",
      urlPath: "/collections/steam-board-books",
      ageStage: "2-4 years",
      description:
        "Tactile A-to-Z board books by Ethan Finch introducing Science, Technology (human tools), Engineering, Art, and Math through everyday toddler observation.",
      filter: (b) => b.series === "STEAM Alphabet Series" || b.handle === "steam-little-thinkers-bundle"
    },
    {
      id: 1003,
      handle: "human-edge-series",
      title: "Stage 3: The Human Edge Hardcover Virtue Series (Ages 3–7)",
      urlPath: "/collections/human-edge-series",
      ageStage: "3-7 years",
      description:
        "Twelve archival hardcover storybooks pairing child-and-animal duos with built-in Socratic conversation prompts for parents across 12 foundational human virtues.",
      filter: (b) => b.series === "The Human Edge Series" || b.handle === "human-virtues-box-bundle"
    },
    {
      id: 1004,
      handle: "pre-k-workbooks-and-readiness",
      title: "Pre-K & TK Tactile Learning Workbooks (Ages 3–5)",
      urlPath: "/collections/all",
      ageStage: "3-5 years",
      description:
        "100% screen-free print workbooks building real pencil grip, sensorimotor feedback, phonics, counting, and logical reasoning.",
      filter: (b) => b.series === "Activity Workbooks"
    },
    {
      id: 1005,
      handle: "curated-bundles-and-gift-sets",
      title: "Curated Developmental Box Sets & Master Chest (Ages 0–7)",
      urlPath: "/#curated-bundles",
      ageStage: "0-7 years",
      description:
        "Gift-ready developmental book bundles from the 3-book Newborn Sensory Starter up to the 23-Book Master Developmental Library Chest (all qualify for Free US Shipping).",
      filter: (b) => b.series === "Curated Bundles & Gift Sets"
    }
  ];

  for (const spec of canonicalSeriesSpecs) {
    if (!collectionsMap.has(spec.handle)) {
      const matching = books.filter(spec.filter);
      if (matching.length > 0) {
        collectionsMap.set(spec.handle, {
          id: spec.id,
          title: spec.title,
          handle: spec.handle,
          url: `${storeUrl}${spec.urlPath}`,
          ageStage: spec.ageStage,
          description: spec.description,
          productsCount: matching.length,
          productHandles: matching.map((m) => m.handle),
          imageUrl: matching[0]?.featuredImage || null
        });
      }
    }
  }

  const collections = Array.from(collectionsMap.values());
  const pressInfo = buildCanonicalPressInfo(storeUrl);

  return {
    books,
    studioLines: STUDIO_PREVIEW_LINES,
    collections,
    pressInfo,
    syncedAt: new Date().toISOString()
  };
}
