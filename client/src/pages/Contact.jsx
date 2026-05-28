import { useState, useContext } from 'react';
import { createTicket } from '../api';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const Contact = () => {
  const { addToast } = useContext(ToastContext);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await createTicket(form);
      setForm({ name: '', email: '', subject: '', message: '' });
      addToast('Ticket submitted — we\'ll get back to you soon');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7]">
      <Seo title="Contact Us" description="Get in touch with our support team. We're here to help." />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white border border-[#EBE6DC] p-8">
          <h1 className="text-2xl font-serif text-[#2A2724] mb-2">Contact Us</h1>
          <p className="text-sm text-[#6B655D] mb-8">Have a question or issue? Submit a ticket and we'll respond within 24 hours.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#6B655D] mb-1">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" />
              </div>
              <div>
                <label className="block text-sm text-[#6B655D] mb-1">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#6B655D] mb-1">Subject *</label>
              <input name="subject" value={form.subject} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" />
            </div>
            <div>
              <label className="block text-sm text-[#6B655D] mb-1">Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} required rows="5"
                className="w-full px-4 py-2.5 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73]" />
            </div>
            <button type="submit" disabled={sending}
              className="px-6 py-2.5 bg-[#2A2724] text-white text-sm hover:bg-[#6B655D] transition-all disabled:opacity-50">
              {sending ? 'Sending...' : 'Submit ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
