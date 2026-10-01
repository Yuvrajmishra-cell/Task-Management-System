import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import UpdateStatus from "./pages/UpdateStatus";

import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/create"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/update-status"
          element={
            <ProtectedRoute>
              <UpdateStatus />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;