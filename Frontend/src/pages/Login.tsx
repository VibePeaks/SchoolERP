import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher' | 'principal'>('admin');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role);
    navigate('/dashboard');
  };

  // 🧠 Auto-fill & login
  const handleQuickLogin = (role: 'admin' | 'teacher' | 'principal') => {
    const dummyEmail = `${role}@school.com`;
    const dummyPassword = 'password';

    setEmail(dummyEmail);
    setPassword(dummyPassword);
    setRole(role);

    // wait for state update, then login
    setTimeout(() => {
      login(dummyEmail, dummyPassword, role);
      
      navigate('/dashboard');
    }, 100);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('https://www.leadsquared.com/wp-content/uploads/2024/07/school-management-system.png')`,
      }}
    >
      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700">School ERP</h1>
          <p className="text-sm text-gray-600">Login to your account</p>
        </div>

        {/* Quick Login Buttons */}
        <div className="flex justify-between gap-2 mb-4">
          <button
            className="flex-1 bg-blue-100 text-blue-700 py-1 rounded hover:bg-blue-200 transition text-sm"
            onClick={() => handleQuickLogin('admin')}
          >
            Login as Admin
          </button>
          <button
            className="flex-1 bg-green-100 text-green-700 py-1 rounded hover:bg-green-200 transition text-sm"
            onClick={() => handleQuickLogin('teacher')}
          >
            Login as Teacher
          </button>
          <button
            className="flex-1 bg-yellow-100 text-yellow-700 py-1 rounded hover:bg-yellow-200 transition text-sm"
            onClick={() => handleQuickLogin('principal')}
          >
            Login as Principal
          </button>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'teacher' | 'principal')}
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="principal">Principal</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
