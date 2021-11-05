const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    User
} = require("../models/users");
const router = express.Router();


//specify maxAge for Cookie
//const maxAge = 15*60;

//show login page
router.get("/", (req, res) => {

   /*  if(req.query.error){

        res.locals.error = req.query.error
    } */

    res.render("./auth/login")
})

//login user

router.post("/", async (req, res) => {

    const {
        username,
        password
    } = req.body;

    //console.log(username , password)

    //verify the username and password

    try {

        const user = await User.login(username, password);
        const token = jwt.sign({
            _id: user._id,
        }, "SECRET");
        res.cookie('jwt', token, {
            httpOnly: true,
            //maxAge: maxAge * 1000
        });
        res.status(201).json({
            user: user._id
        });

    } catch (err) {

        const error = err.message;
        res.status(400).json({
            error
        });

    }

})


module.exports = router;