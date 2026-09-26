/**
 * ============================================================
 * Pre-written answers for the most commonly asked questions
 * ============================================================
 *
 * api/chat.js checks these before calling Pinecone or Gemini, so
 * the suggestion chips and common questions answer instantly and
 * keep working even when the LLM is unavailable.
 *
 * - `questions`: phrasings that should hit this answer. Matching
 *   ignores case, punctuation, and filler words like "her",
 *   "your", "Jyothsna's" (see normalizeQuestion below).
 * - Every suggestion chip in the chat widget (SUGGESTIONS in
 *   src/components/chat/ChatWidget.jsx) must match a question here
 *   so it answers instantly — keep them in sync if you change the
 *   chip text.
 *
 * Keep answers consistent with knowledge/about.txt.
 * (This is a .js file, so scripts/ingest.js won't ingest it.)
 * ============================================================
 */

export const FAQ = [
  // ---------- Suggestion chips ----------
  {
    questions: [
      'What are her top skills?',
      'What are her skills?',
      'What are her key skills?',
      'What is her tech stack?',
      'What technologies does she know?',
      'What technologies does she work with?',
    ],
    answer: `Jyothsna is a Forward Deployed Engineer with 4+ years of experience. Her strongest areas are:

- **AI & agentic systems:** AWS Bedrock AgentCore, Strands Agents, multi-agent orchestration, prompt engineering and prompt caching
- **Backend:** Node.js, Python (FastAPI), Rust, Express.js, REST APIs and serverless architecture
- **Cloud & DevOps:** AWS (Lambda, Step Functions, API Gateway, S3, SAM, CodePipeline), Docker, CI/CD
- **Databases:** PostgreSQL, DynamoDB, MongoDB
- **Frontend:** React, including complex interactive UIs such as PDF editing and real-time dashboards
- **Client engagement:** gathering requirements, scoping MVPs and communicating with stakeholders

She also takes projects end to end, from discovery through to production.`,
  },
  {
    questions: [
      'Tell me about her AI projects',
      'What AI projects has she built?',
      'What AI projects has she worked on?',
      'Show me her AI projects',
      'Tell me about her AI experience',
    ],
    answer: `Here are Jyothsna's main AI projects:

- **Internal AI Agent Platform (Cooper Standard):** A platform for developers to create, manage and deploy AI agents on AWS Bedrock AgentCore, with configurable system prompts and policy-based access control. It cut agent deployment time by 70% and lets 50+ developers build agents without AWS expertise.
- **SetuHaul Logistics:** A multi-agent system (Bedrock AgentCore + Strands Agents) that detects truck delays and other transport exceptions and alerts drivers and facility managers in real time. Prompt caching cut latency by 45%, and it handles 1,000+ alerts a day. [Live demo](https://sethaul.vercel.app/)
- **PizzaFlow:** A full ordering system for a local pizza shop, with a Gemini-powered support chatbot that answers menu questions and looks up order status. [Live demo](https://pizzeria-gamma-five.vercel.app/)
- **AI-Based Assessment Tool (freelance):** An assessment platform with LLM-powered automated grading and feedback, delivered as a working prototype in 8 weeks.
- **Resume Matcher:** An AI tool that matches resumes to roles for recruiters.`,
  },
  {
    questions: [
      'What is her current role?',
      'Where does she work?',
      'Where is she working now?',
      'What does she do currently?',
      'What is her current job?',
      'Where is she currently working?',
    ],
    answer: `Jyothsna has been an **AWS AI Developer at Cooper Standard, Chennai** since November 2025.

She architected and built an internal AI Agent platform that lets developers create, manage and deploy AI agents at scale:

- Built on AWS Bedrock AgentCore Runtime with policy-based access control
- Configurable system prompts with automated deployment (AWS SAM + CodePipeline)
- Reduced agent deployment time by **70%**, enabling **50+ internal developers** to build agents without AWS expertise

She is also completing the **Forward Deployed Engineer certification at FDE Academy**.`,
  },

  // ---------- Other common questions ----------
  {
    questions: [
      'Tell me about her experience',
      'What is her work experience?',
      'What is her experience?',
      'How many years of experience does she have?',
      'How much experience does she have?',
      'Where has she worked?',
      'What companies has she worked for?',
    ],
    answer: `Jyothsna has **4+ years** of professional experience:

- **AWS AI Developer, Cooper Standard** (Nov 2025 – present): Internal AI Agent platform on AWS Bedrock AgentCore
- **Freelance Developer** (Jun – Sep 2025): AI-based assessment platform, delivered in 8 weeks
- **Software Developer, Roanuz** (Nov 2022 – Nov 2025): Booking platform modules, a serverless catalog app, a Rust policy engine and an internal UI library, working directly with 5+ enterprise clients
- **Software Developer, Klenty** (Jun – Nov 2022): In-app notifications, analytics charts and Chargebee billing for a B2B SaaS product`,
  },
  {
    questions: [
      'What projects has she built?',
      'Tell me about her projects',
      'What are her projects?',
      'Show me her projects',
      'What are her best projects?',
    ],
    answer: `Some highlights:

- **Internal AI Agent Platform (Cooper Standard):** Cut agent deployment time by 70% for 50+ developers
- **SetuHaul Logistics:** Multi-agent exception alerts for trucking, 1,000+ alerts a day. [Live demo](https://sethaul.vercel.app/)
- **PizzaFlow:** Replaced a pizza shop's Google Form with a full ordering system, kitchen dashboard and Gemini chatbot, saving 4–6 hours of manual work a week. [Live demo](https://pizzeria-gamma-five.vercel.app/)
- **Serverless Catalog App (Roanuz):** A PDF-to-HTML pipeline that brought catalog viewing costs to zero, loads 60% faster and serves 10,000+ views a day
- **Rust Policy Engine (Roanuz):** B2B e-commerce pricing and access policies, 40% faster than the Node.js version
- **Internal UI Library (Roanuz):** Used across 4+ teams and 20+ projects, improving team velocity by 30%

Ask about any of these for more detail.`,
  },
  {
    questions: [
      'How can I contact her?',
      'How do I contact her?',
      'How can I reach her?',
      'What is her email?',
      'Contact details',
      'How can I get in touch with her?',
      'What is her LinkedIn?',
      'What is her GitHub?',
    ],
    answer: `You can reach Jyothsna here:

- **Email:** [jyotshnavellampalli@gmail.com](mailto:jyotshnavellampalli@gmail.com)
- **LinkedIn:** [linkedin.com/in/jyothsna-vellampalli](https://linkedin.com/in/jyothsna-vellampalli)
- **GitHub:** [github.com/JyothsnaVellampalli](https://github.com/JyothsnaVellampalli)

You can also use the contact section on this page.`,
  },
  {
    questions: [
      'What is her education?',
      'What did she study?',
      'Where did she study?',
      'What is her educational background?',
      'What degree does she have?',
    ],
    answer: `Jyothsna holds a **Bachelor of Mechanical Engineering** from **Jawaharlal Nehru Technological University (JNTU), Hyderabad**, graduating in May 2019 with a CGPA of 8.5/10.

She taught herself software development and moved into it through freelance work. She is now completing the **Forward Deployed Engineer certification at FDE Academy**.`,
  },
  {
    questions: [
      'Why should we hire her?',
      'Why is she a good fit for an FDE role?',
      'Why is she suited for FDE roles?',
      'What makes her a good Forward Deployed Engineer?',
      'What makes her stand out?',
      'Why hire her?',
    ],
    answer: `Jyothsna brings together the technical and client-facing sides of the FDE role:

- **Client problem solving:** 3+ years working directly with enterprise clients at Roanuz, turning vague requirements into shipped solutions
- **End-to-end ownership:** She takes projects from discovery to MVP to production, as with PizzaFlow and SetuHaul
- **Fast delivery:** She ships working systems in weeks, e.g. an AI assessment platform in 8 weeks
- **Production AI experience:** Multi-agent systems on AWS Bedrock AgentCore, with real improvements to latency and cost
- **Broad domain knowledge:** Real estate/booking, e-commerce, SaaS, logistics and manufacturing
- **Honest scoping:** She knows when to build an MVP and when AI is the right tool versus simpler automation`,
  },
  {
    questions: [
      'What AWS experience does she have?',
      'Does she know AWS?',
      'What AWS services has she used?',
      'Tell me about her cloud experience',
    ],
    answer: `Jyothsna uses AWS heavily in production:

- **AI:** Bedrock AgentCore Runtime and Gateway policy engines for multi-agent systems
- **Compute & APIs:** Lambda, API Gateway, SAM
- **Orchestration & CI/CD:** Step Functions, CodePipeline, CodeBuild, CodeArtifact
- **Data & storage:** DynamoDB, RDS/PostgreSQL, S3
- **Monitoring:** CloudWatch, X-Ray

Examples include an internal AI Agent platform at Cooper Standard and a serverless catalog pipeline at Roanuz that brought viewing costs to zero.`,
  },
  {
    questions: [
      'Does she know Rust?',
      'What is her Rust experience?',
      'Tell me about her Rust experience',
    ],
    answer: `Yes. At Roanuz, Jyothsna built a **Rust-based policy management engine** for a B2B e-commerce platform, covering pricing, discounts and access control.

- Type-safe policy enforcement improved security
- **40% faster** queries than the previous Node.js implementation
- Evaluates complex business rules at scale (Rust, PostgreSQL, REST APIs)`,
  },
]

// Words that don't change the meaning of a question, so "What are
// your top skills?" and "What are Jyothsna's top skills?" match the
// same entry as "What are her top skills?"
const FILLER_WORDS = new Set([
  'her', 'hers', 'she', 'your', 'you', 'his', 'he', 'their', 'they',
  'jyothsna', 'jyothsnas', 'jyothsna’s', 'vellampalli',
  'please', 'can', 'could', 'me', 'the', 'a', 'an',
])

export function normalizeQuestion(text) {
  return text
    .toLowerCase()
    .replace(/[’']s\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !FILLER_WORDS.has(w))
    .join(' ')
}

const FAQ_INDEX = new Map(
  FAQ.flatMap((entry) => entry.questions.map((q) => [normalizeQuestion(q), entry.answer])),
)

/** Returns a pre-written answer for the question, or null if there isn't one. */
export function findFaqAnswer(question) {
  return FAQ_INDEX.get(normalizeQuestion(question)) ?? null
}
