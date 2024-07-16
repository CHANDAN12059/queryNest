const mongoose=require("mongoose");

let ListingSchema=mongoose.Schema({
username:{
    type:String,
    required:true
},
comments:{
    type:String,
    required:true
},
owner:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
}

})

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;