const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const { verifyToken, isAdmin, isEditor } = require('../middleware/auth'); // Создадим эти функции ниже
const upload = require('../config/multerConfig');
const {sendSuccessfullyCreatedPortfolioMail, sendSuccessfullyRemovedPortfolioMail, sendSuccessfullyUpdatedPortfolioMail} = require('../services/mailService');

router.get('/', verifyToken, (req, res) => {
    res.render('articles', {errorMessage: false, role: req.user.role});
});

router.get('/create', verifyToken, (req, res) => {
    res.render('portfolio-create', {errorMessage: false});
});

router.get('/edit/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const portfolio = await Portfolio.findById(id);
    if (!portfolio) {
        return res.status(404).render('error', { message: 'Portfolio item not found' });
    }
    res.render('portfolio-edit', {portfolio: {title: portfolio.title, description: portfolio.description.trim()}, errorMessage: false});
});

// Получить все элементы портфолио
router.get('/articles', verifyToken, async (req, res) => {
    try {
        // const items = await Portfolio.find().populate('createdBy', 'username');
        const items = await Portfolio.find().select('title description images createdAt');
        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/articles/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const items = await Portfolio.findById(id).populate('createdBy', 'username');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Получить конкретный элемент портфолио по ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Получаем элемент портфолио по ID
        const portfolioItem = await Portfolio.findById(id).populate('createdBy', 'username');

        if (!portfolioItem) {
            return res.status(404).render('error', { message: 'Portfolio item not found' });
        }

        // Рендерим шаблон с данными статьи
        res.render('article', { portfolio: portfolioItem, role: req.user.role });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Server error' });
    }
});

// Создать элемент портфолио
router.post('/', verifyToken, upload.array('images'), async (req, res) => {
    try {
        // Проверка на количество файлов
        if (req.files.length < 1 || req.files.length > 3) {
            return res.status(400).json({ message: 'You must upload between 1 and 3 images.' });
        }

        const { title, description } = req.body;

        // Собираем пути к изображениям
        const imagePaths = req.files.map(file => file.path);

        // Создаем новый элемент портфолио
        const newItem = new Portfolio({
            title,
            description,
            images: imagePaths,
            createdBy: req.user.id,
        });

        // Сохраняем новый элемент
        await newItem.save();

        // Отправляем ответ
        res.status(201).json(newItem);

        await sendSuccessfullyCreatedPortfolioMail(req.user.email, 'Portfolio created');
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/:id', verifyToken, isAdmin, upload.array('images'), async (req, res) => {
    try {
        const { title, description } = req.body;
        console.log({title, description});

        // Формируем объект обновлений, который будем передавать в findByIdAndUpdate
        let updateData = {};

        // Если в запросе есть title, добавляем его в updateData
        if (title) {
            updateData.title = title;
        }

        // Если в запросе есть description, добавляем его в updateData
        if (description) {
            updateData.description = description;
        }

        // Если в запросе есть файлы (изображения), обновляем поле images
        if (req.files && req.files.length > 0) {
            // Собираем пути к изображениям
            updateData.images = req.files.map(file => file.path);
        }

        // Обновляем элемент портфолио
        const updatedItem = await Portfolio.findByIdAndUpdate(
            req.params.id,
            { ...updateData, updatedAt: Date.now() }, // Обновляем только переданные поля
            { new: true }
        );

        // Проверка, если элемент не был найден
        if (!updatedItem) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }

        res.status(200).json(updatedItem);

        await sendSuccessfullyUpdatedPortfolioMail(req.user.email, 'Portfolio created');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});


const fs = require('fs');

// Удалить элемент портфолио
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const portfolioItem = await Portfolio.findById(req.params.id);
        if (!portfolioItem) return res.status(404).json({ message: 'Portfolio item not found' });

        // portfolioItem.images.forEach(imagePath => {
        //     fs.unlink(imagePath, (err) => {
        //         if (err) console.log(`Error deleting file: ${imagePath}`, err);
        //     });
        // });

        await Portfolio.deleteOne({_id: req.params.id});

        await sendSuccessfullyRemovedPortfolioMail(req.user.email, 'Portfolio created');
        return res.status(200).json({ message: 'Portfolio item deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = router;
