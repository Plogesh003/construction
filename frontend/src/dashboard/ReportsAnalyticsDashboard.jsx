import React, { useMemo, useState } from 'react';
import { BarChart2, PieChart, TrendingUp, Wrench, FileText, Filter } from 'lucide-react';

const card = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '0.5rem',
  padding: '1rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

export default function ReportsAnalyticsDashboard() {
  const [range, setRange] = useState('Last 30 days');

  const rentalUtil = useMemo(() => [
    { label: 'Week 1', used: 62 },
    { label: 'Week 2', used: 71 },
    { label: 'Week 3', used: 66 },
    { label: 'Week 4', used: 74 }
  ], []);

  const inventory = useMemo(() => [
    { category: 'Cuplock', total: 320, available: 280 },
    { category: 'Tube', total: 500, available: 410 },
    { category: 'Clamp', total: 1200, available: 950 }
  ], []);

  const incomeExpense = useMemo(() => ({
    income: [25, 48, 12, 36],
    expense: [6.5, 4.2, 3.8, 9.1]
  }), []);

  const pendingPayments = useMemo(() => [
    { invoice: 'INV-1005', client: 'Falcon Infra', amount: 18000, due: '2025-10-20' },
    { invoice: 'INV-1007', client: 'Metro Build Ltd', amount: 32000, due: '2025-10-22' }
  ], []);

  const maintenance = useMemo(() => [
    { id: 'SCF-001', date: '2025-09-20', action: 'Inspection', notes: 'All good' },
    { id: 'SCF-087', date: '2025-09-05', action: 'Repair', notes: 'Replaced bolts on 10 units' }
  ], []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '1.5rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: '1rem' }}>
        <h2 style={{ color: '#1f2937', margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          Reports & Analytics
        </h2>

        {/* Range Selector */}
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#6b7280" />
          <span style={{ color: '#6b7280' }}>Range</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              background: '#ffffff'
            }}
          >
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
          {/* Rental Utilization */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <BarChart2 size={16} color="#6b7280" />
              <strong>Rental Utilization</strong>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${rentalUtil.length}, 1fr)`,
              gap: '0.75rem',
              alignItems: 'end',
              height: 140
            }}>
              {rentalUtil.map((week) => (
                <div key={week.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    background: '#374151',
                    width: '100%',
                    height: `${week.used * 1.4}px`,
                    borderRadius: '0.375rem'
                  }}></div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.375rem' }}>
                    {week.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Breakdown */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <PieChart size={16} color="#6b7280" />
              <strong>Scaffold Inventory</strong>
            </div>
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gap: '0.5rem'
            }}>
              {inventory.map((row) => (
                <li key={row.category} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  padding: '0.625rem',
                  borderRadius: '0.375rem'
                }}>
                  <span>{row.category}</span>
                  <span style={{ color: '#6b7280' }}>
                    Available {row.available}/{row.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Income vs Expense */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <TrendingUp size={16} color="#6b7280" />
            <strong>Income & Expense</strong>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '0.75rem'
          }}>
            {incomeExpense.income.map((val, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#6b7280',
                  width: '100%',
                  height: `${val}px`,
                  borderRadius: '0.375rem'
                }}></div>
                <div style={{
                  background: '#9ca3af',
                  width: '100%',
                  height: `${incomeExpense.expense[idx] * 6}px`,
                  borderRadius: '0.375rem',
                  marginTop: '0.375rem'
                }}></div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: '0.375rem'
                }}>
                  Q{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Payments */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <FileText size={16} color="#6b7280" />
            <strong>Pending Payments</strong>
          </div>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0
          }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{
                  textAlign: 'left',
                  padding: '0.625rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>Invoice</th>
                <th style={{
                  textAlign: 'left',
                  padding: '0.625rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>Client</th>
                <th style={{
                  textAlign: 'right',
                  padding: '0.625rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>Amount</th>
                <th style={{
                  textAlign: 'left',
                  padding: '0.625rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>Due</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((payment) => (
                <tr key={payment.invoice} style={{
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <td style={{
                    padding: '0.625rem',
                    fontWeight: 500
                  }}>{payment.invoice}</td>
                  <td style={{ padding: '0.625rem' }}>{payment.client}</td>
                  <td style={{
                    padding: '0.625rem',
                    textAlign: 'right'
                  }}>{payment.amount.toLocaleString()}</td>
                  <td style={{ padding: '0.625rem' }}>{payment.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Maintenance History */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Wrench size={16} color="#6b7280" />
            <strong>Maintenance History</strong>
          </div>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0
          }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{
                  textAlign: 'left',
                  padding: '0.625rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>Item</th>
                <th style={{
                  textAlign: 'left',
                  padding: '0.625rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>Date</th>
                <th style={{
                  textAlign: 'left',
                  padding: '0.625rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>Action</th>
                <th style={{
                  textAlign: 'left',
                  padding: '0.625rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {maintenance.map((record, index) => (
                <tr key={index} style={{
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <td style={{
                    padding: '0.625rem',
                    fontWeight: 500
                  }}>{record.id}</td>
                  <td style={{ padding: '0.625rem' }}>{record.date}</td>
                  <td style={{ padding: '0.625rem' }}>{record.action}</td>
                  <td style={{ padding: '0.625rem' }}>{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
