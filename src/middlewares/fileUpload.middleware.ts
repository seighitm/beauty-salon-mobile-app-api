const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/uploads");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 2024,
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("INVALID_TYPE"));
        }
    },
});

