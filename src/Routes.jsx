import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ReportsCenter from './pages/reports-center';
import LoginPage from './pages/login';
import TransactionManagement from './pages/transaction-management';
import AnalyticsForecasting from './pages/analytics-forecasting';
import CompanyAccountSettings from './pages/company-account-settings';
import OverviewDashboard from './pages/overview-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<OverviewDashboard />} />
        <Route path="/overview-dashboard" element={<OverviewDashboard />} />
        <Route path="/reports-center" element={<ReportsCenter />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/transaction-management" element={<TransactionManagement />} />
        <Route path="/analytics-forecasting" element={<AnalyticsForecasting />} />
        <Route path="/company-account-settings" element={<CompanyAccountSettings />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;