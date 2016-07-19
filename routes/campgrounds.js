var express = require("express");
var router = express.Router();
var Campground = require('../models/campground')
var middleware = require("../middleware")


//===================
// CAMPGROUND ROUTES
//===================

router.get("/", function(req, res) {
    console.log(req.user);
    // Get all campgrounds from DB
    Campground.find({}, function(e, campgrounds) {
        if (e) {
            console.log(e);
        } else {
            res.render("campgrounds/campgrounds", {
                campgrounds: campgrounds
            })
        }
    })
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: desc
    }
    Campground.create(newCampground, function(e, campground) {
        if (e) {
            console.log(e);
        } else {
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
            console.log("Newly created campground:");
            console.log(campground);
            req.flash("success", "Successfully added campground")
            res.redirect("/campgrounds");
        }
    })
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")
})

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(e, campground) {
        if (e) {
            console.log(e)
        } else {
            console.log(campground)
            res.render("campgrounds/show", {
                campground: campground
            })
        }
    });
})

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {

    Campground.findById(req.params.id, function(e, foundCampground) {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    })
})

router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(e, updatedCampground) {
        if (e) {
            console.log(e);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully edited campground")
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(e) {
        if (e) {
            console.log(e);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    })
})


module.exports = router