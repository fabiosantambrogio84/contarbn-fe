var baseUrl = "/contarbn-be/";
var backgroundColorScaduto = '#f78174';

$.fn.loadGiacenzeTable = function(url) {
	$('#giacenzeTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "data",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertGiacenzaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle giacenze</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertGiacenza').empty().append(alertContent);
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
			"emptyTable": "Nessuna giacenza disponibile",
			"zeroRecords": "Nessuna giacenza disponibile",
			"info": "_TOTAL_ elementi",
			"infoEmpty": "0 elementi"
		},
		"searching": false,
		"responsive":true,
		"pageLength": 20,
		"lengthChange": false,
		"processing": true,
		"serverSide": true,
		"info": true,
		"dom": '<"top"p>rt<"bottom"ip>',
		"order": [
			[1, 'asc'],
			[5, 'asc'],
			[7, 'asc']
		],
		"columns": [
			{"data": null, "orderable":false, "width": "2%", render: function (data) {
				return '<input type="checkbox" data-id="' + data.idArticolo + '" id="checkbox_' + data.idArticolo + '" class="deleteGiacenzaCheckbox">';
			}},
			{"name": "articolo", "data": null, render: function (data) {
				return data.articolo;
			}},
			{"name": "attivo", "data": null, render: function (data) {
				var attivo = data.attivo;
				if(attivo){
					return 'Si';
				} else {
					return 'No';
				}
			}},
			{"name": "fornitore", "data": null, render: function (data) {
				return data.fornitore;
			}},
			{"name": "unita_misura", "data": "unitaMisura"},
			{"name": "quantita_result", "data": "quantitaResult"},
			{"name": "prezzo_acquisto", "data": "prezzoAcquisto"},
			{"name": "totale", "data": "totale"},
			{"name": "prezzo_listino_base", "data": "prezzoListinoBase"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="detailsGiacenza pr-2" data-id="'+data.idArticolo+'" href="#"><i class="fas fa-info-circle" title="Dettagli"></i></a>';
				links += '<a class="editGiacenza pr-1" data-id="'+data.idArticolo+'" href="giacenze-articoli-edit.html?idArticolo=' + data.idArticolo + '" title="Modifica"><i class="far fa-edit"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
			$(cells[1]).css('text-align','left');
			$(cells[2]).css('text-align','left');
			$(cells[3]).css('text-align','left');
			$(cells[4]).css('font-weight','bold');
			if(data.scaduto === 1){
				$(row).css('background-color', backgroundColorScaduto);
			}
		}
	});
}

$(document).ready(function() {

	$.fn.loadGiacenzeTable(baseUrl + "giacenze-articoli/search");

	$(document).on('click','#deleteGiacenzeBulk', function(){
		$('#deleteGiacenzeBulkModal').modal('show');
	});

	$(document).on('click','#confirmDeleteGiacenzeBulk', function(){
		$('#deleteGiacenzeBulkModal').modal('hide');

		var alertContent = '<div id="alertGiacenzaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var numChecked = $('.deleteGiacenzaCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertGiacenzaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno una giacenza</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertGiacenza').empty().append(alertContent);
		} else{
			var idArticoli = [];
			$('.deleteGiacenzaCheckbox:checkbox:checked').each(function(i, item) {
				var id = item.id.replace('checkbox_', '');
				idArticoli.push(id);
			});
			$.ajax({
				url: baseUrl + "giacenze-articoli/operations/delete",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: JSON.stringify(idArticoli),
				success: function(result) {
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@','Giacenze cancellate con successo').replace('@@alertResult@@', 'success'));

					$('#giacenzeTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@','Errore nella cancellazione delle giacenze').replace('@@alertResult@@', 'danger'));
				}
			});
		}
	});

	$(document).on('click','.detailsGiacenza', function(){
		var idArticolo = $(this).attr('data-id');

		var alertContent = '<div id="alertGiacenzaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent += '<strong>Errore nel recupero della giacenza.</strong></div>';

		$.ajax({
			url: baseUrl + "giacenze-articoli/" + idArticolo,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#articolo').text(result.articolo);
					$('#unitaMisura').text(result.unitaMisura);
					$('#pezzi').text(result.pezzi);
					$('#quantita').text(result.quantita);

					if(result.movimentazioni != null && result.movimentazioni != undefined){
						$('#detailsGiacenzaModalTable').DataTable({
							"retrieve": true,
							"data": result.movimentazioni,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessuna movimentazione presente",
								"zeroRecords": "Nessuna movimentazione presente"
							},
							"pageLength": 100,
							"lengthChange": false,
							"info": false,
							"autoWidth": false,
							"searching": false,
							"order": [
								[0, 'desc']
							],
							"columns": [
								{"name": "data", "data": "data", "visible":false},
								{"name": "movimentazione", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.descrizione != null) {
										if (data.inputOutput != null) {
											if(data.inputOutput == 'INPUT'){
												result = '<span style="color:green;padding-right:5px;"><i class="fas fa-arrow-down"></i></span>';
											} else if(data.inputOutput == 'OUTPUT'){
												result = '<span style="color:red;padding-right:5px;"><i class="fas fa-arrow-up"></i></span>';
											}
										}
										result += data.descrizione;
									}
									return result;
								}}
							],
							"createdRow": function(row, data, dataIndex,cells){
								$(row).css('text-align', 'center');
								/*
								if(data.inputOutput != null){
									var backgroundColor = '';
									if(data.inputOutput == 'INPUT'){
										backgroundColor = 'green';
									} else if(data.inputOutput == 'OUTPUT'){
										backgroundColor = 'red';
									} else {
										backgroundColor = 'trasparent';
									}
									$(row).css('background-color', backgroundColor);
								}
								*/
							}
						});
					}

				} else{
					$('#detailsGiacenzaMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsGiacenzaMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsGiacenzaModal').modal('show');
	});

	$(document).on('click','.closeGiacenza', function(){
		$('#detailsGiacenzaModalTable').DataTable().destroy();
		$('#detailsGiacenzaModal').modal('hide');
	});

	$(document).on('click','#resetSearchGiacenzaButton', function(){
		$('#searchGiacenzaForm :input').val(null);
		$('#searchGiacenzaForm select option[value=""]').attr('selected', true);

		$('#giacenzeTable').DataTable().destroy();
		$.fn.loadGiacenzeTable(baseUrl + "giacenze-articoli/search");
	});

	if($('#searchGiacenzaButton') != null && $('#searchGiacenzaButton') != undefined) {
		$(document).on('submit', '#searchGiacenzaForm', function (event) {
			event.preventDefault();

			var articolo = $('#searchArticolo').val();
			var attivo = $('#searchAttivo').val();
			var idFornitore = $('#searchFornitore option:selected').val();
			var lotto = $('#searchLotto').val();
			var scadenza = $('#searchScadenza').val();
			var scaduto = $('#searchScaduto').val();

			var params = {};
			if(articolo != null && articolo !== ''){
				params.articolo = articolo;
			}
			if(attivo != null && attivo !== ''){
				params.attivo = attivo;
			}
			if(idFornitore != null && idFornitore !== ''){
				params.idFornitore = idFornitore;
			}
			if(lotto != null && lotto !== ''){
				params.lotto = lotto;
			}
			if(scadenza != null && scadenza !== ''){
				params.scadenza = scadenza;
			}
			if(scaduto != null && scaduto !== ''){
				params.scaduto = scaduto;
			}
			var url = baseUrl + "giacenze-articoli/search?" + $.param( params );

			$('#giacenzeTable').DataTable().destroy();
			$.fn.loadGiacenzeTable(url);

		});
	}

	if($('#newGiacenzaButton') != null && $('#newGiacenzaButton') != undefined){

		$('#articolo').selectpicker();

		$(document).on('submit','#newGiacenzaForm', function(event){
			event.preventDefault();

			var giacenza = new Object();

			var idArticolo = $('#articolo option:selected').val();
			if(idArticolo != null && idArticolo != ''){
			    var articolo = new Object();
                articolo.id = idArticolo;
				giacenza.articolo = articolo;
			}
			giacenza.lotto = $('#lotto').val();
			giacenza.scadenza = $('#scadenza').val();
			giacenza.pezzi = $('#pezzi').val();
			giacenza.quantita = $('#quantita').val();

			var giacenzaJson = JSON.stringify(giacenza);

			var alertContent = '<div id="alertGiacenzaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "giacenze-articoli",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: giacenzaJson,
				success: function(result) {
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@','Giacenza creata con successo').replace('@@alertResult@@', 'success'));

					// Returns to giacenze-articoli.html
					setTimeout(function() {
						window.location.href = "giacenze-articoli.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della giacenza').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#updateGiacenzaButton') != null && $('#updateGiacenzaButton') != undefined){
		$(document).on('submit','#updateGiacenzaForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertGiacenzaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var giacenzaArticoliTable = $('#updateGiacenzaTable').DataTable();

			var giacenzaArticoliLength = giacenzaArticoliTable.rows().nodes().length;
			if(giacenzaArticoliLength != null && giacenzaArticoliLength != undefined && giacenzaArticoliLength != 0){
				var giacenzeArticoli = [];
				giacenzaArticoliTable.rows().nodes().each(function(i, item){
					var id = $(i).attr('data-id');
					var idArticolo = $(i).attr('data-id-articolo');
					var dataInserimento = $(i).attr('data-data-inserimento');
					var lotto = $(i).children().eq(0).text();
					var scadenza = null;
					var scadenzaString = $(i).children().eq(1).text();
					if(!$.fn.checkVariableIsNull(scadenzaString)){
						scadenza = moment(scadenzaString, 'DD/MM/YYYY').format('YYYY-MM-DD')
					}
					var pezzi = $(i).children().eq(2).children().eq(0).val();
					var quantita = $(i).children().eq(3).children().eq(0).val();

					var giacenza = {};
					giacenza.id = id;
					if(idArticolo != null && idArticolo != ''){
						var articolo = new Object();
						articolo.id = idArticolo;
						giacenza.articolo = articolo;
					}
					giacenza.lotto = lotto;
					giacenza.scadenza = scadenza;
					giacenza.pezzi = pezzi;
					giacenza.quantita = quantita;
					giacenza.dataInserimento = dataInserimento;

					giacenzeArticoli.push(giacenza);
				});
			}

			var giacenzaJson = JSON.stringify(giacenzeArticoli);

			$.ajax({
				url: baseUrl + "giacenze-articoli",
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: giacenzaJson,
				success: function(result) {
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@','Giacenze aggiornate con successo').replace('@@alertResult@@', 'success'));

					$('#updateGiacenzaButton').attr("disabled", true);

					// Returns to the page with the list of Giacenze
					setTimeout(function() {
						window.location.href = "giacenze-articoli.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella modifica della giacenza';
					$('#alertGiacenza').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

});

$.fn.printVariable = function(variable){
	if(variable != null && variable != undefined && variable != ""){
		return variable;
	}
	return "";
}

$.fn.preloadSearchFields = function(){
	$.ajax({
		url: baseUrl + "fornitori?codiceTipo=FORNITORE_ARTICOLI",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchFornitore').append('<option value="'+item.id+'" >'+item.ragioneSociale+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getArticoli = function(){
	$.ajax({
		url: baseUrl + "articoli",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					let label = item.codice+' '+item.descrizione;
					if(item.unitaMisura != null){
						let udm = item.unitaMisura.etichetta;
						if(udm != null){
							label += " ("+udm+")";
						}
					}
					$('#articolo').append('<option value="'+item.id+'">'+label+'</option>');

					$('#articolo').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdArticoloFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idArticolo') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.getArticolo = function(idArticolo){

	var alertContent = '<div id="alertGiacenzaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dell articolo.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "articoli/" + idArticolo,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){

				$('#hiddenIdArticolo').attr('value', result.id);
				$('#articolo').attr('value', result.codice + ' ' + result.descrizione);

			} else{
				$('#alertGiacenza').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertGiacenza').empty().append(alertContent);
			$('#updateGiacenzaButton').attr('disabled', true);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getGiacenzaArticolo = function(idArticolo){

	var alertContent = '<div id="alertGiacenzaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent += '<strong>Errore nel recupero della giacenza articolo.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$('#updateGiacenzaTable').DataTable({
		"processing": true,
		"ajax": {
			"url": baseUrl + 'giacenze-articoli/'+idArticolo+'/list',
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertGiacenzaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent += '<strong>Errore nel recupero della giacenza articolo</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertGiacenza').empty().append(alertContent);
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
			"emptyTable": "Nessuna giacenza disponibile",
			"zeroRecords": "Nessuna giacenza disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc'],
			[1, 'asc']
		],
		"columns": [
			{"name": "lotto", "data": null, "width":"15%", render: function (data) {
				return data.lotto;
			}},
			{"name": "data", "data": null, "width":"8%", render: function (data) {
				if(!$.fn.checkVariableIsNull(data.scadenza)){
					var a = moment(data.scadenza);
					return a.format('DD/MM/YYYY');
				}
				return '';
			}},
			{"name": "pezzi", "data": null, "width":"8%", render: function (data) {
				return '<input type="number" className="form-control form-control-sm text-right" step="1" value="' + data.pezzi + '">';
			}},
			{"name": "quantita", "data": null, "width":"8%", render: function (data) {
				return '<input type="number" className="form-control form-control-sm text-right" step=".01" value="' + data.quantita + '">';
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
			$(row).attr('data-id-articolo', idArticolo);
			$(row).attr('data-id', data.id);
			$(row).attr('data-data-inserimento', data.dataInserimento);
			$(cells[0]).css('text-align','left');
			$(cells[1]).css('text-align','left');
			$(cells[2]).css('text-align','left');
			if(data.scaduto === 1){
				$(row).css('background-color', backgroundColorScaduto);
			}
		}
	});

}