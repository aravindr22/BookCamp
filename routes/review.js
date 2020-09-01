const express = require("express");
const router = express().Router({ mergeParams: true });
const review = require("../controllers/review");
const middleware = require("../middleware/Index");

router.get("/", review.reviewIndex);

module.exports = router;