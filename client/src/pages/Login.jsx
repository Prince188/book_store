import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Seo from '../components/Seo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await login({ email, password }); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <Seo title="Sign In" />
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-semibold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1.5 text-sm">Sign in to your account</p>
          </div>
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
            </div>
            <button type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all">
              Sign in
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
