var baseUrl = "/contarbn-be/";

$.fn.loadRicercaLottiIngredientiProduzioniIngredientiTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiIngredientiProduzioniIngredientiTable' )){
		$('#ricercaLottiIngredientiProduzioniIngredientiTable').DataTable().destroy();
	}

	$('#ricercaLottiIngredientiProduzioniIngredientiTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiIngredientiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle produzioni (ingredienti)</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLottiIngredienti').empty().append(alertContent);
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
			{"title":"Lotto", "name": "lotto", "data": "lottoProduzione", "width":"10%"},
			{"title":"Data", "name": "dataProduzione", "data": null, "width":"15%", render: function ( data, type, row ) {
				var a = moment(data.dataProduzione);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Scadenza", "name": "scadenza", "data": null, "width":"10%", render: function ( data, type, row ) {
				var a = moment(data.scadenza);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Lotto ingrediente", "name": "lotto", "data": "lottoIngrediente", "width":"10%"},
			{"title":"Ingrediente", "name": "ingrediente", "data": null, "width":"15%", render: function ( data, type, row ) {
				return data.codiceIngrediente + ' ' + data.descrizioneIngrediente;
			}},
			{"title":"Quantità", "name": "quantita", "data": "quantita", "width":"8%"},
			{"title":"Ricetta", "name": "ricetta", "data": "ricetta", "orderable":false}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiIngredientiProduzioniIngredientiTitle').removeClass('d-none');
		}
	});
}

$.fn.loadRicercaLottiIngredientiProduzioniConfezioniTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiIngredientiProduzioniConfezioniTable' )){
		$('#ricercaLottiIngredientiProduzioniConfezioniTable').DataTable().destroy();
	}

	$('#ricercaLottiIngredientiProduzioniConfezioniTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiIngredientiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle produzioni (confezioni)</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLottiIngredienti').empty().append(alertContent);
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
			{"title":"Codice", "name": "codice", "data": "codiceProduzione", "width":"8%"},
			{"title":"Lotto", "name": "lotto", "data": "lottoProduzione", "width":"10%"},
			{"title":"Data", "name": "dataProduzione", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.dataProduzione);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Scadenza", "name": "scadenza", "data": null, "width":"10%", render: function ( data, type, row ) {
				var a = moment(data.scadenza);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Lotto confezione", "name": "lotto", "data": "lottoConfezione", "width":"10%"},
			{"title":"Lotto film chiusura", "name": "lotto", "data": "lottoFilmChiusura", "width":"15%"},
			{"title":"Confezione", "name": "tipoConfezione", "data": "tipoConfezione", "width":"10%"},
			{"title":"Quantità", "name": "quantita", "data": "quantita", "width":"8%"},
			{"title":"Ricetta", "name": "ricetta", "data": "ricetta", "orderable":false}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiIngredientiProduzioniConfezioniTitle').removeClass('d-none');
		}
	});
}

$.fn.loadRicercaLottiIngredientiDocumentiAcquistoTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiIngredientiDocumentiAcquistoTable' )){
		$('#ricercaLottiIngredientiDocumentiAcquistoTable').DataTable().destroy();
	}

	$('#ricercaLottiIngredientiDocumentiAcquistoTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiIngredientiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei documenti acquisto</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLottiIngredienti').empty().append(alertContent);
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
			"emptyTable": "Nessun documento disponibile",
			"zeroRecords": "Nessun documento disponibile"
		},
		"searching": true,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc'],
			[2, 'desc'],
			[1, 'desc']
		],
		"columns": [
			{"title":"Tipo", "name": "tipo", "data": "tipoDocumento", "width":"5%"},
			{"title":"Numero", "name": "numero", "data": "numDocumento", "width":"5%"},
			{"title":"Data", "name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.dataDocumento);
				return a.format('DD/MM/YYYY');
			}},
			{"title":"Fornitore", "name": "fornitore", "data": "ragioneSocialeFornitore", "width":"15%"}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiIngredientiDocumentiAcquistoTitle').removeClass('d-none');
		}
	});
}

$.fn.loadRicercaLottiIngredientiDocumentiVenditaTable = function(url) {
	if($.fn.DataTable.isDataTable( '#ricercaLottiIngredientiDocumentiVenditaTable' )){
		$('#ricercaLottiIngredientiDocumentiVenditaTable').DataTable().destroy();
	}

	$('#ricercaLottiIngredientiDocumentiVenditaTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicercaLottiIngredientiContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei documenti vendita</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicercaLottiIngredienti').empty().append(alertContent);
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
			"emptyTable": "Nessun documento disponibile",
			"zeroRecords": "Nessun documento disponibile"
		},
		"searching": true,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc'],
			[2, 'desc'],
			[1, 'desc']
		],
		"columns": [
			{"title":"Tipo", "name": "tipo", "data": "tipoDocumento", "width":"5%"},
			{"title":"Numero", "name": "numero", "data": "numDocumento", "width":"5%"},
			{"title":"Data", "name": "data", "data": null, "width":"8%", render: function ( data, type, row ) {
				var a = moment(data.dataDocumento);
				return a.format('DD/MM/YYYY');
			}}
		],
		"initComplete": function( settings, json ) {
			$('#ricercaLottiIngredientiDocumentiVenditaTitle').removeClass('d-none');
		}
	});
}

$(document).ready(function() {

	$(document).on('submit','#ricercaLottiIngredientiForm', function(event){
		event.preventDefault();

		var alertContent = '<div id="alertRicercaLottiIngredientiContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var lotto = $('#lotto').val();

		if(lotto != null && lotto != undefined && lotto != ''){
			$('#alertRicercaLottiIngredienti').empty().append(alertContent.replace('@@alertText@@','Ricerca lotto in corso...').replace('@@alertResult@@', 'warning'));

			var ricercaLottiIngredientiProduzioniIngredientiUrl = baseUrl + "search-lotto-ingredienti/produzioni-ingredienti?lotto="+lotto;
			var ricercaLottiIngredientiProduzioniConfezioniUrl = baseUrl + "search-lotto-ingredienti/produzioni-confezioni?lotto="+lotto;
			var ricercaLottiIngredientiDocumentiVenditaUrl = baseUrl + "search-lotto-ingredienti/documenti-vendite?lotto="+lotto;
			var ricercaLottiIngredientiDocumentiAcquistoUrl = baseUrl + "search-lotto-ingredienti/documenti-acquisti?lotto="+lotto;

			$.when($.fn.loadRicercaLottiIngredientiProduzioniIngredientiTable(ricercaLottiIngredientiProduzioniIngredientiUrl),
				$.fn.loadRicercaLottiIngredientiProduzioniConfezioniTable(ricercaLottiIngredientiProduzioniConfezioniUrl),
				$.fn.loadRicercaLottiIngredientiDocumentiVenditaTable(ricercaLottiIngredientiDocumentiVenditaUrl),
				$.fn.loadRicercaLottiIngredientiDocumentiAcquistoTable(ricercaLottiIngredientiDocumentiAcquistoUrl)).then(function(f1,f2,f3,f4){
				$('#alertRicercaLottiIngredienti').empty();
				$('.custom-divider').removeClass('d-none');
			});

		} else {
			$('#alertRicercaLottiIngredienti').empty().append(alertContent.replace('@@alertText@@','Inserire un lotto').replace('@@alertResult@@', 'danger'));
		}
	});

	$(document).on('click','#resetRicercaLottiIngredientiButton', function(){
		$('#ricercaLottiIngredientiForm :input').val(null);

		$('#ricercaLottiIngredientiProduzioniIngredientiTitle').addClass('d-none');
		$('#ricercaLottiIngredientiProduzioniConfezioniTitle').addClass('d-none');
		$('#ricercaLottiIngredientiDocumentiVenditaTitle').addClass('d-none');
		$('#ricercaLottiIngredientiDocumentiAcquistoTitle').addClass('d-none');

		$('.custom-divider').addClass('d-none');

		var tableContent = '<table class="table table-bordered" id="@@tableId@@" width="100%" cellspacing="0" style="color: #080707 !important;">\n' +
			'                <thead>\n' +
			'                  <tr style="font-size:12px;">\n' +
			'                  </tr>\n' +
			'                </thead>\n' +
			'              </table>';

		var ricercaLottiIngredientiProduzioniIngredientiTable = $('#ricercaLottiIngredientiProduzioniIngredientiTable');
		if($.fn.DataTable.isDataTable( '#ricercaLottiIngredientiProduzioniIngredientiTable' )){
			ricercaLottiIngredientiProduzioniIngredientiTable.DataTable().destroy(true);
			$(tableContent.replace('@@tableId@@', 'ricercaLottiIngredientiProduzioniIngredientiTable')).insertAfter("#ricercaLottiIngredientiProduzioniIngredientiTitle");
		}
		var ricercaLottiIngredientiProduzioniConfezioniTable = $('#ricercaLottiIngredientiProduzioniConfezioniTable');
		if($.fn.DataTable.isDataTable( '#ricercaLottiIngredientiProduzioniConfezioniTable' )){
			ricercaLottiIngredientiProduzioniConfezioniTable.DataTable().destroy(true);
			$(tableContent.replace('@@tableId@@', 'ricercaLottiIngredientiProduzioniConfezioniTable')).insertAfter("#ricercaLottiIngredientiProduzioniConfezioniTitle");
		}
		var ricercaLottiIngredientiDocumentiVenditaTable = $('#ricercaLottiIngredientiDocumentiVenditaTable');
		if($.fn.DataTable.isDataTable( '#ricercaLottiIngredientiDocumentiVenditaTable' )){
			ricercaLottiIngredientiDocumentiVenditaTable.DataTable().destroy(true);
			$(tableContent.replace('@@tableId@@', 'ricercaLottiIngredientiDocumentiVenditaTable')).insertAfter("#ricercaLottiIngredientiDocumentiVenditaTitle");
		}
		var ricercaLottiIngredientiDocumentiAcquistoTable = $('#ricercaLottiIngredientiDocumentiAcquistoTable');
		if($.fn.DataTable.isDataTable( '#ricercaLottiIngredientiDocumentiAcquistoTable' )){
			ricercaLottiIngredientiDocumentiAcquistoTable.DataTable().destroy(true);
			$(tableContent.replace('@@tableId@@', 'ricercaLottiIngredientiDocumentiAcquistoTable')).insertAfter("#ricercaLottiIngredientiDocumentiAcquistoTitle");
		}
	});
});

