const jwt = require("jsonwebtoken");
const url = require('url');
const {
    User
} = require("../models/users");

//define maxage
let maxAge = 15*60;

function validateTokken(req, res, next) {

    const token = req.cookies.jwt;


    if (!token) return res.status(401).redirect('/api/auth')

    try {
        const result = jwt.verify(token, "SECRET")
        req.user = result;
        //console.log(req.user)
        next();
    } catch (err) {

        return res.status(401).redirect('/api/auth')
    }

}

function validateTokkenForIndex(req, res, next) {

    const token = req.cookies.jwt;


    if (!token) return res.status(401).redirect(url.format({
        pathname:"/api/auth",
        query: {
           "error":"l'opération n a pas aboutie, Utilisateur Déconnecté"
         }
      }));

    try {
        const result = jwt.verify(token, "SECRET")
        req.user = result;
        console.log(req.user)
        next();
    } catch (err) {

        return res.status(401).redirect(url.format({
            pathname:"/api/auth",
            query: {
               "error":"l'opération n a pas aboutie, Utilisateur Déconnecté"
             }
          }));
    }

}

function regnerateNewToken(req,res,next){

    const token = jwt.sign({
        _id: req.user._id
    }, "SECRET",/* { expiresIn: 15 * 60 } */);

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: maxAge * 1000
    });
    next();

}

async function checkUser(req, res, next) {


    const token = req.cookies.jwt;

    if (token) {
        const result = jwt.verify(token, "SECRET")
        if (result) {

            let user = await User.findById(result._id);
            res.locals.user = user
            next();

        } else {
            res.locals.user = null;
            next();
        }

        ;
    } else {
        res.locals.user = null
        next();
    }


}




module.exports = {
    checkUser,
    validateTokken,
    regnerateNewToken,
    validateTokkenForIndex

}