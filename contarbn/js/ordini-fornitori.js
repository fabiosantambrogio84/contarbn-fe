var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#ordiniFornitoriTable').DataTable({
		"ajax": {
			"url": baseUrl + "ordini-fornitori",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertOrdineFornitoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero degli ordini fornitori</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertOrdineFornitore').empty().append(alertContent);
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
			"emptyTable": "Nessun ordine fornitore disponibile",
			"zeroRecords": "Nessun ordine fornitore disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'desc'],
			[1, 'desc']
		],
		"columns": [
			{"name":"annoContabile", "data": "annoContabile", "width":"5%", "visible": false},
			{"name":"progressivo", "data": "progressivo", "width":"5%", "visible": false},
            {"name":"codice", "data": null, render: function ( data, type, row ) {
                return data.progressivo + '/' + data.annoContabile;
            }},
			{"name":"fornitore", "data": null, render: function ( data, type, row ) {
				if(data.fornitore != null){
					var fornitoreHtml = data.fornitore.ragioneSociale;

					return fornitoreHtml;
				} else {
					return '';
				}
			}},
			{"name": "dataInserimento", "data": null, render: function ( data, type, row ) {
				if(data.dataInserimento != null){
					var a = moment(data.dataInserimento);
					return a.format('DD/MM/YYYY');
				} else {
					return '';
				}
			}},
			{"data": null, "orderable":false, "width":"15%", render: function ( data, type, row ) {
				var links = '<a class="detailsOrdineFornitore pr-1" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle" title="Dettagli"></i></a>';
				if(data.emailInviata == 'N'){
					links += '<a class="updateOrdineFornitore pr-1" data-id="'+data.id+'" href="ordini-fornitori-edit.html?idOrdineFornitore=' + data.id + '"><i class="far fa-edit"></i></a>';
				}
				links += '<a class="printOrdineFornitore pr-1" data-id="'+data.id+'" href="#" title="Stampa"><i class="fa fa-print"></i></a>';
				var fornitore = data.fornitore;
				if(fornitore != null){
					var email = fornitore.emailOrdini;
					if(data.emailInviata == 'N' && email != null && email != undefined && email != ""){
						links += '<a class="emailOrdineFornitore pr-1" data-id="'+data.id+'" data-email-to="'+email+'" href="#" title="Invio email"><i class="fa fa-envelope"></i></a>';
					}
				}
				links += '<a class="deleteOrdineFornitore" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
		}
	});

	$(document).on('click','.detailsOrdineFornitore', function(){
		var idOrdineFornitore = $(this).attr('data-id');

		var alertContent = '<div id="alertOrdineFornitoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero dell ordine fornitore.</strong></div>';

		$.ajax({
			url: baseUrl + "ordini-fornitori/" + idOrdineFornitore,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != '') {

					var ordineFornitoreRow = '<td>' + result.progressivo + '/' + result.annoContabile + '</td>';
					if (result.fornitore != null) {
						var fornitoreHtml = result.fornitore.ragioneSociale;

						ordineFornitoreRow += '<td>' + $.fn.printVariable(fornitoreHtml) + '</td>';
					} else {
						ordineFornitoreRow += '<td></td>';
					}
					ordineFornitoreRow += '<td>' + $.fn.printVariable(moment(result.dataInserimento).format('DD/MM/YYYY')) + '</td>';
					ordineFornitoreRow += '<td>' + $.fn.printVariable(result.note) + '</td>';

					$('#ordineFornitoreRow').empty().append(ordineFornitoreRow);

					// populate table of articoli
					if(result.ordineFornitoreArticoli != null && result.ordineFornitoreArticoli != undefined){
						$('#detailsOrdineFornitoreArticoliModalTable').DataTable({
							"data": result.ordineFornitoreArticoli,
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
								[0, 'asc']
							],
							"autoWidth": false,
							"columns": [
								{"name":"empty", "data":null, "visible":false, render: function (data, type, row) {
									var result = '';
									if (data.articolo != null) {
										result = data.articolo.descrizione;
									}
									return result;
								}},
								{"name": "codiceDescrizione", "orderable": false, "data": null, render: function (data, type, row) {
									var result = '';
									if (data.articolo != null) {
										result = data.articolo.codice+' - '+data.articolo.descrizione;
									}
									return result;
								}},
								{"name": "pezziOrdinati", "orderable": false, "data": null, render: function (data, type, row) {
									var result = data.numeroPezziOrdinati;
									return result;
								}}
							]
						});
					}

				} else{
					$('#detailsOrdineFornitoreMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsOrdineFornitoreMainDiv').append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		});


		$('#detailsOrdineFornitoreModal').modal('show');

	});

	$(document).on('click','.closeOrdineFornitore', function(){
		$('#detailsOrdineFornitoreArticoliModalTable').DataTable().destroy();
		$('#detailsOrdineFornitoreModal').modal('hide');
	});

	$(document).on('click','.deleteOrdineFornitore', function(){
		var idOrdineFornitore = $(this).attr('data-id');
		$('#confirmDeleteOrdineFornitore').attr('data-id', idOrdineFornitore);
		$('#deleteOrdineFornitoreModal').modal('show');
	});

	$(document).on('click','#confirmDeleteOrdineFornitore', function(){
		$('#deleteOrdineFornitoreModal').modal('hide');
		var idOrdineFornitore = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "ordini-fornitori/" + idOrdineFornitore,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertOrdineFornitoreContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Ordine fornitore</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertOrdineFornitore').empty().append(alertContent);

				$('#ordiniFornitoriTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	$(document).on('click','.printOrdineFornitore', function(){
		var idOrdineFornitore = $(this).attr('data-id');

		window.open(baseUrl + "stampe/ordini-fornitori/"+idOrdineFornitore, '_blank');
	});

	$(document).on('click','.emailOrdineFornitore', function(){
		var idOrdineFornitore = $(this).attr('data-id');
		var email = $(this).attr('data-email-to');
		$('#confirmSendEmailOrdineFornitore').attr('data-id', idOrdineFornitore);
		$('#sendEmailOrdineFornitoreModalBody').html("L'ordine fornitore verrà inviato a <b>"+email+"</b>. Confermi?");
		$('#sendEmailOrdineFornitoreModal').modal('show');
	});

	$(document).on('click','#confirmSendEmailOrdineFornitore', function(){
		$('#sendEmailOrdineFornitoreModal').modal('hide');
		var idOrdineFornitore = $(this).attr('data-id');

		var alertContent = '<div id="alertOrdineFornitoreContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@\n' +
			'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var url = baseUrl + "emails/ordini-fornitori/" + idOrdineFornitore;

		$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@', 'Invio email in corso...').replace('@@alertResult@@', 'warning'));

		$.ajax({
			url: url,
			type: 'GET',
			success: function() {
				$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@', 'Email inviata con successo.').replace('@@alertResult@@', 'success'));
				$('#ordiniFornitoriTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@', "Errore nell'invio dell'email").replace('@@alertResult@@', 'danger'));
			}
		});
	});

	if($('#updateOrdineFornitoreButton') != null && $('#updateOrdineFornitoreButton') != undefined){
		$(document).on('submit','#updateOrdineFornitoreForm', function(event){
			event.preventDefault();

			var ordineFornitore = new Object();
			ordineFornitore.id = $('#hiddenIdOrdineFornitore').val();
			ordineFornitore.progressivo = $('#hiddenProgressivoOrdineFornitore').val();
			ordineFornitore.annoContabile = $('#hiddenAnnoContabileOrdineFornitore').val();

			var fornitoreId = $('#fornitore option:selected').val();
			if(fornitoreId != null && fornitoreId != ''){
				var fornitore = new Object();
				fornitore.id = fornitoreId;
				ordineFornitore.fornitore = fornitore;
			}

			ordineFornitore.note = $('#note').val();

			var articoliLength = $('.formRowArticolo').length;
			if(articoliLength != null && articoliLength != undefined && articoliLength != 0){
				var ordineFornitoreArticoli = [];
				$('.formRowArticolo').each(function(i, item){
					var ordineFornitoreArticolo = {};
					var ordineFornitoreArticoloId = new Object();
					var articoloId = item.id.replace('formRowArticolo_','');
					var idOrdiniClienti = $(this).attr('data-id-ordini-clienti');
					ordineFornitoreArticoloId.articoloId = articoloId;
					ordineFornitoreArticolo.id = ordineFornitoreArticoloId;
					ordineFornitoreArticolo.numeroPezziOrdinati = $('#pezziArticolo_'+articoloId).val();
					ordineFornitoreArticolo.idOrdiniClienti = idOrdiniClienti;

					ordineFornitoreArticoli.push(ordineFornitoreArticolo);
				});
				ordineFornitore.ordineFornitoreArticoli = ordineFornitoreArticoli;
			}

			var ordineFornitoreJson = JSON.stringify(ordineFornitore);

			var alertContent = '<div id="alertOrdineFornitoreContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ordini-fornitori/" + $('#hiddenIdOrdineFornitore').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: ordineFornitoreJson,
				success: function(result) {
					$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@','Ordine fornitore modificato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the page with the list of Ordini Fornitori
					setTimeout(function() {
						window.location.href = "ordini-fornitori.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell ordine fornitore').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newOrdineFornitoreButton') != null && $('#newOrdineFornitoreButton') != undefined){
		$(document).on('submit','#newOrdineFornitoreForm', function(event){
			event.preventDefault();

			var ordineFornitore = new Object();

			var fornitoreId = $('#fornitore option:selected').val();
			if(fornitoreId != null && fornitoreId != ''){
				var fornitore = new Object();
				fornitore.id = fornitoreId;
				ordineFornitore.fornitore = fornitore;
			}
			ordineFornitore.note = $('#note').val();

			var articoliLength = $('.formRowArticolo').length;
			if(articoliLength != null && articoliLength != undefined && articoliLength != 0){
				var ordineFornitoreArticoli = [];
				$('.formRowArticolo').each(function(i, item){
					var ordineFornitoreArticolo = {};
					var ordineFornitoreArticoloId = new Object();
					var articoloId = item.id.replace('formRowArticolo_','');
					var idOrdiniClienti = $(this).attr('data-id-ordini-clienti');
					ordineFornitoreArticoloId.articoloId = articoloId;
					ordineFornitoreArticolo.id = ordineFornitoreArticoloId;
					ordineFornitoreArticolo.numeroPezziOrdinati = $('#pezziArticolo_'+articoloId).val();
					ordineFornitoreArticolo.idOrdiniClienti = idOrdiniClienti;

					ordineFornitoreArticoli.push(ordineFornitoreArticolo);
				});
				ordineFornitore.ordineFornitoreArticoli = ordineFornitoreArticoli;
			}

			var ordineFornitoreJson = JSON.stringify(ordineFornitore);

			var alertContent = '<div id="alertOrdineFornitoreContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "ordini-fornitori",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: ordineFornitoreJson,
				success: function(result) {
					$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@','Ordine fornitore creato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the page with the list of Ordini Fornitori
					setTimeout(function() {
						window.location.href = "ordini-fornitori.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dell ordine fornitore').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

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
					var alertContent = '<div id="alertOrdineFornitoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>Errore nel recupero degli articoli</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertOrdineFornitoreAddArticolo').empty().append(alertContent);
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
				{"name": "descrizione", "data": "descrizione"}
			]
		});
	});

	$(document).on('click','#confirmAddArticoloModal', function(){
		var numChecked = $('.addArticoloCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertOrdineFornitoreAddArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno un articolo</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertOrdineFornitoreAddArticolo').empty().append(alertContent);
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

				if($.inArray(id, rowsIdPresent) != -1){
					var alertContent = '<div id="alertOrdineFornitoreAddArticoloContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
					alertContent = alertContent + '<strong>L articolo '+codice+' &egrave; gi&agrave; stato selezionato</strong>\n' +
						'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
					$('#alertOrdineFornitoreAddArticolo').empty().append(alertContent);
				} else{
					var descrizione = $('#'+item.id).attr('data-descrizione');

					var rowHtml = '<div class="form-row formRowArticolo col-md-12" data-id="'+id+'" id="formRowArticolo_'+id+'">' +
						'<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="codiceArticolo">Codice</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control form-control-sm" id="codiceArticolo_'+id+'" disabled value="'+codice+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-4">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="descrizioneArticolo">Descrizione</label>';
					}
					rowHtml = rowHtml + '<input type="text" class="form-control form-control-sm" id="descrizioneArticolo_'+id+'" disabled value="'+descrizione+'"></div>';
					rowHtml = rowHtml + '<div class="form-group col-md-2">';

					if(i == 0 && alreadyAddedRows == 0){
						rowHtml = rowHtml + '<label for="pezziArticolo">Nr. pezzi</label>';
					}
					rowHtml = rowHtml + '<div class="input-group">';
					rowHtml = rowHtml + '<input type="number" class="form-control form-control-sm pezziArticolo" id="pezziArticolo_'+id+'" step="1" min="0">';
					rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddArticolo" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
					rowHtml = rowHtml + '</div></div></div>';
					rowHtml = rowHtml + '</div>';

					$('#formRowArticoli').append(rowHtml);

					$('#addArticoloModalTable').DataTable().destroy();
					$('#alertOrdineFornitoreAddArticoloContent').alert('close');
					$('#addArticoloModal').modal('hide');
				}
			});
		}
	});

	$(document).on('click','.annullaAddArticoloModal', function(){
		$('#addArticoloModalTable').DataTable().destroy();
		$('#alertOrdineFornitoreAddArticoloContent').alert('close');
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
					} else{
						label = '<label for="pezziArticolo">Nr. pezzi</label>';
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

	$(document).on('click','#cercaArticoliLink', function(event){
		event.preventDefault();

		$('#alertOrdineFornitore').empty();

		var idFornitore = $('#fornitore').val();
		var dataDa = $('#dataDa').val();
		var dataA = $('#dataA').val();

		var alertContent = '<div id="alertOrdineFornitoreContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		if(idFornitore == null || idFornitore == undefined || idFornitore == ""){
			$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@','Selezionare un fornitore').replace('@@alertResult@@', 'danger'));
			return;
		}
		if(dataDa == null || dataDa == undefined || dataDa == ""){
			$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@',"Inserire un valore per il campo 'Data da'").replace('@@alertResult@@', 'danger'));
			return;
		}
		if(dataA == null || dataA == undefined || dataA == ""){
			$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@',"Inserire un valore per il campo 'Data a'").replace('@@alertResult@@', 'danger'));
			return;
		}
		if(dataDa > dataA){
			$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@',"'Data da' non può essere maggiore di 'Data a'").replace('@@alertResult@@', 'danger'));
			return;
		}

		$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@',"Recupero articoli in corso...").replace('@@alertResult@@', 'warning'));

		$.ajax({
			url: baseUrl + "ordini-clienti/articoli-for-ordine-fornitore?idFornitore="+idFornitore+"&dataFrom="+dataDa+"&dataTo="+dataA,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				$('#alertOrdineFornitore').empty();

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

				if(result != null && result != undefined && result != ''){

					$.each(result, function(i, item){

						var id = item.idArticolo;
						var codice = item.codiceArticolo;
						var descrizione = item.descrizioneArticolo;
						var numPezzi = item.numeroPezziOrdinati;

						// check if the article is already present
						var numPezziArticoloField = $('#pezziArticolo_'+id);
						if(numPezziArticoloField != null && numPezziArticoloField != undefined && numPezziArticoloField.length > 0){
							var numPezziArticolo = numPezziArticoloField.val();
							if(numPezziArticolo != null && numPezziArticolo != undefined && numPezziArticolo != ""){
								numPezziArticolo = parseInt(numPezziArticolo) + parseInt(numPezzi);
							} else {
								numPezziArticolo = parseInt(numPezzi);
							}
							$('#pezziArticolo_'+id).val(numPezziArticolo);
							$('#formRowArticolo_'+id).attr('data-id-ordini-clienti', item.idOrdiniClienti);
						} else {
							var rowHtml = '<div class="form-row formRowArticolo col-md-12" data-id="'+id+'" id="formRowArticolo_'+id+'" data-id-ordini-clienti="'+item.idOrdiniClienti+'">' +
								'<div class="form-group col-md-2">';

							if(i == 0 && alreadyAddedRows == 0){
								rowHtml = rowHtml + '<label for="codiceArticolo">Codice</label>';
							}
							rowHtml = rowHtml + '<input type="text" class="form-control form-control-sm" id="codiceArticolo_'+id+'" disabled value="'+codice+'"></div>';
							rowHtml = rowHtml + '<div class="form-group col-md-4">';

							if(i == 0 && alreadyAddedRows == 0){
								rowHtml = rowHtml + '<label for="descrizioneArticolo">Descrizione</label>';
							}
							rowHtml = rowHtml + '<input type="text" class="form-control form-control-sm" id="descrizioneArticolo_'+id+'" disabled value="'+descrizione+'"></div>';
							rowHtml = rowHtml + '<div class="form-group col-md-2">';

							if(i == 0 && alreadyAddedRows == 0){
								rowHtml = rowHtml + '<label for="pezziArticolo">Nr. pezzi</label>';
							}
							rowHtml = rowHtml + '<div class="input-group">';
							rowHtml = rowHtml + '<input type="number" class="form-control form-control-sm pezziArticolo" id="pezziArticolo_'+id+'" step="1" min="0" value="'+numPezzi+'">';
							rowHtml = rowHtml + '<div class="input-group-append ml-1 mt-1"><a class="deleteAddArticolo" data-id="'+id+'"><i class="far fa-trash-alt"></a>';
							rowHtml = rowHtml + '</div></div></div>';
							rowHtml = rowHtml + '</div>';

							$('#formRowArticoli').append(rowHtml);
						}
					});
				} else {
					$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@','Nessun articolo trovato').replace('@@alertResult@@', 'warning'));
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#alertOrdineFornitore').empty().append(alertContent.replace('@@alertText@@','Errore nel recupero degli articoli').replace('@@alertResult@@', 'danger'));
			}
		});

	});

});

$.fn.printVariable = function(variable){
	if(variable != null && variable != undefined && variable != ""){
		return variable;
	}
	return "";
}

$.fn.extractIdOrdineFornitoreFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idOrdineFornitore') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.getFornitori = function(){
	$.ajax({
		url: baseUrl + "fornitori?attivo=true",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = item.ragioneSociale;
					$('#fornitore').append('<option value="'+item.id+'">'+label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getOrdineFornitore = function(idOrdineFornitore){

	var alertContent = '<div id="alertOrdineFornitoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent +  '<strong>Errore nel recupero dell ordine fornitore.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
        url: baseUrl + "ordini-fornitori/" + idOrdineFornitore,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdOrdineFornitore').attr('value', result.id);
			$('#hiddenProgressivoOrdineFornitore').attr('value', result.progressivo);
            $('#hiddenAnnoContabileOrdineFornitore').attr('value', result.annoContabile);

			if(result.fornitore != null && result.fornitore != undefined){
				$('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);
			};
			$('#note').val(result.note);

			if(result.ordineFornitoreArticoli != null && result.ordineFornitoreArticoli != undefined && result.ordineFornitoreArticoli.length != 0){
				result.ordineFornitoreArticoli.forEach(function(item, i){
					var id = item.id.articoloId;
					var codice = item.articolo.codice;
					var descrizione = item.articolo.descrizione;
					var pezzi = item.numeroPezziOrdinati;

					var rowHtml = '<div class="form-row formRowArticolo col-md-8" data-id="'+id+'" id="formRowArticolo_'+id+'">' +
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
			}
          } else{
            $('#alertOrdineFornitore').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertOrdineFornitore').append(alertContent);
            $('#updateOrdineFornitoreButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
