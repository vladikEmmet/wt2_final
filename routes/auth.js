const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const {verifyToken} = require('../middleware/auth');
const {sendSuccessfullyRegisteredMail} = require('../services/mailService');

router.get('/login', (req, res) => {
    res.render('login', { errorMessage: null });
});

router.get('/register', (req, res) => {
    res.render('register', { errorMessage: null });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/auth/login');
});

router.get('/tfa', verifyToken, (req, res) => {
     res.render('tfa', { errorMessage: null });
});

router.post('/2fa/setup', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Генерация секрета
        const secret = speakeasy.generateSecret({ name: `PortfolioApp (${user.username})` });

        // Сохранение секрета в базе данных
        user.twoFactorAuthSecret = secret.base32;
        await user.save();

        // Генерация QR-кода
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        res.status(200).json({ qrCode, message: '2FA secret created, scan QR-code' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/2fa/verify', verifyToken, async (req, res) => {
    try {
        const { token } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Проверяем токен
        const isVerified = speakeasy.totp.verify({
            secret: user.twoFactorAuthSecret,
            encoding: 'base32',
            token,
        });

        if (!isVerified) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Включаем 2FA
        user.twoFactorAuthEnabled = true;
        await user.save();

        res.status(200).json({ message: '2FA successfully enabled' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Регистрация пользователя
router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, age, gender, email, role } = req.body;

        // Проверяем, существует ли пользователь
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User is already exists' });

        const emailExists = await User.findOne({ email });;
        if (emailExists) return res.status(400).json({ message: 'User is already exists' });

        // Создаем нового пользователя
        const user = new User({ username, password, firstName, lastName, age, gender, email, role: role || 'editor' });
        await user.save();

        await sendSuccessfullyRegisteredMail(user.email, 'Registration success');

        // Отправляем ответ
        res.status(201).json({ message: 'Registration success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Вход пользователя
router.post('/login', async (req, res) => {
    try {
        const { username, password, token } = req.body;
        // console.log({username, password, token});

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Если 2FA включена, проверяем токен
        if (user.twoFactorAuthEnabled) {
            const isVerified = speakeasy.totp.verify({
                secret: user.twoFactorAuthSecret,
                encoding: 'base32',
                token,
            });

            if (!isVerified) {
                return res.status(400).json({ message: 'Invalid 2FA code' });
            }
        }

        // Генерация токена
        const jwtToken = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: 'Login success', token: jwtToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
