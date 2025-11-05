import React from 'react';
import { Bell, Plus, Search, MapPin } from 'lucide-react';

const Navbar = ({ unreadCount = 0, title = 'Executive Dashboard' }) => {
    return (
        <header style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 20 }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '280px 1fr auto auto auto',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button aria-label="menu" style={{ border: 0, background: 'transparent', color: '#6b7280', cursor: 'pointer' }}>≡</button>
                    <div style={{ fontWeight: 800, color: '#111827' }}>{title}</div>
                </div>
                <div style={{ position: 'relative' }}>
                    <input placeholder="Search Anything" style={{ width: '30%', padding: '10px 14px 10px 38px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb' }} />
                    <span style={{ position: 'absolute', left: 10, top: 9, color: '#9ca3af' }}><Search size={18} /></span>
                </div>
                
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #1d4ed8', background: '#1d4ed8', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer' }}>
                    <Plus size={18} /> New
                </button>
                <div style={{ position: 'relative', padding: 10, borderRadius: 10, border: '1px solid #e5e7eb', background: '#f9fafb', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span style={{ position: 'absolute', top: -2, right: -2, background: '#ef4444', color: '#fff', fontSize: 10, borderRadius: 999, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;


