const {Router} =  require("express");
const {capaciteFin} =  require("../../models/capaciteFin");
const {validateTokken} = require("../../middleware/auth");
const {checkUser} = require("../../middleware/auth");
const _ = require("lodash");
const PdfPrinter = require('pdfmake');
const odbc = require("odbc");
const router = Router();



//declare font for pdfmake
const fonts = {
    Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
    }
}

//initalze pdfmake
var printer = new PdfPrinter(fonts);


//show Attestation Rib 
router.get("/",validateTokken,(req,res)=> {

    res.render("./capaciteFin/capaciteFin")

})


//generate pdf
router.post("/",validateTokken,checkUser,async (req,res)=> {

const {agence,compte,montant} = req.body;
console.log(req.user)
const {username,ville} = res.locals.user;
const conn1 = await odbc.connect("DSN=UMB_MON");
//let requetteClientUmb  = "select * from bkcom where ncp='" + compte + "' and age = '" + agence + "'";
let requetteClientUmb ="select a.ncp , a.age ,a.clc , a.inti , b.nom , b.pre from bkcom a INNER JOIN bkcli b on a.cli = b.cli where  a.ncp ='" + compte +"' and a.age = '" + agence+"'";
let result = await conn1.query(requetteClientUmb);
//console.log( `005${result[0].age.trim()}00000${result[0].ncp.trim()+result[0].clc.trim()}`);
//console.log(result);
let {ncp,age,clc,inti,nom,pre} = (_.pick(result[0], ["ncp", "age", "clc","inti","nom","pre"]));
const capaciteFinanciere = new capaciteFin({
    ncp,
    age,
    clc,
    inti,
    nom,
    pre,
    montant,
    username,
    ville
});

result = await capaciteFinanciere.save();
console.log(result)

res.set('Content-Type', "application/pdf");
res.set('Content-Disposition', 'attachment; filename="test.pdf"');

var docDefinition = {

    pageSize: 'A4',
    footer : {
       
    
        image: "./public/img/umb_footer3.png",
        fit: [540,540],
        alignment : "center",
        margin : [-5,-5]
     

    
    },

    header : {
        image: "./public/img/umb_header.png",
        fit: [280,280],
        alignment : "left",
        margin : [30,10]
       

    },
   
    
    content: [

        
        {
            text: '\n\n\nID Document : 5ff470cf733354192c613683',
            style: ['quote', 'small','italics',{
                alignment : 'right'
            }]
        },
        '\n\n\n\n\n\n',
        {
            text: 'ATTESTATION DE CAPACITE FINANCIERE ',
            style: 'header'
        },
        '\n\n\n\n\n\n\n',

        { text : [
            'Nous soussignés, UNION MAROCAINE DE BANQUES, Société Anonyme au capital de 3.500.000,00 DH dont le  siège social est situé à Casablanca, 36 rue Tahar Sebti, \n\n',
            'Certifions par la présente que M MOHAMED SPECIMEN est titulaire d’un compte bancaire ouvert sur nos livres sous le N° 005.780.000002100000000-01 et qui présente un solde créditeur d’un montant : 000.000,00 DH. \n\n',
            "En foi de quoi, cette attestation est délivrée à l’intéressé pour servir et valoir ce que de droit.\n\n\n\n\n\n\n",

        ],
        style:"body"

        },
       
        {
            text: [
                'Fait  à Casablanca le 05/01/2021 \n\n\n\n',
            ],
            style: 'footer1'
        },

        {
            text: [
             
                'UNION MAROCAINE DE BANQUES\n\n\n\n\n',
            ],
            style: 'footer2'
        },

        
         
		
	

        
     
    ],
    defaultStyle: {

        font : 'Times',
        lineHeight : 1.5,
        alignment: 'justify',
        margin : [100,0]
     
      },
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            alignment : "center",
            decoration : "underline"
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
            fontSize: 10
        },
        font : 'Times'
        ,footer1 : {
            bold: true,
            //decoration : "underline",
            italics: true,
            margin : [20,0]

        },
        footer2 : {
            bold: true,
            alignment : "center",
            decoration : "underline"    
        },
        body : {
            margin : [20,0]
        }
    }
}
//create readeable stream
const pdfDoc = printer.createPdfKitDocument(docDefinition);
// pipe it into res wich is a writable stream
pdfDoc.pipe(res);
pdfDoc.end();
});


module.exports = router;