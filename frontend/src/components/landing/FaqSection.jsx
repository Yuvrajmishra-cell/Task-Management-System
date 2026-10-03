import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const faqReveal = useReveal({ staggerChildren: true });

  const faqs = [
    {
      q: "What is the difference between a Manager and an Employee account?",
      a: "Managers can create tasks, assign them to any employee, view the entire company backlog, and delete any task. Employees can only view and update tasks specifically assigned to them, and can only delete tasks that are assigned to them and marked Completed.",
    },
    {
      q: "Under what conditions can an Employee delete a task?",
      a: "An employee can delete a task ONLY when two backend conditions are satisfied simultaneously: 1) the task is assigned to that specific employee, and 2) the task status is currently 'Completed'. Employees cannot delete Pending or In Progress tasks, nor tasks assigned to other employees.",
    },
    {
      q: "How does the security-question password recovery system work?",
      a: "During registration, each user selects a security question and provides an answer. If you forget your password, TaskFlow displays your question. Once your answer is verified against the bcrypt hash, you receive a temporary crypto token valid for 15 minutes to establish a new password.",
    },
    {
      q: "Can employees see or modify tasks assigned to other colleagues?",
      a: "No. The backend API strictly scopes GET requests from employee accounts to their own user ID (assignedTo: req.user.id). Furthermore, status updates require ownership verification; any attempt to alter another user's task returns an HTTP 403 Forbidden error.",
    },
    {
      q: "What happens if someone repeatedly guesses my security answer?",
      a: "To prevent brute-force enumeration, the verification endpoint enforces a rate limit (5 requests per 15 minutes per IP). Furthermore, after 5 consecutive failed answer attempts, the account is automatically locked for 15 minutes, rejecting any further attempts.",
    },
  ];

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="landing-section" aria-labelledby="faq-heading">
      <div className="landing-container">
        <div className="section-title-wrap">
          <div className="section-tag">Frequently Asked Questions</div>
          <h2 id="faq-heading" className="section-heading">
            Got questions? We have answers.
          </h2>
          <p className="section-subtext">
            Everything you need to know about TaskFlow's roles, features, and security rules.
          </p>
        </div>

        <div className="faq-container reveal-stagger" ref={faqReveal.ref}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const answerId = `faq-answer-${idx}`;

            return (
              <div key={faq.q} className="faq-item reveal-item">
                <button
                  type="button"
                  id={`faq-trigger-${idx}`}
                  className="faq-trigger"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`faq-chevron ${isOpen ? "expanded" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={answerId}
                  className={`faq-answer-panel ${isOpen ? "open" : ""}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${idx}`}
                  aria-hidden={!isOpen}
                >
                  <div className="faq-answer-inner">
                    <div className="faq-answer">{faq.a}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
