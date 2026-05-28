import { useState, useEffect, useContext } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../../api';
import { ToastContext } from '../../context/ToastContext';
import Seo from '../../components/Seo';

const ManageUsers = () => {
  const { addToast } = useContext(ToastContext);
  const [users, setUsers] = useState([]);

  useEffect(() => { getAllUsers().then((r) => setUsers(r.data)).catch(() => {}); }, []);

  const handleRole = async (id, role) => {
    try { await updateUserRole(id, { role }); setUsers(users.map((u) => u._id === id ? { ...u, role } : u)); addToast('Role updated'); }
    catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await deleteUser(id); setUsers(users.filter((u) => u._id !== id)); addToast('User deleted'); }
    catch (err) { addToast(err.response?.data?.message || 'Failed', 'error'); }
  };

  return (
    <div className="p-8">
      <Seo title="Admin — Users" />
      <h1 className="text-2xl font-serif text-[#2A2724] mb-8">Users</h1>

      <div className="bg-white border border-[#EBE6DC] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EBE6DC] bg-[#FBFAF7]">
              <th className="text-left p-4 text-sm text-[#6B655D]">User</th>
              <th className="text-left p-4 text-sm text-[#6B655D]">Email</th>
              <th className="text-left p-4 text-sm text-[#6B655D]">Phone</th>
              <th className="text-left p-4 text-sm text-[#6B655D]">Role</th>
              <th className="text-right p-4 text-sm text-[#6B655D]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-[#EBE6DC] hover:bg-[#FBFAF7] transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#9C8B73] to-[#C9B79C] rounded-full flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</div>
                  <span className="text-[#2A2724] text-sm">{u.name}</span>
                </td>
                <td className="p-4 text-sm text-[#6B655D]">{u.email}</td>
                <td className="p-4 text-sm text-[#6B655D]">{u.phone || '-'}</td>
                <td className="p-4">
                  <select value={u.role} onChange={(e) => handleRole(u._id, e.target.value)}
                    className="text-xs border border-[#D9D3C7] px-2 py-1.5 focus:outline-none focus:border-[#9C8B73]">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(u._id)} className="text-sm text-red-500 hover:text-red-600 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
