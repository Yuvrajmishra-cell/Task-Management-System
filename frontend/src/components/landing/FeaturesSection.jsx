import {
  Activity,
  CalendarClock,
  Filter,
  KeyRound,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

const featureRows = [
  { icon: <UserCheck size={24} />, title: "Task assignment", desc: "Managers create tasks with a description and due date, then assign them to a registered employee." },
  { icon: <Activity size={24} />, title: "Status tracking", desc: "Employees update assigned tasks through Pending, In Progress, and Completed." },
  { icon: <Filter size={24} />, title: "Smart filtering", desc: "Find work by its current status or a due-date cutoff." },
];

const supportingFeatures = [
  [ShieldCheck, "Role-based access", "Manager and Employee permissions are enforced by protected API routes."],
  [UserCheck, "Task assignment", "Managers select a registered employee when creating a task."],
  [Activity, "Status tracking", "The task model supports Pending, In Progress, and Completed."],
  [Filter, "Task filtering", "The task API accepts status and due-date filters."],
  [CalendarClock, "Due dates", "Tasks require a due date, which can be used to filter upcoming work."],
  [KeyRound, "Account recovery", "Users verify a security answer to receive a temporary password-reset token."],
];

function FeaturesSection() {
  const { setNode: headingRef } = useReveal({ staggerChildren: true });
  const { setNode: rowsRef } = useReveal({ staggerChildren: true });
  const { setNode: supportingRef } = useReveal({ staggerChildren: true });
  return (
    <section id="features" className="landing-section features-section" aria-labelledby="features-heading">
      <div className="landing-container">
        <div className="section-title-wrap reveal" ref={headingRef}>
          <p className="section-tag">What it does</p>
          <h2 id="features-heading" className="section-heading">One place for work to move forward.</h2>
          <p className="section-subtext">TaskFlow keeps the everyday handoff between managers and employees clear.</p>
        </div>
        <div className="feature-rows reveal-stagger" ref={rowsRef}>
          {featureRows.map((feature, index) => (
            <article className="feature-row reveal-item" key={feature.title}>
              <span className="feature-row-number">0{index + 1}</span>
              <span className="feature-icon-box">{feature.icon}</span>
              <div><h3>{feature.title}</h3><p>{feature.desc}</p></div>
            </article>
          ))}
        </div>
        <div className="supporting-features reveal-stagger" ref={supportingRef}>
          {supportingFeatures.map(([Icon, title, desc]) => (
            <article className="supporting-feature reveal-item" key={title}>
              <span className="feature-icon-box"><Icon size={20} /></span>
              <div><h3>{title}</h3><p>{desc}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
