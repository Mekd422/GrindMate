import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'

export const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        mantra: '',
        dailyGoalHours: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,[e.target.name]: e.target.value
        });     
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await API.post('/auth/register', form);
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        }};
        
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Register 🚀</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input name="name" placeholder="Name" onChange={handleChange} className="input" required />
        <input name="email" placeholder="Email" onChange={handleChange} className="input" required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="input" required />
        <input name="mantra" placeholder="Your Mantra 💬" onChange={handleChange} className="input" />
        <input name="dailyGoalHours" placeholder="Daily Goal (hrs)" type="number" onChange={handleChange} className="input" />

        <button type="submit" className="btn-primary">Create Account</button>

        <p className="text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </form>
    </div>
  )
}

export default Register;
