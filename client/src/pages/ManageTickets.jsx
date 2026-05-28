import { useState, useEffect, useContext } from 'react';
import { getAllTickets, replyTicket, updateTicketStatus } from '../api';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const ManageTickets = () => {
  const { addToast } = useContext(ToastContext);
  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [expanded, setExpanded] = useState(null);

  const load = () => { getAllTickets().then((r) => setTickets(r.data)).catch(() => {}); };
  useEffect(load, []);

  const handleReply = async (id) => {
    if (!replyText[id]?.trim()) return;
    try {
      await replyTicket(id, { message: replyText[id] });
      addToast('Reply sent');
      setReplyText((p) => ({ ...p, [id]: '' }));
      load();
    } catch (err) {
      addToast('Failed to reply', 'error');
    }
  };

  const handleStatus = async (id, status) => {
    try { await updateTicketStatus(id, { status }); addToast('Status updated'); load(); }
    catch (err) { addToast('Failed to update', 'error'); }
  };

  return (
    <div>
      <Seo title="Manage Tickets" />
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Support</p>
        <h1 className="text-3xl font-serif font-semibold text-gray-900 mt-2">Tickets</h1>
      </div>

      <div className="space-y-4">
        {tickets.map((t) => (
          <div key={t._id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <button onClick={() => setExpanded(expanded === t._id ? null : t._id)}
              className="w-full flex flex-wrap items-center justify-between gap-3 p-5 text-left">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{t.subject}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.name || t.email} &middot; {new Date(t.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <span className={`px-2.5 py-0.5 text-xs font-medium border rounded-full ${
                t.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' :
                t.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-gray-50 text-gray-600 border-gray-200'
              }`}>
                {t.status}
              </span>
            </button>

            {expanded === t._id && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap mb-4">
                  {t.message}
                </div>

                {t.replies?.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {t.replies.map((r, idx) => (
                      <div key={idx} className="p-3 bg-indigo-50 rounded-lg text-sm text-gray-700">
                        <p className="text-xs text-indigo-500 font-medium mb-1">Admin reply</p>
                        {r.message}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input type="text" value={replyText[t._id] || ''} onChange={(e) => setReplyText({ ...replyText, [t._id]: e.target.value })}
                    placeholder="Type your reply..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={() => handleReply(t._id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-semibold hover:bg-indigo-700 transition-all">Send</button>
                  <select value={t.status} onChange={(e) => handleStatus(t._id, e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="open">Open</option>
                    <option value="in-progress">In progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="text-center py-16 text-gray-400">No tickets</div>
        )}
      </div>
    </div>
  );
};

export default ManageTickets;
