const {verifyToken} = require("../middleware/auth");
const {ADVICE_API_URL} = require("../config/variables");
const express = require("express");
const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    res.render('advice', { errorMessage: null });
});

router.get('/advice', verifyToken, async (req, res) => {
    try {
        const adviceResponse = await fetch(ADVICE_API_URL);
        const advice = await adviceResponse.json();
        return res.status(200).json({
            advice: advice.slip.advice,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;