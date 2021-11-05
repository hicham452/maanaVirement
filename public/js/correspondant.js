$(document).ready(function() {


    //allow only numbers in ribAjout input
    $("input[name='ribAjout']").on('input', function(e) {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });


    //select ajout correspondant form

    const form =  document.querySelector('#correspondant-ajout');
    console.log(form)

    form.addEventListener('submit', async function(e){

        e.preventDefault();

        let result;

        result = confirm('Etes-vous sur de vouloir Ajouter le correspondant?');

        if(!result) {

            M.toast({
                html: "Opération Annulée",
                displayLength: 2000,
                classes: 'red rounded h4'
              })
      
              return false

        } else {

             // get values
           /*   const ville = form.ville.value;
             const hotel = form.hotel.value; */
             const rsAjout = form.rsAjout.value;
             //const categorie = form.categorie.value;
             const ribAjout = form.ribAjout.value;
             //const swift = form.swift.value;
            // console.log(ville,hotel,rsAjout,categorie,ribAjout,swift)

             try {

                const res = await fetch('/api/correspondant', {
                    method: 'POST',
                    body: JSON.stringify({
                        //ville,
                        //hotel,
                        //categorie,
                        //swift,
                        rs : rsAjout,
                        rib: ribAjout
                    }),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  })

                  const result = await res.json();
                  console.log(result)   
                  if (result.status === 201){
                        
                M.toast({
                    html: result,
                    displayLength: 2000,
                    classes: 'green rounded h4'
                  })

                form.ville.value = "";
                form.hotel.value = "";
                form.rsAjout.value = "";
                form.categorie.value = "";
                form.ribAjout.value = "";
                form.swift.value = "";
     

                  }  else {

                    M.toast({
                        html: result,
                        displayLength: 2000,
                        classes: 'green rounded h4'
                      })

                      //form.ville.value = "";
                      //form.hotel.value = "";
                      form.rsAjout.value = "";
                      //form.categorie.value = "";
                      form.ribAjout.value = "";
                     // form.swift.value = "";

                  }

             } catch(ex) {

                console.log(ex)

             }

        }

    })



    
    const table =  $('#correspondant-table').DataTable( {
        //data: dataSet,
        searching: false,
        columns: [
           { data : '_id' ,title: "ID OPE" },
            { data :'rs' , title: "raison Social" },
            //{ data :'hotel' , title: "Hotel" },
           // { data :'categorie' , title: "Categorie" },
            { data : 'rib' , title: "RIB" },
            //{ data : 'swift' ,title: "SWIFT" },
             {
                data: '_id',
                title :'Modifier',
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                  $(nTd).html(
                    `<a class="correspondant-delete" title='delete' onclick=return showDetail() href="/api/correspondant/${oData._id}"><i class="far fa-times-circle fa-2x"></i></a>`);
                }
              }, 
       /*  {defaultContent  : "<span><i class='far fa-eye mx-1 actionConsulter' title='Consulter'></i></span><span><i class='far fa-edit mx-1 actionModifier' title='Modifier'></i></span>"}     */
        ],
        language: {
            "url": "/js/datatable/datatable_French.json"
          },
    } )



            /*==================
                 Search correspondant
            ===================*/

const form2 = document.querySelector('#correspondant-search')

form2.addEventListener('submit',async function (e) {

    e.preventDefault();
    // clear table 
    table.clear().draw();

    //Get values
 
    let rib= this.ribCorresRecherche.value;
    let rs = this.rsCorresRecherche.value;
 

    try {

        const res = await fetch('/api/correspondant/search',{

            method: 'POST',
            body : JSON.stringify({
                rib,
                rs
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
              delete correspondant
            ===================*/

            table.on('draw', function (e) {

              //console.log('draw');

              //selectionner tous les a  
              const deleteCorrespondant = document.querySelectorAll(".correspondant-delete"); 
              // creer un evenent lisnter pour chaque element a de la table
              deleteCorrespondant.forEach(element => {

                 element.addEventListener("click", async function(e) {

                     e.preventDefault();
                     //recupere le valeur de href (ex /api/acceuil/136) 
                     let id = this.getAttribute("href")


                    const resultConfirm = confirm('Etes-vous sur de vouloir Supprimer le corespondant?'); 

                     if(!resultConfirm) {
             
                         M.toast({
                             html: "Opération Annulée",
                             displayLength: 2000,
                             classes: 'red rounded h4'
                           })
                   
                           return false
             
                     }  else {
                        console.log(id)

                            try {
                               //envoyé la requette post
                                const res = await fetch(`${id}`, {
                                                method: 'DELETE',
                                                });
                                  //rec reception de la data
                                const result = await res
                                  console.log(result.message,result.status )

                                 if (result.status === 200) {
             
                                          M.toast({
                                          html: "Correspondant Suprimé",
                                          displayLength: 2000,
                                          classes: 'green rounded h4'
                                          })

                                          table.clear().draw();


                                   }




                            } catch(ex) {

                                 console.log('erreur download Order Virement',ex)
                           }
                     

                     }
                     
                 })
              })
     }) 


})


