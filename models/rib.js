const mongoose = require("mongoose");

const ribSchema = new mongoose.Schema({

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
        uppercase : true,
        trim : true,
    },
    pre: {
        type : String,
        uppercase : true,
        trim : true,
    },
    inti : {                //type compte
        type: String,
        uppercase : true,
        trim : true,
    },
    username : {                //utilisateur qui a effectué la demande
        type : String,
        uppercase : true,
        trim : true,
    },
    directeur : {
        type : String,
        trim : true,
    },
    adjoint : {
        type : String,
        trim : true,
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

const Rib = mongoose.model("Rib",ribSchema);

module.exports = {

    Rib
}