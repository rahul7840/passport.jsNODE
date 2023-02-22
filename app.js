const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport')
const session = require('express-session');
const passsportLocalMongoose = require('passport-local-mongoose')
const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({ extended: true }));

//------->
app.use(session({
    secret: "this is rahul",
    resave: false,
    saveUninitialized: true
}))

//------->
app.use(passport.initialize());
app.use(passport.session());


mongoose.set("strictQuery", false)
mongoose.connect("mongodb://localhost:27017/prickDB", { useNewUrlParser: true })
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
//------->
userSchema.plugin(passsportLocalMongoose);

const User = new mongoose.model("User", userSchema);

//------->
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
    res.render("home.ejs")
})
app.get("/register", function (req, res) {
    res.render("register.ejs")
})
app.get("/login", function (req, res) {
    res.render("login.ejs")
})
app.get("/secrets", function (req, res) {
    res.render("secrets.ejs")
})

//-------
        app.post("/register", function (req, res) {

            User.register({ username: req.body.username }, req.body.password, function (err, user) {

                if (err) {
                    console.log(err)
                    res.redirect("register.ejs");
                } else {
                    passport.authenticate("local")(req, res, function () {
                        res.redirect("secrets");
                    })
                }
            });
        });


        app.post("/login", function (req, res) {
            const user = new User({
                username: req.body.username,
                password: req.body.password
            })
            req.login(user, function(err){
                if (err){
                    console.log(err);
                    res.redirect("/login");
                } else {
                    passport.authenticate("local")(req, res, function(){
                        res.redirect("/secrets");
                    });
                }
            }); 

})



app.listen(4000, function () {
    console.log("you are in 4000 world");
})


