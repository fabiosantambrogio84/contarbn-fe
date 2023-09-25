
var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#scontiFornitoriTable').DataTable({
		"ajax": {
			"url": baseUrl + "sconti?tipologia=FORNITORE",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertScontoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei clienti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertSconto').empty().append(alertContent);
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
			"emptyTable": "Nessuno sconto fornitore disponibile",
			"zeroRecords": "Nessuno sconto fornitore disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "cliente", "data": null, render: function ( data, type, row ) {
                if(data.cliente != null){
					return data.cliente.ragioneSociale;
				} else {
                	return '';
				}
            }},
			{"name": "tipologia", "data": "tipologia"},
			{"name": "fornitore", "data": null, render: function ( data, type, row ) {
                if(data.fornitore != null){
					return data.fornitore.ragioneSociale;
				} else {
                	return '';
				}
            }},
			{"name": "dataDal", "data": null, render: function ( data, type, row ) {
				if(data.dataDal != null){
					var a = moment(data.dataDal);
					return a.format('DD/MM/YYYY');
				} else {
					return '';
				}
			}},
			{"name": "dataAl", "data": null, render: function ( data, type, row ) {
				if(data.dataAl != null){
					var a = moment(data.dataAl);
					return a.format('DD/MM/YYYY');
				} else {
					return '';
				}
			}},
			{"name": "valore", "data": "valore"},
			{"data": null, "orderable":false, "width":"15%", render: function ( data, type, row ) {
				var links = '<a class="updateSconto pr-2" data-id="'+data.id+'" href="sconti-edit.html?idSconto=' + data.id + '"><i class="far fa-edit" title="Modifica"></i></a>';
				links = links + '<a class="deleteSconto" data-id="'+data.id+'" data-tipologia="'+data.tipologia+'" href="#"><i class="far fa-trash-alt" title="Elimina"></i></a>';
				return links;
			}}
		]
	});

	$('#scontiArticoliTable').DataTable({
		"ajax": {
			"url": baseUrl + "sconti?tipologia=ARTICOLO",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertScontoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei clienti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertSconto').empty().append(alertContent);
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
			"emptyTable": "Nessuno sconto articolo disponibile",
			"zeroRecords": "Nessuno sconto articolo disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "cliente", "data": null, render: function ( data, type, row ) {
				if(data.cliente != null){
					return data.cliente.ragioneSociale;
				} else {
					return '';
				}
			}},
			{"name": "tipologia", "data": "tipologia"},
			{"name": "articolo", "data": null, render: function ( data, type, row ) {
				if(data.articolo != null){
					return data.articolo.descrizione;
				} else {
					return '';
				}
			}},
			{"name": "dataDal", "data": null, render: function ( data, type, row ) {
                if(data.dataDal != null){
                    var a = moment(data.dataDal);
                    return a.format('DD/MM/YYYY');
                } else {
                    return '';
                }
            }},
			{"name": "dataAl", "data": null, render: function ( data, type, row ) {
                if(data.dataAl != null){
                    var a = moment(data.dataAl);
                    return a.format('DD/MM/YYYY');
                } else {
                    return '';
                }
            }},
			{"name": "valore", "data": "valore"},
			{"data": null, "orderable":false, "width":"15%", render: function ( data, type, row ) {
                var links = '<a class="updateSconto pr-2" data-id="'+data.id+'" href="sconti-edit.html?idSconto=' + data.id + '"><i class="far fa-edit" title="Modifica"></i></a>';
                links = links + '<a class="deleteSconto" data-id="'+data.id+'" data-tipologia="'+data.tipologia+'" href="#"><i class="far fa-trash-alt" title="Elimina"></i></a>';
                return links;
            }}
		]
	});

	$(document).on('click','.deleteSconto', function(){
		var idSconto = $(this).attr('data-id');
		var tipologia = $(this).attr('data-tipologia');
		$('#confirmDeleteSconto').attr('data-id', idSconto);
		$('#confirmDeleteSconto').attr('data-tipologia', tipologia);
		$('#deleteScontoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteSconto', function(){
		$('#deleteScontoModal').modal('hide');
		var idSconto = $(this).attr('data-id');
		var tipologia = $(this).attr('data-tipologia');

		$.ajax({
			url: baseUrl + "sconti/" + idSconto,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertScontoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Sconto</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertSconto').empty().append(alertContent);

				if(tipologia == 'FORNITORE'){
					$('#scontiFornitoriTable').DataTable().ajax.reload();
				} else {
					$('#scontiArticoliTable').DataTable().ajax.reload();
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateScontoButton') != null && $('#updateScontoButton') != undefined){
		$(document).on('submit','#updateScontoForm', function(event){
			event.preventDefault();

			var tipologia = $('#tipologia option:selected').val();

			var sconto = new Object();
			sconto.id = $('#hiddenIdSconto').val();
			if($('#cliente option:selected').val() != -1){
				var cliente = new Object();
				cliente.id = $('#cliente option:selected').val();
				sconto.cliente = cliente;
			};
			sconto.tipologia = tipologia;

			sconto.dataDal = $('#dataDal').val();
			sconto.dataAl = $('#dataAl').val();
			sconto.valore = $('#valore').val();

			if(tipologia == 'FORNITORE'){
				var fornitore = new Object();
				fornitore.id = $('#fornitore option:selected').val();
				sconto.fornitore = fornitore;
			} else {
				var articolo = new Object();
				articolo.id = $('#articolo option:selected').val();
				sconto.articolo = articolo;
			}

			var scontoJson = JSON.stringify(sconto);

			var alertContent = '<div id="alertScontoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "sconti/" + $('#hiddenIdSconto').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: scontoJson,
				success: function(result) {
					$('#alertSconto').empty().append(alertContent.replace('@@alertText@@','Sconto modificato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the Sconto list page
					setTimeout(function() {
						window.location.href = "sconti.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertSconto').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dello sconto').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newScontoButton') != null && $('#newScontoButton') != undefined){
		$('#cliente').selectpicker();
		$('#articolo').selectpicker();
		$('#fornitore').selectpicker();

		$(document).on('submit','#newScontoForm', function(event){
			event.preventDefault();

            var alertContent = '<div id="alertScontoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
            			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
            				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

            var sconti = [];
			var clienti = $('#cliente').val();
            var dataDal = $('#dataDal').val();
            var dataAl = $('#dataAl').val();
            var valore = $('#valore').val();
            var tipologia = $('#tipologia option:selected').val();

            if(tipologia == 'FORNITORE'){
				var fornitori = $('#fornitore').val();
				if(clienti != null && clienti.length != 0){
					$.each(clienti, function(i, item){
						var cliente = new Object();
						cliente.id = item;

						if(fornitori != null && fornitore.length != 0){
							$.each(fornitori, function(i, item){
								var sconto = new Object();
								sconto.tipologia = tipologia;

								sconto.cliente = cliente;

								var fornitore = new Object();
								fornitore.id = item;
								sconto.fornitore = fornitore;

								sconto.dataDal = dataDal;
								sconto.dataAl = dataAl;
								sconto.valore = valore;

								sconti.push(sconto);
							})
						}
					})
				}
            } else {
                var articoli = $('#articolo').val();

				if(clienti != null && clienti.length != 0){
					$.each(clienti, function(i, item){
						var cliente = new Object();
						cliente.id = item;

						if(articoli != null && articoli.length != 0){
							$.each(articoli, function(i, item){
								var sconto = new Object();
								sconto.tipologia = tipologia;

								sconto.cliente = cliente;

								var articolo = new Object();
								articolo.id = item;
								sconto.articolo = articolo;

								sconto.dataDal = dataDal;
								sconto.dataAl = dataAl;
								sconto.valore = valore;

								sconti.push(sconto);
							})
						}

					})
				}
            }

            var scontiJson = JSON.stringify(sconti);

			$.ajax({
				url: baseUrl + "sconti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: scontiJson,
				success: function(result) {
					$('#alertSconto').empty().append(alertContent.replace('@@alertText@@','Sconti creati con successo').replace('@@alertResult@@', 'success'));

					// Returns to the Sconto list page
					setTimeout(function() {
						window.location.href = "sconti.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertSconto').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione degli sconti').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('change','#tipologia', function(){
		var tipologia = $('#tipologia option:selected').val();
		if(tipologia == 'ARTICOLO'){
			$('#articolo').selectpicker('refresh');

			$('#fornitoreDiv').addClass('d-none');
			$('#articoloDiv').removeClass('d-none');
			$('#tipologia option[value="ARTICOLO"]').attr('selected', true);
			$('#tipologia option[value="FORNITORE"]').removeAttr('selected');

			$('#articolo').attr('required', true);
			$('#fornitore').removeAttr('required');
		} else {
			$('#fornitore').selectpicker('refresh');

			$('#fornitoreDiv').removeClass('d-none');
			$('#articoloDiv').addClass('d-none');
			$('#tipologia option[value="FORNITORE"]').attr('selected', true);
			$('#tipologia option[value="ARTICOLO"]').removeAttr('selected');

			$('#fornitore').attr('required', true);
            $('#articolo').removeAttr('required');
		}
	});
});

$.fn.getClienti = function(){
	$.ajax({
		url: baseUrl + "clienti?bloccaDdt=false",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = '';
					if(item.dittaIndividuale){
						label += item.cognome + ' - ' + item.nome;
					} else {
						label += item.ragioneSociale;
					}
					if(item.partitaIva != null && item.partitaIva != ''){
					    label += ' - ' + item.partitaIva;
					}
					if(item.codiceFiscale != null && item.codiceFiscale != ''){
					    label += ' - ' + item.codiceFiscale;
					}
					$('#cliente').append('<option value="'+item.id+'">'+label+'</option>');
				});
			}
			$('#cliente').selectpicker('refresh');
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
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#fornitore').append('<option value="'+item.id+'">'+item.ragioneSociale+'</option>');
				});
			}
			$('#fornitore').selectpicker('refresh');
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getArticoli = function(){
	$.ajax({
		url: baseUrl + "articoli?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#articolo').append('<option value="'+item.id+'">'+item.codice+' '+item.descrizione+'</option>');
				});
			}
			$('#articolo').selectpicker('refresh');
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getTipologieSconti = function(){
	$.ajax({
		url: baseUrl + "utils/tipologie-sconti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var selected = '';
					if(item == 'ARTICOLO'){
						selected = ' selected';
					}
					$('#tipologia').append('<option value="'+item+'" '+selected+'>'+item+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdScontoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idSconto') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getSconto = function(idSconto){

	var alertContent = '<div id="alertScontoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dello sconto.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "sconti/" + idSconto,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdSconto').attr('value', result.id);
			if(result.cliente != null && result.cliente != undefined){
				$('#cliente option[value="' + result.cliente.id +'"]').attr('selected', true);
            };
			var tipologia = result.tipologia;
			if(tipologia != null && tipologia != undefined){
				$('#tipologia option[value="' + tipologia +'"]').attr('selected', true);
			}
			if(tipologia == 'ARTICOLO'){
				$('#fornitoreDiv').addClass('d-none');
			  	$('#articoloDiv').removeClass('d-none');
			  	$('#tipologia option[value="ARTICOLO"]').attr('selected', true);
			  	$('#tipologia option[value="FORNITORE"]').removeAttr('selected');
			} else {
			  	$('#fornitoreDiv').removeClass('d-none');
			  	$('#articoloDiv').addClass('d-none');
			  	$('#tipologia option[value="FORNITORE"]').attr('selected', true);
			  	$('#tipologia option[value="ARTICOLO"]').removeAttr('selected');
			}
			if(result.fornitore != null && result.fornitore != undefined){
                  $('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);
            };
            if(result.articolo != null && result.articolo != undefined){
                  $('#articolo option[value="' + result.articolo.id +'"]').attr('selected', true);
            };

			$('#dataDal').attr('value', result.dataDal);
            $('#dataAl').attr('value', result.dataAl);
            $('#valore').attr('value', result.valore);

          } else{
            $('#alertSconto').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertSconto').empty().append(alertContent);
            $('#updateScontoButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

