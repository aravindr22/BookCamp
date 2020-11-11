var express = require("express");
var router = express.Router({ mergeParams: true });
var middleware = require("../middleware/Index");
const comment = require("../controllers/comment");

router.get("/new", middleware.isLoggedin, comment.newCommentForm);
router.post("/", middleware.isLoggedin, comment.addComment);
router.get("/:comment_id/edit", middleware.checkcommentownership, comment.editComment);
router.put("/:comment_id", middleware.checkcommentownership, comment.updateComment);
router.delete("/:comment_id", middleware.checkcommentownership, comment.deleteComment);

module.exports = router;
