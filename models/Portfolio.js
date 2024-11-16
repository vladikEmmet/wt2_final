const mongoose = require('mongoose');

// Схема для элементов портфолио
// const portfolioSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     images: { type: [String], required: true }, // Список URL или путей изображений
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Связь с пользователем
// });
const portfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);