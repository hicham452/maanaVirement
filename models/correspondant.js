const mongoose = require("mongoose");
const Joi = require('joi');

const correspondantSchema = new mongoose.Schema({

   
    rs: {

        type: String,
        trim : true,
        required: true,
        uppercase: true,
        minlength: 3,
        maxlength: 100
    },
    rib: {

        type: String,
        unique : true,
        trim : true,
        required: true,
        uppercase: true,
        length: 24,
    },
    date : {
        type : Date,
        default : Date.now,
        required: true
    }


})


function validate(correspondant) {

    const schema = Joi.object({

      
        rs: Joi.string().min(3).max(50).required(),
        rib: Joi.string().length(24).required(),
   
    })

    return schema.validate({

    
        rs: correspondant.rs,
        rib: correspondant.rib,
      

    })

}

const Correspondant = mongoose.model("correspondant",correspondantSchema);


module.exports.Correspondant = Correspondant;
module.exports.validateCorrespondant = validate;