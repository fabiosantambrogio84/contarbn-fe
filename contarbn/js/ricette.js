var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#ricetteTable').DataTable({
		"ajax": {
			"url": baseUrl + "ricette",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle ricette</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicetta').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca per codice, descrizione, ingrediente",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessuna ricetta disponibile",
			"zeroRecords": "Nessuna ricetta disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc']
		],
		"columns": [
			{"name": "codice", "data": "codice"},
			{"name": "nome", "data": "nome"},
			{"name": "scadenzaGiorni", "data": "scadenzaGiorni"},
			{"name": "note", "data": "note"},
			{"data": null, "orderable":false, "width":"12%", render: function ( data, type, row ) {
				var links = '<a class="detailsRicetta pr-1" data-id="'+data.id+'" href="#" title="Dettagli"><i class="fas fa-info-circle"></i></a>'
				links += '<a class="updateRicetta pr-1" data-id="'+data.id+'" href="ricette-edit.html?idRicetta=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
				links += '<a class="printRicetta pr-1" data-id="'+data.id+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
				links += '<a class="deleteRicetta pr-1" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt" title="Elimina"></i></a>';
				links += '<a href="produzioni-new.html?idRicetta='+data.id+'" title="Nuova produzione"><i class="fas fa-atom"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.detailsRicetta', function(){
		var idRicetta = $(this).attr('data-id');

		var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della ricetta.</strong></div>';

		$.ajax({
			url: baseUrl + "ricette/" + idRicetta,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					$('#codice').text(result.codice);
					$('#nome').text(result.nome);
					var categoria = result.categoria;
					if(categoria != null && categoria != undefined && categoria != ""){
						$('#categoria').text(categoria.nome);
					}
					$('#tempoPreparazione').text(result.tempoPreparazione);
					$('#pesoTotale').text(result.pesoTotale);
					$('#scadenzaGiorni').text(result.scadenzaGiorni);
					$('#costoIngredienti').text(result.costoIngredienti);
					$('#costoPreparazione').text(result.costoPreparazione);
					$('#costoTotale').text(result.costoTotale);
					$('#preparazione').text(result.preparazione);
					$('#allergeni').text(result.allergeni);
					$('#valoriNutrizionali').text(result.valoriNutrizionali);
					$('#conservazione').text(result.conservazione);
					$('#note').text(result.note);

					if(result.ricettaIngredienti != null && result.ricettaIngredienti != undefined){
						$('#detailsRicettaIngredientiModalTable').DataTable({
							"data": result.ricettaIngredienti,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun ingrediente presente",
								"zeroRecords": "Nessun ingrediente presente"
							},
							"pageLength": 20,
							"lengthChange": false,
							"info": false,
							"order": [
								[1, 'desc'],
								[2, 'desc'],
								[0, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "ingrediente", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.ingrediente != null) {
										result = data.ingrediente.codice+' - '+data.ingrediente.descrizione;
									}
									return result;
								}},
								{"name": "quantita", "data": "quantita"},
								{"name": "percentuale", "data": "percentuale"}
							]
						});
					}

				} else{
					$('#detailsRicettaMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsRicettaMainDiv').empty().append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		})

		$('#detailsRicettaModal').modal('show');
	});

	$(document).on('click','.closeRicetta', function(){
		$('#detailsRicettaIngredientiModalTable').DataTable().destroy();
		$('#detailsRicettaModal').modal('hide');
	});

	$(document).on('click','.deleteRicetta', function(){
		var idRicetta = $(this).attr('data-id');
		$('#confirmDeleteRicetta').attr('data-id', idRicetta);
		$('#deleteRicettaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteRicetta', function(){
		$('#deleteRicettaModal').modal('hide');
		var idRicetta = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "ricette/" + idRicetta,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertRicettaContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Ricetta</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertRicetta').empty().append(alertContent);

				$('#ricetteTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateRicettaButton') != null && $('#updateRicettaButton') != undefined){
		$(document).on('submit','#updateRicettaForm', function(event){
			event.preventDefault();

			var ricetta = new Object();
			ricetta.id = $('#hiddenIdRicetta').val();
			ricetta.codice = $('#codiceRicetta').val();
			ricetta.nome = $('#nome').val();
			var categoria = new Object();
			categoria.id = $('#categoria option:selected').val();
			ricetta.categoria = categoria;
			ricetta.tempoPreparazione = $('#tempoPreparazione').val();
			ricetta.pesoTotale = $('#pesoTotale').val();
			ricetta.scadenzaGiorni = $('#scadenzaGiorni').val();
			ricetta.costoIngredienti = $('#costoIngredienti').val();
			ricetta.costoPreparazione = $('#costoPreparazione').val();
			ricetta.costoTotale = $('#costoTotale').val();
			var ingredientiLength = $('.formRowIngrediente').length;
			if(ingredientiLength != null && ingredientiLength != undefined && ingredientiLength != 0){
				var ricettaIngredienti = [];
				$('.formRowIngrediente').each(function(i, item){
					var ricettaIngrediente = {};
					var ricettaIngredienteId = new Object();
					var ingredienteId = item.id.replace('formRowIngrediente_','');
					ricettaIngredienteId.ingredienteId = ingredienteId;
					ricettaIngrediente.id = ricettaIngredienteId;
					ricettaIngrediente.quantita = $('#quantitaIngrediente_'+ingredienteId).val();

					ricettaIngredienti.push(ricettaIngrediente);
				});
				ricetta.ricettaIngredienti = ricettaIngredienti;
			}
			ricetta.preparazione = $('#preparazione').val();
			ricetta.allergeni = $('#allergeni').val();
			ricetta.valoriNutrizionali = $('#valoriNutrizionali').val();
			ricetta.conservazione = $('#conservazione').val();
			ricetta.note = $('#note').val();

			var ricettaJson = JSON.stringify(ricetta);

			var alertContent = '<div id="alertRicettaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ricette/" + $('#hiddenIdRicetta').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ricettaJson,
				success: function(result) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Ricetta modificata con successo').replace('@@alertResult@@', 'success'));

					// Returns to the page with the list of ricette
					setTimeout(function() {
						window.location.href = "ricette.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della ricetta').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newRicettaButton') != null && $('#newRicettaButton') != undefined){
		$(document).on('submit','#newRicettaForm', function(event){
			event.preventDefault();

			var ricetta = new Object();
			ricetta.codice = $('#codiceRicetta').val();
			ricetta.nome = $('#nome').val();
			var categoria = new Object();
			categoria.id = $('#categoria option:selected').val();
			ricetta.categoria = categoria;
			ricetta.tempoPreparazione = $('#tempoPreparazione').val();
			ricetta.pesoTotale = $('#pesoTotale').val();
			ricetta.scadenzaGiorni = $('#scadenzaGiorni').val();
			ricetta.costoIngredienti = $('#costoIngredienti').val();
			ricetta.costoPreparazione = $('#costoPreparazione').val();
			ricetta.costoTotale = $('#costoTotale').val();
			var ingredientiLength = $('.formRowIngrediente').length;
			if(ingredientiLength != null && ingredientiLength != undefined && ingredientiLength != 0){
				var ricettaIngredienti = [];
				$('.formRowIngrediente').each(function(i, item){
					var ricettaIngrediente = {};
					var ricettaIngredienteId = new Object();
					var ingredienteId = item.id.replace('formRowIngrediente_','');
					ricettaIngredienteId.ingredienteId = ingredienteId;
					ricettaIngrediente.id = ricettaIngredienteId;
					ricettaIngrediente.quantita = $('#quantitaIngrediente_'+ingredienteId).val();

					ricettaIngredienti.push(ricettaIngrediente);
				});
				ricetta.ricettaIngredienti = ricettaIngredienti;
			}
			ricetta.preparazione = $('#preparazione').val();
			ricetta.allergeni = $('#allergeni').val();
			ricetta.valoriNutrizionali = $('#valoriNutrizionali').val();
			ricetta.conservazione = $('#conservazione').val();
			ricetta.note = $('#note').val();

			var ricettaJson = JSON.stringify(ricetta);

			var alertContent = '<div id="alertRicettaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ricette",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ricettaJson,
				success: function(result) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Ricetta creata con successo').replace('@@alertResult@@', 'success'));

					// Returns to the page with the list of ricette
					setTimeout(function() {
						window.location.href = "ricette.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertRicetta').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della ricetta').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('click','#addIngrediente', function(){
		$('#addIngredienteModal').modal('show');

		$('#addIngredienteModalTable').DataTable({
			"ajax": {
				"url": baseUrl + "ingredienti",
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "",
				"error": function(jqXHR, textStatus, errorThrown) {
					var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Errore nel recupero degli ingredienti</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertRicettaAddIngrediente').empty().append(alertContent);
				}
			},
			"language": {
				"search": "Cerca",
				"emptyTable": "Nessun ingrediente disponibile",
				"zeroRecords": "Nessun ingrediente disponibile"
			},
			"paging": false,
			"lengthChange": false,
			"info": false,
			"order": [
				[1,'asc']
			],
			"autoWidth": false,
			"columns": [
				{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
					var checkboxHtml = '<input type="checkbox" data-id="'+data.id+'" data-codice="'+data.codice+'" data-descrizione="'+data.descrizione+'" ' +
						'data-prezzo="'+data.prezzo+'" id="checkbox_'+data.id+'" class="addIngredienteCheckbox">';
					return checkboxHtml;
				}},
				{"name": "codice", "data": "codice"},
				{"name": "descrizione", "data": "descrizione"},
				{"name": "prezzo", "data": "prezzo"}
			]
		});
	});

	$(document).on('click','#confirmAddIngredienteModal', function(){
		var numChecked = $('.addIngredienteCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertRicettaAddIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno un ingrediente</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertRicettaAddIngrediente').empty().append(alertContent);
		} else{
			var alreadyAddedRows = $('.formRowIngrediente').length;
			if(alreadyAddedRows == null || alreadyAddedRows == undefined){
				alreadyAddedRows = 0;
			}
			if(alreadyAddedRows != 0){
				var rowsIdPresent = [];
				$('.formRowIngrediente').each(function(i,item){
					var itemId = item.id;
					rowsIdPresent.push(itemId.replace('formRowIngrediente_',''));
				});
			}
			$('.addIngredienteCheckbox:checkbox:checked').each(function(i, item){
				var id = item.id.replace('checkbox_','');
				var codice = $('#'+item.id).attr('data-codice');

				if($.inArray(id, rowsIdPresent) != -1){
					var alertContent = '<div id="alertRicettaAddIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>L\' ingrediente '+codice+' &egrave; gi&agrave; stato selezionato</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertRicettaAddIngrediente').empty().append(alertContent);
				} else{
					var descrizione = $('#'+item.id).attr('data-descrizione');
					var prezzo = $('#'+item.id).attr('data-prezzo');

					var rowHtml = '<div class="form-row formRowIngrediente" data-id="'+id+'" id="formRowIngrediente_'+id+'">' +
						'<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="codiceIngrediente">Codice</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceIngrediente_'+id+'" disabled value="'+codice+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-4">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="descrizioneIngrediente">Descrizione</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneIngrediente_'+id+'" disabled value="'+descrizione+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="prezzoIngrediente">Prezzo (&euro;)</label>';
					}
					rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoIngrediente_'+id+'" disabled value="'+prezzo+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita (Kg)</label>';
					}
					rowHtml = rowHtml + '<div class="input-group">';
					rowHtml = rowHtml + '<input type="number" class="form-control quantitaIngrediente" id="quantitaIngrediente_'+id+'" step=".01" min="0" onchange="$.fn.computeCostoIngredienti(this);">';
					rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddIngrediente" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
					rowHtml = rowHtml + '</div></div></div>';
					rowHtml = rowHtml + '</div>';

					$('#formRowIngredienti').append(rowHtml);

					$('#addIngredienteModalTable').DataTable().destroy();
					$('#alertRicettaAddIngredienteContent').alert('close');
					$('#addIngredienteModal').modal('hide');
				}
			});
		}
	});

	$(document).on('click','.annullaAddIngredienteModal', function(){
		$('#addIngredienteModalTable').DataTable().destroy();
		$('#alertRicettaAddIngredienteContent').alert('close');
		$('#addIngredienteModal').modal('hide');
	});

	$(document).on('click','.deleteAddIngrediente', function(){
		var firstId = $('.formRowIngrediente').first().attr('data-id');
		if(firstId == null || firstId == undefined){
			firstId = -1;
		}
		var id = $(this).attr('data-id');
		$('#formRowIngrediente_'+id).remove();
		if(id == firstId){
			var firstRow = $('.formRowIngrediente').first();
			if(firstRow != null && firstRow != undefined && firstRow.length != 0){
				$('#'+firstRow.attr('id')).find('input').each(function(i, item){
					var id = item.id;
					var label = '';
					if(id.indexOf('codice') != '-1'){
						label = '<label for="codiceIngrediente">Codice</label>';
					} else if(id.indexOf('descrizione') != '-1'){
						label = '<label for="descrizioneIngrediente">Descrizione</label>';
					} else if(id.indexOf('prezzo') != '-1'){
						label = '<label for="prezzoIngrediente">Prezzo (&euro;)</label>';
					} else{
						label = '<label for="quantitaIngrediente">Quantita (Kg)</label>';
					}
					if(id.indexOf('quantita') != '-1'){
						$('#'+id).parent().before(label);
					} else {
						$('#'+id).before(label);
					}
				});
			}
		}
		$.fn.computeCostoIngredienti();
	});

	if($('#tempoPreparazione') != null && $('#tempoPreparazione') != undefined){
        $(document).on('change','#tempoPreparazione', function(){
			$.fn.computeCostoTotale($('#costoIngredienti').val(), $.fn.computeCostoPreparazione());
        });
    }

});

$.fn.getCategorieRicette = function(){
	$.ajax({
		url: baseUrl + "categorie-ricette",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#categoria').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getRicette = function(field){
	$.ajax({
		url: baseUrl + "ricette",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					//if(i == 0){
					//	$('#categoria option[value="' + item.categoria.id +'"]').attr('selected', true);
					//}
					$('#'+field).append('<option value="'+item.id+'" data-id-categoria="'+item.categoria.id+'" data-num-giorni-scadenza="'+item.scadenzaGiorni+'" data-codice="'+item.codice+'">'+item.codice+' - '+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdRicettaFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idRicetta') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getCostoOrarioPreparazione = function(){
	$.ajax({
		url: baseUrl + "configurazione/parametri?nome=COSTO_ORARIO_PREPARAZIONE_RICETTA",
		type: 'GET',
		dataType: 'json',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + btoa("admin:admin")
		},
		success: function(result) {
			$('#costoOrarioPreparazione').val(result.valore);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getRicetta = function(idRicetta){

	var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero della ricetta.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    // load categorie ricette
	$.fn.getCategorieRicette();

	// load costo orario preparazione
	$.fn.getCostoOrarioPreparazione();

	$.ajax({
        url: baseUrl + "ricette/" + idRicetta,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdRicetta').attr('value', result.id);
			$('#codiceRicetta').attr('value', result.codice);
			$('#nome').attr('value', result.nome);
			if(result.categoria != null && result.categoria != undefined){
				$('#categoria option[value="' + result.categoria.id +'"]').attr('selected', true);
			}
			$('#tempoPreparazione').attr('value', result.tempoPreparazione);
			$('#pesoTotale').attr('value', result.pesoTotale);
			$('#scadenzaGiorni').attr('value', result.scadenzaGiorni);
			$('#costoIngredienti').attr('value', result.costoIngredienti);
			$('#costoPreparazione').attr('value', result.costoPreparazione);
			$('#costoTotale').attr('value', result.costoTotale);
			$('#preparazione').val(result.preparazione);
			$('#allergeni').val(result.allergeni);
			$('#valoriNutrizionali').val(result.valoriNutrizionali);
			$('#conservazione').val(result.conservazione);
			$('#note').val(result.note);

			if(result.ricettaIngredienti != null && result.ricettaIngredienti != undefined && result.ricettaIngredienti.length != 0){

				var ricettaIngredienti = result.ricettaIngredienti;
				ricettaIngredienti.sort(function(a,b){
					var quantita1 = a.quantita;
					var quantita2 = b.quantita;
					return ((quantita1 > quantita2) ? -1 : ((quantita1 < quantita2) ? 1 : 0));
				});

				ricettaIngredienti.forEach(function(item, i){
					var id = item.id.ingredienteId;
					var codice = item.ingrediente.codice;
					var descrizione = item.ingrediente.descrizione;
					var prezzo = item.ingrediente.prezzo;
					var quantita = item.quantita;

					var rowHtml = '<div class="form-row formRowIngrediente" data-id="'+id+'" id="formRowIngrediente_'+id+'">' +
						'<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="codiceIngrediente">Codice</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceIngrediente_'+id+'" disabled value="'+codice+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-4">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="descrizioneIngrediente">Descrizione</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneIngrediente_'+id+'" disabled value="'+descrizione+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="prezzoIngrediente">Prezzo (&euro;)</label>';
					}
					rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoIngrediente_'+id+'" disabled value="'+prezzo+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="quantitaIngrediente">Quantita (Kg)</label>';
					}
					rowHtml = rowHtml + '<div class="input-group">';
					rowHtml = rowHtml + '<input type="number" class="form-control quantitaIngrediente" id="quantitaIngrediente_'+id+'" step=".01" min="0" value="'+quantita+'" onchange="$.fn.computeCostoIngredienti(this);">';
					rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddIngrediente" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
					rowHtml = rowHtml + '</div></div></div>';
					rowHtml = rowHtml + '</div>';

					$('#formRowIngredienti').append(rowHtml);
				});
			}
          } else{
            $('#alertRicetta').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertRicetta').append(alertContent);
            $('#updateRicettaButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$.fn.computeCostoPreparazione = function(){
    var tempoPreparazione = $('#tempoPreparazione').val();
    var costoPreparazione;
    if(tempoPreparazione != null && tempoPreparazione != undefined && tempoPreparazione != ""){

        var costoOrarioPreparazione = $('#costoOrarioPreparazione').val();
        if(costoOrarioPreparazione != null && costoOrarioPreparazione != undefined && costoOrarioPreparazione.length != 0){
            if(costoOrarioPreparazione.indexOf(',') != "-1"){
                costoOrarioPreparazione = costoOrarioPreparazione.replace(',','.');
            }
            costoOrarioPreparazione = parseFloat(costoOrarioPreparazione);
        } else {
            costoOrarioPreparazione = parseInt(0);
        }
        if(tempoPreparazione.indexOf(',') != "-1"){
            tempoPreparazione = tempoPreparazione.replace(',','.');
        }
        tempoPreparazione = parseFloat(tempoPreparazione)/60;
        costoPreparazione = parseFloat(costoOrarioPreparazione) * parseFloat(tempoPreparazione);

        $('#costoPreparazione').val(costoPreparazione);

    } else {
        $('#costoPreparazione').val(null);
    }
    return costoPreparazione;
}

$.fn.computeCostoTotale = function(costoIngredienti, costoPreparazione){
	var costoTotale;
	if(costoIngredienti != null && costoIngredienti != undefined && costoIngredienti != ""){
		costoTotale = parseFloat(costoIngredienti);
	}
	if(costoPreparazione != null && costoPreparazione != undefined){
		if(costoTotale != null && costoTotale != undefined){
			costoTotale = parseFloat(costoTotale) + parseFloat(costoPreparazione);
		} else {
			costoTotale = parseFloat(costoPreparazione);
		}
	}
	$('#costoTotale').val(costoTotale);
}

$.fn.computeCostoIngredienti = function() {
	var costoIngredienti;
	var pesoTotale;
	$('.quantitaIngrediente').each(function(i, item){
		var itemId = item.id;
		var itemIndex = itemId.substring(itemId.indexOf("_") + 1, itemId.length);
		var quantita = $('#'+itemId).val();
		var prezzo = $('#prezzoIngrediente_'+itemIndex).val();
		if(quantita == null || quantita == undefined || quantita == ""){
			quantita = 0;
		} else if(quantita.indexOf(',') != "-1"){
            quantita = quantita.replace(',','.');
        }
		if(prezzo == null || prezzo == undefined || prezzo == ""){
			prezzo = 0;
		} else if(prezzo.indexOf(',') != "-1"){
		    prezzo = prezzo.replace(',','.');
		}
		var costoIngrediente = parseFloat(quantita) * parseFloat(prezzo);
		if(costoIngredienti != null && costoIngredienti != undefined && costoIngredienti != ""){
			costoIngredienti = parseFloat(costoIngredienti) + parseFloat(costoIngrediente);
		} else{
			costoIngredienti = parseFloat(costoIngrediente);
		}

		if(pesoTotale != null && pesoTotale != undefined && pesoTotale != ""){
			pesoTotale = parseFloat(pesoTotale) + parseFloat(quantita);
		} else{
			pesoTotale = parseFloat(quantita);
		}
	});
	$('#pesoTotale').val(pesoTotale);
	$('#costoIngredienti').val(costoIngredienti);
	$.fn.computeCostoTotale(costoIngredienti, $('#costoPreparazione').val());
}
