// Requires
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    whois           = require('whois-json'),
    methodOverride  = require('method-override'),
    User            = require('./models/user'),
    Domain          = require('./models/domain');

// Require routes
var dashboardRoutes = require('./routes/dashboard'),
    indexRoutes     = require('./routes/index');

// Config
mongoose.connect('mongodb://localhost/whois_v2', {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");


// Passport Config
app.use(require("express-session")({
    secret: "This is a test secret, quick brown fox",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/dashboard", dashboardRoutes)

app.listen(3000, function() {
    console.log("Whois Server started successfully!");
});