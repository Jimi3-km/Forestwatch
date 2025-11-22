



import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import PublicDashboardPage from '../pages/PublicDashboardPage';
import SubmitReportPage from '../pages/SubmitReportPage';
import PlantIdentifyPage from '../pages/PlantIdentifyPage';
import OfficialDashboardLayout from '../layouts/OfficialDashboardLayout';
import OfficialOverviewPage from '../pages/OfficialOverviewPage';
import OfficialAnalysisPage from '../pages/OfficialAnalysisPage';
import OfficialMapPage from '../pages/OfficialMapPage';
import OfficialAlertsPage from '../pages/OfficialAlertsPage';
import OfficialReportsHistoryPage from '../pages/OfficialReportsHistoryPage';
import OfficialDataInputsPage from '../pages/OfficialDataInputsPage';
import OfficialManagementPage from '../pages/OfficialManagementPage';
import WasteDashboardPage from '../pages/WasteDashboardPage';
import PesDashboardPage from '../pages/PesDashboardPage';
import RestorationDashboardPage from '../pages/RestorationDashboardPage';
import PartnerHubPage from '../pages/PartnerHubPage';
import KnowledgeHubPage from '../pages/KnowledgeHubPage';

const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect to a relevant page if role doesn't match
    return user.role === 'official' ? <Navigate to="/dashboard/overview" replace /> : <Navigate to="/public-dashboard" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'official' ? '/dashboard/overview' : '/public-dashboard'} /> : <LoginPage />} />
      
      {/* Community User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['common']} />}>
        <Route path="/public-dashboard" element={<PublicDashboardPage />} />
        <Route path="/submit-report" element={<SubmitReportPage />} />
        <Route path="/plant-id" element={<PlantIdentifyPage />} />
      </Route>
      
      {/* Official User Routes */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['official']} />}>
        <Route element={<OfficialDashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OfficialOverviewPage />} />
          <Route path="analysis" element={<OfficialAnalysisPage />} />
          <Route path="map" element={<OfficialMapPage />} />
          <Route path="alerts" element={<OfficialAlertsPage />} />
          <Route path="restoration" element={<RestorationDashboardPage />} />
          <Route path="partners" element={<PartnerHubPage />} />
          <Route path="knowledge" element={<KnowledgeHubPage />} />
          <Route path="reports" element={<OfficialReportsHistoryPage />} />
          <Route path="data-inputs" element={<OfficialDataInputsPage />} />
          <Route path="waste" element={<WasteDashboardPage />} />
          <Route path="pes" element={<PesDashboardPage />} />
          <Route path="management" element={<OfficialManagementPage />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;