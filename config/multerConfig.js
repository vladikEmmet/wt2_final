const multer = require('multer');
const path = require('path');

// Указываем, где и как будут храниться файлы
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Папка для хранения изображений
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Уникальное имя для каждого файла
    },
});

// Настройка multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024, files: 3 },  // Максимальный размер файла 10MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed.'));
    },
});

module.exports = upload;
