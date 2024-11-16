const express = require('express');
const {verifyToken} = require("../middleware/auth");
const User = require('../models/User');
const router = express.Router();

router.get('/', verifyToken,  (req, res) => {
    res.render('profile', { errorMessage: null });
});

router.get('/profile', verifyToken, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;