const express = require("express");
const { Correspondant } = require("../models/correspondant");
const {validateTokken} = require("../middleware/auth")

/* const {validateTokken,checkUser,regnerateNewToken,validateTokkenForIndex} = require("../middleware/auth");
const {Mouvement} = require("../models/mouvement");
 */
const router = express.Router();



//index page

/* router.get("/",validateTokkenForIndex,checkUser,regnerateNewToken ,async (req,res)=> {

    if(req.query.success) {
        res.locals.success = req.query.success;
    }
    console.log(req.originalUrl)
    req.originalUrl = "/api/index/"


    let mouvement = await Mouvement.find({etape : "1"});
    etapeMouvement = mouvement.length;
    console.log(etapeMouvement);
    res.set('Location','/api/index/').render("../views/index",{etapeMouvement})

}) */


router.get('/',validateTokken,async (req,res)=> {

    const correspondants = await Correspondant.find().sort({rs: "asc"}).select({rs: 1,rib: 1})
   // console.log(correspondants)

    res.render('index',{correspondants});


})



module.exports = router