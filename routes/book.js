var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var book = require("../controllers/book");

router.get("/",book.indexPage);
router.post("/", middleware.isLoggedin, book.createBookPostreq);
router.get("/new", middleware.isLoggedin, book.createBookForm);
router.get("/:id", book.viewBook); 
router.get("/:id/edit", middleware.checkbookownership, book.editBook);
router.put("/:id", middleware.checkbookownership, book.updateBook);
router.delete("/:id", middleware.checkbookownership, book.deleteBook);

module.exports = router;