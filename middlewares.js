const Listing=require("./models/Listing");




module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","Please login to your account");
       return res.redirect("/login");
    }
    next();
}


module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);

if(!req.user._id.equals(listing.owner._id)){
    req.flash("error","You don't have permission to make changes ");
    return res.redirect("/home");

}
next();

}