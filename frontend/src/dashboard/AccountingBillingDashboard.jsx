import React, { useMemo, useState } from 'react';
import {
  Plus, FileText, User, Calendar, DollarSign,
  TrendingUp, TrendingDown, CheckCircle2, Clock, Percent, Download, X
} from 'lucide-react';

const card = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 14,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
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

const today = () => new Date().toISOString().slice(0, 10);

const initialInvoices = [
  { id: 'INV-1001', client: 'ABC Construction', date: '2025-09-05', subtotal: 25000, taxRate: 18, status: 'Due', paid: 0 },
  { id: 'INV-1002', client: 'Metro Build Ltd', date: '2025-09-12', subtotal: 48000, taxRate: 18, status: 'Partial', paid: 30000 },
  { id: 'INV-1003', client: 'Skyline Infra', date: '2025-09-20', subtotal: 12000, taxRate: 0, status: 'Paid', paid: 12000 }
];

const initialExpenses = [
  { id: 'EXP-001', date: '2025-09-10', category: 'Transport', amount: 6500 },
  { id: 'EXP-002', date: '2025-09-15', category: 'Repair', amount: 4200 },
  { id: 'EXP-003', date: '2025-09-22', category: 'Maintenance', amount: 3800 }
];

export default function AccountingBillingDashboard() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [invForm, setInvForm] = useState({ id: '', client: '', date: today(), subtotal: 0, taxRate: 18, paid: 0 });
  const [expForm, setExpForm] = useState({ id: '', date: today(), category: 'Transport', amount: 0 });
  const [showInvModal, setShowInvModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);

  const totals = useMemo(() => {
    const incomeGross = invoices.reduce((s, i) => s + i.subtotal * (1 + (i.taxRate || 0) / 100), 0);
    const incomePaid = invoices.reduce((s, i) => s + (i.paid || 0), 0);
    const expenseTotal = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const net = incomePaid - expenseTotal;
    return { incomeGross, incomePaid, expenseTotal, net };
  }, [invoices, expenses]);

  const addInvoice = async () => {
    if (!invForm.id || !invForm.client) return;
    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invForm),
      });
      if (response.ok) {
        const savedInvoice = await response.json();
        const status = savedInvoice.paid >= savedInvoice.subtotal * (1 + (savedInvoice.taxRate || 0) / 100) ? 'Paid' : (savedInvoice.paid > 0 ? 'Partial' : 'Due');
        setInvoices(prev => [{ ...savedInvoice, status }, ...prev]);
        setInvForm({ id: '', client: '', date: today(), subtotal: 0, taxRate: 18, paid: 0 });
        setShowInvModal(false);
      } else {
        console.error('Failed to save invoice');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addExpense = async () => {
    if (!expForm.id) return;
    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expForm),
      });
      if (response.ok) {
        const savedExpense = await response.json();
        setExpenses(prev => [savedExpense, ...prev]);
        setExpForm({ id: '', date: today(), category: 'Transport', amount: 0 });
        setShowExpModal(false);
      } else {
        console.error('Failed to save expense');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const exportInvoice = (id) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    const total = inv.subtotal * (1 + (inv.taxRate || 0) / 100);
    const text = `INVOICE\nID: ${inv.id}\nClient: ${inv.client}\nDate: ${inv.date}\nSubtotal: ${inv.subtotal}\nTax: ${inv.taxRate}%\nTotal: ${total}\nPaid: ${inv.paid}\nStatus: ${inv.status}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: 24 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: 16 }}>
        <h2 style={{ color: '#1f2937', margin: 0 }}>Accounting / Billing</h2>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingUp size={18} color="#6b7280" />
              <div>
                <div style={{ color: '#6b7280', fontSize: 12 }}>Income (Gross)</div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{totals.incomeGross.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={18} color="#6b7280" />
              <div>
                <div style={{ color: '#6b7280', fontSize: 12 }}>Income (Paid)</div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{totals.incomePaid.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingDown size={18} color="#6b7280" />
              <div>
                <div style={{ color: '#6b7280', fontSize: 12 }}>Expenses</div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{totals.expenseTotal.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <DollarSign size={18} color="#6b7280" />
              <div>
                <div style={{ color: '#6b7280', fontSize: 12 }}>Net</div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{totals.net.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Creation forms */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Plus size={18} color="#6b7280" />
              <strong>Create Invoice</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowInvModal(true)}
                style={{
                  background: '#374151',
                  color: '#fff',
                  border: 0,
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Create Invoice
              </button>
            </div>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Plus size={18} color="#6b7280" />
              <strong>Record Expense</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowExpModal(true)}
                style={{
                  background: '#6b7280',
                  color: '#fff',
                  border: 0,
                  padding: '0.5rem 1rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <FileText size={18} color="#6b7280" />
              <strong>Invoices</strong>
            </div>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Invoice</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Client</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Date</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Subtotal</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>GST%</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Total</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Paid</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: 12, color: '#6b7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(i => {
                  const total = i.subtotal * (1 + (i.taxRate || 0) / 100);
                  return (
                    <tr key={i.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{i.id}</td>
                      <td style={{ padding: '10px 12px' }}>{i.client}</td>
                      <td style={{ padding: '10px 12px' }}>{i.date}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>{i.subtotal.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>{i.taxRate}%</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>{total.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>{(i.paid || 0).toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', color: i.status === 'Paid' ? '#1f2937' : i.status === 'Partial' ? '#92400e' : '#dc2626' }}>{i.status}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <button
                          onClick={() => exportInvoice(i.id)}
                          title="Download"
                          style={{ border: 0, background: 'transparent', cursor: 'pointer' }}
                        >
                          <Download size={18} color="#6b7280" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Clock size={18} color="#6b7280" />
              <strong>Payment Tracking</strong>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
              {['Due', 'Partial', 'Paid'].map(s => (
                <li
                  key={s}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: s === 'Paid' ? '#f3f4f6' : s === 'Partial' ? '#fef3c7' : '#fee2e2',
                    border: '1px solid #e5e7eb',
                    padding: 10,
                    borderRadius: 8
                  }}
                >
                  <span>{s}</span>
                  <b>{invoices.filter(i => i.status === s).length}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Income vs Expense mini chart */}
        <div style={card}>
          <strong style={{ display: 'block', marginBottom: 8 }}>Income vs Expense</strong>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Income (Paid)', value: totals.incomePaid, color: '#374151' },
              { label: 'Expenses', value: totals.expenseTotal, color: '#9ca3af' }
            ].map(row => (
              <div key={row.label}>
                <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>{row.label}</div>
                <div style={{ background: '#e5e7eb', height: 12, borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, (totals.incomePaid + totals.expenseTotal ? (row.value / (totals.incomePaid + totals.expenseTotal)) * 100 : 0))}%`,
                      background: row.color,
                      height: '100%'
                    }}
                  ></div>
                </div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>{row.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>
            GST/Tax shown per invoice (optional via tax rate field).
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showInvModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Create Invoice</h3>
              <button onClick={() => setShowInvModal(false)} style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  placeholder="Invoice ID"
                  value={invForm.id}
                  onChange={(e) => setInvForm({ ...invForm, id: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <input
                  placeholder="Client"
                  value={invForm.client}
                  onChange={(e) => setInvForm({ ...invForm, client: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="date"
                  value={invForm.date}
                  onChange={(e) => setInvForm({ ...invForm, date: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Subtotal"
                  value={invForm.subtotal}
                  onChange={(e) => setInvForm({ ...invForm, subtotal: Number(e.target.value) || 0 })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="number"
                  placeholder="GST %"
                  value={invForm.taxRate}
                  onChange={(e) => setInvForm({ ...invForm, taxRate: Number(e.target.value) || 0 })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Paid"
                  value={invForm.paid}
                  onChange={(e) => setInvForm({ ...invForm, paid: Number(e.target.value) || 0 })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Total (incl tax): <b>{(invForm.subtotal * (1 + (invForm.taxRate || 0) / 100)).toLocaleString()}</b>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setShowInvModal(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={addInvoice} style={{ background: '#374151', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Add Expense</h3>
              <button onClick={() => setShowExpModal(false)} style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  placeholder="Expense ID"
                  value={expForm.id}
                  onChange={(e) => setExpForm({ ...expForm, id: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
                <input
                  type="date"
                  value={expForm.date}
                  onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <select
                  value={expForm.category}
                  onChange={(e) => setExpForm({ ...expForm, category: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                >
                  <option value="Transport">Transport</option>
                  <option value="Repair">Repair</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Office">Office</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={expForm.amount}
                  onChange={(e) => setExpForm({ ...expForm, amount: Number(e.target.value) || 0 })}
                  style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', flex: 1 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
              <button onClick={() => setShowExpModal(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={addExpense} style={{ background: '#6b7280', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
