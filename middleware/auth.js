const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (!token) return res.redirect('/auth/login');
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not permitted to do this' });
    }
    next();
};

const isEditor = (req, res, next) => {
    if(req.user.role !== 'editor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not permitted to do this' });
    }
}

module.exports = { verifyToken, isAdmin, isEditor };
