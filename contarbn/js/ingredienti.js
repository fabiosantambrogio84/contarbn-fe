var baseUrl = "/contarbn-be/";


$(document).ready(function() {

	$.fn.loadIngredientiTable(baseUrl + "ingredienti/search");

	$(document).on('click','.deleteIngrediente', function(){
		var idIngrediente = $(this).attr('data-id');
		$('#confirmDeleteIngrediente').attr('data-id', idIngrediente);
		$('#deleteIngredienteModal').modal('show');
	});

	$(document).on('click','#confirmDeleteIngrediente', function(){
		$('#deleteIngredienteModal').modal('hide');
		var idIngrediente = $(this).attr('data-id');

		var alertContent = '<div id="alertIngredienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "ingredienti/" + idIngrediente,
			type: 'DELETE',
			success: function() {
				$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@', 'Ingrediente</strong> cancellato con successo.').replace('@@alertResult@@', 'success'));

				$('#ingredientiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var errorMessage = "Errore nella cancellazione dell'ingrediente";
				var responseText = jqXHR.responseText;
				if(responseText !== undefined){
					console.log('Response text: ' + responseText);
					errorMessage = JSON.parse(responseText).message;
				}

				$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@', errorMessage).replace('@@alertResult@@', 'danger'));
			}
		});
	});

	$(document).on('click','#deleteIngredientiBulk', function(){
		$('#deleteIngredientiBulkModal').modal('show');
	});

	$(document).on('click','#confirmDeleteIngredientiBulk', function(){
		$('#deleteIngredientiBulkModal').modal('hide');

		var alertContent = '<div id="alertIngredienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent += '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var numChecked = $('.deleteIngredienteCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked === 0){
			$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@', 'Selezionare almeno un ingrediente').replace('@@alertResult@@', 'danger'));

		} else{
			let idIngredienti = [];
			$('.deleteIngredienteCheckbox:checkbox:checked').each(function(i, item) {
				var id = item.id.replace('checkbox_', '');
				idIngredienti.push(id);
			});
			$.ajax({
				url: baseUrl + "ingredienti/operations/delete",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: JSON.stringify(idIngredienti),
				success: function(result) {
					$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@','Ingredienti cancellati con successo').replace('@@alertResult@@', 'success'));

					$('#ingredientiTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					let errorMessage = "Errore nella cancellazione degli ingredienti";
					let errorLevel = "danger";
					let responseText = jqXHR.responseText;
					if(responseText !== undefined){
						console.log('Response text: ' + responseText);
						errorMessage = JSON.parse(responseText).message;
						errorLevel = "warning";
					}

					$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', errorLevel));

					$('#ingredientiTable').DataTable().ajax.reload();
				}
			});
		}
	});

	$(document).on('change','#composto', function(){
		var isChecked = $('#composto').prop('checked');
		if(isChecked){
			$('#composizioneRow').removeAttr('hidden');
		} else{
			window.composizioneCkEditor.setData('');
			$('#composizioneRow').attr('hidden', true);
		}
	});

	if($('#searchIngredienteButton') != null && $('#searchIngredienteButton') !== undefined) {
		$(document).on('submit', '#searchIngredienteForm', function (event) {
			event.preventDefault();

			$('#ingredientiTable').DataTable().destroy();
			$.fn.loadIngredientiTable($.fn.createUrlSearch("ingredienti/search?"));

		});

		$(document).on('click','#resetSearchIngredienteButton', function(){
			$('#searchIngredienteForm :input').val(null);
			$('#searchIngredienteForm select option[value=""]').attr('selected', true);

			$('#ingredientiTable').DataTable().destroy();
			$.fn.loadIngredientiTable(baseUrl + "ingredienti/search");
		});
	}

	if($('#newIngredienteButton') != null && $('#newIngredienteButton') != undefined){

		$('#allergeni').selectpicker();

		$(document).on('submit','#newIngredienteForm', function(event){
			event.preventDefault();

			var ingrediente = new Object();
			ingrediente.codice = $('#codice').val();
			ingrediente.descrizione = $('#descrizione').val();
			ingrediente.prezzo = $('#prezzo').val();
			var unitaMisura = new Object();
			unitaMisura.id = $('#unitaDiMisura option:selected').val();
			ingrediente.unitaMisura = unitaMisura;
			var fornitore = new Object();
            fornitore.id = $('#fornitore option:selected').val();
			ingrediente.fornitore = fornitore;
            var aliquotaIva = new Object();
			aliquotaIva.id = $('#aliquotaIva option:selected').val();
			ingrediente.aliquotaIva = aliquotaIva;
			ingrediente.scadenzaGiorni= $('#scadenzaGiorni').val();
			if($('#attivo').prop('checked') === true){
                ingrediente.attivo = true;
            }else{
                ingrediente.attivo = false;
            }
			ingrediente.note = $('#note').val();
			var allergeni = $('#allergeni').val();
			if(allergeni != null && allergeni.length != 0){
				var ingredienteAllergeni = [];
				$.each(allergeni, function(i, item){
					var ingredienteAllergene = {};
					var ingredienteAllergeneId = new Object();
					ingredienteAllergeneId.allergeneId = item;
					ingredienteAllergene.id = ingredienteAllergeneId;

					ingredienteAllergeni.push(ingredienteAllergene);
				})
				ingrediente.ingredienteAllergeni = ingredienteAllergeni;
			}
			if($('#composto').prop('checked') === true){
				ingrediente.composto = true;
				ingrediente.composizione = window.composizioneCkEditor.getData();
			}else{
				ingrediente.composto = false;
			}

			var ingredienteJson = JSON.stringify(ingrediente);

			var alertContent = '<div id="alertIngredienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ingredienti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ingredienteJson,
				success: function(result) {
					$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@','Ingrediente creato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the page with the list of Ingredienti
					setTimeout(function() {
						window.location.href = "ingredienti.html";
					}, 1000);

				},
				error: function(jqXHR, textStatus, errorThrown) {
					let errorMessage = "Errore nella creazione dell ingrediente";
					let responseText = jqXHR.responseText;
					if(responseText !== undefined){
						console.log('Response text: ' + responseText);
						errorMessage = JSON.parse(responseText).message;
					}

					$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));

				}
			});
		});
	}

	if($('#updateIngredienteButton') != null && $('#updateIngredienteButton') != undefined){

		$('#allergeni').selectpicker();

		$(document).on('submit','#updateIngredienteForm', function(event){
			event.preventDefault();

			var alertContent = '<div id="alertIngredienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var ingrediente = {};
			ingrediente.id = $('#hiddenIdIngrediente').val();
			ingrediente.codice = $('#codice').val();
			ingrediente.descrizione = $('#descrizione').val();
			ingrediente.prezzo = $('#prezzo').val();
			var unitaMisura = new Object();
			unitaMisura.id = $('#unitaDiMisura option:selected').val();
			ingrediente.unitaMisura = unitaMisura;
			var fornitore = new Object();
			fornitore.id = $('#fornitore option:selected').val();
			ingrediente.fornitore = fornitore;
			var aliquotaIva = new Object();
			aliquotaIva.id = $('#aliquotaIva option:selected').val();
			ingrediente.aliquotaIva = aliquotaIva;
			ingrediente.scadenzaGiorni = $('#scadenzaGiorni').val();
			if($('#attivo').prop('checked') === true){
				ingrediente.attivo = true;
			}else{
				ingrediente.attivo = false;
			}
			ingrediente.dataInserimento = $('#hiddenDataInserimento').val();
			ingrediente.note = $('#note').val();
			var allergeni = $('#allergeni').val();
			if(allergeni != null && allergeni.length != 0){
				var ingredienteAllergeni = [];
				$.each(allergeni, function(i, item){
					var ingredienteAllergene = {};
					var ingredienteAllergeneId = new Object();
					ingredienteAllergeneId.allergeneId = item;
					ingredienteAllergene.id = ingredienteAllergeneId;

					ingredienteAllergeni.push(ingredienteAllergene);
				})
				ingrediente.ingredienteAllergeni = ingredienteAllergeni;
			}
			if($('#composto').prop('checked') === true){
				ingrediente.composto = true;
				ingrediente.composizione = window.composizioneCkEditor.getData();
			}else{
				ingrediente.composto = false;
			}

			var ingredienteJson = JSON.stringify(ingrediente);

			if(ingrediente.composto && ingrediente.composizione === ''){
				$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@','Inserire la composizione').replace('@@alertResult@@', 'danger'));
				return;
			}

			$.ajax({
				url: baseUrl + "ingredienti/" + $('#hiddenIdIngrediente').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ingredienteJson,
				success: function(result) {
					$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@','Ingrediente modificato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the page with the list of Ingredienti
					setTimeout(function() {
						window.location.href = "ingredienti.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					let errorMessage = "Errore nella modifica dell ingrediente";
					let responseText = jqXHR.responseText;
					if(responseText !== undefined){
						console.log('Response text: ' + responseText);
						errorMessage = JSON.parse(responseText).message;
					}
					$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.createUrlSearch = function(path){
	var codice = $('#searchCodice').val();
	var descrizione = $('#searchDescrizione').val();
	var idFornitore = $('#searchFornitore option:selected').val();
	var composto = $('#searchComposto option:selected').val();
	var attivo = $('#searchAttivo option:selected').val();

	var params = {};
	if(codice != null && codice !== ''){
		params.codice = codice;
	}
	if(descrizione != null && descrizione !== ''){
		params.descrizione = descrizione;
	}
	if(idFornitore != null && idFornitore !== ''){
		params.idFornitore = idFornitore;
	}
	if(composto != null && composto !== ''){
		params.composto = composto;
	}
	if(attivo != null && attivo !== ''){
		params.attivo = attivo;
	}
	return baseUrl + path + $.param( params );
};

$.fn.loadIngredientiTable = function(url) {
	$('#ingredientiTable').DataTable({
		"ajax": {
			"url": url,
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "data",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent += '<strong>Errore nel recupero degli ingredienti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertIngrediente').empty().append(alertContent);
			}
		},
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun ingrediente disponibile",
			"zeroRecords": "Nessun ingrediente disponibile",
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
		"autoWidth": false,
		"order": [
			[0, 'desc'],
			[2, 'asc']
		],
		"columns": [
			{"name": "attivo", "data": null, "visible":false, render: function ( data, type, row ) {
				return data.attivo ? 1 : 0;
			}},
			{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
				return '<input type="checkbox" data-id="'+data.id+'" id="checkbox_'+data.id+'" class="deleteIngredienteCheckbox" >';
			}},
			{"name": "codice", "data": "codice"},
			{"name": "descrizione", "data": "descrizione"},
			{"name": "prezzo", "data": "prezzo"},
			{"name": "fornitore", "data": "fornitore"},
			{"name": "dataInserimento", "data": null, render: function ( data, type, row ) {
				var a = moment(data.dataInserimento);
				return a.format('DD/MM/YYYY HH:mm:ss');
			}},
			{"name": "note", "data": "note"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateIngrediente pr-2" data-id="'+data.id+'" href="ingredienti-edit.html?idIngrediente=' + data.id + '" title="Modifica"><i class="far fa-edit"></i></a>';
				links += '<a class="deleteIngrediente" data-id="'+data.id+'" href="#" title="Elimina"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			if(!data.attivo){
				$(row).css('background-color', '#d2d4d2');
			}
		}
	});
}

$.fn.preloadSearchFields = function(){

	$.ajax({
		url: baseUrl + "fornitori",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
					let label;
					if(item.ragioneSociale != null){
						label = item.ragioneSociale;
					} else{
						label = item.ragioneSociale2;
					}
					$('#searchFornitore').append('<option value="'+item.id+'">'+label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getFornitori = function(){

	$.ajax({
		url: baseUrl + "fornitori?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result !== ''){
				$.each(result, function(i, item){
				    let label;
					if(item.ragioneSociale != null){
						label = item.ragioneSociale;
					} else{
						label = item.ragioneSociale2;
					}
					$('#fornitore').append('<option value="'+item.id+'">'+label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getUnitaMisura = function(){
	$.ajax({
		url: baseUrl + "unita-misura",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#unitaDiMisura').append('<option value="'+item.id+'">'+item.etichetta+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getAliquoteIva = function(){
	$.ajax({
		url: baseUrl + "aliquote-iva",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#aliquotaIva').append('<option value="'+item.id+'">'+item.valore+'</option>');
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
		url: baseUrl + "allergeni",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#allergeni').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
				$('#allergeni').selectpicker('refresh');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getIngrediente = function(idIngrediente){

	var alertContent = '<div id="alertIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent += '<strong>Errore nel recupero degli ingredienti.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "ingredienti/" + idIngrediente,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
			if(result != null && result !== ''){

				$('#hiddenIdIngrediente').attr('value', result.id);
				$('#hiddenDataInserimento').attr('value', result.dataInserimento);
				$('#codice').attr('value', result.codice);
				$('#descrizione').attr('value', result.descrizione);
				$('#prezzo').attr('value', result.prezzo);
				$('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);
				$('#unitaDiMisura option[value="' + result.unitaMisura.id +'"]').attr('selected', true);
				$('#aliquotaIva option[value="' + result.aliquotaIva.id +'"]').attr('selected', true);
				$('#scadenzaGiorni').attr('value', result.scadenzaGiorni);
				if(result.attivo === true){
					$('#attivo').prop('checked', true);
				}
				$('#note').val(result.note);

				if(result.ingredienteAllergeni != null && result.ingredienteAllergeni != undefined && result.ingredienteAllergeni.length != 0){
				  $.each(result.ingredienteAllergeni, function(i, item){
					  var id = item.id;
					  if(id != null && id != undefined){
						  var idAllergene = id.allergeneId;
						  $('#allergeni option[value="' + idAllergene +'"]').attr('selected', true);
					  }
				  });
				  $('#allergeni').selectpicker('refresh');
				}

				if(result.composto === true){
					$('#composto').prop('checked', true);
					$('#composizioneRow').removeAttr('hidden');
					window.composizioneCkEditor.setData(result.composizione);
				}

			} else{
			$('#alertIngrediente').empty().append(alertContent);
			}
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertIngrediente').empty().append(alertContent);
            $('#updateIngredienteButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

