require('dotenv').config(); // Загружаем переменные окружения из .env
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const {PORT} = require("./config/variables"); // Импортируем функцию подключения к MongoDB
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const dateRoutes = require('./routes/date');
const adviceRoutes = require('./routes/advice');
const bankRoutes = require('./routes/bank');
const profileRoutes = require('./routes/profile');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/date', dateRoutes);
app.use('/advice', adviceRoutes);
app.use('/population', bankRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
    res.render('dashboard', { errorMessage: null });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});