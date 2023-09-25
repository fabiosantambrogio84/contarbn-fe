var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#agentiTable').DataTable({
		"ajax": {
			"url": baseUrl + "agenti",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertAgenteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero degli agenti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertAgente').empty().append(alertContent);
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
			"emptyTable": "Nessun agente disponibile",
			"zeroRecords": "Nessun agente disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "nome", "data": "nome"},
			{"name": "cognome", "data": "cognome"},
			{"name": "telefono", "data": "telefono"},
			{"name": "email", "data": "email"},
			{"name": "indirizzo", "data": "indirizzo"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateAgente pr-2" data-id="'+data.id+'" href="agenti-edit.html?idAgente=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteAgente" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteAgente', function(){
		var idAgente = $(this).attr('data-id');
		$('#confirmDeleteAgente').attr('data-id', idAgente);
		$('#deleteAgenteModal').modal('show');
	});

	$(document).on('click','#confirmDeleteAgente', function(){
		$('#deleteAgenteModal').modal('hide');
		var idAgente = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "agenti/" + idAgente,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertAgenteContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Agente</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertAgente').empty().append(alertContent);

				$('#agentiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertAgenteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione dell\'agente' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertAgente').empty().append(alertContent);

                $('#agentiTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateAgenteButton') != null && $('#updateAgenteButton') != undefined){
		$(document).on('submit','#updateAgenteForm', function(event){
			event.preventDefault();

			var agente = new Object();
			agente.id = $('#hiddenIdAgente').val();
			agente.nome = $('#nome').val();
			agente.cognome = $('#cognome').val();
			agente.telefono = $('#telefono').val();
			agente.email = $('#email').val();
			agente.indirizzo = $('#indirizzo').val();

			var agenteJson = JSON.stringify(agente);

			var alertContent = '<div id="alertAgenteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "agenti/" + $('#hiddenIdAgente').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: agenteJson,
				success: function(result) {
					$('#alertAgente').empty().append(alertContent.replace('@@alertText@@','Agente modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertAgente').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell\' agente').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newAgenteButton') != null && $('#newAgenteButton') != undefined){
		$(document).on('submit','#newAgenteForm', function(event){
			event.preventDefault();

			var agente = new Object();
			agente.nome = $('#nome').val();
			agente.cognome = $('#cognome').val();
			agente.telefono = $('#telefono').val();
			agente.email = $('#email').val();
            agente.indirizzo = $('#indirizzo').val();

			var agenteJson = JSON.stringify(agente);

			var alertContent = '<div id="alertAgenteContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "agenti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: agenteJson,
				success: function(result) {
					$('#alertAgente').empty().append(alertContent.replace('@@alertText@@','Agente creato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertAgente').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dell\' agente').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdAgenteFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idAgente') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getAgente = function(idAgente){

	var alertContent = '<div id="alertAgenteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dell\' agente.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "agenti/" + idAgente,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdAgente').attr('value', result.id);
			$('#nome').attr('value', result.nome);
            $('#cognome').attr('value', result.cognome);
            $('#telefono').attr('value', result.telefono);
            $('#email').attr('value', result.email);
            $('#indirizzo').attr('value', result.indirizzo);

          } else{
            $('#alertAgente').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertAgente').empty().append(alertContent);
            $('#updateAgenteButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
