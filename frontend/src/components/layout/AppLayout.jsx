import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  Clock,
  User as UserIcon,
  LogOut,
  Search,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar, Badge } from "../ui";
import "./AppLayout.css";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [searchValue, setSearchValue] = useState(() => {
    if (location.pathname === "/tasks") {
      return new URLSearchParams(location.search).get("search") || "";
    }
    return "";
  });

  const drawerRef = useRef(null);
  const hamburgerRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Adjust state during render when route changes (React 19 recommended pattern)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileOpen(false);
    setSearchExpanded(false);
    if (location.pathname === "/tasks") {
      setSearchValue(new URLSearchParams(location.search).get("search") || "");
    }
  }

  // Handle focus trap and Esc key for mobile drawer
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setMobileOpen(false);
        hamburgerRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on first interactive item
    const firstFocusable = drawerRef.current?.querySelector("button, a[href]");
    firstFocusable?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  // Focus mobile search input when expanded
  useEffect(() => {
    if (searchExpanded) {
      mobileSearchInputRef.current?.focus();
    }
  }, [searchExpanded]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (query) {
      navigate(`/tasks?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/tasks");
    }
    setSearchExpanded(false);
  };

  const isManager = user?.role === "manager";

  const navItems = isManager
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/tasks", label: "Tasks", icon: CheckSquare, end: true },
        { to: "/tasks/create", label: "Create Task", icon: PlusCircle },
        { to: "/profile", label: "Profile", icon: UserIcon },
      ]
    : [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/tasks", label: "My Tasks", icon: CheckSquare, end: true },
        { to: "/tasks/update-status", label: "Update Status", icon: Clock },
        { to: "/profile", label: "Profile", icon: UserIcon },
      ];

  const renderSidebarContent = (isMobile = false) => (
    <div className="sidebar-inner">
      {/* Top Logo / Brand row */}
      <div className="sidebar-brand-row">
        <Link
          to="/dashboard"
          className="sidebar-brand-link"
          onClick={() => isMobile && setMobileOpen(false)}
          title="TaskFlow Dashboard"
        >
          <div className="sidebar-brand-mark" aria-hidden="true">
            <CheckSquare size={19} strokeWidth={2.5} />
          </div>
          <span className="sidebar-brand-text">TaskFlow</span>
        </Link>

        {isMobile && (
          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={() => {
              setMobileOpen(false);
              hamburgerRef.current?.focus();
            }}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav" aria-label="Main">
        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to} className="sidebar-nav-item">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? "active" : ""}`
                  }
                  title={item.label}
                  aria-label={item.label}
                  onClick={() => isMobile && setMobileOpen(false)}
                >
                  <Icon size={20} className="sidebar-nav-icon" aria-hidden="true" />
                  <span className="sidebar-nav-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section with divider & Logout */}
      <div className="sidebar-bottom">
        <div className="sidebar-divider" role="separator" />
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={20} className="sidebar-nav-icon" aria-hidden="true" />
          <span className="sidebar-nav-label">Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      {/* Desktop / Tablet Sidebar (sticky rail on tablet, floating card on desktop) */}
      <aside className="app-sidebar desktop-sidebar" aria-label="Sidebar">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Slide-in Drawer */}
      {mobileOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => {
            setMobileOpen(false);
            hamburgerRef.current?.focus();
          }}
          aria-hidden="true"
        />
      )}
      <aside
        id="mobile-sidebar-drawer"
        ref={drawerRef}
        className={`mobile-sidebar-drawer ${mobileOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        aria-hidden={!mobileOpen}
      >
        {renderSidebarContent(true)}
      </aside>

      {/* Main View Area (Top bar + Content) */}
      <div className="app-main-viewport">
        {/* Top bar (white rounded bar, same height as logo row) */}
        <header className="app-topbar">
          {/* Left section: Hamburger (mobile only) + Search Input */}
          <div className="topbar-left">
            <button
              ref={hamburgerRef}
              type="button"
              className="topbar-hamburger-btn"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-sidebar-drawer"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            {/* Desktop / Tablet Search Form */}
            <form
              role="search"
              onSubmit={handleSearchSubmit}
              className="topbar-search-form"
            >
              <Search size={17} className="topbar-search-icon" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                className="topbar-search-input"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                aria-label="Search tasks"
              />
            </form>

            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              className="topbar-search-toggle"
              onClick={() => setSearchExpanded((prev) => !prev)}
              aria-expanded={searchExpanded}
              aria-label="Toggle search input"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Right section: New task button (manager only) + User profile chip */}
          <div className="topbar-right">
            {isManager && (
              <Link
                to="/tasks/create"
                className="topbar-new-task-btn"
                title="Create a new task"
              >
                <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
                <span>New task</span>
              </Link>
            )}

            <Link
              to="/profile"
              className="topbar-user-badge"
              title="View your profile"
              style={{ textDecoration: "none" }}
            >
              <Avatar name={user?.name || "User"} size="sm" />
              <div className="topbar-user-info">
                <span className="topbar-user-name">{user?.name}</span>
                <Badge role={user?.role} withDot={false} />
              </div>
            </Link>
          </div>

          {/* Expandable Mobile Search Bar Dropdown */}
          {searchExpanded && (
            <div className="topbar-mobile-search-bar" role="search">
              <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                <Search size={18} className="topbar-search-icon" aria-hidden="true" />
                <input
                  ref={mobileSearchInputRef}
                  type="search"
                  className="mobile-search-input"
                  placeholder="Search tasks..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  aria-label="Search tasks"
                />
                <button
                  type="button"
                  className="mobile-search-close"
                  onClick={() => setSearchExpanded(false)}
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </form>
            </div>
          )}
        </header>

        {/* Content area: Cream background, max-width ~1280px, 24px gaps */}
        <main id="main-content" className="app-main-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
