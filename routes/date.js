const {verifyToken} = require("../middleware/auth");
const express = require("express");
const {NUMBERS_API_URL} = require("../config/variables");
const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateInfo = await fetch(`${NUMBERS_API_URL}/${month}/${day}/date`);
        const json = await dateInfo.text();
        return res.status(200).json({ date: json });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;