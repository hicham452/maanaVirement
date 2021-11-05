const {Router} =  require("express");
const _ = require("lodash");
const PdfPrinter = require('pdfmake');
const moment = require("moment");
const router = Router();



//declare font for pdfmake
var fonts = {
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

//initalze pdfmake
var printer = new PdfPrinter(fonts);


//show Attestation Rib 
router.get("/",(req,res)=> {


    res.render("./rib/indexRib")

})


//generate pdf
router.post("/",async (req,res)=> {

/* const {agence,compte,directeur,adjoint} = req.body;
console.log(req.user)
const {username,ville} = res.locals.user;
const conn1 = await odbc.connect("DSN=UMB_MON");
//let requetteClientUmb  = "select * from bkcom where ncp='" + compte + "' and age = '" + agence + "'";
let requetteClientUmb ="select a.ncp , a.age ,a.clc , a.inti , b.nom , b.pre from bkcom a INNER JOIN bkcli b on a.cli = b.cli where  a.ncp ='" + compte +"' and a.age = '" + agence+"'";
let result = await conn1.query(requetteClientUmb);
if(!result[0]){
  
    return res.status(400).json({

        error : "Le N° de Compte renseigné n a pas été trouvé"
    })
}
console.log(result[0]);

let {ncp,age,clc,inti,nom,pre} = (_.pick(result[0], ["ncp", "age", "clc","inti","nom","pre"]));
const ribComplet = `005${age.trim()}0000${ncp.trim()+clc.trim()}`;
const raisonSocial = `${nom.trim().toUpperCase()} ${pre.trim().toUpperCase()}`;
const typeCompte = `${inti.trim().toUpperCase()}`;
const rib = new Rib({
    ncp,
    age,
    clc,
    inti,
    nom,
    pre,
    directeur,
    adjoint,
    username,
    ville
});

result = await rib.save(); */
//console.log(result)
/* let string = rib._id.toString()
string = _.pick(rib,["_id","ncp","age","date"]) */
//string = JSON.stringify(string);
//console.log(string)

/* let qr = await QRCode.toDataURL(`id:${string._id}\nncp:${string.ncp}\nage:${string.age}\ndate:${moment(string.date).format("DD/MM/YYYY hh:mm")}`,{ version: 2 },{ errorCorrectionLevel: 'H' }); */


res.set('Content-Type', "application/pdf");
res.set('Content-Disposition', `attachment; filename="attes_Rib_hicham_ouichoul_28102021.pdf"`);

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
            text: 'Montant en Dirhams :1.216,00Dhs',
            style: ['montant','body']
        },
        '\n\n\n\n',
        
        {
			
			table: {
                widths: [170, 5, '*'],
                
			
				body: [
					
					['Messieurs,', '',''],
					['Je vous prie/Nous vous prions ', '' ,''],
					['Par le débit de mon/notre compte N° ', ':', {text :'011 780 0000 1521 0001 7279 78', alignment : "left" }],
					['De virer le montant en Dirhams', ':' ,{text : '1.216,00Dhs (Mille Deux Seize Dirhams et Zero Centimes)' ,alignment : "left" }],
					['Au profit de  ',':', { text :' MAHEJAN SARL \n 225 550 0318 0278 2651 0105 70 ', alignment : "center",lineHeight : 2}],
				]
			},
			layout: 'noBorders',
            style: 'body',
		},
        '\n\n\n\n\n\n\n\n',
        {
			
			table: {
                widths: [40, 2, '*'],
                
			
				body: [
					
					['Chez(1)', ':',''],
					['Adresse', ':' ,''],
					['Motif', ':','En debours des clients Cuenod(MAT569.28)' ],
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
					[ {text : `Le 28/10/2021`,alignment : "right"} ,  '', {text : 'Signature' ,alignment : "left" } ]
				]
			},
			layout: 'noBorders'
		},

        
        '\n\n\n\n\n\n\n',

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
});

//effectuer une recherche
router.post("/index", async(req,res)=> {
/* let {ncp,age,id,dateDebut,dateFin} = req.body
console.log(id)
dateDebut = dateDebut ?  moment(dateDebut,"DD-MM-YYYY").add(3, 'hours').toDate() : new Date("01-01-1970") ;
dateFin = dateFin ?  moment(dateFin,"DD-MM-YYYY").add(3, 'hours').toDate() : new Date("01-01-2999") ;
let rib
if(id){
    rib = await Rib
    .find({$and : [
        {ncp :  {$regex:ncp , $options: 'i'}},
        {age :  {$regex:age , $options: 'i'}},
        {_id : id},
        {date: { $gte:  dateDebut } },
        {date: { $lte: dateFin } }
    ]})
    .select({
        _id : 1,
        age:1,
        ncp :1,
        date : 1
    });
    
} else {
    rib = await Rib
    .find({$and : [
        {ncp :  {$regex:ncp , $options: 'i'}},
        {age :  {$regex:age , $options: 'i'}},
        {date: { $gte:  dateDebut } },
        {date: { $lte: dateFin } }
    ]})
    .select({
        _id : 1,
        age:1,
        ncp :1,
        date : 1
    });
}
 
    //console.log(rib)
     if(!rib[0]) {

        return res.status(400).json({
            error : "aucun enregistrement trouvé avec le(s) critère(s) de recherche choisi(s)"
        })
    }  

    res.status(200).json({

        rib
    }) */

})

//détail id génerer
router.post("/:id",async(req,res)=> {

       /*  const {id} = req.body */

        /* const rib = await Rib.findById(id);
        console.log(rib)
        res.status(200).json({rib}); */

})

module.exports = router;