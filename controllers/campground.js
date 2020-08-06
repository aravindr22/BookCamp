const Campground = require("../models/campground");

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//Index Page
exports.indexPage = function(req, res){
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
        }).sort({ "popularity": -1 });  //Sort by popularity in descending order
    }
}

//Post req submission for new Campground
exports.createCampgroundPostreq = function(req, res){
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
}

//Form for new campground
exports.createCampgroundForm = function(req, res){
    res.render("campnew");
}

//View Campground
exports.viewCampground = function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundcampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundcampground);
            res.render("campshow", { campground: foundcampground });
        }
    });
}

//Edit campground
exports.editCampground = function(req, res){
    Campground.findById(req.params.id, function (err, foundcampground) {
        res.render("campedit", { campground: foundcampground });
    });
}

//Update Campground
exports.updateCampground = function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedata) {
        if (err) {
            console.log(err);
            res.redirect("/campground");
        } else {
            req.flash("success", "Campground Edited Succesfully");
            res.redirect("/campground/" + req.params.id);
        }
    });
}

//Delete Campground
exports.deleteCampground = function(req, res){
    Campground.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            res.redirect("/campground");
        } else {
            req.flash("success", "Campground Deleted Succesfully");
            res.redirect("/campground");
        }
    });
}