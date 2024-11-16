const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Схема пользователя
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    role: { type: String, default: 'regular', enum: ['admin', 'editor', 'regular'] },
    twoFactorAuthEnabled: { type: Boolean, default: false }, // Флаг 2FA
    twoFactorAuthSecret: { type: String, default: null },    // Секретный ключ 2FA
    createdAt: { type: Date, default: Date.now },
});

// Хэширование пароля перед сохранением
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Сравнение пароля
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Проверка 2FA токена
userSchema.methods.verifyTwoFactorToken = function (token, speakeasy) {
    if (!this.twoFactorAuthSecret) {
        return false; // Если 2FA не настроена, возвращаем false
    }
    return speakeasy.totp.verify({
        secret: this.twoFactorAuthSecret,
        encoding: 'base32',
        token,
    });
};

module.exports = mongoose.model('User', userSchema);