var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$.fn.preloadStatistiche();

	$.fn.loadOrdiniClientiTable(baseUrl + "ordini-clienti");

	if(window.location.search.substring(1).indexOf('idOrdineCliente') == -1 || window.location.search.substring(1).indexOf('idTelefonata') == -1){
		$.fn.loadOrdineClienteArticoliTable();
	}

	$(document).on('change','.dataConsegnaOrdineCliente', function(){
		var dataConsegna = $(this).val();
		var ordineClienteId = $(this).attr("data-id");

		var ordineClientePatched = new Object();
		ordineClientePatched.id = parseInt(ordineClienteId);
		ordineClientePatched.dataConsegna = dataConsegna;

		var ordineClientePatchedJson = JSON.stringify(ordineClientePatched);

		var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "ordini-clienti/" + ordineClienteId,
			type: 'PATCH',
			contentType: "application/json",
			dataType: 'json',
			data: ordineClientePatchedJson,
			success: function(result) {
				$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Data consegna modificata con successo').replace('@@alertResult@@', 'success'));
				$('#ordiniClientiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della data di consegna').replace('@@alertResult@@', 'danger'));
				$('#ordiniClientiTable').DataTable().ajax.reload();
			}
		});

	});

	$(document).on('change','.autistaOrdineCliente', function(){
		var idAutista = $(this).val();
		var ordineClienteId = $(this).attr("data-id");

		var ordineClientePatched = new Object();
		ordineClientePatched.id = parseInt(ordineClienteId);
		ordineClientePatched.idAutista = parseInt(idAutista);

		var ordineClientePatchedJson = JSON.stringify(ordineClientePatched);

		var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "ordini-clienti/" + ordineClienteId,
			type: 'PATCH',
			contentType: "application/json",
			dataType: 'json',
			data: ordineClientePatchedJson,
			success: function(result) {
				$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Autista modificato con successo').replace('@@alertResult@@', 'success'));
				$('#ordiniClientiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell autista').replace('@@alertResult@@', 'danger'));
				$('#ordiniClientiTable').DataTable().ajax.reload();
			}
		});

	});

	$(document).on('click','.detailsOrdineCliente', function(){
		var idOrdineCliente = $(this).attr('data-id');

		var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero dell ordine cliente.</strong></div>';

		$.ajax({
			url: baseUrl + "ordini-clienti/" + idOrdineCliente,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {

					var ordineClienteRow = '<td>' + result.progressivo + '/' + result.annoContabile + '</td>';
					if (result.cliente != null) {
						var clienteHtml = '';
						if (result.cliente.dittaIndividuale) {
							clienteHtml += result.cliente.cognome + ' - ' + result.cliente.nome;
						} else {
							clienteHtml += result.cliente.ragioneSociale;
						}
						clienteHtml += ' - ' + result.cliente.partitaIva;

						ordineClienteRow += '<td>' + $.fn.printVariable(clienteHtml) + '</td>';
					} else {
						ordineClienteRow += '<td></td>';
					}
					if (result.puntoConsegna != null) {
						var puntoConsegnaHtml = result.puntoConsegna.nome;
						if (result.puntoConsegna.indirizzo != null && result.puntoConsegna.indirizzo != '') {
							puntoConsegnaHtml += ' - ' + result.puntoConsegna.indirizzo;
						}
						if (result.puntoConsegna.localita != null && result.puntoConsegna.localita != '') {
							puntoConsegnaHtml += ', ' + result.puntoConsegna.localita;
						}
						if (result.puntoConsegna.cap != null && result.puntoConsegna.cap != '') {
							puntoConsegnaHtml += ' ' + result.puntoConsegna.cap;
						}
						if (result.puntoConsegna.provincia != null && result.puntoConsegna.provincia != '') {
							puntoConsegnaHtml += ' (' + result.puntoConsegna.provincia + ')';
						}

						ordineClienteRow += '<td>' + $.fn.printVariable(puntoConsegnaHtml) + '</td>';
					} else {
						ordineClienteRow += '<td></td>';
					}
					ordineClienteRow += '<td>' + $.fn.printVariable(moment(result.dataConsegna).format('DD/MM/YYYY')) + '</td>';
					if (result.autista != null) {
						var autistaHtml = '';
						if (result.autista.nome != null) {
							autistaHtml += result.autista.nome;
						}
						if (result.autista.cognome != null) {
							autistaHtml += ' ' + result.autista.cognome;
						}

						ordineClienteRow += '<td>' + $.fn.printVariable(autistaHtml) + '</td>';
					} else {
						ordineClienteRow += '<td></td>';
					}
					if (result.agente != null) {
						var agenteHtml = '';
						if (result.agente.nome != null) {
							agenteHtml += result.agente.nome;
						}
						if (result.agente.cognome != null) {
							agenteHtml += ' ' + result.agente.cognome;
						}

						ordineClienteRow += '<td>' + $.fn.printVariable(agenteHtml) + '</td>';
					} else {
						ordineClienteRow += '<td></td>';
					}
					if (result.statoOrdine != null) {
						var statoOrdineHtml = '';
						if (result.statoOrdine.descrizione != null) {
							statoOrdineHtml += result.statoOrdine.descrizione;
						}

						ordineClienteRow += '<td>' + $.fn.printVariable(statoOrdineHtml) + '</td>';
					} else {
						ordineClienteRow += '<td></td>';
					}
					ordineClienteRow += '<td>' + $.fn.printVariable(result.note) + '</td>';

					$('#ordineClienteRow').empty().append(ordineClienteRow);

					// populate table of articoli
					if(result.ordineClienteArticoli != null && result.ordineClienteArticoli != undefined){
						$('#detailsOrdineClienteArticoliModalTable').DataTable({
							"retrieve": true,
							"data": result.ordineClienteArticoli,
							"language": {
								"paginate": {
									"first": "Inizio",
									"last": "Fine",
									"next": "Succ.",
									"previous": "Prec."
								},
								"search": "Cerca",
								"emptyTable": "Nessun articolo presente",
								"zeroRecords": "Nessun articolo presente"
							},
							"pageLength": 20,
							"lengthChange": false,
							"info": false,
							"order": [
								[0, 'asc'],
								[2, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name": "codiceDescrizione", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.articolo != null) {
										result = data.articolo.codice+' - '+data.articolo.descrizione;
									}
									return result;
								}},
								{"name": "prezzo", "data": null, render: function (data, type, row) {
									var result = '';
									if (data.prezzo != null) {
										result = data.prezzo;
									}
									return result;
								}},
								{"name": "pezziOrdinati", "data": null, render: function (data, type, row) {
									var result = data.numeroPezziOrdinati;
									return result;
								}},
								{"name": "pezziDaEvadere", "data": null, render: function (data, type, row) {
									var result = data.numeroPezziDaEvadere;
									return result;
								}}
							]
						});
					}

					/*
					if(result.ordineClienteArticoli != null && result.ordineClienteArticoli != undefined){
						result.ordineClienteArticoli.forEach(function(item, i) {
							var codice = item.articolo.codice;
							var descrizione = item.articolo.descrizione;
							var prezzo = item.articolo.prezzoListinoBase;
							var pezzi = item.numeroPezziOrdinati;

							var ordineClienteArticoloRow = '<tr class="table-default">';

							var ordineClienteArticoloTd = '<td>'+codice+' - '+descrizione+'</td>';
							ordineClienteArticoloTd += '<td>'+prezzo+'</td>';
							ordineClienteArticoloTd += '<td>'+pezzi+'</td>';

							ordineClienteArticoloRow += ordineClienteArticoloTd;
							ordineClienteArticoloRow += '</tr>';

							$('#ordineClienteArticoloTableBody').append(ordineClienteArticoloRow);
						});
					}
					*/

				} else{
					$('#detailsOrdineClienteMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsOrdineClienteMainDiv').append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		});


		$('#detailsOrdineClienteModal').modal('show');

	});

	$(document).on('click','.closeOrdineCliente', function(){
		$('#detailsOrdineClienteArticoliModalTable').DataTable().destroy();
		$('#detailsOrdineClienteModal').modal('hide');
	});

	$(document).on('click','.deleteOrdineCliente', function(){
		var idOrdineCliente = $(this).attr('data-id');
		$('#confirmDeleteOrdineCliente').attr('data-id', idOrdineCliente);
		$('#deleteOrdineClienteModal').modal('show');
	});

	$(document).on('click','#confirmDeleteOrdineCliente', function(){
		$('#deleteOrdineClienteModal').modal('hide');
		var idOrdineCliente = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "ordini-clienti/" + idOrdineCliente,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Ordine cliente</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertOrdineCliente').empty().append(alertContent);

				$('#ordiniClientiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateOrdineClienteButton') != null && $('#updateOrdineClienteButton') != undefined){
		$(document).on('submit','#updateOrdineClienteForm', function(event){
			event.preventDefault();

			var ordineCliente = new Object();
			ordineCliente.id = $('#hiddenIdOrdineCliente').val();
			ordineCliente.progressivo = $('#progressivo').val();
            ordineCliente.annoContabile = $('#annoContabile').val();
			ordineCliente.data = $('#data').val();

			var statoOrdine = new Object();
			statoOrdine.id = $('#hiddenStatoOrdineCliente').val();
			ordineCliente.statoOrdine = statoOrdine;

			var clienteId = $('#cliente option:selected').val();
			if(clienteId != null && clienteId != ''){
				var cliente = new Object();
				cliente.id = clienteId;
				ordineCliente.cliente = cliente;
			}

			var puntoConsegnaId = $('#puntoConsegna option:selected').val();
			if(puntoConsegnaId != null && puntoConsegnaId != ''){
				var puntoConsegna = new Object();
				puntoConsegna.id = puntoConsegnaId;
				ordineCliente.puntoConsegna = puntoConsegna;
			}

			var autistaId = $('#autista option:selected').val();
			if(autistaId != null && autistaId != ''){
				var autista = new Object();
				autista.id = autistaId;
				ordineCliente.autista = autista;
			}

			var agenteId = $('#agente option:selected').val();
			if(agenteId != null && agenteId != ''){
				var agente = new Object();
				agente.id = agenteId;
				ordineCliente.agente = agente;
			}
			ordineCliente.dataConsegna = $('#dataConsegna').val();
			ordineCliente.note = $('#note').val();

			var articoliLength = $('.rowArticolo').length;
			if(articoliLength != null && articoliLength != undefined && articoliLength != 0){
				var ordineClienteArticoli = [];
				$('.rowArticolo').each(function(i, item){
					var ordineClienteArticolo = {};
					var ordineClienteArticoloId = new Object();
					var articoloId = $(this).attr('data-id');
					ordineClienteArticoloId.articoloId = articoloId;
					ordineClienteArticolo.id = ordineClienteArticoloId;
					ordineClienteArticolo.numeroPezziOrdinati = $(this).children().eq(2).children().eq(0).val();

					ordineClienteArticoli.push(ordineClienteArticolo);
				});
				ordineCliente.ordineClienteArticoli = ordineClienteArticoli;
			}

			var ordineClienteJson = JSON.stringify(ordineCliente);

			var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ordini-clienti/" + $('#hiddenIdOrdineCliente').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ordineClienteJson,
				success: function(result) {
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Ordine cliente modificato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the list of OrdineCliente
					setTimeout(function() {
						window.location.href = "ordini-clienti.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell ordine cliente').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newOrdineClienteButton') != null && $('#newOrdineClienteButton') != undefined){

		$('#articolo').selectpicker();

		$(document).on('submit','#newOrdineClienteForm', function(event){
			event.preventDefault();

			var ordineCliente = new Object();

			ordineCliente.progressivo = $('#progressivo').val();
			ordineCliente.annoContabile = $('#annoContabile').val();
			ordineCliente.data = $('#data').val();

			var clienteId = $('#cliente option:selected').val();
			if(clienteId != null && clienteId != ''){
				var cliente = new Object();
				cliente.id = clienteId;
				ordineCliente.cliente = cliente;
			}

			var puntoConsegnaId = $('#puntoConsegna option:selected').val();
			if(puntoConsegnaId != null && puntoConsegnaId != ''){
				var puntoConsegna = new Object();
				puntoConsegna.id = puntoConsegnaId;
				ordineCliente.puntoConsegna = puntoConsegna;
			}

			var autistaId = $('#autista option:selected').val();
			if(autistaId != null && autistaId != ''){
				var autista = new Object();
				autista.id = autistaId;
				ordineCliente.autista = autista;
			}

			var agenteId = $('#agente option:selected').val();
			if(agenteId != null && agenteId != ''){
				var agente = new Object();
				agente.id = agenteId;
				ordineCliente.agente = agente;
			}
			ordineCliente.dataConsegna = $('#dataConsegna').val();
			var telefonataId = $('#hiddenIdTelefonata').val();
            if(telefonataId != null && telefonataId != ''){
                var telefonata = new Object();
                telefonata.id = telefonataId;
                ordineCliente.telefonata = telefonata;
            }
			ordineCliente.note = $('#note').val();

			var articoliLength = $('.rowArticolo').length;
			if(articoliLength != null && articoliLength != undefined && articoliLength != 0){
				var ordineClienteArticoli = [];
				$('.rowArticolo').each(function(i, item){
					var ordineClienteArticolo = {};
					var ordineClienteArticoloId = new Object();
					var articoloId = $(this).attr('data-id');
					ordineClienteArticoloId.articoloId = articoloId;
					ordineClienteArticolo.id = ordineClienteArticoloId;
					ordineClienteArticolo.numeroPezziOrdinati = $(this).children().eq(2).children().eq(0).val();

					ordineClienteArticoli.push(ordineClienteArticolo);
				});
				ordineCliente.ordineClienteArticoli = ordineClienteArticoli;
			}

			var ordineClienteJson = JSON.stringify(ordineCliente);

			var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ordini-clienti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ordineClienteJson,
				success: function(result) {
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Ordine cliente creato con successo').replace('@@alertResult@@', 'success'));

					$('#newOrdineClienteButton').attr("disabled", true);

					var locationHref = "ordini-clienti.html";
					var idTelefonata = $('#hiddenIdTelefonata').attr('value');
					if(idTelefonata != null && idTelefonata != undefined && idTelefonata != ""){
						locationHref = "telefonate.html?idTelefonata="+idTelefonata;
					}

					setTimeout(function() {
						window.location.href = locationHref;
					}, 2000);

					// Empty all fields in order to immediately create a new OrdineCliente
                    /*
					$('#cliente option').removeAttr('selected');
                    $('#cliente option[value=""]').attr('selected',true);
                    $('#puntoConsegna').empty();
                    $('#puntoConsegna').attr('disabled', true);
                    $('#loadingDiv').addClass('d-none');
                    $('#dataConsegna').val(moment().add(1, 'days').format('YYYY-MM-DD'));
                    $('#agente option').removeAttr('selected');
                    $('#agente option[value=""]').attr('selected',true);
                    $('#autista option').removeAttr('selected');
                    $('#autista option[value=""]').attr('selected',true);
                    $('#note').val(null);
                    $('.formRowArticolo').remove();
					*/
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nella creazione dell ordine cliente';
					if(jqXHR != null && jqXHR != undefined){
						var jqXHRResponseJson = jqXHR.responseJSON;
						if(jqXHRResponseJson != null && jqXHRResponseJson != undefined && jqXHRResponseJson != ''){
							var jqXHRResponseJsonMessage = jqXHR.responseJSON.message;
							if(jqXHRResponseJsonMessage != null && jqXHRResponseJsonMessage != undefined && jqXHRResponseJsonMessage != '' && jqXHRResponseJsonMessage.indexOf('con progressivo') != -1){
								errorMessage = jqXHRResponseJsonMessage;
							}
						}
					}
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	$(document).on('click','#addArticolo', function(event){
		event.preventDefault();

		var articoloId = $('#articolo option:selected').val();

		if(articoloId == null || articoloId == undefined || articoloId == ''){
			var alertContent = '<div class="alert alert-danger alert-dismissable">\n' +
				'                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>\n' +
				'                Seleziona un articolo\n' +
				'              </div>';

			$('#addOrdineClienteArticoloAlert').empty().append(alertContent);
			return;
		} else {
			$('#addOrdineClienteArticoloAlert').empty();
		}

		var articolo = $('#articolo option:selected').text();
		var prezzoListinoBase = $('#articolo option:selected').attr('data-prezzo-base');
		var pezzi = $('#pezzi').val();

		var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center pezzi" value="'+pezzi+'">';

		// check if a same articolo was already added
		var found = 0;
		var currentRowIndex;
		var currentIdArticolo;
		var currentPezzi = 0;

		var ordineClienteArticoliLength = $('.rowArticolo').length;
		if(ordineClienteArticoliLength != null && ordineClienteArticoliLength != undefined && ordineClienteArticoliLength != 0) {
			$('.rowArticolo').each(function(i, item){

				if(found != 1){
					currentRowIndex = $(this).attr('data-row-index');
					currentIdArticolo = $(this).attr('data-id');

					if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) == $.fn.normalizeIfEmptyOrNullVariable(articoloId)){
						found = 1;
						currentPezzi = $(this).children().eq(2).children().eq(0).val();
					}
				}
			});
		}

		var table = $('#ordineClienteArticoliTable').DataTable();
		if(found == 1){
			//$('tr[data-id="'+currentIdArticolo+'"]').children().eq(3).children().eq(0).val(quantita + $.fn.parseValue(currentQuantita,'float'));
			//$('tr[data-id="'+currentIdArticolo+'"]').children().eq(7).text(totale);

			var newPezzi = $.fn.parseValue(pezzi,'int') + $.fn.parseValue(currentPezzi,'int');

			var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center pezzi" value="'+newPezzi+'">';

			var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
			rowData[2] = newPezziHtml;

			table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();

		} else {
			var deleteLink = '<a class="deleteOrdineClienteArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

			var rowsCount = table.rows().count();

			var rowNode = table.row.add( [
				articolo,
				prezzoListinoBase,
				pezziHtml,
				deleteLink
			] ).draw( false ).node();
			$(rowNode).css('text-align', 'center').css('color','#080707');
			$(rowNode).addClass('rowArticolo');
			$(rowNode).attr('data-id', articoloId);
			$(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);

		}

		$('#articolo option[value=""]').prop('selected',true);
		$('#pezzi').val('');

		$('#articolo').focus();
		$('#articolo').selectpicker('refresh');
	});

	$(document).on('click','.deleteOrdineClienteArticolo', function(){
		$('#ordineClienteArticoliTable').DataTable().row( $(this).parent().parent() )
			.remove()
			.draw();
		$('#ordineClienteArticoliTable').focus();

	});

	/*
	$(document).on('click','#addArticolo', function(){
		$('#addArticoloModal').modal('show');

		$('#addArticoloModalTable').DataTable({
			"ajax": {
				"url": baseUrl + "articoli",
				"type": "GET",
				"content-type": "json",
				"cache": false,
				"dataSrc": "",
				"error": function(jqXHR, textStatus, errorThrown) {
					var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Errore nel recupero degli articoli</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertOrdineClienteAddArticolo').empty().append(alertContent);
				}
			},
			"language": {
				"search": "Cerca",
				"emptyTable": "Nessun articolo disponibile",
				"zeroRecords": "Nessun articolo disponibile"
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
						'data-prezzo="'+data.prezzoListinoBase+'" id="checkbox_'+data.id+'" class="addArticoloCheckbox">';
					return checkboxHtml;
				}},
				{"name": "codice", "data": "codice"},
				{"name": "descrizione", "data": "descrizione"},
				{"name": "prezzoListinoBase", "data": "prezzoListinoBase"},
				{"name": "numeroPezzi", "data": null, "orderable":false, "width": "12%", render: function ( data, type, row ) {
					var numeroPezziHtml = '<input type="number" class="form-control" id="pezzi_'+data.id+'" step="1" min="0" value="1">';
					return numeroPezziHtml;
				}}

			]
		});
	});

	$(document).on('click','#confirmAddArticoloModal', function(){
		var numChecked = $('.addArticoloCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertOrdineClienteAddArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno un articolo</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertOrdineClienteAddArticolo').empty().append(alertContent);
		} else{
			var alreadyAddedRows = $('.formRowArticolo').length;
			if(alreadyAddedRows == null || alreadyAddedRows == undefined){
				alreadyAddedRows = 0;
			}
			if(alreadyAddedRows != 0){
				var rowsIdPresent = [];
				$('.formRowArticolo').each(function(i,item){
					var itemId = item.id;
					rowsIdPresent.push(itemId.replace('formRowArticolo_',''));
				});
			}
			$('.addArticoloCheckbox:checkbox:checked').each(function(i, item){
				var id = item.id.replace('checkbox_','');
				var codice = $('#'+item.id).attr('data-codice');
				var pezzi = $('#pezzi_'+id).val();

				if($.inArray(id, rowsIdPresent) != -1){
					var alertContent = '<div id="alertOrdineClienteAddArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>L articolo '+codice+' &egrave; gi&agrave; stato selezionato</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertOrdineClienteAddArticolo').empty().append(alertContent);
				} else{
					var descrizione = $('#'+item.id).attr('data-descrizione');
					var prezzoListinoBase = $('#'+item.id).attr('data-prezzo');

					var rowHtml = $.fn.createArticoloRow(id, codice, descrizione, prezzoListinoBase, pezzi, i, alreadyAddedRows);

					$('#formRowArticoli').append(rowHtml);

					$('#addArticoloModalTable').DataTable().destroy();
					$('#alertOrdineClienteAddArticoloContent').alert('close');
					$('#addArticoloModal').modal('hide');
				}
			});
		}
	});

	$(document).on('click','.annullaAddArticoloModal', function(){
		$('#addArticoloModalTable').DataTable().destroy();
		$('#alertOrdineClienteAddArticoloContent').alert('close');
		$('#addArticoloModal').modal('hide');
	});

	$(document).on('click','.deleteAddArticolo', function(){
		var firstId = $('.formRowArticolo').first().attr('data-id');
		if(firstId == null || firstId == undefined){
			firstId = -1;
		}
		var id = $(this).attr('data-id');
		$('#formRowArticolo_'+id).remove();
		if(id == firstId){
			var firstRow = $('.formRowArticolo').first();
			if(firstRow != null && firstRow != undefined && firstRow.length != 0){
				$('#'+firstRow.attr('id')).find('input').each(function(i, item){
					var id = item.id;
					var label = '';
					if(id.indexOf('codice') != '-1'){
						label = '<label for="codiceArticolo">Codice</label>';
					} else if(id.indexOf('descrizione') != '-1'){
						label = '<label for="descrizioneArticolo">Descrizione</label>';
					} else if(id.indexOf('prezzo') != '-1'){
						label = '<label for="prezzoArticolo">Prezzo listino base (&euro;)</label>';
					} else{
						label = '<label for="pezziArticolo">Numero pezzi</label>';
					}
					if(id.indexOf('pezzi') != '-1'){
						$('#'+id).parent().before(label);
					} else {
						$('#'+id).before(label);
					}
				});
			}
		}
	});
	*/

	$(document).on('change','#cliente', function(){
		$('#loadingDiv').removeClass('d-none');
		$('#loadingAgenteDiv').removeClass('d-none');

		$('#articolo option[value=""]').prop('selected', true);
		$('#pezzi').val('');

		var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$('#alertOrdineCliente').empty();

		$.fn.emptyArticoli();

		var cliente = $('#cliente option:selected').val();
		var idAgente = $('#cliente option:selected').attr('data-id-agente');
		var hasNoteDocumenti = $('#cliente option:selected').attr('data-has-note-documenti');
		if(cliente != null && cliente != ''){
			$.ajax({
				url: baseUrl + "clienti/"+cliente+"/punti-consegna",
				type: 'GET',
				dataType: 'json',
				success: function(result) {
					if(result != null && result != undefined && result != ''){
						$('#puntoConsegna').empty();
						$.each(result, function(i, item){

							var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+'('+item.provincia+')';
							var optionHtml = '<option value="'+item.id+'"';
							if(i == 0){
								optionHtml += ' selected';
							}
							optionHtml += '>'+label+'</option>';
							$('#puntoConsegna').append(optionHtml);
						});
					}
					$('#puntoConsegna').removeAttr('disabled');
					$('#loadingDiv').addClass('d-none');

					$('#agente option').removeAttr('selected');
					if(idAgente != null && idAgente != '-1'){
						$('#agente option[value="' + idAgente +'"]').attr('selected', true);
					}

					$.fn.loadStatistiche();

					$.fn.checkOrdiniArticoliDaEvadere(cliente);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
				}
			});

			$.fn.handleClienteNoteDocumenti(hasNoteDocumenti);

			$('#articolo').removeAttr('disabled');
			$('#articolo').selectpicker('refresh');

			$('#hiddenIdTelefonata').attr('value', '');

		} else {
			$('#updateClienteNoteDocumenti').attr('hidden', true);

			$('#agente option').removeAttr('selected');

			$('#puntoConsegna').empty();
			$('#puntoConsegna').attr('disabled', true);
			$('#loadingDiv').addClass('d-none');
			$('#articolo').removeAttr('disabled');
			$('#articolo').selectpicker('refresh');
			$('#hiddenIdTelefonata').attr('value', '');
		}
	});

	$(document).on('change','#puntoConsegna', function(){
		$.fn.loadStatistiche();
	});

	$(document).on('click','.statsArticolo', function(event){
		event.preventDefault();

		$.fn.addArticoloFromStats($(this));
	});

	$(document).on('click','#resetSearchOrdineClienteButton', function(){
		$('#searchOrdineClienteForm :input').val(null);
		$('#searchOrdineClienteForm select option[value=""]').attr('selected', true);

		$('#ordiniClientiTable').DataTable().destroy();
		$.fn.loadOrdiniClientiTable(baseUrl + "ordini-clienti");
	});

	if($('#searchOrdineClienteButton') != null && $('#searchOrdineClienteButton') != undefined) {
		$(document).on('submit', '#searchOrdineClienteForm', function (event) {
			event.preventDefault();

			var cliente = $('#searchCliente').val();
			var dataConsegna = $('#searchData').val();
			var idAutista = $('#searchAutista option:selected').val();
			var idStato = $('#searchStato option:selected').val();

			var params = {};
			if(cliente != null && cliente != undefined && cliente != ''){
				params.cliente = cliente;
			}
			if(dataConsegna != null && dataConsegna != undefined && dataConsegna != ''){
				params.dataConsegna = dataConsegna;
			}
			if(idAutista != null && idAutista != undefined && idAutista != ''){
				params.idAutista = idAutista;
			}
			if(idStato != null && idStato != undefined && idStato != ''){
				params.idStato = idStato;
			}
			var url = baseUrl + "ordini-clienti?" + $.param(params);

			$('#ordiniClientiTable').DataTable().destroy();
			$.fn.loadOrdiniClientiTable(url);
		});
	}

});

$.fn.emptyArticoli = function(){
	$('#ordineClienteArticoliTable').DataTable().rows()
		.remove()
		.draw();
}

$.fn.loadOrdineClienteArticoliTable = function() {
	$('#ordineClienteArticoliTable').DataTable({
		"retrieve": true,
		"searching": false,
		"language": {
			"paginate": {
				"first": "Inizio",
				"last": "Fine",
				"next": "Succ.",
				//"previous": "<i class=\"fa fa-backward\" aria-hidden=\"true\"></i>"
				"previous": "Prec."
			},
			"emptyTable": "",
			"zeroRecords": ""
		},
		"pageLength": 50,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"columns": [
			{ "width": "20%" },
			{ "width": "20%" },
			{ "width": "10%" },
			{ "width": "2%" }
		],
		"order": [
			[0, 'asc']
		]
	});
}

$.fn.loadOrdiniClientiTable = function(url){
	if($('#ordiniClientiTable') != null && $('#ordiniClientiTable') != undefined && $('#ordiniClientiTable').length > 0){

		var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero degli ordini clienti</strong>\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		$.ajax({
			url: baseUrl + "autisti",
			type: 'GET',
			dataType: 'json',
			success: function(autistiResult) {

				$('#ordiniClientiTable').DataTable({
					"ajax": {
						"url": url,
						"type": "GET",
						"content-type": "json",
						"cache": false,
						"dataSrc": "",
						"error": function(jqXHR, textStatus, errorThrown) {
							console.log('Response text: ' + jqXHR.responseText);
							var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
							alertContent = alertContent + '<strong>Errore nel recupero degli ordini clienti</strong>\n' +
								'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
							$('#alertOrdineCliente').empty().append(alertContent);
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
						"emptyTable": "Nessun ordine cliente disponibile",
						"zeroRecords": "Nessun ordine cliente disponibile"
					},
					"searching": false,
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
						{"name":"stato", "data": "statoOrdine.ordine", "width":"5%", "visible": false},
						{"name":"progressivo", "data": "progressivo", "width":"5%", "visible": false},
						{"name":"annoContabile", "data": "annoContabile", "width":"5%", "visible": false},
						{"name":"dataConsegna", "data": "dataConsegna", "width":"5%", "visible": false},
						{"name":"codice", "width":"8%", "data": null, render: function ( data, type, row ) {
							return data.progressivo + '/' + data.annoContabile;
						}},
						{"name":"data", "width":"10%", "data": null, render: function ( data, type, row ) {
							if(data.data != null){
								return moment(data.data).format('YYYY-MM-DD')
							}
							return '';
						}},
						{"name":"cliente", "width":"12%", "data": null, render: function ( data, type, row ) {
							if(data.cliente != null){
								var clienteHtml = '';

								if(data.cliente.dittaIndividuale){
									clienteHtml += data.cliente.cognome + ' ' + data.cliente.nome;
								} else if(data.cliente.privato){
									clienteHtml += data.cliente.cognome + ' ' + data.cliente.nome;
								} else {
									clienteHtml += data.cliente.ragioneSociale;
								}
								return clienteHtml;
							} else {
								return '';
							}
						}},
						{"name":"puntoConsegna", "width":"12%", "data": null, render: function ( data, type, row ) {
							if(data.puntoConsegna != null){
								var puntoConsegnaHtml = '';

								if(data.puntoConsegna.indirizzo != null){
									puntoConsegnaHtml += data.puntoConsegna.indirizzo;
								}
								if(data.puntoConsegna.localita != null){
									puntoConsegnaHtml += ' ' + data.puntoConsegna.localita;
								}
								return puntoConsegnaHtml;
							} else {
								return '';
							}
						}},
						{"name": "dataConsegna", "width":"10%", "data": null, render: function ( data, type, row ) {
							var ordineClienteId = data.id;
							var inputId = "dataConsegna_" + ordineClienteId;
							var dataConsegnaInput = '<input type="date" class="form-control form-control-sm dataConsegnaOrdineCliente" id="'+inputId+'" data-id="'+ordineClienteId+'"';

							if(data.dataConsegna != null){
								var dataConsegnaFormatted = moment(data.dataConsegna).format('YYYY-MM-DD');
								dataConsegnaInput += ' value="'+dataConsegnaFormatted+'"';
							}
							dataConsegnaInput += '>';
							return dataConsegnaInput;
						}},
						{"name":"autista", "width":"12%", "data": null, render: function ( data, type, row ) {
							var ordineClienteId = data.id;
							var selectId = "autista_" + ordineClienteId;

							var autistaId = null;
							if(data.autista != null){
								autistaId = data.autista.id;
							}

							var autistaSelect = '<select id="'+selectId+'" class="form-control form-control-sm autistaOrdineCliente" data-id="'+ordineClienteId+'">';
							if(autistiResult != null && autistiResult != undefined && autistiResult != ''){
								$.each(autistiResult, function(i, item){
									var label = item.nome + ' ' + item.cognome;
									var optionHtml = '<option value="'+item.id+'"';
									if(autistaId != null && autistaId != undefined){
										if(autistaId == item.id){
											optionHtml += ' selected';
										}
									}
									optionHtml += '>'+label+'</option>';
									autistaSelect += optionHtml;
								});
							}
							autistaSelect += '</select';
							return autistaSelect;

						}},
						{"name":"agente", "width":"12%", "data": null, render: function ( data, type, row ) {
							if(data.agente != null){
								var agenteHtml = '';

								if(data.agente.nome){
									agenteHtml += data.agente.nome;
								}
								if(data.agente.cognome){
									agenteHtml += ' ' + data.agente.cognome;
								}
								return agenteHtml;
							} else {
								return '';
							}
						}},
						{"data": null, "orderable":false, "width":"5%", render: function ( data, type, row ) {
							var links = '<a class="detailsOrdineCliente pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle" title="Dettagli"></i></a>';

							var stato = data.statoOrdine;
							if(stato != null && stato != undefined && stato != '' && stato.codice == 'DA_EVADERE'){
								links += '<a class="updateOrdineCliente pr-2" data-id="'+data.id+'" href="ordini-clienti-edit.html?idOrdineCliente=' + data.id + '"><i class="far fa-edit"></i></a>';
							}
							links += '<a class="deleteOrdineCliente" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
							return links;
						}}
					],
					"createdRow": function(row, data, dataIndex,cells){
						$(row).css('font-size', '12px');
						if(data.statoOrdine != null){
							var backgroundColor = '';
							if(data.statoOrdine.codice == 'EVASO'){
								backgroundColor = '#a3f59d';
							} else if(data.statoOrdine.codice == 'PARZIALMENTE_EVASO'){
								backgroundColor = '#fcf456';
							} else {
								backgroundColor = 'trasparent';
							}
							$(row).css('background-color', backgroundColor);
						}
					}
				});

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				$('#alertOrdineCliente').empty().append(alertContent);
			}
		});

	}
}

$.fn.normalizeIfEmptyOrNullVariable = function(variable){
	if(variable != null && variable != undefined && variable != ''){
		return variable;
	}
	if(variable == null || variable == undefined){
		return '';
	}
	return '';
}

$.fn.parseValue = function(value, resultType){
	if(value != null && value != undefined && value != ''){
		if(resultType == 'float'){
			return parseFloat(value);
		} else if(resultType == 'int'){
			return parseInt(value);
		} else {
			return value;
		}
	} else {
		if(resultType == 'float'){
			return 0.0;
		} else {
			return 0;
		}
	}
}

$.fn.printVariable = function(variable){
	if(variable != null && variable != undefined && variable != ""){
		return variable;
	}
	return "";
}

$.fn.extractIdOrdineClienteFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idOrdineCliente') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.extractIdTelefonataFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idTelefonata') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.normalizeIfEmptyOrNullVariable = function(variable){
	if(variable != null && variable != undefined && variable != ''){
		return variable;
	}
	if(variable == null || variable == undefined){
		return '';
	}
	return '';
}

$.fn.getClienti = function(){

	//return $.Deferred(function() {
	return	$.ajax({
			url: baseUrl + "clienti",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						var label = '';
						if(item.dittaIndividuale){
							label += item.cognome + ' ' + item.nome;
						} else if(item.privato){
							label += item.cognome + ' ' + item.nome;
						} else {
							label += item.ragioneSociale;
						}
						label += ' - ' + item.partitaIva + ' - ' + item.codiceFiscale;

						var agente = item.agente;
						var idAgente = '-1';
						if(agente != null) {
							idAgente = agente.id;
						}
						var hasNoteDocumenti = 0;
						if(!$.fn.checkVariableIsNull(item.noteDocumenti)){
							hasNoteDocumenti = 1;
						}
						$('#cliente').append('<option value="'+item.id+'" data-id-agente="'+idAgente+'" data-has-note-documenti='+hasNoteDocumenti+'>'+label+'</option>');
					});
					console.log("CLIENTI");
				}
				$('#dataConsegna').val(moment().add(1, 'days').format('YYYY-MM-DD'));

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	//});
}

$.fn.getAutisti = function(){

	//return $.Deferred(function() {
	return	$.ajax({
			url: baseUrl + "autisti?attivo=true",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						var label = item.cognome + ' ' + item.nome;
						$('#autista').append('<option value="'+item.id+'">'+label+'</option>');
					});
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	//});
}

$.fn.getAgenti = function(){

	//return $.Deferred(function() {
	return	$.ajax({
			url: baseUrl + "agenti",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						var label = item.cognome + ' ' + item.nome;
						$('#agente').append('<option value="'+item.id+'">'+label+'</option>');
					});
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	//});
}

$.fn.getArticoli = function(){

	//return $.Deferred(function() {
	return	$.ajax({
			url: baseUrl + "articoli?attivo=true",
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$.each(result, function(i, item){
						var dataPrezzoBase = item.prezzoListinoBase;
						$('#articolo').append('<option value="'+item.id+'" data-prezzo-base="'+dataPrezzoBase+'" >'+item.codice+' '+item.descrizione+'</option>');

						$('#articolo').selectpicker('refresh');
					});
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	//});
}

$.fn.preloadFields = function(){
	return $.ajax({
		url: baseUrl + "ordini-clienti/progressivo",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				//$('#progressivo').attr('value', result.progressivo);
				$('#annoContabile').attr('value', result.annoContabile);
				$('#data').val(moment().format('YYYY-MM-DD'));
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.preloadStatistiche = function(){
	var lastWeekStart = moment().subtract(1, 'weeks').startOf('isoWeek');
	var lastWeekEnd = moment(lastWeekStart).add(6, 'days');

	$('#statisticheSettimanaFromTo').text(lastWeekStart.format('DD/MM/YYYY')+' - '+lastWeekEnd.format('DD/MM/YYYY'));

	var lastMonthStart = moment().subtract(1, 'months').startOf('month');
	var lastMonthEnd = moment(lastMonthStart).endOf('month');

	$('#statisticheMeseFromTo').text(lastMonthStart.format('DD/MM/YYYY')+' - '+lastMonthEnd.format('DD/MM/YYYY'));
};

$.fn.preloadSearchFields = function(){

	$.ajax({
		url: baseUrl + "autisti",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchAutista').append('<option value="'+item.id+'" >'+item.nome+' '+item.cognome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
	$.ajax({
		url: baseUrl + "stati-ordine",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#searchStato').append('<option value="'+item.id+'" >'+item.descrizione+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getOrdineCliente = function(idOrdineCliente){

	var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>@@alertText@@</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
        url: baseUrl + "ordini-clienti/" + idOrdineCliente,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdOrdineCliente').attr('value', result.id);
			$('#progressivo').attr('value', result.progressivo);
            $('#annoContabile').attr('value', result.annoContabile);
            $('#data').attr('value', result.data);
			$('#hiddenStatoOrdineCliente').attr('value', result.statoOrdine.id);

			if(result.cliente != null && result.cliente != undefined){
				$('#cliente option[value="' + result.cliente.id +'"]').attr('selected', true);
				$.ajax({
				  url: baseUrl + "clienti/"+result.cliente.id+"/punti-consegna",
				  type: 'GET',
				  dataType: 'json',
				  success: function(result) {
					  if(result != null && result != undefined && result != ''){
						  $.each(result, function(i, item){
							  var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+'('+item.provincia+')';
							  var selected = '';
							  if(result.puntoConsegna != null){
								  if(result.puntoConsegna.id == item.id){
									  selected = 'selected';
								  }
							  }
							  $('#puntoConsegna').append('<option value="'+item.id+'" '+selected+'>'+label+'</option>');
						  });
					  }
					  $('#puntoConsegna').removeAttr('disabled');

					  $.fn.loadStatistiche();
				  },
				  error: function(jqXHR, textStatus, errorThrown) {
					  $('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna'));
				  }
				});
			}

			if(result.autista != null && result.autista != undefined){
				$('#autista option[value="' + result.autista.id +'"]').attr('selected', true);
			};
			if(result.agente != null && result.agente != undefined){
				$('#agente option[value="' + result.agente.id +'"]').attr('selected', true);
			};
			$('#dataConsegna').attr('value', result.dataConsegna);
			$('#note').val(result.note);

			  if(result.ordineClienteArticoli != null && result.ordineClienteArticoli != undefined && result.ordineClienteArticoli.length != 0){

				  //var table = $('#ordineClienteArticoliTable').DataTable();
				  //if(table != null){
					//  table.destroy();
					//  $.fn.loadOrdineClienteArticoliTable();
				  //}
				  $.fn.loadOrdineClienteArticoliTable();
				  var table = $('#ordineClienteArticoliTable').DataTable();

				  result.ordineClienteArticoli.forEach(function(item, i){
					  var articolo = item.articolo;
					  var articoloId = item.id.articoloId;
					  var articoloDesc = articolo.codice+' '+articolo.descrizione;
					  var pezzi = item.numeroPezziOrdinati;
					  var prezzoListinoBase = articolo.prezzoListinoBase;

					  var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center" value="'+pezzi+'">';

					  var deleteLink = '<a class="deleteOrdineClienteArticolo" data-id="'+articoloId+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

					  var rowNode = table.row.add( [
						  articoloDesc,
						  prezzoListinoBase,
						  pezziHtml,
						  deleteLink
					  ] ).draw( false ).node();
					  $(rowNode).css('text-align', 'center').css('color','#080707');
					  $(rowNode).addClass('rowArticolo');
					  $(rowNode).attr('data-id', articoloId);

					  $('#articolo option[value=""]').prop('selected',true);
					  $('#pezzi').val('');

					  $('#articolo').focus();
					  $('#articolo').selectpicker('refresh');

				  });
			  }

			/*if(result.ordineClienteArticoli != null && result.ordineClienteArticoli != undefined && result.ordineClienteArticoli.length != 0){
				result.ordineClienteArticoli.forEach(function(item, i){
					var id = item.id.articoloId;
					var codice = item.articolo.codice;
					var descrizione = item.articolo.descrizione;
					var prezzo = item.articolo.prezzoListinoBase;
					var pezzi = item.numeroPezziOrdinati;

					var rowHtml = '<div class="form-row formRowArticolo" data-id="'+id+'" id="formRowArticolo_'+id+'">' +
						'<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="codiceArticolo">Codice</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="codiceArticolo_'+id+'" disabled value="'+codice+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-4">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="descrizioneArticolo">Descrizione</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control" id="descrizioneArticolo_'+id+'" disabled value="'+descrizione+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-3">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="prezzoArticolo">Prezzo listino base (&euro;)</label>';
					}
					rowHtml = rowHtml + '<input type="number" class="form-control" id="prezzoArticolo_'+id+'" disabled value="'+prezzo+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0){
						rowHtml = rowHtml + '<label for="pezziArticolo">Numero pezzi</label>';
					}
					rowHtml = rowHtml + '<div class="input-group">';
					rowHtml = rowHtml + '<input type="number" class="form-control pezziArticolo" id="pezziArticolo_'+id+'" step="1" min="0" value="'+pezzi+'">';
					rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddArticolo" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
					rowHtml = rowHtml + '</div></div></div>';
					rowHtml = rowHtml + '</div>';

					$('#formRowArticoli').append(rowHtml);
				});
			}*/
          } else{
            $('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel recupero dell ordine cliente.'));
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertOrdineCliente').append(alertContent);
            $('#updateOrdineClienteButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}

$.fn.getTelefonata = function(idTelefonata){
	var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$('#articolo option[value=""]').prop('selected', true);
	$('#pezzi').val('');

	$.ajax({
		url: baseUrl + "telefonate/" + idTelefonata,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){

				$('#hiddenIdTelefonata').attr('value', idTelefonata);
				$('#annullaOrdineClienteButton').attr('href', "telefonate.html?idTelefonata="+idTelefonata);

				if(result.autista != null){
					$('#autista option[value="' + result.autista.id +'"]').attr('selected', true);
				}
				if(result.cliente != null){
					$('#cliente option[value="' + result.cliente.id +'"]').attr('selected', true);
					$.ajax({
						url: baseUrl + "clienti/"+result.cliente.id+"/punti-consegna",
						type: 'GET',
						dataType: 'json',
						success: function(result2) {
							if(result2 != null && result2 != undefined && result2 != ''){
								$.each(result2, function(i, item){
									var label = item.nome+' - '+item.indirizzo+' '+item.localita+', '+item.cap+'('+item.provincia+')';
									var selected = '';
									if(result.puntoConsegna != null){
										if(result.puntoConsegna.id == item.id){
											selected = 'selected';
										}
									}
									$('#puntoConsegna').append('<option value="'+item.id+'" '+selected+'>'+label+'</option>');
								});
							}
							$('#puntoConsegna').removeAttr('disabled');

							$.fn.loadStatistiche();
						},
						error: function(jqXHR, textStatus, errorThrown) {
							$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
						}
					});
				}
				$('#articolo').removeAttr('disabled');
				$('#articolo').selectpicker('refresh');

				console.log("TELEFONATA");

			} else{
				$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel recupero della telefonata'));
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel recupero della telefonata'));
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.loadStatisticheSettimana = function(idCliente, idPuntoConsegna, alertContent){

	return $.Deferred(function() {

		$.ajax({
			url: baseUrl + "ordini-clienti-statistiche/settimana?idCliente="+idCliente+"&idPuntoConsegna="+idPuntoConsegna,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$('.statisticheSettimanaList').empty();
					$.each(result, function(i, item){
						var listHtml = '<li class="list-group-item pl-0 pr-0">';
						listHtml += '<a href="" class="statsArticolo" data-id-articolo="'+item.id+'" data-codice-articolo="'+item.codice+'" data-descrizione-articolo="'+item.descrizione+'" data-prezzo-listino-base-articolo="'+item.prezzoListinoBase+'">'+item.codice+' '+item.descrizione+'</a></li>';

						$('.statisticheSettimanaList').append(listHtml);
					});
				} else {
					$('.statisticheSettimanaList').empty().append('<li class="list-group-item statisticheSettimanaEmptyList pl-0 pr-0">Nessuna statistica</li>');
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel recupero delle statistiche'));
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	});
}

$.fn.loadStatisticheMese = function(idCliente, idPuntoConsegna, alertContent){

	return $.Deferred(function() {

		$.ajax({
			url: baseUrl + "ordini-clienti-statistiche/mese?idCliente="+idCliente+"&idPuntoConsegna="+idPuntoConsegna,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					$('.statisticheMeseList').empty();
					$.each(result, function(i, item){
						var listHtml = '<li class="list-group-item pl-0 pr-0">';
						listHtml += '<a href="" class="statsArticolo" data-id-articolo="'+item.id+'" data-codice-articolo="'+item.codice+'" data-descrizione-articolo="'+item.descrizione+'" data-prezzo-listino-base-articolo="'+item.prezzoListinoBase+'">'+item.codice+' '+item.descrizione+'</a></li>';

						$('.statisticheMeseList').append(listHtml);
					});
				} else {
					$('.statisticheMeseList').empty().append('<li class="list-group-item statisticheMeseEmptyList pl-0 pr-0">Nessuna statistica</li>');
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel recupero delle statistiche'));
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

	});
}

$.fn.loadStatistiche = function(){
	var idCliente = $('#cliente option:selected').val();
	var idPuntoConsegna = $('#puntoConsegna option:selected').val();

	var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	if(idCliente == null || idCliente == ''){
		$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Cliente obbligatorio per il recupero delle statistiche'));
		return;
	}
	if(idPuntoConsegna == null || idPuntoConsegna == ''){
		$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Punto di consegna obbligatorio per il recupero delle statistiche'));
		return;
	}

	$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Recupero statistiche in corso...'));

	$.when($.fn.loadStatisticheSettimana(idCliente, idPuntoConsegna, alertContent), $.fn.loadStatisticheMese(idCliente, idPuntoConsegna, alertContent)).then(
		$('#alertOrdineCliente').empty()
	);

};

$.fn.checkOrdiniArticoliDaEvadere = function(idCliente){

	var alertContent = '<div id="alertOrdineClienteContent" class="alert alert-warning alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '@@alertText@@\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "ordini-clienti/ordini-articoli-da-evadere?idCliente="+idCliente,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$('.alertOrdineCliente').empty();
				var content = '<ul>'
				$.each(result, function(i, item){
					content += '<li class="">'+item.descrizione+'</li>';
				});
				content += '</ul>'
				$('#alertOrdineCliente').append(alertContent.replace('@@alertText@@',content));
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertOrdineCliente').empty().append(alertContent.replace('@@alertText@@','Errore nel controllo di ordini precedenti da evadere'));
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
};

$.fn.createArticoloRow = function(id, codice, descrizione, prezzoListinoBase, pezzi, index, alreadyAddedRows){
	var rowHtml = '<div class="form-row formRowArticolo" data-id="'+id+'" id="formRowArticolo_'+id+'">' +
		'<div class="form-group col-md-2">';

	if(index == 0 && alreadyAddedRows == 0){
		rowHtml = rowHtml + '<label for="codiceArticolo">Codice</label>';
	}
	rowHtml = rowHtml + '<input type="text" class="form-control form-control-sm" id="codiceArticolo_'+id+'" disabled value="'+codice+'"></div>';
	rowHtml = rowHtml + '<div class="form-group col-md-4">';

	if(index == 0 && alreadyAddedRows == 0){
		rowHtml = rowHtml + '<label for="descrizioneArticolo">Descrizione</label>';
	}
	rowHtml = rowHtml + '<input type="text" class="form-control form-control-sm" id="descrizioneArticolo_'+id+'" disabled value="'+descrizione+'"></div>';
	rowHtml = rowHtml + '<div class="form-group col-md-3">';

	if(index == 0 && alreadyAddedRows == 0){
		rowHtml = rowHtml + '<label for="prezzoArticolo">Prezzo listino base (&euro;)</label>';
	}
	rowHtml = rowHtml + '<input type="number" class="form-control form-control-sm" id="prezzoArticolo_'+id+'" disabled value="'+prezzoListinoBase+'"></div>';
	rowHtml = rowHtml + '<div class="form-group col-md-2">';

	if(index == 0 && alreadyAddedRows == 0){
		rowHtml = rowHtml + '<label for="pezziArticolo">Numero pezzi</label>';
	}
	rowHtml = rowHtml + '<div class="input-group">';
	rowHtml = rowHtml + '<input type="number" class="form-control form-control-sm pezziArticolo" id="pezziArticolo_'+id+'" step="1" min="0" value="'+pezzi+'">';
	rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddArticolo" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
	rowHtml = rowHtml + '</div></div></div>';
	rowHtml = rowHtml + '</div>';

	return rowHtml;
};

$.fn.addArticoloFromStats = function(articolo){

	var idArticolo = articolo.attr('data-id-articolo');
	var codiceArticolo = articolo.attr('data-codice-articolo');
	var descrizioneArticolo = articolo.attr('data-descrizione-articolo');
	var prezzoListinoBase = articolo.attr('data-prezzo-listino-base-articolo');
	var pezzi = 1;
	var articolo = codiceArticolo + ' ' +descrizioneArticolo;

	var pezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center" value="'+pezzi+'">';

	var found = 0;
	var currentRowIndex;
	var currentIdArticolo;
	var currentPezzi = 0;

	var articoliLength = $('.rowArticolo').length;
	if(articoliLength != null && articoliLength != undefined && articoliLength != 0) {
		$('.rowArticolo').each(function(i, item){

			if(found != 1){
				currentRowIndex = $(this).attr('data-row-index');
				currentIdArticolo = $(this).attr('data-id');

				if($.fn.normalizeIfEmptyOrNullVariable(currentIdArticolo) == $.fn.normalizeIfEmptyOrNullVariable(idArticolo)){
					found = 1;
					currentPezzi = $(this).children().eq(2).children().eq(0).val();
				}
			}
		});
	}

	var table = $('#ordineClienteArticoliTable').DataTable();

	if(found == 1){
		var newPezzi = $.fn.parseValue(pezzi,'int') + $.fn.parseValue(currentPezzi,'int');

		var newPezziHtml = '<input type="number" step="1" min="0" class="form-control form-control-sm text-center pezzi" value="'+newPezzi+'">';

		var rowData = table.row("[data-row-index='"+currentRowIndex+"']").data();
		rowData[2] = newPezziHtml;

		table.row("[data-row-index='"+currentRowIndex+"']").data(rowData).draw();

	} else {
		var deleteLink = '<a class="deleteOrdineClienteArticolo" data-id="'+idArticolo+'" href="#"><i class="far fa-trash-alt" title="Rimuovi"></i></a>';

		var rowsCount = table.rows().count();

		var rowNode = table.row.add( [
			articolo,
			prezzoListinoBase,
			pezziHtml,
			deleteLink
		] ).draw( false ).node();
		$(rowNode).css('text-align', 'center').css('color','#080707');
		$(rowNode).addClass('rowArticolo');
		$(rowNode).attr('data-id', idArticolo);
		$(rowNode).attr('data-row-index', parseInt(rowsCount) + 1);

	}
	$('#articolo option[value=""]').prop('selected',true);
	$('#pezzi').val('');

	$('#articolo').focus();
	$('#articolo').selectpicker('refresh');


}