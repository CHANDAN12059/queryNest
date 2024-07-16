const express = require("express");
const router=express.Router();
const Listing=require("../models/Listing.js");
const User=require("../models/User.js"); 
const wrapAsync=require("../utils/wrapAsync.js"); 
const {isLoggedIn,isOwner}=require("../middlewares.js");




router.get("/home", wrapAsync(async (req, res) => {
    let listings = await Listing.find();
    res.render("listing/index.ejs", { listings });
  
}));

router.get("/newPost", isLoggedIn,(req, res) => {
    res.render("listing/newPostForm.ejs");
});

router.post("/newPost", wrapAsync(async(req, res) => {
    let { username, comments } = req.body;
    let listing = new Listing(req.body);
    listing.owner=req.user._id;
    await listing.save();
    req.flash("success","new post saved")
    res.redirect("/home");
}));

router.get("/edit/:id",isLoggedIn,isOwner,wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/editForm.ejs", { listing });
}));

router.patch("/edit/:id", isLoggedIn,isOwner,wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body);
    res.redirect("/home");
}));

router.delete("/delete/:id",isLoggedIn,isOwner, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/home");
}));


module.exports=router;