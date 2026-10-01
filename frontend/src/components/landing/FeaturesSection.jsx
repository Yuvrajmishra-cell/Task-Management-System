import {
  ShieldCheck,
  UserCheck,
  Activity,
  Filter,
  CalendarClock,
  KeyRound,
} from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      icon: <ShieldCheck size={22} />,
      title: "Role-Based Access",
      desc: "Strict architectural separation between Manager and Employee roles, backed by cryptographic JWT tokens and controller-level security checks.",
    },
    {
      icon: <UserCheck size={22} />,
      title: "Task Assignment",
      desc: "Managers can easily assign granular tasks with titles, comprehensive descriptions, and deadlines directly to active registered employees.",
    },
    {
      icon: <Activity size={22} />,
      title: "Status Tracking",
      desc: "Real-time task progression across Pending, In Progress, and Completed states. Employees effortlessly keep their work current.",
    },
    {
      icon: <Filter size={22} />,
      title: "Smart Filtering",
      desc: "Zero clutter: filter your task backlog instantly by lifecycle status and target completion date directly through the API.",
    },
    {
      icon: <CalendarClock size={22} />,
      title: "Due-Date Tracking",
      desc: "Never miss a deadline. Automated date indexing flags upcoming milestones so teams always prioritize time-critical tasks.",
    },
    {
      icon: <KeyRound size={22} />,
      title: "Secure Account Recovery",
      desc: "3-step identity verification using hashed security questions, short-lived crypto tokens, and brute-force attempt lockout protections.",
    },
  ];

  return (
    <section id="features" className="landing-section" aria-labelledby="features-heading">
      <div className="landing-container">
        <div className="section-title-wrap">
          <div className="section-tag">Key Capabilities</div>
          <h2 id="features-heading" className="section-heading">
            Engineered for clarity, accountability, and speed
          </h2>
          <p className="section-subtext">
            TaskFlow combines intuitive team collaboration with rigorous backend security standards.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon-box">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
