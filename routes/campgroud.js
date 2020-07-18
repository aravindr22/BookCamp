var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Index page
router.get("/", function (req, res) {
    //eval(require('locus'));

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({ name: regex }, function (err, allcampground) {
            if (err) {
                console.log(err);
            } else {              
                if (allcampground.length < 1) {
                    var noMatch = "No Campground Matched that Query, Please Try again..";                    
                }
                res.render("campindex", { campground: allcampground, currentuser: req.user, noMatch: noMatch });
            }
        });
    } else {
        Campground.find({}, function (err, allcampground) {
            if (err) {
                console.log(err);
            } else {
                res.render("campindex", { campground: allcampground, currentuser: req.user });
            }
        });
    }
});

//post function to get the input from the user
router.post("/", middleware.isLoggedin, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcampground = { name: name, image: image, description: description, author: author, price: price };
    Campground.create(newcampground, function (err, newcampground) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Campground Created Successfully");
            res.redirect("/campground");
        }
    });
});

router.get("/new", middleware.isLoggedin, function (req, res) {
    res.render("campnew");
});

router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundcampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundcampground);
            res.render("campshow", { campground: foundcampground });
        }
    });
});

//Edit campground 
router.get("/:id/edit", middleware.checkcampgroundownership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundcampground) {
        res.render("campedit", { campground: foundcampground });
    });
});

//Update Campground
router.put("/:id", middleware.checkcampgroundownership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedata) {
        if (err) {
            console.log(err);
            res.redirect("/campground");
        } else {
            req.flash("success", "Campground Edited Succesfully");
            res.redirect("/campground/" + req.params.id);
        }
    });
});

//Delete Campground
router.delete("/:id", middleware.checkcampgroundownership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            res.redirect("/campground");
        } else {
            req.flash("success", "Campground Deleted Succesfully");
            res.redirect("/campground");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;