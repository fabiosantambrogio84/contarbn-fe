var baseUrl = "/contarbn-be/";

$(document).ready(function() {

    $('[data-toggle="tooltip"]').tooltip();

	$('#listiniTable').DataTable({
		"processing": true,
        //"serverSide": true,
		"ajax": {
			"url": baseUrl + "listini",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei listini</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertListino').empty().append(alertContent);
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
			"emptyTable": "Nessun listino disponibile",
			"zeroRecords": "Nessun listino disponibile",
			"processing": "<i class='fas fa-spinner fa-spin'></i>"
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
            {"name": "tipologia", "data": "tipologia", "visible": false},
		    {"name": "nome", "data": "nome"},
            {"name": "bloccaPrezzi", "data": null, "width": "15%", render: function ( data, type, row ) {
                if(data.bloccaPrezzi){
                    return 'Si';
                } else {
                    return 'No'
                }
            }},
            {"name": "note", "data": null, "width": "25%", render: function ( data, type, row ) {
                var note = data.note;
                if(note != null && note != ''){
                    var noteTrunc = note;
                    var noteHtml = '<div>'+noteTrunc+'</div>';
                    if(note.length > 100){
                        noteTrunc = note.substring(0, 100)+'...';
                        noteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+note+'">'+noteTrunc+'</div>';
                    }
                    return noteHtml;
                } else {
                    return '';
                }
            }},
			{"data": null, "orderable":false, "width":"15%", render: function ( data, type, row ) {
				var links = '<a class="detailsListino pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle"></i></a>';
				links += '<a class="updateListino pr-2" data-id="'+data.id+'" href="listini-edit.html?idListino=' + data.id + '"><i class="far fa-edit"></i></a>';
				links += '<a class="refreshListino pr-2" data-id="'+data.id+'" href="listini-refresh.html?idListino=' + data.id + '" title="Aggiorna prezzi"><i class="fas fa-sync"></i></a>';
                if(data.tipologia != 'BASE'){
                    links += '<a class="duplicateListino pr-2" data-id="'+data.id+'" href="#" title="Duplica"><i class="fas fa-clone"></i></a>';
                }
				links += '<a class="printListino pr-1" data-id="'+data.id+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
                links += '<a class="deleteListino" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
        "createdRow": function(row, data, dataIndex){
            if(data.tipologia == 'BASE'){
                $(row).addClass("listinoBaseRow");
            }
        },
        "initComplete": function( settings, json ) {
            $('[data-toggle="tooltip"]').tooltip();
        }
	});

	$(document).on('click','.deleteListino', function(){
		var idListino = $(this).attr('data-id');
		$('#confirmDeleteListino').attr('data-id', idListino);
		$('#deleteListinoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteListino', function(){
		$('#deleteListinoModal').modal('hide');
		var idListino = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "listini/" + idListino,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertListinoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Listino</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertListino').empty().append(alertContent);

				$('#listiniTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione del listino' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertListino').empty().append(alertContent);

                $('#listiniTable').DataTable().ajax.reload();
			}
		});
	});

    $(document).on('click','.detailsListino', function(){
        var idListino = $(this).attr('data-id');

        var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
        alertContent = alertContent + '<strong>Errore nel recupero del listino.</strong></div>';

        $('#detailsListinoModal').modal('show');

        $('#detailsListinoModalTable').DataTable({
            "ajax": {
                "url": baseUrl + "listini/" + idListino + '/listini-prezzi',
                "type": "GET",
                "content-type": "json",
                "cache": false,
                "dataSrc": "",
                "error": function(jqXHR, textStatus, errorThrown) {
                    $('#detailsListinoMainDiv').append(alertContent);
                }
            },
            "language": {
                "search": "Cerca",
                "emptyTable": "Nessun listino prezzo disponibile",
                "zeroRecords": "Nessun listino prezzo disponibile"
            },
            "paging": false,
            "lengthChange": false,
            "info": false,
            "order": [
                [0,'asc'],
                [1,'asc'],
                [2,'asc']
            ],
            "autoWidth": false,
            "columns": [
                {"name": "listino", "data": null, render: function ( data, type, row ) {
                    var result = '';
                    if(data.listino != null){
                        result = data.listino.nome;
                    }
                    return result;
                }},
                {"name": "articolo", "data": null, render: function ( data, type, row ) {
                    var result = '';
                    if(data.articolo != null){
                        result = data.articolo.codice + ' - ' + data.articolo.descrizione;
                    }
                    return result;
                }},
                {"name": "fornitore", "data": null,  render: function ( data, type, row ) {
                    var result = '';
                    if(data.articolo != null){
                        if(data.articolo.fornitore != null){
                            result = data.articolo.fornitore.codice + ' - ' + data.articolo.fornitore.ragioneSociale;
                        }
                    }
                    return result;
                }},
                {"name": "prezzo", "data": null,  render: function ( data, type, row ) {
                    var result = '';
                    if(data.prezzo != null){
                        var prezzo = data.prezzo;
                        if(!(prezzo.toString()).includes(".")){
                            result = prezzo + ".00";
                        } else {
                            result = prezzo;
                        }
                    }
                    return result;
                }}
            ],
            "createdRow": function(row, data, dataIndex,cells){
                $(cells[3]).css('text-align','right');
            }
        });
    });

    $(document).on('click','.closeDetailsListino', function(){
        $('#detailsListinoModalTable').DataTable().destroy();
        $('#detailsListinoModal').modal('hide');
    });

    $(document).on('click','.printListino', function(){
        var idListino = $(this).attr('data-id');
        $('#confirmPrintListino').attr('data-id', idListino);

        $('#ordinamentoStampaListino').empty();
        $('#ordinamentoStampaListino').append('<option value="categoria-articolo" selected>Categoria articolo</option>');
        $('#ordinamentoStampaListino').append('<option value="descrizione-articolo">Descrizione articolo</option>');
        $('#ordinamentoStampaListino').append('<option value="fornitore">Fornitore</option>');

        $("#ordinamentoStampaListino option[value='categoria-articolo']").attr("selected", "selected");
        $('#printListinoModal').modal('show');
    });

    $(document).on('click','#confirmPrintListino', function(){
        $('#printListinoModal').modal('hide');
        var idListino = $(this).attr('data-id');
        var orderBy = $('#ordinamentoStampaListino option:selected').val();
        var fornitore = $('#filtroStampaListinoFornitore option:selected').val();
        var categoriaArticolo = $('#filtroStampaListinoCategoriaArticolo option:selected').val();

        window.open(baseUrl + "stampe/listini/"+idListino+"?"+"fornitore="+fornitore+"&categoriaArticolo="+categoriaArticolo+"&orderBy="+orderBy, '_blank');
    });

    $(document).on('click','.duplicateListino', function(){
        var idListino = $(this).attr('data-id');
        $('#confirmDuplicateListino').attr('data-id', idListino);

        $('#duplicateListinoModal').modal('show');
    });

    $(document).on('click','#confirmDuplicateListino', function(){
        $('#duplicateListinoModal').modal('hide');
        var idListino = $(this).attr('data-id');
        var nome = $('#duplicateListinoNome').val();

        var body = new Object();
        body.name = nome;

        $.ajax({
            url: baseUrl + "listini/" + idListino + "/duplicate",
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(body),
            success: function() {
                var alertContent = '<div id="alertListinoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Listino</strong> duplicato con successo.\n' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertListino').empty().append(alertContent);

                $('#listiniTable').DataTable().ajax.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Response text: ' + jqXHR.responseText);

                var alertContent = '<div id="alertListinoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella duplicazione del listino' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertListino').empty().append(alertContent);

                $('#listiniTable').DataTable().ajax.reload();
            }
        });
    });

	if($('#updateListinoButton') != null && $('#updateListinoButton') != undefined){
		$('#articoloVariazione').selectpicker();

		$(document).on('submit','#updateListinoForm', function(event){
            event.preventDefault();

            var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

            var listino = new Object();
            var idListino = $('#hiddenIdListino').val();
            listino.id = idListino;
            listino.nome = $('#nome').val();
            var tipologia = $('input[name="tipologia"]:checked').val();
            listino.tipologia = tipologia;

            var tipologiaVariazionePrezzo = $('#tipologiaVariazionePrezzo option:selected').val();
            if(tipologiaVariazionePrezzo == '-1'){
                tipologiaVariazionePrezzo = null;
            }
            var variazionePrezzo = $('#variazionePrezzo').val();
            if(tipologia != null && tipologia == 'STANDARD'){
                if($('#tipologiaVariazionePrezzo option:selected').val() != '-1'){
                    if(variazionePrezzo == null || variazionePrezzo == ''){
                        $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del listino: specificare un prezzo per la variazione').replace('@@alertResult@@', 'danger'));
                        return;
                    }
                }
            }
            if($('#bloccaPrezzi').prop('checked') === true){
                listino.bloccaPrezzi = true;
            }else{
                listino.bloccaPrezzi = false;
            }
            listino.note = $('#note').val();

            var listinoJson = JSON.stringify(listino);
            $.ajax({
                url: baseUrl + "listini/"+idListino,
                type: 'PUT',
                contentType: "application/json",
                dataType: 'json',
                data: listinoJson,
                success: function(result) {

                    // create listiniVariazioniPrezzi
                    var listiniPrezziVariazioni = [];

                    var fornitoreSelected = $('#fornitoreVariazione option:selected').val();
                    var articoliSelected = $('#articoloVariazione').val();

                    if(articoliSelected != null && articoliSelected.length != 0 && articoliSelected.indexOf('-1') == -1){
                        // loop
                        $.each(articoliSelected, function(i, item){
                            var listinoPrezzoVariazione = new Object();
                            listinoPrezzoVariazione.tipologiaVariazionePrezzo = tipologiaVariazionePrezzo;
                            listinoPrezzoVariazione.variazionePrezzo = variazionePrezzo;

                            var listino = new Object();
                            listino.id = idListino;
                            listinoPrezzoVariazione.listino = listino;

                            var articolo = new Object();
                            articolo.id = item;
                            listinoPrezzoVariazione.articolo = articolo;

                            if(fornitoreSelected != null && fornitoreSelected != '-1'){
                                var fornitore = new Object();
                                fornitore.id = fornitoreSelected;
                                listinoPrezzoVariazione.fornitore = fornitore;
                            }
                            listiniPrezziVariazioni.push(listinoPrezzoVariazione);
                        });

                    } else {
                        // single
                        var listinoPrezzoVariazione = new Object();
                        listinoPrezzoVariazione.tipologiaVariazionePrezzo = tipologiaVariazionePrezzo;
                        listinoPrezzoVariazione.variazionePrezzo = variazionePrezzo;

                        var listino = new Object();
                        listino.id = idListino;
                        listinoPrezzoVariazione.listino = listino;

                        if(fornitoreSelected != null && fornitoreSelected != '-1'){
                            var fornitore = new Object();
                            fornitore.id = fornitoreSelected;
                            listinoPrezzoVariazione.fornitore = fornitore;
                        }
                        listiniPrezziVariazioni.push(listinoPrezzoVariazione);
                    }
                    var listiniPrezziVariazioniJson = JSON.stringify(listiniPrezziVariazioni);

                    $.ajax({
                        url: baseUrl + "listini/"+idListino+"/listini-prezzi-variazioni",
                        type: 'PUT',
                        contentType: "application/json",
                        dataType: 'text',
                        data: listiniPrezziVariazioniJson,
                        success: function(result) {
                            $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Listino modificato con successo, prezzi e variazioni salvati correttamente').replace('@@alertResult@@', 'success'));
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Listino modificato con successo ma errore nel salvataggio dei prezzi e delle variazioni').replace('@@alertResult@@', 'warning'));
                        }
                    });

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del listino').replace('@@alertResult@@', 'danger'));
                }
            });
		});
	}

	if($('#newListinoButton') != null && $('#newListinoButton') != undefined){
		$('#articoloVariazione').selectpicker();

		$(document).on('submit','#newListinoForm', function(event){
			event.preventDefault();

            var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			var listino = new Object();
            listino.nome = $('#nome').val();
            var tipologia = $('input[name="tipologia"]:checked').val();
            listino.tipologia = tipologia;

            var tipologiaVariazionePrezzo = $('#tipologiaVariazionePrezzo option:selected').val();
            if(tipologiaVariazionePrezzo == '-1'){
                tipologiaVariazionePrezzo = null;
            }
            var variazionePrezzo = $('#variazionePrezzo').val();
            if(tipologia != null && tipologia == 'STANDARD'){
                if($('#tipologiaVariazionePrezzo option:selected').val() != '-1'){
                    if(variazionePrezzo == null || variazionePrezzo == ''){
                        $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del listino: specificare un prezzo per la variazione').replace('@@alertResult@@', 'danger'));
                        return;
                    }
                }
            }
            if($('#bloccaPrezzi').prop('checked') === true){
                listino.bloccaPrezzi = true;
            }else{
                listino.bloccaPrezzi = false;
            }
            listino.note = $('#note').val();

            var listinoJson = JSON.stringify(listino);
            $.ajax({
                url: baseUrl + "listini",
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: listinoJson,
                success: function(result) {
                    var idListino = result.id;

                    // create listiniVariazioniPrezzi
					var listiniPrezziVariazioni = [];

					var fornitoreSelected = $('#fornitoreVariazione option:selected').val();
					var articoliSelected = $('#articoloVariazione').val();

					if(articoliSelected != null && articoliSelected.length != 0 && articoliSelected.indexOf('-1') == -1){
						// loop
						$.each(articoliSelected, function(i, item){
							var listinoPrezzoVariazione = new Object();
							listinoPrezzoVariazione.tipologiaVariazionePrezzo = tipologiaVariazionePrezzo;
							listinoPrezzoVariazione.variazionePrezzo = variazionePrezzo;

							var listino = new Object();
							listino.id = idListino;
							listinoPrezzoVariazione.listino = listino;

							var articolo = new Object();
							articolo.id = item;
							listinoPrezzoVariazione.articolo = articolo;

							if(fornitoreSelected != null && fornitoreSelected != '-1'){
								var fornitore = new Object();
								fornitore.id = fornitoreSelected;
								listinoPrezzoVariazione.fornitore = fornitore;
							}
							listiniPrezziVariazioni.push(listinoPrezzoVariazione);
						});

					} else {
						// single
						var listinoPrezzoVariazione = new Object();
						listinoPrezzoVariazione.tipologiaVariazionePrezzo = tipologiaVariazionePrezzo;
						listinoPrezzoVariazione.variazionePrezzo = variazionePrezzo;

						var listino = new Object();
						listino.id = idListino;
						listinoPrezzoVariazione.listino = listino;

						if(fornitoreSelected != null && fornitoreSelected != '-1'){
							var fornitore = new Object();
							fornitore.id = fornitoreSelected;
							listinoPrezzoVariazione.fornitore = fornitore;
						}
						listiniPrezziVariazioni.push(listinoPrezzoVariazione);
					}
					var listiniPrezziVariazioniJson = JSON.stringify(listiniPrezziVariazioni);

					$.ajax({
						url: baseUrl + "listini/"+idListino+"/listini-prezzi-variazioni",
						type: 'POST',
						contentType: "application/json",
						dataType: 'text',
						data: listiniPrezziVariazioniJson,
						success: function(result) {
							$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Listino creato con successo, prezzi e variazioni salvati correttamente').replace('@@alertResult@@', 'success'));
						},
						error: function(jqXHR, textStatus, errorThrown) {
							$('#alertListino').empty().append(alertContent.replace('@@alertText@@','Listino creato con successo ma errore nel salvataggio dei prezzi e delle variazioni').replace('@@alertResult@@', 'warning'));
						}
					});

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del listino').replace('@@alertResult@@', 'danger'));
                }
            });
		});
	}

	if($('#refreshListinoButton') != null && $('#refreshListinoButton') != undefined){
		$('#articoloVariazione').selectpicker();

		$(document).on('submit','#refreshListinoForm', function(event){
			event.preventDefault();

            var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
                            alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

            var idListino = $('#hiddenIdListino').val();

			var tipologia = $('#hiddenTipologiaListino').val();
			var tipologiaVariazionePrezzo = $('#tipologiaVariazionePrezzo option:selected').val();
            if(tipologiaVariazionePrezzo == '-1'){
                tipologiaVariazionePrezzo = null;
            }
			var variazionePrezzo = $('#variazionePrezzo').val();
            if(tipologia != null && tipologia == 'STANDARD'){
                if($('#tipologiaVariazionePrezzo option:selected').val() != '-1'){
                    if(variazionePrezzo == null || variazionePrezzo == ''){
                        $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nell aggiornamento dei prezzi del listino: specificare un prezzo per la variazione').replace('@@alertResult@@', 'danger'));
                        return;
                    }
                }
            }

            // create listiniVariazioniPrezzi
            var listiniPrezziVariazioni = [];

            var fornitoreSelected = $('#fornitoreVariazione option:selected').val();
            var articoliSelected = $('#articoloVariazione').val();

            if(articoliSelected != null && articoliSelected.length != 0 && articoliSelected.indexOf('-1') == -1){
                // loop
                $.each(articoliSelected, function(i, item){
                    var listinoPrezzoVariazione = new Object();
                    listinoPrezzoVariazione.tipologiaVariazionePrezzo = tipologiaVariazionePrezzo;
                    listinoPrezzoVariazione.variazionePrezzo = variazionePrezzo;

                    var listino = new Object();
                    listino.id = idListino;
                    listinoPrezzoVariazione.listino = listino;

                    var articolo = new Object();
                    articolo.id = item;
                    listinoPrezzoVariazione.articolo = articolo;

                    if(fornitoreSelected != null && fornitoreSelected != '-1'){
                        var fornitore = new Object();
                        fornitore.id = fornitoreSelected;
                        listinoPrezzoVariazione.fornitore = fornitore;
                    }
                    listiniPrezziVariazioni.push(listinoPrezzoVariazione);
                });

            } else {
                // single
                var listinoPrezzoVariazione = new Object();
                listinoPrezzoVariazione.variazionePrezzo = variazionePrezzo;
                listinoPrezzoVariazione.tipologiaVariazionePrezzo = tipologiaVariazionePrezzo;

                var listino = new Object();
                listino.id = idListino;
                listinoPrezzoVariazione.listino = listino;

                if(fornitoreSelected != null && fornitoreSelected != '-1'){
                    var fornitore = new Object();
                    fornitore.id = fornitoreSelected;
                    listinoPrezzoVariazione.fornitore = fornitore;
                }
                listiniPrezziVariazioni.push(listinoPrezzoVariazione);
            }
            var listiniPrezziVariazioniJson = JSON.stringify(listiniPrezziVariazioni);

            $.ajax({
                url: baseUrl + "listini/"+idListino+"/listini-prezzi-variazioni",
                type: 'PUT',
                contentType: "application/json",
                dataType: 'text',
                data: listiniPrezziVariazioniJson,
                success: function(result) {
                    $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Prezzi e variazioni listino aggiornati correttamente').replace('@@alertResult@@', 'success'));
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nell aggiornamento dei prezzi e variazioni listino').replace('@@alertResult@@', 'danger'));
                }
            });
		});
	}
});

$(document).on('change','input[name="tipologia"]', function(){
	var tipologia = $('input[name="tipologia"]:checked').val();

	if(tipologia == 'BASE'){
		$('#tipologiaVariazionePrezzo').parent().addClass('d-none');
		$('#variazionePrezzo').parent().addClass('d-none');
		$('#variazioneRow').addClass('d-none');
	} else {
		$('#tipologiaVariazionePrezzo').parent().removeClass('d-none');
		$('#variazionePrezzo').parent().removeClass('d-none');
		$('#variazioneRow').removeClass('d-none');
	}
	$('#tipologiaVariazionePrezzo option[value="-1"]').attr('selected',true);
	$('#variazionePrezzo').val(null);
	$('#articoloVariazione option[value="-1"]').attr('selected',true);
	$('#fornitoreVariazione option[value="-1"]').attr('selected',true);

});

$(document).on('change','#tipologiaVariazionePrezzo', function(){
	var tipologiaVariazionePrezzo = $('#tipologiaVariazionePrezzo option:selected').val();
	var label = $('label[for=variazionePrezzo]').text();
	label = label.replace(' (€)', '');
	label = label.replace(' (%)', '');
	if(tipologiaVariazionePrezzo != '-1'){
		if(tipologiaVariazionePrezzo == 'EURO'){
			label += ' (€)';
		} else {
			label += ' (%)';
		}
	}
	$('label[for=variazionePrezzo]').text(label);
});

$(document).on('change','#fornitoreVariazione', function(){
	var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $('#loadingDiv').removeClass('d-none');
    var fornitore = $('#fornitoreVariazione option:selected').val();
    if(fornitore != null && fornitore != '' && fornitore != '-1'){
        $.ajax({
            url: baseUrl + "fornitori/"+fornitore+"/articoli?attivo=true",
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                if(result != null && result != undefined && result != ''){
                    $('#articoloVariazione').empty();
                    $('#articoloVariazione').append('<option value=-1>Tutti gli articoli</option>');
                    $.each(result, function(i, item){
                        var label = item.codice+'-'+item.descrizione;
                        $('#articoloVariazione').append('<option value="'+item.id+'">'+label+'</option>');
                    });
                } else {
					$('#articoloVariazione').empty();
					$('#articoloVariazione').append('<option value=-1>Tutti gli articoli</option>');
					$.fn.getArticoli();
				}
                $('#articoloVariazione option[value="-1"]').attr('selected', true);
                $('#articoloVariazione').selectpicker('refresh');
                $('#loadingDiv').addClass('d-none');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#alertListino').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento degli articoli').replace('@@alertResult@@', 'danger'));
            }
        });

    } else {
        $('#articoloVariazione').empty();
        $('#articoloVariazione').append('<option value="-1" selected>Tutti gli articoli</option>');
		$('#articoloVariazione').selectpicker('refresh');
        $('#loadingDiv').addClass('d-none');
    }

});

$.fn.extractIdListinoFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idListino') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.preloadPrintOptionsFields = function(){
    $.ajax({
        url: baseUrl + "fornitori?attivo=true&codiceTipo=FORNITORE_ARTICOLI",
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            if(result != null && result != undefined && result != ''){
                $.each(result, function(i, item){
                    var label = item.ragioneSociale;
                    $('#filtroStampaListinoFornitore').append('<option value="'+item.id+'">'+label+'</option>');
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Response text: ' + jqXHR.responseText);
        }
    });

    $.ajax({
        url: baseUrl + "categorie-articoli",
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            if(result != null && result != undefined && result != ''){
                $.each(result, function(i, item){
                    $('#filtroStampaListinoCategoriaArticolo').append('<option value="'+item.id+'" >'+item.nome+'</option>');
                });
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$.fn.getTipologieVariazioniPrezzo = function(){
	$.ajax({
		url: baseUrl + "utils/tipologie-listini-prezzi-variazioni",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#tipologiaVariazionePrezzo').append('<option value="'+item+'">'+item+'</option>');
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
		url: baseUrl + "articoli?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#articoloVariazione').append('<option value="'+item.id+'">'+item.codice+' '+item.descrizione+'</option>');
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
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#fornitoreVariazione').append('<option value="'+item.id+'">'+item.codice+' - '+item.ragioneSociale+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getListino = function(idListino, withRecap){

	var alertContent = '<div id="alertListinoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	if(withRecap){
		$.ajax({
			url: baseUrl + "listini/" + idListino,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {
					var listinoRow = '<td>'+result.nome+'</td>';
					listinoRow += '<td>'+result.tipologia+'</td>';
					if(result.bloccaPrezzi){
                        listinoRow += '<td>Si</td>';
                    } else {
                        listinoRow += '<td>No</td>';
                    }
                    listinoRow += '<td>'+result.note+'</td>';

					$('#listinoRow').append(listinoRow);

					$('#hiddenNomeListino').attr('value', result.nome);
					$('#hiddenTipologiaListino').attr('value', result.tipologia);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertListino').empty().append(alertContent.replace('@@alertText@@',"Errore nel recupero del listino").replace('@@alertResult@@', 'danger'));
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	}

    $.ajax({
        url: baseUrl + "listini/" + idListino,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdListino').attr('value', result.id);
			$('#nome').attr('value', result.nome);
			if(result.bloccaPrezzi === true){
			    $('#bloccaPrezzi').prop('checked', true);
			}
			$('#note').val(result.note);

            if(result.tipologia == 'BASE'){
                $('#tipologiaBase').attr('checked', true);

				$('#tipologiaVariazionePrezzo').parent().addClass('d-none');
				$('#variazionePrezzo').parent().addClass('d-none');
				$('#variazioneRow').addClass('d-none');

				$('#tipologiaVariazionePrezzo option[value="-1"]').attr('selected',true);
				$('#variazionePrezzo').val(null);
				$('#articoloVariazione option[value="-1"]').attr('selected',true);
				$('#fornitoreVariazione option[value="-1"]').attr('selected',true);
            } else {
                $('#tipologiaStandard').attr('checked', true);

				$.ajax({
					url: baseUrl + "listini/"+idListino+"/listini-prezzi-variazioni",
					type: 'GET',
					dataType: 'json',
					success: function(result) {
					    var tipologiaVariazionePrezzo = '-1';
						var variazionePrezzo = null;
						var idFornitore = '-1';
						var idsArticoli = [];

						if(result != null && result != undefined && result != ''){
							$.each(result, function(i, item){
							    if(item.tipologiaVariazionePrezzo != null && item.tipologiaVariazionePrezzo != ''){
							        tipologiaVariazionePrezzo = item.tipologiaVariazionePrezzo;
							    }
								variazionePrezzo = item.variazionePrezzo;
								if(item.fornitore != null){
									idFornitore = item.fornitore.id;
								}
								if(item.articolo != null){
									idsArticoli.push(item.articolo.id);
								}
							});
							$('#tipologiaVariazionePrezzo option[value="'+tipologiaVariazionePrezzo+'"]').attr('selected',true);
							$('#variazionePrezzo').attr('value', variazionePrezzo);
							$('#fornitoreVariazione option[value="'+idFornitore+'"]').attr('selected',true);
							if(idsArticoli != null && idsArticoli.length != 0){
								$('#articoloVariazione').val(idsArticoli)
							} else {
								$('#articoloVariazione').val(["-1"]);
							}
							$('#articoloVariazione').selectpicker('refresh');
						}
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log('Response text: ' + jqXHR.responseText);
						$('#alertListino').empty().append(alertContent.replace('@@alertText@@',"Errore nel recupero delle variazioni dei prezzi. E' comunque possibile proseguire con la modifica").replace('@@alertResult@@', 'warning'));
					}
				});
			}

          } else{
			  $('#alertListino').empty().append(alertContent.replace('@@alertText@@',"Errore nel recupero del listino").replace('@@alertResult@@', 'danger'));
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
			$('#alertListino').empty().append(alertContent.replace('@@alertText@@',"Errore nel recupero del listino").replace('@@alertResult@@', 'danger'));
            $('#updateListinoButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
