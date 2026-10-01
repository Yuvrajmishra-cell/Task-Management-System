import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Module-level cache for employees list (excludes manager; merged per-use)
let employeeCache = null;
let employeePromise = null;

export function useEmployeeMap() {
  const { user } = useAuth();
  const [employeeMap, setEmployeeMap] = useState(() => employeeCache || {});
  const [loading, setLoading] = useState(!employeeCache && user?.role === "manager");

  useEffect(() => {
    if (!user) return;

    const currentUserId = String(user.id || user._id || "");

    if (user.role === "employee") {
      // Employees only ever receive tasks assigned to themselves
      const map = {
        [currentUserId]: {
          name: user.name || "Unknown employee",
          email: user.email || "",
        },
      };
      setEmployeeMap(map);
      setLoading(false);
      return;
    }

    if (user.role === "manager") {
      if (employeeCache) {
        // Always ensure the current manager is in the map
        const merged = {
          [currentUserId]: { name: user.name || "Me", email: user.email || "" },
          ...employeeCache,
        };
        setEmployeeMap(merged);
        setLoading(false);
        return;
      }

      if (!employeePromise) {
        employeePromise = api
          .get("/auth/employees")
          .then((res) => {
            const map = {};
            if (Array.isArray(res.data)) {
              res.data.forEach((emp) => {
                const id = String(emp._id || emp.id || "");
                if (id) {
                  map[id] = {
                    name: emp.name || "Unknown employee",
                    email: emp.email || "",
                  };
                }
              });
            }
            employeeCache = map;
            return map;
          })
          .catch((err) => {
            console.error("Failed to load employee map:", err);
            return {};
          })
          .finally(() => {
            employeePromise = null;
          });
      }

      employeePromise.then((map) => {
        // Always seed current manager into the map
        const merged = {
          [currentUserId]: { name: user.name || "Me", email: user.email || "" },
          ...map,
        };
        setEmployeeMap(merged);
        setLoading(false);
      });
    }
  }, [user]);

  const getAssignee = (assignedTo) => {
    if (!assignedTo) {
      if (user?.role === "employee") {
        return { name: user.name || "Unknown employee", email: user.email || "" };
      }
      return { name: "Unknown employee", email: "" };
    }

    // If populated object
    if (typeof assignedTo === "object") {
      if (assignedTo.name) {
        return { name: assignedTo.name, email: assignedTo.email || "" };
      }
      const objId = String(assignedTo._id || assignedTo.id || "");
      if (objId && employeeMap[objId]) {
        return employeeMap[objId];
      }
    }

    // If ID string
    const id = String(typeof assignedTo === "object" ? (assignedTo._id || assignedTo.id) : assignedTo);
    if (employeeMap[id]) {
      return employeeMap[id];
    }

    if (user?.role === "employee" && String(user.id || user._id) === id) {
      return { name: user.name || "Unknown employee", email: user.email || "" };
    }

    return { name: "Unknown employee", email: "" };
  };

  return { employeeMap, getAssignee, loading };
}

export default useEmployeeMap;
