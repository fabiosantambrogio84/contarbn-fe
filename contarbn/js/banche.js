var baseUrl = "/contarbn-be/";

$(document).ready(function() {

	$('#bancheTable').DataTable({
		"ajax": {
			"url": baseUrl + "banche",
			"type": "GET",
			"content-type": "json",
			"cache": false,
			"dataSrc": "",
			"error": function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);
				var alertContent = '<div id="alertBancaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Errore nel recupero delle banche</strong>\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertBanca').empty().append(alertContent);
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
			"emptyTable": "Nessuna banca disponibile",
			"zeroRecords": "Nessuna banca disponibile"
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
			{"name": "abi", "data": "abi"},
			{"name": "cab", "data": "cab"},
			{"data": null, "orderable":false, "width":"8%", render: function ( data, type, row ) {
				var links = '<a class="updateBanca pr-2" data-id="'+data.id+'" href="banche-edit.html?idBanca=' + data.id + '"><i class="far fa-edit"></i></a>';
				links = links + '<a class="deleteBanca" data-id="'+data.id+'" href="#"><i class="far fa-trash-alt"></i></a>';
				return links;
			}}
		]
	});

	$(document).on('click','.deleteBanca', function(){
		var idBanca = $(this).attr('data-id');
		$('#confirmDeleteBanca').attr('data-id', idBanca);
		$('#deleteBancaModal').modal('show');
	});

	$(document).on('click','#confirmDeleteBanca', function(){
		$('#deleteBancaModal').modal('hide');
		var idBanca = $(this).attr('data-id');

		$.ajax({
			url: baseUrl + "banche/" + idBanca,
			type: 'DELETE',
			success: function() {
				var alertContent = '<div id="alertBancaContent" class="alert alert-success alert-dismissible fade show" role="alert">';
				alertContent = alertContent + '<strong>Banca</strong> cancellata con successo.\n' +
					'            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
				$('#alertBanca').empty().append(alertContent);

				$('#bancheTable').DataTable().ajax.reload();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Response text: ' + jqXHR.responseText);

				var alertContent = '<div id="alertBancaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
                alertContent = alertContent + '<strong>Errore</strong> nella cancellazione della banca' +
                    '            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alertBanca').empty().append(alertContent);

                $('#bancheTable').DataTable().ajax.reload();
			}
		});
	});

	if($('#updateBancaButton') != null && $('#updateBancaButton') != undefined){
		$(document).on('submit','#updateBancaForm', function(event){
			event.preventDefault();

			var banca = new Object();
			banca.id = $('#hiddenIdBanca').val();
			banca.nome = $('#nome').val();
			banca.abi = $('#abi').val();
			banca.cab = $('#cab').val();

			var bancaJson = JSON.stringify(banca);

			var alertContent = '<div id="alertBancaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "banche/" + $('#hiddenIdBanca').val(),
				type: 'PUT',
				contentType: "application/json",
				dataType: 'json',
				data: bancaJson,
				success: function(result) {
					$('#alertBanca').empty().append(alertContent.replace('@@alertText@@','Banca modificata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertBanca').empty().append(alertContent.replace('@@alertText@@','Errore nella modifica della banca').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}

	if($('#newBancaButton') != null && $('#newBancaButton') != undefined){
		$(document).on('submit','#newBancaForm', function(event){
			event.preventDefault();

			var banca = new Object();
			banca.nome = $('#nome').val();
			banca.abi = $('#abi').val();
			banca.cab = $('#cab').val();

			var bancaJson = JSON.stringify(banca);

			var alertContent = '<div id="alertBancaContent" class="alert alert-@@alertResult@@ alert-dismissible fade show" role="alert">';
			alertContent = alertContent + '<strong>@@alertText@@</strong>\n' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

			$.ajax({
				url: baseUrl + "banche",
				type: 'POST',
				contentType: "application/json",
				dataType: 'json',
				data: bancaJson,
				success: function(result) {
					$('#alertBanca').empty().append(alertContent.replace('@@alertText@@','Banca creata con successo').replace('@@alertResult@@', 'success'));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					$('#alertBanca').empty().append(alertContent.replace('@@alertText@@','Errore nella creazione della banca').replace('@@alertResult@@', 'danger'));
				}
			});
		});
	}
});

$.fn.extractIdBancaFromUrl = function(){
    var pageUrl = window.location.search.substring(1);

	var urlVariables = pageUrl.split('&'),
        paramNames,
        i;

    for (i = 0; i < urlVariables.length; i++) {
        paramNames = urlVariables[i].split('=');

        if (paramNames[0] === 'idBanca') {
        	return paramNames[1] === undefined ? null : decodeURIComponent(paramNames[1]);
        }
    }
}

$.fn.getBanca = function(idBanca){

	var alertContent = '<div id="alertBancaContent" class="alert alert-danger alert-dismissible fade show" role="alert">';
	alertContent = alertContent + '<strong>Errore nel recupero della banca.</strong>\n' +
    					'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

    $.ajax({
        url: baseUrl + "banche/" + idBanca,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          if(result != null && result != undefined && result != ''){

			$('#hiddenIdBanca').attr('value', result.id);
			$('#nome').attr('value', result.nome);
            $('#abi').attr('value', result.abi);
            $('#cab').attr('value', result.cab);

          } else{
            $('#alertBanca').empty().append(alertContent);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#alertBanca').empty().append(alertContent);
            $('#updateBancaButton').attr('disabled', true);
            console.log('Response text: ' + jqXHR.responseText);
        }
    });
}
