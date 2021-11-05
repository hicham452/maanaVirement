const {Router} =  require("express");
const {Mouvement} =  require("../../models/mouvement");
const {validateTokken,regnerateNewToken,validateTokkenForIndex,checkUser} = require("../../middleware/auth");
const _ = require("lodash");
const PdfPrinter = require('pdfmake');
const odbc = require("odbc");
const moment = require("moment");
var QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const url = require('url');
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



//Create mail transport
var transport = nodemailer.createTransport({
    host: "192.168.99.100",
    port: 25
});

var email = new Email({
    transport: transport,
    send: true,
    preview: false,
    views: {
        options: {
            extension: 'ejs',
        },
    },
});

//show mouvement 
router.get("/",validateTokken,checkUser,regnerateNewToken,(req,res)=> {

  if(req.query.error) res.locals.error = req.query.error;
  if(req.query.success) res.locals.success = req.query.success;

    res.render("./mouvement/mouvement")

})
//create new mouvement with etape initie
router.post("/",validateTokken,regnerateNewToken,checkUser,async (req,res)=> {
 
    let {agence,compte,etape,dateDebut,dateFin,montant,directeur,adjoint} = req.body.data;
    let {username,ville} = res.locals.user;
    //let {dateDebut,dateFin,montant} = req.body.mouvement;
    //dateDebut = !Array.isArray(dateDebut)?[moment(dateDebut,"DD-MM-YYYY").add(3, 'hours').toDate()]:dateDebut;
    //dateFin= !Array.isArray(dateFin)?[moment(dateFin,"DD-MM-YYYY").add(3, 'hours').toDate()]:dateFin  ;
    //montant=!Array.isArray(montant)?[montant]:montant;

    
    //console.log(dateDebut,dateFin,montant);
   let mouvement = dateDebut.map((x,i)=> ({dateDebut:moment(x,"DD-MM-YYYY").add(3, 'hours').toDate(),dateFin : moment(dateFin[i],"DD-MM-YYYY").add(3, 'hours').toDate(),montant :montant[i] }))
  const conn1 = await odbc.connect("DSN=UMB_MON");

   let requetteClientUmb ="select a.ncp , a.age ,a.clc , a.inti , b.nom , b.pre from bkcom a INNER JOIN bkcli b on a.cli = b.cli where  a.ncp ='" + compte +"' and a.age = '" + agence+"'";
   let result = await conn1.query(requetteClientUmb);

   if(!result[0]){
  
    return res.status(400).json({

        error : "Le N° de Compte renseigné n a pas été trouvé"
    })
}


   let {ncp,age,clc,inti,nom,pre} = (_.pick(result[0], ["ncp", "age", "clc","inti","nom","pre"]));

   const newMouvement = new Mouvement({
    ncp,
    age,
    clc,
    inti,
    nom,
    pre,
    mouvement,
    directeur,
    adjoint,
    username,
    ville,
    etape
});

   result = await newMouvement.save();
   console.log(result);

   res.status(200).json({result});
})


//rechercher mouvement
router.post("/index",validateTokken,regnerateNewToken,checkUser,  async(req,res)=> {
    let {ncp,age,id,etape,dateDebut,dateFin} = req.body
    //console.log(ncp,age,id,etape,dateDebut,dateFin)
    dateDebut = dateDebut ? moment(dateDebut,"DD-MM-YYYY").add(3, 'hours').toDate(): new Date("01-01-1970") ;
    dateFin = dateFin ? moment(dateFin,"DD-MM-YYYY").add(3, 'hours').toDate() : new Date("01-01-2999") ;
    let mouvement
    if(id){
        mouvement = await Mouvement
        .find({$and : [
            {ncp :  {$regex:ncp , $options: 'i'}},
            {age :  {$regex:age , $options: 'i'}},
            {etape :  {$regex:etape , $options: 'i'}},
            {_id : id},
            {date: { $gte:  dateDebut } }, 
            {date: { $lte: dateFin } }
        ]})
        .select({
            _id : 1,
            age:1,
            ncp :1,
            date : 1,
            etape :1
        });
        
    } else {
        mouvement = await Mouvement
        .find({$and : [
            {ncp :  {$regex:ncp , $options: 'i'}},
            {age :  {$regex:age , $options: 'i'}},
            {etape :  {$regex:etape , $options: 'i'}},
            {date: { $gte:  dateDebut } },
            {date: { $lte: dateFin } }
        ]})
        .select({
            _id : 1,
            age:1,
            ncp :1,
            date : 1,
            etape :1
        });
    }
     
        //console.log( mouvement.length )
        if(mouvement.length < 1) {
    
            return res.status(400).json({
                error : "aucun enregistrement trouvé avec le(s) critère(s) de recherche choisi(s)"
            })
        } 
    
        res.status(200).json({
    
            mouvement 
        })
    
    })


//show mouvement in consulation

router.post("/:id",validateTokken,regnerateNewToken,checkUser,async (req,res)=> {

    let {id} = req.params;
    let mouvement = await Mouvement.findById(id);
    res.status(200).json({mouvement});

})

//show mouvement detail for validation or rejection
router.get("/:id/show",validateTokkenForIndex,regnerateNewToken,checkUser,async (req,res)=> {

    let {id} = req.params;
    let mouvement = await Mouvement.findById(id);

    res.render("./mouvement/showMouvement",{mouvement})

})

    //validate or reject mouvement
router.post("/:id/valid",validateTokkenForIndex,regnerateNewToken,checkUser,async (req,res)=>{

        let {id} = req.params
        let {etape} = req.body
       

       // console.log(id,etape)
        let mouvement = await Mouvement.findById(id);
        mouvement.etape = etape;
        if(etape === "3"){
            let {motifReject} = req.body
            mouvement.motifReject = motifReject;
            mouvement = await mouvement.save()
            return res.redirect(url.format({
                pathname:"/api/mouvement",
                query: {
                   "error":"attestation N° "+id+" rejetée"
                 }
              }));;
        } else {
            mouvement = await mouvement.save()
            return res.redirect(url.format({
                pathname:"/api/mouvement",
                query: {
                   "success":"Attestation N° "+id+" acceptée"
                 }
              }));;
        }  
    })

//generate pdf
router.get("/:id/generate",validateTokkenForIndex,regnerateNewToken,checkUser,async (req,res)=> {


const {id} = req.params;
let mouvement = await Mouvement.findById(id);

const ribComplet = `005${mouvement.age.trim()}0000${mouvement.ncp.trim()+mouvement.clc.trim()}`;

let mouvements = mouvement.mouvement.map(element =>{

    let result = `Du ${moment(element.dateDebut).format("DD/MM/YYYY")}  `;
    result += `au  ${moment(element.dateFin).format("DD/MM/YYYY")}   :   `;
    result += `${element.montant.toFixed(2)} DH.`
    return result;

})

//let string = mouvement._id.toString()

let string = _.pick(mouvement,["_id","ncp","age","date"])
let qr = await QRCode.toDataURL(`id:${string._id}\nncp:${string.ncp}\nage:${string.age}\ndate:${moment(string.date).format("DD/MM/YYYY hh:mm")}`,{ version: 2 },{ errorCorrectionLevel: 'H' });
res.set('Content-Type', "application/pdf");
res.set('Content-Disposition', `attachment; filename="attes_Mouv_${mouvement.nom}_${mouvement.pre}_${moment().format("DDMMYYYY")}.pdf"`);

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
            image: qr,
            fit: [60,60],
            alignment : 'right'
            
        },
        '\n\n',
        {
            text: 'ATTESTATION DU MOUVEMENT CREDITEUR BANCAIRE',
            style: 'header'
        },
        '\n\n',
        {
               text : `Compte N° ${ribComplet}`,
               style : 'subheader'
        },
        '\n\n',
        {
            text : 'Nous soussignés, UNION MAROCAINE DE BANQUES, Société Anonyme au capital de  3.500.000,00 DHS dont le  siège social est situé à Casablanca, 36 rue Tahar Sebti, représentée et dûment habilitée par :\n\n',
            style: 'body'

        },
        
        {
            text: [
                 `Directeur D'agence  : ${mouvement.directeur.trim().toUpperCase()}\n`,
                 `Adjoint Directeur   : ${mouvement.adjoint.trim().toUpperCase()}\n\n`
            ],
            style: 'signataire'
        },

        {
            text:'Attestons par la présente que '+ mouvement.nom +' '+mouvement.pre +' a réalisé un mouvement créditeur bancaire durant la période :',
            style: 'body'
        },
        '\n', 
        {
            ul:mouvements,
            style : 'list'
        },
        '\n', 
        {
          text:   "En foi de quoi, nous délivrons cette attestation à la demande de l’intéressé  Pour servir et valoir ce que de droit.\n\n\n\n",
          style : 'body'
        },

        

        {
            text: [
                'Fait  à '+mouvement.ville+' le '+moment().format("DD/MM/YYYY"),
            ],
            style: 'footer1'
        },
        '\n\n',
        {
			style: ['body','tabelBold'],
			table: {
                widths: ['*', 'auto'],
				headerRows: 1,
				body: [
					[{text: `${mouvement.adjoint.trim().toUpperCase()}`, style: 'tableHeader'}, {text: `${mouvement.directeur.trim().toUpperCase()}`, style: 'tableHeader'},],
				]
			},
			layout: 'noBorders'
		},

        
        '\n\n\n'
     
    ],
    defaultStyle: {

        font : 'Times',
        lineHeight : 1.5,
        alignment: 'justify',
        margin : [10,10,10,10]
     
      },
    styles: {
        header: {
            fontSize: 15,
            bold: true,
            alignment : "center",
            decoration : "underline"
        },
       body: {
        margin : [20,0]

       },
        subheader: {
            fontSize: 15,
            bold: true,
            alignment : "center",
        },
        signataire: {
            fontSize: 13,
            lineHeight : 2,
            bold: true,
            margin: [20, 2]
        },
        list: {
            fontSize: 13,
            lineHeight : 2,
            margin : [50,0],
            bold: true
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
        footer2 : {
            bold: true,
            alignment : "center",
            decoration : "underline"    
        },
        tabelBold : {
            bold: true,
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