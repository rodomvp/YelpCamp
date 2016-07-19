//=========================================================//
//                     REQUIRES                            //
//=========================================================//
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash")
    seedDB          = require("./seeds");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes       = require("./routes/index");

//================================================//
//              MONGOOSE CONFIG                   //
//================================================//


mongoose.connect("mongodb://localhost/yelp_camp_v6")
app.set("view engine", "ejs")

// seedDB();  //Seed the Database

//===============================================//
//              PASSPORT CONFIG                  //
//===============================================//

app.use(require("express-session")({
    secret: "Shiah",
    resave: false,
    saveUninitialized: false
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    next();
})

app.use(methodOverride("_method"));


//================== 
// BODYPARSER SETUP
//==================

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(__dirname + "/public"))

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get('*', function(req, res) {
  res.status(404).send('Error 404: Page not found');
});

app.listen(3000, function() {
    console.log("Yelp Camp Server has Started!");
})