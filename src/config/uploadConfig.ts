import multer from 'multer';



const storage = multer.diskStorage({
    destination: "./public/images/temp",
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage
});
