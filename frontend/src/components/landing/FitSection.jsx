import { Check, X } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

const forTeams = [
  "Small teams with distinct manager and employee responsibilities.",
  "People who want task ownership and status in one shared workflow.",
  "Teams that work with due dates and straightforward task filters.",
];

const notFor = [
  "Teams looking for social or OAuth sign-in.",
  "Teams that need email notifications; recovery uses security questions.",
  "Organizations seeking an enterprise-scale project suite.",
];

function FitList({ items, Icon, className }) {
  return <ul className={className}>{items.map((item) => <li key={item}><Icon size={18} aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

export default function FitSection() {
  const { setNode: fitRef } = useReveal({ staggerChildren: true });
  const { setNode: headingRef } = useReveal();
  return (
    <section className="fit-section landing-section" aria-labelledby="fit-heading">
      <div className="landing-container">
        <div className="section-title-wrap reveal" ref={headingRef}>
          <p className="section-tag">A focused tool</p>
          <h2 className="section-heading" id="fit-heading">TaskFlow isn&apos;t for every team.</h2>
        </div>
        <div className="fit-columns reveal-stagger" ref={fitRef}>
          <article className="fit-column for-column reveal-item">
            <h3><Check size={20} aria-hidden="true" />A fit for</h3>
            <FitList items={forTeams} Icon={Check} className="fit-list" />
          </article>
          <article className="fit-column not-for-column reveal-item">
            <h3><X size={20} aria-hidden="true" />Not a fit for</h3>
            <FitList items={notFor} Icon={X} className="fit-list" />
          </article>
        </div>
      </div>
    </section>
  );
}
