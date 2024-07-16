if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');

const listing=require("./routes/listing.js");
const user=require("./routes/user.js");

const session = require("express-session");
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");




// Middleware and configurations
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));




async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/queryNest');
}
main().then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.error("Database connection error:", err);
});



app.use(session({
    secret: process.env.SECRET_CODE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true
    }
}));



app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})



// Routes


app.use("/",listing);
app.use("/",user);







app.use((err,req,res,next)=>{
    let{status=500,message="ERROR"}=err;
    res.status(status).render("error/error.ejs",{message});
})

app.listen(8080, () => {
    console.log("Listening to port 8080");
 
});
