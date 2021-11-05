const {Router} = require("express");
const url = require('url');
const router = Router();

//logout user
router.get("/",(req,res)=> {


        res.cookie('jwt', "", {
            maxAge: 1
        });
   
        
        res.redirect(url.format({
            pathname:"/api/auth",
            query: {
               "error":"Utilisateur Déconnecté"
             }
          }));

})



module.exports = router;