const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash');


const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/authDB");



app.get("/", function(req, res) {
    res.render("home");
});

app.route("/login")
    .get(function(req, res) {
        res.render("login");
    })

    .post();


app.route("/register")
    .get(function(req, res) {
        res.render("register")
    })


app.listen(3000, function(){
    console.log("Server listening on port 3000");
})