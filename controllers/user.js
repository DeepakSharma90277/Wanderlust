const User = require("../models/user.js");

module.exports.signup = async (req, res,next) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out !");
        res.redirect("/listings");
    });//it is call-back method
};