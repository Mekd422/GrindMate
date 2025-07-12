const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); 

const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear());
};

router.post('/add', authMiddleware, async (req, res) => {
    const { hours } = req.body;

    if (!hours || hours <= 0 || typeof hours !== 'number') {
        return res.status(400).json({ message: 'Invalid hours value' });
    }

    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.dailyGoalHours <= 0) {
            return res.status(400).json({ message: 'Daily goal not set' });
        }

        const today = new Date();

        if (!user.lastLoggedDate || !isSameDay(user.lastLoggedDate, today)) {
            const progressYesterday = user.totalHoursToday / user.dailyGoalHours;
            user.streakCount = progressYesterday >= 0.5 ? user.streakCount + 1 : 0;
            user.totalHoursToday = 0;
        }

        user.totalHoursToday += hours;
        user.lastLoggedDate = today;

        const progressToday = user.totalHoursToday / user.dailyGoalHours;
        await user.save();

        res.status(200).json({
            message: 'Hours logged successfully',
            progress: `${Math.round(progressToday * 100)}%`,
            streak: user.streakCount,
            alert: progressToday >= 0.5
                ? '🌟 You\'re getting closer to your goal!'
                : '🔔 You\'ll be reminded of your goal later today.'
        });
    } catch (error) {
        console.error('Log error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ streakCount: -1 }).select('name streakCount mantra');

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;