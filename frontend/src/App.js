import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import InventoryDashboard from './dashboard/InventoryDashboard';
import ProjectManagementDashboard from './dashboard/ProjectManagementDashboard';
import RentalManagementDashboard from './dashboard/RentalManagementDashboard';
import AccountingBillingDashboard from './dashboard/AccountingBillingDashboard';
import ReportsAnalyticsDashboard from './dashboard/ReportsAnalyticsDashboard';
import TeamManagementDashboard from './dashboard/TeamManagementDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<InventoryDashboard />} />
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="projects" element={<ProjectManagementDashboard />} />
          <Route path="rentals" element={<RentalManagementDashboard />} />
          <Route path="payments" element={<AccountingBillingDashboard />} />
          <Route path="reports" element={<ReportsAnalyticsDashboard />} />
          <Route path="team" element={<TeamManagementDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
