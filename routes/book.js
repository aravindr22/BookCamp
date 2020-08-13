var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var book = require("../controllers/book");
var createTimeHelper = require("../helpers/createTime")
var Book = require("../models/book")
var path = require("path")

var multer = require("multer");
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
      }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require("cloudinary");
cloudinary.config({ 
    cloud_name: 'dbbinc37j', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

router.get("/",book.indexPage);
router.post("/", upload.single('image') ,async function(req, res){
    console.log("----------------");
    await cloudinary.uploader.upload(req.file.path, function(result){
        console.log(result);
        req.body.image = result.secure_url;
    })
    console.log("------------------------------");
    console.log(req.body)
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var date = createTimeHelper.createTime();
    var newbook = { 
        name: name, 
        image: image, 
        description: description, 
        author: author, 
        price: price,
        createdAt: date
    };
    Book.create(newbook, function (err, newbook) {
        if (err) {
            console.log(err);
        } else {
            console.log(">--------------------------------------------------------New book Created");
            console.log(newbook);
            req.flash("success", "Book Created Successfully");
            res.redirect("/books/" + newbook._id);
        }
    });
});
router.get("/new", book.createBookForm);
router.get("/:id", book.viewBook); 
router.get("/:id/edit", middleware.checkbookownership, book.editBook);
router.put("/:id", middleware.checkbookownership, book.updateBook);
router.delete("/:id", middleware.checkbookownership, book.deleteBook);

module.exports = router;