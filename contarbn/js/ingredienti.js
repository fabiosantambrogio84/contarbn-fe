var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#ingredientiTable').DataTable({
		"ajax": {
			"url": baseUrl + "ingredienti",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero degli ingredienti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertIngrediente').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca per codice, descrizione",
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				"previous": "Prec."
			},
			"emptyTable": "Nessun ingrediente disponibile",
			"zeroRecords": "Nessun ingrediente disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc']
		],
		"columns": [
			{"name": "attivo", "data": "attivo", "visible":false},
			{"name": "codice", "data": "codice"},
			{"name": "descrizione", "data": "descrizione"},
			{"name": "prezzo", "data": "prezzo"},
			{"name": "fornitore", "data": null, render: function ( data, type, row ) {
                var fornitore = data.fornitore;
                if(fornitore != null && fornitore != undefined){
                    if(fornitore.dittaIndividuale){
                        var returnString = fornitore.nome;
                        if(fornitore.cognome != null && fornitore.cognome != null){
                            returnString = returnString + " " + fornitore.cognome;
                        }
                        return returnString;
                    } else{
                        if(fornitore.ragioneSociale != null && fornitore.ragioneSociale != undefined){
                            return fornitore.ragioneSociale;
                        } else {
                            return fornitore.ragioneSociale2;
                        }
                    }
                } else {
                    return '';
                }
            }},
			{"name": "dataInserimento", "data": null, render: function ( data, type, row ) {
                var a = moment(data.dataInserimento);
                return a.format('DD/MM/YYYY HH:mm:ss');
            }},
			{"name": "note", "data": "note"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateIngrediente pr-2" data-id="'+data.id+'" href="ingredienti-edit.html?idIngrediente=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteIngrediente" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			if(!data.attivo){
				$(row).css('background-color', '#d2d4d2');
			}
		}
	});

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

	if($('#updateIngredienteButton') != null && $('#updateIngredienteButton') != undefined){

		$('#allergeni').selectpicker();

		$(document).on('submit','#updateIngredienteForm', function(event){
			event.preventDefault();

			var ingrediente = new Object();
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

			var ingredienteJson = JSON.stringify(ingrediente);

			var alertContent = '<div id="alertIngredienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

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
					$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell ingrediente').replace('@@alertResult@@', 'danger'));
				}
			});
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
					$('#alertIngrediente').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dell ingrediente').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.getFornitori = function(){
	$.ajax({
		url: baseUrl + "fornitori?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
				    var label;
				    if(item.dittaIndividuale){
				        label = item.nome;
				        if(item.cognome != null && item.cognome != undefined){
				            label = label + " " + item.cognome;
				        }
				    } else{
				        if(item.ragioneSociale != null && item.ragioneSociale != undefined){
				            label = item.ragioneSociale;
				        } else{
				            label = item.ragioneSociale2;
				        }
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

$.fn.extractIdIngredienteFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idIngrediente') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getIngrediente = function(idIngrediente){

	var alertContent = '<div id="alertIngredienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero degli ingredienti.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "ingredienti/" + idIngrediente,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
			if(result != null && result != undefined && result != ''){

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

