const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.newRoute = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.search = async (req, res) => {
    const country=req.body;
    console.log(country);
    const allListings = await Listing.find({country:country});
    res.render("listings/index.ejs", { allListings });
};

module.exports.showRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews", populate : {path : "author"}}
    )
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!"); //flash message
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createRoute = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success","New Listing Created !"); //flash message
    res.redirect('/listings');
};

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!"); //flash message
        res.redirect("/listings");
    }
    let originalImageUrl =listing.image.url;
    originalImageUrl =  originalImageUrl.replace("/upload","/upload/w_200")
    res.render("listings/edit.ejs", { listing , originalImageUrl });
};

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefiined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyRoute = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
}
