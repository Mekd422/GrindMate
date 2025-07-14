import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './components/Auth/Login'
import { Register } from './components/Auth/Register'
import { Dashboard } from './pages/Dashboard'
import ThemeToggle from './components/ThemeToggle'
import { useEffect, useState } from 'react'

function App() {

  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);  

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <Router>
        <div className="p-4 flex justify-end">
          
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
    
  )
}

export default App
