const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews :[
    {
      type:Schema.Types.ObjectId,
      ref : "Review"
    }
  ],
  owner:{
    type :Schema.Types.ObjectId,
    ref:"User",
  },
  // category:{
  //   type : String,
  //   enum :["Trending","Mountains","Rooms","Iconic Cities","Castles","Arctic","Farms","Amazing pools","Camping",]
  // }
});

// it's for those when we want to delete listing together all the review is also delete;
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : { $in :listing.reviews}});
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;