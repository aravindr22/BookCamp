var express = require("express");
var router = express.Router({mergeParams: true});
const review = require("../controllers/review");
const middleware = require("../middleware/Index");

router.get("/", review.reviewIndex);
router.get("/new", middleware.isLoggedin, middleware.checkReviewExistence, review.reviewNew);
router.post("/", middleware.isLoggedin, middleware.checkReviewExistence, review.reviewCreate);
router.get("/:review_id/edit", middleware.checkReviewOwnership, review.reviewEidt);

module.exports = router;