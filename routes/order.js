const router = require('express').Router();
const {Order,validateOrder} = require('../models/order')
const {Correspondant} = require('../models/correspondant');
const PdfPrinter = require('pdfmake');
const numberToLetter = require('../local_modules/numberToLetter/nombre_en_lettre')
const moment = require('moment')

//define pdfMake Fonts

const fonts = {
    Courier: {
      normal: 'Courier',
      bold: 'Courier-Bold',
      italics: 'Courier-Oblique',
      bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    },
    Times: {
      normal: 'Times-Roman',
      bold: 'Times-Bold',
      italics: 'Times-Italic',
      bolditalics: 'Times-BoldItalic'
    },
    Symbol: {
      normal: 'Symbol'
    },
    ZapfDingbats: {
      normal: 'ZapfDingbats'
    }
  };


//initilize pdfMake
const printer = new PdfPrinter(fonts);


//create a new order
router.post('/',async (req,res)=> {

        //validate correspondant

    const {error} = validateOrder(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const {montant,motif,date,rib} = req.body;
    
   
    //convert number to lettre 

    let str 

    if(Math.ceil(parseFloat(montant))=== parseFloat(montant)) {

        str =  numberToLetter(parseFloat(montant),'Dirhams','Centimes') + ' Dirhams et Zero Centimes' 
    } else {
        str =  numberToLetter(parseFloat(montant),'Dirhams','Centimes')
    
    }

    //split stri to array each word is an element of the array

    const arr = str.split(" ");

    //loop through each element of the array and capitalize the first letter.

    for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    //join the array element into one signle string 

    str = arr.join(" ");
    

    let correspondant

        //retrieve correspondant
        try {
            correspondant = await Correspondant.findOne({
                rib
            });

        }catch(ex){

            console.log(ex)
        }
      

      //create a new  order instance
        const order = new Order({

            montant,
            motif,
            date: moment(date,'DD-MM-YYYY').add(5, 'hours').toDate(),
            numberToLettre : str,
            correspondant : {
                _id : correspondant._id,
                rs : correspondant.rs,
                rib : correspondant.rib,
                ville : correspondant.ville
            }
        
    })
//save  order in data base$
let result
    try {

        result = await order.save();
        console.log(result);

    }catch(ex) {

        console.log(ex)
    }

    //generate PDF

    //set headers
    res.set('Content-Type', "application/pdf");
    res.set('Content-Disposition', `attachment; filename="Order_Vire_${result.correspondant.rs}_${moment().format("MMDDYYYY_hh_mm_ss")}.pdf"`);

    //set pdf doc defenition

    var docDefinition = {

        pageSize: 'A4',
        footer : {
            text: 'BANK OF AFRICA, Société Anonyme au Capital de 1.998.204.600,00, Etablissement de crédit-Arrêté d’agrément n°2348-94 du 23 Août 1994-140 avenue HASSAN II -20039 Casablanca-Maroc RC :27129 Casa-N° IF :01085112-Patente : 35502790-CCP Rabat 1030-CNSS 10 28085-ICE 001512572000078- Tél :+212522200420/+212522200325',
            style: ['footer'],
            margin : [3,3]
        },
    
        header : {
           
                    image: "./public/img/bmce_header.png",
                    fit: [540,540],
                    alignment : "center",
                    margin : [5,10]
                   
    
        },
       
        
        content: [
    
            '\n\n\n',
            {
                text: 'Agence : Hassan II',
                style: ['header','body']
            },
            '\n\n',
            {
                text: `Montant en Dirhams : ${Number.parseFloat(result.montant).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Dhs`,
                style: ['montant','body']
            },
            '\n\n\n\n',
            
            {
                
                table: {
                    widths: [170, 5, '*'],
                    
                
                    body: [
                        
                        ['Messieurs,', '',''],
                        ['Je vous prie/Nous vous prions ', '' ,''],
                        ['Par le débit de mon/notre compte N° ', ':', {text :`011 780 0000 1521 0001 7279 78`, alignment : "left" }],
                        ['De virer le montant en Dirhams', ':' ,{text : `${Number.parseFloat(result.montant).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Dhs ( ${result.numberToLettre} )` ,alignment : "left" }],
                        ['Au profit de  ',':', { text :`${result.correspondant.rs} \n ${result.correspondant.rib}` , alignment : "center",lineHeight : 2}],
                    ]
                },
                layout: 'noBorders',
                style: 'body',
            },
            '\n\n\n\n\n\n\n',
            {
                
                table: {
                    widths: [40, 2, '*'],
                    
                
                    body: [
                        
                        ['Chez(1)', ':',''],
                        ['Adresse', ':' ,''],
                        ['Motif', ':',`${result.motif}` ],
                            ]
                },
                layout: 'noBorders',
                style: 'body',
            },
    
    
            '\n\n\n\n',
            {
                style: ['body'],
                alignment : "center",
                table: {
                    widths: ['*', 150 , '*'],
    
                    body: [
                        [ {text : `Le ${moment(result.date).format('DD/MM/YYYY')}`,alignment : "right"} ,  '', {text : 'Signature' ,alignment : "left" } ]
                    ]
                },
                layout: 'noBorders'
            },
    
            
            '\n\n\n\n\n\n',
    
            {
                text: '(1)	Indiquer agence BANK OF AFRICA ou autre banque ',
                style: ['body']
            },
         
        ],
        defaultStyle: {
    
            font : 'Times',
            lineHeight : 1.5,
            alignment: 'justify',
            margin : [10,10,10,10]
         
          },
        styles: {
            header: {
                fontSize: 12,
                alignment : "left"
            },
           body: {
            margin : [10,0],
            fontSize: 11,
            lineHeight : 1.8,
    
           },
            subheader: {
                fontSize: 13,
                bold: true,
                margin: [20, 2]
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            },
            font : 'Times'
            ,footer1 : {
                bold: true,
                decoration : "underline",
                italics: true,
                margin: [20, 2]
            },
            footer : {
                alignment : "center",
                fontSize: 8,
                color : '#a6a6a6'
    
            },
            signature : {
                margin : [150,2,2,30]
            },
            montant : {
                alignment : "center",
            },
            
           
        }
    }

    //create readeable stream
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    // pipe it into res wich is a writable stream
    pdfDoc.pipe(res);
    pdfDoc.end();


})

//hand order search
router.post('/search',async (req,res)=> {

    let {rib,rs,dateD,dateF} =  req.body
    dateD = dateD ?  moment(dateD,"DD-MM-YYYY").add(5, 'hours').toDate() : new Date("01-01-1970") ;
    dateF = dateF ?  moment(dateF,"DD-MM-YYYY").add(5, 'hours').toDate() : new Date("01-01-2999") ;
    

    try {

    const result = await Order
    .find({$and : [
        {"correspondant.rib" :  {$regex:rib , $options: 'i'}},
        {"correspondant.rs" :  {$regex:rs , $options: 'i'}}, 
        {date: { $gte:  dateD } },
        {date: { $lte: dateF } }  
    ]})
    .select({
        _id : 1,
        montant:1,
        "correspondant.rs" : 1,
        "correspondant.rib" : 1,
        date : 1
    });

    return res.status(201).json(result)
    } catch(ex) {

        console.log(ex)

    }

})

//generation pdf order de virement
router.post('/download/:id',async (req,res)=> {

    let result
    try {

        result = await Order.findById(req.params.id)
       

    } catch(ex) {

        console.log(ex)

    }

    console.log(result)
        //generate PDF

    //set headers
    res.set('Content-Type', "application/pdf");
    res.set('Content-Disposition', `attachment; filename="Order_Vire_${result.correspondant.rs}_${moment().format("MMDDYYYY_hh_mm_ss")}.pdf"`);

    //set pdf doc defenition

    var docDefinition = {

        pageSize: 'A4',
        footer : {
            text: 'BANK OF AFRICA, Société Anonyme au Capital de 1.998.204.600,00, Etablissement de crédit-Arrêté d’agrément n°2348-94 du 23 Août 1994-140 avenue HASSAN II -20039 Casablanca-Maroc RC :27129 Casa-N° IF :01085112-Patente : 35502790-CCP Rabat 1030-CNSS 10 28085-ICE 001512572000078- Tél :+212522200420/+212522200325',
            style: ['footer'],
            margin : [3,3]
        },
    
        header : {
           
                    image: "./public/img/bmce_header.png",
                    fit: [540,540],
                    alignment : "center",
                    margin : [5,10]
                   
    
        },
       
        
        content: [
    
            '\n\n\n',
            {
                text: 'Agence : Hassan II',
                style: ['header','body']
            },
            '\n\n',
            {
                text: `Montant en Dirhams : ${Number.parseFloat(result.montant).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Dhs`,
                style: ['montant','body']
            },
            '\n\n\n\n',
            
            {
                
                table: {
                    widths: [170, 5, '*'],
                    
                
                    body: [
                        
                        ['Messieurs,', '',''],
                        ['Je vous prie/Nous vous prions ', '' ,''],
                        ['Par le débit de mon/notre compte N° ', ':', {text :`011 780 0000 1521 0001 7279 78`, alignment : "left" }],
                        ['De virer le montant en Dirhams', ':' ,{text : `${Number.parseFloat(result.montant).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Dhs ( ${result.numberToLettre} )` ,alignment : "left" }],
                        ['Au profit de  ',':', { text :`${result.correspondant.rs} \n ${result.correspondant.rib}` , alignment : "center",lineHeight : 2}],
                    ]
                },
                layout: 'noBorders',
                style: 'body',
            },
            '\n\n\n\n\n\n\n',
            {
                
                table: {
                    widths: [40, 2, '*'],
                    
                
                    body: [
                        
                        ['Chez(1)', ':',''],
                        ['Adresse', ':' ,''],
                        ['Motif', ':',`${result.motif}` ],
                            ]
                },
                layout: 'noBorders',
                style: 'body',
            },
    
    
            '\n\n\n\n',
            {
                style: ['body'],
                alignment : "center",
                table: {
                    widths: ['*', 150 , '*'],
    
                    body: [
                        [ {text : `Le ${moment(result.date).format('DD/MM/YYYY')}`,alignment : "right"} ,  '', {text : 'Signature' ,alignment : "left" } ]
                    ]
                },
                layout: 'noBorders'
            },
    
            
            '\n\n\n\n\n\n',
    
            {
                text: '(1)	Indiquer agence BANK OF AFRICA ou autre banque ',
                style: ['body']
            },
         
        ],
        defaultStyle: {
    
            font : 'Times',
            lineHeight : 1.5,
            alignment: 'justify',
            margin : [10,10,10,10]
         
          },
        styles: {
            header: {
                fontSize: 12,
                alignment : "left"
            },
           body: {
            margin : [10,0],
            fontSize: 11,
            lineHeight : 1.8,
    
           },
            subheader: {
                fontSize: 13,
                bold: true,
                margin: [20, 2]
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            },
            font : 'Times'
            ,footer1 : {
                bold: true,
                decoration : "underline",
                italics: true,
                margin: [20, 2]
            },
            footer : {
                alignment : "center",
                fontSize: 8,
                color : '#a6a6a6'
    
            },
            signature : {
                margin : [150,2,2,30]
            },
            montant : {
                alignment : "center",
            },
            
           
        }
    }

    //create readeable stream
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    // pipe it into res wich is a writable stream
    pdfDoc.pipe(res);
    pdfDoc.end();

})





module.exports = router