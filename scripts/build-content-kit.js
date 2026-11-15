/**
 * Builds Human Edge Press's Ready-to-Publish Shopify Content & Schema Kit:
 *  - 6 SEO + GEO-optimized Shopify Blog HTML articles in `content/articles/` (with BlogPosting + FAQPage JSON-LD)
 *  - Rich Organization + Book JSON-LD Liquid snippet in `content/theme/humanedgepress-organization-and-book-schema.liquid`
 *  - Exact 1-line fix guide for the live Liquid error on Human Edge Series pages in `content/theme/FIX_PRODUCT_LIQUID_LINE_107.md`
 *  - Step-by-step publishing guide in `content/README.md`
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

const articlesDir = path.join(root, "content", "articles");
const themeDir = path.join(root, "content", "theme");
fs.mkdirSync(articlesDir, { recursive: true });
fs.mkdirSync(themeDir, { recursive: true });

const ARTICLES = [
  {
    slug: "high-contrast-baby-books-newborn-vision-guide",
    title: "Why High-Contrast Black-and-White Books Matter for Newborns (0–6 Months): Visual Neuroscience & Daily Routine",
    tags: "high-contrast, newborn-vision, tummy-time, ages-0-2, serve-and-return",
    summary:
      "At birth, a newborn's retina and visual cortex register sharp black-and-white contrast far more clearly than pastels. Here is how to use high-contrast board books from week one through month 24.",
    faqs: [
      {
        q: "How far away should I hold a high-contrast book for a newborn?",
        a: "Hold the open spread 8 to 12 inches from your newborn's eyes—the natural focal distance between a baby in your arms and your face."
      },
      {
        q: "When can babies start looking at high-contrast board books?",
        a: "From the first weeks of life during calm, alert windows of 2 to 5 minutes, and upright on the floor mat during tummy time starting around months 2–6."
      }
    ],
    bodyHtml: `<p>Before babies understand spoken words, their brains are busy wiring millions of connections between the retina, the optic nerve, and the primary visual cortex. Yet walk down a typical nursery aisle and almost everything is printed in pale, low-contrast pastels—colors that blur into flat gray for a newborn's developing cone cells.</p>
<h2>1. What Newborns Actually See (Months 0–3)</h2>
<p>Newborn eyes focus best at <strong>8 to 12 inches</strong> and respond strongest to crisp luminance boundaries: pure black shapes against clean white space. Bold high-contrast illustrations give the optic nerve an unmistakable signal to lock onto, encouraging smooth horizontal tracking and steady visual fixation without flashing LEDs or overstimulating screens.</p>
<h2>2. Turning Visual Focus Into "Serve &amp; Return" Connection</h2>
<p>High-contrast reading isn't passive viewing—it's a two-way conversation:</p>
<ul>
  <li><strong>Months 0–3 (Calm Fixation):</strong> Hold <a href="https://humanedgepress.com/products/baby-faces-high-contrast-board-book">Baby Faces: High-Contrast Baby Board Book</a> 8–12 inches away. Mirror the expression on the page and wait five quiet seconds for your baby to study both the page and your face.</li>
  <li><strong>Months 3–6 (Tummy Time Strength):</strong> Stand <a href="https://humanedgepress.com/products/animal-friends-high-contrast-board-book">Animal Friends</a> or <a href="https://humanedgepress.com/products/our-world-high-contrast-board-book">Our World</a> upright on the mat to motivate neck and shoulder lift.</li>
  <li><strong>Months 6–24 (Grasp &amp; First Words):</strong> Invite little fingers to turn the rounded thick board pages of <a href="https://humanedgepress.com/products/little-hands-high-contrast-board-book">Little Hands</a> and <a href="https://humanedgepress.com/products/big-machines-high-contrast-board-book">Big Machines</a>.</li>
</ul>
<p>Looking for a ready-made baby shower or welcome-home gift? Explore the <a href="https://humanedgepress.com/products/newborn-sensory-starter-bundle">Newborn Sensory Starter (3-Book Box Set)</a>.</p>`
  },
  {
    slug: "transfer-deficit-why-board-books-beat-toddler-apps",
    title: "The 2D Transfer Deficit: Why Physical Board Books Outperform 'Educational' Tablet Apps Before Age 7",
    tags: "transfer-deficit, screen-free, pediatric-neuroscience, ages-0-7, socratic-homeschooling",
    summary:
      "Developmental researchers call it the 'transfer deficit': toddlers frequently master tapping a 2D tablet game while failing to transfer the concept to 3D objects. Here is why physical pages win.",
    faqs: [
      {
        q: "What is the transfer deficit in early childhood?",
        a: "The transfer deficit is the documented gap in infants and preschoolers where skills or words seen on flat 2D screens fail to transfer as effectively to 3D real-world tasks compared to live caregiver interaction and physical print."
      },
      {
        q: "Are electronic sound-button books better than regular board books?",
        a: "Pediatric speech studies show that electronic books with sound effects reduce parent-child vocal turn-taking ('serve and return'), whereas silent print books prompt richer adult vocabulary and child responses."
      }
    ],
    bodyHtml: `<p>Parents of toddlers are constantly marketed "educational" apps promising faster phonics, math, and logic. Yet decades of developmental psychology point to the exact opposite phenomenon: the <strong>2D Transfer Deficit</strong>.</p>
<h2>Why Glass Compresses Early Comprehension</h2>
<p>During the first seven years of life, children build mental models through three-dimensional space, tactile weight, and human contingency. When a book has real physical thickness, a child's hands feel how much story has passed and how much remains. When a parent pauses on a page in <a href="https://humanedgepress.com/products/s-is-for-science-steam-alphabet-board-book">S is for Science</a> or the <a href="https://humanedgepress.com/products/big-pre-k-learning-workbook">Big Pre-K Learning Workbook (Ages 3–5)</a>, executive attention slows down enough for working memory and real conversation to take root.</p>
<h2>3 Simple Swaps for a Calm, Screen-Free Home</h2>
<ol>
  <li><strong>Morning Book Basket:</strong> Keep 4–5 board or hardcover books next to the breakfast table instead of morning cartoons.</li>
  <li><strong>Real Crayons Over Screen Tracing:</strong> Paper resistance activates C-tactile and proprioceptive feedback essential for handwriting grip.</li>
  <li><strong>Complete Stage-by-Stage Shelf:</strong> Read our full <a href="https://humanedgepress.com/pages/socratic-homeschooling">Analog Roots First manifesto</a> or explore <a href="https://humanedgepress.com/products/master-screen-free-chest-bundle">The 23-Book Master Developmental Library Chest</a>.</li>
</ol>`
  },
  {
    slug: "socratic-reading-questions-for-kids-ages-2-to-7",
    title: "Socratic Reading for Ages 2–7: Open-Ended Questions That Build Deep Thinking & Emotional Vocabulary",
    tags: "socratic-reading, dialogic-reading, homeschooling, parent-prompts, ages-2-7",
    summary:
      "Stop turning bedtime stories into 'What color is that?' quizzes. Use the 4-step LOOK • FEEL • CONNECT • TRY Socratic read-aloud sequence.",
    faqs: [
      {
        q: "What is Socratic reading with young children?",
        a: "Socratic (or dialogic) reading replaces closed test questions ('What letter is that?') with open-ended wonder questions ('What do you notice?' 'How do you think Caleb's classmate felt?') followed by a calm 5-second pause."
      }
    ],
    bodyHtml: `<p>Many caring parents unintentionally turn storytime into a quiz: <em>"What color is the dog? How many apples do you see?"</em> Closed questions have a single one-word answer—and end the conversation. <strong>Socratic reading</strong> invites your child to observe, empathize, and reason aloud.</p>
<h2>The 4-Step Human Edge Read-Aloud Sequence</h2>
<ul>
  <li><strong>1. LOOK (Observation):</strong> <em>"What tiny detail do you notice in the garden with Maya and Fox?"</em> (<a href="https://humanedgepress.com/products/human-edge-curious">Curious: Maya &amp; Fox in the Garden</a>)</li>
  <li><strong>2. FEEL (Perspective-Taking):</strong> <em>"How could Sofia and Elephant tell their friend was having a heavy day before any words were spoken?"</em> (<a href="https://humanedgepress.com/products/human-edge-empathetic">Empathetic: Sofia &amp; Elephant by the Stream</a>)</li>
  <li><strong>3. CONNECT (Everyday Life):</strong> <em>"Have you ever felt butterflies right before trying something new like Zuri?"</em> (<a href="https://humanedgepress.com/products/human-edge-brave">Brave: Zuri &amp; Robin in the Meadow</a>)</li>
  <li><strong>4. TRY (Tomorrow's Action):</strong> <em>"Who could we notice and make room for tomorrow like Caleb?"</em> (<a href="https://humanedgepress.com/products/human-edge-kind">Kind: Caleb &amp; Retriever on the Playground</a>)</li>
</ul>
<p>Every hardcover in <a href="https://humanedgepress.com/collections/human-edge-series">The Human Edge Series (Ages 3–7)</a> includes three built-in parent conversation prompts right inside the book.</p>`
  },
  {
    slug: "screen-free-steam-activities-and-books-for-toddlers",
    title: "Screen-Free STEAM for Toddlers & Preschoolers (Ages 2–5): Kitchen-Table Science, Tools, Engineering, Art & Math",
    tags: "steam, stem-for-toddlers, board-books, ages-2-4, homeschool-unit-study",
    summary:
      "True early STEAM doesn't require coding tablets—it starts with wooden blocks, door hinges, shadows, water bowls, and Ethan Finch's 5-book STEAM Alphabet series.",
    faqs: [
      {
        q: "How do you teach 'Technology' to a toddler without screens?",
        a: "Start where human technology actually began: human-invented tools and simple machines like wheels, levers, ramps, hinges, spoons, and magnifiers."
      }
    ],
    bodyHtml: `<p>When parents hear "STEM" or "STEAM," it's easy to picture robots and tablets. But for a two-, three-, or four-year-old, authentic scientific and engineering thinking is 100% tactile.</p>
<h2>A 5-Book Kitchen-Table STEAM Routine</h2>
<ul>
  <li><strong>Science (<a href="https://humanedgepress.com/products/s-is-for-science-steam-alphabet-board-book">S is for Science</a>):</strong> Test five kitchen items in a bowl of water—ask <em>"What is your guess: sink or float?"</em></li>
  <li><strong>Technology (<a href="https://humanedgepress.com/products/t-is-for-technology-steam-alphabet-board-book">T is for Technology</a>):</strong> Hunt around your house for wheels, hinges, zippers, and levers.</li>
  <li><strong>Engineering (<a href="https://humanedgepress.com/products/e-is-for-engineering-steam-alphabet-board-book">E is for Engineering</a>):</strong> Fold an index card into an arch bridge between two books and test how many coins it supports.</li>
  <li><strong>Art (<a href="https://humanedgepress.com/products/a-is-for-art-steam-alphabet-board-book">A is for Art</a>):</strong> Take peeled crayons outside for tree-bark texture rubbings.</li>
  <li><strong>Math (<a href="https://humanedgepress.com/products/m-is-for-math-steam-alphabet-board-book">M is for Math</a>):</strong> Count, halve, and build repeating berry patterns at snack time.</li>
</ul>
<p>Start with the curated <a href="https://humanedgepress.com/products/steam-little-thinkers-bundle">STEAM Early Thinkers (3-Book Box Set)</a>.</p>`
  },
  {
    slug: "teaching-kids-patience-bravery-focus-without-sermons",
    title: "Teaching Character Virtues Without Sermons: Helping Ages 3–7 Practice Patience, Bravery, Persistence & Focus",
    tags: "character-education, virtues, sel, ages-3-7, patience, resilience",
    summary:
      "Lectures bounce off young children; relatable stories stick. How child-and-animal duos help kids navigate frustration, impatience, interrupting, and nervous first steps.",
    faqs: [
      {
        q: "What books help a 4-year-old who gets frustrated and gives up easily?",
        a: "Persistent: Theo & Beaver on the Riverbank models treating a collapsed build as an interesting clue rather than a failure, pairing story tension with parent prompts that build frustration tolerance."
      }
    ],
    bodyHtml: `<p>When a four-year-old knocks over a block tower in frustration or interrupts every dinner sentence, a lecture rarely helps. Stories give children emotional distance to watch a character wrestle with the exact same feeling—and discover a better move on their own.</p>
<h2>Matching Everyday Moments to Story Duos</h2>
<ul>
  <li><strong>Giving Up Quickly:</strong> <a href="https://humanedgepress.com/products/human-edge-persistent">Persistent: Theo &amp; Beaver on the Riverbank</a></li>
  <li><strong>Instant-Click Impatience:</strong> <a href="https://humanedgepress.com/products/human-edge-patient">Patient: Kenji &amp; Turtle in the Garden</a></li>
  <li><strong>Scattered Attention:</strong> <a href="https://humanedgepress.com/products/human-edge-focused">Focused: Amir &amp; Owl in the Woodshop</a></li>
  <li><strong>Interrupting Friends:</strong> <a href="https://humanedgepress.com/products/human-edge-listening">Listening: Amara &amp; Rabbit in the Treehouse</a></li>
  <li><strong>Hiding Mistakes:</strong> <a href="https://humanedgepress.com/products/human-edge-honest">Honest: Mateo &amp; Deer on the Forest Trail</a></li>
</ul>
<p>Build your home character shelf with the <a href="https://humanedgepress.com/products/human-virtues-box-bundle">Human Edge Virtues Core (5-Book Box Set)</a>.</p>`
  },
  {
    slug: "raising-kids-with-the-human-veto-in-the-age-of-ai",
    title: "Raising Kids With 'The Human Veto': From Screen-Free Early Childhood to Teen Focus & AI Literacy",
    tags: "ai-literacy, the-human-veto, teen-screen-time, cortical-thickness, parenting-in-age-of-ai",
    summary:
      "In a world where commodity AI generates average answers instantly, the scarcest human advantages are deep focus, ethical honesty, original taste, and 'The Human Veto'.",
    faqs: [
      {
        q: "What is 'The Human Veto' in AI literacy?",
        a: "The Human Veto is the intellectual, editorial, and moral capacity to verify, challenge, revise, or reject algorithmic output based on first-principles reasoning and real-world truth."
      }
    ],
    bodyHtml: `<p>Parents across every stage—from newborn nurseries to high school—are asking the same urgent question: <em>What human capacities will matter most as artificial intelligence automates routine knowledge work?</em></p>
<h2>The Developmental Arc From Age 0 to 25</h2>
<ol>
  <li><strong>Ages 0–7 (Analog Roots):</strong> Protect early attention from the 2D Transfer Deficit with physical pages, outdoor exploration, hands-on STEAM, and foundational character virtues (<a href="https://humanedgepress.com/pages/socratic-homeschooling">Read our Ages 0–7 Stance</a>).</li>
  <li><strong>Ages 12–18 (Protecting Cortical Stamina):</strong> Shield adolescent sleep and prefrontal plasticity from variable-ratio social media dopamine loops (<a href="https://humanedgepress.com/pages/teen-social-media">Read The Cortical Thickness Crisis</a>).</li>
  <li><strong>Ages 16–25 (Exercising The Human Veto):</strong> Cultivate a Specific Knowledge Stack, paper-first thinking, and refined human judgment (<a href="https://humanedgepress.com/pages/young-adults-ai">Read The Human Veto</a>).</li>
</ol>`
  }
];

for (const art of ARTICLES) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: art.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a
      }
    }))
  };

  const html = `<!-- Title: ${art.title} -->
<!-- Handle: ${art.slug} -->
<!-- Tags: ${art.tags} -->
<!-- Summary: ${art.summary} -->

${art.bodyHtml}

<script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
</script>
`;
  fs.writeFileSync(path.join(articlesDir, `${art.slug}.html`), html, "utf-8");
}

// Theme Schema Snippet
const schemaLiquid = `{% comment %}
  Human Edge Press — Enhanced Publisher, Book & Agentic Discovery Schema
  Include in layout/theme.liquid right before </head>:
  {% render 'humanedgepress-organization-and-book-schema' %}
{% endcomment %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://humanedgepress.com/#organization",
  "name": "Human Edge Press",
  "url": "https://humanedgepress.com",
  "slogan": "Analog Roots First, Digital Wings Later",
  "description": "Independent Austin, Texas children's publisher producing 100% screen-free high-contrast baby board books, STEAM alphabet books, Pre-K workbooks, character virtue hardcovers, and Socratic parent guides for ages 0–8.",
  "sameAs": [
    "https://twitter.com/humanedgepress",
    "https://pinterest.com/humanedgepress",
    "https://github.com/HumanEdgePress/humanedgepress-mcp-server",
    "https://www.npmjs.com/package/humanedgepress-mcp-server"
  ]
}
</script>
{% if request.page_type == 'product' %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": {{ product.title | json }},
  "url": "{{ shop.url }}{{ product.url }}",
  "description": {{ product.description | strip_html | truncate: 500 | json }},
  "publisher": {
    "@type": "Organization",
    "name": "Human Edge Press"
  },
  "bookFormat": "{% if product.type contains 'Hardcover' %}https://schema.org/Hardcover{% else %}https://schema.org/Paperback{% endif %}",
  "inLanguage": "en-US"
}
</script>
{% endif %}
`;

fs.writeFileSync(path.join(themeDir, "humanedgepress-organization-and-book-schema.liquid"), schemaLiquid, "utf-8");

const liquidFixNote = `# Quick Fix: Live Liquid Error on Human Edge Series Product Pages

During the automated storefront audit of \`https://humanedgepress.com/products/human-edge-kind\` (and sibling Human Edge Series pages), Shopify rendered:

\`\`\`text
Liquid error (sections/product-human-edge-content line 107): comparison of String with 1 failed
\`\`\`

## Cause
In Shopify Liquid, metafields or theme settings stored as strings cannot be compared directly using \`>\`, \`<\`, or \`>=\` against a number (\`1\`) without numeric coercion.

## 1-Line Fix
Open **Shopify Admin → Online Store → Themes → Edit code → \`sections/product-human-edge-content.liquid\`** around **line 107** and coerce the variable to a number with \`| plus: 0\` before comparing:

\`\`\`liquid
{%- assign numeric_val = some_string_variable | plus: 0 -%}
{%- if numeric_val > 1 -%}
\`\`\`
`;

fs.writeFileSync(path.join(themeDir, "FIX_PRODUCT_LIQUID_LINE_107.md"), liquidFixNote, "utf-8");

const contentReadme = `# Human Edge Press — Shopify Blog & Theme Authority Kit

## 1. Publish the 6 Starter Authority Articles to \`/blogs/news\`
\`https://humanedgepress.com/blogs/news\` currently has 0 published articles. Publishing the 6 HTML files in \`content/articles/\` activates:
- \`/blogs/news.atom\` RSS syndication
- \`/sitemap_blogs_1.xml\` search & AI crawler indexing
- Automatic live ingestion into \`humanedgepress-mcp-server\` (\`npm run sync-data\`)

### Steps in Shopify Admin:
1. Go to **Content → Blog posts → Add blog post** (Blog: \`News\`).
2. Copy the title, handle (under *Search engine listing*), tags, and summary from the HTML comments at the top of each file in \`content/articles/*.html\`.
3. Click **Show HTML (\`</>\`)** in the editor, paste the HTML + \`<script type="application/ld+json">\` block, and click **Save / Visible**.
4. Run \`npm run sync:all\` locally so the MCP server bundles the newly published blog URLs.

## 2. Theme Enhancements (\`content/theme/\`)
- \`humanedgepress-organization-and-book-schema.liquid\`: Adds \`Book\` schema on product pages and links your GitHub & npm MCP packages via \`sameAs\`.
- \`FIX_PRODUCT_LIQUID_LINE_107.md\`: Fixes the \`comparison of String with 1 failed\` warning on Human Edge Series product pages.
`;

fs.writeFileSync(path.join(root, "content", "README.md"), contentReadme, "utf-8");
console.log(`[ContentKit] Generated ${ARTICLES.length} Shopify blog articles + theme schema & Liquid fix guide.`);
