// src/components/LandingPage.js
import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SmoothScroll from "./lib/smoothSScroll";
import SchoolProfile from "./components/pages/schoolProfile";
import LoginPage from "./components/pages/Login";
import RegisterPage from "./components/pages/Register";
import ApplicationForm from "./components/pages/Application";
import SearchPage from "./components/pages/searchPage";
import SchoolDashboard from "./components/dashboard/SchoolDashboard";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import SuperAdminDashboard from "./components/dashboard/SuperAdminDashboard";
import { CompareProvider } from "./context/CompareContext";
import LandingPage from "./components/pages/LandingPage";
import { withAuth } from "./hooks/withAuth";
import { useAuth } from "./hooks/useAuth";
import AddSchoolForm from "./components/dashboard/AddSchool";
// import DashboardLayout from "./dashboard/DashboardLayout";
import AddSchoolImagesForm from "./components/dashboard/AddSchoolImagesForm";
import ComparePage from "./components/pages/ComparePage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Error404 from "./components/pages/404"


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const ProtectedRoute = ({ element: Element, allowedRoles, ...rest }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Element {...rest} />;
};


const App = () => {
  // dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <div className="relative">
        <SmoothScroll>
          <CompareProvider>
            <Routes>
            <Route path="*" element={<Error404 />} />
              <Route path="/" element={<LandingPage />} />
             

              <Route path="/add" element={<AddSchoolImagesForm />}>
                <Route index element={<Navigate to="home" replace />} />
               

                <Route
                  path="home"
                  element={
                    <ProtectedRoute
                      element={({ user }) => {
                        switch (user.role) {
                          case "superadmin":
                            return (
                              <Navigate to="/dashboard/superadmin" replace />
                            );
                          case "admin":
                            return <Navigate to="/dashboard/school" replace />;
                          case "student":
                            return <Navigate to="/dashboard/student" replace />;
                          default:
                            return <Navigate to="/login" replace />;
                        }
                      }}
                    />
                  }
                />
                <Route
                  path="superadmin"
                  element={
                    <ProtectedRoute
                      element={SuperAdminDashboard}
                      allowedRoles={["superadmin"]}
                    />
                  }
                />
                <Route
                  path="school"
                  element={
                    <ProtectedRoute
                      element={SchoolDashboard}
                      allowedRoles={["admin"]}
                    />
                  }
                />
                <Route
                  path="student"
                  element={
                    <ProtectedRoute
                      element={StudentDashboard}
                      allowedRoles={["student"]}
                    />
                  }
                />
              </Route>

              {/* Other Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/addSchool" element={<AddSchoolForm />} />
              <Route path="/apply/:schoolId" element={<ApplicationForm />} />
              {/* <Route path="/schooldash" element={<SchoolDashboard />} />
            <Route path="/studentdash" element={<StudentDashboard />} />
            <Route path="/superadmin" element={<SuperAdminDashboard />} /> */}

              <Route path="/schools/:id" element={<SchoolProfile />} />
              {/* <Route path="/schools/:schoolId/dashboard" element={<Dashboard />} /> */}
            </Routes>
          </CompareProvider>
        </SmoothScroll>
      </div>
    </Router>
    </QueryClientProvider>
  );
};

export default App;
