import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Seo from '../components/Seo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await register({ name, email, password }); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] flex items-center justify-center py-16">
      <Seo title="Create Account" />
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="bg-white border border-[#EBE6DC] p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif text-[#2A2724]">Create account</h1>
            <p className="text-[#6B655D] mt-1.5 text-sm">Join our community</p>
          </div>
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-[#6B655D] mb-1.5">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-4 py-2.5 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73] transition-all" />
            </div>
            <div>
              <label className="block text-sm text-[#6B655D] mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73] transition-all" />
            </div>
            <div>
              <label className="block text-sm text-[#6B655D] mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-4 py-2.5 bg-[#FBFAF7] border border-[#D9D3C7] text-sm focus:outline-none focus:border-[#9C8B73] transition-all" />
            </div>
            <button type="submit"
              className="w-full bg-[#2A2724] text-white py-2.5 text-sm hover:bg-[#6B655D] transition-all">
              Create account
            </button>
          </form>
          <p className="text-center text-sm text-[#6B655D] mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#9C8B73] hover:text-[#8A8278] font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
