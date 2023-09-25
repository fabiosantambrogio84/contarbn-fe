var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#autistiTable').DataTable({
		"ajax": {
			"url": baseUrl + "autisti",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertAutistaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero degli autisti</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertAutista').empty().append(alertContent);
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
			"emptyTable": "Nessun autista disponibile",
			"zeroRecords": "Nessun autista disponibile"
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
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateAutista pr-2" data-id="'+data.id+'" href="autisti-edit.html?idAutista=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteAutista" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		],
		"createdRow": function(row, data, dataIndex,cells){
			if($.fn.checkVariableIsNull(data.attivo)){
				$(row).css('background-color', '#FCAFAF');
			}
		}
	});

	$(document).on('click','.deleteAutista', function(){
		var idAutista = $(this).attr('data-id');
		$('#confirmDeleteAutista').attr('data-id', idAutista);
		$('#deleteAutistaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteAutista', function(){
		$('#deleteAutistaModal').modal('hide');
		var idAutista = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "autisti/" + idAutista,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertAutistaContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Autista</strong> disabilitato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertAutista').empty().append(alertContent);

				$('#autistiTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
			}
		});
	});

	if($('#updateAutistaButton') != null && $('#updateAutistaButton') != undefined){
		$(document).on('submit','#updateAutistaForm', function(event){
			event.preventDefault();

			var autista = new Object();
			autista.id = $('#hiddenIdAutista').val();
			autista.nome = $('#nome').val();
			autista.cognome = $('#cognome').val();
			autista.telefono = $('#telefono').val();
			if($('#attivo').prop('checked') === true){
				autista.attivo = true;
			}else{
				autista.attivo = false;
			}

			var autistaJson = JSON.stringify(autista);

			var alertContent = '<div id="alertAutistaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "autisti/" + $('#hiddenIdAutista').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: autistaJson,
				success: function(result) {
					$('#alertAutista').empty().append(alertContent.replace('@@alertText@@','Autista modificato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the list of 'Autista' page
					setTimeout(function() {
						window.location.href = "autisti.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertAutista').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell\' autista').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newAutistaButton') != null && $('#newAutistaButton') != undefined){
		$(document).on('submit','#newAutistaForm', function(event){

			event.preventDefault();

			var autista = new Object();
			autista.nome = $('#nome').val();
			autista.cognome = $('#cognome').val();
			autista.telefono = $('#telefono').val();
			if($('#attivo').prop('checked') === true){
				autista.attivo = true;
			}else{
				autista.attivo = false;
			}

			var autistaJson = JSON.stringify(autista);

			var alertContent = '<div id="alertAutistaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "autisti",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: autistaJson,
				success: function(result) {
					$('#alertAutista').empty().append(alertContent.replace('@@alertText@@','Autista creato con successo').replace('@@alertResult@@', 'success'));

					// Returns to the list of 'Autista' page
					setTimeout(function() {
						window.location.href = "autisti.html";
					}, 1000);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertAutista').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dell\' autista').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdAutistaFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idAutista') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getAutista = function(idAutista){

	var alertContent = '<div id="alertAutistaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dell\' autista.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "autisti/" + idAutista,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdAutista').attr('value', result.id);
			$('#nome').attr('value', result.nome);
            $('#cognome').attr('value', result.cognome);
			$('#telefono').attr('value', result.telefono);
			if(result.attivo === true){
				$('#attivo').prop('checked', true);
			}

          } else{
            $('#alertAutista').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertAutista').empty().append(alertContent);
            $('#updateAutistaButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
