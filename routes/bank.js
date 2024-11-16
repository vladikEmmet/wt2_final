const express = require('express');
const fetch = require('node-fetch');
const {WORLD_BANK_API} = require('../config/variables');
const {verifyToken} = require("../middleware/auth");
const router = express.Router();

router.get('/', verifyToken, (req, res) => {
   res.render('population', { errorMessage: null, role: req.user.role });
});

router.get('/indicator', verifyToken, async (req, res) => {
    try {
        const { countryCode = 'WLD', indicator, startYear, endYear } = req.query;

        // Проверка на обязательные параметры
        if (!indicator) {
            return res.status(400).json({ message: 'Indicator is required' });
        }

        const dateRange = startYear && endYear ? `${startYear}:${endYear}` : ''; // Диапазон лет (если есть)

        // Формирование URL для запроса
        let url = `${WORLD_BANK_API}/${countryCode}/indicator/${indicator}?format=json`;
        if (dateRange) {
            url += `&date=${dateRange}`; // Добавляем дату, если указана
        }

        // Запрос данных
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`World Bank API responded with status ${response.status}`);
        }

        const data = await response.json();

        // Проверка на наличие данных
        if (!data[1] || data[1].length === 0) {
            return res.status(404).json({ message: 'No data found for the specified criteria' });
        }

        // Форматируем данные для ответа
        const formattedData = data[1].map(item => ({
            year: item.date,
            value: item.value
        }));

        res.status(200).json({
            country: countryCode === 'WLD' ? 'World' : countryCode,
            indicator,
            data: formattedData
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Failed to fetch data', error: error.message });
    }
});

module.exports = router;
