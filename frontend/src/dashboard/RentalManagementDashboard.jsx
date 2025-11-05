import React, { useMemo, useState } from 'react';
import {
  Plus,
  Calendar,
  User,
  FileText,
  DollarSign,
  Mail,
  Printer,
  Undo2,
  AlertTriangle,
  Clock,
  X,
} from 'lucide-react';

const card = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '0.5rem',
  padding: '1rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};
const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  border: '1px solid #d1d5db',
  fontWeight: 500,
  fontSize: '0.875rem',
};
const saveButtonStyle = {
  ...buttonStyle,
  background: '#374151',
  color: 'white',
  borderColor: '#374151',
};
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};
const modalContentStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '0.5rem',
  width: '500px',
  maxWidth: '90%',
};

const nowIso = () => new Date().toISOString().slice(0, 10);

const initialOrders = [
  {
    id: 'RENT-001',
    client: 'ABC Construction',
    start: '2025-09-01',
    duration: 30,
    unit: 'daily',
    rate: 1200,
    item: 'Cuplock set 200m²',
    status: 'Active',
    site: 'SITE-001',
  },
  {
    id: 'RENT-002',
    client: 'Metro Build Ltd',
    start: '2025-09-15',
    duration: 8,
    unit: 'weekly',
    rate: 24000,
    item: 'Tubes & Clamps 1000 pcs',
    status: 'Active',
    site: 'SITE-002',
  },
];

export default function RentalManagementDashboard() {
  const [orders, setOrders] = useState(initialOrders);
  const [form, setForm] = useState({
    id: '',
    client: '',
    start: nowIso(),
    duration: 7,
    unit: 'weekly',
    rate: 0,
    item: '',
    site: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [returns, setReturns] = useState([]);
  const [renewals, setRenewals] = useState([]);

  const calcRent = (duration, unit, rate) => {
    const d = Number(duration) || 0;
    const r = Number(rate) || 0;
    if (unit === 'daily') return d * r;
    if (unit === 'weekly') return Math.ceil(d / 7) * r;
    if (unit === 'monthly') return Math.ceil(d / 30) * r;
    return 0;
  };

  const estimated = useMemo(
    () => calcRent(form.duration, form.unit, form.rate),
    [form.duration, form.unit, form.rate]
  );

  const addOrder = async () => {
    if (!form.id || !form.client) return;

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: form.id,
          client: form.client,
          startDate: form.start,
          duration: form.duration,
          unit: form.unit,
          rate: form.rate,
          item: form.item,
          site: form.site,
          estimatedRent: estimated,
        }),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        setOrders((prev) => [{ ...form, status: 'Active' }, ...prev]);

        const startDate = new Date(form.start);
        const end = new Date(startDate);
        if (form.unit === 'daily') end.setDate(end.getDate() + Number(form.duration || 0));
        if (form.unit === 'weekly') end.setDate(end.getDate() + 7 * Number(form.duration || 0));
        if (form.unit === 'monthly') end.setMonth(end.getMonth() + Number(form.duration || 0));
        const due = new Date(end);
        due.setDate(due.getDate() - 3);
        setRenewals((prev) => [{ orderId: form.id, dueDate: due.toISOString().slice(0, 10) }, ...prev]);

        setForm({
          id: '',
          client: '',
          start: nowIso(),
          duration: 7,
          unit: 'weekly',
          rate: 0,
          item: '',
          site: '',
        });
        setShowModal(false);
      } else {
        console.error('Failed to save order');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const processReturn = (orderId, returnDate, damages = 0) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const startDate = new Date(order.start);
    const expected = new Date(startDate);
    if (order.unit === 'daily') expected.setDate(expected.getDate() + order.duration);
    if (order.unit === 'weekly') expected.setDate(expected.getDate() + order.duration * 7);
    if (order.unit === 'monthly') expected.setMonth(expected.getMonth() + order.duration);
    const actual = new Date(returnDate);
    const lateDays = Math.max(0, Math.ceil((actual - expected) / (1000 * 60 * 60 * 24)));
    const lateFees = lateDays * (order.unit === 'daily' ? order.rate : order.rate / (order.unit === 'weekly' ? 7 : 30));
    setReturns((prev) => [{ orderId, returnDate, lateDays, lateFees, damages }, ...prev]);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'Returned' } : o)));
  };

  const generateInvoice = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const base = calcRent(order.duration, order.unit, order.rate);
    const ret = returns.find((r) => r.orderId === orderId);
    const extra = ret ? ret.lateFees + (ret.damages || 0) : 0;
    const total = base + extra;
    const text = `INVOICE\nOrder: ${order.id}\nClient: ${order.client}\nItem: ${order.item}\nDuration: ${order.duration} ${order.unit}\nBase Rent: ${base}\nExtra: ${extra}\nTOTAL: ${total}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.id}-invoice.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '1.5rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: '1rem' }}>
        <h2 style={{ color: '#1f2937', margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          Rental & Contract Management
        </h2>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Plus size={16} color="#6b7280" />
            <strong>Create Rental Order</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowModal(true)} style={saveButtonStyle}>
              <Plus size={14} /> Create Order
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <FileText size={16} color="#6b7280" />
              <strong>Active Orders</strong>
            </div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Order</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Client</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Start</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Duration</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Rate</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Unit</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Item</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.5rem', fontWeight: 500 }}>{order.id}</td>
                    <td style={{ padding: '0.5rem' }}>{order.client}</td>
                    <td style={{ padding: '0.5rem' }}>{order.start}</td>
                    <td style={{ padding: '0.5rem' }}>{order.duration}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>{order.rate.toLocaleString()}</td>
                    <td style={{ padding: '0.5rem' }}>{order.unit}</td>
                    <td style={{ padding: '0.5rem' }}>{order.item}</td>
                    <td style={{ padding: '0.5rem', color: order.status === 'Active' ? '#1f2937' : '#6b7280' }}>{order.status}</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => generateInvoice(order.id)}
                        title="Download Invoice"
                        style={{ border: 0, background: 'transparent', cursor: 'pointer', marginRight: '0.5rem' }}
                      >
                        <Printer size={16} color="#6b7280" />
                      </button>
                      <button
                        onClick={() => processReturn(order.id, nowIso(), 0)}
                        title="Mark Returned"
                        style={{ border: 0, background: 'transparent', cursor: 'pointer' }}
                      >
                        <Undo2 size={16} color="#6b7280" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={16} color="#6b7280" />
                <strong>Returns & Late Fees</strong>
              </div>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Order</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Return Date</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Late Days</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Late Fees</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>Damages</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((ret) => (
                    <tr key={`${ret.orderId}-${ret.returnDate}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 500 }}>{ret.orderId}</td>
                      <td style={{ padding: '0.5rem' }}>{ret.returnDate}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>{ret.lateDays}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>{Math.round(ret.lateFees).toLocaleString()}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>{(ret.damages || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Clock size={16} color="#6b7280" />
                <strong>Renewal Reminders</strong>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.5rem' }}>
                {renewals.map((renewal) => (
                  <li
                    key={`${renewal.orderId}-${renewal.dueDate}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: '0.5rem',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <span>
                      Order <b>{renewal.orderId}</b> renewal on <b>{renewal.dueDate}</b>
                    </span>
                    <button
                      onClick={() => alert('Email sent')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#6b7280',
                        color: 'white',
                        border: 0,
                        padding: '0.375rem 0.625rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      <Mail size={14} /> Email Client
                    </button>
                  </li>
                ))}
                {renewals.length === 0 && (
                  <li style={{ color: '#6b7280', fontSize: '0.75rem' }}>No upcoming renewals</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Create Rental Order</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  placeholder="Order ID"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <input
                  placeholder="Client"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="date"
                  value={form.start}
                  onChange={(e) => setForm({ ...form, start: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Duration"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input
                  type="number"
                  placeholder="Rate"
                  value={form.rate}
                  onChange={(e) => setForm({ ...form, rate: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  placeholder="Item / Scope"
                  value={form.item}
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <input
                  placeholder="Site"
                  value={form.site}
                  onChange={(e) => setForm({ ...form, site: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Estimated Rent: <b>{estimated.toLocaleString()}</b>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setShowModal(false)} style={buttonStyle}>
                  Cancel
                </button>
                <button onClick={addOrder} style={saveButtonStyle}>
                  <Plus size={14} /> Create Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
