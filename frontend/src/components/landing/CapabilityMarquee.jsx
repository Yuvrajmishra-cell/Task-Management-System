import {
  Activity,
  CalendarClock,
  Clock3,
  Filter,
  KeyRound,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const capabilities = [
  [UserCheck, "Role-based access"],
  [ShieldCheck, "JWT authentication"],
  [Lock, "bcrypt hashing"],
  [KeyRound, "Security-question recovery"],
  [Clock3, "Rate limiting"],
  [Lock, "Account lockout"],
  [Filter, "Task filtering"],
  [CalendarClock, "Due dates"],
  [Activity, "Status tracking"],
];

function CapabilitySet() {
  return capabilities.map(([Icon, label]) => (
    <span className="capability-chip" key={label}>
      <Icon size={17} aria-hidden="true" />
      {label}
    </span>
  ));
}

export default function CapabilityMarquee() {
  return (
    <section className="capability-marquee" aria-label="TaskFlow capabilities">
      <div className="capability-track">
        <div className="capability-set"><CapabilitySet /></div>
        <div className="capability-set" aria-hidden="true"><CapabilitySet /></div>
      </div>
    </section>
  );
}
