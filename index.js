const express = require("express");
const mongoose = require("mongoose");
//const indexRoute = require("./routes/index"); 
const ribRoute = require("./routes/rib/indexRib");
const correspondantRoute = require('./routes/correspondant');
const orderRoute = require('./routes/order');
const registerRoute = require('./routes/register');
const authRoute =  require('./routes/auth');
const logoutRoute = require("./routes/logout");
const indexRoute = require('./routes/index');
const cookieParser = require('cookie-parser');
const {checkUser} = require("./middleware/auth");
/* const capaciteFinRoute = require("./routes/capaciteFin/capaciteFin");
const mouvementRoute = require("./routes/movement/mouvement"); */
const moment = require("moment");
const app = express();


//connect to database
mongoose.connect("mongodb://localhost/VIREMENT", {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() =>  
                  app.listen(3700, () => {
                  console.log('Connected to Database')  
                  console.log(`server is up on port 3700`) 
    }) )
    .catch((err) => console.log(err))

//handel urlencoded and json  
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))



//handel cookies
app.use(cookieParser());


//utilisation ejs
app.set("view engine", "ejs");

//specification du dossier public
app.use("/public",express.static(__dirname + "/public"));


// Global variables
 app.use(function (req, res, next) {
    res.locals.success ="";
    res.locals.error = "";
    res.locals.moment = moment;
    next();
}); 

//use Routes

/* app.use("/api/index", indexRoute); */
/* app.use("/api/capaciteFin",capaciteFinRoute); */
app.use('*',checkUser);
app.use("/api/rib",ribRoute);
app.use('/api/correspondant',correspondantRoute);
app.use('/api/order',orderRoute);
app.use('/api/register',registerRoute);
app.use('/api/auth',authRoute);
app.use("/api/logout",logoutRoute);
app.get('/',indexRoute);

/* app.use("/api/mouvement",mouvementRoute); */

//setting app Port
/* const port = process.env.PORT || 3000; */

//listning on Port 3600
/* app.listen(3600, () => {
   logger("123456","casa","creation rib").info(`server is up on port 3600`)
}) */



/*  app.listen(process.env.PORT) */