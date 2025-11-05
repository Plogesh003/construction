import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Link2, Users, MapPin, ClipboardList, Factory, Wrench } from 'lucide-react';

const card = {
  background: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: 14,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

const popupStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  zIndex: 1000,
};

const popupContentStyle = {
  background: 'white',
  width: 560,
  borderRadius: 8,
  padding: 20,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  border: '1px solid #d1d5db',
};

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '0.5rem 1rem',
  borderRadius: 6,
  cursor: 'pointer',
  border: '1px solid #d1d5db',
  fontWeight: 500,
  fontSize: 14,
};

const saveButtonStyle = {
  ...buttonStyle,
  background: '#374151',
  color: 'white',
  borderColor: '#374151',
};

const createButtonStyle = {
  ...buttonStyle,
  background: '#6b7280',
  color: 'white',
  borderColor: '#6b7280',
};

const cancelButtonStyle = {
  ...buttonStyle,
  background: '#f9fafb',
  color: '#374151',
  borderColor: '#d1d5db',
};

export default function ProjectManagementDashboard() {
  const [sites, setSites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [teams] = useState([
    { id: 'TEAM-A', name: 'Formwork Crew A', members: 12 },
    { id: 'TEAM-B', name: 'Erection Crew B', members: 9 },
    { id: 'TEAM-C', name: 'Safety & QA', members: 6 },
  ]);

  const [newSite, setNewSite] = useState({
    id: '',
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    progress: 0,
  });

  const [newOrder, setNewOrder] = useState({
    id: '',
    siteId: '',
    description: '',
    quantity: 0,
    uom: 'pcs',
    status: 'Requested',
  });

  const [showSitePopup, setShowSitePopup] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);

  useEffect(() => {
    fetchSites();
    fetchOrders();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sites');
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error.response?.data || error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
    }
  };

  const addSite = async () => {
    if (!newSite.id || !newSite.name) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/sites', newSite);
      fetchSites();
      setNewSite({ id: '', name: '', location: '', startDate: '', endDate: '', progress: 0 });
      setShowSitePopup(false);
    } catch (error) {
      console.error('Error adding site:', error.response?.data || error.message);
      alert('Error adding site. Please check the console for details.');
    }
  };

  const createOrder = async () => {
    if (!newOrder.id || !newOrder.siteId) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/orders', newOrder);
      fetchOrders();
      setNewOrder({ id: '', siteId: '', description: '', quantity: 0, uom: 'pcs', status: 'Requested' });
      setShowOrderPopup(false);
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      alert('Error creating order. Please check the console for details.');
    }
  };

  const updateProgress = async (siteId, delta) => {
    try {
      await axios.put('http://localhost:5000/api/sites/progress', { id: siteId, delta });
      fetchSites();
    } catch (error) {
      console.error('Error updating progress:', error.response?.data || error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: 24,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: 16 }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>Project Management</h2>

        {/* Top actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Factory size={18} color="#6b7280" />
              <strong>Add new construction site</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setShowSitePopup(true)} style={saveButtonStyle}>
                <Plus size={16} /> Add Site
              </button>
            </div>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Link2 size={18} color="#6b7280" />
              <strong>Link scaffold rental to project</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setShowOrderPopup(true)} style={createButtonStyle}>
                <Link2 size={16} /> Create Link
              </button>
            </div>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Users size={18} color="#6b7280" />
              <strong>Assign workers/teams</strong>
            </div>
          </div>
        </div>

        {/* Popup for Add New Construction Site */}
        {showSitePopup && (
          <div style={popupStyle}>
            <div style={popupContentStyle}>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>Add New Construction Site</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>ID</span>
                  <input
                    value={newSite.id}
                    onChange={(e) => setNewSite({ ...newSite, id: e.target.value })}
                    placeholder="e.g., SITE-001"
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>Name</span>
                  <input
                    value={newSite.name}
                    onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                    placeholder="Site name"
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>Location</span>
                  <input
                    value={newSite.location}
                    onChange={(e) => setNewSite({ ...newSite, location: e.target.value })}
                    placeholder="Location"
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>Start Date</span>
                  <input
                    type="date"
                    value={newSite.startDate}
                    onChange={(e) => setNewSite({ ...newSite, startDate: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>End Date</span>
                  <input
                    type="date"
                    value={newSite.endDate}
                    onChange={(e) => setNewSite({ ...newSite, endDate: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  />
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                <button onClick={() => setShowSitePopup(false)} style={cancelButtonStyle}>
                  Cancel
                </button>
                <button onClick={addSite} style={saveButtonStyle}>
                  <Plus size={16} /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup for Link Scaffold Rental to Project */}
        {showOrderPopup && (
          <div style={popupStyle}>
            <div style={popupContentStyle}>
              <h3 style={{ marginTop: 0, color: '#1f2937' }}>Link Scaffold Rental to Project</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>Order ID</span>
                  <input
                    value={newOrder.id}
                    onChange={(e) => setNewOrder({ ...newOrder, id: e.target.value })}
                    placeholder="e.g., RENT-101"
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>Site</span>
                  <select
                    value={newOrder.siteId}
                    onChange={(e) => setNewOrder({ ...newOrder, siteId: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  >
                    <option value="">Select Site</option>
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id} - {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>Description</span>
                  <input
                    value={newOrder.description}
                    onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                    placeholder="Description"
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>Quantity</span>
                  <input
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                    placeholder="Quantity"
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  />
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>Unit of Measure</span>
                  <select
                    value={newOrder.uom}
                    onChange={(e) => setNewOrder({ ...newOrder, uom: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}
                  >
                    <option>pcs</option>
                    <option>m²</option>
                    <option>sets</option>
                  </select>
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                <button onClick={() => setShowOrderPopup(false)} style={cancelButtonStyle}>
                  Cancel
                </button>
                <button onClick={createOrder} style={createButtonStyle}>
                  <Link2 size={16} /> Create Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <MapPin size={18} color="#6b7280" />
                <strong>Construction Sites</strong>
              </div>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Location</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Start</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>End</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Progress</th>
                    <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{s.id}</td>
                      <td style={{ padding: '10px 12px' }}>{s.name}</td>
                      <td style={{ padding: '10px 12px' }}>{s.location}</td>
                      <td style={{ padding: '10px 12px' }}>{s.startDate}</td>
                      <td style={{ padding: '10px 12px' }}>{s.endDate}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ height: 8, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden', width: 140 }}>
                          <div style={{ width: `${s.progress}%`, background: '#374151', height: '100%' }}></div>
                        </div>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>{s.progress}%</span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <button
                          onClick={() => updateProgress(s.id, 5)}
                          style={{
                            background: '#374151',
                            color: '#fff',
                            border: 0,
                            padding: '6px 8px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            marginRight: 6,
                          }}
                        >
                          +5%
                        </button>
                        <button
                          onClick={() => updateProgress(s.id, -5)}
                          style={{
                            background: '#9ca3af',
                            color: '#fff',
                            border: 0,
                            padding: '6px 8px',
                            borderRadius: 6,
                            cursor: 'pointer',
                          }}
                        >
                          -5%
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <ClipboardList size={18} color="#6b7280" />
                <strong>Scaffold Rental Orders</strong>
              </div>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Order</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Site</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Description</th>
                    <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Qty</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{o.id}</td>
                      <td style={{ padding: '10px 12px' }}>{o.siteId}</td>
                      <td style={{ padding: '10px 12px' }}>{o.description}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        {o.quantity} {o.uom}
                      </td>
                      <td style={{ padding: '10px 12px', color: o.status === 'In Transit' ? '#d97706' : '#059669' }}>
                        {o.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Users size={18} color="#6b7280" />
                <strong>Teams & Assignments</strong>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                {teams.map((t) => (
                  <li
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{t.members} members</div>
                    </div>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: '#6b7280' }}></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
