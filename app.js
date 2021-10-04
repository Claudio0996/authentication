require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash');

const bcrypt = require('bcrypt');
const saltRounds = 10; 


const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/authDB");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }

}); 

const User = new mongoose.model('User', userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.route("/login")
    .get(function(req, res) {
        res.render("login");
    })

    .post(function(req, res){
        User.findOne({email:req.body.username}, function(err, user){
            if(user){
                bcrypt.compare(req.body.password, user.password, function(err, results){
                    if(results){
                        res.render("secrets");
                    }
                });               
            }
        });
    });


app.route("/register")
    .get(function(req, res) {
        res.render("register")
    })

    .post(function(req,res){

        bcrypt.hash(req.body.password, saltRounds, function(err,hash){
            const newUser = new User({
                email: req.body.username,
                password: hash
             });
     
             newUser.save(function(err){
                 if(err){
                     res.send(err.message);
                 }
                 else{
                     res.render("secrets");
                 }
             });
        });
        
    });


app.listen(3000, function(){
    console.log("Server listening on port 3000");
})