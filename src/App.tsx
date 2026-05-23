import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Documents } from "./pages/Documents";
import { DocumentDetail } from "./pages/DocumentDetail";
import { AnalysisResult } from "./pages/AnalysisResult";
import { Criteria } from "./pages/Criteria";
import { Laws } from "./pages/Laws";
import { Users } from "./pages/Users";
import { Audit } from "./pages/Audit";
import { Usage } from "./pages/Usage";
import { ChangePassword } from "./pages/ChangePassword";
import { Settings } from "./pages/Settings";
import { Layout } from "./components/shared/Layout";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="documents" element={<ErrorBoundary><Documents /></ErrorBoundary>} />
        <Route path="documents/:id" element={<ErrorBoundary><DocumentDetail /></ErrorBoundary>} />
        <Route path="analyses/:id" element={<ErrorBoundary><AnalysisResult /></ErrorBoundary>} />
        <Route path="criteria" element={<ErrorBoundary><Criteria /></ErrorBoundary>} />
        <Route path="laws" element={<ErrorBoundary><Laws /></ErrorBoundary>} />
        <Route path="users" element={<ProtectedRoute superOnly><ErrorBoundary><Users /></ErrorBoundary></ProtectedRoute>} />
        <Route path="usage" element={<ProtectedRoute superOnly><ErrorBoundary><Usage /></ErrorBoundary></ProtectedRoute>} />
        <Route path="audit" element={<ProtectedRoute superOnly><ErrorBoundary><Audit /></ErrorBoundary></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute superOnly><ErrorBoundary><Settings /></ErrorBoundary></ProtectedRoute>} />
        <Route path="change-password" element={<ErrorBoundary><ChangePassword /></ErrorBoundary>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
