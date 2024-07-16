const express = require("express");
const router=express.Router();
const Listing=require("../models/Listing.js");
const User=require("../models/User.js"); 
const wrapAsync=require("../utils/wrapAsync.js"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");







router.get("/signup", (req, res) => {
    res.render("authentication/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => {
    try{
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser=await User.register(newUser, password);
router.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }

    req.flash("success","WELCOME TO QueryNest");
    res.redirect("/home");
})

}
catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
}


}));

router.get("/login", (req, res) => {
    res.render("authentication/login.ejs");
});

router.post("/login", passport.authenticate("local",{failureRedirect: "/login",failureFlash:true}), wrapAsync(async(req, res) => {

    req.flash("success","WELCOME TO QueryNest");
    res.redirect("/home");
}));



router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
        return next(err);}
        req.flash("success","Logout successfully");
        res.redirect("/home");
    })
  
});


module.exports=router;