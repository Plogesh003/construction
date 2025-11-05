import React, { useState } from 'react';
import {
  Home,
  Building2,
  Package,
  Hammer,
  DollarSign,
  Bell,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Truck,
  FileText,
  BarChart2,
  PieChart,
  UserCheck,
  User,
  ChevronDown,
  Plus,
  Search
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import InventoryDashboard from './InventoryDashboard';
import ProjectManagementDashboard from './ProjectManagementDashboard';
import RentalManagementDashboard from './RentalManagementDashboard';
import AccountingBillingDashboard from './AccountingBillingDashboard';
import ReportsAnalyticsDashboard from './ReportsAnalyticsDashboard';
import TeamManagementDashboard from './TeamManagementDashboard';

// Mock KPI Chart Component
const KpiChart = ({ title, value }) => (
  <div style={{
    background: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    flex: 1,
    minWidth: 200,
    border: '1px solid #dee2e6'
  }}>
    <h4 style={{ margin: 0, color: '#495057', fontSize: 14 }}>{title}</h4>
    <BarChart2 size={48} color="#212529" style={{ margin: '8px auto' }} />
    <p style={{ margin: 0, fontWeight: 600, fontSize: 18, color: '#212529' }}>{value}</p>
  </div>
);

// Mock Notification Component
const Notification = ({ title, message, avatar }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderBottom: '1px solid #dee2e6',
    background: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    border: '1px solid #dee2e6'
  }}>
    <div style={{ fontSize: 20 }}>{avatar}</div>
    <div>
      <h5 style={{ margin: 0, fontSize: 14, color: '#212529' }}>{title}</h5>
      <p style={{ margin: 0, fontSize: 12, color: '#6c757d' }}>{message}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats] = useState([
    { id: 'scaffolds', title: 'Total Scaffolds', value: '1247 KPIs', icon: <Building2 size={24} /> },
    { id: 'rented', title: 'Rented Items', value: '89 PAX/W', icon: <Package size={24} /> },
    { id: 'payments', title: 'Outstanding Payments', value: '$156,005', icon: <DollarSign size={24} /> },
  ]);

  const [notifications] = useState([
    { id: '1', title: 'Project Management', message: 'Project X timeline has been updated.', avatar: '👤', read: false },
    { id: '2', title: 'Payment Disbursement', message: 'Payment for Project Y has been disbursed.', avatar: '💰', read: false },
    { id: '3', title: 'Rental Management', message: 'New rental request from Site A.', avatar: '📦', read: true },
    { id: '4', title: 'Reports & Analytics', message: 'Monthly report is ready for review.', avatar: '📊', read: true },
  ]);

  const quickLinks = [
    { id: 'inventory', title: 'Inventory', icon: <Package size={20} />, href: '/inventory' },
    { id: 'performance', title: 'Performance', icon: <BarChart2 size={20} />, href: '/performance' },
    { id: 'payments', title: 'Payment', icon: <DollarSign size={20} />, href: '/payments' },
    { id: 'team', title: 'Team', icon: <Users size={20} />, href: '/team' },
  ];

  const [view, setView] = useState('dashboard');
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      display: 'flex'
    }}>
      <Sidebar onNavigate={setView} active={view} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar unreadCount={unreadCount} title="Executive" />
        <main style={{ padding: 20, gap: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {view === 'inventory' ? (
            <InventoryDashboard />
          ) : view === 'projects' ? (
            <ProjectManagementDashboard />
          ) : view === 'rentals' ? (
            <RentalManagementDashboard />
          ) : view === 'payments' ? (
            <AccountingBillingDashboard />
          ) : view === 'reports' ? (
            <ReportsAnalyticsDashboard />
          ) : view === 'team' ? (
            <TeamManagementDashboard />
          ) : (
            <>
              <section>
                <h2 style={{ color: '#212529', fontSize: 20, marginBottom: 16 }}>Total Scaffolds</h2>
                <div style={{ display: 'flex', gap: 16 }}>
                  {stats.map(stat => (
                    <KpiChart key={stat.id} title={stat.title} value={stat.value} />
                  ))}
                </div>
              </section>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginTop: 10, flex: 1 }}>
                <div>
                  <h3 style={{ color: '#212529', fontSize: 16, marginBottom: 12 }}>Utilities</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                    {quickLinks.map(link => (
                      <a
                        key={link.id}
                        href={link.href}
                        style={{
                          background: '#343a40',
                          color: 'white',
                          padding: 12,
                          borderRadius: 8,
                          textAlign: 'center',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          border: '1px solid #dee2e6'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#212529'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#343a40'}
                      >
                        <div style={{ fontSize: 20, margin: '0 auto 8px', color: 'white' }}>{link.icon}</div>
                        <p style={{ margin: 0, fontSize: 12, color: 'white' }}>{link.title}</p>
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ color: '#212529', fontSize: 16, marginBottom: 12 }}>Notifications</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.map(notification => (
                      <Notification
                        key={notification.id}
                        title={notification.title}
                        message={notification.message}
                        avatar={notification.avatar}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
