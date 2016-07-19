var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Comment = require("../models/comment")
var Campground = require('../models/campground')
var middleware = require("../middleware")

//================
// COMMENT ROUTES
//================

router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(e, campground) {
        if (e) {
            console.log(e);
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    })

})

router.post("/", isLoggedIn, function(req, res) {

    Campground.findById(req.params.id, function(e, campground) {
        if (e) {
            console.log(e);
            res.redirect("/campgrounds")
        } else {
            Comment.create({
                text: req.body.text
            }, function(e, comment) {
                if (e) {
                    console.log(e);
                    res.redirect("/")
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment")
                    res.redirect("/campgrounds/" + campground._id)
                }
            });
        }
    })
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(e, foundComment) {
        if (e) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(e, updatedComment) {
        if (e) {
            console.log(e);
            res.redirect("/campgrounds");
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
})

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(e) {
        if (e) {
            console.log(e);
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;