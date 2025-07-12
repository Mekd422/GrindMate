const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth'); 


const isSameDay = (date1, date2) => {
    return (date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear());
};

// add
router.post('/add', authMiddleware, async (req, res) => {
    const { hours } = req.body;

    if (!hours || hours <= 0){
        return res.status(400).json({ message: 'Invalid hours' });
    }

    try {
        const user = await User.findById(req.user);
        const today = new Date();

        if(!isSameDay(user.lastLoggedDate, today)) {
            const progressYesterday = user.totalHoursToday / user.dailyGoalHours;

        if (progressYesterday >= 0.5) {
            user.streakCount += 1;
        } else {
            user.streakCount = 0; 
        }

        user.totalHoursToday = 0;
        }

         user.totalHoursToday += hours;
        user.lastLoggedDate = today;

        const progressToday = user.totalHoursToday / user.dailyGoalHours;

        await user.save();

        res.status(200).json({
        message: 'Hours logged successfully',
        progress: (progressToday * 100).toFixed(0) + '%',
        streak: user.streakCount,
        alert: progressToday >= 0.5
            ? '🌟 You’re getting closer to your goal!'
            : '🔔 You’ll be reminded of your goal later today.',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
