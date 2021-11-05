$(document).ready(function () {
  //date picker

   //initialze datepiker with format dd-mm-yyyy
   $('.datepicker').datepicker({
    disableWeekends: true,
    showClearBtn: true,
    autoClose: true,
    format: 'dd-mm-yyyy',
    i18n: {

      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre',
        'Novembre', 'Décembre'
      ],
      monthsShort: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
    },


  });
 
  if ($('select')) {
    $('select').formSelect();

    $("select[required]").css({
      display: "block",
      height: 0,
      padding: 0,
      width: 0,
      position: 'absolute'
    });
  }

  if ($(".tabs")) {

    $(".tabs").tabs();
  }

/*   if ("#ribTable") {
    $('#ribTable').DataTable({
      bFilter: false,
      ordering: false,
      lengthChange: false,
      paging: true
    });

  } */






});