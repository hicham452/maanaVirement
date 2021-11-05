$(document).ready(function() {


      //allow only numbers in ribOrderRecherche input
      $("input[name='ribOrderRecherche']").on('input', function(e) {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });

    //select add Order  form
    const form = document.querySelector('#order form');


        form.addEventListener('submit', async (e) => {
          e.preventDefault();
    
          let result;
    
          result = confirm('Etes-vous sur de vouloir générer l\'Order de Virement?');
    
          if (!result) {
    
            M.toast({
              html: "Demande Annulée",
              displayLength: 2000,
              classes: 'red rounded h4'
            })
    
            return false
    
    
          } else {
    
            // get values
            const montant = form.montant.value;
            const motif = form.motif.value;
            const rib = form.rib.value;
            const date = form.dateOrder.value;
    
            //console.log(montant,motif,rib,date);
    
    
            try {
              const res = await fetch('/api/order', {
                method: 'POST',
                body: JSON.stringify({
                    montant,
                    motif,
                    date,
                    rib
                }),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
    
              const result = await res
              //console.log(result.status)
    
              if (result.status === 200) {
                let filename = result.headers.get("Content-Disposition")
                filename = filename.match(/filename="(.+)"/)[1]
                //console.log(filename)
                const blob = await res.blob();
                var file = window.URL.createObjectURL(blob);
                var link = document.createElement("a");
                link.href = file;
                link.download = filename;
                document.body.appendChild(link)
                link.click();
                document.body.removeChild(link);
    
                M.toast({
                  html: "attestation generer",
                  displayLength: 2000,
                  classes: 'green rounded h4'
                })

                form.montant.value = "";
                form.motif.value = "";
                form.rib.value = "";
              } else if (result.status === 400) {
    
                const data = await res.json();
    
                M.toast({
                  html: data.error,
                  displayLength: 6000,
                  classes: 'red rounded h4'
                })
    
              } else {
    
                location.assign("/api/auth/?error=l'opération non pas aboutie , Utilisateur déconnecté")
    
              }
    
            } catch (err) {
              console.log(err);
            }
          }
    
        });


        //show order table



        const table =  $('#order-table').DataTable( {
            //data: dataSet,
            searching: false,
            columns: [
                { data : '_id' ,title: "Id Opération" },
                {data : 'date',
                title : "Date",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                  $(nTd).html(
                    `<span>${moment(oData.date).format('DD-MM-YYYY')}</span>`);
                }
              },
               /*  { data : 'correspondant.ville' ,title: "ville" }, */
                { data :'correspondant.rs' , title: "raison Social" },
                { data : 'correspondant.rib' , title: "RIB" },
                { 
                  data : 'montant' ,
                  title: "montant",
                  "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html(
                      `<span>${Number.parseFloat(oData.montant).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} DH</span>`);
                  }
                 },
                {
                    data: '_id',
                    title :'Telecharger',
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                      $(nTd).html(
                        `<a class="order-download" title='download' onclick=return showDetail() href="/api/order/download/${oData._id}"><i class="fas fa-download"></i></a>`);
                    }
                  },
           /*  {defaultContent  : "<span><i class='far fa-eye mx-1 actionConsulter' title='Consulter'></i></span><span><i class='far fa-edit mx-1 actionModifier' title='Modifier'></i></span>"}     */
            ],
            language: {
                "url": "/js/datatable/datatable_French.json"
              },
        } )


        /*==================
            Search order
        ===================*/

const form2 = document.querySelector('#order-search')
console.log(form2) 

form2.addEventListener('submit',async function (e) {

    e.preventDefault();
    // clear table 
    table.clear().draw();

    //Get values
 
    /* let ville= this.villeOrderRecherche.value; */
    let rs = this.rsOrderRecherche.value;
    let rib = this.ribOrderRecherche.value;
    let dateF = this.dateFinOrder.value;
    let dateD = this.dateDebutOrder.value;

    //console.log(rib,rs)

    try {

        const res = await fetch('/api/order/search',{

            method: 'POST',
            body : JSON.stringify({
                rib,
                rs,
                dateF,
                dateD
              }),
              headers: {
                'Content-Type': 'application/json'
              }

        });

        const data = await res.json()
        console.log(data)
          console.log('data receved')
        table.rows.add(data).draw() 

    } catch(ex) {

        console.log(ex)

    }

}) 



            /*==================
            download order from 
            ===================*/

            table.on('draw', function (e) {

                //console.log('draw');

           //selectionner tous les a  
                const download = document.querySelectorAll(".order-download"); 
                // creer un evenent lisnter pour chaque element a de la table
                download.forEach(element => {

                   element.addEventListener("click", async function(e) {

                       e.preventDefault();
                       //recupere le valeur de href (ex /api/acceuil/136) 
                       let id = this.getAttribute("href")
                       console.log(id)
                       
                       try {
                           //envoyé la requette post
                           const res = await fetch(`${id}`, {
                               method: 'POST'
                           });
                           //rec reception de la data
                           const result = await res
                           //console.log(result.status)

                           if (result.status === 200) {
                            let filename = result.headers.get("Content-Disposition")
                            filename = filename.match(/filename="(.+)"/)[1]
                            //console.log(filename)
                            const blob = await res.blob();
                            var file = window.URL.createObjectURL(blob);
                            var link = document.createElement("a");
                            link.href = file;
                            link.download = filename;
                            document.body.appendChild(link)
                            link.click();
                            document.body.removeChild(link);
                
                            M.toast({
                              html: "Order de Virement genéré",
                              displayLength: 2000,
                              classes: 'green rounded h4'
                            })
                          }

                       } catch(ex) {

                           console.log('erreur download Order Virement',ex)
                       }
                   })
                })
       }) 


})