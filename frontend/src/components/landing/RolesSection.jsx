import { Check, X } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";

const permissionRows = [
  ["Create tasks", true, false],
  ["Assign tasks to employees", true, false],
  ["View all tasks", true, false],
  ["Update status of assigned tasks", false, true],
  ["Filter tasks by status and due date", true, true],
  ["Delete any task", true, false],
  ["Delete own completed tasks", false, true],
  ["View other employees' tasks", true, false],
];

function Access({ allowed }) {
  return <span className={`access-mark ${allowed ? "allowed" : "denied"}`} aria-label={allowed ? "Allowed" : "Not allowed"}>
    {allowed ? <Check size={17} aria-hidden="true" /> : <X size={17} aria-hidden="true" />}
  </span>;
}

export default function RolesSection() {
  const { setNode: tableRef } = useReveal();
  const { setNode: headingRef } = useReveal();
  return (
    <section id="roles" className="landing-section roles-section" aria-labelledby="roles-heading">
      <div className="landing-container">
        <div className="section-title-wrap reveal" ref={headingRef}>
          <p className="section-tag">Roles</p>
          <h2 id="roles-heading" className="section-heading">Clear roles. Clear permissions.</h2>
          <p className="section-subtext">Access is enforced by the API as well as the interface.</p>
        </div>
        <div className="permission-table-wrap reveal" ref={tableRef}>
          <table className="permission-table">
            <thead><tr><th scope="col">Capability</th><th scope="col">Manager</th><th scope="col">Employee</th></tr></thead>
            <tbody>{permissionRows.map(([name, manager, employee]) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                <td data-label="Manager"><Access allowed={manager} /></td>
                <td data-label="Employee"><Access allowed={employee} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p className="roles-note">Employee accounts are self-registered. Manager accounts are provisioned through manager-only administration.</p>
      </div>
    </section>
  );
}
