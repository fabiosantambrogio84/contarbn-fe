var baseUrl = "/contarbn-be/";

$.fn.loadGiacenzeIngredientiTable = function(url) {
	$('#giacenzeIngredientiTable').DataTable({
		"processing": true,
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertGiacenzaIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle giacenze ingredienti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertGiacenzaIngrediente').empty().append(alertContent);
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
			[1, 'asc'],
			[4, 'asc'],
			[5, 'asc']
		],
		"columns": [
			{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
				var checkboxHtml = '<input type="checkbox" data-id="'+data.idIngrediente+'" id="checkbox_'+data.idIngrediente+'" class="deleteGiacenzaIngredienteCheckbox">';
				return checkboxHtml;
			}},
			{"name": "ingrediente", "data": null, render: function ( data, type, row ) {
				return data.ingrediente;
			}},
			{"name": "udm", "data": null, render: function ( data, type, row ) {
				return data.udm;
			}},
			{"name": "attivo", "data": null, render: function ( data, type, row ) {
				var attivo = data.attivo;
				if(attivo){
					return 'Si';
				} else {
					return 'No';
				}
			}},
			{"name": "fornitore", "data": null, render: function ( data, type, row ) {
				return data.fornitore;
			}},
			{"name": "quantita", "data": "quantita"},
			{"data": null, "orderable":false, "width":"4%", render: function ( data, type, row ) {
				var links = '<a class="detailsGiacenzaIngrediente pr-2" data-id="'+data.idIngrediente+'" href="#"><i class="fas fa-info-circle" title="Dettagli"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
			$(cells[1]).css('text-align','left');
			$(cells[2]).css('text-align','left');
			$(cells[3]).css('text-align','left');
			$(cells[4]).css('text-align','left');
			$(cells[6]).css('font-weight','bold');
			if(data.quantita == 0){
				$(row).css('background-color', '#dedcd7');
			}
		}
	});
}

$(document).ready(function() {

	$.fn.loadGiacenzeIngredientiTable(baseUrl + "giacenze-ingredienti");

	$(document).on('click','#deleteGiacenzeIngredientiBulk', function(){
		$('#deleteGiacenzeIngredientiBulkModal').modal('show');
	});

	$(document).on('click','#confirmDeleteGiacenzeIngredientiBulk', function(){
		$('#deleteGiacenzeIngredientiBulkModal').modal('hide');

		var alertContent = '<div id="alertGiacenzaIngredienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var numChecked = $('.deleteGiacenzaIngredienteCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertGiacenzaIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno una giacenza</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertGiacenzaIngrediente').empty().append(alertContent);
		} else{
			var giacenzeIngredienteIds = [];
			$('.deleteGiacenzaIngredienteCheckbox:checkbox:checked').each(function(i, item) {
				var id = item.id.replace('checkbox_', '');
				giacenzeIngredienteIds.push(id);
			});
			$.ajax({
				url: baseUrl + "giacenze-ingredienti/operations/delete",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: JSON.stringify(giacenzeIngredienteIds),
				success: function(result) {
					$('#alertGiacenzaIngrediente').empty().append(alertContent.replace('@@alertText@@','Giacenze cancellate con successo').replace('@@alertResult@@', 'success'));

					$('#giacenzeIngredientiTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertGiacenzaIngrediente').empty().append(alertContent.replace('@@alertText@@','Errore nella cancellazione delle giacenze').replace('@@alertResult@@', 'danger'));
				}
			});
		}
	});

	$(document).on('click','.detailsGiacenzaIngrediente', function(){
		var idGiacenza = $(this).attr('data-id');

		var alertContent = '<div id="alertGiacenzaIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della giacenza.</strong></div>';

		$.ajax({
			url: baseUrl + "giacenze-ingredienti/" + idGiacenza,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#ingrediente').text(result.ingrediente);
					$('#udm').text(result.udm);
					$('#quantita').text(result.quantita);

					if(result.movimentazioni != null && result.movimentazioni != undefined){
						$('#detailsGiacenzaIngredientiModalTable').DataTable({
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
							}
						});
					}

				} else{
					$('#detailsGiacenzaIngredientiMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsGiacenzaIngredientiMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsGiacenzaIngredientiModal').modal('show');
	});

	$(document).on('click','.closeGiacenzaIngredienti', function(){
		$('#detailsGiacenzaIngredientiModalTable').DataTable().destroy();
		$('#detailsGiacenzaIngredientiModal').modal('hide');
	});

	$(document).on('click','#printGiacenzeIngredienti', function(event){
		event.preventDefault();

		var alertContent = '<div id="alertGiacenzaIngredienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var checkedLength = $(".deleteGiacenzaIngredienteCheckbox:checked").length;

		if(checkedLength != null && checkedLength > 0){
			var ids = "";

			$(".deleteGiacenzaIngredienteCheckbox:checked").each(function(i, item){
				var id = $(this).attr('data-id');
				ids += id+",";
			});

			window.open(baseUrl + "stampe/giacenze-ingredienti?ids="+ids, '_blank');
		} else {
			$('#alertGiacenzaIngrediente').empty().append(alertContent.replace('@@alertText@@','Selezionare almeno una giacenza').replace('@@alertResult@@', 'danger'));
		}

	});

	$(document).on('click','#resetSearchGiacenzaIngredientiButton', function(){
		$('#searchGiacenzaIngredientiForm :input').val(null);
		$('#searchGiacenzaIngredientiForm select option[value=""]').attr('selected', true);

		$('#giacenzeIngredientiTable').DataTable().destroy();
		$.fn.loadGiacenzeIngredientiTable(baseUrl + "giacenze-ingredienti");
	});

	if($('#searchGiacenzaIngredientiButton') != null && $('#searchGiacenzaIngredientiButton') != undefined) {
		$(document).on('submit', '#searchGiacenzaIngredientiForm', function (event) {
			event.preventDefault();

			var ingrediente = $('#searchIngrediente').val();
			var attivo = $('#searchAttivo').val();
			var idFornitore = $('#searchFornitore option:selected').val();
			var lotto = $('#searchLotto').val();
			var scadenza = $('#searchScadenza').val();

			var params = {};
			if(ingrediente != null && ingrediente != undefined && ingrediente != ''){
				params.ingrediente = ingrediente;
			}
			if(attivo != null && attivo != undefined && attivo != ''){
				params.attivo = attivo;
			}
			if(idFornitore != null && idFornitore != undefined && idFornitore != ''){
				params.idFornitore = idFornitore;
			}
			if(lotto != null && lotto != undefined && lotto != ''){
				params.lotto = lotto;
			}
			if(scadenza != null && scadenza != undefined && scadenza != ''){
				params.scadenza = scadenza;
			}
			var url = baseUrl + "giacenze-ingredienti?" + $.param( params );

			$('#giacenzeIngredientiTable').DataTable().destroy();
			$.fn.loadGiacenzeIngredientiTable(url);

		});
	}

	if($('#newGiacenzaIngredienteButton') != null && $('#newGiacenzaIngredienteButton') != undefined){

		$('#ingrediente').selectpicker();

		$(document).on('submit','#newGiacenzaIngredienteForm', function(event){
			event.preventDefault();

			var giacenzaIngrediente = new Object();

			var idIngrediente = $('#ingrediente option:selected').val();
			if(idIngrediente != null && idIngrediente != ''){
			    var ingrediente = new Object();
				ingrediente.id = idIngrediente;
				giacenzaIngrediente.ingrediente = ingrediente;
			}
			giacenzaIngrediente.lotto = $('#lotto').val();
			giacenzaIngrediente.scadenza = $('#scadenza').val();
			giacenzaIngrediente.quantita = $('#quantita').val();

			var giacenzaIngredienteJson = JSON.stringify(giacenzaIngrediente);

			var alertContent = '<div id="alertGiacenzaIngredienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "giacenze-ingredienti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: giacenzaIngredienteJson,
				success: function(result) {
					$('#alertGiacenzaIngrediente').empty().append(alertContent.replace('@@alertText@@','Giacenza creata con successo').replace('@@alertResult@@', 'success'));

					// Returns to giacenze-ingredienti.html
					setTimeout(function() {
						window.location.href = "giacenze-ingredienti.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertGiacenzaIngrediente').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della giacenza').replace('@@alertResult@@', 'danger'));
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
		url: baseUrl + "fornitori?codiceTipo=FORNITORE_INGREDIENTI",
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

$.fn.getIngredienti = function(){
	$.ajax({
		url: baseUrl + "ingredienti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#ingrediente').append('<option value="'+item.id+'">'+item.codice+' '+item.descrizione+'</option>');

					$('#ingrediente').selectpicker('refresh');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
