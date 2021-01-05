var multer  = require('multer');
const fs = require('fs');
require('dotenv').config();
const maxSize  = process.env.max_size;
const basePath = process.env.base_path;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = `./${basePath}/${file.fieldname}/`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, {recursive: true}, err => {});
        }
        cb(null, path);
    },
    filename: function (req, file, cb) {
        var fileExt = file.mimetype === "image/jpeg"? ".jpg" : ".png";
        cb(null, req.body.id + fileExt)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid File Type'), false);
    }
}
  
const upload = multer({ storage: multer.diskStorage({
    destination: function (req, file, cb) {
        let path = `./${basePath}/${req.body.file_category}/`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, {recursive: true}, err => {});
        }
        cb(null, path);
    },
    filename: function (req, file, cb) {
        var fileExt = file.mimetype === "image/jpeg"? ".jpg" : ".png";
        cb(null, req.body.id + fileExt)
    }
}), fileFilter : fileFilter, limits: { fileSize: Number(maxSize) } })

module.exports = upload;