import { useReveal } from "../../hooks/useReveal";

const problems = [
  "Tasks get buried in chats and spreadsheets.",
  "Ownership is unclear once work is handed off.",
  "Progress is hard to see across a team.",
  "Deadlines can slip without a shared view.",
];

export default function ProblemSection() {
  const { setNode: introRef } = useReveal();
  const { setNode: listRef } = useReveal({ staggerChildren: true });
  return (
    <section className="problem-section" aria-labelledby="problem-heading">
      <div className="landing-container problem-layout">
        <div className="problem-intro reveal" ref={introRef}>
          <p className="section-tag">The problem</p>
          <h2 className="section-heading" id="problem-heading">The problem isn&apos;t a lack of tools.</h2>
          <p className="section-subtext">It&apos;s keeping ownership, progress, and deadlines visible as work moves between people.</p>
          <blockquote>Good work is easier when everyone knows what is theirs, what is next, and when it is due.</blockquote>
        </div>
        <ol className="problem-list reveal-stagger" ref={listRef}>
          {problems.map((problem, index) => (
            <li className="reveal-item" key={problem}>
              <span className="problem-number">{String(index + 1).padStart(2, "0")}</span>
              <span>{problem}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
