var baseUrl = "/contarbn-be/";

$.fn.loadRicercaLottiDdtTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiDdtTable' )){
		$('#ricercaLottiDdtTable').DataTable().destroy();
	}

	$('#ricercaLottiDdtTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei DDT</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLotti').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun DDT disponibile",
			"zeroRecords": "Nessun DDT disponibile"
		},
		"searching": true,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'desc'],
			[0, 'desc']
		],
		"columns": [
			{"title":"Numero", "name": "numero", "data": "progressivo", "width":"5%"},
			{"title":"Data", "name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Quantità", "name": "quantita", "data": "quantita", "width":"8%"},
			{"title":"Cliente", "name": "cliente", "data": "cliente", "width":"10%"}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiDdtTitle').removeClass('d-none');
		}
	});
}

$.fn.loadRicercaLottiDdtAcquistoTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiDdtAcquistoTable' )){
		$('#ricercaLottiDdtAcquistoTable').DataTable().destroy();
	}

	$('#ricercaLottiDdtAcquistoTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei DDT Acquisto</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLotti').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun DDT Acquisto disponibile",
			"zeroRecords": "Nessun DDT Acquisto disponibile"
		},
		"searching": true,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'desc'],
			[0, 'desc']
		],
		"columns": [
			{"title":"Numero", "name": "numero", "data": "numero", "width":"5%"},
			{"title":"Data", "name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.data);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Quantità", "name": "quantita", "data": "quantita", "width":"8%"},
			{"title":"Fornitore", "name": "fornitore", "data": "fornitore", "width": "10%"}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiDdtAcquistoTitle').removeClass('d-none');
		}
	});
}

$.fn.loadRicercaLottiProduzioneTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiProduzioneTable' )){
		$('#ricercaLottiProduzioneTable').DataTable().destroy();
	}

	$('#ricercaLottiProduzioneTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle produzioni</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLotti').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna produzione disponibile",
			"zeroRecords": "Nessuna produzione disponibile"
		},
		"searching": true,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[1, 'desc'],
			[0, 'desc']
		],
		"columns": [
			{"title":"Codice", "name": "codice", "data": "codiceProduzione", "width":"10%"},
			{"title":"Lotto", "name": "lotto", "data": "lotto", "width":"10%"},
			{"title":"Data", "name": "dataProduzione", "data": null, "width":"15%", render: function ( data, type, row ) {
				var a = moment(data.dataProduzione);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Scadenza", "name": "scadenza", "data": null, "width":"10%", render: function ( data, type, row ) {
				var a = moment(data.scadenza);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Quantità", "name": "quantita", "data": "quantita", "width":"8%"},
			{"title":"Ricetta", "name": "ricetta", "data": "ricetta", "orderable":false}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiProduzioneTitle').removeClass('d-none');
		}
	});
}

$(document).ready(function() {

	$(document).on('submit','#ricercaLottiForm', function(event){
		event.preventDefault();

		var alertContent = '<div id="alertRicercaLottiContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var lotto = $('#lotto').val();

		if(lotto != null && lotto != undefined && lotto != ''){
			$('#alertRicercaLotti').empty().append(alertContent.replace('@@alertText@@','Ricerca lotto in corso...').replace('@@alertResult@@', 'warning'));

			var ricercaLottiDdtUrl = baseUrl + "ddts/search-lotto?lotto="+lotto;
			var ricercaLottiDdtAcquistoUrl = baseUrl + "ddts-acquisto/search-lotto?lotto="+lotto;
			var ricercaLottiProduzioneUrl = baseUrl + "produzioni/search-lotto?lotto="+lotto;

			$.when($.fn.loadRicercaLottiDdtTable(ricercaLottiDdtUrl),$.fn.loadRicercaLottiDdtAcquistoTable(ricercaLottiDdtAcquistoUrl), $.fn.loadRicercaLottiProduzioneTable(ricercaLottiProduzioneUrl)).then(function(f1,f2,f3){
				$('#alertRicercaLotti').empty();
				$('.custom-divider').removeClass('d-none');
			});

		} else {
			$('#alertRicercaLotti').empty().append(alertContent.replace('@@alertText@@','Inserire un lotto').replace('@@alertResult@@', 'danger'));
		}
	});

	$(document).on('click','#resetRicercaLottiButton', function(){
		$('#ricercaLottiForm :input').val(null);

		$('#ricercaLottiDdtTitle').addClass('d-none');
		$('#ricercaLottiDdtAcquistoTitle').addClass('d-none');
		$('#ricercaLottiProduzioneTitle').addClass('d-none');

		$('.custom-divider').addClass('d-none');

		var tableContent = '<table class="table table-bordered" id="@@tableId@@" width="100%" cellspacing="0" style="color: #080707 !important;">\n' +
			'                <thead>\n' +
			'                  <tr style="font-size:12px;">\n' +
			'                  </tr>\n' +
			'                </thead>\n' +
			'              </table>';

		var ricercaLottiDdtTable = $('#ricercaLottiDdtTable');
		if($.fn.DataTable.isDataTable( '#ricercaLottiDdtTable' )){
			ricercaLottiDdtTable.DataTable().destroy(true);
			$(tableContent.replace('@@tableId@@', 'ricercaLottiDdtTable')).insertAfter("#ricercaLottiDdtTitle");
		}
		var ricercaLottiDdtAcquistoTable = $('#ricercaLottiDdtAcquistoTable');
		if($.fn.DataTable.isDataTable( '#ricercaLottiDdtAcquistoTable' )){
			ricercaLottiDdtAcquistoTable.DataTable().destroy(true);
			$(tableContent.replace('@@tableId@@', 'ricercaLottiDdtAcquistoTable')).insertAfter("#ricercaLottiDdtAcquistoTitle");
		}
		var ricercaLottiProduzioneTable = $('#ricercaLottiProduzioneTable');
		if($.fn.DataTable.isDataTable( '#ricercaLottiProduzioneTable' )){
			ricercaLottiProduzioneTable.DataTable().destroy(true);
			$(tableContent.replace('@@tableId@@', 'ricercaLottiProduzioneTable')).insertAfter("#ricercaLottiProduzioneTitle");
		}
	});
});

