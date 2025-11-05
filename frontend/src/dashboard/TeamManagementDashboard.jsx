import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Edit,
  Trash2,
  Wrench,
  Package,
  MapPin,
  Layers,
  Barcode,
  Search,
  Save,
  X
} from 'lucide-react';

const CATEGORIES = ['Tube', 'Clamp', 'Cuplock', 'Frame', 'Board', 'Bracket', 'Base Plate'];

const emptyForm = {
  id: '',
  name: '',
  category: CATEGORIES[0],
  totalQty: 0,
  availableQty: 0,
  damagedQty: 0,
  location: '',
  condition: 'Good',
  lastMaintenance: new Date().toISOString().slice(0, 10),
  maintenanceHistory: []
};

const cardStyle = {
  background: '#ffffff',
  border: '1px solid #dee2e6',
  borderRadius: '0.75rem',
  padding: '1rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08)'
};

const popupStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  zIndex: 1000
};

const popupContentStyle = {
  background: 'white',
  width: 560,
  maxWidth: '95vw',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
};

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.6rem 1rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  border: 'none',
  fontWeight: 500
};

const addButtonStyle = {
  ...buttonStyle,
  background: '#212529',
  color: 'white'
};

const saveButtonStyle = {
  ...buttonStyle,
  background: '#212529',
  color: 'white'
};

const cancelButtonStyle = {
  ...buttonStyle,
  background: '#f8f9fa',
  color: '#212529',
  border: '1px solid #dee2e6'
};

const InventoryDashboard = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [form, setForm] = useState({ ...emptyForm });
  const [maintNotes, setMaintNotes] = useState('');
  const [maintAction, setMaintAction] = useState('Inspection');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/scaffolds');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to fetch items. Please try again.');
    }
  };

  const filtered = useMemo(() => {
    return items.filter(i =>
      (categoryFilter === 'All' || i.category === categoryFilter) &&
      (i.name.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()))
    );
  }, [items, search, categoryFilter]);

  const stats = useMemo(() => {
    const total = items.reduce((s, i) => s + i.totalQty, 0);
    const available = items.reduce((s, i) => s + i.availableQty, 0);
    const damaged = items.reduce((s, i) => s + i.damagedQty, 0);
    const utilization = total ? Math.round(((total - available) / total) * 100) : 0;
    return { total, available, damaged, utilization };
  }, [items]);

  const openNew = () => {
    setEditingIndex(-1);
    setForm({ ...emptyForm });
    setShowForm(true);
    setError('');
  };

  const openEdit = (index) => {
    const item = filtered[index];
    setEditingIndex(index);
    setForm({ ...item });
    setShowForm(true);
    setError('');
  };

  const saveForm = async () => {
    if (!form.id || !form.name) {
      setError('ID and Name are required.');
      return;
    }

    const normalized = {
      ...form,
      totalQty: Number(form.totalQty) || 0,
      availableQty: Number(form.availableQty) || 0,
      damagedQty: Number(form.damagedQty) || 0,
      lastMaintenance: form.lastMaintenance || new Date().toISOString().slice(0, 10)
    };

    try {
      if (editingIndex === -1) {
        await axios.post('http://localhost:5000/api/scaffolds', normalized);
      } else {
        const targetItem = items.find(i => i.id === filtered[editingIndex].id);
        if (!targetItem) {
          setError('Item not found.');
          return;
        }
        await axios.put(`http://localhost:5000/api/scaffolds/${targetItem._id}`, normalized);
      }
      fetchItems();
      setShowForm(false);
      setEditingIndex(-1);
      setForm({ ...emptyForm });
    } catch (error) {
      console.error('Error saving item:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to save item. Please try again.');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/scaffolds/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item. Please try again.');
    }
  };

  const addMaintenance = async () => {
    if (!maintNotes || !selectedItemId) return;
    const date = new Date().toISOString().slice(0, 10);
    try {
      await axios.post('http://localhost:5000/api/scaffolds/maintenance', {
        scaffoldId: selectedItemId,
        date,
        type: maintAction,
        notes: maintNotes
      });
      fetchItems();
      setMaintNotes('');
    } catch (error) {
      console.error('Error logging maintenance:', error);
      setError('Failed to log maintenance. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h2 style={{ color: '#212529', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Scaffold Inventory Management
        </h2>
        {/* Top Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or name"
              style={{
                width: '100%',
                padding: '0.75rem 2.25rem 0.75rem 2.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #dee2e6',
                background: '#ffffff'
              }}
            />
            <span style={{ position: 'absolute', left: 10, top: 10, color: '#6c757d' }}>
              <Search size={18} />
            </span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.75rem 0.9rem',
              borderRadius: '0.5rem',
              border: '1px solid #dee2e6',
              background: '#ffffff'
            }}
          >
            <option>All</option>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <button onClick={openNew} style={addButtonStyle}>
            <Plus size={18} /> Add Item
          </button>
          <button disabled style={{ ...addButtonStyle, opacity: 0.6, cursor: 'not-allowed' }}>
            <Barcode size={18} /> Barcode/QR
          </button>
        </div>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Layers size={20} color="#212529" />
              <div>
                <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>Total Units</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#212529' }}>{stats.total.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Package size={20} color="#212529" />
              <div>
                <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>Available</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#212529' }}>{stats.available.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Wrench size={20} color="#dc3545" />
              <div>
                <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>Damaged</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#dc3545' }}>{stats.damaged.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={20} color="#212529" />
              <div>
                <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>Utilization</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#212529' }}>{stats.utilization}%</div>
              </div>
            </div>
          </div>
        </div>
        {/* Items Table */}
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Category</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Total</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Available</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Damaged</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Location</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Condition</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Last Maintenance</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#212529' }}>{it.id}</td>
                  <td style={{ padding: '0.75rem', color: '#212529' }}>{it.name}</td>
                  <td style={{ padding: '0.75rem', color: '#212529' }}>{it.category}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#212529' }}>{it.totalQty}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#212529' }}>{it.availableQty}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: it.damagedQty ? '#dc3545' : '#28a745' }}>{it.damagedQty}</td>
                  <td style={{ padding: '0.75rem', color: '#212529' }}>{it.location}</td>
                  <td style={{ padding: '0.75rem', color: '#212529' }}>{it.condition}</td>
                  <td style={{ padding: '0.75rem', color: '#212529' }}>{it.lastMaintenance}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button onClick={() => openEdit(filtered.indexOf(it))} title="Edit" style={{ border: 0, background: 'transparent', cursor: 'pointer', marginRight: '0.5rem' }}>
                      <Edit size={18} color="#007bff" />
                    </button>
                    <button onClick={() => deleteItem(it._id)} title="Delete" style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
                      <Trash2 size={18} color="#dc3545" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Maintenance Panel */}
        <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
          <h3 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.125rem', color: '#212529' }}>
            Maintenance History & Condition Reports
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <select
                  value={maintAction}
                  onChange={(e) => setMaintAction(e.target.value)}
                  style={{ flex: 1, padding: '0.6rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                >
                  <option>Inspection</option>
                  <option>Repair</option>
                  <option>Service</option>
                  <option>Cleaning</option>
                </select>
              </div>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                style={{ padding: '0.6rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #dee2e6', marginBottom: '0.75rem' }}
              >
                <option value="">Select Item</option>
                {items.map((item) => (
                  <option key={item._id} value={item.id}>{item.id} - {item.name}</option>
                ))}
              </select>
              <textarea
                value={maintNotes}
                onChange={(e) => setMaintNotes(e.target.value)}
                placeholder="Notes"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #dee2e6',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button onClick={addMaintenance} style={saveButtonStyle}>
                  <Save size={16} /> Log Maintenance
                </button>
              </div>
            </div>
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Item</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Action</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6c757d' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.flatMap((item) =>
                    item.maintenanceHistory?.map((history, index) => (
                      <tr key={`${item._id}-${index}`}>
                        <td style={{ padding: '0.75rem', fontWeight: 600, color: '#212529' }}>{item.id}</td>
                        <td style={{ padding: '0.75rem', color: '#212529' }}>{history.date}</td>
                        <td style={{ padding: '0.75rem', color: '#212529' }}>{history.type || history.action}</td>
                        <td style={{ padding: '0.75rem', color: '#212529' }}>{history.notes}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Add / Edit Modal */}
        {showForm && (
          <div style={popupStyle}>
            <div style={popupContentStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#212529' }}>
                  {editingIndex === -1 ? 'Add Scaffold Item' : 'Update Scaffold Item'}
                </h3>
                <button onClick={() => { setShowForm(false); setEditingIndex(-1); }} style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              {error && (
                <div style={{ color: '#dc3545', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span style={{ color: '#212529', fontSize: '0.875rem' }}>ID</span>
                  <input
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    placeholder="e.g., SCF-100"
                    style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                  />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span style={{ color: '#212529', fontSize: '0.875rem' }}>Name</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Item name"
                    style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                  />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span style={{ color: '#212529', fontSize: '0.875rem' }}>Category</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span style={{ color: '#212529', fontSize: '0.875rem' }}>Location</span>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Where stored"
                    style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                  />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span style={{ color: '#212529', fontSize: '0.875rem' }}>Total Qty</span>
                  <input
                    type="number"
                    value={form.totalQty}
                    onChange={(e) => setForm({ ...form, totalQty: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                  />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span style={{ color: '#212529', fontSize: '0.875rem' }}>Available Qty</span>
                  <input
                    type="number"
                    value={form.availableQty}
                    onChange={(e) => setForm({ ...form, availableQty: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                  />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span style={{ color: '#212529', fontSize: '0.875rem' }}>Damaged Qty</span>
                  <input
                    type="number"
                    value={form.damagedQty}
                    onChange={(e) => setForm({ ...form, damagedQty: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                  />
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span style={{ color: '#212529', fontSize: '0.875rem' }}>Condition</span>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                  >
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                  </select>
                </label>
                <label style={{ display: 'grid', gap: '0.5rem' }}>
                  <span style={{ color: '#212529', fontSize: '0.875rem' }}>Last Maintenance</span>
                  <input
                    type="date"
                    value={form.lastMaintenance}
                    onChange={(e) => setForm({ ...form, lastMaintenance: e.target.value })}
                    style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #dee2e6' }}
                  />
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button onClick={() => { setShowForm(false); setEditingIndex(-1); }} style={cancelButtonStyle}>
                  Cancel
                </button>
                <button onClick={saveForm} style={saveButtonStyle}>
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
