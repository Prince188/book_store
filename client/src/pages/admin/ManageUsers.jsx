import { useState, useEffect, useContext } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../../api';
import { ToastContext } from '../../context/ToastContext';

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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Users</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left p-4 text-sm font-medium text-gray-500">User</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Phone</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</div>
                  <span className="font-medium text-gray-900 text-sm">{u.name}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">{u.email}</td>
                <td className="p-4 text-sm text-gray-600">{u.phone || '-'}</td>
                <td className="p-4">
                  <select value={u.role} onChange={(e) => handleRole(u._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(u._id)} className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Delete</button>
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
