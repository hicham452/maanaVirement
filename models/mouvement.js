const mongoose = require("mongoose");

const mouvementSchema = new mongoose.Schema({

    ncp: { //num compte

        type: String,
        required: true,
        trim: true,
        maxlength: 30

    },
    age: { //agence du compte
        type: String,
        required: true,
        trim: true
    },
    clc: { //code client

        type: String,
        required: true,
        trim: true
    },

    nom: { //nom client
        type: String,
        trim: true,
    },
    pre: { //prenom client
        type: String,
        trim: true,
    },
    inti: { //type compte

        type: String,
        trim: true,
    },
    username: { //utilisateur qui a effectué la demande
        type: String,
        trim: true,
    },
    directeur : {
        type : String,
        trim : true,
    },
    adjoint : {
        type : String,
        trim : true,
    },
    mouvement: [{
        dateDebut: { //date debut mouvement
            type: Date,
            required: true,
        },
        dateFin: { //date fin mouvement
            type: Date,
            required: true,
        },
        montant: { //montant de mouvement
            type: Number,
            required: true
        },
    }],

    ville: { //ville opérateur
        type: String,
        trim: true,
    },
    etape : {
        type : String,
        required : true,
        enum: ["1","2","3"] //1 initier 2 accepter 3 rejeté
    },
    motifReject : { //motif reject
        type: String,
        trim: true,
    },
    date: { //date realisation demande mouvement

        type: Date,
        default: Date.now
    }
})

const Mouvement = mongoose.model("Mouvement", mouvementSchema);

module.exports = {

    Mouvement
}