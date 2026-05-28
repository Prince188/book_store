import { useState, useEffect } from 'react';
import { getAllTickets, updateTicketStatus } from '../../api';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => { getAllTickets().then((r) => setTickets(r.data)).catch(() => {}); }, []);

  const handleStatus = async (id, status) => {
    try { await updateTicketStatus(id, { status }); setTickets(tickets.map((t) => t._id === id ? { ...t, status } : t)); }
    catch { /* ignore */ }
  };

  const badge = (status) => {
    const s = {
      open: 'bg-gray-100 text-gray-600',
      in_progress: 'bg-blue-50 text-blue-600',
      resolved: 'bg-emerald-50 text-emerald-600',
      closed: 'bg-red-50 text-red-500',
    };
    return `text-xs font-semibold px-3 py-1 rounded-lg ${s[status] || s.open}`;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Support Tickets</h1>

      {tickets.length === 0 ? (
        <p className="text-gray-400 text-sm">No tickets yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t._id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{t.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">from {t.name} &lt;{t.email}&gt; — {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={badge(t.status)}>{t.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  <select value={t.status} onChange={(e) => handleStatus(t._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{t.message}</p>
              {t.replies?.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-gray-50 pt-4">
                  {t.replies.map((r, i) => (
                    <p key={i} className="text-sm text-gray-500"><span className="font-medium text-gray-700">Reply:</span> {r.text}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTickets;
