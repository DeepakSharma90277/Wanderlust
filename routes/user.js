const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");


router.get("/signup", (req, res) => {
    res.render("users/signup"); // Ensure this path is correct
});

router.post("/signup", userController.signup);

router.get("/login",(req,res)=>{
    res.render("users/login");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate('local', 
    { failureRedirect: '/login',
      failureflash : true 
    }),userController.login);

router.get("/logout",userController.logout);
module.exports = router;
