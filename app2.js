//jshint esversion:6

require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(bodyParser.urlencoded({ 
    extended: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
//Start configuration for session
app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false
}));

//Initalize the passport
app.use(passport.initialize());
//Let passport handle the session
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/authDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String
}); 
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema); 

//Create a authentication strategy
passport.use(User.createStrategy());

//create cookie with the informations of the user
passport.serializeUser(User.serializeUser());
//destroy cookie and get the infomation of the user back
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
    res.render("home");
});

app.route("/login")
    .get(function(req, res) {
        res.render("login");
    })

    .post(function(req, res){
        const user = new User({
          username: req.body.username,
          password: req.body.password   
        });

        req.login(user, function(err){
            if(err){
                console.log(err.message);
            }
            else{
                passport.authenticate("local")(req, res, function(){
                    res.redirect("secrets");
                });
            }
        });

    });

    

app.route("/register")
    .get(function(req, res) {
        res.render("register")
    })

    .post(function(req, res) {
        User.register({username: req.body.username}, req.body.password, function(err, user) {
            if(err){
                console.log(err);
                res.redirect("/register")
            }
            else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/secrets");
                });
            }
        });
    });


app.route("/secrets")
    .get(function(req, res) {
        if(req.isAuthenticated()){
            res.render("secrets");
        }
        else{
            res.redirect("login");
        }
    });

app.route("/logout")
    .get(function(req, res) {
        req.logout();
        res.redirect("/");
    })

app.listen(3000, function(){
    console.log("Server listening on port 3000");
});