import { useState, useEffect } from 'react';
import { getAllTickets, updateTicketStatus } from '../../api';
import Seo from '../../components/Seo';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => { getAllTickets().then((r) => setTickets(r.data)).catch(() => {}); }, []);

  const handleStatus = async (id, status) => {
    try { await updateTicketStatus(id, { status }); setTickets(tickets.map((t) => t._id === id ? { ...t, status } : t)); }
    catch { /* ignore */ }
  };

  const badge = (status) => {
    const s = {
      open: 'bg-[#EBE6DC]/50 text-[#6B655D]',
      in_progress: 'bg-blue-50 text-blue-600',
      resolved: 'bg-emerald-50 text-emerald-600',
      closed: 'bg-red-50 text-red-500',
    };
    return `text-xs font-semibold px-3 py-1 ${s[status] || s.open}`;
  };

  return (
    <div className="p-8">
      <Seo title="Admin — Tickets" />
      <h1 className="text-2xl font-serif text-[#2A2724] mb-8">Support Tickets</h1>

      {tickets.length === 0 ? (
        <p className="text-[#A8A096] text-sm">No tickets yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <div key={t._id} className="bg-white border border-[#EBE6DC] p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-[#2A2724]">{t.subject}</p>
                  <p className="text-xs text-[#A8A096] mt-1">from {t.name} &lt;{t.email}&gt; — {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={badge(t.status)}>{t.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                  <select value={t.status} onChange={(e) => handleStatus(t._id, e.target.value)}
                    className="text-xs border border-[#D9D3C7] px-2 py-1.5 focus:outline-none focus:border-[#9C8B73]">
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-[#6B655D] bg-[#FBFAF7] p-4">{t.message}</p>
              {t.replies?.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-[#EBE6DC] pt-4">
                  {t.replies.map((r, i) => (
                    <p key={i} className="text-sm text-[#6B655D]"><span className="text-[#2A2724]">Reply:</span> {r.text}</p>
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
