import React from 'react';
import { Home, Package, Hammer, Truck, DollarSign, FileText, Users, ShieldCheck, BarChart2, PieChart, UserCheck } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { id: 'inventory', label: 'Inventory', icon: <Package size={18} /> },
  { id: 'projects', label: 'Projects', icon: <Hammer size={18} /> },
  { id: 'rentals', label: 'Rented Items', icon: <Truck size={18} /> },
  { id: 'payments', label: 'Payments', icon: <DollarSign size={18} /> },
  { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
  { id: 'team', label: 'Team', icon: <Users size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
];

const Sidebar = ({ onNavigate, active = 'dashboard' }) => {
  return (
    <aside style={{
      width: 260,
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#e5ecf7',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <ShieldCheck size={20} color="#ff6b35" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Construction</div>
          <div style={{ fontSize: 12, color: '#9fb3d8' }}>ERP</div>
        </div>
      </div>
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              border: 0,
              textAlign: 'left',
              background: active === item.id ? 'rgba(255, 107, 53, 0.2)' : 'transparent',
              color: active === item.id ? '#ff6b35' : '#dbe7ff',
              borderRadius: 8,
              margin: '4px 0',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span>{item.icon}</span>
            <span style={{ fontWeight: 500, fontSize: 14 }}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
