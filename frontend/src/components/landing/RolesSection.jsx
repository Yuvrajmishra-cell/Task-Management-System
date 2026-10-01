import { CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";
import { Badge } from "../ui";

function RolesSection() {
  const managerCapabilities = [
    "Create tasks with descriptions, deadlines, and assignees",
    "Browse complete organizational task backlog",
    "Filter all tasks by status and target deadline",
    "Full authority to delete any task from the system",
    "Access to active employee directory for assignments",
  ];

  const employeeCapabilities = [
    "Dedicated view scoped strictly to own assigned tasks",
    "Update workflow status (Pending → In Progress → Completed)",
    "Filter personal assigned tasks by status & due date",
    "Authorized to delete own tasks once status is 'Completed'",
    "Protected boundaries: cannot view or alter other employees' tasks",
  ];

  return (
    <section id="roles" className="landing-section" aria-labelledby="roles-heading">
      <div className="landing-container">
        <div className="section-title-wrap">
          <div className="section-tag">Role Separation</div>
          <h2 id="roles-heading" className="section-heading">
            Purpose-built permissions for each role
          </h2>
          <p className="section-subtext">
            Clear boundaries protect data integrity while empowering team members to focus on their assigned work.
          </p>
        </div>

        <div className="roles-grid">
          {/* Manager Role Card */}
          <div className="role-card manager-card">
            <div>
              <div className="role-header">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ShieldCheck size={24} color="var(--primary)" />
                  <span className="role-name">Manager</span>
                </div>
                <Badge role="manager">Full Authority</Badge>
              </div>

              <p className="role-desc">
                Project coordinators and team leads who assign tasks, monitor team-wide delivery, and maintain task backlogs.
              </p>

              <ul className="checklist">
                {managerCapabilities.map((item) => (
                  <li key={item} className="checklist-item">
                    <CheckCircle2 size={16} className="checklist-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              * Manager accounts can be provisioned through secure backend administration.
            </div>
          </div>

          {/* Employee Role Card */}
          <div className="role-card employee-card">
            <div>
              <div className="role-header">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <UserCheck size={24} color="#0284c7" />
                  <span className="role-name">Employee</span>
                </div>
                <Badge role="employee">Execution Focused</Badge>
              </div>

              <p className="role-desc">
                Individual contributors who focus on their active workload, update task statuses, and clean up completed assignments.
              </p>

              <ul className="checklist">
                {employeeCapabilities.map((item) => (
                  <li key={item} className="checklist-item">
                    <CheckCircle2 size={16} className="checklist-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              * Employees register freely via self-serve signup with mandatory security questions.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RolesSection;
