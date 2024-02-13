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
				if(result != null && result !== '') {
					$('#codice').text(result.codice);
					$('#nome').text(result.nome);
					var categoria = result.categoria;
					if(categoria != null && categoria !== ""){
						$('#categoria').text(categoria.nome);
					}
					$('#tempoPreparazione').text(result.tempoPreparazione);
					$('#pesoTotale').text(result.pesoTotale);
					$('#scadenzaGiorni').text(result.scadenzaGiorni);
					$('#costoIngredienti').text(result.costoIngredienti);
					$('#costoPreparazione').text(result.costoPreparazione);
					$('#costoTotale').text(result.costoTotale);
					$('#preparazione').text(result.preparazione);
					//$('#allergeni').text(result.allergeni);
					$('#conservazione').text(result.conservazione);
					$('#consigliConsumo').text(result.consigliConsumo);
					$('#note').text(result.note);

					if(result.ricettaIngredienti != null){
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

					if(result.ricettaAllergeni != null){
						var allergeni = [];
						$.each(result.ricettaAllergeni, function(i, item){
							allergeni.push(item.allergene);
						})
						if(allergeni.length > 0){
							allergeni.sort($.fn.compareByOrdine);
							const allergeniNomi = allergeni.map(item => {
								return item.nome;
							})
							$('#tracce').text(allergeniNomi.join(';'));
						}
					}

					if(result.ricettaNutrienti != null){
						var nutrienti = [];
						$.each(result.ricettaNutrienti, function(i, item){
							let nutriente = item.nutriente;
							nutriente.valore = item.valore;
							nutrienti.push(nutriente);
						})
						if(nutrienti.length > 0){
							nutrienti.sort($.fn.compareByOrdine);
							const nutrientiLabels = nutrienti.map(item => {
								return item.nome + ' ' +item.valore;
							})
							$('#valoriNutrizionali').text(nutrientiLabels.join(';'));
						}
					}

					if(result.ricettaAnalisi != null){
						var analisi = [];
						$.each(result.ricettaAnalisi, function(i, item){
							let a = item.analisi;
							a.risultato = item.risultato;
							analisi.push(a);
						})
						if(analisi.length > 0){
							analisi.sort($.fn.compareByOrdine);
							const analisiLabels = analisi.map(item => {
								return item.nome + ' ' +item.risultato;
							})
							$('#informazioniMicrobiologiche').text(analisiLabels.join(';'));
						}
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

	$(document).on('click','#addIngrediente', function(){
		$('#addIngredienteModal').modal('show');

		$('#addIngredienteModalTable').DataTable({
			"ajax": {
				"url": baseUrl + "ingredienti/search",
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "data",
				"error": function(jqXHR, textStatus, errorThrown) {
					var alertContent = '<div id="alertRicettaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent += '<strong>Errore nel recupero degli ingredienti</strong>\n' +
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

	$(document).on('click','.addDichiarazioneNutrizionale', function(event){
		event.preventDefault();

		var dichiarazioneNutrizionaleRow = $(this).parent().parent().parent().parent();
		var newDichiarazioneNutrizionaleRow = $.fn.cloneRowDichiarazioneNutrizionale(dichiarazioneNutrizionaleRow);

		newDichiarazioneNutrizionaleRow.find('.dichiarazioneNutrizionaleNutriente').focus();
	});

	$(document).on('click','.removeDichiarazioneNutrizionale', function(event){
		event.preventDefault();
		$(this).parent().parent().parent().remove();
	});

	$(document).on('click','.addAnalisi', function(event){
		event.preventDefault();

		var analisiRow = $(this).parent().parent().parent().parent();
		var newAnalisiRow = $.fn.cloneRowAnalisi(analisiRow);

		newAnalisiRow.find('.analisiAnalisi').focus();
	});

	$(document).on('click','.removeAnalisi', function(event){
		event.preventDefault();
		$(this).parent().parent().parent().remove();
	});

	if($('#tempoPreparazione') != null && $('#tempoPreparazione') !== undefined){
        $(document).on('change','#tempoPreparazione', function(){
			$.fn.computeCostoTotale($('#costoIngredienti').val(), $.fn.computeCostoPreparazione());
        });
    }

	if($('#newRicettaButton') != null && $('#newRicettaButton') !== undefined){

		$('#tracce').selectpicker();

		$(document).on('submit','#newRicettaForm', function(event){
			event.preventDefault();

			var ricetta = {};
			ricetta.codice = $('#codiceRicetta').val();
			ricetta.nome = $('#nome').val();
			var categoria = {};
			categoria.id = $('#categoria option:selected').val();
			ricetta.categoria = categoria;
			ricetta.tempoPreparazione = $('#tempoPreparazione').val();
			ricetta.pesoTotale = $('#pesoTotale').val();
			ricetta.scadenzaGiorni = $('#scadenzaGiorni').val();
			ricetta.costoIngredienti = $('#costoIngredienti').val();
			ricetta.costoPreparazione = $('#costoPreparazione').val();
			ricetta.costoTotale = $('#costoTotale').val();
			var ingredientiLength = $('.formRowIngrediente').length;
			if(ingredientiLength != null && ingredientiLength !== 0){
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
			let allergeni = $('#tracce').val();
			if(allergeni != null && allergeni.length !== 0){
				var ricettaAllergeni = [];
				$.each(allergeni, function(i, item){
					var ricettaAllergene = {};
					var ricettaAllergeneId = {};
					ricettaAllergeneId.allergeneId = item;
					ricettaAllergene.id = ricettaAllergeneId;

					ricettaAllergeni.push(ricettaAllergene);
				})
				ricetta.ricettaAllergeni = ricettaAllergeni;
			}
			/*
			let allergeniLength = $('.tracceRow').length;
			if(allergeniLength != null && allergeniLength.length !== 0){
				var ricettaAllergeni = [];
				$('.tracceRow').each(function(i, item){
					var ricettaAllergene = {};
					var ricettaAllergeneId = {};

					let value = $(this).find('.tracceAllergene option:selected').val();
					if(value != null && value !== ''){
						ricettaAllergeneId.allergeneId = $(this).find('.tracceAllergene option:selected').val();
						ricettaAllergene.id = ricettaAllergeneId;

						ricettaAllergeni.push(ricettaAllergene);
					}
				})
				ricetta.ricettaAllergeni = ricettaAllergeni;
			}
			*/
			ricetta.preparazione = $('#preparazione').val();
			//ricetta.allergeni = $('#allergeni').val();

			let dichiarazioneNutrizionaleLength = $('.dichiarazioneNutrizionaleRow').length;
			if(dichiarazioneNutrizionaleLength != null && dichiarazioneNutrizionaleLength !== 0){
				let ricettaNutrienti = [];
				$('.dichiarazioneNutrizionaleRow').each(function(i, item){
					let nutriente = {};
					let nutrienteId = {}
					nutrienteId.nutrienteId = $(this).find('.dichiarazioneNutrizionaleNutriente option:selected').val();

					nutriente.id = nutrienteId;
					nutriente.valore = $(this).find('.dichiarazioneNutrizionaleNutrienteValore').val();

					ricettaNutrienti.push(nutriente);
				});
				ricetta.ricettaNutrienti = ricettaNutrienti;
			}

			let analisiLength = $('.analisiRow').length;
			if(analisiLength != null && analisiLength !== 0){
				let ricettaAnalisi = [];
				$('.analisiRow').each(function(i, item){
					let analisi = {};
					let analisiId = {};
					analisiId.analisiId = $(this).find('.analisiAnalisi option:selected').val();

					analisi.id = analisiId;
					analisi.risultato = $(this).find('.analisiRisultato').val();

					ricettaAnalisi.push(analisi);
				});
				ricetta.ricettaAnalisi = ricettaAnalisi;
			}

			ricetta.conservazione = $('#conservazione').val();
			ricetta.consigliConsumo = $('#consigliConsumo').val();
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

	if($('#updateRicettaButton') != null && $('#updateRicettaButton') !== undefined){

		$('#tracce').selectpicker();

		$(document).on('submit','#updateRicettaForm', function(event){
			event.preventDefault();

			var ricetta = {};
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
			if(ingredientiLength != null && ingredientiLength !== 0){
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
			let allergeni = $('#tracce').val();
			if(allergeni != null && allergeni.length !== 0){
				var ricettaAllergeni = [];
				$.each(allergeni, function(i, item){
					var ricettaAllergene = {};
					var ricettaAllergeneId = {};
					ricettaAllergeneId.allergeneId = item;
					ricettaAllergene.id = ricettaAllergeneId;

					ricettaAllergeni.push(ricettaAllergene);
				})
				ricetta.ricettaAllergeni = ricettaAllergeni;
			}
			/*
			let allergeniLength = $('.tracceRow').length;
			if(allergeniLength != null && allergeniLength.length !== 0){
				var ricettaAllergeni = [];
				$('.tracceRow').each(function(i, item){
					var ricettaAllergene = {};
					var ricettaAllergeneId = {};

					let value = $(this).find('.tracceAllergene option:selected').val();
					if(value != null && value !== ''){
						ricettaAllergeneId.allergeneId = $(this).find('.tracceAllergene option:selected').val();
						ricettaAllergene.id = ricettaAllergeneId;

						ricettaAllergeni.push(ricettaAllergene);
					}

				})
				ricetta.ricettaAllergeni = ricettaAllergeni;
			}
			*/
			ricetta.preparazione = $('#preparazione').val();
			//ricetta.allergeni = $('#allergeni').val();

			let dichiarazioneNutrizionaleLength = $('.dichiarazioneNutrizionaleRow').length;
			if(dichiarazioneNutrizionaleLength != null && dichiarazioneNutrizionaleLength !== 0){
				let ricettaNutrienti = [];
				$('.dichiarazioneNutrizionaleRow').each(function(i, item){
					let nutriente = {};
					let nutrienteId = {}
					nutrienteId.nutrienteId = $(this).find('.dichiarazioneNutrizionaleNutriente option:selected').val();

					nutriente.id = nutrienteId;
					nutriente.valore = $(this).find('.dichiarazioneNutrizionaleNutrienteValore').val();

					ricettaNutrienti.push(nutriente);
				});
				ricetta.ricettaNutrienti = ricettaNutrienti;
			}

			let analisiLength = $('.analisiRow').length;
			if(analisiLength != null && analisiLength !== 0){
				let ricettaAnalisi = [];
				$('.analisiRow').each(function(i, item){
					let analisi = {};
					let analisiId = {};
					analisiId.analisiId = $(this).find('.analisiAnalisi option:selected').val();

					analisi.id = analisiId;
					analisi.risultato = $(this).find('.analisiRisultato').val();

					ricettaAnalisi.push(analisi);
				});
				ricetta.ricettaAnalisi = ricettaAnalisi;
			}

			ricetta.conservazione = $('#conservazione').val();
			ricetta.consigliConsumo = $('#consigliConsumo').val();
			ricetta.note = $('#note').val();

			var ricettaJson = JSON.stringify(ricetta);

			var alertContent = '<div id="alertRicettaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '<strong>@@alertText@@</strong>\n' +
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

	/*
	$(document).on('click','.addTracce', function(event){
		event.preventDefault();

		var tracceRow = $(this).parent().parent().parent().parent();
		var newTracceRow = $.fn.cloneRowTracce(tracceRow);

		newTracceRow.find('.tracceAllergene').focus();
	});

	$(document).on('click','.removeTracce', function(event){
		event.preventDefault();
		$(this).parent().parent().parent().remove();
	});
	*/
});

$.fn.cloneRowDichiarazioneNutrizionale = function(row){
	var newRow = row.clone();
	newRow.addClass('dichiarazioneNutrizionaleRowAdd');
	newRow.removeAttr("id");
	newRow.find('label').each(function( index ) {
		$(this).remove();
	});
	newRow.find('input').each(function( index ) {
		$(this).val(null);
	});
	newRow.find('.addDichiarazioneNutrizionale').each(function( index ) {
		$(this).remove();
	});
	var removeLink = '<a href="#" class="removeDichiarazioneNutrizionale"><i class="fas fa-minus"></i></a>';
	newRow.find('.linkDichiarazioneNutrizionale').after(removeLink);
	$('.dichiarazioneNutrizionaleRow').last().after(newRow);

	return newRow;
}

$.fn.cloneRowAnalisi = function(row){
	var newRow = row.clone();
	newRow.addClass('analisiRowAdd');
	newRow.removeAttr("id");
	newRow.find('label').each(function( index ) {
		$(this).remove();
	});
	newRow.find('input').each(function( index ) {
		$(this).val(null);
	});
	newRow.find('.addAnalisi').each(function( index ) {
		$(this).remove();
	});
	var removeLink = '<a href="#" class="removeAnalisi"><i class="fas fa-minus"></i></a>';
	newRow.find('.linkAnalisi').after(removeLink);
	$('.analisiRow').last().after(newRow);

	return newRow;
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

$.fn.getAnagrafiche = function(){

	$.ajax({
		url: baseUrl + "anagrafiche/analisi-microbiologiche?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('.analisiAnalisi').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

	$.ajax({
		url: baseUrl + "anagrafiche/nutrienti?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('.dichiarazioneNutrizionaleNutriente').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getCategorieRicette = function(){
	$.ajax({
		url: baseUrl + "categorie-ricette",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
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
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					//if(i == 0){
					//	$('#categoria option[value="' + item.categoria.id +'"]').attr('selected', true);
					//}
					var tracce = null;
					if(item.ricettaAllergeni != null){
						var allergeni = [];
						$.each(item.ricettaAllergeni, function(i, item2){
							allergeni.push(item2.allergene.nome);
						})
						if(allergeni.length > 0){
							allergeni.sort();
							tracce = allergeni.join(',');
						}
					}
					$('#'+field).append('<option value="'+item.id+'" data-id-categoria="'+item.categoria.id+'" data-num-giorni-scadenza="'+item.scadenzaGiorni+'" data-codice="'+item.codice+'" data-tracce="'+tracce+'">'+item.codice+' - '+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getAllergeni = function(){
	$.ajax({
		url: baseUrl + "allergeni?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					$('#tracce').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
				$('#tracce').selectpicker('refresh');
			}
			/*
			if(result != null && result !== ''){
				$('.tracceAllergene').append('<option value=""></option>');
				$.each(result, function(i, item){
					$('.tracceAllergene').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
			*/
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
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
	alertContent += '<strong>Errore nel recupero della ricetta.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
        url: baseUrl + "ricette/" + idRicetta,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
			if(result != null && result !== ''){

				$('#hiddenIdRicetta').attr('value', result.id);
				$('#codiceRicetta').attr('value', result.codice);
				$('#nome').attr('value', result.nome);
				if(result.categoria != null){
					$('#categoria option[value="' + result.categoria.id +'"]').attr('selected', true);
				}
				$('#tempoPreparazione').attr('value', result.tempoPreparazione);
				$('#pesoTotale').attr('value', result.pesoTotale);
				$('#scadenzaGiorni').attr('value', result.scadenzaGiorni);
				$('#costoIngredienti').attr('value', result.costoIngredienti);
				$('#costoPreparazione').attr('value', result.costoPreparazione);
				$('#costoTotale').attr('value', result.costoTotale);
				$('#preparazione').val(result.preparazione);
				//$('#allergeni').val(result.allergeni);
				$('#conservazione').val(result.conservazione);
				$('#consigliConsumo').val(result.consigliConsumo);
				$('#note').val(result.note);

				if(result.ricettaIngredienti != null && result.ricettaIngredienti.length !== 0){

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

						if(i === 0){
							rowHtml = rowHtml + '<label for="codiceIngrediente">Codice</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceIngrediente_'+id+'" disabled value="'+codice+'"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-4">';

						if(i === 0){
							rowHtml = rowHtml + '<label for="descrizioneIngrediente">Descrizione</label>';
						}
						rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneIngrediente_'+id+'" disabled value="'+descrizione+'"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if(i === 0){
							rowHtml = rowHtml + '<label for="prezzoIngrediente">Prezzo (&euro;)</label>';
						}
						rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoIngrediente_'+id+'" disabled value="'+prezzo+'"></div>';
						rowHtml = rowHtml + '<div class="form-group col-md-2">';

						if(i === 0){
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

				if(result.ricettaAllergeni != null && result.ricettaAllergeni.length !== 0){
					$.each(result.ricettaAllergeni, function(i, item){
						var id = item.id;
						if(id != null){
							var idAllergene = id.allergeneId;
							$('#tracce option[value="' + idAllergene +'"]').attr('selected', true);
						}
					});
					$('#tracce').selectpicker('refresh');
				}

				/*
				if(result.ricettaAllergeni != null && result.ricettaAllergeni.length !== 0){

					let ricettaAllergeni = result.ricettaAllergeni;
					ricettaAllergeni.sort(function(a,b){
						let allergene1 = a.allergene.ordine;
						let allergene2 = b.allergene.ordine;
						return ((allergene1 > allergene2) ? 1 : ((allergene1 < allergene2) ? -1 : 0));
					});

					$.each(ricettaAllergeni, function(i, item){
						let id = item.id;
						let allergeneId = id.allergeneId;
						let row;
						if(i === 0){
							row = $('#tracceRow1');
						} else {
							row = $.fn.cloneRowTracce($('#tracceRow1'));
						}
						row.find('.tracceAllergene option[value="' + allergeneId +'"]').attr('selected', true);
					});

				}
				*/

				if(result.ricettaNutrienti != null && result.ricettaNutrienti.length !== 0){
					let ricettaNutrienti = result.ricettaNutrienti;
					ricettaNutrienti.sort(function(a,b){
						let nutriente1 = a.nutriente.ordine;
						let nutriente2 = b.nutriente.ordine;
						return ((nutriente1 > nutriente2) ? 1 : ((nutriente1 < nutriente2) ? -1 : 0));
					});

					$.each(ricettaNutrienti, function(i, item){
						let id = item.id;
						let nutrienteId = id.nutrienteId;
						let row;
						if(i === 0){
							row = $('#dichiarazioneNutrizionaleRow1');
						} else {
							row = $.fn.cloneRowDichiarazioneNutrizionale($('#dichiarazioneNutrizionaleRow1'));
						}
						row.find('.dichiarazioneNutrizionaleNutriente option[value="' + nutrienteId +'"]').attr('selected', true);
						row.find('.dichiarazioneNutrizionaleNutrienteValore').val(item.valore);
					});
				}

				if(result.ricettaAnalisi != null && result.ricettaAnalisi.length !== 0){
					let ricettaAnalisi = result.ricettaAnalisi;
					ricettaAnalisi.sort(function(a,b){
						let analisi1 = a.analisi.ordine;
						let analisi2 = b.analisi.ordine;
						return ((analisi1 > analisi2) ? 1 : ((analisi1 < analisi2) ? -1 : 0));
					});

					$.each(ricettaAnalisi, function(i, item){
						let id = item.id;
						let analisiId = id.analisiId;
						let row;
						if(i === 0){
							row = $('#analisiRow1');
						} else {
							row = $.fn.cloneRowAnalisi($('#analisiRow1'));
						}
						row.find('.analisiAnalisi option[value="' + analisiId +'"]').attr('selected', true);
						row.find('.analisiRisultato').val(item.risultato);
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
/*
$.fn.cloneRowTracce = function(row){
	var newRow = row.clone();
	newRow.addClass('tracceRowAdd');
	newRow.removeAttr("id");
	newRow.find('label').each(function( index ) {
		$(this).remove();
	});
	newRow.find('input').each(function( index ) {
		$(this).val(null);
	});
	newRow.find('.addTracce').each(function( index ) {
		$(this).remove();
	});
	var removeLink = '<a href="#" class="removeTracce"><i class="fas fa-minus"></i></a>';
	newRow.find('.linkTracce').after(removeLink);
	$('.tracceRow').last().after(newRow);

	return newRow;
}
*/