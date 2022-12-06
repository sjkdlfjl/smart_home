const util = require("util");
const multer = require("multer");
const maxSize = 20 * 1024 * 1024;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/uploads/");
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, req.body.roomId + file.originalname); //文件名
    },
});
let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("pic");
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;