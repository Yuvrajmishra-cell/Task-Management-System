import { Shield, Key, Lock, AlertOctagon } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

function SecuritySection() {
  const securityReveal = useReveal({ staggerChildren: true });
  const securityPillars = [
    {
      icon: <Shield size={24} className="security-icon" />,
      title: "JWT Authentication",
      desc: "Stateless JSON Web Tokens signed with strong secrets authenticate every API request via Bearer headers, enforcing strict role authorization.",
    },
    {
      icon: <Lock size={24} className="security-icon" />,
      title: "Bcrypt Hashing",
      desc: "Passwords and security answers are irreversibly salted and hashed with bcryptjs (salt round 10). Plaintext credentials never touch disk or logs.",
    },
    {
      icon: <Key size={24} className="security-icon" />,
      title: "3-Step Q&A Recovery",
      desc: "Self-serve password recovery requires valid security question answers and generates single-use 15-minute crypto tokens hashed with SHA-256.",
    },
    {
      icon: <AlertOctagon size={24} className="security-icon" />,
      title: "Brute-Force Lockout",
      desc: "Dedicated Express rate limiters protect auth routes (5 req / 15 min), and accounts lock for 15 minutes after 5 failed answer attempts.",
    },
  ];

  return (
    <section id="security" className="landing-section bg-navy-dark" aria-labelledby="security-heading">
      <div className="landing-container">
        <div className="section-title-wrap">
          <div className="section-tag">Security &amp; Privacy</div>
          <h2 id="security-heading" className="section-heading">
            Defense-in-depth architecture
          </h2>
          <p className="section-subtext">
            Built with modern security best practices at both the HTTP middleware and database layers.
          </p>
        </div>

        <div className="security-grid reveal-stagger" ref={securityReveal.ref}>
          {securityPillars.map((pillar) => (
            <div key={pillar.title} className="security-card reveal-item">
              {pillar.icon}
              <h3 className="security-card-title">{pillar.title}</h3>
              <p className="security-card-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;
