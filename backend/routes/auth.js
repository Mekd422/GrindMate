const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {

    const {name, email, password, mantra, dailyGoalHours} = req.body;

    try {
        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const  hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mantra,
            dailyGoalHours
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }

});


