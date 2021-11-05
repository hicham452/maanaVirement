const router = require('express').Router();
const {Correspondant,validateCorrespondant} = require('../models/correspondant');

router.post('/',async (req,res)=> {

        //validate correspondant
        console.log(req.body)

    const {error} = validateCorrespondant(req.body);

    if (error) return res.status(400).json(error.details[0].message);

    const {rs,rib} = req.body;

        //verify if the correspondant already exist
        let correspondant = await Correspondant.findOne({
            rib: req.body.rib
        });
        if (correspondant) return res.status(400).json("un correspondant existe déjà avec le meme Rib");

      //create a new  correspondant
    correspondant = new Correspondant({
        rs,rib
    })

    try {

        const result = await correspondant.save();
        res.status(201).json('Correspondant ajouté')

    }catch(ex) {

        console.log(ex)
    }
})



//hand order search
router.post('/search',async (req,res)=> {

    let {rib,rs} =  req.body
    
    try {

    const result = await Correspondant
    .find({$and : [
        {rib :  {$regex:rib , $options: 'i'}},
        {rs :  {$regex:rs , $options: 'i'}}, 

    ]})
    .select({
        rs :1,
        rib : 1,
    });

    return res.status(201).json(result)
    } catch(ex) {

        console.log(ex)

    }

})


router.delete('/:id',async (req,res)=> {

    try {

        const result = await Correspondant.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Correspondant suprimé"});
        

    } catch(ex) {

        console.log(ex)

    }

    

})



module.exports = router