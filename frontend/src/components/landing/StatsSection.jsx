import { useReveal } from "../../hooks/useReveal";
import { useCountUp } from "../../hooks/useCountUp";

const stats = [
  [2, "account roles", "Manager and Employee"],
  [3, "task statuses", "Pending to Completed"],
  [5, "failed answers", "Before recovery lockout"],
  [15, "minutes", "Reset-token lifetime"],
];

function Stat({ value, label, detail, active }) {
  const count = useCountUp(value, active);
  return <article className="stat-item"><strong>{count}</strong><span>{label}</span><small>{detail}</small></article>;
}

export default function StatsSection() {
  const { setNode: statsRef, isRevealed } = useReveal({ staggerChildren: true });
  const { setNode: headingRef } = useReveal();
  const items = stats.map(([value, label, detail]) => ({ value, label, detail }));
  return (
    <section className="stats-section" aria-labelledby="stats-heading">
      <div className="landing-container">
        <div className="stats-heading-block reveal" ref={headingRef}>
          <p className="section-tag">The system, in numbers</p>
          <h2 id="stats-heading" className="section-heading">Small rules. Clear boundaries.</h2>
        </div>
        <div className="stats-grid reveal-stagger" ref={statsRef}>
          {items.map((item) => <Stat key={item.label} {...item} active={isRevealed} />)}
        </div>
      </div>
    </section>
  );
}
