import { useState, useEffect, useContext } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../api';
import { ToastContext } from '../context/ToastContext';
import Seo from '../components/Seo';

const ManageUsers = () => {
  const { addToast } = useContext(ToastContext);
  const [users, setUsers] = useState([]);

  const load = () => { getAllUsers().then((r) => setUsers(r.data)).catch(() => {}); };
  useEffect(load, []);

  const toggleRole = async (id, currentRole) => {
    const role = currentRole === 'admin' ? 'user' : 'admin';
    try { await updateUserRole(id, { role }); addToast(`Role changed to ${role}`); load(); }
    catch (err) { addToast('Failed to update', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await deleteUser(id); addToast('User deleted'); load(); }
    catch (err) { addToast('Failed to delete', 'error'); }
  };

  return (
    <div>
      <Seo title="Manage Users" />
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Administration</p>
        <h1 className="text-3xl font-serif font-semibold text-gray-900 mt-2">Users</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Role</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900">{u.name}</td>
                  <td className="py-3 px-4 text-gray-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => toggleRole(u._id, u.role)}
                      className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold mr-3">
                      Make {u.role === 'admin' ? 'user' : 'admin'}
                    </button>
                    <button onClick={() => handleDelete(u._id)}
                      className="text-red-500 hover:text-red-600 text-xs font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
