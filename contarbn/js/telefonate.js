var baseUrl = "/contarbn-be/";

$.fn.loadTelefonateTable = function() {
	$('#telefonateTable').DataTable({
		"processing": true,
		"ajax": {
			"url": baseUrl + "telefonate",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle telefonate</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTelefonata').empty().append(alertContent);
			}
		},
		"language": {
			"search": "Cerca",
			"emptyTable": "Nessuna telefonata disponibile",
			"zeroRecords": "Nessuna telefonata disponibile"
		},
		"paging": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc'],
			[4, 'asc'],
			[6, 'asc']
		],
		"columns": [
			{"name": "giornoOrdinale", "data": "giornoOrdinale", "visible": false},
			{"data": null, "orderable":false, "width": "2%", render: function ( data, type, row ) {
				var checked = '';
				if(data.eseguito){
					checked = 'checked';
				}
				var checkboxHtml = '<input type="checkbox" data-id="'+data.id+'" id="checkbox_'+data.id+'" class="deleteTelefonataCheckbox patchTelefonata" '+checked+'>';
				return checkboxHtml;
			}},
			{"name": "cliente", "data": null, "width": "20%", render: function ( data, type, row ) {
				if(data.cliente != null){
					var clienteHtml = '';

					if(data.cliente.dittaIndividuale){
						clienteHtml += data.cliente.cognome + ' ' + data.cliente.nome;
					} else if(data.cliente.privato){
						clienteHtml += data.cliente.cognome + ' ' + data.cliente.nome;
					} else {
						clienteHtml += data.cliente.ragioneSociale;
					}

					var tooltipText = '';
					if(data.puntoConsegna != null){
						if(data.puntoConsegna.indirizzo != null && data.puntoConsegna.indirizzo != ''){
							tooltipText += data.puntoConsegna.indirizzo;
						}
						if(data.puntoConsegna.localita != null && data.puntoConsegna.localita != ''){
							tooltipText += ', '+data.puntoConsegna.localita;
						}
					}
					tooltipText += ' - '+data.ora;

					clienteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+tooltipText+'">'+clienteHtml+'</div>';

					return clienteHtml;
				} else {
					return '';
				}
			}},
			{"name": "recapito", "data": null, "width": "10%", render: function ( data, type, row ) {
				var recapitoHtml = data.telefono;
				if(data.telefonoTwo != null && data.telefonoTwo != ''){
					recapitoHtml += ', '+data.telefonoTwo;
				}
				if(data.telefonoThree != null && data.telefonoThree != ''){
					recapitoHtml += ', '+data.telefonoThree;
				}
				return recapitoHtml;
			}},
			{"name": "autista", "data": null, "width": "10%", render: function ( data, type, row ) {
				var autistaHtml = '';
				var concat = 'no';
				if(data.autista != null){
					if(data.autista.cognome != null && data.autista.cognome != ''){
						autistaHtml += data.autista.cognome;
						concat = 'yes';
					}
					if(data.autista.nome != null && data.autista.nome != null){
						if(concat == 'yes'){
							autistaHtml += ' - ';
						}
						autistaHtml += data.autista.nome;
					}
				}
				return autistaHtml;
			}},
			{"name": "giorno", "data": "giorno", "width": "5%"},
			{"name": "ora", "data": "ora", "width": "1%", "visible": false},
			{"name": "note", "data": null, "width": "8%", render: function ( data, type, row ) {
				var note = data.note;
				var noteTrunc = note;
				var noteHtml = '<div>'+noteTrunc+'</div>';
				if(note.length > 15){
					noteTrunc = note.substring(0, 15)+'...';
					noteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+note+'">'+noteTrunc+'</div>';
				}
				return noteHtml;
			}},
			{"data": null, "orderable":false, "width":"5%", render: function ( data, type, row ) {
				var links = '<a class="detailsTelefonata pr-1" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle" title="Dettagli"></i></a>';
				links += '<a class="updateTelefonata pr-1" data-id="'+data.id+'" href="telefonate-edit.html?idTelefonata=' + data.id + '"><i class="far fa-edit"></i></a>';
				if(!data.cliente.bloccaDdt){
					links += '<a class="newOrdineClienteFromTelefonata pr-1" data-id="'+data.id+'" href="ordini-clienti-new.html?idTelefonata=' + data.id + '" title="Nuovo Ordine Cliente"><i class="far fa-folder-open"></i></a>';
				}
				links += '<a class="deleteTelefonata" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			$(row).css('font-size', '12px');
			$(row).attr('data-id-telefonata', data.id);
			var giornoOrdinale = data.giornoOrdinale;
			if(!$.fn.checkVariableIsNull(giornoOrdinale)){
				if(giornoOrdinale % 2 == 0){
					$(row).css('background-color', 'trasparent');
				} else {
					$(row).css('background-color', '#ebebeb');
				}
			}
			if(data.cliente.bloccaDdt){
				$(row).css('color', 'red');
			}
		},
		"initComplete": function( settings, json ) {
			$('[data-toggle="tooltip"]').tooltip();

			if(window.location.search.substring(1).indexOf('idTelefonata') != -1){
				var idTelefonata = new URLSearchParams(window.location.search).get('idTelefonata');

				if(!$.fn.checkVariableIsNull(idTelefonata)){
					// move to the row related to idTelefonata
					var w = $(window);
					var row = $('#telefonateTable').find("tr[data-id-telefonata="+idTelefonata+"]");

					if(row.length){
						w.scrollTop(row.offset().top - (w.height()/2));
						row.css("background-color", "#ebf3ff");
						setTimeout(function() {
							row.css("background-color", "transparent");
						}, 2000);
					}
				}
			}
		}
	});
}

$(document).ready(function() {

    $('[data-toggle="tooltip"]').tooltip();

	$.fn.loadTelefonateTable();

	$(document).on('click','.detailsTelefonata', function(){
		var idTelefonata = $(this).attr('data-id');

		var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della telefonata.</strong></div>';

		$.ajax({
			url: baseUrl + "telefonate/" + idTelefonata,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					var cliente = '<p><strong>Cliente: </strong>';
					if(result.cliente != null){
						var clienteHtml = '';
						if(result.cliente.dittaIndividuale){
							clienteHtml += result.cliente.cognome + ' - ' + result.cliente.nome;
						} else {
							clienteHtml += result.cliente.ragioneSociale;
						}
						clienteHtml += ' - ' + result.cliente.partitaIva;
					}
					cliente += $.fn.printVariable(clienteHtml)+'</p>';

					var puntoConsegna = '<p><strong>Punto consegna: </strong>';
					if(result.puntoConsegna != null){
						var puntoConsegnaHtml = result.puntoConsegna.nome;
						if(result.puntoConsegna.indirizzo != null && result.puntoConsegna.indirizzo != ''){
							puntoConsegnaHtml += ' - '+result.puntoConsegna.indirizzo;
						}
						if(result.puntoConsegna.localita != null && result.puntoConsegna.localita != ''){
							puntoConsegnaHtml += ', '+result.puntoConsegna.localita;
						}
						if(result.puntoConsegna.cap != null && result.puntoConsegna.cap != ''){
                            puntoConsegnaHtml += ' '+result.puntoConsegna.cap;
                        }
						if(result.puntoConsegna.provincia != null && result.puntoConsegna.provincia != ''){
							puntoConsegnaHtml += ' ('+result.puntoConsegna.provincia+')';
						}
					}
					puntoConsegna += $.fn.printVariable(puntoConsegnaHtml)+'</p>';

					var contentDetails = cliente + puntoConsegna;
					contentDetails += '<p><strong>Telefono: </strong>'+$.fn.printVariable(result.telefono)+'</p>';
					contentDetails += '<p><strong>Telefono 2: </strong>'+$.fn.printVariable(result.telefonoTwo)+'</p>';
					contentDetails += '<p><strong>Telefono 3: </strong>'+$.fn.printVariable(result.telefonoThree)+'</p>';
					contentDetails += '<p><strong>Giorno: </strong>'+$.fn.printVariable(result.giorno)+'</p>';
					contentDetails += '<p><strong>Ora: </strong>'+$.fn.printVariable(result.ora)+'</p>';
					contentDetails += '<p><strong>Giorno consegna: </strong>'+$.fn.printVariable(result.giornoConsegna)+'</p>';
					contentDetails += '<p><strong>Ora consegna: </strong>'+$.fn.printVariable(result.oraConsegna)+'</p>';
					contentDetails += '<p><strong>Eseguita: </strong>'+$.fn.printVariable(result.eseguito)+'</p>';
					contentDetails += '<p><strong>Note: </strong>'+$.fn.printVariable(result.note)+'</p>';

					$('#detailsTelefonataMainDiv').empty().append(contentDetails);

				} else{
					$('#detailsTelefonataMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsTelefonataMainDiv').append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

		$('#detailsTelefonataModal').modal('show');
	});

	$(document).on('click','.patchTelefonata', function(){
		var idTelefonata = $(this).attr('data-id');
		var eseguito = $(this).prop("checked");

		var telefonataPatched = new Object();
		telefonataPatched.idTelefonata = parseInt(idTelefonata);
		telefonataPatched.eseguito = eseguito;

		var telefonataPatchedJson = JSON.stringify(telefonataPatched);

		$.ajax({
			url: baseUrl + "telefonate/" + idTelefonata,
			type: 'PATCH',
			contentType: "application/json",
			dataType: 'json',
			data: telefonataPatchedJson,
			success: function(result) {
				//$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Autista modificato con successo').replace('@@alertResult@@', 'success'));
				$('#telefonateTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + 'Errore nella modifica della telefonata' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTelefonata').empty().append(alertContent);
				$('#telefonateTable').DataTable().ajax.reload();
			}
		});
	});

	$(document).on('click','.deleteTelefonata', function(){
		var idTelefonata = $(this).attr('data-id');
		$('#confirmDeleteTelefonata').attr('data-id', idTelefonata);
		$('#deleteTelefonataModal').modal('show');
	});

	$(document).on('click','#confirmDeleteTelefonata', function(){
		$('#deleteTelefonataModal').modal('hide');
		var idTelefonata = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "telefonate/" + idTelefonata,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertTelefonataContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Telefonata</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTelefonata').empty().append(alertContent);

				$('#telefonateTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione della telefonata' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertTelefonata').empty().append(alertContent);

                $('#telefonateTable').DataTable().ajax.reload();
			}
		});
	});

    $(document).on('click','#deleteTelefonateBulk', function(){
		$('#deleteTelefonateBulkModal').modal('show');
	});

	$(document).on('click','#confirmDeleteTelefonateBulk', function(){
		$('#deleteTelefonateBulkModal').modal('hide');

		var alertContent = '<div id="alertTelefonataContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
        alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var numChecked = $('.deleteTelefonataCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno una telefonata</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertTelefonata').empty().append(alertContent);
		} else{
			var telefonateIds = [];
			$('.deleteTelefonataCheckbox:checkbox:checked').each(function(i, item) {
				var id = item.id.replace('checkbox_', '');
                telefonateIds.push(id);
			});
            $.ajax({
                url: baseUrl + "telefonate/operations/delete",
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(telefonateIds),
                success: function(result) {
                    $('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Telefonate cancellate con successo').replace('@@alertResult@@', 'success'));

                    $('#telefonateTable').DataTable().ajax.reload();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Errore nella cancellazione delle telefonate').replace('@@alertResult@@', 'danger'));
                }
            });
		}
	});

	$(document).on('click','#setEseguitoTelefonateBulk', function(){
		$('#setEseguitoTelefonateBulkModal').modal('show');
	});

	$(document).on('click','#confirmSetEseguitoTelefonateBulk', function(){
		$('#setEseguitoTelefonateBulkModal').modal('hide');

		var alertContent = '<div id="alertTelefonataContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

		var numChecked = $('.deleteTelefonataCheckbox:checkbox:checked').length;
		if(numChecked == null || numChecked == undefined || numChecked == 0){
			var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>Selezionare almeno una telefonata</strong>\n' +
				'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
			$('#alertTelefonata').empty().append(alertContent);
		} else{
			var telefonateIds = [];
			$('.deleteTelefonataCheckbox:checkbox:checked').each(function(i, item) {
				var id = item.id.replace('checkbox_', '');
				telefonateIds.push(id);
			});
			$.ajax({
				url: baseUrl + "telefonate/operations/set-eseguito?value=false",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: JSON.stringify(telefonateIds),
				success: function(result) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@',"Telefonate aggiornate in 'Da eseguire' con successo").replace('@@alertResult@@', 'success'));

					$('#telefonateTable').DataTable().ajax.reload();
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@',"Errore nell' aggiornamento delle telefonate").replace('@@alertResult@@', 'danger'));
				}
			});
		}
	});

	$(document).on('change','#cliente', function(){
        $('#loadingDiv').removeClass('d-none');
        var cliente = $('#cliente option:selected').val();
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
                            $('#puntoConsegna').append('<option value="'+item.id+'">'+label+'</option>');
                        });
                    }
                    $('#puntoConsegna').removeAttr('disabled');
                    $('#loadingDiv').addClass('d-none');
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
                }
            });

        } else {
            $('#puntoConsegna').empty();
            $('#puntoConsegna').attr('disabled', true);
            $('#loadingDiv').addClass('d-none');
        }

    });

	if($('#updateTelefonataButton') != null && $('#updateTelefonataButton') != undefined){
		$(document).on('submit','#updateTelefonataForm', function(event){
			event.preventDefault();

			var telefonata = new Object();
			telefonata.id = $('#hiddenIdTelefonata').val();

			var clienteId = $('#cliente option:selected').val();
			if(clienteId != null && clienteId != ''){
				var cliente = new Object();
				cliente.id = clienteId;
				telefonata.cliente = cliente;
			}
			var puntoConsegnaId = $('#puntoConsegna option:selected').val();
			if(puntoConsegnaId != null && puntoConsegnaId != ''){
				var puntoConsegna = new Object();
				puntoConsegna.id = puntoConsegnaId;
				telefonata.puntoConsegna = puntoConsegna;
			}
			var autistaId = $('#autista option:selected').val();
            if(autistaId |= null && autistaId != ''){
                var autista = new Object();
                autista.id = autistaId;
                telefonata.autista = autista;
            }
			telefonata.telefono = $('#telefono').val();
			telefonata.telefonoTwo = $('#telefono2').val();
			telefonata.telefonoThree = $('#telefono3').val();
			telefonata.giorno = $('#giorno option:selected').text();
			telefonata.giornoOrdinale = $('#giorno option:selected').val();
			telefonata.giornoConsegna = $('#giornoConsegna option:selected').text();
			telefonata.giornoConsegnaOrdinale = $('#giornoConsegna option:selected').val();

			var regex = /:/g;
			var ora = $('#ora').val();
			if(ora != null && ora != ''){
				var count = ora.match(regex);
				count = (count) ? count.length : 0;
				if(count == 1){
					telefonata.ora = $('#ora').val() + ':00';
				} else {
					telefonata.ora = $('#ora').val();
				}
			}
			var oraConsegna = $('#oraConsegna').val();
			if(oraConsegna != null && oraConsegna != ''){

				var count = oraConsegna.match(regex);
				count = (count) ? count.length : 0;
				if(count == 1){
					telefonata.oraConsegna = $('#oraConsegna').val() + ':00';
				} else {
					telefonata.oraConsegna = $('#oraConsegna').val();
				}
			}
			telefonata.eseguito = $('#eseguito').prop("checked");
			telefonata.note = $('#note').val();

			var telefonataJson = JSON.stringify(telefonata);

			var alertContent = '<div id="alertTelefonataContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "telefonate/" + $('#hiddenIdTelefonata').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: telefonataJson,
				success: function(result) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Telefonata modificata con successo').replace('@@alertResult@@', 'success'));

					$('#updateTelefonataButton').attr("disabled", true);

					// Returns to the list of 'Telefonate'
					setTimeout(function() {
						window.location.href = "telefonate.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della telefonata').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newTelefonataButton') != null && $('#newTelefonataButton') != undefined){
		$(document).on('submit','#newTelefonataForm', function(event){
			event.preventDefault();

			var telefonata = new Object();

			var clienteId = $('#cliente option:selected').val();
			if(clienteId != null && clienteId != ''){
			    var cliente = new Object();
                cliente.id = clienteId;
                telefonata.cliente = cliente;
			}
			var puntoConsegnaId = $('#puntoConsegna option:selected').val();
			if(puntoConsegnaId != null && puntoConsegnaId != ''){
			    var puntoConsegna = new Object();
			    puntoConsegna.id = puntoConsegnaId;
			    telefonata.puntoConsegna = puntoConsegna;
			}
			var autistaId = $('#autista option:selected').val();
			if(autistaId |= null && autistaId != ''){
			    var autista = new Object();
			    autista.id = autistaId;
			    telefonata.autista = autista;
			}
			telefonata.telefono = $('#telefono').val();
			telefonata.telefonoTwo = $('#telefono2').val();
			telefonata.telefonoThree = $('#telefono3').val();
			telefonata.giorno = $('#giorno option:selected').text();
			telefonata.giornoOrdinale = $('#giorno option:selected').val();
			telefonata.giornoConsegna = $('#giornoConsegna option:selected').text();
			telefonata.giornoConsegnaOrdinale = $('#giornoConsegna option:selected').val();

			var regex = /:/g;
			var ora = $('#ora').val();
			if(ora != null && ora != ''){
				var count = ora.match(regex);
				count = (count) ? count.length : 0;
				if(count == 1){
					telefonata.ora = $('#ora').val() + ':00';
				} else {
					telefonata.ora = $('#ora').val();
				}
			}
			var oraConsegna = $('#oraConsegna').val();
			if(oraConsegna != null && oraConsegna != ''){

				var count = oraConsegna.match(regex);
				count = (count) ? count.length : 0;
				if(count == 1){
					telefonata.oraConsegna = $('#oraConsegna').val() + ':00';
				} else {
					telefonata.oraConsegna = $('#oraConsegna').val();
				}
			}
			telefonata.eseguito = $('#eseguito').prop("checked");
			telefonata.note = $('#note').val();

			var telefonataJson = JSON.stringify(telefonata);

			var alertContent = '<div id="alertTelefonataContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "telefonate",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: telefonataJson,
				success: function(result) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Telefonata creata con successo').replace('@@alertResult@@', 'success'));

					$('#newTelefonataButton').attr("disabled", true);

					// Returns to the list of 'Telefonate'
					setTimeout(function() {
						window.location.href = "telefonate.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della telefonata').replace('@@alertResult@@', 'danger'));
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

$.fn.getClienti = function(){
	return $.ajax({
		url: baseUrl + "clienti?bloccaDdt=false",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					var label = '';
					if(item.dittaIndividuale){
						label += item.cognome + ' ' + item.nome;
					} if(item.privato){
						label += item.cognome + ' ' + item.nome;
					} else {
						label += item.ragioneSociale;
					}
					label += ' - ' + item.partitaIva + ' - ' + item.codiceFiscale;
					$('#cliente').append('<option value="'+item.id+'">'+label+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getAutisti = function(){
	return $.ajax({
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
}

$.fn.getGiorniSettimana = function(){
	return $.ajax({
		url: baseUrl + "utils/giorni-settimana",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$.each(item, function(key, value){
                        $('#giorno').append('<option value="'+key+'">'+value+'</option>');
						$('#giornoConsegna').append('<option value="'+key+'">'+value+'</option>');
                    });

				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getTelefonata = function(idTelefonata){

	var alertContent = '<div id="alertTelefonataContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero della telefonata.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "telefonate/" + idTelefonata,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdTelefonata').attr('value', result.id);
			if(result.autista != null){
				$('#autista option[value="' + result.autista.id +'"]').attr('selected', true);
			}
			$('#telefono').attr('value', result.telefono);
			$('#telefono2').attr('value', result.telefonoTwo);
			$('#telefono3').attr('value', result.telefonoThree);
			$('#giorno option[value="' + result.giornoOrdinale +'"]').attr('selected', true);
			$('#ora').attr('value', result.ora);
			$('#giornoConsegna option[value="' + result.giornoConsegnaOrdinale +'"]').attr('selected', true);
			$('#oraConsegna').attr('value', result.oraConsegna);
			if(result.eseguito === true){
				$('#eseguito').prop('checked', true);
			}
			$('#note').val(result.note);
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
					},
					error: function(jqXHR, textStatus, errorThrown) {
						$('#alertTelefonata').empty().append(alertContent.replace('@@alertText@@','Errore nel caricamento dei punti di consegna').replace('@@alertResult@@', 'danger'));
					}
				});
			}
          } else{
            $('#alertTelefonata').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertTelefonata').empty().append(alertContent);
            $('#updateTelefonataButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });

}
