const express = require("express");
const {
    User
} = require("../models/users");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

//specify maxAge for Cookie
const maxAge =  15*60;

/* //handel sign up errors
const handelError = function(err){

    const errors = {username :"",password:""};

    // duplicate email error
  if (err.code === 11000) {
    errors.username = 'that username is already registered';
    return errors;
  }

    if(err.message.includes("User validation failed")) {

        Object.values(err.errors).forEach(error => {

            errors[error.path] = error.properties.message
        })
    }

    return errors
  
} */



//show form to register user
router.get("/", (req, res) => {

    res.render("./auth/register")
})

//register a user
router.post("/", async (req, res) => {

    const {
        username,
        password,
        email

    } = req.body;

    //verify if the user already exists
     let user = await User.findOne({
        username
    })
    if (user) return res.status(400).send("user aleready exist"); 

    //create user
    user = new User({
    username,
    password,
    email,

    })

    //crypt password
    try {
        //genrate and send a json web tokken for autorisation porpuses
        const result = await user.save();

        const token = jwt.sign({
            _id: result._id
        }, "SECRET");

        //save user
        
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        //send a json web tokken for autorisation porpuses in the header
        res.status(201).json({
            user: result._id
        });

    } catch (err) {
        console.log(err)
        const errors = handelError(err);
        res.status(400).json({errors});
    }

});


module.exports = router;