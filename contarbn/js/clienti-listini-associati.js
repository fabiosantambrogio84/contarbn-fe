
var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$(document).on('click','.deleteClienteListinoAssociato', function(){
		var idClienteListinoAssociato = $(this).attr('data-id');
		$('#confirmDeleteClienteListinoAssociato').attr('data-id', idClienteListinoAssociato);
		$('#deleteClienteListinoAssociatoModal').modal('show');
	});

	$(document).on('click','#confirmDeleteClienteListinoAssociato', function(){
		$('#deleteClienteListinoAssociatoModal').modal('hide');
		var idClienteListinoAssociato = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "listini-associati/" + idClienteListinoAssociato,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertClienteListinoAssociatoContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Listino cliente</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertClienteListinoAssociato').empty().append(alertContent);

				$('#clientiListiniAssociatiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateClienteListinoAssociatoButton') != null && $('#updateClienteListinoAssociatoButton') != undefined){
		$(document).on('submit','#updateClienteListinoAssociatoForm', function(event){
			event.preventDefault();

			var listinoAssociato = new Object();
			listinoAssociato.id = $('#hiddenIdListinoAssociato').val();
			var cliente = new Object();
			cliente.id = $('#hiddenIdCliente').val();
			listinoAssociato.cliente = cliente;
			var fornitore = new Object();
			fornitore.id = $('#fornitore option:selected').val();
			listinoAssociato.fornitore = fornitore;
			var listino = new Object();
			listino.id = $('#listino option:selected').val();
			listinoAssociato.listino = listino;

			var listinoAssociatoJson = JSON.stringify(listinoAssociato);

			var alertContent = '<div id="alertClienteListinoAssociatoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "listini-associati/" + $('#hiddenIdListinoAssociato').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: listinoAssociatoJson,
				success: function(result) {
					$('#alertClienteListinoAssociato').empty().append(alertContent.replace('@@alertText@@','Listino associato modificato con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertClienteListinoAssociato').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del listino associato').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newClienteListinoAssociatoButton') != null && $('#newClienteListinoAssociatoButton') != undefined && $('#newClienteListinoAssociatoButton').length > 0){
		$('#fornitore').selectpicker();

		$(document).on('submit','#newClienteListinoAssociatoForm', function(event){
			event.preventDefault();

			var idCliente = $('#hiddenIdCliente').val();

			var cliente = new Object();
			cliente.id = idCliente;

			var listino = new Object();
			listino.id = $('#listino option:selected').val();

			var listiniAssociati = [];
			var fornitoriSelected = $('#fornitore').val();

			if(fornitoriSelected != null && fornitoriSelected.length != 0 && fornitoriSelected.indexOf('-1') == -1){
				// Ho selezionato alcuni fornitori escludendo l'opzione "Tutti i fornitori"
				$.each(fornitoriSelected, function(i, item){
					var listinoAssociato = new Object();
					listinoAssociato.cliente = cliente;
					listinoAssociato.listino = listino;

					var fornitore = new Object();
					fornitore.id = item;
					listinoAssociato.fornitore = fornitore;

					listiniAssociati.push(listinoAssociato);
				});

			} else {
				// Ho selezionato alcuni fornitori compresa l'opzione "Tutti i fornitori"
				var fornitori = [];
				$("#fornitore option").each(function(i, item){
					var idFornitore = item.value;
					if(idFornitore != '-1'){
						fornitori.push(idFornitore);
					}
				});
				$.each(fornitori, function(i, item){
					var listinoAssociato = new Object();
					listinoAssociato.cliente = cliente;
					listinoAssociato.listino = listino;

					var fornitore = new Object();
					fornitore.id = item;
					listinoAssociato.fornitore = fornitore;

					listiniAssociati.push(listinoAssociato);
				});

			}

			var listiniAssociatiJson = JSON.stringify(listiniAssociati);

			var alertContent = '<div id="alertClienteListinoAssociatoContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "listini-associati",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: listiniAssociatiJson,
				success: function(result) {
					$('#alertClienteListinoAssociato').empty().append(alertContent.replace('@@alertText@@','Listini associati con successo').replace('@@alertResult@@', 'success'));

					$('#newClienteListinoAssociatoButton').attr("disabled", true);

					// Returns to the page with the list
					setTimeout(function() {
						window.location.href = "cliente-listini-associati.html?idCliente="+idCliente;
					}, 2000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					var errorMessage = 'Errore nell associazione dei listini';
					if(jqXHR != null && jqXHR.responseJSON != null){
						var message = jqXHR.responseJSON.message;
						if(message.indexOf('associato al fornitore') != -1){
							errorMessage = message;
						}
					}
					$('#alertClienteListinoAssociato').empty().append(alertContent.replace('@@alertText@@',errorMessage).replace('@@alertResult@@', 'danger'));
				}
			});

		});
	}

	$(document).on('change','#fornitore', function(){
		var fornitoriSelected = $(this).val();
		if(fornitoriSelected != null && fornitoriSelected.length != 0){

			if(fornitoriSelected.indexOf('-1') != -1){
				// Ho selezionato l'opzione "Tutti i fornitori"
				$('#fornitore option[value != "-1"]').attr('disabled', true);
			}
		} else {
			// Non ho selezionato niente
			$('#fornitore option').removeAttr('disabled');
			$('#fornitore option').removeAttr('selected');
		}
		$('#fornitore').selectpicker('refresh');
	});
});

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
				var multipleAttr = $('#fornitore').attr('multiple');
				if(multipleAttr != null && multipleAttr != ''){
					$('#fornitore option[value != "-1"]').attr('disabled', true);
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.getListini = function(){
	$.ajax({
		url: baseUrl + "listini",
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				$.each(result, function(i, item){
					$('#listino').append('<option value="'+item.id+'">'+item.nome+'</option>');
				});
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}

$.fn.extractIdListinoAssociatoFromUrl = function(){
	var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
		paramNames,
		i;

	for (i = 0; i < urlVariables.length; i++) {
		paramNames = urlVariables[i].split('=');

		if (paramNames[0] === 'idListinoAssociato') {
			return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
		}
	}
}

$.fn.getClienteForListinoAssociato = function(idCliente){
	var alertContent = '<div id="alertClienteListinoAssociatoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
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

				$('#hiddenIdCliente').val(idCliente);
				$('#annullaClienteListinoAssociato').attr('href','cliente-listini-associati.html?idCliente='+idCliente);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertClienteListinoAssociato').empty().append(alertContent);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});

}

$.fn.getListiniAssociati = function(idCliente){

	var nuovoLink = 'cliente-listini-associati-new.html?idCliente='+idCliente;
	$('#nuovoLink').attr('href', nuovoLink);

	$('#clientiListiniAssociatiTable').DataTable({
		"ajax": {
			"url": baseUrl + "listini-associati",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertClienteListinoConsegnaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero dei listini associati</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertClienteListinoAssociato').empty().append(alertContent);
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
			"emptyTable": "Nessun listino associato disponibile",
			"zeroRecords": "Nessun listino associato disponibile"
		},
		"pageLength": 20,
		"lengthChange": false,
		"info": false,
		"autoWidth": false,
		"order": [
			[0, 'asc']
		],
		"columns": [
			{"name": "fornitore","data": null, render: function ( data, type, row ) {
				return data.fornitore.ragioneSociale;
			}},
			{"name": "listino","data": null, render: function ( data, type, row ) {
				return data.listino.nome;
			}},
			{"data": null, "orderable":false, "width":"10%", render: function ( data, type, row ) {
				var links = '<a class="updateClienteListinoAssociato pr-2" data-id="'+data.id+'" href="cliente-listini-associati-edit.html?idListinoAssociato=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteClienteListinoAssociato" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});
}

$.fn.getListinoAssociato = function(idListinoAssociato){

	var alertContent = '<div id="alertClienteListinoAssociatoContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero del listino associato.</strong>\n' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

	$.ajax({
		url: baseUrl + "listini-associati/" + idListinoAssociato,
		type: 'GET',
		dataType: 'json',
		success: function(result) {
			if(result != null && result != undefined && result != ''){
				var idCliente = result.cliente.id;
				$.fn.getClienteForListinoAssociato(idCliente);

				$('#hiddenIdListinoAssociato').attr('value', result.id);
				$('#hiddenIdCliente').attr('value', idCliente);

				$('#fornitore option[value="' + result.fornitore.id +'"]').attr('selected', true);
				$('#listino option[value="' + result.listino.id +'"]').attr('selected', true);

			} else{
				$('#alertClienteListinoAssociato').empty().append(alertContent);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$('#alertClienteListinoAssociato').empty().append(alertContent);
			$('#updateClienteListinoAssociatoButton').attr('disabled', true);
			console.log('Response text: ' + jqXHR.responseText);
		}
	});
}
