import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SubmitTimesheet from "./pages/SubmitTimesheet";
import ManagerDashboard from "./pages/ManagerDashboard";
import ReviewTimesheet from "./pages/ReviewTimesheet";
import AdminConfig from "./pages/AdminConfig";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee" element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="/submit" element={
          <ProtectedRoute requiredRole="employee">
            <SubmitTimesheet />
          </ProtectedRoute>
        } />
        <Route path="/manager" element={
          <ProtectedRoute requiredRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/review/:id" element={
          <ProtectedRoute requiredRole="manager">
            <ReviewTimesheet />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminConfig />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;