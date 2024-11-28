const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'task_files',
        allowed_formats: ['jpeg', 'png', 'pdf', 'docx'],
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('File type not allowed'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;
