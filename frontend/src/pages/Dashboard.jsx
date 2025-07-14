import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import API from '../utils/api'
import { LogForm } from '../components/Dashboard/LogForm'
import { Leaderboard } from '../components/Dashboard/Leaderboard'


export const Dashboard = () => {

  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await API.get('/user/me');
      setUser(res.data);
      setStreak(res.data.streakCount);
    } catch (error) {
      const status = error.response?.status;

    
    if (status === 401 || status === 403) {
      navigate('/login');
    } else {
      console.error('❌ Failed to fetch user:', error.message);
    }
    }
  };

  const handleLog = async  (hours) =>{
    try {
      const res = await API.post('/log/add', { hours });
      setProgress(res.data.progress);
      setAlertMsg(res.data.alertMsg);
      setStreak(res.data.streak);
    } catch (error) {
      setAlertMsg(error.message || 'An error occurred while logging your progress.');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center">Welcome back, {user.name} 🙌</h2>

      <div className="bg-white rounded-lg p-4 shadow text-center">
        <p className="text-lg font-medium">🧠 Your Daily Mantra: <em>"{user.mantra}"</em></p>
        <p className="mt-2">🔥 Current Streak: <strong>{streak}</strong> days</p>
        {progress && <p className="mt-2 text-green-600 font-semibold">Progress: {progress}</p>}
        {alertMsg && <p className="mt-2 text-blue-500">{alertMsg}</p>}
      </div>

      <LogForm onLog={handleLog} />
      <Leaderboard />
    </div>
  )
}
