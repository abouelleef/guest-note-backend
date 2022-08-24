import multer from 'multer';

const maxSize = 1.7 * 1000 * 1000

const storage = multer.diskStorage({
    destination: "./public/images/temp",
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
    limits: { fileSize: maxSize }
});
