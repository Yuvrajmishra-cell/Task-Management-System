import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CheckSquare,
  LayoutDashboard,
  PlusCircle,
  Clock,
  LogOut,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/dashboard" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon">
            <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <span>TaskFlow</span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Nav Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? "nav-open" : ""}`}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobileMenu}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/tasks"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobileMenu}
          >
            <CheckSquare size={18} />
            <span>Tasks</span>
          </NavLink>

          {/* Manager Only: Create Task */}
          {user?.role === "manager" && (
            <NavLink
              to="/tasks/create"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeMobileMenu}
            >
              <PlusCircle size={18} />
              <span>Create Task</span>
            </NavLink>
          )}

          {/* Employee Only: Update Status */}
          {user?.role === "employee" && (
            <NavLink
              to="/tasks/update-status"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeMobileMenu}
            >
              <Clock size={18} />
              <span>Update Status</span>
            </NavLink>
          )}
        </nav>

        {/* User Section & Logout */}
        <div
          className={`navbar-user-section ${
            mobileMenuOpen ? "nav-open" : ""
          }`}
        >
          <div className="user-profile-badge">
            <div className="user-avatar" title={user?.name || "User"}>
              {userInitial}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span
                className={`role-badge ${
                  user?.role === "manager" ? "manager" : "employee"
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <button
            className="btn-logout"
            onClick={handleLogout}
            title="Log out of TaskFlow"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;