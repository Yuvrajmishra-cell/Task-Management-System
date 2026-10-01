import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import UpdateStatus from "./pages/UpdateStatus";
import Profile from "./pages/Profile";
import UiKit from "./pages/UiKit";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";
import ErrorBoundary from "./components/ErrorBoundary";

import { useAuth } from "./context/AuthContext";

import AppLayout from "./components/layout/AppLayout";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <AccessDenied requiredRole={allowedRoles[0]} userRole={user.role} />;
  }

  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Dev-only UI Kit route (preserved upon user request) */}
          <Route path="/ui-kit" element={<UiKit />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Authenticated Application with AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route
              path="/tasks/create"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <CreateTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/update-status"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <UpdateStatus />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;