var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#unitaMisuraTable').DataTable({
		"ajax": {
			"url": baseUrl + "unita-misura",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertUnitaMisuraContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle unita di misura</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertUnitaMisura').empty().append(alertContent);
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
			"emptyTable": "Nessuna unita di misura disponibile",
			"zeroRecords": "Nessuna unita di misura disponibile"
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
			{"name": "etichetta", "data": "etichetta"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateUnitaMisura pr-2" data-id="'+data.id+'" href="unita-misura-edit.html?idUnitaMisura=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteUnitaMisura" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteUnitaMisura', function(){
		var idUnitaMisura = $(this).attr('data-id');
		$('#confirmDeleteUnitaMisura').attr('data-id', idUnitaMisura);
		$('#deleteUnitaMisuraModal').modal('show');
	});

	$(document).on('click','#confirmDeleteUnitaMisura', function(){
		$('#deleteUnitaMisuraModal').modal('hide');
		var idUnitaMisura = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "unita-misura/" + idUnitaMisura,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertUnitaMisuraContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Unita di misura</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertUnitaMisura').empty().append(alertContent);

				$('#unitaMisuraTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertUnitaMisuraContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione dell unita di misura' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertUnitaMisura').empty().append(alertContent);

                $('#unitaMisuraTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateUnitaMisuraButton') != null && $('#updateAliquotaIvaButton') != undefined){
		$(document).on('submit','#updateUnitaMisuraForm', function(event){
			event.preventDefault();

			var unitaMisura = new Object();
			unitaMisura.id = $('#hiddenIdUnitaMisura').val();
			unitaMisura.nome = $('#nome').val();
			unitaMisura.etichetta = $('#etichetta').val();

			var unitaMisuraJson = JSON.stringify(unitaMisura);

			var alertContent = '<div id="alertUnitMisuraContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "unita-misura/" + $('#hiddenIdUnitaMisura').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: unitaMisuraJson,
				success: function(result) {
					$('#alertUnitaMisura').empty().append(alertContent.replace('@@alertText@@','Unita di misura modificata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertUnitaMisura').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica dell unita di misura').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newUnitaMisuraButton') != null && $('#newUnitaMisuraButton') != undefined){
		$(document).on('submit','#newUnitaMisuraForm', function(event){
			event.preventDefault();

			var unitaMisura = new Object();
			unitaMisura.nome = $('#nome').val();
            unitaMisura.etichetta = $('#etichetta').val();

			var unitaMisuraJson = JSON.stringify(unitaMisura);

			var alertContent = '<div id="alertUnitaMisuraContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "unita-misura",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: unitaMisuraJson,
				success: function(result) {
					$('#alertUnitaMisura').empty().append(alertContent.replace('@@alertText@@','Unita di misura creata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertUnitaMisura').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione dell unita di misura').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdUnitaMisuraFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idUnitaMisura') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getUnitaMisura = function(idUnitaMisura){

	var alertContent = '<div id="alertUnitaMisuraContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero dell unita di misura.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "unita-misura/" + idUnitaMisura,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdUnitaMisura').attr('value', result.id);
			$('#nome').attr('value', result.nome);
			$('#etichetta').attr('value', result.etichetta);

          } else{
            $('#alertUnitaMisura').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertUnitaMisura').empty().append(alertContent);
            $('#updateUnitaMisuraButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
