const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const User = require('../models/user');


// Error handler
const errorhandler = (res, error) => {
    res.status(error.status || 500).json({ error: "Something went wrong! Please try after some time." });
};

//  Api to Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ error: 'Name, email, password and mobile are required fields.' });
        }

        // Check for duplicate email
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobile
        });
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_Token, { expiresIn: '2h' })
        await newUser.save();
        res.status(200).json({
            token,
            recruiterName: newUser.name,
            message: "user register successfully"
        });
    } catch (error) {
        errorhandler(res, error);
    }
});


// Api to login authorized User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }
        //find user by email
        const user = await User.findOne({ email });
        if (user) {
            let hasPasswordMatched = await bcrypt.compare(password, user.password);
            if (hasPasswordMatched) {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_Token, { expiresIn: '2h' })
                res.status(200).json({
                    token,
                    recruiterName: user.name,
                    message: "You have logged In successfully"
                })
            } else {
                res.status(500).json({
                    message: "Incorrect credentials"
                })
            }
        } else {
            res.status(400).json({
                message: "User does not exist"
            })
        }
    } catch (error) {
        console.log(error);
        errorhandler(res, error);
    }
});


module.exports = router;
