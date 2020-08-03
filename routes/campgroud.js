var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var campground = require("../controllers/campground");

router.get("/",campground.indexPage);
router.post("/", middleware.isLoggedin, campground.createCampgroundPostreq);
router.get("/new", middleware.isLoggedin, campground.createCampgroundForm);
router.get("/:id", campground.viewCampground); 
router.get("/:id/edit", middleware.checkcampgroundownership, campground.editCampground);
router.put("/:id", middleware.checkcampgroundownership, campground.updateCampground);
router.delete("/:id", middleware.checkcampgroundownership, campground.deleteCampground);

module.exports = router;