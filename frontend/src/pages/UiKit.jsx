import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Input,
  Select,
  Textarea,
  Badge,
  Card,
  Modal,
  ConfirmDialog,
  Spinner,
  Skeleton,
  EmptyState,
  Alert,
  Avatar,
  AvatarStack,
  PageHeader,
  StatCard,
  IconButton,
  Dropdown,
  DueDate,
  SkeletonStatCard,
  SkeletonCard,
} from "../components/ui";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  Mail,
  Lock,
  PlusCircle,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  FolderOpen,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

function UiKit() {
  usePageTitle("Design System UI Kit");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [inputVal, setInputVal] = useState("alex@example.com");
  const [selectVal, setSelectVal] = useState("in-progress");
  const [textVal, setTextVal] = useState("This is sample textarea content.");

  const [alerts, setAlerts] = useState({
    success: true,
    error: true,
    info: true,
    warning: true,
  });

  const handleConfirmAction = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      setConfirmOpen(false);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Top Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          paddingBottom: "1.25rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={22} color="var(--primary)" />
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)" }}>
              TaskFlow UI Kit &amp; Design System
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Dev-only visual catalog of design tokens and reusable UI primitives.
          </p>
        </div>

        <Link to="/login">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />}>
            Back to App
          </Button>
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {/* --- Section 1: Buttons --- */}
        <Card>
          <Card.Header>
            <div>
              <Card.Title>1. Buttons</Card.Title>
              <Card.Description>Variants, sizes, states, and icon slots</Card.Description>
            </div>
          </Card.Header>
          <Card.Body>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Variants */}
              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  VARIANTS
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  SIZES
                </p>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                  <Button size="sm">Small (sm)</Button>
                  <Button size="md">Medium (md)</Button>
                  <Button size="lg">Large (lg)</Button>
                </div>
              </div>

              {/* States & Icons */}
              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  STATES &amp; ICONS
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  <Button leftIcon={<PlusCircle size={16} />}>Create Task</Button>
                  <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>
                    Next Step
                  </Button>
                  <Button variant="danger" leftIcon={<Trash2 size={16} />}>
                    Delete
                  </Button>
                  <Button isLoading>Saving...</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* --- Section 2: Form Controls --- */}
        <Card>
          <Card.Header>
            <div>
              <Card.Title>2. Form Controls</Card.Title>
              <Card.Description>Accessible inputs, selects, textareas with icons, helpers, and error states</Card.Description>
            </div>
          </Card.Header>
          <Card.Body>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              <Input
                label="Standard Input"
                placeholder="Enter your name"
                helperText="Your public display name."
              />

              <Input
                label="Input with Icon"
                type="email"
                icon={<Mail size={16} />}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                required
              />

              <Input
                label="Input with Error"
                type="password"
                icon={<Lock size={16} />}
                defaultValue="pass"
                error="Password must be at least 8 characters."
              />

              <Select
                label="Select Dropdown"
                icon={<Calendar size={16} />}
                value={selectVal}
                onChange={(e) => setSelectVal(e.target.value)}
                options={[
                  { value: "pending", label: "Pending Review" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "completed", label: "Completed" },
                ]}
              />

              <div style={{ gridColumn: "1 / -1" }}>
                <Textarea
                  label="Description / Instructions"
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  helperText="Detailed guidance for the assigned engineer."
                  required
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* --- Section 3: Badges & Status Pills --- */}
        <Card>
          <Card.Header>
            <div>
              <Card.Title>3. Badges &amp; Status Pills</Card.Title>
              <Card.Description>Status indicators and role pills matching contract</Card.Description>
            </div>
          </Card.Header>
          <Card.Body>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  TASK STATUS PILLS
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <Badge status="Pending" />
                  <Badge status="In Progress" />
                  <Badge status="Completed" />
                </div>
              </div>

              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  ROLE BADGES
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <Badge role="manager">Manager</Badge>
                  <Badge role="employee">Employee</Badge>
                  <Badge variant="default">Custom Label</Badge>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* --- Section 4: Alerts & Feedback --- */}
        <Card>
          <Card.Header>
            <div>
              <Card.Title>4. Alerts &amp; Notifications</Card.Title>
              <Card.Description>Color-coded semantic banners with dismiss triggers</Card.Description>
            </div>
          </Card.Header>
          <Card.Body>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {alerts.success && (
                <Alert
                  variant="success"
                  title="Operation Completed"
                  onClose={() => setAlerts((prev) => ({ ...prev, success: false }))}
                >
                  Task status has been updated to <strong>Completed</strong>.
                </Alert>
              )}

              {alerts.error && (
                <Alert
                  variant="error"
                  title="Authentication Error"
                  onClose={() => setAlerts((prev) => ({ ...prev, error: false }))}
                >
                  Invalid email or password. Please verify your credentials and try again.
                </Alert>
              )}

              {alerts.warning && (
                <Alert
                  variant="warning"
                  title="Account Lock Warning"
                  onClose={() => setAlerts((prev) => ({ ...prev, warning: false }))}
                >
                  4 failed answer attempts detected. One more failed attempt will lock your account for 15 minutes.
                </Alert>
              )}

              {alerts.info && (
                <Alert
                  variant="info"
                  title="System Maintenance"
                  onClose={() => setAlerts((prev) => ({ ...prev, info: false }))}
                >
                  TaskFlow will undergo scheduled updates on Sunday at 02:00 UTC.
                </Alert>
              )}

              {(!alerts.success || !alerts.error || !alerts.warning || !alerts.info) && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAlerts({ success: true, error: true, info: true, warning: true })}
                  >
                    Reset Dismissed Alerts
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* --- Section 5: Modal & Confirm Dialog --- */}
        <Card>
          <Card.Header>
            <div>
              <Card.Title>5. Modals &amp; Dialogs</Card.Title>
              <Card.Description>Accessible dialogs with focus trap, ESC listener, and backdrop click</Card.Description>
            </div>
          </Card.Header>
          <Card.Body>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button onClick={() => setModalOpen(true)}>Open General Modal</Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                Open Delete Confirm Dialog
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* --- Section 6: Avatars, Spinners & Skeletons --- */}
        <Card>
          <Card.Header>
            <div>
              <Card.Title>6. Avatars, Spinners &amp; Skeletons</Card.Title>
              <Card.Description>User identity markers and asynchronous loading placeholders</Card.Description>
            </div>
          </Card.Header>
          <Card.Body>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  AVATARS
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Avatar name="Alex Morgan" size="sm" />
                  <Avatar name="Sarah Connor" size="md" />
                  <Avatar name="Yuvraj Mishra" size="lg" />
                </div>
              </div>

              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  SPINNERS
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", color: "var(--primary)" }}>
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                </div>
              </div>

              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  SKELETON LOADERS
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Skeleton variant="text" width="65%" />
                  <Skeleton variant="text" width="90%" />
                  <Skeleton variant="rect" height="40px" />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* --- Section 7: Empty State --- */}
        <Card>
          <Card.Header>
            <div>
              <Card.Title>7. Empty State</Card.Title>
              <Card.Description>Clean feedback when collections or search results are empty</Card.Description>
            </div>
          </Card.Header>
          <Card.Body>
            <EmptyState
              icon={<FolderOpen size={28} />}
              title="No tasks found"
              description="There are currently no tasks matching your query. Create a new task or adjust your filters."
              action={
                <Button variant="primary" size="sm" leftIcon={<PlusCircle size={15} />}>
                  Create First Task
                </Button>
              }
            />
          </Card.Body>
        </Card>

        {/* --- Section 8: Upgraded Foundation Primitives --- */}
        <Card>
          <Card.Header>
            <div>
              <Card.Title>8. Foundation Primitives &amp; Helpers</Card.Title>
              <Card.Description>
                StatCard, DueDate helpers, AvatarStack, IconButton with tooltips, and Dropdown menu
              </Card.Description>
            </div>
          </Card.Header>
          <Card.Body>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Stat Cards Grid */}
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.85rem" }}>
                  A. StatCards (Layered Shadow, Hover Lift, Status Accents)
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                  <StatCard
                    variant="total"
                    label="Total Tasks"
                    value={24}
                    icon={<FolderOpen size={20} />}
                    caption="+3 added this week"
                  />
                  <StatCard
                    variant="pending"
                    label="Pending Review"
                    value={6}
                    icon={<Clock size={20} />}
                    caption="2 require manager review"
                  />
                  <StatCard
                    variant="progress"
                    label="In Progress"
                    value={11}
                    icon={<Clock size={20} />}
                    caption="Active sprints underway"
                  />
                  <StatCard
                    variant="completed"
                    label="Completed"
                    value={7}
                    icon={<CheckCircle2 size={20} />}
                    caption="85% on-time completion"
                  />
                </div>
              </div>

              {/* DueDate Helpers */}
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.85rem" }}>
                  B. DueDate Helper (Relative computation, Overdue red, Due today amber, N days neutral)
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center" }}>
                  <div style={{ background: "var(--bg-subtle)", padding: "0.75rem 1rem", borderRadius: "8px" }}>
                    <DueDate date={new Date(Date.now() - 86400000 * 3).toISOString()} status="In Progress" />
                  </div>
                  <div style={{ background: "var(--bg-subtle)", padding: "0.75rem 1rem", borderRadius: "8px" }}>
                    <DueDate date={new Date().toISOString()} status="Pending" />
                  </div>
                  <div style={{ background: "var(--bg-subtle)", padding: "0.75rem 1rem", borderRadius: "8px" }}>
                    <DueDate date={new Date(Date.now() + 86400000 * 4).toISOString()} status="Pending" />
                  </div>
                  <div style={{ background: "var(--bg-subtle)", padding: "0.75rem 1rem", borderRadius: "8px" }}>
                    <DueDate date={new Date(Date.now() - 86400000 * 5).toISOString()} status="Completed" />
                  </div>
                </div>
              </div>

              {/* Avatar & AvatarStack */}
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.85rem" }}>
                  C. Deterministic Avatars &amp; AvatarStack
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Avatar name="Alex Johnson" size="sm" />
                    <Avatar name="Marcus Rivera" size="md" />
                    <Avatar name="Emily Davis" size="lg" />
                    <Avatar name="Zara Chen" size="md" />
                    <Avatar name="David Smith" size="md" />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Stack:</span>
                    <AvatarStack
                      users={[
                        { name: "Sarah Miller" },
                        { name: "John Doe" },
                        { name: "Elena Rostova" },
                        { name: "Ken Adams" },
                        { name: "Chloe Bennett" },
                      ]}
                      max={3}
                      size="md"
                    />
                  </div>
                </div>
              </div>

              {/* IconButton & Dropdown */}
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.85rem" }}>
                  D. IconButton (Tooltip + Aria) &amp; Keyboard-Accessible Dropdown
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <IconButton icon={<PlusCircle size={16} />} label="Add task" variant="primary" />
                    <IconButton icon={<Edit2 size={16} />} label="Edit item" variant="secondary" />
                    <IconButton icon={<Trash2 size={16} />} label="Delete item" variant="danger" />
                    <IconButton icon={<Calendar size={16} />} label="Calendar view" variant="ghost" />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Action Menu:</span>
                    <Dropdown label="Task actions">
                      <Dropdown.Item icon={<Edit2 size={14} />} onClick={() => alert("Edit clicked")}>
                        Edit Task
                      </Dropdown.Item>
                      <Dropdown.Item icon={<Calendar size={14} />} onClick={() => alert("Reschedule clicked")}>
                        Reschedule
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item icon={<Trash2 size={14} />} danger onClick={() => setConfirmOpen(true)}>
                        Delete Task
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </div>
              </div>

              {/* Reusable Skeletons */}
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.85rem" }}>
                  E. Composite Skeletons (StatCard and Task Card)
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
                  <SkeletonStatCard />
                  <SkeletonCard />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* General Modal Demonstration */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Sample Application Modal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Save Changes
            </Button>
          </>
        }
      >
        <p style={{ marginBottom: "1rem" }}>
          This modal is built with standard accessibility attributes:
        </p>
        <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <li>Traps keyboard focus with <code>Tab</code> and <code>Shift+Tab</code></li>
          <li>Closes on <code>Escape</code> key</li>
          <li>Closes when clicking the blurred backdrop</li>
          <li>Locks page scroll while visible</li>
          <li>Restores user focus when closed</li>
        </ul>
      </Modal>

      {/* Confirm Dialog Demonstration */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={confirmLoading}
      />
    </div>
  );
}

export default UiKit;
