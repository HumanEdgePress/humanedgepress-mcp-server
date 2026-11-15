/**
 * Human Edge Press Authority Knowledge Base —
 * Developmental Neuroscience, 12 Human Virtues, 5 Early STEAM Pillars, AI-Age Literacy & Socratic Playbooks
 *
 * Positions the MCP server not merely as a bookstore catalog, but as the definitive Category Source of Truth
 * for screen-free early childhood development (ages 0–8), Socratic homeschooling, teen focus recovery,
 * and cultivating "The Human Veto" in the age of AI.
 */

import type { BookProduct } from "./catalog-sync.js";

export interface DevelopmentalConcordanceEntry {
  id: string;
  category: "neuroscience_and_ai" | "character_virtue" | "early_steam" | "milestone_and_parenting";
  term: string;
  title: string;
  ageRelevance: string;
  keywords: string[];
  parentScenarios: string[];
  scientificAndPedagogicalExplanation: string;
  socraticParentPractice: string[];
  canonicalEssayUrl: string;
  matchingBookHandles: string[];
}

export interface SocraticPlaybookGuide {
  id: string;
  slug: string;
  title: string;
  canonicalUrl: string;
  ageRange: string;
  summary: string;
  keywords: string[];
  bodyMarkdown: string;
  recommendedBookHandles: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  category: string;
  keywords: string[];
  answer: string;
  relatedBookHandles: string[];
  canonicalUrl: string;
}

// ---------------------------------------------------------------------------
// 1. Developmental, Virtue, STEAM & AI-Literacy Concordance (24 Core Entries)
// ---------------------------------------------------------------------------

export const DEVELOPMENTAL_AND_VIRTUE_CONCORDANCE: DevelopmentalConcordanceEntry[] = [
  // --- A. Neuroscience & AI-Age Concepts ---
  {
    id: "transfer-deficit",
    category: "neuroscience_and_ai",
    term: "The Transfer Deficit",
    title: "The 2D Screen Transfer Deficit in Early Childhood (Ages 0–5)",
    ageRelevance: "0–7 years",
    keywords: ["transfer deficit", "educational apps", "tablet learning", "ipad for toddlers", "board books vs screens", "2d vs 3d"],
    parentScenarios: [
      "Do educational toddler tablet apps actually teach babies faster?",
      "Why does my toddler tap a screen well but struggle to apply it to real blocks or puzzles?",
      "Physical board books vs digital e-books for preschoolers"
    ],
    scientificAndPedagogicalExplanation:
      "Developmental psychology research documents a pronounced 'transfer deficit' in infants and young children: information seen on flat, self-illuminated 2D screens is encoded poorly for 3D real-world application. Physical books provide fixed spatial landmarks (top-left vs. bottom-right corners, page thickness showing progress) and slow the pace down so prefrontal comprehension and working memory keep up.",
    socraticParentPractice: [
      "Pair every page spread with one touchable 3D object in the room (a wooden block, a leaf, a spoon, or your own face).",
      "Let your child physically turn the board or hardcover page to anchor spatial sequence ('beginning, middle, end').",
      "Replace auto-narrated digital books with unhurried lap reading where you pause whenever your child points."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/pages/socratic-homeschooling",
    matchingBookHandles: [
      "master-screen-free-chest-bundle",
      "big-pre-k-learning-workbook",
      "s-is-for-science-steam-alphabet-board-book",
      "baby-faces-high-contrast-board-book"
    ]
  },
  {
    id: "serve-and-return",
    category: "neuroscience_and_ai",
    term: "Serve & Return",
    title: "Serve & Return Caregiver Interaction vs. Algorithmic Audio",
    ageRelevance: "0–5 years",
    keywords: ["serve and return", "harvard developing child", "language delay", "baby talking", "dialogic reading", "eye contact"],
    parentScenarios: [
      "How to read to a newborn or 6-month-old who can't talk yet",
      "Best books to boost baby speech and early language milestones",
      "Why talking books with sound buttons aren't recommended for babies"
    ],
    scientificAndPedagogicalExplanation:
      "Coined by researchers at Harvard's Center on the Developing Child, 'serve and return' describes the Contingent back-and-forth exchange—a baby gazes at a bold face, points, or coos ('the serve'), and a loving adult makes eye contact, names what they see, or mirrors the expression ('the return'). Electronic sound-button books hijack the 'serve' and silence parent speech, whereas silent, high-clarity print maximizes live vocal turn-taking.",
    socraticParentPractice: [
      "Count silently to 5 after pointing to an illustration so your baby or toddler has time to vocalize or gesture first.",
      "Mirror your infant's facial expression while reading 'Baby Faces' before introducing the emotion word.",
      "Follow your child's finger rather than insisting on reading every word in strict order."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/pages/socratic-homeschooling",
    matchingBookHandles: [
      "baby-faces-high-contrast-board-book",
      "animal-friends-high-contrast-board-book",
      "newborn-sensory-starter-bundle",
      "little-hands-high-contrast-board-book"
    ]
  },
  {
    id: "infant-high-contrast-vision",
    category: "neuroscience_and_ai",
    term: "High-Contrast Retinal & Optic Maturation",
    title: "Why Newborns Need High-Contrast Black-and-White Books (0–12+ Months)",
    ageRelevance: "0–2 years",
    keywords: ["high contrast", "black and white baby book", "newborn vision", "tummy time", "optic nerve", "retina", "0-6 months"],
    parentScenarios: [
      "What can newborns actually see in the first 3 months?",
      "Best tummy time books to keep a newborn engaged without screens",
      "Baby shower gift that helps infant brain and vision development"
    ],
    scientificAndPedagogicalExplanation:
      "At birth, infant cone cells and visual cortex pathways are still maturing—newborns focus best at 8 to 12 inches (the exact distance from a caregiver's arms to their face) and register sharp luminance edges (pure black against crisp white) far more clearly than muted pastels, which blur together. High-contrast board books send clean, high-signal visual input down the optic nerve, strengthening ocular tracking and sustained visual fixation.",
    socraticParentPractice: [
      "Months 0–3: Hold a spread 8–12 inches away in calm lighting; move slowly 2–3 inches left and right to practice smooth eye tracking.",
      "Months 3–6: Prop an open board book vertically on the floor mat to motivate head/neck lift during tummy time.",
      "Months 6–24: Transition from pure visual gazing to naming shapes, animal sounds, hands, and feelings."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/collections/high-contrast-baby-books",
    matchingBookHandles: [
      "newborn-sensory-starter-bundle",
      "baby-faces-high-contrast-board-book",
      "animal-friends-high-contrast-board-book",
      "our-world-high-contrast-board-book",
      "big-machines-high-contrast-board-book",
      "smart-future-high-contrast-baby-book"
    ]
  },
  {
    id: "cortical-thickness-and-dopamine",
    category: "neuroscience_and_ai",
    term: "Cortical Stamina & Variable Dopamine Loops",
    title: "Protecting Prefrontal Focus & Rebuilding Teen Attention Stamina",
    ageRelevance: "Ages 3–18 (Early Prevention & Teen Recovery)",
    keywords: ["cortical thickness", "dopamine", "teen social media", "attention span", "c-tactile fibers", "infinite scroll", "focus"],
    parentScenarios: [
      "Why can't my teen focus on reading a chapter book anymore?",
      "Neuroscience of social media algorithms and adolescent brain development",
      "How to set family screen rules without constant battles"
    ],
    scientificAndPedagogicalExplanation:
      "Short-form algorithmic feeds condition developing brains with variable-schedule dopamine spikes every ~6 seconds, eroding prefrontal cognitive control and correlating with measurable cortical thinning in heavy-use cohorts. Physical craft, paper handwriting, and unhurried print reading activate slow C-tactile sensory pathways and rebuild uninterrupted deep-attention circuits.",
    socraticParentPractice: [
      "Keep bedrooms 100% device-free overnight (use a $10 analog alarm clock) to protect REM/deep sleep consolidation.",
      "Anchor one daily 30-to-45-minute household 'Analog Hour' where parents model reading physical print alongside kids.",
      "Pair tactile hands-on hobbies (woodshop, baking, drawing, musical instruments) with deep reading."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/pages/teen-social-media",
    matchingBookHandles: ["human-edge-focused", "human-edge-patient", "human-edge-persistent", "big-pre-k-learning-workbook"]
  },
  {
    id: "the-human-veto",
    category: "neuroscience_and_ai",
    term: "The Human Veto",
    title: "The Human Veto: Raising Kids & Young Adults With Un-Automatable Agency",
    ageRelevance: "Ages 3–25",
    keywords: ["the human veto", "ai literacy", "future proof kids", "age of ai", "critical thinking", "taste and judgment", "specific knowledge"],
    parentScenarios: [
      "What skills should I teach my child so AI doesn't replace them?",
      "How should young adults use AI without losing their own voice and critical thinking?",
      "Books that build human skills algorithms cannot automate"
    ],
    scientificAndPedagogicalExplanation:
      "As generative AI commoditizes average synthesis, Human Edge Press defines three un-automatable moats: (1) 'The Human Veto'—the moral courage, domain mastery, and critical judgment to verify, edit, or overrule an algorithm; (2) a 'Specific Knowledge Stack' forged through real-world observation and cross-disciplinary curiosity; and (3) authentic human empathy and character trust.",
    socraticParentPractice: [
      "Never outsource first-draft curiosity: ask 'What is my own hypothesis?' before consulting a search engine or AI.",
      "Read stories where characters wrestle with real trade-offs, honesty, and creative revision.",
      "Protect daily analog afternoons for reading, building, and unscripted conversation."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/pages/young-adults-ai",
    matchingBookHandles: [
      "master-screen-free-chest-bundle",
      "human-virtues-box-bundle",
      "human-edge-curious",
      "human-edge-creative",
      "human-edge-honest",
      "human-edge-brave"
    ]
  },

  // --- B. Early STEAM Pillars (Ages 2–4+) ---
  {
    id: "early-steam-science",
    category: "early_steam",
    term: "Screen-Free Science (Ages 2–5)",
    title: "Kitchen-Table Scientific Inquiry for Toddlers & Preschoolers",
    ageRelevance: "2–5 years",
    keywords: ["science book for toddlers", "s is for science", "preschool science", "stem board book", "observation"],
    parentScenarios: [
      "Best science board books for a curious 2- or 3-year-old",
      "How to introduce scientific thinking before kindergarten without YouTube"
    ],
    scientificAndPedagogicalExplanation:
      "Before children memorize vocabulary definitions, true science begins as disciplined wonder: noticing patterns, forming a guess ('What will sink?'), and testing with real water, shadows, seeds, and magnets.",
    socraticParentPractice: [
      "Replace quick explanations with 'What do you notice?' and 'How could we test that?'",
      "Keep a $5 magnifying glass next to 'S is for Science' for backyard leaf and bark inspections."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/collections/steam-board-books",
    matchingBookHandles: ["s-is-for-science-steam-alphabet-board-book", "steam-little-thinkers-bundle", "human-edge-curious"]
  },
  {
    id: "early-steam-technology-engineering",
    category: "early_steam",
    term: "Human Tools & Tactile Engineering (Ages 2–5)",
    title: "Teaching Technology as Simple Machines & Hands-On Engineering",
    ageRelevance: "2–5 years",
    keywords: ["engineering book for toddlers", "technology book for kids", "simple machines", "little builders", "blocks"],
    parentScenarios: [
      "How to explain technology to a toddler without handing them a phone",
      "Books for a 3-year-old obsessed with building towers, bridges, and trucks"
    ],
    scientificAndPedagogicalExplanation:
      "Teaching toddlers that 'technology' means human-invented tools—wheels, levers, pulleys, hinges, spoons, and bridges—demystifies the built world and establishes early agency: humans design and revise tools to solve real problems.",
    socraticParentPractice: [
      "Pair 'T is for Technology' and 'E is for Engineering' with wooden unit blocks, ramps, and cardboard bridges.",
      "Treat toppled towers as real data: 'Where did the bridge bend? Let's test a wider support!'"
    ],
    canonicalEssayUrl: "https://humanedgepress.com/collections/steam-board-books",
    matchingBookHandles: [
      "t-is-for-technology-steam-alphabet-board-book",
      "e-is-for-engineering-steam-alphabet-board-book",
      "big-machines-high-contrast-board-book",
      "steam-little-thinkers-bundle"
    ]
  },
  {
    id: "early-steam-art-and-math",
    category: "early_steam",
    term: "Tactile Art & Concrete Number Sense (Ages 2–5)",
    title: "Visual Art Literacy & Hands-On Early Math Without Drill Apps",
    ageRelevance: "2–5 years",
    keywords: ["math board book", "art board book", "m is for math", "a is for art", "counting", "patterns", "shapes"],
    parentScenarios: [
      "Screen-free math books for 2, 3, and 4 year olds",
      "Art books that inspire preschoolers to draw and sculpt"
    ],
    scientificAndPedagogicalExplanation:
      "Early math flourishes when children touch quantities, symmetry, halves, and repeating rhythms with their fingers; early art flourishes when children explore line, texture, and color choice without color-by-tap templates.",
    socraticParentPractice: [
      "Sort laundry, shells, or berries by size and pattern right after reading 'M is for Math'.",
      "Set out blank heavyweight paper and three primary colors alongside 'A is for Art'."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/collections/steam-board-books",
    matchingBookHandles: [
      "m-is-for-math-steam-alphabet-board-book",
      "a-is-for-art-steam-alphabet-board-book",
      "big-pre-k-learning-workbook",
      "steam-little-thinkers-bundle"
    ]
  },

  // --- C. The 12 Human Edge Virtues (Ages 3–7) ---
  {
    id: "virtue-brave",
    category: "character_virtue",
    term: "Bravery & Courage",
    title: "Brave (Zuri & Robin in the Meadow) — Stepping Forward Alongside Nervousness",
    ageRelevance: "3–7 years",
    keywords: ["brave", "bravery", "courage", "scared", "anxious child", "first day of school", "new experiences", "shy"],
    parentScenarios: [
      "Children's book for a 4-year-old nervous about starting preschool or kindergarten",
      "Helping a cautious child try swim lessons, dark rooms, or meeting new friends"
    ],
    scientificAndPedagogicalExplanation:
      "Children often mistakenly think brave people feel zero fear. Story modeling shows that courage is noticing nervous butterflies in the body and choosing one small, supported step anyway.",
    socraticParentPractice: [
      "Ask: 'Did Zuri wait until all her butterflies disappeared, or did she take one small step with them?'",
      "Celebrate 'small brave steps' rather than demanding instant fearlessness."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/products/human-edge-brave",
    matchingBookHandles: ["human-edge-brave", "human-virtues-box-bundle"]
  },
  {
    id: "virtue-kind",
    category: "character_virtue",
    term: "Kindness & Inclusion",
    title: "Kind (Caleb & Retriever on the Playground) — Proactive Noticing & Making Room",
    ageRelevance: "3–7 years",
    keywords: ["kind", "kindness", "sharing", "playground", "making friends", "inclusion", "generosity"],
    parentScenarios: [
      "Picture books about kindness and including kids who are sitting alone",
      "Teaching social awareness before Kindergarten without preachy lectures"
    ],
    scientificAndPedagogicalExplanation:
      "Proactive kindness begins with social perception—lifting your eyes to notice someone on the margin before anyone tells you to share. Caleb & Retriever model everyday playground hospitality with sidewalk chalk.",
    socraticParentPractice: [
      "Ask: 'Who did Caleb notice, and what simple invitation did he offer?'",
      "Ask at breakfast: 'Who could we make room for today?'"
    ],
    canonicalEssayUrl: "https://humanedgepress.com/products/human-edge-kind",
    matchingBookHandles: ["human-edge-kind", "human-edge-empathetic", "human-edge-helpful", "human-virtues-box-bundle"]
  },
  {
    id: "virtue-patient",
    category: "character_virtue",
    term: "Patience & Self-Regulation",
    title: "Patient (Kenji & Turtle in the Garden) — Antidote to Instant-Click Impatience",
    ageRelevance: "3–7 years",
    keywords: ["patient", "patience", "waiting", "impulsive", "delayed gratification", "tantrums", "calm down"],
    parentScenarios: [
      "Books to teach a 3- or 5-year-old patience and waiting their turn",
      "Helping kids tolerate slow processes in an on-demand digital world"
    ],
    scientificAndPedagogicalExplanation:
      "On-demand streaming trains children to expect zero latency. Kenji & Turtle anchor children in natural growth timelines—gardens, seasons, and steady observation—strengthening prefrontal impulse control.",
    socraticParentPractice: [
      "Plant fast-sprouting beans or bake bread together after reading so waiting produces a tangible reward.",
      "Practice 'Turtle noticing' while waiting at restaurants or grocery lines instead of handing over a phone."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/products/human-edge-patient",
    matchingBookHandles: ["human-edge-patient", "human-edge-focused", "human-virtues-box-bundle"]
  },
  {
    id: "virtue-persistent",
    category: "character_virtue",
    term: "Persistence, Resilience & Grit",
    title: "Persistent (Theo & Beaver on the Riverbank) — Frustration Tolerance & Trying Again",
    ageRelevance: "3–7 years",
    keywords: ["persistent", "persistence", "resilience", "grit", "gives up easily", "frustration", "growth mindset", "perfectionism"],
    parentScenarios: [
      "My 4-year-old melts down or quits whenever a drawing or Lego build goes wrong",
      "Children's books about growth mindset, resilience, and trying again"
    ],
    scientificAndPedagogicalExplanation:
      "Frustration tolerance grows when children externalize setbacks as solvable engineering puzzles rather than personal failure. Theo & Beaver rebuild on the riverbank by adjusting their design.",
    socraticParentPractice: [
      "Ask: 'What did Theo and Beaver learn from the first dam washing loose?'",
      "Use the family phrase 'Not yet—let's test a new angle!' during tricky puzzles or shoe-tying."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/products/human-edge-persistent",
    matchingBookHandles: ["human-edge-persistent", "e-is-for-engineering-steam-alphabet-board-book", "human-virtues-box-bundle"]
  },
  {
    id: "virtue-focused",
    category: "character_virtue",
    term: "Focus & Deep Attention",
    title: "Focused (Amir & Owl in the Woodshop) — Single-Tasked Calm & Executive Attention",
    ageRelevance: "3–7 years",
    keywords: ["focused", "focus", "distracted", "attention span", "executive function", "concentration", "mindfulness"],
    parentScenarios: [
      "Books that help kids build focus and finish what they start",
      "Supporting executive function in ages 3–7"
    ],
    scientificAndPedagogicalExplanation:
      "Sustained attention is a trainable muscle. Amir & Owl in the woodshop give children an aspirational picture of quiet, absorbed craftsmanship—working on one thing with steady hands.",
    socraticParentPractice: [
      "Clear visual clutter from the table before starting one puzzle, workbook page, or wood/block project.",
      "Protect uninterrupted play blocks—avoid interrupting a child who is deeply absorbed in physical play."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/products/human-edge-focused",
    matchingBookHandles: ["human-edge-focused", "big-pre-k-learning-workbook", "human-virtues-box-bundle"]
  },
  {
    id: "virtue-listening",
    category: "character_virtue",
    term: "Active Listening",
    title: "Listening (Amara & Rabbit in the Treehouse) — Hearing Others Without Interrupting",
    ageRelevance: "3–7 years",
    keywords: ["listening", "interrupting", "following directions", "communication", "active listening", "respect"],
    parentScenarios: [
      "Children's book for a child who interrupts constantly or struggles to listen",
      "Kindergarten readiness books on listening and group conversation"
    ],
    scientificAndPedagogicalExplanation:
      "Listening is more than staying quiet—it is tuning attention outward to catch details and understand another person's thought. Amara & Rabbit turn attentive listening into a superpower in the treehouse.",
    socraticParentPractice: [
      "Play the '20-Second Rabbit Ears Game'—sit still together and count every distinct sound indoors and outdoors.",
      "Practice repeating back a sibling's or friend's idea before adding your own."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/products/human-edge-listening",
    matchingBookHandles: ["human-edge-listening", "human-edge-empathetic"]
  },
  {
    id: "virtue-honest",
    category: "character_virtue",
    term: "Honesty & Integrity",
    title: "Honest (Mateo & Deer on the Forest Trail) — Truth-Telling & Repairing Trust",
    ageRelevance: "3–7 years",
    keywords: ["honest", "honesty", "lying", "telling the truth", "integrity", "trust", "owning mistakes"],
    parentScenarios: [
      "Age-appropriate book for a 4- or 6-year-old starting to fib or hide accidents",
      "Teaching kids integrity and owning mistakes safely"
    ],
    scientificAndPedagogicalExplanation:
      "Young children typically fib out of fear of disconnection. Mateo & Deer show how speaking the truth—even with a nervous stomach—lifts secrecy and strengthens trust.",
    socraticParentPractice: [
      "Thank your child calmly whenever they tell a hard truth first, separating honesty from repair steps.",
      "Ask: 'How did Mateo's chest and shoulders feel once the truth was out in the open?'"
    ],
    canonicalEssayUrl: "https://humanedgepress.com/products/human-edge-honest",
    matchingBookHandles: ["human-edge-honest", "human-edge-brave"]
  },
  {
    id: "virtue-empathetic",
    category: "character_virtue",
    term: "Empathy & Emotional Presence",
    title: "Empathetic (Sofia & Elephant by the Stream) — Understanding Another's Heart",
    ageRelevance: "3–7 years",
    keywords: ["empathetic", "empathy", "feelings", "compassion", "big emotions", "comforting friends", "sel"],
    parentScenarios: [
      "Social-emotional learning books teaching empathy and perspective-taking",
      "Helping siblings understand each other's feelings"
    ],
    scientificAndPedagogicalExplanation:
      "Empathy pairs cognitive perspective-taking ('How might it feel in their shoes?') with warm presence. Sofia & Elephant model sitting alongside someone's big feelings without dismissing them.",
    socraticParentPractice: [
      "Pause during read-alouds to look at character posture and eyes: 'What is his body telling us right now?'",
      "Model naming feelings accurately at home without rushing to minimize them."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/products/human-edge-empathetic",
    matchingBookHandles: ["human-edge-empathetic", "human-edge-kind", "baby-faces-high-contrast-board-book"]
  },
  {
    id: "virtue-curious-creative-thankful-helpful",
    category: "character_virtue",
    term: "Curiosity, Creativity, Gratitude & Helpfulness",
    title: "Wonder, Invention, Gratitude & Contribution in Daily Family Life",
    ageRelevance: "3–7 years",
    keywords: ["curious", "creative", "thankful", "gratitude", "helpful", "chores", "entitlement", "boredom"],
    parentScenarios: [
      "Books to counter 'I'm bored!' or holiday entitlement with gratitude and creativity",
      "Encouraging preschoolers to pitch in cheerfully around the house"
    ],
    scientificAndPedagogicalExplanation:
      "Unstructured screen-free afternoons unlock four sister virtues: Curiosity (Maya & Fox noticing questions), Creativity (Ruby & Octopus inventing from constraints), Gratitude (Priya & Firefly savoring simple gifts), and Helpfulness (Amina & Dolphin contributing meaningfully).",
    socraticParentPractice: [
      "End dinner with Priya & Firefly's ritual: 'What are three small things we noticed and appreciated today?'",
      "Give young children real, dignified household contributions alongside Amina & Dolphin."
    ],
    canonicalEssayUrl: "https://humanedgepress.com/collections/human-edge-series",
    matchingBookHandles: [
      "human-edge-curious",
      "human-edge-creative",
      "human-edge-thankful",
      "human-edge-helpful",
      "human-virtues-box-bundle"
    ]
  }
];

export function buildLiveDevelopmentalConcordance(books: BookProduct[]) {
  const byHandle = new Map(books.map((b) => [b.handle, b]));
  return DEVELOPMENTAL_AND_VIRTUE_CONCORDANCE.map((entry) => ({
    ...entry,
    matchedBooks: entry.matchingBookHandles
      .map((h) => byHandle.get(h))
      .filter((b): b is BookProduct => Boolean(b))
      .map((b) => ({
        title: b.title,
        handle: b.handle,
        series: b.series,
        ageStage: b.ageStage,
        priceFormatted: b.priceFormatted,
        url: b.url,
        checkoutUrl: b.variants[0]?.checkoutUrl || b.url,
        parentPrompts: b.pedagogy.parentPrompts
      }))
  }));
}

// ---------------------------------------------------------------------------
// 2. Socratic Reading & Unit Study Playbooks (6 Actionable Guides)
// ---------------------------------------------------------------------------

export const SOCRATIC_PLAYBOOK_GUIDES: SocraticPlaybookGuide[] = [
  {
    id: "guide:analog-roots-0-to-7",
    slug: "analog-roots-0-to-7",
    title: "Analog Roots First, Digital Wings Later: The Ages 0–7 Screen-Free Blueprint",
    canonicalUrl: "https://humanedgepress.com/pages/socratic-homeschooling",
    ageRange: "0–7 years",
    summary:
      "Why the first seven years belong to real pages, wooden blocks, outdoor play, and a caregiver's live voice—and how to set up a low-stress screen-free home rhythm.",
    keywords: ["analog roots", "screen free", "ages 0-7", "transfer deficit", "home rhythm", "montessori", "waldorf"],
    recommendedBookHandles: [
      "master-screen-free-chest-bundle",
      "newborn-sensory-starter-bundle",
      "steam-little-thinkers-bundle",
      "human-virtues-box-bundle"
    ],
    bodyMarkdown: `# Analog Roots First, Digital Wings Later (Ages 0–7 Blueprint)

## Why Ages 0–7 Are Neurobiologically Distinct
Between birth and age seven, the human brain builds foundational circuits for **sustained visual-spatial attention, emotional self-regulation, phonemic language, and sensorimotor agency**. Touchscreens compress three dimensions into two and replace slow intrinsic curiosity with rapid extrinsic reward cues—creating the well-documented **2D Transfer Deficit**.

## The 4-Part Daily Screen-Free Rhythm
1. **Morning Basket Read-Aloud (10–15 min)**: Keep 3–5 age-matched physical books in an open basket by the breakfast table. Read one STEAM or Virtue book before any adult screens come out.
2. **Tactile Open-Ended Play**: Pair books with simple physical materials—wooden blocks, crayons, playdough, magnifiers, kitchen spoons, or outdoor sticks.
3. **Socratic Mealtime Check-In**: Ask one open-ended question from tonight's story (*"Who did Caleb notice?"* or *"Where did we see engineering today?"*).
4. **Unhurried Bedtime Wind-Down**: Warm lamp light + physical hardcover pages protect natural melatonin and turn bedtime into secure connection.`
  },
  {
    id: "guide:socratic-read-aloud-method",
    slug: "socratic-read-aloud-method",
    title: "The Socratic Read-Aloud Method: How to Ask Open-Ended Questions Without Quizzing",
    canonicalUrl: "https://humanedgepress.com/pages/socratic-homeschooling",
    ageRange: "2–8 years",
    summary:
      "A practical parent & homeschooler guide to replacing closed 'What color is that?' test questions with genuine Socratic wonder using LOOK • TRY • TALK • PLAY.",
    keywords: ["socratic", "read aloud", "questions to ask kids", "homeschooling", "dialogic reading", "comprehension"],
    recommendedBookHandles: [
      "human-virtues-box-bundle",
      "human-edge-curious",
      "human-edge-listening",
      "human-edge-empathetic"
    ],
    bodyMarkdown: `# The Socratic Read-Aloud Method (Ages 2–8)

## Why Quizzing Shuts Down Wonder—and Socratic Inquiry Opens It
Many adults accidentally turn storytime into a pop quiz (*"What letter is this? What color is his hat?"*). Closed questions have one right answer and end the conversation. **Socratic reading** invites observation, empathy, and original reasoning.

## The 4-Step Human Edge Prompt Sequence
1. **LOOK (Pure Observation)**: *"Pause right here—what small detail do you notice in the picture that we almost missed?"*
2. **FEEL / WONDER (Perspective-Taking)**: *"Look at Zuri's shoulders—how do you think she's feeling right before she steps into the meadow?"*
3. **CONNECT (Real-World Bridge)**: *"Has something like that ever happened to us at the park or in our kitchen?"*
4. **TRY / IMAGINE (Agency)**: *"If Theo and Beaver asked us to help rebuild their riverbank plan, what would we try next?"*

## Golden Rule for Parents
Never rush past silence. Count quietly to **five full seconds** after asking a question—young children do their deepest thinking in that quiet pause.`
  },
  {
    id: "guide:infant-high-contrast-reading-routine",
    slug: "infant-high-contrast-reading-routine",
    title: "Newborn-to-Toddler High-Contrast Reading Guide (Months 0–24)",
    canonicalUrl: "https://humanedgepress.com/collections/high-contrast-baby-books",
    ageRange: "0–24 months",
    summary:
      "Month-by-month developmental guide for using high-contrast black-and-white board books for optic nerve stimulation, tummy time, and early babbling.",
    keywords: ["newborn reading", "high contrast guide", "tummy time", "0-3 months", "3-6 months", "baby shower"],
    recommendedBookHandles: [
      "newborn-sensory-starter-bundle",
      "baby-faces-high-contrast-board-book",
      "animal-friends-high-contrast-board-book",
      "little-hands-high-contrast-board-book"
    ],
    bodyMarkdown: `# Month-by-Month High-Contrast Reading Routine (0–24 Months)

- **Months 0–3 (Focal Distance & Fixation)**: Hold *Baby Faces* or *Smart Future* **8 to 12 inches** from your newborn's eyes during calm alert windows (2–5 minutes). Let their eyes lock onto one high-contrast spread without flipping quickly.
- **Months 3–6 (Tummy Time & Tracking)**: Stand *Animal Friends* or *Our World* upright on the floor mat to encourage neck/shoulder strength and horizontal tracking. Copy expressions and animal sounds.
- **Months 6–12 (Grasping & Serve-and-Return)**: Let your baby hold the rounded thick board corners of *Little Hands* and help turn pages. Pause 5 seconds whenever they point or vocalize.
- **Months 12–24 (First Words & Real-World Matching)**: Carry *Big Machines* and *Our World* on stroller walks to connect 2D high-contrast silhouettes to real trucks, trees, dogs, and hands.`
  },
  {
    id: "guide:screen-free-steam-at-home",
    slug: "screen-free-steam-at-home",
    title: "5-Day Screen-Free Kitchen-Table STEAM Unit Study (Ages 2–5)",
    canonicalUrl: "https://humanedgepress.com/collections/steam-board-books",
    ageRange: "2–5 years",
    summary:
      "A zero-prep 5-day homeschool or after-preschool mini-curriculum pairing each Ethan Finch STEAM Alphabet board book with a 10-minute hands-on activity.",
    keywords: ["unit study", "steam activities", "preschool curriculum", "homeschool schedule", "toddler stem"],
    recommendedBookHandles: [
      "steam-little-thinkers-bundle",
      "s-is-for-science-steam-alphabet-board-book",
      "t-is-for-technology-steam-alphabet-board-book",
      "e-is-for-engineering-steam-alphabet-board-book",
      "a-is-for-art-steam-alphabet-board-book",
      "m-is-for-math-steam-alphabet-board-book"
    ],
    bodyMarkdown: `# 5-Day Screen-Free Kitchen-Table STEAM Unit Study (Ages 2–5)

- **Monday — Science (*S is for Science*)**: Fill a clear bowl with water; gather 5 household objects (cork, spoon, leaf, coin, apple slice). Ask *"Sink or float?"* before each drop.
- **Tuesday — Technology (*T is for Technology*)**: Go on a 'Human Tool Hunt'—find a lever (spoon opening a lid), a hinge (cabinet door), and a wheel.
- **Wednesday — Engineering (*E is for Engineering*)**: Build a bridge across two books using folded index cards vs. flat paper—test how many pennies each holds!
- **Thursday — Art (*A is for Art*)**: Make outdoor bark and leaf rubbings with peeled wax crayons to study texture, line, and pattern.
- **Friday — Math (*M is for Math*)**: Bake or prepare a snack together—counting, halving, sorting by size, and building ABAB fruit patterns.`
  },
  {
    id: "guide:teen-focus-and-social-media-rules",
    slug: "teen-focus-and-social-media-rules",
    title: "Rebuilding Teen Focus: Three Ground Rules From 'The Cortical Thickness Crisis'",
    canonicalUrl: "https://humanedgepress.com/pages/teen-social-media",
    ageRange: "12–18 years",
    summary:
      "Practical neuroscience-backed family guardrails to protect adolescent sleep, cortical stamina, and C-tactile real-world engagement.",
    keywords: ["teen screen time rules", "phone boundaries", "social media detox", "adolescent focus", "cortical thickness"],
    recommendedBookHandles: ["human-edge-focused", "human-edge-patient", "human-edge-persistent"],
    bodyMarkdown: `# Three Ground Rules for Teen Social Media & Deep Focus

1. **Protect the Prefrontal Sleep Sanctuary**: Zero phones, tablets, or laptops inside bedrooms overnight. Dock all family devices—parents included—in a central kitchen charging station 60 minutes before sleep.
2. **Eliminate Short-Form Variable-Ratio Feeds Early**: Delay algorithmic infinite-scroll platforms while prefrontal impulse circuits mature; distinguish intentional communication/creation tools from 6-second dopamine feeds.
3. **Anchor Daily C-Tactile & Long-Form Stamina**: Pair daily physical embodiment (sports, instruments, cooking, woodworking) with progressive long-form print reading to rebuild 45-minute uninterrupted concentration blocks.`
  },
  {
    id: "guide:young-adult-human-veto-ai-guide",
    slug: "young-adult-human-veto-ai-guide",
    title: "Cultivating 'The Human Veto': Four Rules for Young Adults in an AI-Automated World",
    canonicalUrl: "https://humanedgepress.com/pages/young-adults-ai",
    ageRange: "16–25 years",
    summary:
      "How students and young adults build un-automatable judgment, a Specific Knowledge Stack, and original taste in the age of generative AI.",
    keywords: ["young adults ai", "human veto", "career moat", "college students ai", "taste and judgment"],
    recommendedBookHandles: ["human-edge-curious", "human-edge-creative", "human-edge-honest"],
    bodyMarkdown: `# Four Rules for Navigating an AI-Automated Future (The Human Veto)

1. **Think on Paper First, Prompt Second**: Never ask an AI to think before sketching your own rough outline, hypothesis, or argument by hand—preserving primary cognitive ownership.
2. **Exercise The Human Veto Ruthlessly**: Treat model outputs as junior statistical drafts requiring primary-source verification, ethical scrutiny, and editorial taste.
3. **Build an Unusual Specific Knowledge Stack**: Combine deep technical literacy with un-automatable human crafts, primary historical/literary texts, and real-world field experience.
4. **Reclaim the Unplugged Afternoon**: Guard multi-hour blocks with zero notifications to read whole books and build real projects—where non-consensus insights actually form.`
  }
];

// ---------------------------------------------------------------------------
// 3. Official Publisher, Parenting & Order FAQs
// ---------------------------------------------------------------------------

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-what-is-human-edge-press",
    question: "What is Human Edge Press and why are your books 100% screen-free?",
    category: "Mission & Philosophy",
    keywords: ["human edge press", "about", "screen-free", "philosophy", "analog roots", "austin"],
    answer:
      "Human Edge Press is an independent children's publisher headquartered in Austin, Texas ('Analog Roots First, Digital Wings Later'). We publish 100% physical, neuroscience-backed books for ages 0–8—including High-Contrast Baby Board Books (ages 0–2), Ethan Finch's STEAM Alphabet Board Books (ages 2–4), Pre-K Workbooks (ages 3–5), and The Human Edge Hardcover Virtue Series (ages 3–7)—designed with Socratic parent prompts to build deep focus, curiosity, and character without apps, QR codes, or batteries.",
    relatedBookHandles: ["master-screen-free-chest-bundle", "human-virtues-box-bundle"],
    canonicalUrl: "https://humanedgepress.com/pages/socratic-homeschooling"
  },
  {
    id: "faq-which-age-stage-book",
    question: "Which Human Edge Press books fit my child's age (newborn, toddler, preschool, or early elementary)?",
    category: "Age & Stage Selection",
    keywords: ["age", "stage", "which book", "newborn", "1 year old", "2 year old", "3 year old", "4 year old", "5 year old", "6 year old"],
    answer:
      "Our catalog is organized by developmental stage: • Ages 0–2 (Stage 1): High-Contrast Baby Board Books (6 titles + Newborn Sensory Starter 3-Book Box Set) for visual tracking and serve-and-return bonding. • Ages 2–4 (Stage 2): STEAM Alphabet Board Books (Science, Technology, Engineering, Art, Math + 3-Book Box Set) plus upcoming Oddlings Workbooks (ages 2–5). • Ages 3–5 (Pre-K): Big Pre-K Learning Workbook + upcoming First Think First Words (ages 4–5). • Ages 3–7 (Stage 3): The Human Edge Hardcover Virtue Series (12 child-and-animal storybooks with parent prompts + 5-Book Core Box Set). • Ages 0–7 Complete Library: The 23-Book Master Developmental Library Chest ($199.99).",
    relatedBookHandles: [
      "newborn-sensory-starter-bundle",
      "steam-little-thinkers-bundle",
      "big-pre-k-learning-workbook",
      "human-virtues-box-bundle",
      "master-screen-free-chest-bundle"
    ],
    canonicalUrl: "https://humanedgepress.com/collections/all"
  },
  {
    id: "faq-shipping-rates-and-speed",
    question: "How much does shipping cost and how fast do Human Edge Press orders arrive?",
    category: "Shipping & Fulfillment",
    keywords: ["shipping", "delivery", "free shipping", "how long", "tracking", "rates"],
    answer:
      "Orders placed Monday–Friday are packed in protective eco-friendly packaging and dispatched within 1–2 business days (24–48 hours) with real-time email tracking. Standard US Ground transit is 3–5 business days: $4.99 flat rate on smaller orders, and FREE US Standard Shipping on qualifying orders ($49+ per /pages/shipping; $50+ noted in the site header—every multi-book Box Set and the Master Chest qualify automatically).",
    relatedBookHandles: ["newborn-sensory-starter-bundle", "steam-little-thinkers-bundle", "human-virtues-box-bundle"],
    canonicalUrl: "https://humanedgepress.com/pages/shipping"
  },
  {
    id: "faq-returns-and-guarantee",
    question: "What is your return policy and 30-Day Family Guarantee?",
    category: "Returns & Guarantee",
    keywords: ["return", "refund", "exchange", "guarantee", "30 day", "free return"],
    answer:
      "Every physical book is backed by our 30-Day Family Guarantee: you may request a 100% refund or exchange within 30 days of delivery with $0.00 return shipping and restocking (free prepaid return label) and 3–5 business day refund processing. Items must be in new, unused condition with no missing pages, writing, or permanent marks; contact support@humanedgepress.com with your order number or checkout email.",
    relatedBookHandles: ["master-screen-free-chest-bundle"],
    canonicalUrl: "https://humanedgepress.com/pages/returns"
  },
  {
    id: "faq-bulk-schools-coops",
    question: "Do you offer wholesale or bulk orders for schools, libraries, Montessori classrooms, and homeschool co-ops?",
    category: "Schools, Libraries & Wholesale",
    keywords: ["bulk", "wholesale", "school", "library", "homeschool co-op", "classroom", "discount"],
    answer:
      "Yes! Human Edge Press supports bulk orders for preschools, elementary classrooms, public/church libraries, pediatric clinics, and homeschool co-ops. Reach our Austin team via https://humanedgepress.com/pages/contact (select 'Wholesale, Library & Homeschool Co-op Orders') or email support@humanedgepress.com (average response time under 24 hours).",
    relatedBookHandles: ["master-screen-free-chest-bundle", "human-virtues-box-bundle", "steam-little-thinkers-bundle"],
    canonicalUrl: "https://humanedgepress.com/pages/contact"
  },
  {
    id: "faq-socratic-parent-prompts",
    question: "How do the parent conversation prompts inside The Human Edge Series work?",
    category: "Socratic Reading & Pedagogy",
    keywords: ["prompts", "conversation prompts", "how to read", "virtues", "character", "parent guide"],
    answer:
      "Every hardcover in The Human Edge Series (ages 3–7) pairs an engaging everyday story featuring a child-and-animal duo (like Caleb & Retriever in 'Kind' or Zuri & Robin in 'Brave') with 3 open-ended 'Read Together' conversation prompts for parents—moving naturally from story observation to empathy to a real-world action your child can try tomorrow, with zero preachy lecturing.",
    relatedBookHandles: ["human-edge-kind", "human-edge-brave", "human-edge-patient", "human-virtues-box-bundle"],
    canonicalUrl: "https://humanedgepress.com/collections/human-edge-series"
  }
];
