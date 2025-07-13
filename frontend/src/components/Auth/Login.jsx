import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'

export const Login = () => {

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form, [e.target.name]: e.target.value
    })

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Login 🔐</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input name="email" placeholder="Email" onChange={handleChange} className="input" required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="input" required />

        <button type="submit" className="btn-primary">Login</button>

        <p className="text-center text-sm">
          Don’t have an account? <a href="/register" className="text-blue-600">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
