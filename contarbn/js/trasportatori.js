//let baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#trasportatoriTable').DataTable({
		"ajax": {
			"url": baseUrl + "trasportatori",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);
				let alertContent = '<div id="alertTrasportatoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent += '<strong>Errore nel recupero dei trasportatori</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTrasportatore').empty().append(alertContent);
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
			"emptyTable": "Nessun trasportatore disponibile",
			"zeroRecords": "Nessun trasportatore disponibile"
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
			{"data": null, "orderable":false, "width":"8%", render: function ( data ) {
				let links = '<a class="updateTrasportatore pr-2" data-id="'+data.id+'" href="trasportatori-edit.html?idTrasportatore=' + data.id + '"><i class="far fa-edit"></i></a>';
				links += '<a class="deleteTrasportatore" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteTrasportatore', function(){
		$('#confirmDeleteTrasportatore').attr('data-id', $(this).attr('data-id'));
		$('#deleteTrasportatoreModal').modal('show');
	});

	$(document).on('click','#confirmDeleteTrasportatore', function(){
		$('#deleteTrasportatoreModal').modal('hide');

		$.ajax({
			url: baseUrl + "trasportatori/" + $(this).attr('data-id'),
			type: 'DELETE',
			success: function() {
				let alertContent = '<div id="alertTrasportatoreContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent += '<strong>Trasportatore</strong> cancellato con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertTrasportatore').empty().append(alertContent);

				$('#trasportatoriTable').DataTable().ajax.reload();
			},
			error: function(jqXHR) {
				console.log('Response text: ' + jqXHR.responseText);

				let alertContent = '<div id="alertTrasportatoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent += '<strong>Errore</strong> nella cancellazione del trasportatore' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertTrasportatore').empty().append(alertContent);

                $('#trasportatoriTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#newTrasportatoreButton') != null && $('#newTrasportatoreButton') !== undefined){
		$(document).on('submit','#newTrasportatoreForm', function(event){
			event.preventDefault();

			let trasportatore = {};
			trasportatore.nome = $('#nome').val();
			trasportatore.cognome = $('#cognome').val();
			trasportatore.telefono = $('#telefono').val();
			trasportatore.email = $('#email').val();
			trasportatore.indirizzo = $('#indirizzo').val();

			let alertContent = '<div id="alertTrasportatoreContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "trasportatori",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: JSON.stringify(trasportatore),
				success: function() {
					$('#alertTrasportatore').empty().append(alertContent.replace('@@alertText@@','Trasportatore creato con successo').replace('@@alertResult@@', 'success'));

					setTimeout(function() {
						window.location.href = "trasportatori.html";
					}, 2000);
				},
				error: function() {
					$('#alertTrasportatore').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione del trasportatore').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#updateTrasportatoreButton') != null && $('#updateTrasportatoreButton') !== undefined){
		$(document).on('submit','#updateTrasportatoreForm', function(event){
			event.preventDefault();

			let trasportatore = {};
			trasportatore.id = $('#hiddenIdTrasportatore').val();
			trasportatore.nome = $('#nome').val();
			trasportatore.cognome = $('#cognome').val();
			trasportatore.telefono = $('#telefono').val();
			trasportatore.email = $('#email').val();
			trasportatore.indirizzo = $('#indirizzo').val();

			let alertContent = '<div id="alertTrasportatoreContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent += '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "trasportatori/" + trasportatore.id,
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: JSON.stringify(trasportatore),
				success: function() {
					$('#alertTrasportatore').empty().append(alertContent.replace('@@alertText@@','Trasportatore modificato con successo').replace('@@alertResult@@', 'success'));

					setTimeout(function() {
						window.location.href = "trasportatori.html";
					}, 2000);
				},
				error: function() {
					$('#alertTrasportatore').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica del trasportatore').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

});

$.fn.getTrasportatore = function(idTrasportatore){

	let alertContent = '<div id="alertTrasportatoreContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent += '<strong>Errore nel recupero del trasportatore.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "trasportatori/" + idTrasportatore,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result !== ''){

			$('#hiddenIdTrasportatore').val(result.id);
			$('#nome').val(result.nome);
            $('#cognome').val(result.cognome);
            $('#telefono').val(result.telefono);
            $('#email').val(result.email);
            $('#indirizzo').val(result.indirizzo);

          } else{
            $('#alertTrasportatore').empty().append(alertContent);
          }
        },
        error: function(jqXHR) {
            $('#alertTrasportatore').empty().append(alertContent);
            $('#updateTrasportatoreButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
