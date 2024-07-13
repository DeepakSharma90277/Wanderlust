const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema ,reviewsSchema} = require('./schema');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a listing !");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // listingSchema validation
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview =(req,res,next)=>{
    let {error} = reviewsSchema.validate(req.body); // reviewSchema validation
    if (error) { 
        // If there's an error, send a 400 response with the error message
        // return res.status(400).send(error.details[0].message);
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }

module.exports.isReviewAuthor = async (req, res,next) => {
    let { id , reviewId } = req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review ");
        return res.redirect(`/listings/${id}`);
    }
    next();
}