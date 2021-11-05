const mongoose = require("mongoose");

const capaciteFinSchema = new mongoose.Schema({

    ncp : {

        type : String,
        required : true,
        trim : true,
        maxlength : 30

    },
    age : {
        type : String,
        required : true,
        trim : true
    },
    clc : {                     //code client

        type : String,
        required : true,
        trim : true
    },

    nom: {
        type : String,
        trim : true,
    },
    pre: {
        type : String,
        trim : true,
    },
    inti : {                //type compte

        type: String,
        trim : true,
    },
    username : {                //utilisateur qui a effectué la demande
        type : String,
        trim : true,
    },

    montant : {
        type : Number,
        required : true
        //trim : true,
    },
    ville : {
        type : String,
        trim : true,
    },
    date : {                    //date realisation attestation

        type : Date,
        default : Date.now
    }


})

const capaciteFin = mongoose.model("capaciteFin",capaciteFinSchema);

module.exports = {

    capaciteFin
}