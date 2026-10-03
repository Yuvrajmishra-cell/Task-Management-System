import { useReveal } from "../../hooks/useReveal";

function HowItWorksSection() {
  const { setNode: stepsRef } = useReveal({ staggerChildren: true });
  const { setNode: headingRef } = useReveal();
  const steps = [
    { number: "01", title: "Assign", desc: "A manager creates a task with a description and due date, then assigns it to an employee." },
    { number: "02", title: "Update", desc: "The assigned employee moves work from Pending to In Progress as they begin." },
    { number: "03", title: "Complete", desc: "When the work is done, the employee marks the task Completed." },
    { number: "04", title: "Clean up", desc: "Managers can delete any task. Employees can delete only their own completed tasks." },
  ];

  return (
    <section id="how-it-works" className="landing-section bg-indigo-light" aria-labelledby="hiw-heading">
      <div className="landing-container">
        <div className="section-title-wrap reveal" ref={headingRef}>
          <p className="section-tag">How it works</p>
          <h2 id="hiw-heading" className="section-heading">Four moves. One clear handoff.</h2>
          <p className="section-subtext">A simple path from task assignment to finished work.</p>
        </div>
        <div className="steps-container reveal-stagger" ref={stepsRef}>
          {steps.map((step) => (
            <article key={step.number} className="step-card reveal-item">
              <div className="step-badge">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
