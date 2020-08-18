var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var book = require("../controllers/book");

// var multer = require("multer");
// var storage = multer.diskStorage({
//     filename: function(req, file, callback) {
//         callback(null, Date.now() + file.originalname);
//       }
// });

// var imageFilter = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };

// var upload = multer({ storage: storage, fileFilter: imageFilter});

router.get("/",book.indexPage);
// router.post("/",middleware.isLoggedin, upload.single('image'), book.createBookPostreq);
router.get("/new",middleware.isLoggedin, book.createBookForm);
router.get("/:id", book.viewBook); 
router.get("/:id/edit", middleware.checkbookownership, book.editBook);
// router.put("/:id", middleware.checkbookownership, upload.single('book[image]'),book.updateBook);
router.delete("/:id", middleware.checkbookownership, book.deleteBook);

module.exports = router;