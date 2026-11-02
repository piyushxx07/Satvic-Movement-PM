"use client";

import { PointerEvent, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import TargetCursor from "../../components/TargetCursor";
import { Iphone } from "@/components/ui/iphone";
import ProfileCard from "@/components/ui/profile-card";
import { LiquidMetalButton } from "@/components/ui/liquid-metal";

const Lanyard = dynamic(() => import("@/components/ui/Lanyard"), {
  ssr: false,
  loading: () => <div className="lanyard-loading">Preparing your card…</div>,
});

const brandName = "Satvic Movement";
const highlightDuration = (brandName.length - 1) * 45 + 520;

function renderJourneyParagraph(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part,
  );
}

type PointerPosition = { x: number; y: number };

const founderOfficeToolGroups = [
  {
    title: "FRONTEND & FULL-STACK",
    tools: [
      { name: "Next.js", slug: "nextdotjs", fallback: "N" },
      { name: "React", slug: "react", fallback: "R" },
      { name: "Tailwind CSS", slug: "tailwindcss", fallback: "TW" },
    ],
  },
  {
    title: "DATABASES & CACHING",
    tools: [
      { name: "PostgreSQL", slug: "postgresql", fallback: "PG" },
      { name: "MySQL", slug: "mysql", fallback: "MY" },
      { name: "SQL", slug: null, fallback: "SQL" },
      { name: "Redis", slug: "redis", fallback: "RE" },
    ],
  },
  {
    title: "API TESTING & BACKEND",
    tools: [
      { name: "Postman", slug: "postman", fallback: "PM" },
      { name: "Swagger / OpenAPI", slug: "swagger", fallback: "API" },
      { name: "cURL", slug: "curl", fallback: "cURL" },
    ],
  },
  {
    title: "PRODUCT & PRD SPECS",
    tools: [
      { name: "Notion", slug: "notion", fallback: "NO" },
      { name: "Jira", slug: "jira", fallback: "JI" },
      { name: "Confluence", slug: "confluence", fallback: "CO" },
      { name: "Linear", slug: "linear", fallback: "LI" },
    ],
  },
  {
    title: "UI/UX & PROTOTYPING",
    tools: [
      { name: "Figma", slug: "figma", fallback: "FI" },
      { name: "v0 by Vercel", slug: "v0", fallback: "v0" },
      { name: "Balsamiq", slug: "balsamiq", fallback: "BA" },
    ],
  },
  {
    title: "TESTING, QA & DEVOPS",
    tools: [
      { name: "BrowserStack", slug: "browserstack", fallback: "BS" },
      { name: "Lighthouse", slug: "lighthouse", fallback: "LH" },
      { name: "Git", slug: "git", fallback: "GI" },
      { name: "GitHub", slug: "github", fallback: "GH" },
      { name: "Docker", slug: "docker", fallback: "DO" },
    ],
  },
  {
    title: "AI & WORKFLOW AUTOMATION",
    tools: [
      { name: "Claude", slug: "anthropic", fallback: "CL" },
      { name: "ChatGPT", slug: "openai", fallback: "AI" },
      { name: "Make.com", slug: "make", fallback: "MA" },
      { name: "Supabase", slug: "supabase", fallback: "SU" },
    ],
  },
] as const;

const toolLogoSources: Record<string, string> = {
  Balsamiq: "https://balsamiq.com/favicon.ico",
  BrowserStack: "https://www.browserstack.com/favicon.ico",
  ChatGPT: "https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/openai.svg",
};

function ToolLogo({ name, slug, fallback }: { name: string; slug: string | null; fallback: string }) {
  const source = toolLogoSources[name] ?? (slug ? `https://cdn.simpleicons.org/${slug}` : null);
  const [logoFailed, setLogoFailed] = useState(!source);

  return (
    <span className="hire-tool-logo" aria-hidden="true">
      {source && !logoFailed
        ? <img src={source} alt="" onError={() => setLogoFailed(true)} />
        : <span className="hire-tool-logo-fallback">{fallback}</span>}
    </span>
  );
}

const projectJourney = [
  {
    id: 1,
    date: "2023 – 2024",
    theme: "Where it started",
    cards: [
      { title: "A New Beginning", paragraphs: ["Coming from an **Army background**, moving into civilian college life was a new experience. I started my B.Tech at Vishwakarma University, Pune, and began exploring web development."] },
      { title: "Building & Earning", paragraphs: ["I started building websites and turned my skills into freelance work. One of my first earnings went towards buying my own **scientific calculator**."] },
      { title: "Mivyapar — My First Venture", paragraphs: ["In March 2024, I **co-founded Mivyapar**, a website development venture. I led a **team of 7**, handled clients and project execution, and generated approximately **₹50,000 in revenue**."] },
    ],
  },
  {
    id: 2,
    date: "2024 – 2025",
    theme: "Learning to lead",
    cards: [
      { title: "Learning the Hard Side of Leadership", paragraphs: ["Mivyapar continued until August 2024, when internal team conflicts forced us to stop. I tried resolving them, but learned that **leading people is as challenging as building a business**."] },
      { title: "Leading My First Hackathon Team", paragraphs: ["I built and led my own hackathon team for the first time. When teammates felt exhausted, I kept them motivated, and we **secured 2 prizes**."] },
      { title: "Exploring Beyond College", paragraphs: ["I continued **freelancing and volunteering** at events and hackathons, gaining experience in coordination, teamwork, and working with different people."] },
    ],
  },
  {
    id: 3,
    date: "2025 – 2026",
    theme: "From building to solving business problems",
    cards: [
      { title: "Understanding Business", paragraphs: ["Joined a college counselling firm for an **8-month internship as a Business Developer**. Worked on requirement gathering, client handling, and understanding business needs."] },
      { title: "Building AI-Powered Solutions", paragraphs: ["Developed a college recommendation application using Django and MongoDB, based on **5,000 student records**. Also built an **AI-powered brochure generator** that reduced document creation from hours to **under 10 minutes**."] },
      { title: "Learning to Make Decisions", paragraphs: ["Managed Meta Ads campaigns with an approximately **$435 budget**, increasing engagement by **40%** and leads by **38%**. Presented campaign insights and recommendations to non-technical stakeholders."] },
    ],
  },
  {
    id: 4,
    date: "2026 – 2027",
    theme: "The next chapter",
    cards: [
      { title: "Looking Beyond the Classroom", paragraphs: ["Currently in my final year of B.Tech Computer Engineering, looking for opportunities to work on **meaningful business problems** and take greater responsibility."] },
      { title: "Ready for Bigger Challenges", paragraphs: ["I enjoy working at the intersection of **business, technology, communication, and execution**. I am comfortable learning new tools and figuring things out without waiting for detailed instructions."] },
      { title: "The Next Chapter — Satvic", paragraphs: ["I understand this is a **full-time role**, and I am ready to commit. I am also open to starting as an intern to demonstrate my capabilities.", "I want to work closely with the founders, **take ownership of projects, and turn ideas into reality**. That's the kind of work I want to do."] },
    ],
  },
];

const satvicFitPoints = [
  "I admire how Satvic is building a movement, not just a business, by helping people rethink their food and lifestyle choices.",
  "I have personally used Satvic's Enema Kit, and it was a meaningful experience for me. I also noticed a positive change in my hair fall, which made my connection with Satvic more personal.",
  "I believe food, nature, and everyday habits deserve more attention in a world that often looks for quick health solutions.",
  "I want to use my skills in technology, business, and execution to contribute to a mission that creates a positive impact on people's lives.",
];

function SatvicBrand() {
  const [pointer, setPointer] = useState<PointerPosition | null>(null);
  const [autoAnimating, setAutoAnimating] = useState(false);
  const characterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playNameAnimation = useCallback(() => {
    setAutoAnimating(true);
    if (animationTimer.current) clearTimeout(animationTimer.current);
    animationTimer.current = setTimeout(() => setAutoAnimating(false), highlightDuration);
  }, []);

  useEffect(() => {
    playNameAnimation();
    const interval = window.setInterval(playNameAnimation, 5000);
    return () => {
      window.clearInterval(interval);
      if (animationTimer.current) clearTimeout(animationTimer.current);
    };
  }, [playNameAnimation]);

  return (
    <a className="home-brand cursor-target" data-cursor-label="Home" href="/home" aria-label="Satvic Movement home">
      <img className="home-logo" src="/logo.jpg" alt="" aria-hidden="true" />
      <span
        className={`variable-name${autoAnimating ? " is-auto-animating" : ""}`}
        aria-label={brandName}
        onPointerMove={event => {
          if (event.pointerType !== "touch") setPointer({ x: event.clientX, y: event.clientY });
        }}
        onPointerLeave={() => setPointer(null)}
      >
        {Array.from(brandName).map((character, index) => {
          const element = characterRefs.current[index];
          const rect = element?.getBoundingClientRect();
          const proximity = pointer && rect
            ? Math.max(0, 1 - Math.hypot(pointer.x - (rect.left + rect.right) / 2, pointer.y - (rect.top + rect.bottom) / 2) / 100)
            : 0;
          const isSpace = character === " ";
          const isSatvic = index < "Satvic".length;
          const weight = (isSatvic ? 600 : 400) + proximity * 400;

          return (
            <span
              key={`${character}-${index}`}
              ref={element => { characterRefs.current[index] = element; }}
              className={`variable-name-character${isSpace ? " is-space" : ""}${isSatvic ? " is-bold" : ""}`}
              aria-hidden="true"
              style={{
                fontWeight: weight,
                transform: `translateY(${-3 * proximity}px) scale(${1 + 0.24 * proximity})`,
                color: proximity > 0.08 ? "#3157e8" : "#111827",
                animationDelay: `${45 * index}ms`,
              }}
            >
              {isSpace ? "\u00a0" : character}
            </span>
          );
        })}
      </span>
    </a>
  );
}

export default function StudioHome() {
  const [contactOpen, setContactOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [contactClosing, setContactClosing] = useState(false);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [journeyFromIndex, setJourneyFromIndex] = useState(0);
  const [journeyMoving, setJourneyMoving] = useState(false);
  const [contactOrigin, setContactOrigin] = useState({ x: 0, y: 0 });
  const contactButtonRef = useRef<HTMLButtonElement | null>(null);
  const contactDialogRef = useRef<HTMLDivElement | null>(null);
  const contactCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hireQuoteDotMatrixRef = useRef<HTMLDivElement | null>(null);
  const journeyMotionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotMatrixRef = useRef<HTMLDivElement | null>(null);

  const changeJourney = (index: number) => {
    if (journeyMotionTimer.current) clearTimeout(journeyMotionTimer.current);
    setJourneyFromIndex(journeyIndex);
    setJourneyIndex(index);
    setJourneyMoving(true);
    journeyMotionTimer.current = setTimeout(() => setJourneyMoving(false), 720);
  };

  useEffect(() => () => {
    if (journeyMotionTimer.current) clearTimeout(journeyMotionTimer.current);
  }, []);

  const closeContact = () => {
    const button = contactButtonRef.current?.getBoundingClientRect();
    const dialog = contactDialogRef.current;
    if (button && dialog) {
      const card = dialog.getBoundingClientRect();
      const dockX = button.left + button.width / 2 - (card.left + card.width / 2);
      const dockY = button.top + button.height / 2 - (card.top + card.height / 2);
      const currentTransform = getComputedStyle(dialog).transform;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      dialog.animate(
        [
          { transform: currentTransform, opacity: 1 },
          { transform: `translate(${dockX}px, ${dockY}px) scale(.12)`, opacity: 0 },
        ],
        { duration: reduceMotion ? 1 : 480, easing: "cubic-bezier(.55, 0, .8, .35)", fill: "forwards" },
      );
    }
    setContactClosing(true);
    if (contactCloseTimer.current) clearTimeout(contactCloseTimer.current);
    contactCloseTimer.current = setTimeout(() => {
      setContactOpen(false);
      setContactClosing(false);
    }, 500);
  };

  useEffect(() => {
    if (!contactOpen) return;
    document.querySelector<HTMLButtonElement>(".profile-dialog-close")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContact();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      contactButtonRef.current?.focus();
    };
  }, [contactOpen]);

  useEffect(() => () => {
    if (contactCloseTimer.current) clearTimeout(contactCloseTimer.current);
  }, []);

  const onContentPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dotMatrix = dotMatrixRef.current;
    if (!dotMatrix) return;
    dotMatrix.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    dotMatrix.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    dotMatrix.classList.add("is-visible");
  };

  const hideDotMatrix = () => dotMatrixRef.current?.classList.remove("is-visible");
  const onHireQuotePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dotMatrix = hireQuoteDotMatrixRef.current;
    if (!dotMatrix) return;
    dotMatrix.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    dotMatrix.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    dotMatrix.classList.add("is-visible");
  };
  const hideHireQuoteDotMatrix = () => hireQuoteDotMatrixRef.current?.classList.remove("is-visible");
  return (
    <main className="home-page">
      {!contactOpen && <TargetCursor
        spinDuration={2}
        hoverDuration={0.2}
        size={36}
        cornerSize={12}
        thickness={3}
        padding={6}
        dotSize={4}
        cursorColor="#ffffff"
        cursorColorOnTarget="#ffffff"
        blendMode="difference"
        parallaxOn
        matchRadius
        showLabel
        clickEffect
        hideDefaultCursor
        container={undefined}
      />}
      <header className="home-nav">
        <SatvicBrand />
        <div className="home-nav-actions">
        <button className="chance-button resume-nav-button cursor-target" data-cursor-label="View my resume" type="button" aria-label="View my resume" aria-haspopup="dialog" aria-expanded={resumeOpen} onClick={() => setResumeOpen(true)}>
          <span>Resume</span>
          <span className="chance-button-icon resume-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M7 3h7l5 5v13H7zM14 3v6h5M10 14h6M10 17h6" /></svg>
          </span>
        </button>
        <button ref={contactButtonRef} className={`chance-button contact-nav-button cursor-target${contactOpen ? " is-contact-open" : ""}`} data-cursor-label="Contact me" type="button" aria-label="Contact me" aria-haspopup="dialog" aria-expanded={contactOpen} onClick={() => {
          const rect = contactButtonRef.current?.getBoundingClientRect();
          if (rect) setContactOrigin({ x: rect.left + rect.width / 2 - window.innerWidth / 2, y: rect.top + rect.height / 2 - window.innerHeight / 2 });
          setContactClosing(false);
          setContactOpen(true);
        }}>
          <span>Contact me</span>
          <span className="chance-button-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
            <svg className="contact-phone-icon" viewBox="0 0 24 24" fill="none"><path d="M7.2 3.8 9.7 7l-1.6 2.1a14.1 14.1 0 0 0 6.8 6.8l2.1-1.6 3.2 2.5-.8 3.1c-.2.8-1 1.3-1.8 1.2C9.9 20 4 14.1 2.9 6.4c-.1-.8.4-1.6 1.2-1.8l3.1-.8Z" /></svg>
          </span>
        </button>
        </div>
      </header>
      <section
        className="home-canvas"
        aria-label="Satvic Movement home"
        onPointerMove={onContentPointerMove}
        onPointerLeave={hideDotMatrix}
      >
        <div ref={dotMatrixRef} className="dot-matrix" aria-hidden="true" />
        <div className="demo-showcase">
          <div className="satvic-ai-vision">
            <span className="satvic-ai-vision-kicker">A PRACTICAL PRODUCT VISION</span>
            <h2 id="work" className="demo-showcase-title">Meet Satvic AI</h2>
            <h3 className="satvic-ai-vision-heading">Why Satvic AI?</h3>
            <p className="satvic-ai-vision-intro">A trusted guide that helps people turn Satvic wellness knowledge into everyday action.</p>
            <ol className="satvic-ai-steps">
              <li><span>01</span><div><strong>Build a trusted knowledge base</strong><p>Organize approved Satvic articles, videos, and workshop learnings—with permission and participant consent.</p></div></li>
              <li><span>02</span><div><strong>Answer with Satvic context</strong><p>People ask questions in the app or website. AI finds relevant guidance and makes its sources clear.</p></div></li>
              <li><span>03</span><div><strong>Make the next step useful</strong><p>Suggest a relevant practice, recipe, yoga session, or product—never a one-size-fits-all answer.</p></div></li>
              <li><span>04</span><div><strong>Improve with care</strong><p>Use opt-in feedback to improve answers, protect personal data, and hand sensitive health questions to a human.</p></div></li>
            </ol>
            <p className="satvic-ai-vision-outcome">Helpful support can strengthen trust and product discovery; business results should be measured, not promised.</p>
          </div>
          <div className="phone-player">
            <Iphone className="iphone-mockup" aria-label="Satvic AI chat preview">
              <div className="satvic-ai-screen">
                <header className="satvic-ai-header">
                  <img src="/logo-icon.svg" alt="" />
                  <div><strong>Satvic AI</strong></div>
                  <span className="satvic-ai-menu" aria-hidden="true">•••</span>
                </header>
                <div className="satvic-ai-conversation">
                  <div className="satvic-ai-user-message">Healthy morning routine?</div>
                  <div className="satvic-ai-answer">
                    <img src="/logo-icon.svg" alt="" />
                    <p>Start with water, a wholesome breakfast, and a few mindful breaths.</p>
                  </div>
                  <div className="satvic-ai-audio" aria-label="Audio response visualization">
                    <span>Satvic AI · speaking</span>
                    <div className="satvic-ai-bars" aria-hidden="true">
                      {[12, 20, 15, 27, 18, 32, 22, 14, 25, 34, 19, 28, 16, 24, 12, 20, 30, 17, 26, 13, 22, 32, 18, 25, 14, 29, 19, 12].map((height, index) => (
                        <i key={index} style={{ height, animationDelay: `${(index % 7) * -0.12}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="satvic-ai-composer">
                  <span aria-hidden="true">＋</span><span>Message Satvic AI</span><b aria-hidden="true">↑</b>
                </div>
              </div>
            </Iphone>
          </div>
        </div>
      </section>
      <section className="journey-section" aria-labelledby="journey-heading">
        <div className="journey-heading-group">
          <h2 id="journey-heading" className="journey-heading">My Journey &amp; Growth</h2>
          <p className="journey-intro">A little about what I have been learning and building along the way.</p>
        </div>
        <div className="journey-controls">
          <button className="journey-year-button" type="button" aria-label="Previous year" disabled={journeyIndex === 0} onClick={() => changeJourney(Math.max(0, journeyIndex - 1))}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
            Previous year
          </button>
          <button className="journey-year-button" type="button" aria-label="Next year" disabled={journeyIndex === projectJourney.length - 1} onClick={() => changeJourney(Math.min(projectJourney.length - 1, journeyIndex + 1))}>
            Next year
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
          </button>
        </div>
        <p className="journey-current-year" aria-live="polite">{projectJourney[journeyIndex].date}</p>
        <div className={`journey-years${journeyMoving ? " is-moving" : ""}`} role="group" aria-label="Choose a year">
          <span className="journey-years-progress" aria-hidden="true" style={{ left: `calc(12.5% + ${Math.min(journeyFromIndex, journeyIndex) * 25}%)`, width: `calc(${Math.abs(journeyFromIndex - journeyIndex) * 25}%)` }} />
          <img className="journey-car" src="/timeline.png" alt="" aria-hidden="true" style={{ left: `calc(12.5% + ${journeyIndex * 25}%)` }} />
          {projectJourney.map((item, index) => (
            <button key={item.id} type="button" className={`journey-year${index <= journeyIndex ? " is-complete" : ""}${index === journeyIndex ? " is-current" : ""}`} aria-pressed={index === journeyIndex} onClick={() => changeJourney(index)}>
              <span className="journey-year-dot" aria-hidden="true" />
              <span>{item.date}</span>
            </button>
          ))}
        </div>
        <div className="journey-chapter-heading">
          <span className="journey-chapter-index">CHAPTER <b>{String(projectJourney[journeyIndex].id).padStart(2, "0")}</b></span>
          <div>
            <h3 className="journey-theme">{projectJourney[journeyIndex].theme}</h3>
            <p>Three moments that shaped this year</p>
          </div>
        </div>
        <div className="journey-cards" key={projectJourney[journeyIndex].id}>
          {projectJourney[journeyIndex].cards.map((card, index) => (
            <div className="journey-card-wrap" key={card.title}>
              <article className="journey-card">
                <div className="journey-card-rail" aria-hidden="true">
                  <span className="journey-card-number">0{index + 1}</span>
                  <span className="journey-card-rail-mark" />
                  <span className="journey-card-rail-label">MILESTONE</span>
                </div>
                <div className="journey-card-copy">
                  <h3>{card.title}</h3>
                  {card.paragraphs.map(paragraph => <p key={paragraph}>{renderJourneyParagraph(paragraph)}</p>)}
                </div>
              </article>
              {index < 2 && (
                <svg className={`journey-sketch-arrow journey-sketch-arrow-${index + 1}`} viewBox="0 0 100 60" aria-hidden="true">
                  <path className="journey-pencil-echo" d="M5 43 C18 37 21 16 33 17 C45 18 47 46 60 43 C72 40 77 27 90 26" />
                  <path d="M5 41 C19 36 22 15 34 16 C46 17 48 44 61 41 C73 38 78 25 91 24" />
                  <path className="journey-arrow-head" d="m80 16 11 8-10 8" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="hire-quote-section" aria-labelledby="hire-quote-heading" onPointerMove={onHireQuotePointerMove} onPointerLeave={hideHireQuoteDotMatrix}>
        <div ref={hireQuoteDotMatrixRef} className="dot-matrix hire-quote-dot-matrix" aria-hidden="true" />
        <div className="hire-fit-layout">
          <div className="hire-fit-copy">
            <span className="hire-fit-kicker">PROJECT MANAGEMENT · ROLE FIT</span>
            <h2 id="hire-quote-heading">Looking for these skills? I’m ready to contribute in Project Management.</h2>
            <ul className="hire-fit-points">
              <li><span className="hire-fit-number">01</span><span><strong>I see AI as a way to help Satvic grow.</strong> I built an AI brochure generator that reduced document creation from hours to under ten minutes. I’d bring that same build-and-improve mindset to useful Satvic AI workflows.</span></li>
              <li><span className="hire-fit-number">02</span><span><strong>I turn conversations into clear plans.</strong> I can listen to clients, understand requirements, write PRDs, and coordinate work through delivery. I also co-founded Mivyapar and led a seven-person team.</span></li>
              <li><span className="hire-fit-number">03</span><span><strong>I communicate to bring people along.</strong> I’m comfortable explaining ideas, aligning clients and teammates, and presenting evidence-based recommendations to stakeholders.</span></li>
              <li><span className="hire-fit-number">04</span><span><strong>I’m ready to join in the coming months.</strong> From day one, I can learn how Satvic works, identify repetitive tasks, and test automations that make operations more efficient—with results measured before scaling.</span></li>
            </ul>
          </div>
          <div className="hire-tool-groups">
            {founderOfficeToolGroups.map(group => (
              <div className="hire-tool-group" key={group.title}>
                <p>{group.title}</p>
                {group.tools.map(tool => (
                  <div className="hire-tool" key={tool.name}>
                    <ToolLogo name={tool.name} slug={tool.slug} fallback={tool.fallback} />
                    <span>{tool.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="hire-section hire-id-section" aria-labelledby="hire-heading">
        <div className="hire-id-heading">
          <span className="hire-id-kicker"><img src="/logo-icon.svg" alt="" /> FOUNDER'S OFFICE · SATVIC MOVEMENT</span>
          <h2 id="hire-heading" className="hire-heading">Why I want to build with Satvic</h2>
          <p>I want to bring my product, business, and team experience to work that makes practical wellness easier to reach.</p>
        </div>
        <div className="hire-id-layout">
          <div className="hire-lanyard" aria-label="Interactive Satvic Movement identity card. Drag to move it or click it to flip.">
            <Lanyard
              frontImage="/id-card-front.svg"
              backImage="/id-card-back.svg"
              imageFit="cover"
              cardColor="#2b4938"
              orientation="portrait"
              finish="glossy"
              cornerRadius={0.22}
              size={0.7}
              anchor="center"
              strapLength={0.48}
              strapColor="#3157e8"
              strapWidth={0.65}
              metal="silver"
              gravity={0.85}
              damping={0.62}
              elasticity={0.3}
              breeze={0.3}
              interactive
              intro
            />
            <span className="hire-lanyard-hint">DRAG TO MOVE · CLICK TO FLIP</span>
          </div>
          <div className="hire-points">
            <ol className="satvic-reasons">
              {satvicFitPoints.map(point => <li key={point}>{point}</li>)}
            </ol>
          </div>
        </div>
        <div className="hire-portfolio-action">
          <LiquidMetalButton
            className="hire-portfolio-button"
            size="md"
            borderWidth={3}
            metalConfig={{ colorBack: "#3157e8", colorTint: "#ffffff", speed: 0.35, repetition: 3, distortion: 0.12 }}
            icon={<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>}
            aria-label="View my Product Management Associate application portfolio"
            onClick={() => window.open("https://satvic-movement-pma.vercel.app", "_blank", "noopener,noreferrer")}
          >
            View my Founder office portfolio
          </LiquidMetalButton>
        </div>
      </section>
      {contactOpen && typeof document !== "undefined" && createPortal(
        <div className={`profile-dialog-backdrop${contactClosing ? " is-closing" : ""}`} onMouseDown={event => { if (event.target === event.currentTarget) closeContact(); }}>
          <div ref={contactDialogRef} className="profile-dialog" style={{ "--launch-x": `${contactOrigin.x}px`, "--launch-y": `${contactOrigin.y}px` } as CSSProperties & Record<`--${string}`, string | number>} role="dialog" aria-modal="true" aria-label="Contact profile">
            <button className="profile-dialog-close" type="button" aria-label="Close profile" onClick={closeContact}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
            <ProfileCard
              name="Piyush Kumar"
              title=""
              handle=""
              status=""
              phoneNumber="8822550747"
              emailAddress="piyushkumaryadav2027@gmail.com"
              avatarUrl="/profile_pic.jpg"
              holo={0.8}
              glare={0.5}
              tiltStrength={12}
              parallax={8}
              radius={16}
              enableTilt
              intro
              showUserInfo
              theme="dark"
            />
          </div>
        </div>,
        document.body,
      )}
      {resumeOpen && typeof document !== "undefined" && createPortal(
        <div className="profile-dialog-backdrop resume-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setResumeOpen(false); }}>
          <div className="profile-dialog resume-dialog" role="dialog" aria-modal="true" aria-label="My resume">
            <button className="profile-dialog-close" type="button" aria-label="Close resume" onClick={() => setResumeOpen(false)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
            <ProfileCard
              name="Piyush Kumar"
              title="Resume"
              handle=""
              status=""
              documentPreviewUrl="/satvic-movement-founder-office.pdf"
              actionHref="/satvic-movement-founder-office.pdf"
              actionLabel="Download my resume"
              holo={0.8}
              glare={0.5}
              tiltStrength={12}
              parallax={8}
              radius={16}
              enableTilt
              intro
              showUserInfo
              theme="dark"
            />
          </div>
        </div>,
        document.body,
      )}
    </main>
  );
}
