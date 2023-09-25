
var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$(document).on('click','.deleteClientePuntoConsegna', function(){
		var idClientePuntoConsegna = $(this).attr('data-id');
		$('#confirmDeleteClientePuntoConsegna').attr('data-id', idClientePuntoConsegna);
		$('#deleteClientePuntoConsegnaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteClientePuntoConsegna', function(){
		$('#deleteClientePuntoConsegnaModal').modal('hide');
		var idClientePuntoConsegna = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "punti-consegna/" + idClientePuntoConsegna,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertClientePuntoConsegnaContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Punto di consegna</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertClientePuntoConsegna').empty().append(alertContent);

				$('#clientiPuntiConsegnaTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateClientePuntoConsegnaButton') != null && $('#updateClientePuntoConsegnaButton') != undefined){
		$(document).on('submit','#updateClientePuntoConsegnaForm', function(event){
			event.preventDefault();

			var idCliente = $('#hiddenIdCliente').val();

			var puntoConsegna = new Object();
			puntoConsegna.id = $('#hiddenIdPuntoConsegna').val();
			puntoConsegna.nome = $('#nome').val();
			puntoConsegna.indirizzo = $('#indirizzo').val();
			puntoConsegna.localita = $('#localita').val();
			puntoConsegna.cap = $('#cap').val();
			puntoConsegna.provincia = $('#provincia option:selected').text();
			puntoConsegna.codiceConad = $('#codiceConad').val();
			var cliente = new Object();
			cliente.id = idCliente;
			puntoConsegna.cliente = cliente;

			var puntoConsegnaJson = JSON.stringify(puntoConsegna);

			var alertContent = '<div id="alertClientePuntoConsegnaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "punti-consegna/" + $('#hiddenIdPuntoConsegna').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: puntoConsegnaJson,
				success: function(result) {
					$('#alertClientePuntoConsegna').empty().append(alertContent.replace('@@alertText@@','Punto di consegna modificato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the list page
					setTimeout(function() {
						window.location.href = "cliente-punti-consegna.html?idCliente="+idCliente;
					}, 1000);

				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertClientePuntoConsegna').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del punto di consegna').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newClientePuntoConsegnaButton') != null && $('#newClientePuntoConsegnaButton') != undefined){
		$(document).on('submit','#newClientePuntoConsegnaForm', function(event){
			event.preventDefault();

			var idCliente = $('#hiddenIdCliente').val();

			var puntoConsegna = new Object();
			puntoConsegna.nome = $('#nome').val();
			puntoConsegna.indirizzo = $('#indirizzo').val();
			puntoConsegna.localita = $('#localita').val();
			puntoConsegna.cap = $('#cap').val();
			puntoConsegna.provincia = $('#provincia option:selected').text();
			puntoConsegna.codiceConad = $('#codiceConad').val();
			var cliente = new Object();
			cliente.id = idCliente;
			puntoConsegna.cliente = cliente;

			var puntoConsegnaJson = JSON.stringify(puntoConsegna);

			var alertContent = '<div id="alertClientePuntoConsegnaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "punti-consegna",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: puntoConsegnaJson,
				success: function(result) {
					$('#alertClientePuntoConsegna').empty().append(alertContent.replace('@@alertText@@','Punto di consegna creato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the list page
					setTimeout(function() {
						window.location.href = "cliente-punti-consegna.html?idCliente="+idCliente;
					}, 1000);

				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertClientePuntoConsegna').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del punto di consegna').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.getProvince = function(){
	$.ajax({
		url: baseUrl + "utils/province",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#provincia').append('<option value="'+item+'">'+item+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdPuntoConsegnaFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idPuntoConsegna') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.getClienteForPuntoConsegna = function(idCliente){
	var alertContent = '<div id="alertClienteContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero del cliente.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "clienti/" + idCliente,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != '') {

				var clienteRow = '<td>'+result.codice+'</td>';
				clienteRow = clienteRow + '<td>'+result.ragioneSociale+'</td>';
				clienteRow = clienteRow + '<td>'+result.indirizzo+'</td>';
				clienteRow = clienteRow + '<td>'+result.citta+'</td>';
				clienteRow = clienteRow + '<td>'+result.provincia+'</td>';

				$('#clienteRow').append(clienteRow);

				if(result.estrazioneConad != null && result.estrazioneConad != undefined && result.estrazioneConad != ''){
					$('#codiceConad').attr('disabled',false);
				}

				$('#hiddenIdCliente').val(idCliente);
				$('#hiddenEstrazioneConad').val(result.estrazioneConad);
				$('#annullaClientePuntoConsegna').attr('href','cliente-punti-consegna.html?idCliente='+idCliente);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertClientePuntoConsegna').empty().append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

}

$.fn.getPuntiConsegna = function(idCliente){

	var nuovoLink = 'cliente-punti-consegna-new.html?idCliente='+idCliente;
	$('#nuovoLink').attr('href', nuovoLink);

	$('#clientiPuntiConsegnaTable').DataTable({
		"ajax": {
			"url": baseUrl + "clienti/"+idCliente+"/punti-consegna",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertClientePuntoConsegnaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei punti di consegna</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertClientePuntoConsegna').empty().append(alertContent);
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
			"emptyTable": "Nessun punto di consegna disponibile",
			"zeroRecords": "Nessun punto di consegna disponibile"
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
			{"name": "indirizzo", "data": "indirizzo"},
			{"name": "localita", "data": "localita"},
			{"name": "cap", "data": "cap"},
			{"name": "provincia", "data": "provincia"},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
					var links = '<a class="updateClientePuntoConsegna pr-2" data-id="'+data.id+'" href="cliente-punti-consegna-edit.html?idPuntoConsegna=' + data.id + '"><i class="far fa-edit"></i></a>';
					links = links + '<a class="deleteClientePuntoConsegna" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
					return links;
				}}
		]
	});
}

$.fn.getPuntoConsegna = function(idPuntoConsegna){

	var alertContent = '<div id="alertClientePuntoConsegnaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero del punto di consegna.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "punti-consegna/" + idPuntoConsegna,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var idCliente = result.cliente.id;
				$.fn.getClienteForPuntoConsegna(idCliente);

				$('#hiddenIdPuntoConsegna').attr('value', result.id);
				$('#hiddenIdCliente').attr('value', idCliente);

				$('#nome').attr('value', result.nome);
				$('#indirizzo').attr('value', result.indirizzo);
				$('#localita').attr('value', result.localita);
				$('#cap').attr('value', result.cap);
				$('#provincia option[value="' + result.provincia +'"]').attr('selected', true);
				$('#codiceConad').attr('value', result.codiceConad);

			} else{
				$('#alertClientePuntoConsegna').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertClientePuntoConsegna').empty().append(alertContent);
			$('#updateClientePuntoConsegnaButton').attr('disabled', true);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
