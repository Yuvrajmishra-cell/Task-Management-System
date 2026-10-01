import { Lock, Calendar, User } from "lucide-react";
import { Badge } from "../ui";

function ProductPreview() {
  const sampleTasks = [
    {
      id: "sample-1",
      title: "Design database schema for user profiles",
      status: "In Progress",
      assignee: "Alex Morgan",
      due: "Oct 12, 2026",
    },
    {
      id: "sample-2",
      title: "Configure rate limiters for auth endpoints",
      status: "Completed",
      assignee: "Sarah Connor",
      due: "Oct 05, 2026",
    },
    {
      id: "sample-3",
      title: "Implement security question verification flow",
      status: "Pending",
      assignee: "David Kim",
      due: "Oct 18, 2026",
    },
  ];

  return (
    <section className="product-preview-section" aria-label="Product preview mockup">
      <div className="landing-container">
        {/* Browser-Frame Container */}
        <div className="browser-mockup">
          {/* Browser Chrome Header */}
          <div className="browser-header">
            <div className="browser-dots" aria-hidden="true">
              <span className="browser-dot red" />
              <span className="browser-dot yellow" />
              <span className="browser-dot green" />
            </div>

            <div className="browser-address-bar">
              <Lock size={12} />
              <span>https://app.taskflow.local/dashboard</span>
            </div>

            <div className="mockup-badge">
              Sample data
            </div>
          </div>

          {/* Browser Body Mockup */}
          <div className="mockup-body">
            {/* 4 Stat Cards */}
            <div className="mockup-stats-grid">
              <div className="mockup-stat-card total">
                <div className="mockup-stat-label">Total Tasks</div>
                <div className="mockup-stat-value">18</div>
              </div>

              <div className="mockup-stat-card pending">
                <div className="mockup-stat-label">Pending</div>
                <div className="mockup-stat-value">4</div>
              </div>

              <div className="mockup-stat-card progress">
                <div className="mockup-stat-label">In Progress</div>
                <div className="mockup-stat-value">6</div>
              </div>

              <div className="mockup-stat-card completed">
                <div className="mockup-stat-label">Completed</div>
                <div className="mockup-stat-value">8</div>
              </div>
            </div>

            {/* Task Rows Mockup */}
            <div className="mockup-tasks-container">
              <div className="mockup-tasks-header">
                <span className="mockup-tasks-title">Recent Tasks Preview</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Showing 3 sample tasks
                </span>
              </div>

              {sampleTasks.map((task) => (
                <div key={task.id} className="mockup-task-row">
                  <div className="mockup-task-info">
                    <span className="mockup-task-name">{task.title}</span>
                    <span className="mockup-task-meta">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", marginRight: "10px" }}>
                        <User size={12} /> {task.assignee}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                        <Calendar size={12} /> Due {task.due}
                      </span>
                    </span>
                  </div>

                  <div className="mockup-task-right">
                    <Badge status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductPreview;
