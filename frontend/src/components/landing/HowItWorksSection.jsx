import { useReveal } from "../../hooks/useReveal";

function HowItWorksSection() {
  const stepsReveal = useReveal({ staggerChildren: true });
  const steps = [
    {
      number: "01",
      title: "Manager creates & assigns",
      desc: "Managers define task objectives, set deadline dates, and select a registered employee from the team roster to take ownership.",
    },
    {
      number: "02",
      title: "Employee updates status",
      desc: "Assigned employees review incoming work, move status from Pending to In Progress, and mark it Completed when deliverables finish.",
    },
    {
      number: "03",
      title: "Completed tasks get cleaned up",
      desc: "Managers can delete any obsolete tasks. Employees can safely clean up tasks assigned to them once status reaches Completed.",
    },
  ];

  return (
    <section id="how-it-works" className="landing-section bg-indigo-light" aria-labelledby="hiw-heading">
      <div className="landing-container">
        <div className="section-title-wrap">
          <div className="section-tag">Workflow</div>
          <h2 id="hiw-heading" className="section-heading">
            Simple 3-step operational flow
          </h2>
          <p className="section-subtext">
            No convoluted hierarchies or redundant steps — just direct project execution.
          </p>
        </div>

        <div className="steps-container reveal-stagger" ref={stepsReveal.ref}>
          {steps.map((step) => (
            <div key={step.number} className="step-card reveal-item">
              <div className="step-badge">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
