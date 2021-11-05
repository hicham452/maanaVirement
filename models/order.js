const mongoose = require("mongoose");
const Joi = require('joi')

const orderSchema = new mongoose.Schema({

    montant: {

        type: Number,
        required: true,
        min: 0,
    },
    numberToLettre : {

        type: String,
        required: true,
        minlength: 0,
        maxlength: 1024


    },


    correspondant: {

        type: new mongoose.Schema({

            rs: {

                type: String,
                required: true,
                uppercase: true,
                minlength: 3,
                maxlength: 100
            },
            rib: {
        
                type: String,
                required: true,
                uppercase: true,
                minlength: 5,
                maxlength: 50
            },
        }),
        required: true

    },
    
    motif: {

        type: String,
        required: true,
        uppercase: true,
        minlength: 0,
        maxlength: 1024
    },

    date : {                    //date realisation attestation

        type : Date,
        default : Date.now
    }


})


function validate(order) {

    const schema = Joi.object({

        montant: Joi.number().min(2).precision(2).required(),
        motif: Joi.string().min(0).max(1024).required(),

    })

    return schema.validate({

        montant: order.montant,
        motif: order.motif,

    })

}

const Order = mongoose.model("order",orderSchema);


module.exports.Order = Order
module.exports.validateOrder = validate