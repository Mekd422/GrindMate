const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    mantra: {type: String},
    dailyGoalHours: { type: Number, default: 2 }, 
    totalHoursToday: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 },
    lastLoggedDate: { type: Date },
}, {
    timestamps: true});

module.exports = mongoose.model('User', userSchema);