var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('[data-toggle="tooltip"]').tooltip();

	$('#confezioniTable').DataTable({
		"ajax": {
			"url": baseUrl + "confezioni",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertConfezioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle confezioni</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertConfezione').empty().append(alertContent);
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
			"emptyTable": "Nessuna confezione disponibile",
			"zeroRecords": "Nessuna confezione disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "codice", "data": "codice", "width":"10%"},
			{"name": "tipo", "data": "tipo", "width":"12%"},
			{"name": "peso", "data": "peso", "width":"8%"},
			{"name": "prezzo", "data": "prezzo", "width":"8%"},
			{"name": "fornitore", "data": null, "width":"15%", "orderable":true, render: function ( data, type, row ) {
				var fornitore = data.fornitore;
				if(fornitore != null && fornitore != undefined){
					return fornitore.ragioneSociale;
				}
				return '';
			}},
			{"name": "note", "data": null, render: function ( data, type, row ) {
				var note = data.note;
				if(note == null || note == undefined){
					note = '';
				}
				var noteTrunc = note;
				var noteHtml = '<div>'+noteTrunc+'</div>';
				if(note != null && note != undefined && note != '' && note.length > 100){
					noteTrunc = note.substring(0, 100)+'...';
					noteHtml = '<div data-toggle="tooltip" data-placement="bottom" title="'+note+'">'+noteTrunc+'</div>';
				}
				return noteHtml;
			}},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var links = '<a class="detailsConfezione pr-2" data-id="'+data.id+'" href="#"><i class="fas fa-info-circle"></i></a>';
				links += '<a class="updateConfezione pr-2" data-id="'+data.id+'" href="confezioni-edit.html?idConfezione=' + data.id + '"><i class="far fa-edit"></i></a>';
				links += '<a class="deleteConfezione" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"initComplete": function( settings, json ) {
			$('[data-toggle="tooltip"]').tooltip();
		}
	});

	$(document).on('click','.detailsConfezione', function(){
		var idConfezione = $(this).attr('data-id');

		var alertContent = '<div id="alertConfezioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
		alertContent = alertContent + '<strong>Errore nel recupero della confezione.</strong></div>';

		$.ajax({
			url: baseUrl + "confezioni/" + idConfezione,
			type: 'GET',
			dataType: 'json',
			success: function(result) {
				if(result != null && result != undefined && result != ''){
					var contentDetails = '<p><strong>Codice: </strong>'+$.fn.printVariable(result.codice)+'</p>';
					contentDetails += '<p><strong>Tipo: </strong>'+$.fn.printVariable(result.tipo)+'</p>';
					contentDetails += '<p><strong>Peso: </strong>'+$.fn.printVariable(result.peso)+'</p>';
					contentDetails += '<p><strong>Prezzo: </strong>'+$.fn.printVariable(result.prezzo)+'</p>';
					var fornitore = result.fornitore;
					if(fornitore != null && fornitore != undefined){
						contentDetails += '<p><strong>Fornitore: </strong>'+$.fn.printVariable(fornitore.ragioneSociale)+'</p>';
					} else {
						contentDetails += '<p><strong>Fornitore: </strong></p>';
					}
					contentDetails += '<p><strong>Note: </strong>'+$.fn.printVariable(result.note)+'</p>';

					$('#detailsConfezioneMainDiv').empty().append(contentDetails);

				} else{
					$('#detailsConfezioneMainDiv').empty().append(alertContent);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$('#detailsConfezioneMainDiv').append(alertContent);
				console.log('Response text: ' + jqXHR.responseText);
			}
		});

		$('#detailsConfezioneModal').modal('show');
	});

	$(document).on('click','.deleteConfezione', function(){
		var idConfezione = $(this).attr('data-id');
		$('#confirmDeleteConfezione').attr('data-id', idConfezione);
		$('#deleteConfezioneModal').modal('show');
	});

	$(document).on('click','#confirmDeleteConfezione', function(){
		$('#deleteConfezioneModal').modal('hide');
		var idConfezione = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "confezioni/" + idConfezione,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertConfezioneContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Confezione</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertConfezione').empty().append(alertContent);

				$('#confezioniTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertConfezioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione della confezione' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertConfezione').empty().append(alertContent);

                $('#confezioniTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateConfezioneButton') != null && $('#updateConfezioneButton') != undefined){
		$(document).on('submit','#updateConfezioneForm', function(event){
			event.preventDefault();

			var confezione = new Object();
			confezione.id = $('#hiddenIdConfezione').val();
			confezione.codice = $('#codice').val();
			confezione.tipo = $('#tipo').val();
			confezione.peso = $('#peso').val();
			confezione.prezzo = $('#prezzo').val();
			if($('#fornitore option:selected').val() != null && $('#fornitore option:selected').val() != ''){
				var fornitore = new Object();
				fornitore.id = $('#fornitore option:selected').val();
				confezione.fornitore = fornitore;
			}
			confezione.note = $('#note').val();

			var confezioneJson = JSON.stringify(confezione);

			var alertContent = '<div id="alertConfezioneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "confezioni/" + $('#hiddenIdConfezione').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: confezioneJson,
				success: function(result) {
					$('#alertConfezione').empty().append(alertContent.replace('@@alertText@@','Confezione modificata con successo').replace('@@alertResult@@', 'success'));

					$('#updateConfezioneButton').attr("disabled", true);

					// Returns to the page with the list of Confezioni
					setTimeout(function() {
						window.location.href = "confezioni.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertConfezione').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della confezione').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newConfezioneButton') != null && $('#newConfezioneButton') != undefined){
		$(document).on('submit','#newConfezioneForm', function(event){
			event.preventDefault();

			var confezione = new Object();
			confezione.codice = $('#codice').val();
			confezione.tipo = $('#tipo').val();
			confezione.peso = $('#peso').val();
			confezione.prezzo = $('#prezzo').val();
			if($('#fornitore option:selected').val() != null && $('#fornitore option:selected').val() != ''){
				var fornitore = new Object();
				fornitore.id = $('#fornitore option:selected').val();
				confezione.fornitore = fornitore;
			}
			confezione.note = $('#note').val();

			var confezioneJson = JSON.stringify(confezione);

			var alertContent = '<div id="alertConfezioneContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "confezioni",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: confezioneJson,
				success: function(result) {
					$('#alertConfezione').empty().append(alertContent.replace('@@alertText@@','Confezione creata con successo').replace('@@alertResult@@', 'success'));

					$('#newConfezioneButton').attr("disabled", true);

					// Returns to the page with the list of Confezioni
					setTimeout(function() {
						window.location.href = "confezioni.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertConfezione').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della confezione').replace('@@alertResult@@', 'danger'));
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
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdConfezioneFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idConfezione') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getConfezione = function(idConfezione){

	var alertContent = '<div id="alertConfezioneContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero della confezione.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "confezioni/" + idConfezione,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
			if(result != null && result != undefined && result != ''){

				$('#hiddenIdConfezione').attr('value', result.id);
				$('#codice').attr('value', result.codice);
				$('#tipo').attr('value', result.tipo);
				$('#peso').attr('value', result.peso);
				$('#prezzo').attr('value', result.prezzo);
				if(result.fornitore != null && result.fornitore != undefined){
					$('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);
				}
				$('#note').val(result.note);

			} else{
				$('#alertConfezione').empty().append(alertContent);
			}
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertConfezione').empty().append(alertContent);
            $('#updateConfezioneButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
